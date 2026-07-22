from app.engine.option_resolution_engine import resolve_option


def test_option_resolution_contract_exists() -> None:
    payload = resolve_option('deepen_direction_blocked', 'prompt.deepen_selection.direction_blocked.option_2')
    assert payload is not None
    assert payload['append_keyword_ids'] == ['ud_strengths']
