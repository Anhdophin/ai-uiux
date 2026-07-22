"""API routes for scaffold demo.

Routes stay thin and delegate logic to services / engines / validators.
"""

from fastapi import APIRouter, HTTPException

from app.engine.ai_engine import generate_ai_response
from app.engine.audit_engine import build_coverage_report, run_seed_audit
from app.engine.context_engine import build_context_snapshot_strict
from app.engine.mapping_engine import build_wheel_preview
from app.engine.prompt_builder import build_prompt
from app.engine.session_engine import apply_selection, get_session, initialize_session, refresh_prompt, resolve_ai_option
from app.engine.session_analytics_engine import build_resume_plan, build_session_analytics, compact_session_trail
from app.engine.memory_engine import create_memory_snapshot, detect_patterns, get_cross_session_memory, get_wheel_history
from app.engine.privacy_engine import build_identity_link_preview, commit_identity_link, get_retention_policy, get_storage_boundary
from app.engine.account_engine import delete_account_data, export_account_data, get_account_lifecycle, preview_delete, preview_export, record_consent
from app.schemas.ai import AIDeepenRequest, AIDeepenResponse
from app.schemas.content_contracts import SchemaValidationReport, SeedBundleManifestOut
from app.schemas.context import ContextProfileIn
from app.schemas.feeling import FeelingSelectionIn
from app.schemas.keyword import KeywordChildrenResponse, KeywordNodeOut, KeywordOverviewResponse
from app.schemas.session import AIOptionResolveRequest, AIOptionResolveResponse, SessionInitializeRequest, SessionSelectionApplyRequest, SessionStateOut
from app.schemas.session_analytics import SessionAnalyticsOut, SessionResumePlanOut
from app.schemas.memory import CrossSessionMemoryOut, PatternDetectionOut, WheelHistoryOut
from app.schemas.privacy import IdentityLinkCommitOut, IdentityLinkPreviewOut, IdentityLinkPreviewRequest, RetentionPolicyOut, StorageBoundaryOut
from app.schemas.account import AccountDataPreviewOut, AccountDataPreviewRequest, AccountDeleteOut, AccountExportOut, AccountLifecycleOut, ConsentEventIn, ConsentEventOut
from app.schemas.user_context import ContextSnapshotOut, UserRealityContextIn
from app.schemas.wheel import WheelPreviewRequest, WheelPreviewResponse
from app.services.content_loader import get_ai_modes, get_cross_session_memory_bundle, get_feelings, get_keyword_node_map, get_keyword_roots, get_life_areas, get_locales, get_locale_bundle, get_pattern_detection_bundle, get_persona_ontology, get_personas, get_seed_manifest, get_selectable_prompt_packs, get_semantic_label_registry, get_user_context_options, get_keyword_ontology, get_wheel_ontology, get_session_flow_bundle, get_session_analytics_bundle, get_identity_linking_bundle, get_privacy_retention_bundle, get_storage_boundary_bundle
from app.validators.seed_validator import validate_seed_bundles

router = APIRouter(prefix='/api')

@router.get('/seed/overview')
def seed_overview() -> dict:
    return {'feelings': get_feelings(), 'life_areas': get_life_areas(), 'personas': get_personas(), 'modes': get_ai_modes(), 'locales': get_locales(), 'keyword_root_count': len(get_keyword_roots()), 'keyword_node_count': len(get_keyword_node_map())}

@router.get('/seed/manifest', response_model=SeedBundleManifestOut)
def seed_manifest() -> SeedBundleManifestOut:
    return SeedBundleManifestOut(**get_seed_manifest())

@router.get('/seed/validate', response_model=SchemaValidationReport)
def validate_seed() -> SchemaValidationReport:
    return SchemaValidationReport(**validate_seed_bundles())

@router.get('/locales')
def locales() -> dict:
    return {'locales': get_locales()}

@router.get('/locales/{locale}/bundle')
def locale_bundle(locale: str) -> dict:
    return get_locale_bundle(locale)

@router.get('/labels/registry')
def label_registry() -> dict:
    return get_semantic_label_registry()

@router.get('/user-context/options')
def user_context_options() -> dict:
    return {'context_groups': get_user_context_options()}

@router.get('/ai/prompt-packs')
def ai_prompt_packs() -> dict:
    return {'prompt_packs': get_selectable_prompt_packs()}

@router.get('/session/flow')
def session_flow() -> dict:
    return get_session_flow_bundle()

@router.get('/keyword/roots', response_model=KeywordOverviewResponse)
def keyword_roots() -> KeywordOverviewResponse:
    return KeywordOverviewResponse(nodes=[KeywordNodeOut(**node) for node in get_keyword_roots()])

@router.get('/keyword/{node_id}', response_model=KeywordNodeOut)
def get_keyword_node(node_id: str) -> KeywordNodeOut:
    node = get_keyword_node_map().get(node_id)
    if not node:
        raise HTTPException(status_code=404, detail='Keyword node not found')
    return KeywordNodeOut(**node)

@router.get('/keyword/{node_id}/children', response_model=KeywordChildrenResponse)
def get_keyword_children(node_id: str) -> KeywordChildrenResponse:
    node_map = get_keyword_node_map(); node = node_map.get(node_id)
    if not node:
        raise HTTPException(status_code=404, detail='Keyword node not found')
    children = [KeywordNodeOut(**node_map[child_id]) for child_id in node.get('child_ids', []) if child_id in node_map]
    related = [KeywordNodeOut(**node_map[related_id]) for related_id in node.get('related_node_ids', []) if related_id in node_map]
    return KeywordChildrenResponse(node=KeywordNodeOut(**node), children=children, related=related)

@router.post('/context/preview')
def preview_context(payload: ContextProfileIn) -> dict:
    return {'normalized_context': payload.model_dump()}

@router.post('/context/snapshot', response_model=ContextSnapshotOut)
def preview_context_snapshot(context_profile: ContextProfileIn, user_reality_context: UserRealityContextIn) -> ContextSnapshotOut:
    return ContextSnapshotOut(locale=user_reality_context.locale, persona_summary=context_profile.model_dump(), user_reality_context=user_reality_context.model_dump(), selected_keywords=[], selected_feeling=None, wheel_preview=None)

@router.post('/feeling/preview')
def preview_feeling(payload: FeelingSelectionIn) -> dict:
    return {'normalized_feeling': payload.model_dump()}

@router.post('/wheel/preview', response_model=WheelPreviewResponse)
def preview_wheel(payload: WheelPreviewRequest) -> WheelPreviewResponse:
    return WheelPreviewResponse(**build_wheel_preview(payload.selected_keyword_ids))

@router.post('/ai/prompt-preview')
def ai_prompt_preview(payload: AIDeepenRequest) -> dict:
    snapshot = build_context_snapshot_strict(payload)
    return build_prompt(snapshot)

@router.post('/ai/deepen', response_model=AIDeepenResponse)
def ai_deepen(payload: AIDeepenRequest) -> AIDeepenResponse:
    snapshot = build_context_snapshot_strict(payload)
    return generate_ai_response(snapshot)

@router.post('/session/initialize', response_model=SessionStateOut)
def session_initialize(payload: SessionInitializeRequest) -> SessionStateOut:
    return initialize_session(payload.locale, payload.context_profile, payload.user_reality_context)

@router.get('/session/{session_id}', response_model=SessionStateOut)
def session_get(session_id: str) -> SessionStateOut:
    return get_session(session_id)

@router.post('/session/{session_id}/selection', response_model=SessionStateOut)
def session_apply_selection(session_id: str, payload: SessionSelectionApplyRequest) -> SessionStateOut:
    return apply_selection(session_id, payload.event_type, selected_id=payload.selected_id, note_fragment=payload.note_fragment)

@router.post('/session/{session_id}/prompt', response_model=SessionStateOut)
def session_refresh_prompt(session_id: str) -> SessionStateOut:
    return refresh_prompt(session_id)

@router.post('/session/{session_id}/ai-option', response_model=AIOptionResolveResponse)
def session_resolve_ai_option(session_id: str, payload: AIOptionResolveRequest) -> AIOptionResolveResponse:
    return AIOptionResolveResponse(**resolve_ai_option(session_id, payload.prompt_pack_id, payload.option_key))


@router.get('/session/config/analytics')
def session_analytics_config() -> dict:
    return get_session_analytics_bundle()

@router.get('/session/{session_id}/analytics', response_model=SessionAnalyticsOut)
def session_analytics(session_id: str) -> SessionAnalyticsOut:
    return build_session_analytics(session_id)

@router.post('/session/{session_id}/compact', response_model=SessionStateOut)
def session_compact(session_id: str) -> SessionStateOut:
    return compact_session_trail(session_id)

@router.get('/session/{session_id}/resume', response_model=SessionResumePlanOut)
def session_resume(session_id: str) -> SessionResumePlanOut:
    return build_resume_plan(session_id)


@router.get('/session/{session_id}/memory', response_model=CrossSessionMemoryOut)
def session_memory(session_id: str) -> CrossSessionMemoryOut:
    return get_cross_session_memory(session_id)

@router.post('/session/{session_id}/memory/snapshot', response_model=CrossSessionMemoryOut)
def session_memory_snapshot(session_id: str) -> CrossSessionMemoryOut:
    return create_memory_snapshot(session_id)

@router.get('/session/{session_id}/patterns', response_model=PatternDetectionOut)
def session_patterns(session_id: str) -> PatternDetectionOut:
    return detect_patterns(session_id)

@router.get('/session/{session_id}/wheel/history', response_model=WheelHistoryOut)
def session_wheel_history(session_id: str) -> WheelHistoryOut:
    return get_wheel_history(session_id)

@router.get('/session/config/memory')
def session_memory_config() -> dict:
    return {'memory': get_cross_session_memory_bundle(), 'patterns': get_pattern_detection_bundle()}


@router.get('/privacy/config', response_model=RetentionPolicyOut)
def privacy_config(locale: str = 'en') -> RetentionPolicyOut:
    return get_retention_policy(locale)

@router.get('/storage/boundary', response_model=StorageBoundaryOut)
def storage_boundary(locale: str = 'en') -> StorageBoundaryOut:
    return get_storage_boundary(locale)

@router.post('/identity/link/preview', response_model=IdentityLinkPreviewOut)
def identity_link_preview(payload: IdentityLinkPreviewRequest, locale: str = 'en') -> IdentityLinkPreviewOut:
    return build_identity_link_preview(
        external_user_ref=payload.external_user_ref,
        link_scope=payload.link_scope,
        source_system=payload.source_system,
        session_ids=payload.session_ids,
        memory_profile_keys=payload.memory_profile_keys,
        locale=locale,
    )

@router.post('/identity/link/commit', response_model=IdentityLinkCommitOut)
def identity_link_commit(payload: IdentityLinkPreviewRequest, locale: str = 'en') -> IdentityLinkCommitOut:
    preview = build_identity_link_preview(
        external_user_ref=payload.external_user_ref,
        link_scope=payload.link_scope,
        source_system=payload.source_system,
        session_ids=payload.session_ids,
        memory_profile_keys=payload.memory_profile_keys,
        locale=locale,
    )
    return commit_identity_link(preview)

@router.get('/audit/seed')
def audit_seed() -> dict:
    return run_seed_audit()

@router.get('/audit/coverage')
def audit_coverage() -> dict:
    return build_coverage_report()

@router.get('/ontology/overview')
def ontology_overview() -> dict:
    return {'keyword': get_keyword_ontology(), 'persona': get_persona_ontology(), 'wheel': get_wheel_ontology()}

@router.get('/account/lifecycle/{pseudonymous_user_key}', response_model=AccountLifecycleOut)
def account_lifecycle(pseudonymous_user_key: str) -> AccountLifecycleOut:
    return get_account_lifecycle(pseudonymous_user_key)

@router.post('/account/consent', response_model=ConsentEventOut)
def account_record_consent(payload: ConsentEventIn) -> ConsentEventOut:
    return record_consent(payload.pseudonymous_user_key, payload.scope, payload.granted, payload.details)

@router.post('/account/export/preview', response_model=AccountDataPreviewOut)
def account_export_preview(payload: AccountDataPreviewRequest, locale: str = 'en') -> AccountDataPreviewOut:
    return preview_export(payload.pseudonymous_user_key, locale)

@router.post('/account/delete/preview', response_model=AccountDataPreviewOut)
def account_delete_preview(payload: AccountDataPreviewRequest, locale: str = 'en') -> AccountDataPreviewOut:
    return preview_delete(payload.pseudonymous_user_key, locale)

@router.post('/account/{pseudonymous_user_key}/export', response_model=AccountExportOut)
def account_export(pseudonymous_user_key: str, locale: str = 'en') -> AccountExportOut:
    return export_account_data(pseudonymous_user_key, locale)

@router.post('/account/{pseudonymous_user_key}/delete', response_model=AccountDeleteOut)
def account_delete(pseudonymous_user_key: str, locale: str = 'en') -> AccountDeleteOut:
    return delete_account_data(pseudonymous_user_key, locale)
