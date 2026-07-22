
# ACCOUNT LIFECYCLE CONTRACT

This document locks the account-ready lifecycle scaffold for the coaching tools foundation.

## Purpose
- Keep identity/account expansion separate from core session logic.
- Ensure export and delete flows remain auditable.
- Ensure consent state is explicit before any account-level persistence expansion.

## Lifecycle states
1. `anonymous_session` — user is operating with local session only.
2. `pseudonymous_linked` — session/memory can be linked under a pseudonymous user key.
3. `account_ready` — the system is prepared to attach an external account system later.
4. `export_requested` — user requested a data package.
5. `delete_requested` — user requested deletion preview or confirmed deletion.
6. `deleted_local` — local scaffold data has been removed or tombstoned.

## Rules
- Raw external identifiers must not be stored in session payloads.
- Account lifecycle actions must emit audit events.
- Export and delete must operate on pseudonymous user keys.
- Delete must support preview before irreversible local removal.
- Consent state must be queryable independently from session content.

## Scope
This is still scaffold architecture. It is not a production identity system.
