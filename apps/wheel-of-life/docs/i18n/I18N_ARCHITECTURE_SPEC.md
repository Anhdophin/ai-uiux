# I18N_ARCHITECTURE_SPEC

<!--
Purpose:
Lock multilingual expansion at the semantic layer first.
Future AI agents must not treat visible text as the source of truth.
-->

## Goal
Build the foundation so the app can expand from English-first semantics to multiple display languages later without rewriting node meaning, audit logic, or AI contracts.

## Core principle
Every domain entity must have:
- a stable language-neutral key
- semantic intent fields in English-oriented system terms
- localized display content separated by locale

## Required layers

### 1. Semantic layer
This is the source of truth.
Examples:
- `keyword_key: career.direction.unclear`
- `persona_key: female.30s.career_transition`
- `life_area_key: career.direction_clarity`

Rules:
- keys are never translated
- keys do not depend on UI labels
- audit, mapping, and AI contracts reference keys, not visible text

### 2. Localization layer
This layer contains display content by locale.
Minimum supported locales in foundation:
- `en`
- `vi`

Each localized entity may contain:
- `label`
- `short_meaning`
- `long_meaning`
- `prompt_variants`
- `ui_hint`

### 3. AI language mediation layer
AI receives semantic keys + context snapshot.
AI then generates locale-specific selectable options or summaries.
AI must never depend on one locale string as the only meaning reference.

## Translation strategy

### Phase 1
- semantic keys in English
- docs and schemas in English
- UI can default to Vietnamese
- English locale bundle exists first

### Phase 2
- curated Vietnamese bundle
- AI-assisted locale draft generation allowed
- human review required before production bundle promotion

### Phase 3
- new locales may be generated from semantic keys + approved English source
- every generated locale must pass validation and audit

## Locale bundle rules
Each locale bundle must be versioned and auditable.
Bundle fields:
- `version`
- `locale`
- `fallback_locale`
- `entities`
- `status`
- `review_state`

## Fallback rules
- preferred locale -> fallback locale -> semantic placeholder
- no UI screen should fail because one localized label is missing
- missing translation must be surfaced in audit reports

## AI generation rules for localization
AI may assist with locale generation only when:
- semantic key exists
- English source exists
- output schema is enforced
- generated content is marked as derived, not canonical raw seed

## Audit requirements
The system must be able to report:
- missing localized entities by locale
- entities present in UI but missing in semantic layer
- bundles with stale review state
- labels that conflict with semantic intent

## Anti-patterns
Forbidden:
- using visible text as primary ids
- mixing translation fields directly inside mapping logic
- copying one locale string into another without marking review state
- allowing AI to overwrite approved locale content silently
