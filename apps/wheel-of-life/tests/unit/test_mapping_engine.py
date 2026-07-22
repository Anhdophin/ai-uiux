"""Unit tests for deterministic mapping engine."""

from app.engine.mapping_engine import build_wheel_preview


def test_build_wheel_preview_returns_scores_for_known_nodes():
    payload = build_wheel_preview(["pressure_money", "ud_future"])
    assert payload["coverage_count"] >= 1
    assert any(item["life_area_id"] == "finance" for item in payload["life_area_scores"])
