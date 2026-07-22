"""Wheel preview schemas."""

from pydantic import BaseModel, Field


class LifeAreaEvidenceOut(BaseModel):
    node_id: str
    label: str
    weight: float


class WheelAreaScoreOut(BaseModel):
    life_area_id: str
    life_area_label: str
    score: float
    evidence: list[LifeAreaEvidenceOut] = Field(default_factory=list)


class WheelPreviewRequest(BaseModel):
    selected_keyword_ids: list[str]


class WheelPreviewResponse(BaseModel):
    coverage_count: int
    life_area_scores: list[WheelAreaScoreOut]
