
# DATA EXPORT / DELETE FLOWS

## Export flow
1. User identity is resolved to a pseudonymous user key.
2. System previews linked resources:
   - sessions
   - memory profiles
   - identity links
   - consent events
3. User confirms export.
4. System emits `export_requested` and `export_generated` audit events.
5. Export package is assembled from linked local records.

## Delete flow
1. User identity is resolved to a pseudonymous user key.
2. System previews linked resources and retention notes.
3. User confirms delete.
4. System emits `delete_requested` audit event.
5. Local scaffold deletes sessions, memory profiles, and identity links for the pseudonymous key.
6. System emits `delete_completed` audit event with deletion summary.

## Non-goals
- no background jobs
- no external email delivery
- no production-grade legal compliance implementation

## Contract notes
- Export package must be explainable and bounded.
- Delete preview must never silently delete data.
- Audit events must survive export/delete operations when retention policy allows.
