"""Prompt builder.

The builder creates a structured AI-ready bundle instead of raw freeform text.
It stays selection-first and locale-aware.
"""

from __future__ import annotations

from app.services.content_loader import get_keyword_node_map, get_selectable_prompt_packs
from app.services.locale_service import LocaleResolver


def _pack_matches(snapshot: dict, pack: dict) -> bool:
    selected_feeling = snapshot.get('selected_feeling')
    selected_keywords = set(snapshot.get('selected_keywords', []))
    persona = snapshot.get('persona_summary', {})
    reality = snapshot.get('user_reality_context', {})
    when = pack.get('when', {})
    filters = pack.get('context_filters', {})
    allowed_feelings = set(when.get('selected_feelings', []))
    if allowed_feelings and selected_feeling not in allowed_feelings:
        return False
    keywords_any = set(when.get('selected_keywords_any', []))
    if keywords_any and not (selected_keywords & keywords_any):
        return False
    life_stages = set(filters.get('life_stages', []))
    if life_stages and persona.get('life_stage') not in life_stages:
        return False
    pressures_any = set(filters.get('pressures_any', []))
    active_pressures = set(reality.get('current_pressures', []))
    if pressures_any and not (active_pressures & pressures_any):
        return False
    return True


def build_prompt(snapshot: dict) -> dict:
    locale = snapshot.get('locale', 'vi')
    resolver = LocaleResolver(locale)
    keyword_map = get_keyword_node_map()
    selected_keyword_labels = [keyword_map[item]['label'] for item in snapshot.get('selected_keywords', []) if item in keyword_map]
    candidate_packs = [pack for pack in get_selectable_prompt_packs() if pack.get('mode') == snapshot.get('mode') and _pack_matches(snapshot, pack)]
    candidate_packs.sort(key=lambda item: item.get('priority', 0), reverse=True)
    chosen_pack = candidate_packs[0] if candidate_packs else None
    selectable_prompt = None
    if chosen_pack:
        option_keys = chosen_pack.get('option_keys', [])
        option_items = [{'option_key': option_key, 'label': resolver.resolve(option_key), 'suggested_keyword_ids': chosen_pack.get('suggested_keyword_ids', [])} for option_key in option_keys]
        selectable_prompt = {'id': chosen_pack['id'], 'question': resolver.resolve(chosen_pack['question_key']), 'options': [item['label'] for item in option_items], 'option_items': option_items, 'suggested_keyword_ids': chosen_pack.get('suggested_keyword_ids', []), 'question_key': chosen_pack['question_key'], 'option_keys': option_keys}
    return {'mode': snapshot.get('mode', 'deepen_selection'), 'locale': locale, 'persona_summary': snapshot.get('persona_summary', {}), 'selected_feeling': snapshot.get('selected_feeling'), 'selected_keyword_ids': snapshot.get('selected_keywords', []), 'selected_keyword_labels': selected_keyword_labels, 'wheel_preview': snapshot.get('wheel_preview', {}), 'reflection_snippet': snapshot.get('reflection_snippet'), 'selectable_prompt': selectable_prompt, 'selection_first_note': resolver.resolve('ui.selection_first.note')}
