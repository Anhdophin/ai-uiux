# Context-Aware Selectable Prompts

The app is selection-first. AI must therefore generate or retrieve prompt branches that users can choose from.

## Principle
AI should prefer structured choice over open-ended typing.

## Prompt Layers
1. **Mode layer** — clarify, deepen, pattern, wheel.
2. **Context layer** — persona + user reality context.
3. **Selection layer** — selected feeling + selected keyword keys.
4. **Locale layer** — render only after the branch is chosen.

## Prompt Pack Fields
- `id`
- `mode`
- `when`
- `context_filters`
- `question_key`
- `option_keys[]`
- `suggested_keyword_ids[]`
- `priority`

## Usage
The system should:
1. Build a context snapshot.
2. Find prompt packs that match mode and filters.
3. Rank them by specificity and priority.
4. Render the question and options using locale bundles.
5. Return selectable options to the user.

## Forbidden
- Asking for long free-text by default.
- Returning generic advice before context is thick enough.
- Rendering prompts directly from hard-coded UI strings when a semantic key exists.
