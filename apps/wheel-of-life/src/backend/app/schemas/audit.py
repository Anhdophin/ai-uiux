"""Audit schemas.

Keep audit output typed and stable.
Audit is a first-class part of this app foundation, not a debug afterthought.
"""

from pydantic import BaseModel, Field


class AuditIssueOut(BaseModel):
    severity: str
    domain: str
    entity_id: str | None = None
    rule_id: str
    message: str


class AuditSummaryOut(BaseModel):
    critical: int = 0
    major: int = 0
    minor: int = 0
    info: int = 0


class AuditReportOut(BaseModel):
    ok: bool
    summary: AuditSummaryOut
    issues: list[AuditIssueOut] = Field(default_factory=list)
