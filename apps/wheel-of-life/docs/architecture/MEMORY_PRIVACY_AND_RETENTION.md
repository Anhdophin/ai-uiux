# Memory Privacy And Retention

This document defines how session memory, cross-session memory, and account-ready
identity links must be handled in the scaffold.

## Core principles
- raw session data is temporary by default
- cross-session memory is profile-scoped and minimized
- retention is explicit, not implied
- pseudonymous identity keys are preferred over direct personal identifiers
- audit metadata must be kept separate from user-facing summaries

## Retention layers
1. Session trail: short-lived working state.
2. Memory snapshot: longer-lived summary used for longitudinal patterning.
3. Identity link record: minimal mapping layer for future account systems.

## Scaffold constraint
This scaffold uses local file storage. It is suitable for architecture validation,
not production privacy guarantees.
