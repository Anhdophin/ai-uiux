# TRAIL COMPACTION STRATEGY

Long sessions can create noisy trails. Compaction keeps the trail inspectable.

## Goals
- preserve auditability
- reduce repeated low-signal trail clutter
- keep recent events visible
- archive what was compressed by ID

## Strategy
1. keep the newest N events untouched
2. compact older events into a summary record
3. store the compacted event IDs in compaction metadata
4. never delete the semantic outcome of the session

## Constraints
- compaction must be reversible enough for audit review
- compaction must not remove current keyword state
- compaction summaries must include counts by event type
