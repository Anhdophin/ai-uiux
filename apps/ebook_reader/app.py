from __future__ import annotations
import json
import mimetypes
import re
import shutil
import urllib.parse
import zipfile
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = '127.0.0.1'
PORT = 8766
ROOT = Path(__file__).resolve().parent
CACHE_DIR = ROOT / '.cache'
CACHE_DIR.mkdir(parents=True, exist_ok=True)
CACHE_FILE = CACHE_DIR / 'library-index.json'
LIBRARY_DIR = ROOT / 'library'
BOOKS_DIR = LIBRARY_DIR / 'books'
ZIPS_DIR = LIBRARY_DIR / 'zips'
FONTS_DIR = LIBRARY_DIR / 'fonts'

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}
FONT_EXTENSIONS = {'.ttf', '.otf', '.woff', '.woff2'}


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r'[^\w\s-]', '', value, flags=re.UNICODE)
    value = re.sub(r'[-\s]+', '-', value, flags=re.UNICODE)
    return value.strip('-') or 'book'


def safe_stem(path: Path) -> str:
    return slugify(path.stem) or slugify(path.name)


def extract_missing_books() -> None:
    BOOKS_DIR.mkdir(parents=True, exist_ok=True)
    ZIPS_DIR.mkdir(parents=True, exist_ok=True)
    for zip_path in sorted(ZIPS_DIR.glob('*.zip')):
        # Nếu đã có folder nào ghi nhận đúng source zip này thì bỏ qua.
        matched_existing = False
        for folder in BOOKS_DIR.iterdir():
            if not folder.is_dir():
                continue
            source_file = folder / '.source_zip'
            if source_file.exists() and source_file.read_text(encoding='utf-8', errors='ignore').strip() == zip_path.name:
                matched_existing = True
                break
        if matched_existing:
            continue

        # Ưu tiên tên folder theo stem gốc; nếu trùng thì mới dùng slug an toàn.
        preferred_folders = [BOOKS_DIR / zip_path.stem, BOOKS_DIR / safe_stem(zip_path)]
        folder = None
        for candidate in preferred_folders:
            if candidate.exists() and any(candidate.iterdir()):
                folder = candidate
                break
        if folder is None:
            folder = preferred_folders[0]
            suffix = 2
            while folder.exists() and any(folder.iterdir()):
                folder = BOOKS_DIR / f'{preferred_folders[1].name}-{suffix}'
                suffix += 1
            folder.mkdir(parents=True, exist_ok=True)
            with zipfile.ZipFile(zip_path, 'r') as archive:
                archive.extractall(folder)
            (folder / '.source_zip').write_text(zip_path.name, encoding='utf-8')


def relative_url(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    version = int(path.stat().st_mtime)
    return f'/{rel}?v={version}'


def find_cover(folder: Path) -> str:
    covers = []
    for child in folder.iterdir():
        if child.is_file() and child.suffix.lower() in IMAGE_EXTENSIONS:
            covers.append(child)
    preferred = ['cover.jpg', 'cover.jpeg', 'cover.png', 'cover.webp', 'cover.avif', 'cover.gif']
    lower_map = {c.name.lower(): c for c in covers}
    for name in preferred:
        if name in lower_map:
            return relative_url(lower_map[name])
    if covers:
        return relative_url(sorted(covers, key=lambda p: p.name.lower())[0])
    return ''


def summarize_book(text_count: int, chapter_count: int) -> str:
    parts = []
    if chapter_count:
        parts.append(f'{chapter_count} chương')
    if text_count:
        parts.append(f'{text_count} file text')
    return ' · '.join(parts) if parts else 'Ebook local'


def build_book_item(folder: Path) -> dict | None:
    meta_path = folder / 'metadata' / 'metadata.json'
    texts_dir = folder / 'texts'
    if not meta_path.exists() or not texts_dir.exists():
        return None
    try:
        data = json.loads(meta_path.read_text(encoding='utf-8'))
    except Exception:
        return None

    book = data.get('book') or {}
    toc_items = data.get('toc_items') or []
    text_files = data.get('text_files') or []

    normalized_text_files = []
    existing_names = []
    for entry in text_files:
        if not isinstance(entry, dict):
            continue
        name = str(entry.get('file_name') or entry.get('file') or '').strip()
        if not name:
            continue
        if not (texts_dir / name).exists():
            continue
        normalized_text_files.append({
            'file_name': name,
            'order': entry.get('order', 0),
            'href': entry.get('href', ''),
            'headings': entry.get('headings', []),
        })
        existing_names.append(name)

    if not normalized_text_files:
        return None

    chapter_count = len([item for item in toc_items if isinstance(item, dict) and item.get('matched_file')])
    folder_name = folder.name
    identifier = str(book.get('identifier') or folder_name)
    return {
        'id': slugify(folder_name),
        'folderName': folder_name,
        'title': str(book.get('title') or folder_name).strip(),
        'author': str(book.get('author') or 'Unknown').strip(),
        'language': str(book.get('language') or '').strip(),
        'identifier': identifier,
        'bookId': str(book.get('book_id') or '').strip(),
        'sourceFilename': str(book.get('source_filename') or '').strip(),
        'description': summarize_book(len(normalized_text_files), chapter_count),
        'cover': find_cover(folder),
        'metadataPath': relative_url(meta_path),
        'textsBase': f'/library/books/{urllib.parse.quote(folder_name)}/texts/',
        'firstText': existing_names[0],
        'tocCount': len(toc_items),
        'chapterCount': chapter_count,
        'textCount': len(normalized_text_files),
        'tocItems': toc_items,
        'textFiles': normalized_text_files,
    }


def scan_fonts() -> list[dict]:
    if not FONTS_DIR.exists():
        return []
    items = []
    for font in sorted(FONTS_DIR.iterdir(), key=lambda p: p.name.lower()):
        if not font.is_file() or font.suffix.lower() not in FONT_EXTENSIONS:
            continue
        items.append({
            'id': slugify(font.stem),
            'name': font.stem,
            'file': font.name,
            'url': relative_url(font),
        })
    return items


def build_library_index() -> dict:
    extract_missing_books()
    books = []
    if BOOKS_DIR.exists():
        for folder in sorted(BOOKS_DIR.iterdir(), key=lambda p: p.name.lower()):
            if not folder.is_dir():
                continue
            item = build_book_item(folder)
            if item:
                books.append(item)
    payload = {
        'brand': {
            'name': 'Anhdophin Ebook Reader',
            'tagline': 'PWA đọc ebook local, mobile-first, icon-first',
            'homeUrl': 'https://anhdophin.github.io/Anhdophin-AI-Translator-Home-Site/',
        },
        'library': {
            'count': len(books),
            'books': books,
        },
        'fonts': scan_fonts(),
    }
    CACHE_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    return payload


class AppHandler(SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/library-index':
            payload = build_library_index()
            body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

    def translate_path(self, path: str) -> str:
        parsed = urllib.parse.urlparse(path)
        clean_path = parsed.path
        translated = super().translate_path(clean_path)
        return translated

    def guess_type(self, path: str) -> str:
        mime = super().guess_type(path)
        if path.endswith('.webmanifest'):
            return 'application/manifest+json'
        return mime


def main() -> None:
    build_library_index()
    handler = partial(AppHandler, directory=str(ROOT))
    server = ThreadingHTTPServer((HOST, PORT), handler)
    print(f'Serving Ebook Reader at http://{HOST}:{PORT}')
    print('Static root:', ROOT)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
