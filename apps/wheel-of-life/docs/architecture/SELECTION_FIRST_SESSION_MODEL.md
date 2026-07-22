# Selection-First Session Model

This foundation layer defines how a user journey becomes a durable session without turning the product into an open chat log.

## Core principles
- Session state is derived from selections, not freeform writing.
- Free-text is optional, short, and always secondary.
- Every state transition must be traceable through a trail event.
- AI never mutates raw user input directly; it proposes selectable next steps.

## Session layers
1. Context lock
2. Feeling lock
3. Keyword expansion
4. Reflection fragment
5. Wheel preview
6. AI selectable prompt
7. AI option resolution

## Persistence contract
A session must be saveable with:
- stable `session_id`
- current normalized state snapshot
- append-only `trail`
- latest wheel preview
- latest selectable prompt

## Design constraints
- Do not store large chat transcripts as the source of truth.
- Do not let UI reconstruct business state from scattered components.
- Do not allow untyped session writes.
