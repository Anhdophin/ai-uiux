"""Privacy / retention / identity-linking helpers."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from uuid import uuid4

from app.schemas.privacy import IdentityLinkCommitOut, IdentityLinkPreviewOut, RetentionPolicyOut, StorageBoundaryOut, StorageZoneOut
from app.services.content_loader import get_identity_linking_bundle, get_privacy_retention_bundle, get_storage_boundary_bundle
from app.services.locale_service import LocaleResolver
from app.storage.identity_store import save_identity_link


_HASH_SALT = 'scaffold-local-salt-not-for-production'


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _pseudo_key(external_user_ref: str, source_system: str, scope: str) -> str:
    payload = f'{_HASH_SALT}|{source_system}|{scope}|{external_user_ref}'.encode('utf-8')
    return 'usr_' + hashlib.sha256(payload).hexdigest()[:20]


def get_retention_policy(locale: str = 'en') -> RetentionPolicyOut:
    resolver = LocaleResolver(locale)
    cfg = get_privacy_retention_bundle()
    return RetentionPolicyOut(
        session_ttl_days=cfg['session_retention']['default_ttl_days'],
        memory_ttl_days=cfg['memory_retention']['default_ttl_days'],
        allow_manual_delete=cfg['session_retention']['allow_manual_delete'],
        allow_export_before_delete=cfg['session_retention']['allow_export_before_delete'],
        session_policy_label=resolver.resolve('privacy.retention.session'),
        memory_policy_label=resolver.resolve('privacy.retention.memory'),
    )


def get_storage_boundary(locale: str = 'en') -> StorageBoundaryOut:
    resolver = LocaleResolver(locale)
    bundle = get_storage_boundary_bundle()
    zones = [StorageZoneOut(id=z['id'], label=resolver.resolve(z['label_key']), contains=z.get('contains', [])) for z in bundle.get('zones', [])]
    return StorageBoundaryOut(version=bundle.get('version', 'v1'), zones=zones, boundaries=bundle.get('boundaries', []))


def build_identity_link_preview(external_user_ref: str, link_scope: str, source_system: str, session_ids: list[str], memory_profile_keys: list[str], locale: str = 'en') -> IdentityLinkPreviewOut:
    pseudo = _pseudo_key(external_user_ref=external_user_ref, source_system=source_system, scope=link_scope)
    resolver = LocaleResolver(locale)
    return IdentityLinkPreviewOut(
        link_scope=link_scope,
        source_system=source_system,
        pseudonymous_user_key=pseudo,
        session_ids=session_ids,
        memory_profile_keys=memory_profile_keys,
        preview_label=resolver.resolve('privacy.identity.preview_ready'),
    )


def commit_identity_link(preview: IdentityLinkPreviewOut) -> IdentityLinkCommitOut:
    record = IdentityLinkCommitOut(
        link_id='link_' + uuid4().hex[:12],
        pseudonymous_user_key=preview.pseudonymous_user_key,
        link_scope=preview.link_scope,
        source_system=preview.source_system,
        created_at=_now(),
        session_ids=preview.session_ids,
        memory_profile_keys=preview.memory_profile_keys,
    )
    save_identity_link(record.link_id, record.model_dump(mode='json'))
    return record
