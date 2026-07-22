"""Context engine.

Builds a normalized context snapshot from API input before other engines consume it.
The v1 helper is preserved for backward scaffold clarity.
"""

from __future__ import annotations

from app.engine.context_snapshot_engine import build_context_snapshot_v2
from app.engine.mapping_engine import build_wheel_preview
from app.schemas.ai import AIDeepenRequest
from app.services.demo_service import build_demo_snapshot


def build_context_snapshot(payload: AIDeepenRequest) -> dict:
    snapshot = build_demo_snapshot(payload)
    snapshot['persona_summary'] = {
        'age_range': payload.context_profile.age_range,
        'gender': payload.context_profile.gender,
        'life_stage': payload.context_profile.life_stage,
        'career_stage': payload.context_profile.career_stage,
    }
    snapshot['wheel_preview'] = build_wheel_preview(payload.selected_keywords)
    snapshot['locale'] = payload.locale
    snapshot['user_reality_context'] = payload.user_reality_context.model_dump()
    return snapshot


def build_context_snapshot_strict(payload: AIDeepenRequest) -> dict:
    return build_context_snapshot_v2(payload)
