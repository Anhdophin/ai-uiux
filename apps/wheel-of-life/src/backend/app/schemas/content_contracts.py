"""Content contract response schemas.

These responses expose only structural contract metadata, not business logic.
"""

from pydantic import BaseModel, Field, ConfigDict


class SeedBundleManifestItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    file: str
    schema_file: str = Field(alias="schema")


class SeedBundleManifestOut(BaseModel):
    version: str
    bundles: list[SeedBundleManifestItem] = Field(default_factory=list)


class SchemaValidationIssue(BaseModel):
    bundle_id: str
    message: str


class SchemaValidationReport(BaseModel):
    ok: bool
    checked_bundles: int
    issues: list[SchemaValidationIssue] = Field(default_factory=list)
