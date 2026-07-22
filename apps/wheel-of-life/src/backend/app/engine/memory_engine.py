"""Cross-session memory, pattern detection, and longitudinal wheel tracking."""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException

from app.schemas.memory import CrossSessionMemoryOut, MemorySnapshotOut, PatternDetectionOut, PatternSignalOut, WheelHistoryOut, WheelHistoryPointOut
from app.schemas.session import SessionStateOut
from app.services.content_loader import get_cross_session_memory_bundle, get_pattern_detection_bundle
from app.services.locale_service import LocaleResolver
from app.storage.memory_store import load_memory, save_memory
from app.storage.session_store import load_session


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _load_session(session_id: str) -> SessionStateOut:
    payload = load_session(session_id)
    if not payload:
        raise HTTPException(status_code=404, detail='Session not found')
    return SessionStateOut(**payload)


def _profile_key(state: SessionStateOut) -> str:
    fields = get_cross_session_memory_bundle().get('memory_profile_fields', [])
    values = []
    for field in fields:
        if field == 'life_setup':
            values.append(getattr(state.user_reality_context, 'life_setup', 'unknown'))
        elif field == 'locale':
            values.append(state.locale)
        else:
            values.append(str(getattr(state.context_profile, field, 'unknown')))
    normalized = '-'.join(values).replace(' ', '_').replace('/', '_')
    return normalized.lower()


def _load_memory_doc(profile_key: str) -> dict:
    return load_memory(profile_key) or {'profile_key': profile_key, 'snapshots': [], 'wheel_history': []}


def create_memory_snapshot(session_id: str) -> CrossSessionMemoryOut:
    state = _load_session(session_id)
    resolver = LocaleResolver(state.locale)
    cfg = get_cross_session_memory_bundle()
    if len(state.selected_keyword_ids) < cfg['snapshot_rules']['min_keywords_for_snapshot']:
        raise HTTPException(status_code=400, detail='Not enough keyword evidence for snapshot')
    profile_key = _profile_key(state)
    doc = _load_memory_doc(profile_key)
    snapshot = MemorySnapshotOut(
        snapshot_id=f'mem_{uuid4().hex[:12]}',
        source_session_id=session_id,
        profile_key=profile_key,
        captured_at=_now(),
        selected_feeling=state.selected_feeling,
        keyword_ids=state.selected_keyword_ids[-cfg['snapshot_rules']['max_recent_keywords']:],
        top_life_area_ids=[item.life_area_id for item in (state.wheel_preview.life_area_scores[:3] if state.wheel_preview else [])],
        trail_event_ids=[event.event_id for event in state.trail[-cfg['snapshot_rules']['max_recent_trail_ids']:]],
    )
    point = WheelHistoryPointOut(
        snapshot_id=snapshot.snapshot_id,
        source_session_id=session_id,
        captured_at=snapshot.captured_at,
        life_area_scores={item.life_area_id: item.score for item in (state.wheel_preview.life_area_scores if state.wheel_preview else [])},
        evidence_keyword_ids={item.life_area_id: [e.node_id for e in item.evidence] for item in (state.wheel_preview.life_area_scores if state.wheel_preview else [])},
    )
    doc['snapshots'].append(snapshot.model_dump(mode='json'))
    doc['wheel_history'].append(point.model_dump(mode='json'))
    save_memory(profile_key, doc)
    return CrossSessionMemoryOut(
        profile_key=profile_key,
        snapshot_count=len(doc['snapshots']),
        latest_snapshot=snapshot,
        latest_summary_label=resolver.resolve('memory.summary.available'),
        recent_snapshot_ids=[item['snapshot_id'] for item in doc['snapshots'][-5:]],
    )


def get_cross_session_memory(session_id: str) -> CrossSessionMemoryOut:
    state = _load_session(session_id)
    profile_key = _profile_key(state)
    doc = _load_memory_doc(profile_key)
    resolver = LocaleResolver(state.locale)
    latest = MemorySnapshotOut(**doc['snapshots'][-1]) if doc.get('snapshots') else None
    return CrossSessionMemoryOut(
        profile_key=profile_key,
        snapshot_count=len(doc.get('snapshots', [])),
        latest_snapshot=latest,
        latest_summary_label=resolver.resolve('memory.summary.available' if latest else 'memory.summary.none_yet'),
        recent_snapshot_ids=[item['snapshot_id'] for item in doc.get('snapshots', [])[-5:]],
    )


def get_wheel_history(session_id: str) -> WheelHistoryOut:
    state = _load_session(session_id)
    profile_key = _profile_key(state)
    doc = _load_memory_doc(profile_key)
    points = [WheelHistoryPointOut(**item) for item in doc.get('wheel_history', [])]
    return WheelHistoryOut(profile_key=profile_key, point_count=len(points), points=points)


def detect_patterns(session_id: str) -> PatternDetectionOut:
    state = _load_session(session_id)
    profile_key = _profile_key(state)
    doc = _load_memory_doc(profile_key)
    resolver = LocaleResolver(state.locale)
    thresholds = get_cross_session_memory_bundle().get('pattern_thresholds', {})
    pattern_defs = {item['id']: item['label_key'] for item in get_pattern_detection_bundle().get('pattern_types', [])}
    snapshots = [MemorySnapshotOut(**item) for item in doc.get('snapshots', [])]
    wheel_points = [WheelHistoryPointOut(**item) for item in doc.get('wheel_history', [])]
    patterns: list[PatternSignalOut] = []
    if snapshots:
        keyword_counter = Counter(keyword for s in snapshots for keyword in s.keyword_ids)
        recurring_keywords = [k for k, count in keyword_counter.items() if count >= thresholds.get('recurring_keyword_min_snapshots', 2)]
        if recurring_keywords:
            patterns.append(PatternSignalOut(
                id=f'pat_{uuid4().hex[:10]}',
                type='recurring_focus',
                label=resolver.resolve(pattern_defs['recurring_focus']),
                evidence_snapshot_ids=[s.snapshot_id for s in snapshots if any(k in s.keyword_ids for k in recurring_keywords)],
                evidence_keyword_ids=recurring_keywords,
                confidence=0.7,
                note='Repeated keyword focus detected across snapshots.',
            ))
        area_counter = Counter(area for s in snapshots for area in s.top_life_area_ids)
        recurring_areas = [a for a, count in area_counter.items() if count >= thresholds.get('persistent_life_area_min_snapshots', 2)]
        if recurring_areas:
            patterns.append(PatternSignalOut(
                id=f'pat_{uuid4().hex[:10]}',
                type='persistent_wheel_pressure',
                label=resolver.resolve(pattern_defs['persistent_wheel_pressure']),
                evidence_snapshot_ids=[s.snapshot_id for s in snapshots if any(a in s.top_life_area_ids for a in recurring_areas)],
                evidence_life_area_ids=recurring_areas,
                confidence=0.72,
                note='The same wheel areas continue to surface over time.',
            ))
    if len(wheel_points) >= thresholds.get('oscillation_min_points', 3):
        first_areas = sorted(wheel_points[0].life_area_scores, key=wheel_points[0].life_area_scores.get, reverse=True)[:2]
        last_areas = sorted(wheel_points[-1].life_area_scores, key=wheel_points[-1].life_area_scores.get, reverse=True)[:2]
        overlap = set(first_areas) & set(last_areas)
        if overlap:
            patterns.append(PatternSignalOut(
                id=f'pat_{uuid4().hex[:10]}',
                type='stability_signal',
                label=resolver.resolve(pattern_defs['stability_signal']),
                evidence_snapshot_ids=[wheel_points[0].snapshot_id, wheel_points[-1].snapshot_id],
                evidence_life_area_ids=sorted(overlap),
                confidence=0.6,
                note='Top wheel pressure areas stayed similar across time.',
            ))
    return PatternDetectionOut(profile_key=profile_key, pattern_count=len(patterns), patterns=patterns)
