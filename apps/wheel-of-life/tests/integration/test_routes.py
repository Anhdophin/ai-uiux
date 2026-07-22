"""Integration test for API routes."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_route():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_seed_overview_route():
    response = client.get('/api/seed/overview')
    assert response.status_code == 200
    data = response.json()
    assert data['keyword_node_count'] > 0
    assert len(data['locales']) >= 2


def test_seed_manifest_route() -> None:
    response = client.get('/api/seed/manifest')
    assert response.status_code == 200
    payload = response.json()
    assert payload['version'] == 'v1'
    assert len(payload['bundles']) >= 8


def test_seed_validate_route() -> None:
    response = client.get('/api/seed/validate')
    assert response.status_code == 200
    payload = response.json()
    assert payload['ok'] is True


def test_locales_route() -> None:
    response = client.get('/api/locales')
    assert response.status_code == 200
    payload = response.json()
    assert len(payload['locales']) >= 2


def test_user_context_options_route() -> None:
    response = client.get('/api/user-context/options')
    assert response.status_code == 200
    payload = response.json()
    assert len(payload['context_groups']) >= 4


def test_audit_coverage_route() -> None:
    response = client.get('/api/audit/coverage')
    assert response.status_code == 200
    payload = response.json()
    assert payload['keyword_coverage']['node_count'] > 0
    assert payload['persona_coverage']['persona_count'] >= 4


def test_ontology_overview_route() -> None:
    response = client.get('/api/ontology/overview')
    assert response.status_code == 200
    payload = response.json()
    assert 'keyword' in payload and 'persona' in payload and 'wheel' in payload


def test_locale_bundle_route() -> None:
    response = client.get('/api/locales/en/bundle')
    assert response.status_code == 200
    payload = response.json()
    assert payload['locale'] == 'en'
    assert len(payload['entries']) > 0


def test_label_registry_route() -> None:
    response = client.get('/api/labels/registry')
    assert response.status_code == 200
    payload = response.json()
    assert len(payload['keys']) > 0


def test_ai_prompt_preview_route() -> None:
    payload = {'locale': 'vi', 'mode': 'deepen_selection', 'context_profile': {'age_range': '25-29', 'gender': 'male', 'life_stage': 'working', 'career_stage': 'early', 'goals': [], 'concerns': []}, 'user_reality_context': {'locale': 'vi', 'life_setup': 'working_few_years', 'current_pressures': ['direction_pressure'], 'current_goals': ['find_direction'], 'constraints': [], 'readiness_level': 'want_direction_suggestions', 'custom_keywords': [], 'note_fragment': None}, 'feeling': {'feeling_id': 'unclear_direction', 'intensity': 3, 'frequency': 'often', 'note': None}, 'selected_keywords': ['ud_future'], 'reflection_snippet': None}
    response = client.post('/api/ai/prompt-preview', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data['selectable_prompt'] is not None
    assert len(data['selectable_prompt']['options']) == 3
    assert len(data['selectable_prompt']['option_items']) == 3


def test_session_initialize_and_ai_option_routes() -> None:
    init_payload = {'locale': 'en', 'context_profile': {'age_range': '25-29', 'gender': 'male', 'life_stage': 'working', 'career_stage': 'early', 'goals': [], 'concerns': []}, 'user_reality_context': {'locale': 'en', 'life_setup': 'working_few_years', 'current_pressures': ['direction_pressure'], 'current_goals': ['find_direction'], 'constraints': [], 'readiness_level': 'want_direction_suggestions', 'custom_keywords': [], 'note_fragment': None}}
    init_response = client.post('/api/session/initialize', json=init_payload)
    assert init_response.status_code == 200
    session_id = init_response.json()['session_id']
    assert client.post(f'/api/session/{session_id}/selection', json={'event_type': 'feeling_selected', 'selected_id': 'unclear_direction'}).status_code == 200
    assert client.post(f'/api/session/{session_id}/selection', json={'event_type': 'keyword_selected', 'selected_id': 'ud_future'}).status_code == 200
    prompt_response = client.post(f'/api/session/{session_id}/prompt')
    assert prompt_response.status_code == 200
    prompt_payload = prompt_response.json()
    assert prompt_payload['latest_selectable_prompt'] is not None
    resolve_response = client.post(f'/api/session/{session_id}/ai-option', json={'prompt_pack_id': 'deepen_direction_blocked', 'option_key': 'prompt.deepen_selection.direction_blocked.option_1'})
    assert resolve_response.status_code == 200
    resolved = resolve_response.json()
    assert 'ud_roadmap' in resolved['added_keyword_ids']



def test_session_analytics_routes() -> None:
    payload = {
        'locale': 'vi',
        'context_profile': {
            'age_range': '25-29',
            'gender': 'male',
            'life_stage': 'working',
            'career_stage': 'early',
            'goals': [],
            'concerns': []
        },
        'user_reality_context': {
            'locale': 'vi',
            'life_setup': 'working_few_years',
            'current_pressures': ['direction_pressure'],
            'current_goals': ['find_direction'],
            'constraints': ['low_time'],
            'readiness_level': 'want_direction_suggestions'
        }
    }
    res = client.post('/api/session/initialize', json=payload)
    assert res.status_code == 200
    session_id = res.json()['session_id']
    analytics = client.get(f'/api/session/{session_id}/analytics')
    assert analytics.status_code == 200
    assert analytics.json()['session_id'] == session_id
    resume = client.get(f'/api/session/{session_id}/resume')
    assert resume.status_code == 200
    assert resume.json()['session_id'] == session_id


def test_session_memory_routes() -> None:
    payload = {
        'locale': 'en',
        'context_profile': {
            'age_range': '25-29',
            'gender': 'male',
            'life_stage': 'working',
            'career_stage': 'early',
            'goals': [],
            'concerns': []
        },
        'user_reality_context': {
            'locale': 'en',
            'life_setup': 'working_few_years',
            'current_pressures': ['direction_pressure'],
            'current_goals': ['find_direction'],
            'constraints': ['low_time'],
            'readiness_level': 'want_direction_suggestions'
        }
    }
    res = client.post('/api/session/initialize', json=payload)
    assert res.status_code == 200
    session_id = res.json()['session_id']
    client.post(f'/api/session/{session_id}/selection', json={'event_type': 'feeling_selected', 'selected_id': 'unclear_direction'})
    client.post(f'/api/session/{session_id}/selection', json={'event_type': 'keyword_selected', 'selected_id': 'ud_future'})
    snap = client.post(f'/api/session/{session_id}/memory/snapshot')
    assert snap.status_code == 200
    mem = client.get(f'/api/session/{session_id}/memory')
    assert mem.status_code == 200
    assert mem.json()['snapshot_count'] >= 1
    patterns = client.get(f'/api/session/{session_id}/patterns')
    assert patterns.status_code == 200
    history = client.get(f'/api/session/{session_id}/wheel/history')
    assert history.status_code == 200


def test_privacy_and_identity_routes() -> None:
    policy = client.get('/api/privacy/config?locale=en')
    assert policy.status_code == 200
    assert policy.json()['session_ttl_days'] > 0
    boundary = client.get('/api/storage/boundary?locale=en')
    assert boundary.status_code == 200
    assert len(boundary.json()['zones']) == 3
    payload = {
        'external_user_ref': 'tester@example.com',
        'link_scope': 'account_ready',
        'source_system': 'local_demo',
        'session_ids': ['sess_demo'],
        'memory_profile_keys': ['en-25-29-male-working-early-working_few_years']
    }
    preview = client.post('/api/identity/link/preview?locale=en', json=payload)
    assert preview.status_code == 200
    assert preview.json()['pseudonymous_user_key'].startswith('usr_')
    commit = client.post('/api/identity/link/commit?locale=en', json=payload)
    assert commit.status_code == 200
    assert commit.json()['link_id'].startswith('link_')



def test_account_lifecycle_export_delete_routes() -> None:
    payload = {
        'external_user_ref': 'acc@test.local',
        'link_scope': 'account_ready',
        'source_system': 'local_demo',
        'session_ids': ['sess_demo_account'],
        'memory_profile_keys': ['mem_demo_account'],
    }
    commit = client.post('/api/identity/link/commit?locale=en', json=payload)
    assert commit.status_code == 200
    user_key = commit.json()['pseudonymous_user_key']

    consent = client.post('/api/account/consent', json={
        'pseudonymous_user_key': user_key,
        'scope': 'account_ready_export',
        'granted': True,
        'details': {'source': 'integration'}
    })
    assert consent.status_code == 200
    assert consent.json()['event_type'] == 'consent_granted'

    lifecycle = client.get(f'/api/account/lifecycle/{user_key}')
    assert lifecycle.status_code == 200
    assert lifecycle.json()['pseudonymous_user_key'] == user_key

    preview = client.post('/api/account/export/preview?locale=en', json={'pseudonymous_user_key': user_key})
    assert preview.status_code == 200
    assert preview.json()['preview_label']

    export_res = client.post(f'/api/account/{user_key}/export?locale=en')
    assert export_res.status_code == 200
    assert 'audit_events' in export_res.json()['package_sections']

    delete_preview = client.post('/api/account/delete/preview?locale=en', json={'pseudonymous_user_key': user_key})
    assert delete_preview.status_code == 200

    delete_res = client.post(f'/api/account/{user_key}/delete?locale=en')
    assert delete_res.status_code == 200
    assert delete_res.json()['status_label']
