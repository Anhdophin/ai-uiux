"""AI engine stub.

This scaffold does not call a real model yet.
It returns predictable, selection-first output so the integration surface stays stable.
The response is now driven by locale-aware selectable prompt packs when possible.
"""

from __future__ import annotations

from app.engine.prompt_builder import build_prompt
from app.schemas.ai import AIDeepenResponse, SelectablePromptOut
from app.services.locale_service import LocaleResolver


def generate_ai_response(snapshot: dict) -> AIDeepenResponse:
    locale = snapshot.get('locale', 'vi')
    resolver = LocaleResolver(locale)
    prompt_bundle = build_prompt(snapshot)
    selectable = prompt_bundle.get('selectable_prompt')
    selected = snapshot.get('selected_keywords', [])
    pressure_count = len(snapshot.get('user_reality_context', {}).get('current_pressures', []))
    if locale == 'vi':
        summary = 'Hệ đang bám vào ngữ cảnh thật anh đã chọn, rồi mới mở tiếp bằng các phương án để chọn.'
        patterns = ['Các lựa chọn hiện tại đang nghiêng về nhánh định hướng và áp lực thực tế.']
        follow_ups = ['Phương án nào ở dưới gần nhất với trạng thái hiện tại?', 'Anh muốn mở sâu hơn vào hướng đi hay áp lực chính trước?']
        confidence = 'Scaffold response only; replace with validated model output later.'
    else:
        summary = 'The system is anchoring itself in your real selected context, then opening the next step through selectable options.'
        patterns = ['Your current selections lean toward direction and practical pressure.']
        follow_ups = ['Which option below feels closest to your current state?', 'Would you rather go deeper into direction or into the strongest pressure first?']
        confidence = 'Scaffold response only; replace with validated model output later.'
    if pressure_count >= 2:
        patterns.append('Có nhiều áp lực đồng thời, nên ưu tiên lọc áp lực chính trước.' if locale == 'vi' else 'Multiple pressures are active, so the primary pressure should be isolated first.')
    next_paths = selectable.get('suggested_keyword_ids', [])[:2] if selectable else []
    selectable_options = selectable.get('options', []) if selectable else []
    selectable_prompt_out = SelectablePromptOut(**selectable) if selectable else None
    if selected:
        patterns.append(resolver.resolve('ui.selection_first.note'))
    return AIDeepenResponse(locale=locale, summary=summary, possible_patterns=patterns, follow_up_questions=follow_ups, next_keyword_paths=next_paths, selectable_options=selectable_options, selectable_prompt=selectable_prompt_out, confidence_note=confidence)
