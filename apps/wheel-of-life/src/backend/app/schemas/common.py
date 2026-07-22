"""Shared schema fragments.

Keep persistent/audit-related fields consistent across entities.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class TraceBase(BaseModel):
    id: str = Field(..., description="Stable identifier.")
    version: str = Field(default="v1", description="Schema or object version.")
    created_at: datetime | None = None
    updated_at: datetime | None = None
    source_type: str = Field(..., description="Must be one of: user, derived, ai, seed, system")
