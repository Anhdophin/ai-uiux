"""Session orchestration engine.

This engine owns selection-first session writes, trail creation, and prompt refresh.
Routes should stay thin and call into this module.
"""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException

from app.engine.mapping_engine import build_wheel_preview
from app.engine.option_resolution_engine import resolve_option
from app.engine.prompt_builder import build_prompt
from app.schemas.ai import SelectablePromptOut
from app.schemas.session import ContextTrailEventOut, SessionStateOut
from app.schemas.wheel import WheelPreviewResponse
from app.services.locale_service import LocaleResolver
from app.storage.session_store import load_session, save_session


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _new_event(event_type: str, label: str, metadata: dict | None = None) -> ContextTrailEventOut:
    return ContextTrailEventOut(event_id=f'evt_{uuid4().hex[:12]}', event_type=event_type, label=label, created_at=_now(), metadata=metadata or {})


def _load_state(session_id: str) -> SessionStateOut:
    payload = load_session(session_id)
    if not payload:
        raise HTTPException(status_code=404, detail='Session not found')
    return SessionStateOut(**payload)


def _save_state(state: SessionStateOut) -> SessionStateOut:
    save_session(state.session_id, state.model_dump(mode='json'))
    return state


def initialize_session(locale: str, context_profile, user_reality_context) -> SessionStateOut:
    resolver = LocaleResolver(locale)
    state = SessionStateOut(session_id=f'sess_{uuid4().hex[:12]}', locale=locale, context_profile=context_profile, user_reality_context=user_reality_context, selected_feeling=None, selected_keyword_ids=[], reflection_snippet=None, latest_mode='deepen_selection', latest_selectable_prompt=None, wheel_preview=WheelPreviewResponse(**build_wheel_preview([])), trail=[_new_event('context_initialized', resolver.resolve('trail.event.context_initialized'), metadata={'age_range': context_profile.age_range, 'life_stage': context_profile.life_stage, 'life_setup': user_reality_context.life_setup})], trail_compactions=[], resume_checkpoint=None)
    return _save_state(state)


def get_session(session_id: str) -> SessionStateOut:
    return _load_state(session_id)


def apply_selection(session_id: str, event_type: str, selected_id: str | None = None, note_fragment: str | None = None) -> SessionStateOut:
    state = _load_state(session_id)
    resolver = LocaleResolver(state.locale)
    metadata: dict = {}
    if event_type == 'feeling_selected':
        state.selected_feeling = selected_id
        if selected_id and selected_id not in state.selected_keyword_ids:
            state.selected_keyword_ids.append(selected_id)
        metadata['selected_id'] = selected_id
    elif event_type == 'keyword_selected':
        if selected_id and selected_id not in state.selected_keyword_ids:
            state.selected_keyword_ids.append(selected_id)
        metadata['selected_id'] = selected_id
    elif event_type == 'keyword_deselected':
        if selected_id in state.selected_keyword_ids:
            state.selected_keyword_ids = [item for item in state.selected_keyword_ids if item != selected_id]
        metadata['selected_id'] = selected_id
    elif event_type == 'reflection_updated':
        state.reflection_snippet = note_fragment
        metadata['has_note_fragment'] = bool(note_fragment)
    else:
        raise HTTPException(status_code=400, detail='Unsupported session event type')
    state.wheel_preview = WheelPreviewResponse(**build_wheel_preview(state.selected_keyword_ids))
    state.trail.append(_new_event(event_type, resolver.resolve(f'trail.event.{event_type}'), metadata=metadata))
    return _save_state(state)


def refresh_prompt(session_id: str) -> SessionStateOut:
    state = _load_state(session_id)
    snapshot = {'locale': state.locale, 'mode': state.latest_mode, 'persona_summary': state.context_profile.model_dump(), 'user_reality_context': state.user_reality_context.model_dump(), 'selected_feeling': state.selected_feeling, 'selected_keywords': state.selected_keyword_ids, 'reflection_snippet': state.reflection_snippet, 'wheel_preview': state.wheel_preview.model_dump() if state.wheel_preview else {}}
    prompt_payload = build_prompt(snapshot)
    selectable_prompt = prompt_payload.get('selectable_prompt')
    state.latest_selectable_prompt = SelectablePromptOut(**selectable_prompt) if selectable_prompt else None
    if state.latest_selectable_prompt:
        resolver = LocaleResolver(state.locale)
        state.trail.append(_new_event('ai_prompt_generated', resolver.resolve('trail.event.ai_prompt_generated'), metadata={'prompt_id': state.latest_selectable_prompt.id}))
    return _save_state(state)


def resolve_ai_option(session_id: str, prompt_pack_id: str, option_key: str) -> dict:
    state = _load_state(session_id)
    contract = resolve_option(prompt_pack_id, option_key)
    if not contract:
        raise HTTPException(status_code=404, detail='AI option resolution not found')
    resolver = LocaleResolver(state.locale)
    added = []
    for node_id in contract.get('append_keyword_ids', []):
        if node_id not in state.selected_keyword_ids:
            state.selected_keyword_ids.append(node_id)
            added.append(node_id)
    state.latest_mode = contract.get('next_mode') or state.latest_mode
    state.wheel_preview = WheelPreviewResponse(**build_wheel_preview(state.selected_keyword_ids))
    event = _new_event('ai_option_resolved', resolver.resolve(contract.get('trail_label_key')), metadata={'prompt_pack_id': prompt_pack_id, 'option_key': option_key, 'added_keyword_ids': added, 'focus_tags': contract.get('focus_tags', [])})
    state.trail.append(event)
    _save_state(state)
    return {'session_id': state.session_id, 'prompt_pack_id': prompt_pack_id, 'option_key': option_key, 'added_keyword_ids': added, 'next_mode': state.latest_mode, 'trail_event': event, 'wheel_preview': state.wheel_preview}
