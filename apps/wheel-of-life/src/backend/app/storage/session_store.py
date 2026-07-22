"""Lightweight file-backed session repository.

This is intentionally simple so the foundation stays inspectable.
A database adapter can replace this module later without changing route contracts.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
SESSION_DIR = ROOT / '.runtime' / 'sessions'
SESSION_DIR.mkdir(parents=True, exist_ok=True)


def _session_path(session_id: str) -> Path:
    return SESSION_DIR / f'{session_id}.json'


def save_session(session_id: str, payload: dict[str, Any]) -> None:
    _session_path(session_id).write_text(json.dumps(payload, indent=2, ensure_ascii=False, default=str), encoding='utf-8')


def load_session(session_id: str) -> dict[str, Any] | None:
    path = _session_path(session_id)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding='utf-8'))


def delete_session(session_id: str) -> bool:
    path = _session_path(session_id)
    if not path.exists():
        return False
    path.unlink()
    return True
