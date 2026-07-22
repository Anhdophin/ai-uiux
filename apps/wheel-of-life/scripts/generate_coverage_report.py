"""Generate a human-readable coverage snapshot for curated seed content."""

from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
BACKEND_SRC = ROOT / "src" / "backend"
if str(BACKEND_SRC) not in sys.path:
    sys.path.insert(0, str(BACKEND_SRC))

from app.engine.audit_engine import build_coverage_report  # noqa: E402


if __name__ == "__main__":
    print(json.dumps(build_coverage_report(), ensure_ascii=False, indent=2))
