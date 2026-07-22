
# CONSENT / AUDIT EVENT RULES

1. Every export and delete action must create an audit event.
2. Every consent mutation must create an audit event.
3. Audit events are append-only.
4. Audit events must only reference pseudonymous user keys.
5. Export/delete previews are read-only and must not mutate storage.
6. Hard deletion is allowed only through the delete commit flow.
7. Route handlers must stay thin; lifecycle logic belongs in engines.
