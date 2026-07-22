# Privacy / Retention / Identity Rules

## Mandatory rules
- No raw personal identifier may be stored in session or memory payloads.
- Identity linking must create pseudonymous keys before persistence.
- Retention decisions must come from content-configured policy, not scattered constants.
- Deletion and unlink actions must be represented as explicit storage events.
- Analytics must only read minimized summaries, never free-form personal text by default.
