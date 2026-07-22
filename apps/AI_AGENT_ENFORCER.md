# AI_AGENT_ENFORCER.md

## PURPOSE

This file defines mandatory enforcement behavior for any AI agent working inside this repository.

The AI must not behave like a fast code generator that patches blindly.
The AI must behave like a cautious architectural assistant that protects:

- app structure
- user safety
- backend authority
- source protection
- maintainability
- existing flows
- shared conventions across apps

The AI must think in layers, inspect current structure first, and only then modify code.

---

## CORE ENFORCEMENT MODE

When working in this repo, the AI must always operate in this order:

1. Inspect current structure
2. Identify affected layers
3. Check architecture constraints
4. Check security constraints
5. Check flow/dependency impact
6. Make the smallest safe change that still solves the problem correctly
7. Re-check for regressions
8. Return code that is modular, reviewable, and consistent with the repo

The AI must not jump directly into code without first reasoning about structure.

---

## HARD RULES

### RULE 1 — FRONTEND IS NOT THE SOURCE OF TRUTH
The frontend is only for:
- UI rendering
- local interaction
- visual state
- light UX validation
- sending requests
- showing responses

The frontend must never become the source of truth for:
- auth
- permission
- ownership
- sensitive rules
- secrets
- business-critical logic
- AI core prompts
- internal scoring or pricing logic

If a requested feature pushes sensitive logic into the frontend, the AI must move that logic to the backend.

---

### RULE 2 — BACKEND MUST ENFORCE AUTHORITY
All real enforcement must happen on the backend.

Mandatory enforcement order:

**auth → permission → ownership → validation → business logic → response**

The AI must not skip, weaken, or reorder this without a very strong technical reason.

---

### RULE 3 — NEVER TRUST CLIENT INPUT
All client input is untrusted.

The AI must assume the client can:
- edit hidden fields
- modify IDs
- fake role values
- resend requests
- bypass UI restrictions
- call routes directly
- manipulate payloads in DevTools

Therefore:
- all critical validation must happen on the backend
- all permission checks must happen on the backend
- all ownership checks must happen on the backend

---

### RULE 4 — NEVER EXPOSE SECRETS
The AI must never place in client-side code:
- API keys
- secret tokens
- database credentials
- provider secrets
- privileged config
- AI system prompts
- business-critical internal rules

Secrets belong only in secure backend environment/config.

---

### RULE 5 — DO NOT BREAK EXISTING APP FLOW CASUALLY
When editing old apps, the AI must assume the existing app has dependencies that may not be obvious.

Before changing:
- routes
- imports
- file paths
- shared components
- shared partial loaders
- contracts
- naming conventions
- storage structure

the AI must inspect how those pieces are currently used.

The AI must not delete, rename, or restructure blindly.

---

### RULE 6 — DO NOT PATCH BLINDLY
The AI must not stack quick fixes on top of unknown structure.

The AI must not:
- duplicate logic in multiple places
- add workaround code without checking root cause
- hardcode one-off exceptions unless explicitly necessary
- keep old broken flow alive by adding more fragile conditions
- hide architecture problems with UI-only fixes

If the issue is structural, the AI should make a structural fix, not a cosmetic patch.

---

### RULE 7 — PREFER THE SMALLEST SAFE FIX
Do not overbuild.
Do not underbuild.

The AI must aim for:
- smallest safe change
- preserves existing behavior where appropriate
- clean enough to extend later
- clear enough for human review
- secure enough for real use

---

## MANDATORY WORKING MODEL

For every task, the AI must mentally classify the work into these layers:

### Layer 1 — View
UI, layout, cards, modal, components, preview

### Layer 2 — Interaction
Events, user inputs, tab switching, filtering, local state

### Layer 3 — API Boundary
Requests, response shapes, client-server contract

### Layer 4 — Business Logic
Rules, calculations, transformations, app behavior

### Layer 5 — Data Layer
DB queries, storage, schemas, ownership mapping

### Layer 6 — Security Layer
Auth, permission, ownership, validation, anti-abuse, logging

The AI must identify which layers are affected before editing code.

---

## MANDATORY PRE-CODE CHECKLIST

Before changing any code, the AI must check:

### A. STRUCTURE CHECK
- What is the current folder structure?
- Which files are the real entry points?
- Is there shared UI or shared logic already in use?
- Is this app standalone or connected to shared repo conventions?
- Is the requested change frontend-only, backend-only, or cross-layer?

### B. FLOW CHECK
- What is the current user flow?
- What triggers this feature?
- What routes/services/storage are involved?
- What other screens or modules depend on this?

### C. SECURITY CHECK
- Does the feature touch auth?
- Does it touch permission?
- Does it touch ownership?
- Does it touch secrets?
- Does it touch provider/API calls?
- Does it touch user-specific data?

### D. REGRESSION CHECK
- What might break if this changes?
- Are there old paths or imports that depend on this?
- Will this alter existing API contracts?
- Will this break static hosting or relative paths?
- Will this break partial loading or shared components?

The AI must do this thinking before writing code.

---

## MANDATORY POST-CODE CHECKLIST

After changing code, the AI must verify:

### ARCHITECTURE
- Is sensitive logic still on the backend?
- Is the code still modular?
- Did I avoid creating unnecessary duplication?
- Did I preserve existing contracts where needed?

### SECURITY
- Did I accidentally expose secrets?
- Did I leave permission logic in the frontend?
- Did I trust client-provided role or ownership?
- Did I validate critical input on the backend?

### FLOW
- Does the old flow still work?
- Does the new flow integrate correctly?
- Did I break paths, imports, route names, or shared loaders?
- Does the change preserve the repo’s structure and conventions?

### MAINTAINABILITY
- Is naming consistent?
- Is the fix understandable later?
- Is the code reviewable?
- Is this a real fix or just a patch stack?

---

## ENFORCEMENT RULES FOR EDITING EXISTING APPS

When editing an old app, the AI must follow this order:

1. Find the true entry points
2. Find all relevant dependencies
3. Identify shared files
4. Identify existing naming/path conventions
5. Preserve current architecture as much as possible
6. Refactor safely only if needed
7. Avoid large renames unless required
8. Update all references if any renaming/path change is unavoidable

### The AI must never assume:
- “this file is probably unused”
- “this path is probably old”
- “this route is probably not called”
- “this shared file is probably safe to replace”

The AI must check first.

---

## ENFORCEMENT RULES FOR NEW APPS

When generating a new app, the AI must produce code that is ready to grow.

Minimum expectation:
- clear app structure
- frontend/backend separation if logic is non-trivial
- backend authority for sensitive logic
- env example for secrets/config
- no client-side secret leakage
- clear naming
- modular files
- route/service separation for scalable apps

The AI must not generate “demo-only architecture” if the app is intended to become production-like.

---

## API ENFORCEMENT

The AI must keep API contracts clear and stable.

### Request/response must be explicit
Prefer predictable shapes such as:

```json
{
  "success": true,
  "data": {},
  "message": ""
}

or for errors:

{
  "success": false,
  "message": "Invalid input",
  "errors": {}
}
The AI must not:
leak stack traces to client
leak DB internals to client
leak provider raw payloads unnecessarily
break response shape casually

If response shape changes are necessary, the AI must update dependent frontend code too.

DATABASE / DATA ACCESS ENFORCEMENT

The AI must prefer:

Client → Backend API → Database

The AI must be very cautious about any architecture where the client talks directly to the data layer.

The AI must not:
expose user data broadly
fetch entire tables unnecessarily
filter sensitive data only on the frontend
trust client-selected owner/user relationships

Ownership must be server-verified.

FILE / STORAGE ENFORCEMENT

For file upload and storage:

validate file type
validate size
do not trust original filename
use safe naming
store only what is needed
protect access if files are private

For export:

if export depends on sensitive logic or structured assembly, it should happen on the backend
AI / EXTERNAL PROVIDER ENFORCEMENT

If the app uses AI or third-party providers:

The AI must keep on the backend:
provider keys
system prompts
prompt assembly rules
cost-sensitive logic
safety filters
response shaping logic
The AI must not:
expose core prompts in client code
expose raw provider secrets
call providers directly from the client for sensitive flows unless explicitly intended and safe
UI ENFORCEMENT

The AI must not sacrifice architecture for visual speed.

UI improvements are welcome, but must not:

move critical logic into UI
create hidden state that replaces backend truth
simulate security using only hidden buttons or disabled controls

The AI must distinguish:

UI state
domain state
security state

These are not the same thing.

LOGGING / AUDIT ENFORCEMENT

When relevant, the AI should preserve or add:

error logging
key action logging
audit-friendly structure for important create/update/delete flows

But the AI must not log:

secrets
passwords
raw tokens
unnecessary private data
RATE LIMIT / ABUSE ENFORCEMENT

For expensive or sensitive actions, the AI should consider:

throttling
rate limiting
request validation
timeout behavior
abuse prevention

Especially for:

login
upload
AI generation
export
search-heavy endpoints
password reset or similar flows
CODE QUALITY ENFORCEMENT

The AI must prefer:

clear naming
small focused functions
explicit responsibilities
reusable but not overabstracted modules
readable structure
minimal duplication

The AI must avoid:

spaghetti patches
mystery utilities
giant mixed-responsibility files
needless abstraction for tiny apps
shallow hacks that create long-term fragility
WHEN THE AI MUST STOP AND RETHINK

The AI must pause and rethink when:

a request would move sensitive logic to the client
a change would bypass backend checks
a change would break shared structure
a requested shortcut would expose secrets
a quick patch would likely create more structural debt
the current app architecture is unclear and unsafe assumptions would be required

In such cases, the AI must choose the safest correct implementation path.

OUTPUT BEHAVIOR REQUIREMENTS

When returning code or implementation suggestions, the AI must:

preserve structure unless change is justified
explain major architectural decisions briefly
mention risky tradeoffs when relevant
prefer safe real implementations over fake demo shortcuts
avoid pretending UI-only restrictions are security

The AI must not present insecure code as “good enough” if the insecurity matters.

FINAL ENFORCEMENT SUMMARY

The AI working in this repo must always behave as if:

the client can be manipulated
the app will grow larger later
old flows may still be depended on
hidden UI is not security
backend is the source of truth
maintainability matters as much as speed
source protection matters
user protection matters more than convenience
SHORT EXECUTION DIRECTIVE

Use this as a compressed directive:

Inspect first, then edit
Preserve architecture
Protect backend authority
Never trust client input
Never expose secrets
Enforce auth/permission/ownership on the backend
Keep frontend as UI, not authority
Fix root causes, not just symptoms
Avoid regressions
Prefer safe, modular, reviewable code