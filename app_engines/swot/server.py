from __future__ import annotations

import json
import urllib.parse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

HOST = "127.0.0.1"
PORT = 8788
ENGINE_ROOT = Path(__file__).resolve().parent
WORKSPACE_ROOT = ENGINE_ROOT.parents[1]
PUBLIC_ROOT = WORKSPACE_ROOT
BLOCKED_PREFIXES = (
    "/app_engines/",
    "/.git/",
    "/.vscode/",
)
BLOCKED_EXACT_PATHS = {
    "/apps/swot/app.py",
}
BLOCKED_SUFFIXES = (
    ".py",
    ".pyc",
    ".pyo",
    ".md",
    ".bat",
    ".ps1",
    ".sh",
    ".toml",
    ".yml",
    ".yaml",
    ".env",
)


def build_swot_summary(payload: dict[str, Any]) -> str:
    sections = payload.get("sections")
    if not isinstance(sections, list):
        return "BẢN GHI NHANH\n\nKhông có dữ liệu SWOT hợp lệ."

    lines: list[str] = []
    for section in sections:
        if not isinstance(section, dict):
            continue

        label = str(section.get("label") or "").strip() or "Chưa đặt nhãn"
        raw_items = section.get("items")
        normalized_items: list[str] = []

        if isinstance(raw_items, list):
            for raw_item in raw_items:
                if not isinstance(raw_item, dict):
                    continue
                text = str(raw_item.get("text") or "").strip()
                if not text:
                    continue
                score = raw_item.get("score", 0)
                try:
                    score_number = max(0, min(100, int(score)))
                except (TypeError, ValueError):
                    score_number = 0
                normalized_items.append(f"• {text} ({score_number}%)")

        if normalized_items:
            lines.append(f"## {label}\n" + "\n".join(normalized_items))
        else:
            lines.append(f"## {label}\n(chưa nhập)")

    if not lines:
        return "BẢN GHI NHANH\n\nKhông có dữ liệu SWOT hợp lệ."

    return "BẢN GHI NHANH\n\n" + "\n\n".join(lines)


class SwotHandler(SimpleHTTPRequestHandler):
    def _is_blocked_path(self, path: str) -> bool:
        lowered = path.lower()
        if lowered in BLOCKED_EXACT_PATHS:
            return True
        if any(lowered.startswith(prefix) for prefix in BLOCKED_PREFIXES):
            return True
        return lowered.endswith(BLOCKED_SUFFIXES)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if self._is_blocked_path(parsed.path):
            self.send_error(404, "Not Found")
            return
        return super().do_GET()

    def do_HEAD(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if self._is_blocked_path(parsed.path):
            self.send_error(404, "Not Found")
            return
        return super().do_HEAD()

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/api/swot-summary":
            self.send_error(404, "Not Found")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0 or content_length > 1_000_000:
            self.send_error(400, "Invalid payload size")
            return

        raw_body = self.rfile.read(content_length)
        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(400, "Invalid JSON")
            return

        summary = build_swot_summary(payload)
        body = json.dumps({"summary": summary}, ensure_ascii=False).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def translate_path(self, path: str) -> str:
        parsed = urllib.parse.urlparse(path)
        clean_path = parsed.path
        return super().translate_path(clean_path)


def main() -> None:
    handler = partial(SwotHandler, directory=str(PUBLIC_ROOT))
    server = ThreadingHTTPServer((HOST, PORT), handler)
    print(f"SWOT backend is running at http://{HOST}:{PORT}")
    print(f"Open app at http://{HOST}:{PORT}/apps/swot/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
