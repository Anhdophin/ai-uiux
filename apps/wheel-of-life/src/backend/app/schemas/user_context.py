"""Schemas for locale and user reality context.

These models support selection-first context capture.
They are intentionally small and close to the seed contracts.
"""

from pydantic import BaseModel, Field


class UserRealityContextIn(BaseModel):
    locale: str = Field(default='vi', examples=['vi', 'en'])
    life_setup: str
    current_pressures: list[str] = Field(default_factory=list)
    current_goals: list[str] = Field(default_factory=list)
    constraints: list[str] = Field(default_factory=list)
    readiness_level: str
    custom_keywords: list[str] = Field(default_factory=list, max_length=3)
    note_fragment: str | None = None


class ContextSnapshotOut(BaseModel):
    locale: str
    persona_summary: dict
    user_reality_context: dict
    selected_keywords: list[str]
    selected_feeling: str | None = None
    wheel_preview: dict | None = None
