# Account Ready Storage Boundary

Storage must remain partitioned by concern.

## Storage zones
- session working store
- cross-session memory store
- identity link store
- future account store (external to this scaffold)

## Boundary rules
- sessions may reference pseudonymous user keys, not personal identifiers
- memory store may aggregate by profile key and linked pseudonymous key
- identity store is the only local layer allowed to connect account-ish input to app state
- external account systems should integrate through adapters, not by mutating core session files directly
