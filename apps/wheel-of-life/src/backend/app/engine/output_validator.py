"""Validate AI output shape before returning it to UI.

This keeps the contract stable even if provider logic changes later.
"""

from __future__ import annotations

from app.schemas.ai import AIDeepenResponse


def validate_ai_output(payload: dict) -> AIDeepenResponse:
    return AIDeepenResponse(**payload)
