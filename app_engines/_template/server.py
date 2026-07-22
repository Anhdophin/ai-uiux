from __future__ import annotations

import urllib.parse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = "127.0.0.1"
PORT = 8800
ENGINE_ROOT = Path(__file__).resolve().parent
WORKSPACE_ROOT = ENGINE_ROOT.parents[1]
PUBLIC_ROOT = WORKSPACE_ROOT
BLOCKED_PREFIXES = (
    "/app_engines/",
    "/.git/",
    "/.vscode/",
)
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


class TemplateHandler(SimpleHTTPRequestHandler):
    def _is_blocked_path(self, path: str) -> bool:
        lowered = path.lower()
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


def main() -> None:
    handler = partial(TemplateHandler, directory=str(PUBLIC_ROOT))
    server = ThreadingHTTPServer((HOST, PORT), handler)
    print(f"Template app engine running at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
