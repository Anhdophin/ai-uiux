"""Schemas for persona / identity context.

These are raw user-facing input contracts, not database models.
They capture broad profile context, not the user's current practical situation.
Use UserRealityContextIn for the actual present-life situation.
"""

from pydantic import BaseModel, Field


class ContextProfileIn(BaseModel):
    age_range: str = Field(..., examples=['20-24', '25-29', '30-34', '35-44'])
    gender: str = Field(..., examples=['male', 'female', 'other', 'prefer_not_to_say'])
    life_stage: str = Field(..., examples=['studying', 'graduating_soon', 'working', 'career_change'])
    career_stage: str = Field(..., examples=['newbie', 'early', 'mid', 'transition', 'builder'])
    goals: list[str] = Field(default_factory=list)
    concerns: list[str] = Field(default_factory=list)
