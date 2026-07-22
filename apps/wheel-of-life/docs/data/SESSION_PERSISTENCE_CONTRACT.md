# Session Persistence Contract

The scaffold currently uses a light file-backed repository so the session layer is inspectable and easy to replace later.

## Stored object groups
- `session_meta`
- `context_profile`
- `user_reality_context`
- `selection_state`
- `reflection_state`
- `wheel_preview`
- `latest_selectable_prompt`
- `trail`

## Storage rules
- raw selected ids remain separate from derived wheel state
- localized labels are optional; semantic ids are mandatory
- session files must be replaceable by a database adapter later without breaking API contracts

## Non-goals for the scaffold
- no authentication yet
- no cross-device sync yet
- no analytics writeback yet
