
from app.engine.account_engine import record_consent
from app.engine.privacy_engine import build_identity_link_preview, commit_identity_link
from app.engine.account_engine import preview_export


def test_record_consent_and_preview_export() -> None:
    preview = build_identity_link_preview(
        external_user_ref='unit@test.local',
        link_scope='account_ready',
        source_system='local_demo',
        session_ids=['sess_unit_1'],
        memory_profile_keys=['memory_unit_1'],
        locale='en',
    )
    commit_identity_link(preview)
    event = record_consent(preview.pseudonymous_user_key, 'account_ready_export', True, {'source': 'unit'})
    assert event.event_type == 'consent_granted'
    exp = preview_export(preview.pseudonymous_user_key, 'en')
    assert exp.pseudonymous_user_key == preview.pseudonymous_user_key
    assert exp.audit_event_count >= 1
