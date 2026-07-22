"""Session analytics, compaction, and resume logic.

This module keeps long-session support derived and auditable.
"""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException

from app.schemas.session import ContextTrailEventOut, SessionStateOut, ResumeCheckpointOut
from app.schemas.session_analytics import ResumeActionOut, SessionAnalyticsOut, SessionResumePlanOut, TrailCompactionOut
from app.services.content_loader import get_session_analytics_bundle
from app.services.locale_service import LocaleResolver
from app.storage.session_store import load_session, save_session


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _load_state(session_id: str) -> SessionStateOut:
    payload = load_session(session_id)
    if not payload:
        raise HTTPException(status_code=404, detail='Session not found')
    return SessionStateOut(**payload)


def _save_state(state: SessionStateOut) -> SessionStateOut:
    save_session(state.session_id, state.model_dump(mode='json'))
    return state


def _thresholds() -> dict:
    return get_session_analytics_bundle()


def build_session_analytics(session_id: str) -> SessionAnalyticsOut:
    state = _load_state(session_id)
    cfg = _thresholds()
    total_events = len(state.trail)
    event_types = [event.event_type for event in state.trail]
    counts = Counter(event_types)
    if total_events <= cfg['engagement_stage_thresholds']['early_max_events']:
        stage = 'early'
    elif total_events >= cfg['engagement_stage_thresholds']['deep_min_events']:
        stage = 'deep'
    else:
        stage = 'active'
    readiness = 'low'
    if state.selected_keyword_ids:
        readiness = 'medium'
    if state.selected_keyword_ids and state.latest_selectable_prompt:
        readiness = 'high'
    return SessionAnalyticsOut(
        session_id=state.session_id,
        total_events=total_events,
        distinct_event_types=sorted(set(event_types)),
        selected_keyword_count=len(state.selected_keyword_ids),
        selected_feeling=state.selected_feeling,
        prompt_generated_count=counts.get('ai_prompt_generated', 0),
        ai_option_resolved_count=counts.get('ai_option_resolved', 0),
        compaction_count=len(state.trail_compactions),
        engagement_stage=stage,
        resume_readiness=readiness,
    )


def compact_session_trail(session_id: str) -> SessionStateOut:
    state = _load_state(session_id)
    cfg = _thresholds()
    total_events = len(state.trail)
    if total_events <= cfg['compact_after_events']:
        return state
    keep_recent = min(cfg['keep_recent_events'], total_events)
    old_events = state.trail[:-keep_recent]
    recent_events = state.trail[-keep_recent:]
    counts = Counter(event.event_type for event in old_events)
    resolver = LocaleResolver(state.locale)
    summary_label = resolver.resolve('trail.event.trail_compacted')
    compaction = TrailCompactionOut(
        compaction_id=f'cmp_{uuid4().hex[:12]}',
        created_at=_now(),
        from_event_count=len(old_events),
        to_event_count=1,
        compressed_event_ids=[event.event_id for event in old_events],
        event_type_counts=dict(counts),
        summary_label=summary_label,
    )
    compacted_event = ContextTrailEventOut(
        event_id=f'evt_{uuid4().hex[:12]}',
        event_type='trail_compacted',
        label=summary_label,
        created_at=_now(),
        metadata={'compaction_id': compaction.compaction_id, 'compressed_event_count': len(old_events), 'event_type_counts': dict(counts)},
    )
    state.trail = [compacted_event, *recent_events]
    state.trail_compactions.append(compaction)
    return _save_state(state)


def build_resume_plan(session_id: str) -> SessionResumePlanOut:
    state = _load_state(session_id)
    cfg = _thresholds()
    resolver = LocaleResolver(state.locale)
    recent = state.trail[-cfg['resume_max_recent_events']:] if state.trail else []
    summary_key = 'resume.summary.need_more_structure'
    actions = ['refresh_ai_prompt']
    if state.selected_keyword_ids:
        summary_key = 'resume.summary.ready_to_continue'
        actions = ['continue_keyword_exploration', 'review_wheel_preview']
        if state.latest_selectable_prompt:
            actions.append('refresh_ai_prompt')
    action_defs = {item['id']: item['label_key'] for item in cfg.get('resume_actions', [])}
    recommended_actions = [ResumeActionOut(id=action_id, label=resolver.resolve(action_defs[action_id])) for action_id in actions if action_id in action_defs]
    plan = SessionResumePlanOut(
        session_id=state.session_id,
        summary_key=summary_key,
        summary_label=resolver.resolve(summary_key),
        latest_mode=state.latest_mode,
        recommended_actions=recommended_actions,
        recent_event_ids=[event.event_id for event in recent],
        suggested_keyword_ids=state.selected_keyword_ids[-3:],
    )
    state.resume_checkpoint = ResumeCheckpointOut(
        checkpoint_id=f'res_{uuid4().hex[:12]}',
        created_at=_now(),
        summary_key=plan.summary_key,
        summary_label=plan.summary_label,
        recent_event_ids=plan.recent_event_ids,
        suggested_keyword_ids=plan.suggested_keyword_ids,
    )
    _save_state(state)
    return plan
