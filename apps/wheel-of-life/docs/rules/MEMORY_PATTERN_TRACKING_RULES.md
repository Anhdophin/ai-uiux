# Memory, Pattern, and Tracking Rules

## Mandatory rules
- Memory is derived, never primary truth.
- Cross-session memory must group by explicit profile keys, not hidden heuristics.
- Pattern outputs must expose evidence sources.
- Longitudinal wheel points must be append-only.
- Deleting a session later should not silently mutate prior derived reports without a rebuild path.

## AI rules
- AI may read memory summaries but may not fabricate missing history.
- AI must distinguish current-session observations from cross-session observations.
- AI should phrase memory findings as patterns, not diagnoses.
