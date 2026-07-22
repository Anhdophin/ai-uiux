"""Persona schemas.

These models exist to keep persona context explicit and typed.
Future AI agents should extend this module instead of hiding persona logic
inside route handlers or frontend-only config files.
"""

from pydantic import BaseModel, Field


class PersonaProfileOut(BaseModel):
    id: str
    age_band: str
    gender: str
    life_stage: str
    career_stage: str
    dominant_goals: list[str] = Field(default_factory=list)
    dominant_pressures: list[str] = Field(default_factory=list)
    likely_blind_spots: list[str] = Field(default_factory=list)
    priority_life_areas: list[str] = Field(default_factory=list)
    suggested_entry_keyword_ids: list[str] = Field(default_factory=list)
    ai_tone_hints: list[str] = Field(default_factory=list)
    version: str | None = None
