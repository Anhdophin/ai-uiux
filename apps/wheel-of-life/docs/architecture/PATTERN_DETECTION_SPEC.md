# Pattern Detection Spec

Pattern detection turns repeated selection history into explainable signals.

## Current scope
- repeated keyword ids
- repeated life areas from wheel evidence
- repeated feelings
- recurring resume stage / readiness markers

## Pattern classes
- **recurring_focus**: same keyword or cluster appears in 2+ snapshots
- **persistent_wheel_pressure**: same life area appears strongly across multiple snapshots
- **stability_signal**: wheel scores narrow over time and repeated pressure drops
- **oscillation_signal**: area scores swing up and down across snapshots

## Constraints
- no black-box scoring in foundation layer
- all patterns must expose source snapshot ids
- pattern confidence in scaffold remains heuristic and low-stakes

## Output shape
- id
- type
- label_key
- evidence_snapshot_ids
- evidence_keyword_ids
- evidence_life_area_ids
- confidence
- note
