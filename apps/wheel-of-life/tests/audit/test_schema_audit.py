from app.engine.audit_engine import run_seed_audit


def test_seed_audit_has_no_schema_or_semantic_failures() -> None:
    report = run_seed_audit()
    assert report["ok"] is True
    assert report["schema_checked_bundles"] >= 6
    assert report["issues"]["schema_validation"] == []
    assert report["issues"]["duplicate_node_ids"] == []
