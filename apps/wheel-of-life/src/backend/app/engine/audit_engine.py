"""Audit and coverage engine for curated seed integrity.

This module stays explainable on purpose.
It powers both hard validation and softer coverage reporting.
"""

from __future__ import annotations

from collections import Counter
from statistics import mean

from app.services.content_loader import (
    get_feeling_ids,
    get_keyword_node_map,
    get_keyword_nodes,
    get_keyword_ontology,
    get_life_area_map,
    get_locale_bundle,
    get_persona_ids,
    get_persona_ontology,
    get_personas,
    get_sample_session,
    get_selectable_prompt_packs,
    get_semantic_label_keys,
    get_wheel_ontology,
)
from app.validators.seed_validator import validate_seed_bundles


REQUIRED_KEYWORD_FIELDS = {
    'id', 'label', 'short_meaning', 'long_meaning', 'depth', 'kind', 'parent_ids', 'child_ids', 'related_node_ids',
    'life_area_weights', 'persona_tags', 'reflection_prompts', 'clarifying_prompts', 'status', 'version',
}


def _bucket_key(counter: Counter, allowed: list[str]) -> dict[str, int]:
    return {item: int(counter.get(item, 0)) for item in allowed}


def run_seed_audit() -> dict:
    schema_report = validate_seed_bundles()
    nodes = get_keyword_nodes()
    node_map = {node['id']: node for node in nodes}
    life_area_map = get_life_area_map()
    persona_ids = get_persona_ids()
    feeling_ids = get_feeling_ids()
    sample_session = get_sample_session()
    keyword_ontology = get_keyword_ontology()
    semantic_keys = get_semantic_label_keys()
    prompt_packs = get_selectable_prompt_packs()

    node_id_counts = Counter(node['id'] for node in nodes)
    duplicate_node_ids = sorted([node_id for node_id, count in node_id_counts.items() if count > 1])

    missing_children = []
    missing_related = []
    missing_parents = []
    missing_life_areas = []
    invalid_persona_tags = []
    invalid_weight_ranges = []
    missing_required_fields = []
    depth_mismatches = []
    orphan_non_roots = []
    weak_nodes = []
    one_way_related_links = []
    ontology_mismatches = []
    missing_prompt_label_keys = []

    allowed_persona_taxonomy = {'all', 'male', 'female', 'early', 'mid', 'builder', 'transition', 'early-career', 'mid-career'}
    kind_taxonomy = set(keyword_ontology.get('kind_taxonomy', []))
    status_taxonomy = set(keyword_ontology.get('status_taxonomy', []))
    allowed_kinds_by_depth = {item['id']: set(item.get('allowed_kinds', [])) for item in keyword_ontology.get('depth_taxonomy', [])}

    for node in nodes:
        missing_fields = [field for field in REQUIRED_KEYWORD_FIELDS if field not in node]
        if missing_fields:
            missing_required_fields.append({'node_id': node.get('id', '<missing-id>'), 'fields': missing_fields})

        if node.get('depth', 0) > 0 and not node.get('parent_ids'):
            orphan_non_roots.append(node['id'])

        if not node.get('reflection_prompts') or not node.get('clarifying_prompts'):
            weak_nodes.append({'node_id': node['id'], 'issue': 'missing_prompts'})

        if node.get('kind') not in kind_taxonomy:
            ontology_mismatches.append({'node_id': node['id'], 'issue': 'unknown_kind', 'value': node.get('kind')})
        if node.get('status') not in status_taxonomy:
            ontology_mismatches.append({'node_id': node['id'], 'issue': 'unknown_status', 'value': node.get('status')})
        allowed_kinds = allowed_kinds_by_depth.get(node.get('depth'), set())
        if allowed_kinds and node.get('kind') not in allowed_kinds:
            ontology_mismatches.append({'node_id': node['id'], 'issue': 'depth_kind_mismatch', 'value': {'depth': node.get('depth'), 'kind': node.get('kind')}})

        for parent_id in node.get('parent_ids', []):
            parent = node_map.get(parent_id)
            if not parent:
                missing_parents.append({'node_id': node['id'], 'missing_parent_id': parent_id})
            elif parent.get('depth', 0) >= node.get('depth', 0):
                depth_mismatches.append({'node_id': node['id'], 'parent_id': parent_id, 'issue': 'parent-depth-not-lower'})

        for child_id in node.get('child_ids', []):
            child = node_map.get(child_id)
            if not child:
                missing_children.append({'node_id': node['id'], 'missing_child_id': child_id})
            elif node['id'] not in child.get('parent_ids', []):
                depth_mismatches.append({'node_id': node['id'], 'child_id': child_id, 'issue': 'reverse-parent-missing'})

        for related_id in node.get('related_node_ids', []):
            related = node_map.get(related_id)
            if not related:
                missing_related.append({'node_id': node['id'], 'missing_related_id': related_id})
            elif node['id'] not in related.get('related_node_ids', []):
                one_way_related_links.append({'node_id': node['id'], 'related_id': related_id})

        for area_id, weight in node.get('life_area_weights', {}).items():
            if area_id not in life_area_map:
                missing_life_areas.append({'node_id': node['id'], 'missing_life_area_id': area_id})
            if not isinstance(weight, (int, float)) or weight < 0 or weight > 1:
                invalid_weight_ranges.append({'node_id': node['id'], 'life_area_id': area_id, 'weight': weight})

        for persona_tag in node.get('persona_tags', []):
            if persona_tag not in persona_ids and persona_tag not in allowed_persona_taxonomy:
                invalid_persona_tags.append({'node_id': node['id'], 'persona_tag': persona_tag})

    for pack in prompt_packs:
        keys_to_check = [pack.get('question_key')] + list(pack.get('option_keys', []))
        for key in filter(None, keys_to_check):
            if key not in semantic_keys:
                missing_prompt_label_keys.append({'prompt_pack_id': pack.get('id'), 'missing_key': key})

    sample_session_issues = []
    if sample_session.get('selected_feeling_id') not in feeling_ids:
        sample_session_issues.append({'issue': 'unknown_feeling_id', 'value': sample_session.get('selected_feeling_id')})
    for keyword_id in sample_session.get('selected_keyword_ids', []):
        if keyword_id not in node_map:
            sample_session_issues.append({'issue': 'unknown_keyword_id', 'value': keyword_id})

    locale_entry_checks = []
    for locale in ['en', 'vi']:
        bundle = get_locale_bundle(locale)
        keys = {entry['key'] for entry in bundle.get('entries', [])}
        missing = sorted(list(semantic_keys - keys))
        if missing:
            locale_entry_checks.append({'locale': locale, 'missing_keys': missing[:20], 'missing_count': len(missing)})

    issues = {
        'schema_validation': schema_report.get('issues', []),
        'duplicate_node_ids': duplicate_node_ids,
        'missing_children': missing_children,
        'missing_related': missing_related,
        'missing_parents': missing_parents,
        'missing_life_areas': missing_life_areas,
        'invalid_persona_tags': invalid_persona_tags,
        'invalid_weight_ranges': invalid_weight_ranges,
        'missing_required_fields': missing_required_fields,
        'depth_mismatches': depth_mismatches,
        'orphan_non_roots': orphan_non_roots,
        'weak_nodes': weak_nodes,
        'one_way_related_links': one_way_related_links,
        'sample_session_issues': sample_session_issues,
        'ontology_mismatches': ontology_mismatches,
        'missing_prompt_label_keys': missing_prompt_label_keys,
        'locale_entry_checks': locale_entry_checks,
    }
    ok = schema_report.get('ok', False) and not any(value for value in issues.values())
    return {
        'node_count': len(nodes),
        'schema_checked_bundles': schema_report.get('checked_bundles', 0),
        'ok': ok,
        'issues': issues,
    }


def build_coverage_report() -> dict:
    nodes = get_keyword_nodes()
    personas = get_personas()
    life_area_map = get_life_area_map()
    keyword_ontology = get_keyword_ontology()
    persona_ontology = get_persona_ontology()
    wheel_ontology = get_wheel_ontology()
    semantic_keys = get_semantic_label_keys()
    prompt_packs = get_selectable_prompt_packs()

    depth_counter = Counter(str(node.get('depth')) for node in nodes)
    kind_counter = Counter(node.get('kind') for node in nodes)
    status_counter = Counter(node.get('status') for node in nodes)
    persona_tag_counter = Counter(tag for node in nodes for tag in node.get('persona_tags', []))
    area_counter = Counter(area for node in nodes for area in node.get('life_area_weights', {}).keys())
    audit_tag_counter = Counter(tag for node in nodes for tag in node.get('audit_tags', []))

    root_count = sum(1 for node in nodes if node.get('depth') == 0)
    leaf_count = sum(1 for node in nodes if not node.get('child_ids'))
    avg_area_links = round(mean(len(node.get('life_area_weights', {})) for node in nodes), 2) if nodes else 0.0

    age_band_counter = Counter(persona.get('age_band') for persona in personas)
    gender_counter = Counter(persona.get('gender') for persona in personas)
    life_stage_counter = Counter(persona.get('life_stage_key') for persona in personas)
    career_stage_counter = Counter(persona.get('career_stage_key') for persona in personas)

    personas_missing_entry_keywords = [persona['id'] for persona in personas if not persona.get('recommended_entry_keywords')]
    personas_with_unknown_entry_keywords = []
    node_ids = {node['id'] for node in nodes}
    for persona in personas:
        unknown = [keyword_id for keyword_id in persona.get('recommended_entry_keywords', []) if keyword_id not in node_ids]
        if unknown:
            personas_with_unknown_entry_keywords.append({'persona_id': persona['id'], 'unknown_keyword_ids': unknown})

    wheel_area_defs = {item['id']: item for item in wheel_ontology.get('life_areas', [])}
    wheel_areas_without_subareas = [area_id for area_id, item in wheel_area_defs.items() if not item.get('sub_areas')]
    wheel_areas_with_low_keyword_coverage = [area_id for area_id in life_area_map if area_counter.get(area_id, 0) < 3]
    wheel_areas_unused = [area_id for area_id in wheel_area_defs if area_counter.get(area_id, 0) == 0]

    locale_missing_counts = {}
    for locale in ['en', 'vi']:
        bundle = get_locale_bundle(locale)
        keys = {entry['key'] for entry in bundle.get('entries', [])}
        locale_missing_counts[locale] = len(semantic_keys - keys)

    keyword_critical_gaps = []
    if root_count < 3:
        keyword_critical_gaps.append('keyword_roots_below_minimum')
    persona_major_gaps = []
    if gender_counter.get('male', 0) == 0 or gender_counter.get('female', 0) == 0:
        persona_major_gaps.append('missing_binary_gender_coverage')
    if not age_band_counter.get('40s_plus'):
        persona_major_gaps.append('missing_40s_plus_coverage')

    advisory_gaps = []
    if wheel_areas_with_low_keyword_coverage:
        advisory_gaps.append({'type': 'wheel_low_keyword_coverage', 'areas': wheel_areas_with_low_keyword_coverage})
    if personas_missing_entry_keywords:
        advisory_gaps.append({'type': 'persona_missing_recommended_entry_keywords', 'persona_ids': personas_missing_entry_keywords})
    if wheel_areas_without_subareas:
        advisory_gaps.append({'type': 'wheel_areas_without_subareas', 'areas': wheel_areas_without_subareas})
    if not audit_tag_counter:
        advisory_gaps.append({'type': 'keyword_audit_tags_are_sparse', 'message': 'Nodes mostly do not use audit_tags yet'})
    if any(locale_missing_counts.values()):
        advisory_gaps.append({'type': 'locale_missing_registry_keys', 'counts': locale_missing_counts})
    if len(prompt_packs) < 2:
        advisory_gaps.append({'type': 'prompt_pack_count_low', 'count': len(prompt_packs)})

    return {
        'version': '1.1.0',
        'keyword_coverage': {
            'node_count': len(nodes),
            'root_count': root_count,
            'leaf_count': leaf_count,
            'counts_by_depth': {item['id']: int(depth_counter.get(str(item['id']), 0)) for item in keyword_ontology.get('depth_taxonomy', [])},
            'counts_by_kind': _bucket_key(kind_counter, keyword_ontology.get('kind_taxonomy', [])),
            'counts_by_status': _bucket_key(status_counter, keyword_ontology.get('status_taxonomy', [])),
            'counts_by_persona_tag': {key: int(value) for key, value in sorted(persona_tag_counter.items())},
            'counts_by_life_area': {key: int(value) for key, value in sorted(area_counter.items())},
            'counts_by_audit_tag': {key: int(value) for key, value in sorted(audit_tag_counter.items())},
            'average_life_area_links_per_node': avg_area_links,
        },
        'persona_coverage': {
            'persona_count': len(personas),
            'counts_by_age_band': _bucket_key(age_band_counter, persona_ontology.get('age_bands', [])),
            'counts_by_gender': _bucket_key(gender_counter, persona_ontology.get('genders', [])),
            'counts_by_life_stage': _bucket_key(life_stage_counter, persona_ontology.get('life_stages', [])),
            'counts_by_career_stage': _bucket_key(career_stage_counter, persona_ontology.get('career_stages', [])),
            'personas_missing_entry_keywords': personas_missing_entry_keywords,
            'personas_with_unknown_entry_keywords': personas_with_unknown_entry_keywords,
        },
        'wheel_coverage': {
            'life_area_count': len(life_area_map),
            'areas_with_keyword_evidence': {area_id: int(area_counter.get(area_id, 0)) for area_id in sorted(life_area_map.keys())},
            'areas_with_low_keyword_coverage': wheel_areas_with_low_keyword_coverage,
            'areas_without_keyword_evidence': wheel_areas_unused,
            'areas_without_subareas': wheel_areas_without_subareas,
        },
        'i18n_coverage': {
            'semantic_key_count': len(semantic_keys),
            'locale_missing_counts': locale_missing_counts,
            'prompt_pack_count': len(prompt_packs),
        },
        'gaps': {
            'critical': keyword_critical_gaps,
            'major': persona_major_gaps,
            'advisory': advisory_gaps,
        },
    }
