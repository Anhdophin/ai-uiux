from app.engine.prompt_builder import build_prompt


def test_prompt_builder_returns_selectable_prompt_for_matching_context() -> None:
    snapshot = {
        'locale': 'en',
        'mode': 'deepen_selection',
        'persona_summary': {'age_range': '25-29', 'gender': 'male', 'life_stage': 'working', 'career_stage': 'early'},
        'user_reality_context': {'current_pressures': ['direction_pressure']},
        'selected_feeling': 'unclear_direction',
        'selected_keywords': ['ud_future'],
        'reflection_snippet': None,
        'wheel_preview': {},
    }
    payload = build_prompt(snapshot)
    assert payload['selectable_prompt'] is not None
    assert payload['selectable_prompt']['question']
    assert len(payload['selectable_prompt']['options']) == 3
    assert payload['selectable_prompt']['option_items'][0]['option_key']
