from app.engine.privacy_engine import build_identity_link_preview, get_retention_policy, get_storage_boundary


def test_retention_policy_and_storage_boundary() -> None:
    policy = get_retention_policy('en')
    assert policy.session_ttl_days > 0
    boundary = get_storage_boundary('en')
    assert len(boundary.zones) == 3


def test_identity_link_preview_is_pseudonymous() -> None:
    preview = build_identity_link_preview(
        external_user_ref='someone@example.com',
        link_scope='account_ready',
        source_system='local_demo',
        session_ids=['sess_x'],
        memory_profile_keys=['profile_a'],
        locale='en',
    )
    assert preview.pseudonymous_user_key.startswith('usr_')
    assert 'example.com' not in preview.pseudonymous_user_key
