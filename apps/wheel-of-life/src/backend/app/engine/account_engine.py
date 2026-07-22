
"""Account lifecycle / export / delete scaffold engine."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.schemas.account import (
    AccountDataPreviewOut,
    AccountDeleteOut,
    AccountExportOut,
    AccountLifecycleOut,
    ConsentEventOut,
)
from app.services.content_loader import get_account_lifecycle_bundle, get_export_delete_flows_bundle
from app.services.locale_service import LocaleResolver
from app.storage.audit_store import append_event, load_events
from app.storage.identity_store import delete_identity_link, list_identity_links
from app.storage.memory_store import delete_memory
from app.storage.session_store import delete_session


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _emit(user_key: str, event_type: str, scope: str, details: dict | None = None) -> ConsentEventOut:
    event = ConsentEventOut(
        event_id='evt_' + uuid4().hex[:12],
        event_type=event_type,
        pseudonymous_user_key=user_key,
        scope=scope,
        created_at=_now(),
        details=details or {},
    )
    append_event(user_key, event.model_dump(mode='json'))
    return event


def _linked_resources(user_key: str) -> tuple[list[str], list[str], list[str]]:
    sessions: list[str] = []
    memories: list[str] = []
    link_ids: list[str] = []
    for item in list_identity_links():
        if item.get('pseudonymous_user_key') == user_key:
            link_ids.append(item.get('link_id'))
            sessions.extend(item.get('session_ids', []))
            memories.extend(item.get('memory_profile_keys', []))
    return sorted(set(sessions)), sorted(set(memories)), sorted(set(link_ids))


def get_account_lifecycle(user_key: str) -> AccountLifecycleOut:
    bundle = get_account_lifecycle_bundle()
    events = [ConsentEventOut(**e) for e in load_events(user_key)]
    sessions, memories, links = _linked_resources(user_key)
    if links:
        state = 'pseudonymous_linked'
    else:
        state = 'anonymous_session'
    if any(e.event_type == 'delete_completed' for e in events):
        state = 'deleted_local'
    action_map = {
        'anonymous_session': ['link_identity'],
        'pseudonymous_linked': ['preview_export', 'preview_delete', 'record_consent'],
        'account_ready': ['preview_export', 'preview_delete', 'record_consent'],
        'deleted_local': [],
    }
    if sessions or memories:
        action_map.setdefault(state, [])
    return AccountLifecycleOut(
        pseudonymous_user_key=user_key,
        lifecycle_state=state,
        available_actions=action_map.get(state, ['record_consent']),
        consent_events=events,
    )


def record_consent(user_key: str, scope: str, granted: bool, details: dict | None = None) -> ConsentEventOut:
    event_type = 'consent_granted' if granted else 'consent_withdrawn'
    return _emit(user_key, event_type, scope, details)


def preview_export(user_key: str, locale: str = 'en') -> AccountDataPreviewOut:
    resolver = LocaleResolver(locale)
    sessions, memories, links = _linked_resources(user_key)
    return AccountDataPreviewOut(
        pseudonymous_user_key=user_key,
        sessions=sessions,
        memory_profiles=memories,
        identity_links=links,
        audit_event_count=len(load_events(user_key)),
        preview_label=resolver.resolve('account.export.preview_ready'),
    )


def export_account_data(user_key: str, locale: str = 'en') -> AccountExportOut:
    flows = get_export_delete_flows_bundle()
    preview = preview_export(user_key, locale)
    _emit(user_key, 'export_requested', 'account_ready_export', {'session_count': len(preview.sessions)})
    package = {
        'sessions': preview.sessions,
        'memory_profiles': preview.memory_profiles,
        'identity_links': preview.identity_links,
        'audit_events': load_events(user_key),
        'sections_config': flows.get('export', {}),
    }
    _emit(user_key, 'export_generated', 'account_ready_export', {'sections': list(package.keys())})
    return AccountExportOut(pseudonymous_user_key=user_key, generated_at=_now(), package_sections=package)


def preview_delete(user_key: str, locale: str = 'en') -> AccountDataPreviewOut:
    resolver = LocaleResolver(locale)
    sessions, memories, links = _linked_resources(user_key)
    return AccountDataPreviewOut(
        pseudonymous_user_key=user_key,
        sessions=sessions,
        memory_profiles=memories,
        identity_links=links,
        audit_event_count=len(load_events(user_key)),
        preview_label=resolver.resolve('account.delete.preview_ready'),
    )


def delete_account_data(user_key: str, locale: str = 'en') -> AccountDeleteOut:
    resolver = LocaleResolver(locale)
    preview = preview_delete(user_key, locale)
    _emit(user_key, 'delete_requested', 'account_ready_delete', {'session_count': len(preview.sessions)})
    deleted_sessions = [sid for sid in preview.sessions if delete_session(sid)]
    deleted_memory = [mid for mid in preview.memory_profiles if delete_memory(mid)]
    deleted_links = [lid for lid in preview.identity_links if delete_identity_link(lid)]
    done = AccountDeleteOut(
        pseudonymous_user_key=user_key,
        deleted_sessions=deleted_sessions,
        deleted_memory_profiles=deleted_memory,
        deleted_identity_links=deleted_links,
        retained_audit_event_count=len(load_events(user_key)) + 1,
        completed_at=_now(),
        status_label=resolver.resolve('account.delete.completed'),
    )
    _emit(user_key, 'delete_completed', 'account_ready_delete', {'deleted_sessions': len(deleted_sessions), 'deleted_memory_profiles': len(deleted_memory), 'deleted_identity_links': len(deleted_links)})
    return done
