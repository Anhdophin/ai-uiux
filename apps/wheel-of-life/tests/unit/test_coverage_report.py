from app.engine.audit_engine import build_coverage_report


def test_coverage_report_contains_expected_sections() -> None:
    report = build_coverage_report()
    assert report["keyword_coverage"]["node_count"] > 0
    assert report["persona_coverage"]["persona_count"] >= 4
    assert report["wheel_coverage"]["life_area_count"] >= 8
    assert "advisory" in report["gaps"]
