
"""Append-only local audit event store for scaffold lifecycle events."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
AUDIT_DIR = ROOT / '.runtime' / 'audit-events'
AUDIT_DIR.mkdir(parents=True, exist_ok=True)


def _path(user_key: str) -> Path:
    return AUDIT_DIR / f'{user_key}.json'


def load_events(user_key: str) -> list[dict[str, Any]]:
    path = _path(user_key)
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding='utf-8'))


def append_event(user_key: str, payload: dict[str, Any]) -> None:
    events = load_events(user_key)
    events.append(payload)
    _path(user_key).write_text(json.dumps(events, indent=2, ensure_ascii=False, default=str), encoding='utf-8')
