
"""Account lifecycle, consent, export, and delete schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class ConsentEventIn(BaseModel):
    pseudonymous_user_key: str
    scope: Literal['memory_linking', 'analytics_tracking', 'account_ready_export', 'account_ready_delete']
    granted: bool = True
    details: dict[str, Any] = Field(default_factory=dict)


class ConsentEventOut(BaseModel):
    event_id: str
    event_type: str
    pseudonymous_user_key: str
    scope: str
    created_at: datetime
    details: dict[str, Any] = Field(default_factory=dict)


class AccountLifecycleOut(BaseModel):
    pseudonymous_user_key: str
    lifecycle_state: str
    available_actions: list[str] = Field(default_factory=list)
    consent_events: list[ConsentEventOut] = Field(default_factory=list)


class AccountDataPreviewRequest(BaseModel):
    pseudonymous_user_key: str


class AccountDataPreviewOut(BaseModel):
    pseudonymous_user_key: str
    sessions: list[str] = Field(default_factory=list)
    memory_profiles: list[str] = Field(default_factory=list)
    identity_links: list[str] = Field(default_factory=list)
    audit_event_count: int = 0
    preview_label: str


class AccountExportOut(BaseModel):
    pseudonymous_user_key: str
    generated_at: datetime
    package_sections: dict[str, Any] = Field(default_factory=dict)


class AccountDeleteOut(BaseModel):
    pseudonymous_user_key: str
    deleted_sessions: list[str] = Field(default_factory=list)
    deleted_memory_profiles: list[str] = Field(default_factory=list)
    deleted_identity_links: list[str] = Field(default_factory=list)
    retained_audit_event_count: int = 0
    completed_at: datetime
    status_label: str
