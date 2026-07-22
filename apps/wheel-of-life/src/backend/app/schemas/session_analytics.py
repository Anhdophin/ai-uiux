"""Session analytics, compaction, and resume contracts.

These models keep long-session support structured and auditable.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class SessionAnalyticsOut(BaseModel):
    session_id: str
    total_events: int
    distinct_event_types: list[str] = Field(default_factory=list)
    selected_keyword_count: int = 0
    selected_feeling: str | None = None
    prompt_generated_count: int = 0
    ai_option_resolved_count: int = 0
    compaction_count: int = 0
    engagement_stage: Literal['early', 'active', 'deep'] = 'early'
    resume_readiness: Literal['low', 'medium', 'high'] = 'low'


class TrailCompactionOut(BaseModel):
    compaction_id: str
    created_at: datetime
    from_event_count: int
    to_event_count: int
    compressed_event_ids: list[str] = Field(default_factory=list)
    event_type_counts: dict[str, int] = Field(default_factory=dict)
    summary_label: str


class ResumeActionOut(BaseModel):
    id: str
    label: str


class SessionResumePlanOut(BaseModel):
    session_id: str
    summary_key: str
    summary_label: str
    latest_mode: str
    recommended_actions: list[ResumeActionOut] = Field(default_factory=list)
    recent_event_ids: list[str] = Field(default_factory=list)
    suggested_keyword_ids: list[str] = Field(default_factory=list)
