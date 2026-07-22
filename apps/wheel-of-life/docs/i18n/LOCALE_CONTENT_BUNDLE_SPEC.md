# Locale Content Bundle Spec

This document defines how locale-facing text bundles must be stored.

## Purpose
- Keep semantic entities language-neutral.
- Keep display text replaceable per locale.
- Make AI prompts and UI labels render from the same source.

## Rules
1. Semantic keys are the source of truth.
2. Locale bundles may only map semantic keys to locale text.
3. Locale bundles must not redefine ontology or business logic.
4. English remains the primary semantic authoring reference.
5. Every locale bundle must support fallback to the default fallback locale.

## Bundle Shape
Each bundle must contain:
- `version`
- `locale`
- `fallback_locale`
- `entries[]`

Each entry must contain:
- `key`
- `label`
- `short`
- `long`
- optional `tone`
- optional `aliases[]`

## Example
```json
{
  "locale": "en",
  "entries": [
    {
      "key": "feeling.unclear_direction.label",
      "label": "Unclear direction",
      "short": "You are unsure where to go next.",
      "long": "This label is used for display only. The semantic key remains stable."
    }
  ]
}
```
