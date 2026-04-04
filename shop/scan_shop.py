#!/usr/bin/env python3
# AI EDIT NOTE:
# - Đọc AGENTS.md + .cursorrules + AI-EDIT-PRECHECK.md trước khi sửa.
# - Không hardcode slug/path/category nếu dữ liệu đã có trong catalog/meta.
# - Nếu sửa clone/routing, kiểm tra: page.meta.json -> shop/data/shop-catalog.json -> href/route -> folder path.
# CLONE NOTES:
# - Thêm nhóm mới: tạo folder shop/<category-slug>/ có index.html + page.meta.json
# - Thêm sản phẩm mới: tạo folder shop/<category-slug>/<product-slug>/ có index.html + page.meta.json + media/
# - Ảnh nhóm: đặt tại shop/media/<category-slug>.(jpg|png|webp)
# - Ảnh sản phẩm: đặt media/main.* làm cover, các ảnh còn lại tự vào gallery
# - Không sửa tay shop/data/shop-catalog.json vì file này được script này sinh ra sau mỗi lần scan
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent
ROOT_ROUTE = '/shop/'
SKIP_DIRS = {'data', 'shop-shared', '__pycache__', 'all'}
IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'}
DEFAULT_PLACEHOLDER = 'shop-shared/placeholder-product.svg'
CATEGORY_MEDIA_DIR = 'media'


def load_json(path: Path):
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return {}


def title_from_slug(slug: str) -> str:
    return slug.replace('-', ' ').replace('_', ' ').title()


def build_route(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return ROOT_ROUTE + ('' if rel == '.' else rel + '/')


def build_file_route(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return ROOT_ROUTE + rel


def list_media_files(product_dir: Path):
    media_dir = product_dir / 'media'
    if not media_dir.exists():
        return []
    return sorted([
        file for file in media_dir.iterdir()
        if file.is_file() and file.suffix.lower() in IMAGE_EXTS
    ], key=lambda f: f.name.lower())


def normalize_media_path(value, product_dir: Path):
    if not value or not isinstance(value, str):
        return None
    path = value.strip()
    if not path:
        return None
    if path.startswith(('http://', 'https://', '/shop/')):
        return path
    return build_file_route(product_dir / path)

def list_category_media_files():
    media_dir = ROOT / CATEGORY_MEDIA_DIR
    if not media_dir.exists():
        return []
    return sorted([
        file for file in media_dir.iterdir()
        if file.is_file() and file.suffix.lower() in IMAGE_EXTS
    ], key=lambda f: f.name.lower())


def find_category_image(category_slug: str):
    media_files = list_category_media_files()
    if not media_files:
        return None
    slug_key = (category_slug or '').strip().lower()
    slug_variants = {slug_key, slug_key.replace('-', '_'), slug_key.replace('_', '-')}
    for file in media_files:
        if file.stem.lower() in slug_variants:
            return build_file_route(file)
    return None


def auto_media_bundle(product_dir: Path, product_meta: dict):
    files = list_media_files(product_dir)
    if not files:
        explicit_main = normalize_media_path(product_meta.get('main_image'), product_dir)
        placeholder = explicit_main or (ROOT_ROUTE + DEFAULT_PLACEHOLDER)
        return {
            'main_image': placeholder,
            'card_image': placeholder,
            'gallery': []
        }

    # Quy ước ảnh: ưu tiên file tên main.* làm ảnh cover.
    main_file = None
    for file in files:
        if file.stem.lower() == 'main':
            main_file = file
            break

    if not main_file:
        explicit_main = product_meta.get('main_image') or product_meta.get('card_image')
        if explicit_main:
            candidate = product_dir / explicit_main
            if candidate.exists() and candidate.suffix.lower() in IMAGE_EXTS:
                main_file = candidate

    if not main_file:
        main_file = files[0]

    main_image = build_file_route(main_file)
    gallery = [build_file_route(file) for file in files if file.resolve() != main_file.resolve()]

    return {
        'main_image': main_image,
        'card_image': main_image,
        'gallery': gallery
    }



def scan():
    categories = []
    products = []
    for category_dir in sorted([p for p in ROOT.iterdir() if p.is_dir() and p.name not in SKIP_DIRS and not p.name.startswith('.')]):
        category_meta = load_json(category_dir / 'page.meta.json')
        product_dirs = [p for p in category_dir.iterdir() if p.is_dir() and (p / 'index.html').exists()]
        if not product_dirs:
            continue
        cat = {
            'slug': category_dir.name,
            'title': category_meta.get('title') or title_from_slug(category_dir.name),
            'route': build_route(category_dir),
            'description': category_meta.get('description', ''),
            'accent': category_meta.get('accent', '#7cb6de'),
            'badge': category_meta.get('badge', ''),
            'card_caption': category_meta.get('card_caption', ''),
            'experience_tags': category_meta.get('experience_tags', []),
            # Ảnh nhóm: ưu tiên image trong meta, nếu không có thì tự tìm file trùng slug trong shop/media/
            'image': category_meta.get('image') and normalize_media_path(category_meta.get('image'), ROOT) or find_category_image(category_dir.name) or (ROOT_ROUTE + DEFAULT_PLACEHOLDER)
        }
        categories.append(cat)
        for product_dir in sorted(product_dirs):
            product_meta = load_json(product_dir / 'page.meta.json')
            page_mtime = datetime.fromtimestamp((product_dir / 'index.html').stat().st_mtime).strftime('%Y-%m-%d')
            media = auto_media_bundle(product_dir, product_meta)
            products.append({
                'slug': product_dir.name,
                'title': product_meta.get('title') or title_from_slug(product_dir.name),
                'short_title': product_meta.get('short_title') or product_meta.get('title') or title_from_slug(product_dir.name),
                'route': build_route(product_dir),
                # category_slug luôn lấy theo folder cha để tránh lỗi clone từ nhóm cũ sang nhóm mới mà quên sửa meta
                'category_slug': category_dir.name,
                'category_title': cat['title'],
                'category_route': cat['route'],
                'category_accent': cat['accent'],
                'price': product_meta.get('price', 'Liên hệ'),
                'summary': product_meta.get('summary', ''),
                'experience_tags': product_meta.get('experience_tags', []),
                'is_new': bool(product_meta.get('is_new', False)),
                'badge': product_meta.get('badge', ''),
                'updated_at': product_meta.get('updated_at', page_mtime),
                'main_image': media['main_image'],
                'card_image': media['card_image'],
                'gallery': media['gallery']
            })
    counts = {c['slug']: 0 for c in categories}
    for p in products:
        counts[p['category_slug']] = counts.get(p['category_slug'], 0) + 1
    for c in categories:
        c['product_count'] = counts.get(c['slug'], 0)
    tags = sorted({tag for p in products for tag in p.get('experience_tags', [])})
    products.sort(key=lambda item: ((item.get('updated_at', '') or ''), item.get('title', '') or ''), reverse=True)
    output = {
        'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'root_route': ROOT_ROUTE,
        'categories': categories,
        'products': products,
        'experience_tags': tags
    }
    out_path = ROOT / 'data' / 'shop-catalog.json'
    out_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Generated {out_path} with {len(categories)} categories and {len(products)} products.')

if __name__ == '__main__':
    scan()
