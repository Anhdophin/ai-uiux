#!/usr/bin/env python3
"""Validate curated content bundles by schema and semantic audit.

Run from project root:
    python scripts/validate_content_bundle.py
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND_SRC = ROOT / "src" / "backend"
if str(BACKEND_SRC) not in sys.path:
    sys.path.insert(0, str(BACKEND_SRC))

from app.engine.audit_engine import run_seed_audit
from app.validators.seed_validator import validate_seed_bundles


def main() -> int:
    schema_report = validate_seed_bundles()
    audit_report = run_seed_audit()

    if not schema_report["ok"]:
        print("Schema validation FAILED")
        for issue in schema_report["issues"]:
            print(f" - [{issue['bundle_id']}] {issue['message']}")
        return 1

    if not audit_report["ok"]:
        print("Semantic audit FAILED")
        for group, issues in audit_report["issues"].items():
            if issues:
                print(f" - {group}: {issues}")
        return 1

    print(
        f"Content bundle OK — bundles={schema_report['checked_bundles']}, nodes={audit_report['node_count']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
