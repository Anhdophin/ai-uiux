"""File-backed identity link store.

This is a local scaffold-only repository for pseudonymous identity mappings.
It intentionally stores minimized records and excludes raw external references.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
IDENTITY_DIR = ROOT / '.runtime' / 'identity-links'
IDENTITY_DIR.mkdir(parents=True, exist_ok=True)


def _path(link_id: str) -> Path:
    return IDENTITY_DIR / f'{link_id}.json'


def save_identity_link(link_id: str, payload: dict[str, Any]) -> None:
    _path(link_id).write_text(json.dumps(payload, indent=2, ensure_ascii=False, default=str), encoding='utf-8')


def list_identity_links() -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for path in sorted(IDENTITY_DIR.glob('*.json')):
        out.append(json.loads(path.read_text(encoding='utf-8')))
    return out


def delete_identity_link(link_id: str) -> bool:
    path = _path(link_id)
    if not path.exists():
        return False
    path.unlink()
    return True
