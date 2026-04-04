/*
  AI EDIT NOTE:
  - Đọc AGENTS.md + .cursorrules + AI-EDIT-PRECHECK.md trước khi sửa.
  - Không hardcode slug/path/category nếu dữ liệu đã có trong catalog/meta.
  - Nếu sửa clone/routing, kiểm tra: page.meta.json -> shop/data/shop-catalog.json -> href/route -> folder path.
*/
from __future__ import annotations

import json
import re
from html import unescape
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / 'data'
SITE_MAP_PATH = DATA_DIR / 'site-map.json'

ROUTE_EXCLUDE = {
    'assets', 'background', 'components', 'data', 'shared', 'supabase', '__pycache__', '.git'
}
NAV_EXCLUDE = {'micro-tools', 'templates'}
PLACEHOLDER_EXCLUDE = {'components', 'shared', 'assets', 'background', 'data', 'supabase'}

TITLE_RE = re.compile(r'<title>(.*?)</title>', re.IGNORECASE | re.DOTALL)


def slug_to_title(slug: str) -> str:
    return slug.replace('-', ' ').replace('_', ' ').strip().title() or 'Untitled'


def infer_route(index_file: Path) -> str:
    rel = index_file.relative_to(ROOT)
    if rel.as_posix() == 'index.html':
        return '/'
    return '/' + rel.parent.as_posix().strip('/') + '/'


def route_depth(route: str) -> int:
    if route == '/':
        return 0
    return len([part for part in route.strip('/').split('/') if part])


def read_title(index_file: Path) -> str:
    text = index_file.read_text(encoding='utf-8', errors='ignore')
    match = TITLE_RE.search(text)
    if match:
        title = unescape(re.sub(r'\s+', ' ', match.group(1))).strip()
        if title:
            return title
    return slug_to_title(index_file.parent.name)


def load_meta(folder: Path) -> dict[str, Any]:
    meta_path = folder / 'page.meta.json'
    if not meta_path.exists():
        return {}
    try:
        return json.loads(meta_path.read_text(encoding='utf-8'))
    except Exception:
        return {}


def should_ignore_route(index_file: Path) -> bool:
    parts = index_file.relative_to(ROOT).parts[:-1]
    return bool(parts and parts[0] in ROUTE_EXCLUDE)


def default_show_in_nav(route: str, folder: Path) -> bool:
    parts = folder.relative_to(ROOT).parts
    if not parts:
        return False
    if parts[0] in NAV_EXCLUDE:
        return False
    return route_depth(route) == 1


def find_parent(route: str, existing_routes: set[str]) -> str | None:
    if route == '/':
        return None
    parts = [part for part in route.strip('/').split('/') if part]
    while parts:
        parts = parts[:-1]
        candidate = '/' + '/'.join(parts) + '/' if parts else '/'
        if candidate in existing_routes:
            return candidate
    return None


def update_subpage_paths(index_file: Path) -> bool:
    rel = index_file.relative_to(ROOT)
    parts = rel.parts[:-1]
    if parts and parts[0] in PLACEHOLDER_EXCLUDE:
        return False

    text = index_file.read_text(encoding='utf-8', errors='ignore')
    if 'id="subpage-header"' not in text and 'id="subpage-footer"' not in text:
        return False

    depth = len(parts)
    root_path = './' if depth == 0 else '../' * depth

    updated = text
    updated = re.sub(r'<div id="subpage-header"[^>]*></div>', '<div id="subpage-header"></div>', updated)
    updated = re.sub(r'<div id="subpage-footer"[^>]*></div>', '<div id="subpage-footer"></div>', updated)
    updated = re.sub(r'href="(?:\.\./|/)?styles\.css"', f'href="{root_path}styles.css"', updated)
    updated = re.sub(r'href="(?:\.\./|/)?shared/subpage-components\.css"', f'href="{root_path}shared/subpage-components.css"', updated)
    updated = re.sub(r'src="(?:\.\./|/)?shared/subpage-components\.js"', f'src="{root_path}shared/subpage-components.js"', updated)

    if updated != text:
        index_file.write_text(updated, encoding='utf-8')
        return True
    return False


def build_site_map() -> dict[str, Any]:
    pages: list[dict[str, Any]] = []
    index_files = sorted(ROOT.rglob('index.html'))

    for index_file in index_files:
        if should_ignore_route(index_file):
            continue
        folder = index_file.parent
        route = infer_route(index_file)
        meta = load_meta(folder)
        title = meta.get('title') or read_title(index_file)
        short_title = meta.get('short_title') or title.split('—')[0].split('|')[0].strip()
        page = {
            'route': route,
            'title': title,
            'short_title': short_title,
            'nav_label': meta.get('nav_label') or short_title,
            'section': meta.get('section') or ((folder.relative_to(ROOT).parts[0]) if route != '/' else 'home'),
            'order': meta.get('order'),
            'nav_order': meta.get('nav_order'),
            'show_in_nav': bool(meta['show_in_nav']) if 'show_in_nav' in meta else default_show_in_nav(route, folder),
            'template': meta.get('template'),
            'source': index_file.relative_to(ROOT).as_posix(),
            'depth': route_depth(route),
        }
        pages.append(page)

    routes = {page['route'] for page in pages}
    for page in pages:
        page['parent'] = find_parent(page['route'], routes)

    pages.sort(key=lambda item: (item['depth'], item.get('nav_order') if item.get('nav_order') is not None else 999, item['route']))

    return {
        'generated_by': 'scan_routes.py',
        'page_count': len(pages),
        'pages': pages,
    }


def main() -> None:
    updated_files = []
    for index_file in sorted(ROOT.rglob('index.html')):
        if update_subpage_paths(index_file):
            updated_files.append(index_file.relative_to(ROOT).as_posix())

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    site_map = build_site_map()
    SITE_MAP_PATH.write_text(json.dumps(site_map, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    print(f'Site map written: {SITE_MAP_PATH.relative_to(ROOT).as_posix()}')
    print(f'Pages found: {site_map["page_count"]}')
    if updated_files:
        print('Updated subpage asset paths:')
        for rel in updated_files:
            print(f' - {rel}')


if __name__ == '__main__':
    main()
