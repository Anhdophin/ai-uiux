"""Mapping engine for previewing wheel-of-life evidence.

This module stays deterministic and explainable.
Do not let UI compute weights on its own.
"""

from __future__ import annotations

from collections import defaultdict
from typing import Any

from app.services.content_loader import get_keyword_node_map, get_life_area_map


def build_wheel_preview(selected_keyword_ids: list[str]) -> dict[str, Any]:
    node_map = get_keyword_node_map()
    area_meta = get_life_area_map()
    scores = defaultdict(float)
    evidence = defaultdict(list)

    for node_id in selected_keyword_ids:
        node = node_map.get(node_id)
        if not node:
            continue
        for area_id, weight in node.get("life_area_weights", {}).items():
            numeric_weight = float(weight)
            scores[area_id] += numeric_weight
            evidence[area_id].append({
                "node_id": node_id,
                "label": node["label"],
                "weight": numeric_weight,
            })

    normalized = []
    for area_id, total in sorted(scores.items(), key=lambda item: item[1], reverse=True):
        normalized.append(
            {
                "life_area_id": area_id,
                "life_area_label": area_meta.get(area_id, {}).get("label", area_id),
                "score": round(min(total * 10, 100), 2),
                "evidence": evidence[area_id],
            }
        )

    return {"coverage_count": len(normalized), "life_area_scores": normalized}
