"""Lightweight helpers for local scaffold demos.

This file should remain small. Complex logic belongs in engines.
"""

from __future__ import annotations

from app.schemas.ai import AIDeepenRequest
from app.services.content_loader import get_keyword_node_map


def get_keyword_labels(keyword_ids: list[str]) -> list[str]:
    node_map = get_keyword_node_map()
    return [node_map[item]["label"] for item in keyword_ids if item in node_map]


def build_demo_snapshot(payload: AIDeepenRequest) -> dict:
    return {
        "mode": payload.mode,
        "context_profile": payload.context_profile.model_dump(),
        "feeling": payload.feeling.model_dump(),
        "selected_keyword_ids": payload.selected_keywords,
        "selected_keyword_labels": get_keyword_labels(payload.selected_keywords),
        "reflection_snippet": payload.reflection_snippet,
    }
