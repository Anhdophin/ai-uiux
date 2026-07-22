from app.engine.session_analytics_engine import build_resume_plan, build_session_analytics, compact_session_trail
from app.engine.session_engine import apply_selection, initialize_session, refresh_prompt
from app.schemas.context import ContextProfileIn
from app.schemas.user_context import UserRealityContextIn


def _make_session():
    state = initialize_session(
        'vi',
        ContextProfileIn(age_range='25-29', gender='male', life_stage='working', career_stage='early', goals=[], concerns=[]),
        UserRealityContextIn(locale='vi', life_setup='working_few_years', current_pressures=['direction_pressure'], current_goals=['find_direction'], constraints=['low_time'], readiness_level='want_direction_suggestions'),
    )
    apply_selection(state.session_id, 'feeling_selected', selected_id='unclear_direction')
    apply_selection(state.session_id, 'keyword_selected', selected_id='ud_future')
    refresh_prompt(state.session_id)
    return state.session_id


def test_session_analytics_and_resume():
    session_id = _make_session()
    analytics = build_session_analytics(session_id)
    assert analytics.total_events >= 4
    assert analytics.selected_keyword_count >= 1
    plan = build_resume_plan(session_id)
    assert plan.summary_label
    assert len(plan.recommended_actions) >= 1


def test_trail_compaction_keeps_recent_events():
    session_id = _make_session()
    for idx in range(8):
        apply_selection(session_id, 'reflection_updated', note_fragment=f'note {idx}')
    compacted = compact_session_trail(session_id)
    assert compacted.trail_compactions
    assert len(compacted.trail) <= 6
    assert compacted.trail[0].event_type == 'trail_compacted'
