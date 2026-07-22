# Context Trail Model

The trail is the auditable memory of the user's path.

## Purpose
- explain why a wheel state exists
- explain why AI asked a specific selectable question
- enable resume / continue later
- support future review and audit

## Trail event types
- `context_initialized`
- `feeling_selected`
- `keyword_selected`
- `keyword_deselected`
- `reflection_updated`
- `ai_prompt_generated`
- `ai_option_resolved`

## Trail rules
- append-only by default
- each event carries `event_id`, `event_type`, `label`, `created_at`
- event payload should stay small and structured
- visible trail labels may be localized, but semantic event type stays language-neutral

## Why this matters
Without a trail, the system can show a result but cannot explain how it got there. That makes later audit and AI review weak.
