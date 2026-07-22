from app.engine.memory_engine import create_memory_snapshot, detect_patterns, get_cross_session_memory, get_wheel_history
from app.engine.session_engine import apply_selection, initialize_session
from app.schemas.context import ContextProfileIn
from app.schemas.user_context import UserRealityContextIn


def _session_with_data():
    state = initialize_session(
        'en',
        ContextProfileIn(age_range='25-29', gender='male', life_stage='working', career_stage='early', goals=[], concerns=[]),
        UserRealityContextIn(locale='en', life_setup='working_few_years', current_pressures=['direction_pressure'], current_goals=['find_direction'], constraints=['low_time'], readiness_level='want_direction_suggestions'),
    )
    apply_selection(state.session_id, 'feeling_selected', selected_id='unclear_direction')
    apply_selection(state.session_id, 'keyword_selected', selected_id='ud_future')
    apply_selection(state.session_id, 'keyword_selected', selected_id='ud_roadmap')
    return state.session_id


def test_memory_snapshot_and_history():
    session_id = _session_with_data()
    memory = create_memory_snapshot(session_id)
    assert memory.snapshot_count >= 1
    current = get_cross_session_memory(session_id)
    assert current.latest_snapshot is not None
    history = get_wheel_history(session_id)
    assert history.point_count >= 1


def test_pattern_detection_after_multiple_snapshots():
    session_id1 = _session_with_data()
    create_memory_snapshot(session_id1)
    session_id2 = _session_with_data()
    create_memory_snapshot(session_id2)
    patterns = detect_patterns(session_id2)
    assert patterns.pattern_count >= 1
