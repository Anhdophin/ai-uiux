"""Schema and contract validator for curated content bundles.

This module is intentionally strict about structure but still easy to extend.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[4]
SEED_DIR = ROOT / "src" / "content" / "seed"
SCHEMA_DIR = ROOT / "src" / "content" / "schemas"


def _load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_manifest() -> dict[str, Any]:
    return _load_json(SEED_DIR / "manifest.v1.json")


def validate_seed_bundles() -> dict[str, Any]:
    manifest = load_manifest()
    issues: list[dict[str, str]] = []

    for bundle in manifest.get("bundles", []):
        bundle_id = bundle["id"]
        file_path = SEED_DIR / bundle["file"]
        schema_path = SCHEMA_DIR / bundle["schema"]

        try:
            data = _load_json(file_path)
        except FileNotFoundError:
            issues.append({"bundle_id": bundle_id, "message": f"missing file: {bundle['file']}"})
            continue

        try:
            schema = _load_json(schema_path)
        except FileNotFoundError:
            issues.append({"bundle_id": bundle_id, "message": f"missing schema: {bundle['schema']}"})
            continue

        validator = Draft202012Validator(schema)
        for error in validator.iter_errors(data):
            path = ".".join(str(part) for part in error.path) or "<root>"
            issues.append({"bundle_id": bundle_id, "message": f"{path}: {error.message}"})

    return {
        "ok": not issues,
        "checked_bundles": len(manifest.get("bundles", [])),
        "issues": issues,
    }
