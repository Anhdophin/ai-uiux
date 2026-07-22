# Semantic Label Key Registry

This registry defines the naming convention for label keys used across UI and AI.

## Key Pattern
`<namespace>.<entity>.<field>`

Examples:
- `feeling.unclear_direction.label`
- `feeling.unclear_direction.subtitle`
- `context.current_pressures.money_pressure.label`
- `prompt.deepen_selection.direction_blocked.option_1`

## Namespaces
- `feeling`
- `keyword`
- `context`
- `wheel`
- `prompt`
- `ui`

## Rules
1. Keys must be English-based and language-neutral.
2. Keys must never contain locale-specific words.
3. Keys must remain stable after release unless deprecated with migration notes.
4. Display text changes must happen in locale bundles, not in the key registry.
5. Prompt option labels and UI chip labels should both use registry keys.
