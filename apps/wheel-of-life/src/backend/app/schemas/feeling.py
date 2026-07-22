"""Schemas for feeling entry.

Feeling entry is the experiential doorway into deeper context.
"""

from pydantic import BaseModel, Field


class FeelingSelectionIn(BaseModel):
    feeling_id: str = Field(..., examples=["stuck", "unclear_direction", "pressure", "want_change"])
    intensity: int = Field(..., ge=1, le=5)
    frequency: str = Field(..., examples=["rare", "sometimes", "often", "daily"])
    note: str | None = None
