# User Identity Linking Contract

Identity linking allows future account systems to attach multiple sessions and
memory snapshots to the same logical person without storing raw personal data in
analytic documents.

## Contract goals
- keep session state independent from account systems
- allow future login / account providers to attach after the fact
- use pseudonymous user keys inside app data
- preserve unlink capability

## Minimum link record
- link_id
- pseudonymous_user_key
- link_scope
- source_system
- created_at
- session_ids
- memory_profile_keys

## Forbidden patterns
- embedding email directly into session payloads
- mixing billing identity with coaching context state
- writing raw account ids into wheel or keyword evidence records
