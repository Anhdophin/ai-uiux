from __future__ import annotations

import base64
import io
import json
import traceback
import zipfile
import tempfile
import subprocess
import re
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path, PurePosixPath
from copy import deepcopy
from urllib.parse import urlparse

from epub_parser import (
    TocItem,
    EpubBook,
    generate_export_payload_from_texts,
    normalize_text,
    parse_pasted_toc,
    parse_toc_item_payload,
    slugify,
    text_content_to_text_and_headings,
)

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = BASE_DIR / 'templates' / 'index.html'
STATIC_DIR = BASE_DIR / 'static'
HOST = '127.0.0.1'
PORT = 8765
TEXT_EXTENSIONS = {'.txt', '.md', '.html', '.htm'}
EBOOK_EXTENSIONS = {'.epub', '.mobi', '.azw', '.azw3', '.fb2'}
SUPPORTED_EXTENSIONS = TEXT_EXTENSIONS | EBOOK_EXTENSIONS
BLOCKED_EXTENSIONS = {'.pdf'}
PANDOC_INPUT_FORMATS = {'.epub': 'epub', '.fb2': 'fb2'}


def render_template() -> bytes:
    return TEMPLATE_PATH.read_text(encoding='utf-8').encode('utf-8')


def parse_multipart(headers, body: bytes):
    content_type = headers.get('Content-Type', '')
    if 'multipart/form-data' not in content_type or 'boundary=' not in content_type:
        raise ValueError('Sai định dạng upload.')
    boundary = content_type.split('boundary=', 1)[1].strip().strip('"')
    boundary_bytes = ('--' + boundary).encode('utf-8')
    fields = {}
    for part in body.split(boundary_bytes):
        part = part.strip()
        if not part or part == b'--':
            continue
        if part.startswith(b'\r\n'):
            part = part[2:]
        if part.endswith(b'--'):
            part = part[:-2]
        header_block, _, content = part.partition(b'\r\n\r\n')
        if not _:
            continue
        content = content.rstrip(b'\r\n')
        header_lines = header_block.decode('utf-8', errors='ignore').split('\r\n')
        part_headers = {}
        for line in header_lines:
            if ':' in line:
                k, v = line.split(':', 1)
                part_headers[k.strip().lower()] = v.strip()
        disposition = part_headers.get('content-disposition', '')
        attrs = {}
        for frag in disposition.split(';'):
            frag = frag.strip()
            if '=' in frag:
                k, v = frag.split('=', 1)
                attrs[k.strip()] = v.strip().strip('"')
        name = attrs.get('name')
        filename = attrs.get('filename')
        if not name:
            continue
        if filename is not None:
            fields[name] = {'filename': filename, 'content': content}
        else:
            fields[name] = content.decode('utf-8', errors='ignore')
    return fields


def detect_text_encoding(raw: bytes) -> str:
    for enc in ('utf-8', 'utf-8-sig', 'cp1252', 'latin-1'):
        try:
            raw.decode(enc)
            return enc
        except UnicodeDecodeError:
            continue
    return 'utf-8'


def decode_text(raw: bytes) -> str:
    return raw.decode(detect_text_encoding(raw), errors='ignore')




def run_pandoc_to_plain(src_path: Path, input_format: str) -> str:
    cmd = ['pandoc', '--from', input_format, '--to', 'plain', str(src_path)]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if result.returncode != 0:
        raise ValueError((result.stderr or 'Pandoc chuyển đổi thất bại.').strip())
    return result.stdout


def extract_binary_text_segments(raw: bytes) -> str:
    segments = []
    ascii_matches = re.findall(rb'[ -~\t\r\n]{40,}', raw)
    for chunk in ascii_matches[:2000]:
        part = chunk.decode('utf-8', errors='ignore').strip()
        if len(part) >= 20:
            segments.append(part)
    try:
        utf16_matches = re.findall(rb'(?:[\x20-\x7E]\x00){20,}', raw)
        for chunk in utf16_matches[:1000]:
            part = chunk.decode('utf-16-le', errors='ignore').strip()
            if len(part) >= 20:
                segments.append(part)
    except Exception:
        pass
    deduped = []
    seen = set()
    for seg in segments:
        norm = seg.lower()
        if norm in seen:
            continue
        seen.add(norm)
        deduped.append(seg)
    text = '\n\n'.join(deduped)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def convert_ebook_bytes_to_text(filename: str, raw_bytes: bytes, suffix: str) -> tuple[str, str]:
    with tempfile.TemporaryDirectory() as td:
        src_path = Path(td) / Path(filename).name
        src_path.write_bytes(raw_bytes)
        if suffix in PANDOC_INPUT_FORMATS:
            try:
                text = run_pandoc_to_plain(src_path, PANDOC_INPUT_FORMATS[suffix])
                if text and text.strip():
                    return text, 'pandoc'
            except Exception:
                # fallback phía dưới
                pass
        # EPUB lỗi cấu trúc, MOBI / AZW / AZW3: best-effort binary extraction
        text = extract_binary_text_segments(raw_bytes)
        if len(text) < 500:
            raise ValueError(
                'File ebook này chưa trích text đủ tốt. EPUB lỗi cấu trúc hoặc MOBI/AZW/AZW3 phức tạp có thể cần đổi sang EPUB/TXT trước khi nạp vào app.'
            )
        return text, 'binary-extract'


def build_text_entry(order: int, href: str, display_name: str, text: str, suffix: str) -> dict:
    clean_text, headings = text_content_to_text_and_headings(text, suffix if suffix in TEXT_EXTENSIONS else '.txt')
    return {
        'order': order,
        'href': PurePosixPath(href).as_posix(),
        'full_path': PurePosixPath(href).as_posix(),
        'file_name': f"{order:03d}-{slugify(Path(display_name).stem)}.txt",
        'text': clean_text,
        'headings': headings,
    }


def parse_text_entries(filename: str, raw_bytes: bytes):
    suffix = Path(filename).suffix.lower()
    if suffix in BLOCKED_EXTENSIONS:
        raise ValueError('Tool này không nhận file PDF. Anh hãy đổi PDF ra TXT/MD/HTML/EPUB/MOBI trước rồi nạp vào app.')

    entries = []
    source_label = 'text'
    toc_items = []

    if suffix == '.zip':
        source_label = 'zip'
        with zipfile.ZipFile(io.BytesIO(raw_bytes)) as zf:
            for info in sorted(zf.infolist(), key=lambda x: x.filename.lower()):
                if info.is_dir():
                    continue
                inner_name = info.filename
                inner_suffix = Path(inner_name).suffix.lower()
                if inner_suffix in BLOCKED_EXTENSIONS:
                    raise ValueError('Trong file ZIP có PDF. Tool này không nhận PDF.')
                if inner_suffix not in SUPPORTED_EXTENSIONS:
                    continue
                inner_bytes = zf.read(info)
                if inner_suffix == '.epub':
                    try:
                        epub_book = EpubBook(Path(inner_name).name, inner_bytes)
                        epub_entries = epub_book.extract_spine_texts()
                        if epub_entries:
                            for item in epub_entries:
                                item['order'] = len(entries) + 1
                                item['file_name'] = f"{len(entries) + 1:03d}-{slugify(Path(item['file_name']).stem)}.txt"
                                entries.append(item)
                            toc_items.extend(epub_book.get_nav_toc())
                            continue
                    except zipfile.BadZipFile:
                        pass
                    text, _method = convert_ebook_bytes_to_text(inner_name, inner_bytes, inner_suffix)
                    entries.append(build_text_entry(len(entries) + 1, inner_name, inner_name, text, '.txt'))
                elif inner_suffix in TEXT_EXTENSIONS:
                    text = decode_text(inner_bytes)
                    entries.append(build_text_entry(len(entries) + 1, inner_name, inner_name, text, inner_suffix))
                else:
                    text, _method = convert_ebook_bytes_to_text(inner_name, inner_bytes, inner_suffix)
                    entries.append(build_text_entry(len(entries) + 1, inner_name, inner_name, text, '.txt'))
    elif suffix == '.epub':
        source_label = 'epub'
        try:
            epub_book = EpubBook(filename, raw_bytes)
            book = epub_book.metadata | {'source_type': source_label}
            entries = epub_book.extract_spine_texts()
            toc_items = epub_book.get_nav_toc()
            if entries:
                return book, entries, toc_items
        except zipfile.BadZipFile:
            pass
        text, _method = convert_ebook_bytes_to_text(filename, raw_bytes, suffix)
        entries.append(build_text_entry(1, filename, filename, text, '.txt'))
    elif suffix in TEXT_EXTENSIONS:
        text = decode_text(raw_bytes)
        entries.append(build_text_entry(1, filename, filename, text, suffix))
    elif suffix in EBOOK_EXTENSIONS:
        source_label = suffix.lstrip('.')
        text, _method = convert_ebook_bytes_to_text(filename, raw_bytes, suffix)
        entries.append(build_text_entry(1, filename, filename, text, '.txt'))
    else:
        raise ValueError('Tool này nhận TXT, MD, HTML, EPUB, MOBI, AZW, AZW3, FB2 hoặc ZIP chứa các file đó.')

    if not entries:
        raise ValueError('Không tìm thấy file text hoặc ebook hợp lệ trong dữ liệu đã nạp.')

    book_id = slugify(Path(filename).stem)
    book = {
        'title': normalize_text(Path(filename).stem.replace('_', ' ').replace('-', ' ')),
        'author': '',
        'language': '',
        'identifier': '',
        'source_filename': filename,
        'book_id': book_id,
        'source_type': source_label,
    }
    return book, entries, toc_items


class AppHandler(BaseHTTPRequestHandler):
    server_version = 'TextMetadataTool/2.1'

    def _send_bytes(self, data: bytes, content_type: str = 'text/plain; charset=utf-8', status: int = 200, headers=None):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        if headers:
            for k, v in headers.items():
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def _send_json(self, payload, status: int = 200):
        data = json.dumps(payload, ensure_ascii=False, indent=2).encode('utf-8')
        self._send_bytes(data, 'application/json; charset=utf-8', status=status)

    def _send_error_json(self, message: str, status: int = 400, details: str = ''):
        self._send_json({'ok': False, 'error': message, 'details': details}, status=status)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path == '/':
            self._send_bytes(render_template(), 'text/html; charset=utf-8')
            return
        if path.startswith('/static/'):
            file_path = STATIC_DIR / path.removeprefix('/static/')
            if file_path.is_file():
                ctype = 'text/plain; charset=utf-8'
                if file_path.suffix == '.css':
                    ctype = 'text/css; charset=utf-8'
                elif file_path.suffix == '.js':
                    ctype = 'application/javascript; charset=utf-8'
                elif file_path.suffix == '.json':
                    ctype = 'application/json; charset=utf-8'
                self._send_bytes(file_path.read_bytes(), ctype)
                return
        self._send_error_json('Không tìm thấy đường dẫn.', status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == '/analyze':
            self.handle_analyze()
            return
        if parsed.path == '/export':
            self.handle_export()
            return
        self._send_error_json('Không tìm thấy API.', status=404)

    def handle_analyze(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
            body = self.rfile.read(length)
            form = parse_multipart(self.headers, body)
            file_item = form.get('epub')
            toc_text = form.get('toc_text', '')
            roles_json = form.get('roles_json', '[]')
            toc_items_json = form.get('toc_items_json', '[]')
            if not file_item:
                self._send_error_json('Chưa có file ebook hoặc text.')
                return
            raw_bytes = file_item['content']
            filename = file_item.get('filename') or 'book.txt'
            roles = [str(x).strip() for x in json.loads(roles_json) if str(x).strip()]
            existing_toc_items = json.loads(toc_items_json)
            book, text_files, detected_toc_items = parse_text_entries(filename, raw_bytes)
            if existing_toc_items:
                pasted_items = parse_toc_item_payload(existing_toc_items, roles)
            elif toc_text.strip():
                pasted_items = parse_pasted_toc(toc_text, roles)
            else:
                pasted_items = detected_toc_items
            payload = {
                'ok': True,
                'book': book,
                'epub_toc': [asdict(item) for item in detected_toc_items],
                'pasted_toc': [asdict(item) for item in pasted_items],
                'roles': roles,
                'text_files': [
                    {
                        'file_name': part['file_name'],
                        'order': part['order'],
                        'href': part['href'],
                        'heading_count': len(part['headings']),
                        'preview': part['text'][:500],
                    }
                    for part in text_files
                ],
                'upload_name': filename,
            }
            self._send_json(payload)
        except Exception:
            self._send_error_json('Không phân tích được file ebook/text.', details=traceback.format_exc())

    def handle_export(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
            raw = self.rfile.read(length)
            payload = json.loads(raw.decode('utf-8'))
            filename = payload.get('filename', 'book.txt')
            file_b64 = payload.get('epub_bytes_b64', '')
            toc_items_raw = payload.get('toc_items', [])
            role_options = [str(x) for x in payload.get('role_options', []) if str(x).strip()]
            metadata_overrides = payload.get('metadata_overrides', {}) or {}
            metadata_presets = payload.get('metadata_presets', {}) or {}
            raw_bytes = base64.b64decode(file_b64)
            book, text_files, detected_toc_items = parse_text_entries(filename, raw_bytes)
            merged_book = deepcopy(book)
            title_override = str(metadata_overrides.get('title', '')).strip()
            author_override = str(metadata_overrides.get('author', '')).strip()
            language_override = str(metadata_overrides.get('language', '')).strip()
            groups_override = sorted({str(x).strip() for x in metadata_overrides.get('groups', []) if str(x).strip()})
            topics_override = sorted({str(x).strip() for x in metadata_overrides.get('topics', []) if str(x).strip()})
            series_override = str(metadata_overrides.get('series', '')).strip()
            if title_override:
                merged_book['title'] = title_override
            if author_override:
                merged_book['author'] = author_override
            if language_override:
                merged_book['language'] = language_override
            merged_book['group'] = groups_override
            merged_book['topics'] = topics_override
            merged_book['series'] = series_override
            toc_items = parse_toc_item_payload(toc_items_raw, role_options)
            export_payload = generate_export_payload_from_texts(merged_book, text_files, toc_items, role_options)
            export_payload['metadata']['filter_presets'] = {
                'groups': sorted({str(x).strip() for x in metadata_presets.get('groups', []) if str(x).strip()}),
                'topics': sorted({str(x).strip() for x in metadata_presets.get('topics', []) if str(x).strip()}),
                'authors': sorted({str(x).strip() for x in metadata_presets.get('authors', []) if str(x).strip()}),
                'series': sorted({str(x).strip() for x in metadata_presets.get('series', []) if str(x).strip()}),
            }
            mem = io.BytesIO()
            with zipfile.ZipFile(mem, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
                zf.writestr('metadata/metadata.json', json.dumps(export_payload['metadata'], ensure_ascii=False, indent=2))
                zf.writestr('metadata/filter-presets.json', json.dumps(export_payload['metadata']['filter_presets'], ensure_ascii=False, indent=2))
                for text_item in export_payload['texts']:
                    zf.writestr(f"texts/{text_item['file_name']}", text_item['text'])
                zf.writestr('README_EXPORT.txt', (
                    'Gói export gồm:\n'
                    '- metadata/metadata.json\n'
                    '- metadata/filter-presets.json\n'
                    '- texts/*.txt\n\n'
                    'Metadata book đã có thêm group, topics, author, series để reader dùng cho filter.\n'
                    'App đồng thời lưu preset filter trong local storage và trong file filter-presets.json.\n'
                ))
            zip_bytes = mem.getvalue()
            out_name = f"{book['book_id']}-metadata-export.zip"
            self._send_json({
                'ok': True,
                'file_name': out_name,
                'zip_base64': base64.b64encode(zip_bytes).decode('ascii'),
            })
        except Exception:
            self._send_error_json('Không export được dữ liệu ebook/text.', details=traceback.format_exc())


def main():
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f'Mở trình duyệt tại http://{HOST}:{PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nĐã dừng server.')


if __name__ == '__main__':
    main()
