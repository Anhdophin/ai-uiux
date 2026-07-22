"""Privacy, retention, and identity-linking contracts.

These types keep account-ready expansion separated from core session logic.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class RetentionPolicyOut(BaseModel):
    session_ttl_days: int
    memory_ttl_days: int
    allow_manual_delete: bool = True
    allow_export_before_delete: bool = True
    session_policy_label: str
    memory_policy_label: str


class StorageZoneOut(BaseModel):
    id: str
    label: str
    contains: list[str] = Field(default_factory=list)


class StorageBoundaryOut(BaseModel):
    version: str = 'v1'
    zones: list[StorageZoneOut] = Field(default_factory=list)
    boundaries: list[str] = Field(default_factory=list)


class IdentityLinkPreviewRequest(BaseModel):
    external_user_ref: str
    link_scope: Literal['anonymous_local', 'device_linked', 'account_ready'] = 'anonymous_local'
    source_system: str = 'local_demo'
    session_ids: list[str] = Field(default_factory=list)
    memory_profile_keys: list[str] = Field(default_factory=list)


class IdentityLinkPreviewOut(BaseModel):
    link_scope: str
    source_system: str
    pseudonymous_user_key: str
    session_ids: list[str] = Field(default_factory=list)
    memory_profile_keys: list[str] = Field(default_factory=list)
    preview_label: str


class IdentityLinkCommitOut(BaseModel):
    link_id: str
    pseudonymous_user_key: str
    link_scope: str
    source_system: str
    created_at: datetime
    session_ids: list[str] = Field(default_factory=list)
    memory_profile_keys: list[str] = Field(default_factory=list)
