# APP_SCAFFOLD_RULES.md

## PURPOSE

This file defines the required scaffold rules for creating any new app in this repository.

Any AI agent creating a new app must generate a scaffold that is:

- structurally clean
- safe to grow
- secure by default
- clear for human editing
- consistent with the shared repo architecture
- ready for future backend authority
- suitable for real mini apps, not just throwaway demos

The AI must not generate shallow prototype architecture if the app is intended to evolve.

---

## CORE PRINCIPLE

Every new app must be scaffolded with this mindset:

**Frontend is the interface. Backend is the authority.**

Even if the first version is small, the app structure must make it easy to:
- move logic to backend
- add auth later
- add persistence later
- add admin later
- add logs later
- add API routes later
- add permissions later

Scaffold for growth, not just for first render.

---

## APP CREATION MODES

When creating a new app, the AI must classify it into one of these modes.

### MODE A — STATIC UI DEMO
Use only when the app is clearly just:
- layout demo
- visual prototype
- pure presentation page
- no real data
- no auth
- no user-specific state
- no business-critical logic

Allowed:
- HTML/CSS/JS only
- static data
- mock interactions

Not allowed:
- pretending UI-only restrictions are security
- putting secrets or real business logic in client code

---

### MODE B — LIGHT MINI APP
Use when the app has:
- form input
- local tools
- some data flow
- possible future storage
- possible future user accounts
- some non-trivial logic

Expected scaffold:
- frontend folder
- server/backend-ready folder
- API service abstraction on frontend
- environment example
- modular naming
- clear separation of UI vs logic

Even if backend is not fully implemented on day one, the scaffold must prepare for it.

---

### MODE C — REAL APP / GROWTH-READY APP
Use when the app has or will likely have:
- user accounts
- personal data
- file storage
- app-specific rules
- business logic
- AI/provider calls
- export
- history
- admin management
- permissions
- ownership

Expected scaffold:
- full frontend/backend split
- auth-ready structure
- route/service separation
- schema/model structure
- env example
- shared constants/contracts if needed
- security-aware API design
- storage/logging placeholders if relevant

This is the default mode unless the app is clearly only a static demo.

---

## REQUIRED SCAFFOLD THINKING

Before generating a new app, the AI must first decide:

1. What is the real purpose of this app?
2. Is it only a visual demo or a real tool?
3. Will it likely need user data later?
4. Will it likely need backend logic later?
5. Will it likely need storage, export, AI, or auth later?
6. Is there any sensitive logic that must never live in the client?

The scaffold must be chosen based on likely growth, not only current simplicity.

---

## DEFAULT APP FOLDER CONVENTIONS

Unless there is a very strong reason not to, a new app should follow one of these structures.

---

## SCAFFOLD OPTION 1 — SMALL BUT GROWTH-READY

```txt
app-name/
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ modules/
│  │  ├─ services/
│  │  ├─ utils/
│  │  ├─ styles/
│  │  └─ main.*
│  └─ ...
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  ├─ services/
│  │  ├─ schemas/
│  │  ├─ models/
│  │  ├─ db/
│  │  ├─ auth/
│  │  ├─ permissions/
│  │  ├─ storage/
│  │  ├─ logging/
│  │  └─ main.*
│  ├─ requirements.txt / package.json / go.mod
│  └─ ...
├─ shared/
│  ├─ contracts/
│  ├─ constants/
│  └─ docs/
├─ .env.example
├─ README.md
└─ CHANGELOG.md