from __future__ import annotations

import io
import re
import zipfile
from dataclasses import dataclass, asdict
from html import unescape
from pathlib import PurePosixPath
from typing import Dict, List, Tuple
from urllib.parse import unquote
import xml.etree.ElementTree as ET

DC_NS = {'dc': 'http://purl.org/dc/elements/1.1/'}
CONTAINER_NS = {'c': 'urn:oasis:names:tc:opendocument:xmlns:container'}
XHTML_NS = {'xhtml': 'http://www.w3.org/1999/xhtml'}
NCX_NS = {'ncx': 'http://www.daisy.org/z3986/2005/ncx/'}
OPF_NS = {'opf': 'http://www.idpf.org/2007/opf'}
CHAPTER_RE = re.compile(r'^(?:ch(?:apter)?|chương|chuong|phần|phan|part|section)\s*([0-9ivxlcdm]+)\b', re.IGNORECASE)


def slugify(text: str) -> str:
    text = unquote(text)
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF]+', '-', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text or 'item'


def normalize_text(text: str) -> str:
    text = unescape(text)
    text = text.replace('\xa0', ' ')
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def detect_chapter_number(text: str) -> str:
    clean = normalize_text(text)
    match = CHAPTER_RE.match(clean)
    return match.group(1) if match else ''


def infer_role_for_title(title: str, role_options: List[str]) -> str:
    chapter_no = detect_chapter_number(title)
    if not chapter_no:
        return ''
    lowered = [str(role).strip().lower() for role in role_options if str(role).strip()]
    for candidate in ('chapter', 'chuong', 'chương'):
        if candidate in lowered:
            return role_options[lowered.index(candidate)]
    return 'chapter'


@dataclass
class TocItem:
    title: str
    href: str = ''
    level: int = 1
    role: str = ''
    matched_file: str = ''
    matched_heading: str = ''
    chapter_number: str = ''


class EpubBook:
    def __init__(self, filename: str, raw_bytes: bytes):
        self.filename = filename
        self.raw_bytes = raw_bytes
        self.zf = zipfile.ZipFile(io.BytesIO(raw_bytes))
        self.opf_path = self._get_opf_path()
        self.opf_dir = str(PurePosixPath(self.opf_path).parent)
        self.opf_root = ET.fromstring(self.zf.read(self.opf_path))
        self.manifest = self._parse_manifest()
        self.spine = self._parse_spine()
        self.metadata = self._parse_metadata()

    def _get_opf_path(self) -> str:
        root = ET.fromstring(self.zf.read('META-INF/container.xml'))
        el = root.find('.//c:rootfile', CONTAINER_NS)
        if el is None:
            raise ValueError('Không tìm thấy OPF trong EPUB.')
        return el.attrib['full-path']

    def _parse_manifest(self) -> Dict[str, Dict[str, str]]:
        manifest = {}
        for item in self.opf_root.findall('.//opf:manifest/opf:item', OPF_NS):
            manifest[item.attrib.get('id', '')] = {
                'href': item.attrib.get('href', ''),
                'media-type': item.attrib.get('media-type', ''),
                'properties': item.attrib.get('properties', ''),
            }
        return manifest

    def _parse_spine(self) -> List[str]:
        ids = []
        for itemref in self.opf_root.findall('.//opf:spine/opf:itemref', OPF_NS):
            idref = itemref.attrib.get('idref')
            if idref:
                ids.append(idref)
        return ids

    def _parse_metadata(self) -> Dict[str, str]:
        title = self._first_text('.//dc:title') or PurePosixPath(self.filename).stem
        creator = self._first_text('.//dc:creator') or ''
        language = self._first_text('.//dc:language') or ''
        identifier = self._first_text('.//dc:identifier') or ''
        return {
            'title': normalize_text(title),
            'author': normalize_text(creator),
            'language': normalize_text(language),
            'identifier': normalize_text(identifier),
            'source_filename': self.filename,
            'book_id': slugify(PurePosixPath(self.filename).stem),
        }

    def _first_text(self, path: str) -> str:
        el = self.opf_root.find(path, DC_NS)
        return el.text if el is not None and el.text else ''

    def resolve_href(self, href: str) -> str:
        href = href.split('#', 1)[0]
        if not href:
            return ''
        base = PurePosixPath(self.opf_dir) if self.opf_dir != '.' else PurePosixPath('')
        return str((base / href).as_posix())

    def get_nav_toc(self) -> List[TocItem]:
        nav_item = None
        for item in self.manifest.values():
            props = item.get('properties', '')
            if 'nav' in props.split():
                nav_item = item
                break
        if nav_item:
            path = self.resolve_href(nav_item['href'])
            return self._parse_nav_xhtml(path)
        ncx_item = None
        for item in self.manifest.values():
            media_type = item.get('media-type', '')
            if media_type == 'application/x-dtbncx+xml' or item.get('href', '').lower().endswith('.ncx'):
                ncx_item = item
                break
        if ncx_item:
            path = self.resolve_href(ncx_item['href'])
            return self._parse_ncx(path)
        return []

    def _parse_nav_xhtml(self, path: str) -> List[TocItem]:
        try:
            root = ET.fromstring(self.zf.read(path))
        except KeyError:
            return []
        nav = None
        for candidate in root.findall('.//xhtml:nav', XHTML_NS):
            epub_type = candidate.attrib.get('{http://www.idpf.org/2007/ops}type', '') or candidate.attrib.get('epub:type', '')
            if epub_type == 'toc' or 'toc' in candidate.attrib.get('role', ''):
                nav = candidate
                break
        if nav is None:
            nav = root.find('.//xhtml:nav', XHTML_NS)
        if nav is None:
            return []
        items: List[TocItem] = []
        ol = nav.find('.//xhtml:ol', XHTML_NS)
        if ol is None:
            return items

        def walk(list_el: ET.Element, level: int):
            for li in list_el.findall('xhtml:li', XHTML_NS):
                a = li.find('xhtml:a', XHTML_NS)
                span = li.find('xhtml:span', XHTML_NS)
                node = a if a is not None else span
                label = normalize_text(''.join(node.itertext())) if node is not None else ''
                href = a.attrib.get('href', '') if a is not None else ''
                if label:
                    items.append(TocItem(title=label, href=href, level=level, chapter_number=detect_chapter_number(label)))
                child_ol = li.find('xhtml:ol', XHTML_NS)
                if child_ol is not None:
                    walk(child_ol, level + 1)
        walk(ol, 1)
        return items

    def _parse_ncx(self, path: str) -> List[TocItem]:
        try:
            root = ET.fromstring(self.zf.read(path))
        except KeyError:
            return []
        items: List[TocItem] = []

        def walk(parent: ET.Element, level: int):
            for np in parent.findall('ncx:navPoint', NCX_NS):
                label_el = np.find('ncx:navLabel/ncx:text', NCX_NS)
                content_el = np.find('ncx:content', NCX_NS)
                label = normalize_text(label_el.text if label_el is not None and label_el.text else '')
                href = content_el.attrib.get('src', '') if content_el is not None else ''
                if label:
                    items.append(TocItem(title=label, href=href, level=level, chapter_number=detect_chapter_number(label)))
                walk(np, level + 1)
        navmap = root.find('.//ncx:navMap', NCX_NS)
        if navmap is not None:
            walk(navmap, 1)
        return items

    def extract_spine_texts(self) -> List[Dict[str, str]]:
        out = []
        for index, idref in enumerate(self.spine, start=1):
            item = self.manifest.get(idref)
            if not item:
                continue
            href = item.get('href', '')
            media_type = item.get('media-type', '')
            if media_type not in ('application/xhtml+xml', 'text/html') and not href.lower().endswith(('.xhtml', '.html', '.htm')):
                continue
            full_path = self.resolve_href(href)
            try:
                raw = self.zf.read(full_path)
            except KeyError:
                continue
            text, headings = xhtml_to_text_and_headings(raw)
            name = f"{index:03d}-{slugify(PurePosixPath(href).stem)}.txt"
            out.append({
                'order': index,
                'idref': idref,
                'href': href,
                'full_path': full_path,
                'file_name': name,
                'text': text,
                'headings': headings,
            })
        return out


def xhtml_to_text_and_headings(raw: bytes) -> Tuple[str, List[Dict[str, str]]]:
    try:
        root = ET.fromstring(raw)
    except ET.ParseError:
        text = normalize_text(raw.decode('utf-8', errors='ignore'))
        return text, []
    body = root.find('.//xhtml:body', XHTML_NS)
    if body is None:
        body = root

    blocks = []
    headings: List[Dict[str, str]] = []

    def tag_name(el: ET.Element) -> str:
        return el.tag.split('}')[-1].lower()

    for el in body.iter():
        tag = tag_name(el)
        if tag in {'script', 'style'}:
            continue
        txt = normalize_text(''.join(el.itertext()))
        if not txt:
            continue
        if tag in {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}:
            level = int(tag[1])
            headings.append({'title': txt, 'level': level})
            blocks.append(txt.upper() if level <= 2 else txt)
        elif tag in {'p', 'div', 'blockquote', 'li'}:
            blocks.append(txt)
    deduped = []
    prev = None
    for block in blocks:
        if block != prev:
            deduped.append(block)
        prev = block
    return '\n\n'.join(deduped).strip(), headings


def parse_pasted_toc(text: str, role_options: List[str] | None = None) -> List[TocItem]:
    role_options = role_options or []
    items: List[TocItem] = []
    for raw_line in text.splitlines():
        if not raw_line.strip():
            continue
        indent_spaces = len(raw_line) - len(raw_line.lstrip(' \t'))
        tabs = len(raw_line) - len(raw_line.lstrip('\t'))
        level = tabs + 1 if tabs else indent_spaces // 2 + 1
        clean = raw_line.strip()
        clean = re.sub(r'^[\-•–—]+\s*', '', clean)
        title = normalize_text(clean)
        chapter_number = detect_chapter_number(title)
        role = infer_role_for_title(title, role_options)
        items.append(TocItem(title=title, level=max(1, level), role=role, chapter_number=chapter_number))
    return items


def parse_toc_item_payload(items_raw: List[Dict[str, object]], role_options: List[str] | None = None) -> List[TocItem]:
    role_options = role_options or []
    out: List[TocItem] = []
    for item in items_raw:
        title = normalize_text(str(item.get('title', '')).strip())
        role = str(item.get('role', '')).strip() or infer_role_for_title(title, role_options)
        out.append(TocItem(
            title=title,
            href=str(item.get('href', '')).strip(),
            level=max(1, int(item.get('level', 1) or 1)),
            role=role,
            matched_file=str(item.get('matched_file', '')).strip(),
            matched_heading=str(item.get('matched_heading', '')).strip(),
            chapter_number=str(item.get('chapter_number', '')).strip() or detect_chapter_number(title),
        ))
    return out


def best_heading_match(title: str, spine_texts: List[Dict[str, str]]) -> Tuple[str, str]:
    target = slugify(title)
    target_words = set(filter(None, target.split('-')))
    best_score = 0.0
    best = ('', '')
    for part in spine_texts:
        for h in part.get('headings', []):
            candidate = slugify(h['title'])
            c_words = set(filter(None, candidate.split('-')))
            if not c_words:
                continue
            inter = len(target_words & c_words)
            union = len(target_words | c_words)
            score = inter / union if union else 0.0
            if target == candidate:
                score = 1.0
            if score > best_score:
                best_score = score
                best = (part['file_name'], h['title'])
    return best


def generate_export_payload(book: EpubBook, custom_toc: List[TocItem], role_options: List[str]) -> Dict[str, object]:
    spine_texts = book.extract_spine_texts()
    export_toc = []
    for index, item in enumerate(custom_toc, start=1):
        matched_file, matched_heading = (item.matched_file, item.matched_heading)
        if not matched_file and not matched_heading:
            matched_file, matched_heading = best_heading_match(item.title, spine_texts)
        export_toc.append({
            'id': f"node-{index:03d}-{slugify(item.title)}",
            'title': item.title,
            'level': item.level,
            'role': item.role or '',
            'chapter_number': item.chapter_number,
            'matched_file': matched_file,
            'matched_heading': matched_heading,
        })
    metadata = {
        'book': book.metadata,
        'role_options': role_options,
        'toc_items': export_toc,
        'source_toc_from_epub': [asdict(i) for i in book.get_nav_toc()],
        'text_files': [
            {
                'file_name': part['file_name'],
                'order': part['order'],
                'href': part['href'],
                'headings': part['headings'],
            }
            for part in spine_texts
        ],
    }
    texts = [{'file_name': part['file_name'], 'text': part['text']} for part in spine_texts]
    return {'metadata': metadata, 'texts': texts}


def html_to_text(raw_text: str) -> str:
    text = re.sub(r'<\s*br\s*/?>', '\n', raw_text, flags=re.IGNORECASE)
    text = re.sub(r'</\s*(p|div|section|article|li|blockquote|h[1-6])\s*>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    return normalize_text(text)


def text_content_to_text_and_headings(raw_text: str, suffix: str = '.txt') -> Tuple[str, List[Dict[str, str]]]:
    source = raw_text or ''
    if suffix.lower() in {'.html', '.htm', '.xhtml'}:
        source = html_to_text(source)
    normalized_lines = []
    headings: List[Dict[str, str]] = []
    for line in source.replace('\r', '\n').split('\n'):
        clean = normalize_text(line)
        if not clean:
            continue
        normalized_lines.append(clean)
        if len(clean) <= 120 and (clean.isupper() or CHAPTER_RE.match(clean) or clean.startswith('#')):
            level = 1 if CHAPTER_RE.match(clean) else 2
            headings.append({'title': clean.lstrip('# ').strip(), 'level': level})
    deduped = []
    prev = None
    for line in normalized_lines:
        if line != prev:
            deduped.append(line)
        prev = line
    return '\n\n'.join(deduped).strip(), headings


def generate_export_payload_from_texts(book: Dict[str, str], text_files: List[Dict[str, str]], custom_toc: List[TocItem], role_options: List[str]) -> Dict[str, object]:
    export_toc = []
    for index, item in enumerate(custom_toc, start=1):
        matched_file, matched_heading = (item.matched_file, item.matched_heading)
        if not matched_file and not matched_heading:
            matched_file, matched_heading = best_heading_match(item.title, text_files)
        export_toc.append({
            'id': f"node-{index:03d}-{slugify(item.title)}",
            'title': item.title,
            'level': item.level,
            'role': item.role or '',
            'chapter_number': item.chapter_number,
            'matched_file': matched_file,
            'matched_heading': matched_heading,
        })
    metadata = {
        'book': book,
        'role_options': role_options,
        'toc_items': export_toc,
        'source_toc_from_epub': [],
        'text_files': [
            {
                'file_name': part['file_name'],
                'order': part['order'],
                'href': part['href'],
                'headings': part['headings'],
            }
            for part in text_files
        ],
    }
    texts = [{'file_name': part['file_name'], 'text': part['text']} for part in text_files]
    return {'metadata': metadata, 'texts': texts}
