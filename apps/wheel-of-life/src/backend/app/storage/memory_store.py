"""File-backed cross-session memory repository."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
MEMORY_DIR = ROOT / '.runtime' / 'memory'
MEMORY_DIR.mkdir(parents=True, exist_ok=True)


def _path(profile_key: str) -> Path:
    return MEMORY_DIR / f'{profile_key}.json'


def load_memory(profile_key: str) -> dict[str, Any] | None:
    path = _path(profile_key)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding='utf-8'))


def save_memory(profile_key: str, payload: dict[str, Any]) -> None:
    _path(profile_key).write_text(json.dumps(payload, indent=2, ensure_ascii=False, default=str), encoding='utf-8')


def delete_memory(profile_key: str) -> bool:
    path = _path(profile_key)
    if not path.exists():
        return False
    path.unlink()
    return True
