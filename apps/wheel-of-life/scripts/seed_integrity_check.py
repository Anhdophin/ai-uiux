#!/usr/bin/env python3
"""Seed integrity checker.

Run from project root:
    python scripts/seed_integrity_check.py
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND_SRC = ROOT / "src" / "backend"
if str(BACKEND_SRC) not in sys.path:
    sys.path.insert(0, str(BACKEND_SRC))

from app.engine.audit_engine import run_seed_audit


def main() -> int:
    report = run_seed_audit()
    if report["ok"]:
        print(f"Seed integrity OK — checked {report['node_count']} keyword nodes.")
        return 0

    print("Seed integrity FAILED")
    for key, issues in report["issues"].items():
        if issues:
            print(f" - {key}: {issues}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
