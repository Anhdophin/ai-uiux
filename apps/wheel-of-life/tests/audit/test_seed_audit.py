"""Audit tests for seed integrity."""

from app.engine.audit_engine import run_seed_audit


def test_seed_audit_reports_ok_for_current_seed():
    report = run_seed_audit()
    assert report["node_count"] > 0
    assert report["ok"] is True
