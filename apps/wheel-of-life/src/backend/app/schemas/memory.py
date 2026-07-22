"""Cross-session memory, pattern detection, and wheel history contracts."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class MemorySnapshotOut(BaseModel):
    snapshot_id: str
    source_session_id: str
    profile_key: str
    captured_at: datetime
    selected_feeling: str | None = None
    keyword_ids: list[str] = Field(default_factory=list)
    top_life_area_ids: list[str] = Field(default_factory=list)
    trail_event_ids: list[str] = Field(default_factory=list)


class PatternSignalOut(BaseModel):
    id: str
    type: Literal['recurring_focus', 'persistent_wheel_pressure', 'stability_signal', 'oscillation_signal']
    label: str
    evidence_snapshot_ids: list[str] = Field(default_factory=list)
    evidence_keyword_ids: list[str] = Field(default_factory=list)
    evidence_life_area_ids: list[str] = Field(default_factory=list)
    confidence: float = 0.0
    note: str | None = None


class WheelHistoryPointOut(BaseModel):
    snapshot_id: str
    source_session_id: str
    captured_at: datetime
    life_area_scores: dict[str, float] = Field(default_factory=dict)
    evidence_keyword_ids: dict[str, list[str]] = Field(default_factory=dict)


class CrossSessionMemoryOut(BaseModel):
    profile_key: str
    snapshot_count: int = 0
    latest_snapshot: MemorySnapshotOut | None = None
    latest_summary_label: str
    recent_snapshot_ids: list[str] = Field(default_factory=list)


class PatternDetectionOut(BaseModel):
    profile_key: str
    pattern_count: int = 0
    patterns: list[PatternSignalOut] = Field(default_factory=list)


class WheelHistoryOut(BaseModel):
    profile_key: str
    point_count: int = 0
    points: list[WheelHistoryPointOut] = Field(default_factory=list)
