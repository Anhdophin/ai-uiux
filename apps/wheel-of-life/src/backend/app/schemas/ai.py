"""Schemas for AI requests and validated outputs.

Even scaffold responses should follow a predictable contract.
Visible text is not the source of truth. The request must carry locale and structured context.
"""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.context import ContextProfileIn
from app.schemas.feeling import FeelingSelectionIn
from app.schemas.user_context import UserRealityContextIn


class SelectableOptionOut(BaseModel):
    option_key: str
    label: str
    suggested_keyword_ids: list[str] = Field(default_factory=list)


class SelectablePromptOut(BaseModel):
    id: str
    question: str
    options: list[str] = Field(default_factory=list)
    option_items: list[SelectableOptionOut] = Field(default_factory=list)
    suggested_keyword_ids: list[str] = Field(default_factory=list)
    question_key: str | None = None
    option_keys: list[str] = Field(default_factory=list)


class AIDeepenRequest(BaseModel):
    locale: str = Field(default='vi', examples=['vi', 'en'])
    mode: str = Field(..., examples=['clarify_context', 'deepen_selection', 'map_pattern'])
    context_profile: ContextProfileIn
    user_reality_context: UserRealityContextIn
    feeling: FeelingSelectionIn
    selected_keywords: list[str] = Field(default_factory=list)
    reflection_snippet: str | None = None


class AIDeepenResponse(BaseModel):
    locale: str = Field(default='vi')
    summary: str
    possible_patterns: list[str]
    follow_up_questions: list[str]
    next_keyword_paths: list[str]
    selectable_options: list[str] = Field(default_factory=list)
    selectable_prompt: SelectablePromptOut | None = None
    confidence_note: str
