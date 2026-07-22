MANDATORY FRONTEND SCAFFOLD RULES

Every new frontend scaffold must follow these rules.

1. Separate UI from data access

Frontend must not mix:

rendering logic
interaction logic
API request logic
domain data transformation
all in one file if the app is more than trivial.

Minimum separation:

components/pages
services/api layer
utilities/helpers
styles
2. Create a service layer for requests

If the app talks to any backend or may do so later, scaffold a dedicated service layer.

Examples:

src/services/api.ts
src/services/appService.js
web/services/api.js

Do not scatter direct fetch calls across random UI files unless the app is truly tiny.

3. Keep frontend state categories separate

The AI must distinguish:

UI state
domain state
request state

Examples:

UI state: active tab, modal open, accordion state
request state: loading, success, error
domain state: app data, items, task list, analysis result

Do not mix them carelessly.

4. Do not scaffold secrets into frontend

Never place in frontend scaffold:

real API keys
provider secrets
DB secrets
admin secrets
business-critical internal config
AI core prompts

Public config only.

MANDATORY BACKEND SCAFFOLD RULES

If the app is not purely static, backend readiness must be scaffolded.

1. Separate route layer from service layer

Minimum backend separation:

route/controller layer
service/business logic layer
data/schema/model layer

Do not scaffold all server logic inside a single giant entry file if the app is likely to grow.

2. Backend must be the source of truth

The scaffold must assume that sensitive logic belongs on the backend.

The backend scaffold should be ready to own:

auth
permission
ownership
validation
business rules
storage access
provider calls
export logic
3. Prepare auth and permission folders when likely needed

If the app may later need:

login
admin
personal data
role separation
parent/child relationships
object ownership

then scaffold folders such as:

auth/
permissions/

even if the first version uses placeholders.

4. Prepare data/schema structure

For growth-ready apps, scaffold places for:

schemas
models
DB access
storage helpers

This does not mean overengineering.
It means leaving clear extension points.

ENVIRONMENT AND CONFIG RULES

Every new non-static app scaffold must include:

1. .env.example

At minimum, include placeholders for:

API base URL
database URL if needed
auth secret placeholder if needed
provider key placeholder if needed

Example:

APP_ENV=
API_BASE_URL=
DATABASE_URL=
JWT_SECRET=
PROVIDER_API_KEY=

Do not put real secrets in scaffold files.

2. .gitignore awareness

The scaffold must assume:

.env is ignored
secrets are not committed
only .env.example is safe to commit
3. Public vs private config separation

The scaffold must clearly separate:

frontend-public config
backend-private config

Do not blur them.

README REQUIREMENTS

Every new app scaffold must include a useful README.md.

Minimum README sections:

app name
purpose
stack
folder structure
how to run locally
where frontend lives
where backend lives
environment setup
current status
future extension notes if relevant

The README must help a human quickly understand the scaffold.

CHANGELOG REQUIREMENTS

Every new app scaffold should include CHANGELOG.md.

Purpose:

track meaningful structure changes
help avoid confusion later
support safe iteration over time

Minimum:

version/date section
created scaffold
major structural changes
feature additions
breaking changes if any
CONTRACT / RESPONSE SHAPE RULES

If the app uses API or will likely use API, the scaffold should define or imply a stable response pattern.

Preferred generic shape:

{
  "success": true,
  "data": {},
  "message": ""
}

For validation errors:

{
  "success": false,
  "message": "Invalid input",
  "errors": {}
}

The scaffold must avoid messy inconsistent shapes from the start.

AUTH / PERMISSION PREPARATION RULES

If the app is likely to need user roles or ownership later, the scaffold must prepare for this mentally and structurally.

The AI must assume future checks such as:

who is the current user?
what is this user allowed to do?
who owns this object?
should this route be protected?
should this result be scoped by user?

The scaffold must not lock the app into a frontend-only trust model.

DATA MODEL PREPARATION RULES

For growth-ready apps, the AI should scaffold with data modeling discipline.

Even if not fully implemented yet, the AI should prepare for records that may eventually include:

id
owner_id or equivalent relationship
status
created_at
updated_at

This helps future migration to real persistence.

FILE / STORAGE PREPARATION RULES

If the app may later handle uploads, exports, or generated files, the scaffold should reserve clear places for:

upload handling
export generation
storage access
file validation helpers

Do not wait until the app becomes messy.

AI / PROVIDER PREPARATION RULES

If the app may later use:

AI APIs
external providers
OCR
embeddings
image generation
payment providers
third-party services

then the scaffold must leave backend space for:

provider integration services
response shaping
cost control
secret management

Do not scaffold these flows directly into the frontend by default.

UI SCAFFOLD QUALITY RULES

The UI scaffold should be:

clean
modular
easy to restyle
easy to wire to real data later

The AI should avoid:

giant HTML pages with mixed business logic
deeply tangled DOM manipulation
random utility naming
unclear component boundaries
inline hacks that make future edits painful
NAMING RULES

The scaffold must use naming that is:

human-readable
consistent
extensible
not overly tied to temporary implementation details

Prefer:

taskService
analysisService
authGuard
resultCard
appConfig
routes
schemas

Avoid vague names such as:

misc
helpers2
finalNew
tempFix
utilsStuff
doThing
DEFAULT FILE EXPECTATIONS

For a growth-ready app, the AI should usually scaffold at least:

Frontend
entry file
main page/container
reusable component folder if needed
service/API abstraction
utility/helper file if needed
main style file
Backend
main server entry
route file or route folder
service file or service folder
schema/model placeholder
auth/permission placeholder if relevant
env example
Docs
README
CHANGELOG
WHAT THE AI MUST NOT DO WHEN SCAFFOLDING

The AI must not:

create a fake “real app” that is actually frontend-only and insecure
embed secrets in client files
hardcode private config into public code
place business-critical logic directly in UI files
create giant mixed-responsibility files by default
generate demo shortcuts that will poison future maintainability
assume that auth or storage can just be “added later” without planning the structure now
overengineer tiny demos with unnecessary complexity
underengineer real tools into brittle toy architecture
HOW TO CHOOSE THE RIGHT LEVEL OF SCAFFOLD

The AI must balance:

Do not overbuild

If the app is truly tiny and static, keep it simple.

Do not underbuild

If the app is intended to become useful, protect the future structure now.

Default bias:
choose the lightest scaffold that still preserves a safe upgrade path.

REQUIRED HUMAN-EDIT FRIENDLINESS

The scaffold must be easy for a human designer-builder to inspect and modify.

This means:

clear folder names
obvious entry points
no unnecessary nesting
no cryptic abstractions
comments where structure may not be obvious
clean surface for hand editing

The AI must remember this repo is meant to be maintained by humans, not only by agents.

MINIMUM README TEMPLATE EXPECTATION

Each generated app scaffold should support a README like this:

App name
Goal
Current mode: Static Demo / Light Mini App / Growth-Ready App
Tech stack
Folder overview
Run instructions
Environment setup
Notes on future backend authority
Notes on sensitive logic placement
MINIMUM CHANGELOG TEMPLATE EXPECTATION

Each generated app scaffold should support a changelog like this:

date/version
initial scaffold created
scaffold mode chosen
key folders added
API/backend readiness added
later feature changes
breaking changes if any
SCAFFOLD ENFORCEMENT SUMMARY

When generating a new app, the AI must always ask:

Is this scaffold safe to grow?
Is the frontend being kept as interface rather than authority?
Is there a path for backend ownership later?
Are secrets kept out of the client?
Is the structure clear enough for human editing?
Is the scaffold lightweight but not naive?
Will future auth/storage/API work fit cleanly here?

If the answer is no, the scaffold is not acceptable.

SHORT DIRECTIVE

Use this compressed directive while scaffolding:

Classify the app correctly
Choose the lightest growth-safe scaffold
Keep frontend as interface, not authority
Leave backend path for real logic
Never expose secrets
Separate UI, service, and backend logic
Include env example for non-static apps
Include README and CHANGELOG
Prefer human-editable structure
Scaffold for evolution, not just first demo