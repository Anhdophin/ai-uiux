"""
REPAIR + FIX script:
1. Sửa lỗi do lần chạy đầu (path corruption trong icon/media paths)
2. Cập nhật đúng các file còn bỏ qua (shop-catalog.json v.v.)
3. Không đổi tên file lần nữa (đã xong)

Lỗi cũ: content.replace("/apps/swot/", "/apps/swot/swot.html") cũng làm hỏng
         "/apps/swot/icon.png" → "/apps/swot/swot.htmlicon.png"
Fix:     Dùng regex với boundary assertion (?=["'\\s,]) thay vì plain replace.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {".git", "node_modules", "__pycache__"}

# Mapping: abs_folder_path (with leading/trailing slash) → slug
# Chỉ những path không có hyphen mới bị lỗi do re.escape + plain replace
# Nhưng để an toàn, liệt kê TẤT CẢ (dùng regex boundary cho tất cả)
RENAMES_MAP = [
    # (abs_path_with_trailing_slash, slug)
    # Apps
    ("/apps/business-canvas/", "business-canvas"),
    ("/apps/ebook_reader/", "ebook_reader"),
    ("/apps/swot/", "swot"),
    ("/apps/wheel-of-life/", "wheel-of-life"),
    # service-detail root
    ("/service-detail/website-ai/", "website-ai"),
    # services section
    ("/services/about/", "about"),
    ("/services/downloads/", "downloads"),
    ("/services/downloads/game-design-document/", "game-design-document"),
    ("/services/service-detail/", "service-detail"),
    ("/services/service-detail/corporate-story-design/", "corporate-story-design"),
    ("/services/service-detail/gvn/", "gvn"),
    ("/services/service-detail/par/", "par"),
    ("/services/service-detail/teaching-design/", "teaching-design"),
    ("/services/service-detail/website-design/", "website-design"),
    ("/services/workflow/", "workflow"),
    ("/services/workflow/website-design/", "website-design"),
    ("/services_solutions/", "services_solutions"),
    # shop categories
    ("/shop/all/", "all"),
    ("/shop/hand-made/", "hand-made"),
    ("/shop/hand-made/tui-xach-hand-made/", "tui-xach-hand-made"),
    ("/shop/hand-made/vi-da-handmade/", "vi-da-handmade"),
    ("/shop/linh-chi/", "linh-chi"),
    ("/shop/linh-chi/cafe-nam-linh-chi/", "cafe-nam-linh-chi"),
    ("/shop/linh-chi/ruou-nam-linh-chi/", "ruou-nam-linh-chi"),
    ("/shop/tram-huong/", "tram-huong"),
    ("/shop/tram-huong/nhang-tram-huong/", "nhang-tram-huong"),
    ("/shop/tram-huong/quach-tram-huong/", "quach-tram-huong"),
    ("/shop/tram-huong/tinh-dau-tram-huong/", "tinh-dau-tram-huong"),
    ("/shop/trang-suc/", "trang-suc"),
    ("/shop/trang-suc/mat-day-khac-laser/", "mat-day-khac-laser"),
    ("/shop/trang-suc/nhan-khac-laser/", "nhan-khac-laser"),
]

def repair_and_update_file(filepath):
    """
    1. Undo bad replacement: /foo/foo.html + non-boundary → /foo/
    2. Apply correct replacement: /foo/ + boundary → /foo/foo.html
    Also handles href="...foo/" → href="...foo/foo.html"
    """
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception as e:
        print(f"  [SKIP READ] {filepath}: {e}")
        return False

    original = content

    for abs_path, slug in RENAMES_MAP:
        new_path = abs_path + slug + ".html"  # e.g., /apps/swot/swot.html

        # ── STEP 1: Undo corruption ──────────────────────────────────────────
        # Bad: /apps/swot/swot.html followed by non-boundary char
        # (this is when icon.png or other file paths got mangled)
        # Restore: /apps/swot/swot.html[non-bound] → /apps/swot/[non-bound]
        corruption_pat = re.escape(new_path) + r'(?!["\'\s,\)])'
        content = re.sub(corruption_pat, abs_path, content)

        # ── STEP 2: Apply correct route replacement ─────────────────────────
        # Replace abs_path only when followed by a value boundary ("  '  ,  etc.)
        # This handles JSON "route": "/shop/hand-made/" and href="/shop/hand-made/"
        correct_pat = re.escape(abs_path) + r'(?=["\'\s,\)])'
        content = re.sub(correct_pat, new_path, content)

        # ── STEP 3: Fix relative href="...slug/" in HTML/JS ─────────────────
        # e.g., href="hand-made/" → href="hand-made/hand-made.html"
        # e.g., href="../downloads/" → href="../downloads/downloads.html"
        # Rule: only match slug at end of href path (slug + "/" + boundary)
        href_pat = r'(href=["\'])([^"\']*/)' + re.escape(slug) + r'/'
        href_rep = r'\g<1>\g<2>' + slug + '/' + slug + '.html'
        content = re.sub(href_pat, href_rep, content)

    if content != original:
        try:
            with open(filepath, "w", encoding="utf-8", newline="") as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"  [SKIP WRITE] {filepath}: {e}")
    return False


def main():
    exts = {".html", ".js", ".json", ".css"}
    updated_files = []

    print("=== Repair + Fix references in all files ===\n")

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fname in filenames:
            if os.path.splitext(fname)[1].lower() not in exts:
                continue
            fpath = os.path.join(dirpath, fname)
            if repair_and_update_file(fpath):
                rel = os.path.relpath(fpath, ROOT).replace("\\", "/")
                updated_files.append(rel)
                print(f"  [UPDATED] {rel}")

    print(f"\nHoàn thành! {len(updated_files)} file(s) updated.")

if __name__ == "__main__":
    main()

