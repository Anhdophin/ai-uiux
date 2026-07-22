"""Resolve AI selectable options into structured session updates.

The goal is to keep AI interactions auditable and selection-first.
An option pick becomes typed state, not just another chat message.
"""

from __future__ import annotations

from app.services.content_loader import get_ai_option_resolutions


def resolve_option(prompt_pack_id: str, option_key: str) -> dict | None:
    for item in get_ai_option_resolutions():
        if item.get('prompt_pack_id') == prompt_pack_id and item.get('option_key') == option_key:
            return item
    return None
