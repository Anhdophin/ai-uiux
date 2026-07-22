"""Load curated seed content for backend preview and tests.

Keep all reads centralized so schema migration later remains manageable.
Locale bundles and semantic registries are also resolved here so both UI and AI
can depend on the same source of truth.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
SEED_DIR = ROOT / 'src' / 'content' / 'seed'


@lru_cache(maxsize=64)
def load_seed_file(filename: str) -> dict[str, Any]:
    path = SEED_DIR / filename
    with path.open('r', encoding='utf-8') as handle:
        return json.load(handle)


def get_seed_manifest() -> dict[str, Any]:
    return load_seed_file('manifest.v1.json')


def get_keyword_nodes() -> list[dict[str, Any]]:
    return load_seed_file('keyword-tree.v1.json')['nodes']


def get_keyword_node_map() -> dict[str, dict[str, Any]]:
    return {node['id']: node for node in get_keyword_nodes()}


def get_keyword_roots() -> list[dict[str, Any]]:
    return [node for node in get_keyword_nodes() if node.get('depth') == 0]


def get_feelings() -> list[dict[str, Any]]:
    return load_seed_file('feelings.v1.json')['feelings']


def get_feeling_ids() -> set[str]:
    return {item['id'] for item in get_feelings()}


def get_life_areas() -> list[dict[str, Any]]:
    return load_seed_file('wheel-map.v1.json')['life_areas']


def get_life_area_map() -> dict[str, dict[str, Any]]:
    return {item['id']: item for item in get_life_areas()}


def get_personas() -> list[dict[str, Any]]:
    return load_seed_file('personas.v1.json')['personas']


def get_persona_ids() -> set[str]:
    return {item['id'] for item in get_personas()}


def get_ai_modes() -> list[dict[str, Any]]:
    return load_seed_file('ai-modes.v1.json')['modes']


def get_ai_mode_ids() -> set[str]:
    return {item['id'] for item in get_ai_modes()}


def get_sample_session() -> dict[str, Any]:
    return load_seed_file('sample-session.v1.json')['sample_session']


def get_keyword_ontology() -> dict[str, Any]:
    return load_seed_file('keyword-ontology.v1.json')


def get_persona_ontology() -> dict[str, Any]:
    return load_seed_file('persona-ontology.v1.json')


def get_wheel_ontology() -> dict[str, Any]:
    return load_seed_file('wheel-ontology.v1.json')


def get_locales() -> list[dict[str, Any]]:
    return load_seed_file('locales.v1.json')['locales']


def get_locale_settings() -> dict[str, Any]:
    data = load_seed_file('locales.v1.json')
    return {'default_locale': data.get('default_locale', 'vi'), 'fallback_locale': data.get('fallback_locale', 'en'), 'locales': data.get('locales', [])}


def get_user_context_options() -> list[dict[str, Any]]:
    return load_seed_file('user-context-options.v1.json')['context_groups']


def get_semantic_label_registry() -> dict[str, Any]:
    return load_seed_file('semantic-label-registry.v1.json')


def get_semantic_label_keys() -> set[str]:
    return {item['key'] for item in get_semantic_label_registry().get('keys', [])}


def get_locale_bundle(locale: str) -> dict[str, Any]:
    normalized = (locale or 'vi').lower()
    filename = f'locale-content.{normalized}.v1.json'
    try:
        return load_seed_file(filename)
    except FileNotFoundError:
        settings = get_locale_settings()
        fallback = settings.get('fallback_locale', 'en')
        return load_seed_file(f'locale-content.{fallback}.v1.json')


def get_locale_entry_map(locale: str) -> dict[str, dict[str, Any]]:
    return {entry['key']: entry for entry in get_locale_bundle(locale).get('entries', [])}


def get_selectable_prompt_bundle() -> dict[str, Any]:
    return load_seed_file('selectable-prompts.v1.json')


def get_selectable_prompt_packs() -> list[dict[str, Any]]:
    return get_selectable_prompt_bundle().get('prompt_packs', [])


def get_ai_option_resolution_bundle() -> dict[str, Any]:
    return load_seed_file('ai-option-resolution.v1.json')


def get_ai_option_resolutions() -> list[dict[str, Any]]:
    return get_ai_option_resolution_bundle().get('resolutions', [])


def get_session_flow_bundle() -> dict[str, Any]:
    return load_seed_file('session-flow.v1.json')


def get_session_analytics_bundle() -> dict[str, Any]:
    return load_seed_file('session-analytics.v1.json')


def get_cross_session_memory_bundle() -> dict[str, Any]:
    return load_seed_file('cross-session-memory.v1.json')


def get_pattern_detection_bundle() -> dict[str, Any]:
    return load_seed_file('pattern-detection.v1.json')


def get_privacy_retention_bundle() -> dict[str, Any]:
    return load_seed_file('privacy-retention.v1.json')


def get_identity_linking_bundle() -> dict[str, Any]:
    return load_seed_file('identity-linking.v1.json')


def get_storage_boundary_bundle() -> dict[str, Any]:
    return load_seed_file('storage-boundary.v1.json')



def get_account_lifecycle_bundle() -> dict[str, Any]:
    return load_seed_file('account-lifecycle.v1.json')


def get_export_delete_flows_bundle() -> dict[str, Any]:
    return load_seed_file('export-delete-flows.v1.json')


def get_consent_events_bundle() -> dict[str, Any]:
    return load_seed_file('consent-events.v1.json')
