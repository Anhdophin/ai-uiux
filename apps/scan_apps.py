from __future__ import annotations

# Comment: chạy file này mỗi khi thêm app mới vào folder apps/.
# Comment: scanner sẽ quét app trong apps/, tạo JSON cho trang apps và đồng thời mirror ra root /data nếu folder đó tồn tại.

import json
import re
from datetime import datetime, timezone
from pathlib import Path

APPS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = APPS_DIR.parent
APPS_DATA_DIR = APPS_DIR / "data"
ROOT_DATA_DIR = PROJECT_ROOT / "data"
SERVICES_DATA_DIR = PROJECT_ROOT / "services" / "data"

IGNORE_DIRS = {
    "data",
    "shared",
    "_templates",
    "__pycache__",
    ".cache",
}

ENTRY_CANDIDATES = (
    "index.html",
    "web/index.html",
    "frontend/index.html",
    "app/index.html",
)

IMAGE_EXTENSIONS = (".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif")
ICON_CANDIDATES = (
    "icon",
    "app-icon",
    "logo",
    "favicon",
    "assets/icon",
    "assets/app-icon",
    "assets/logo",
    "assets/favicon",
    "media/icon",
    "media/app-icon",
)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def prettify_slug(slug: str) -> str:
    return " ".join(part.capitalize() for part in slug.replace("_", "-").split("-"))


def detect_entry(app_dir: Path) -> str | None:
    for candidate in ENTRY_CANDIDATES:
        if (app_dir / candidate).exists():
            return candidate
    return None


def extract_html_title_and_description(entry_path: Path) -> tuple[str, str]:
    html = read_text(entry_path)
    title_match = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
    desc_match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        html,
        re.I | re.S,
    )
    title = title_match.group(1).strip() if title_match else ""
    description = desc_match.group(1).strip() if desc_match else ""
    return title, description


def read_readme_summary(app_dir: Path) -> str:
    for name in ("README.md", "README.txt", "readme.md", "readme.txt"):
        path = app_dir / name
        if not path.exists():
            continue
        content = read_text(path)
        chunks = re.split(r"\n\s*\n", content)
        for chunk in chunks:
            line = " ".join(chunk.strip().split())
            if line and not line.startswith("#"):
                return line[:220]
    return ""




def detect_icon(app_dir: Path, meta: dict) -> str:
    raw_icon = str(meta.get("icon") or "").strip()
    if raw_icon:
        candidate = app_dir / raw_icon
        if candidate.exists() and candidate.is_file():
            return "/" + candidate.relative_to(PROJECT_ROOT).as_posix()

    for stem in ICON_CANDIDATES:
        for ext in IMAGE_EXTENSIONS:
            candidate = app_dir / f"{stem}{ext}"
            if candidate.exists():
                return "/" + candidate.relative_to(PROJECT_ROOT).as_posix()

    candidates: list[tuple[int, Path]] = []
    for candidate in app_dir.rglob("*"):
        if not candidate.is_file() or candidate.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        rel = candidate.relative_to(app_dir).as_posix().lower()
        if rel.count("/") > 2:
            continue

        score = 100
        name = candidate.stem.lower()
        if any(key in name for key in ("icon", "logo", "favicon")):
            score -= 40
        if "assets/" in rel or "media/" in rel:
            score -= 10

        candidates.append((score, candidate))

    if not candidates:
        return ""

    candidates.sort(key=lambda item: (item[0], len(item[1].as_posix())))
    return "/" + candidates[0][1].relative_to(PROJECT_ROOT).as_posix()


def detect_cover(app_dir: Path, meta: dict, icon: str = "") -> str:
    raw_cover = str(meta.get("cover") or "").strip()
    if raw_cover:
        candidate = app_dir / raw_cover
        if candidate.exists() and candidate.is_file():
            return "/" + candidate.relative_to(PROJECT_ROOT).as_posix()

    preferred_stems = (
        "media/cover",
        "media/main",
        "media/thumb",
        "media/preview",
        "assets/cover",
        "assets/main",
        "assets/thumb",
        "assets/preview",
        "assets/favicon",
        "favicon",
        "cover",
        "main",
        "thumb",
        "preview",
    )
    for stem in preferred_stems:
        for ext in IMAGE_EXTENSIONS:
            candidate = app_dir / f"{stem}{ext}"
            if candidate.exists():
                return "/" + candidate.relative_to(PROJECT_ROOT).as_posix()

    candidates: list[tuple[int, Path]] = []
    for candidate in app_dir.rglob("*"):
        if not candidate.is_file() or candidate.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        rel = candidate.relative_to(app_dir).as_posix().lower()
        if rel.count("/") > 2:
            continue

        score = 100
        name = candidate.stem.lower()
        if any(key in name for key in ("cover", "main", "thumb", "preview", "favicon", "icon")):
            score -= 30
        if "assets/" in rel or "media/" in rel:
            score -= 10

        candidates.append((score, candidate))

    if not candidates:
        return icon

    candidates.sort(key=lambda item: (item[0], len(item[1].as_posix())))
    return "/" + candidates[0][1].relative_to(PROJECT_ROOT).as_posix()


def detect_shell_usage(entry_path: Path) -> bool:
    html = read_text(entry_path)
    return "site-header" in html and "site-footer" in html and "modules.js" in html


def detect_category(slug: str, title: str, summary: str) -> str:
    text = f"{slug} {title} {summary}".lower()
    if slug.startswith("icon-"):
        return "Prototype"
    if "ebook" in text or "epub" in text or "reader" in text:
        return "Reading Tool"
    if "camera" in text or "webcam" in text or "robot" in text:
        return "UI Lab"
    if "giao-viec" in text:
        return "Family App"
    if "clip" in text or "cpu" in text or "launcher" in text:
        return "Utility"
    return "App"


def detect_tags(slug: str, title: str, summary: str, entry_rel: str) -> list[str]:
    text = f"{slug} {title} {summary}".lower()
    tags: list[str] = []

    if slug.startswith("icon-"):
        tags.extend(["prototype", "ui"])
    if "webcam" in text or "camera" in text:
        tags.extend(["camera", "media"])
    if "ebook" in text or "epub" in text:
        tags.extend(["ebook", "reader"])
    if "launcher" in text or "utility" in text:
        tags.append("launcher")
    if "giao-viec" in text:
        tags.append("family")
    if entry_rel != "index.html":
        tags.append("nested-entry")

    deduped: list[str] = []
    for tag in tags:
        if tag not in deduped:
            deduped.append(tag)
    return deduped


def load_meta(app_dir: Path) -> dict:
    # Comment: nếu muốn chỉnh title/summary/category/tags/cover/order cho 1 app cụ thể thì tạo app.meta.json trong folder app.
    meta_path = app_dir / "app.meta.json"
    if not meta_path.exists():
        return {}
    try:
        return json.loads(read_text(meta_path))
    except json.JSONDecodeError as error:
        print(f"[scan_apps] Warning: app.meta.json lỗi JSON ở {meta_path}: {error}")
        return {}


def build_route(slug: str, entry_rel: str) -> str:
    if entry_rel == "index.html":
        return f"/apps/{slug}/"
    return f"/apps/{slug}/" + entry_rel.replace("index.html", "")


def is_effectively_empty_dir(path: Path) -> bool:
    try:
        next(path.iterdir())
    except StopIteration:
        return True
    return False


def collect_apps() -> tuple[list[dict], list[str]]:
    apps: list[dict] = []
    warnings: list[str] = []
    order_map = {
        "robot": 1,
        "icon-02": 2,
        "ebook_reader": 3,
        "epub_metadata_tool": 4,
        "chong-clip-bang-cpu": 5,
        "giao-viec-nha": 6,
    }

    for app_dir in sorted(APPS_DIR.iterdir()):
        if not app_dir.is_dir():
            continue
        if app_dir.name in IGNORE_DIRS or app_dir.name.startswith("."):
            continue

        entry_rel = detect_entry(app_dir)
        if not entry_rel:
            if is_effectively_empty_dir(app_dir):
                continue
            warnings.append(f"Skip {app_dir.name}: không tìm thấy entry html.")
            continue

        entry_path = app_dir / entry_rel
        meta = load_meta(app_dir)
        title_from_html, description_from_html = extract_html_title_and_description(entry_path)
        summary = (
            meta.get("summary")
            or meta.get("description")
            or description_from_html
            or read_readme_summary(app_dir)
            or f"Ứng dụng {prettify_slug(app_dir.name)}."
        )
        title = meta.get("title") or title_from_html or prettify_slug(app_dir.name)
        icon = detect_icon(app_dir, meta)
        cover = meta.get("cover") or detect_cover(app_dir, meta, icon)

        app_item = {
            "slug": app_dir.name,
            "title": title,
            "summary": summary,
            "category": meta.get("category") or detect_category(app_dir.name, title, summary),
            "tags": meta.get("tags") or detect_tags(app_dir.name, title, summary, entry_rel),
            "entry_rel": entry_rel,
            "route": build_route(app_dir.name, entry_rel),
            "icon": icon,
            "cover": cover or icon,
            "uses_site_shell": detect_shell_usage(entry_path),
            "has_root_index": entry_rel == "index.html",
            "order": meta.get("order", order_map.get(app_dir.name, 999)),
        }

        if not icon:
            warnings.append(f"{app_dir.name}: chưa tìm thấy icon trong folder app, card sẽ dùng placeholder.")
        if not app_item["uses_site_shell"]:
            warnings.append(f"{app_dir.name}: entry chưa dùng shared header/footer của site.")

        apps.append(app_item)

    apps.sort(key=lambda item: (item.get("order", 999), item.get("title", "").lower()))
    return apps, warnings


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    apps, warnings = collect_apps()
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    catalog = {
        "generated_at": generated_at,
        "app_count": len(apps),
        "apps": apps,
        "warnings": warnings,
    }

    home_feed = {
        "generated_at": generated_at,
        "featured_count": min(8, len(apps)),
        "items": [
            {
                "slug": item["slug"],
                "title": item["title"],
                "summary": item["summary"],
                "route": item["route"],
                "icon": item["icon"],
                "cover": item["cover"],
                "category": item["category"],
                "tags": item["tags"][:3],
            }
            for item in apps[:8]
        ],
    }

    write_json(APPS_DATA_DIR / "apps-catalog.json", catalog)
    write_json(APPS_DATA_DIR / "apps-home-feed.json", home_feed)

    # Comment: mirror dữ liệu app ra các data dir đang được site sử dụng.
    mirror_dirs = [path for path in (ROOT_DATA_DIR, SERVICES_DATA_DIR) if path.exists()]
    root_apps = []
    for item in apps:
        root_apps.append({
            "slug": item["slug"],
            "title": item["title"],
            "subtitle": item["summary"],
            "icon": item["icon"] or item["cover"] or "/assets/icons/icon-01.png",
            "path": item["route"].lstrip("/"),
            "group": item["category"],
            "shelf": 1 if item.get("order", 999) <= 4 else 2,
        })
    micro_tools = root_apps[:4]
    for data_dir in mirror_dirs:
        write_json(data_dir / "apps-portal.json", catalog)
        write_json(data_dir / "apps-home-feed.json", home_feed)
        write_json(data_dir / "apps.json", root_apps)
        write_json(data_dir / "micro-tools.json", micro_tools)

    print(f"[scan_apps] Done. App count: {len(apps)}")
    for warning in warnings:
        print(f"[scan_apps] {warning}")


if __name__ == "__main__":
    main()
