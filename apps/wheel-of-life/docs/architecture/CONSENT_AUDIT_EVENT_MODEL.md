
# CONSENT AUDIT EVENT MODEL

Consent and lifecycle actions are recorded as explicit events so future account systems can trust the event history.

## Event families
- `consent_granted`
- `consent_withdrawn`
- `export_requested`
- `export_generated`
- `delete_requested`
- `delete_completed`
- `lifecycle_transition`

## Minimum event fields
- `event_id`
- `event_type`
- `pseudonymous_user_key`
- `scope`
- `created_at`
- `details`

## Design rule
Audit events are append-only. Corrective actions create new events rather than mutating old ones.
