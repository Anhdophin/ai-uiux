# BACKEND-FIRST ENFORCEMENT - CURSOR RULES

## PURPOSE
These rules force Copilot or any coding AI to place real processing logic in the backend by default.
Use this pack to avoid repeatedly prompting "move logic to backend" for every small task.

## CORE DEFAULT
- By default, all real business processing MUST be implemented in backend code.
- Frontend MUST remain focused on:
  - display
  - user interaction
  - local UI state
  - input capture
  - optimistic UX only when safe
- Backend MUST own:
  - business rules
  - permissions
  - data mutation
  - sensitive calculations
  - workflow transitions
  - approval logic
  - integration calls requiring secrets
  - anti-abuse checks
  - audit logging
  - canonical status resolution

## NON-NEGOTIABLE RULE
- Never implement critical business logic only in frontend.
- If the same rule appears in both frontend and backend, backend is the source of truth.
- Frontend duplication is allowed only for UX guidance, never for trust.

## WHAT MUST LIVE IN BACKEND
The following MUST be backend-owned unless explicitly marked as purely visual:

### AUTH / ACCESS
- authentication checks
- role checks
- permission checks
- ownership checks
- tenant/family/workspace scope checks

### BUSINESS RULES
- pricing rules
- discount rules
- reward rules
- scoring rules
- approval rules
- state/status transitions
- limit checks
- policy checks
- anti-duplicate logic
- cooldown / quota logic
- scheduling validation

### DATA MUTATION
- create / update / delete handlers
- import / export authorization
- file acceptance rules
- write-side validation
- canonical formatting before persistence

### SENSITIVE COMPUTATION
- totals, fees, commissions, balance changes
- inventory decisions
- eligibility decisions
- recommendation gating if it affects access or money
- content release gating
- unlock conditions tied to privileges, payments, approvals, or points

### INTEGRATIONS
- secret-bearing API requests
- payment provider calls
- email dispatch triggers
- webhook signature verification
- storage signing logic

### SECURITY / ABUSE
- rate limiting
- spam prevention
- fraud/risk checks
- abuse counters
- anomaly detection flags
- audit events
- moderation gates

## WHAT MAY STAY IN FRONTEND
The following MAY stay in frontend if they do not decide trust or mutate server truth:

- layout logic
- loading states
- local filters for already-authorized data
- draft form state
- client-side previews
- local formatting for display
- visual sort order
- animation triggers
- non-security UX hints
- tentative validation for user convenience only

## REQUIRED DECISION RULE
When implementing a feature, AI MUST ask internally:
1. Does this logic affect trust, access, money, identity, workflow state, persistence, or cross-user impact?
2. If yes, it MUST go to backend first.
3. Frontend may mirror it only for UX, never as final authority.

## FEATURE IMPLEMENTATION DEFAULT
For any new feature, AI MUST generate in this order:
1. backend contract
2. backend validation
3. backend service logic
4. backend authorization / policy checks
5. backend response contract
6. frontend integration
7. frontend presentation

AI MUST NOT start by placing core business rules directly in frontend components.

## API-FIRST ENFORCEMENT
- New features SHOULD expose a backend action, route, handler, or service boundary before frontend wiring.
- Frontend components MUST call backend endpoints for canonical create/update/delete or decision-making operations.
- Do not compute security-sensitive results only in browser memory.

## DUPLICATION RULE
- Frontend validation is optional UX enhancement.
- Backend validation is mandatory.
- Frontend status logic may mirror server status for UI responsiveness, but backend status machine is authoritative.

## FORBIDDEN FRONTEND-ONLY PATTERNS
- frontend-only role enforcement
- frontend-only ownership checks
- frontend-only price or reward calculation that becomes final
- frontend-only approval decisions
- frontend-only inventory or quota decisions
- frontend-only paywall / unlock decisions tied to real access
- secret-bearing third-party API calls from browser when avoidable
- relying on hidden buttons or hidden routes as protection

## REQUIRED BACKEND ARCHITECTURE SHAPE
When stack allows, AI SHOULD follow this shape:

- route / controller layer:
  receives request, authenticates, validates, returns response
- service layer:
  business logic, workflow rules, side effects
- policy / permission layer:
  access and ownership decisions
- repository / data layer:
  persistence only
- audit / event layer:
  logging and domain events

Business logic MUST NOT be buried in random UI event handlers.

## STATUS / WORKFLOW RULE
- All workflow transitions MUST be validated in backend.
- Frontend MUST NOT freely set final status values such as approved, paid, completed, shipped, published, rejected, redeemed, or refunded.
- Backend MUST verify allowed current state -> next state transitions.

## FILE / UPLOAD RULE
- Frontend may preview files.
- Backend MUST decide acceptance, storage, scanning path, and ownership.

## WEBHOOK / CALLBACK RULE
- Every webhook, callback, or async confirmation MUST be verified in backend.
- Browser callbacks MUST NOT be treated as trusted proof of payment, approval, or completion.

## RESPONSE CONTRACT RULE
- Backend responses SHOULD return canonical:
  - id
  - status
  - permissions/scope flags if needed for UI
  - normalized totals
  - accepted fields only
- Frontend MUST render from backend-confirmed data after mutation.

## COPILOT EXECUTION INSTRUCTION
When editing or generating code, Copilot MUST prefer:
- adding or extending backend endpoint/service logic
- moving processing out of frontend component files
- reducing client-side trust assumptions
- keeping frontend components thin

## AUTO-REFUSAL RULE
If a requested implementation can be done in frontend quickly but would leave business or security logic in browser code, AI MUST refuse that shortcut and move the logic to backend design first.

## SELF-CHECK PROMPT
Before finalizing code, AI MUST ask:
- What logic here still lives only in frontend?
- Does any browser code decide trust, money, access, status, or ownership?
- Can a user alter this from DevTools and bypass the intended rule?
- If yes, move it to backend.
