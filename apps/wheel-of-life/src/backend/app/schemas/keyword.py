"""Keyword graph schemas.

These schemas keep keyword graph responses typed for frontend exploration.
"""

from pydantic import BaseModel, Field


class KeywordNodeOut(BaseModel):
    id: str
    label: str
    short_meaning: str | None = None
    long_meaning: str | None = None
    depth: int
    kind: str
    parent_ids: list[str] = Field(default_factory=list)
    child_ids: list[str] = Field(default_factory=list)
    related_node_ids: list[str] = Field(default_factory=list)
    life_area_weights: dict[str, float] = Field(default_factory=dict)
    persona_tags: list[str] = Field(default_factory=list)
    reflection_prompts: list[str] = Field(default_factory=list)
    clarifying_prompts: list[str] = Field(default_factory=list)
    ai_hints: list[str] = Field(default_factory=list)
    audit_tags: list[str] = Field(default_factory=list)
    status: str | None = None
    version: str | None = None


class KeywordOverviewResponse(BaseModel):
    nodes: list[KeywordNodeOut]


class KeywordChildrenResponse(BaseModel):
    node: KeywordNodeOut
    children: list[KeywordNodeOut]
    related: list[KeywordNodeOut]
