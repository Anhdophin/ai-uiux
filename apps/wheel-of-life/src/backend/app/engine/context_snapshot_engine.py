"""Build normalized context snapshots for AI and downstream engines.

This engine merges persona-facing profile info with the user's actual selected reality context.
Future AI calls should depend on this output instead of raw request bodies.
"""

from __future__ import annotations

from app.engine.mapping_engine import build_wheel_preview
from app.schemas.ai import AIDeepenRequest


def build_context_snapshot_v2(payload: AIDeepenRequest) -> dict:
    wheel_preview = build_wheel_preview(payload.selected_keywords)
    return {
        'locale': payload.locale,
        'persona_summary': {
            'age_range': payload.context_profile.age_range,
            'gender': payload.context_profile.gender,
            'life_stage': payload.context_profile.life_stage,
            'career_stage': payload.context_profile.career_stage,
            'goals': payload.context_profile.goals,
            'concerns': payload.context_profile.concerns,
        },
        'user_reality_context': payload.user_reality_context.model_dump(),
        'selected_feeling': payload.feeling.feeling_id,
        'selected_keywords': payload.selected_keywords,
        'reflection_snippet': payload.reflection_snippet,
        'wheel_preview': wheel_preview,
        'mode': payload.mode,
    }
