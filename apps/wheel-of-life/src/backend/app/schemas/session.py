"""Session and trail schemas.

These contracts keep the selection-first session model typed and auditable.
Do not replace them with loose dict writes from routes or UI code.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.context import ContextProfileIn
from app.schemas.user_context import UserRealityContextIn
from app.schemas.wheel import WheelPreviewResponse
from app.schemas.ai import SelectablePromptOut
from app.schemas.session_analytics import TrailCompactionOut


class ContextTrailEventOut(BaseModel):
    event_id: str
    event_type: str
    label: str
    created_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)



class ResumeCheckpointOut(BaseModel):
    checkpoint_id: str
    created_at: datetime
    summary_key: str
    summary_label: str
    recent_event_ids: list[str] = Field(default_factory=list)
    suggested_keyword_ids: list[str] = Field(default_factory=list)


class SessionInitializeRequest(BaseModel):
    locale: str = Field(default='vi')
    context_profile: ContextProfileIn
    user_reality_context: UserRealityContextIn


class SessionSelectionApplyRequest(BaseModel):
    event_type: Literal['feeling_selected', 'keyword_selected', 'keyword_deselected', 'reflection_updated']
    selected_id: str | None = None
    note_fragment: str | None = None


class AIOptionResolveRequest(BaseModel):
    prompt_pack_id: str
    option_key: str


class AIOptionResolveResponse(BaseModel):
    session_id: str
    prompt_pack_id: str
    option_key: str
    added_keyword_ids: list[str] = Field(default_factory=list)
    next_mode: str | None = None
    trail_event: ContextTrailEventOut
    wheel_preview: WheelPreviewResponse


class SessionStateOut(BaseModel):
    session_id: str
    locale: str
    context_profile: ContextProfileIn
    user_reality_context: UserRealityContextIn
    selected_feeling: str | None = None
    selected_keyword_ids: list[str] = Field(default_factory=list)
    reflection_snippet: str | None = None
    latest_mode: str = 'deepen_selection'
    latest_selectable_prompt: SelectablePromptOut | None = None
    wheel_preview: WheelPreviewResponse | None = None
    trail: list[ContextTrailEventOut] = Field(default_factory=list)
    trail_compactions: list[TrailCompactionOut] = Field(default_factory=list)
    resume_checkpoint: ResumeCheckpointOut | None = None
