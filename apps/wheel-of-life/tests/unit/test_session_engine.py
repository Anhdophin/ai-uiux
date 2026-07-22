from app.engine.session_engine import apply_selection, get_session, initialize_session, refresh_prompt, resolve_ai_option
from app.schemas.context import ContextProfileIn
from app.schemas.user_context import UserRealityContextIn


def build_context():
    return ContextProfileIn(age_range='25-29', gender='male', life_stage='working', career_stage='early', goals=[], concerns=[])


def build_reality():
    return UserRealityContextIn(locale='en', life_setup='working_few_years', current_pressures=['direction_pressure'], current_goals=['find_direction'], constraints=[], readiness_level='want_direction_suggestions', custom_keywords=[], note_fragment=None)


def test_session_initialize_and_resume() -> None:
    state = initialize_session('en', build_context(), build_reality())
    resumed = get_session(state.session_id)
    assert resumed.session_id == state.session_id
    assert resumed.trail[0].event_type == 'context_initialized'


def test_session_prompt_and_option_resolution_adds_keywords() -> None:
    state = initialize_session('en', build_context(), build_reality())
    state = apply_selection(state.session_id, 'feeling_selected', selected_id='unclear_direction')
    state = apply_selection(state.session_id, 'keyword_selected', selected_id='ud_future')
    state = refresh_prompt(state.session_id)
    assert state.latest_selectable_prompt is not None
    result = resolve_ai_option(state.session_id, 'deepen_direction_blocked', 'prompt.deepen_selection.direction_blocked.option_1')
    assert 'ud_roadmap' in result['added_keyword_ids']
    assert result['trail_event'].event_type == 'ai_option_resolved'
