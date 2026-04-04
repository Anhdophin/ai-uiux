from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DOWNLOAD_DIR = ROOT / 'DownloadLibrary'
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}
PDF_EXT = '.pdf'

def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r'[^a-z0-9\s-]', '', value)
    value = re.sub(r'[\s_-]+', '-', value)
    return value.strip('-') or 'download-item'

def sort_key(path: Path):
    return path.name.lower()

def first_cover(files):
    for file in sorted(files, key=sort_key):
        if file.suffix.lower() in IMAGE_EXTS:
            return file.name
    return ''

def pdf_files(files):
    return [file for file in sorted(files, key=sort_key) if file.suffix.lower() == PDF_EXT]

def build_item(folder: Path):
    files = [p for p in folder.iterdir() if p.is_file()]
    pdfs = pdf_files(files)
    if not pdfs:
        return None
    title = folder.name.replace('-', ' ').replace('_', ' ').strip() or folder.name
    return {
        'id': slugify(folder.name),
        'title': title,
        'author': 'Tài liệu tải về',
        'folder': folder.name,
        'cover': first_cover(files),
        'description': f'{len(pdfs)} file PDF sẵn tải về' if len(pdfs) > 1 else '1 file PDF sẵn tải về',
        'files': [
            {
                'name': pdf.name,
                'label': 'PDF',
                'size': pdf.stat().st_size,
            }
            for pdf in pdfs
        ],
        'updatedAt': max(int(pdf.stat().st_mtime * 1000) for pdf in pdfs),
    }

def main():
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    books = []
    for entry in sorted(DOWNLOAD_DIR.iterdir(), key=sort_key):
        if not entry.is_dir():
            continue
        item = build_item(entry)
        if item:
            books.append(item)
    out = {'books': books}
    out_path = DOWNLOAD_DIR / 'index.json'
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Updated: {out_path}')
    print(f'Total download items: {len(books)}')

if __name__ == '__main__':
    main()
