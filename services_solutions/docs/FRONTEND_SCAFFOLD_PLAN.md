# Frontend Scaffold Plan

## 1. Build Goal
Build a lightweight frontend prototype that renders a Dynamic CV as a role-driven interface. The scaffold should support:
- role cards on entry
- animated group blocks
- animated info bars
- switching between roles
- rich-detail panel from JSON

The first version should focus on structure and behavior, not visual perfection.

---

## 2. Recommended Tech Stack
Use a lightweight stack first:
- HTML
- CSS
- Vanilla JavaScript
- JSON data files

Why:
- easy to inspect
- easy for AI to modify
- low complexity
- portable into larger systems later

A framework can be added later if truly needed.

---

## 3. Folder Structure
```txt
dynamic-cv/
├─ index.html
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css
│  │  ├─ base.css
│  │  ├─ layout.css
│  │  ├─ components.css
│  │  ├─ animations.css
│  │  └─ pages.css
│  ├─ js/
│  │  ├─ app.js
│  │  ├─ state.js
│  │  ├─ data-loader.js
│  │  ├─ render.js
│  │  ├─ transitions.js
│  │  ├─ detail-panel.js
│  │  ├─ utils.js
│  │  └─ components/
│  │     ├─ role-card.js
│  │     ├─ group-block.js
│  │     ├─ info-bar.js
│  │     └─ rich-content.js
│  └─ images/
├─ data/
│  ├─ profile.json
│  ├─ roles.json
│  ├─ groups.json
│  ├─ items.json
│  ├─ details.json
│  └─ ui-config.json
├─ docs/
└─ rules/
```

---

## 4. HTML Regions
`index.html` should contain these major regions:
- `hero-region`
- `role-cards-region`
- `info-stage-region`
- `detail-panel-root`
- `backdrop-root`

### Suggested structure
- Header/hero at top
- Role cards directly below hero
- Information stage below role cards
- Detail panel mounted separately above layout

---

## 5. Core State Model
The prototype should manage a single app state object.

```js
{
  selectedRoleId: null,
  loadedData: {
    profile: null,
    roles: [],
    groups: [],
    items: [],
    details: [],
    uiConfig: null
  },
  activeGroupIds: [],
  activeItemIds: [],
  openDetailId: null,
  isTransitioning: false,
  reducedMotion: false
}
```

### State Rules
- only one role is active at a time
- detail panel can only show one detail at a time
- while transition is active, suppress repeated rapid role switching

---

## 6. Rendering Flow
### 6.1 Initial Load
1. load all JSON files
2. render hero/profile text
3. render role cards
4. wait for viewer selection or auto-select first role if desired

### 6.2 On Role Select
1. set `isTransitioning = true`
2. animate out current items and blocks
3. compute new active groups for selected role
4. render new groups
5. render bars into matching groups
6. animate entry
7. set `isTransitioning = false`

### 6.3 On Detail Trigger Click
1. locate `detail_id` from selected item
2. open detail panel
3. render structured content or allowed HTML

---

## 7. Component Responsibilities
### 7.1 Role Card Component
Handles:
- title
- summary
- tags
- active state
- click event

### 7.2 Group Block Component
Handles:
- block title
- caption
- content container
- entry/exit animation classes

### 7.3 Info Bar Component
Handles:
- short label
- style variant
- optional `!` trigger
- entry/exit animation classes

### 7.4 Rich Content Renderer
Handles:
- paragraph block
- heading block
- list block
- quote block
- image block
- optional raw HTML rendering if allowed

### 7.5 Detail Panel Component
Handles:
- open/close
- header and title
- scrollable content area
- accessibility attributes
- overlay interaction

---

## 8. Animation Plan
### 8.1 Group Entry
Apply classes like:
- `.is-entering`
- `.is-active`

Entry behavior:
- opacity from 0 to 1
- translateY from positive value to 0
- small stagger based on group order

### 8.2 Item Entry
Info bars should:
- use staggered delay
- allow tiny randomized delay within configuration bounds
- settle into stable layout state

### 8.3 Exit Behavior
Old bars:
- fade first
- translate down slightly or reduce emphasis

Old blocks:
- fade after bars or together with minimal delay

### 8.4 Reduced Motion
When reduced motion is enabled:
- remove translate animations
- use quick opacity change only
- avoid randomized motion

---

## 9. Layout Plan
### Desktop
- role cards: 2 to 4 columns depending on width
- stage groups: responsive 2 to 3 columns
- detail panel: side panel from right

### Tablet
- role cards: 2 columns
- stage groups: 2 columns

### Mobile
- role cards: horizontal scroll or single column stack
- stage groups: single column stack
- detail panel: full-screen overlay or bottom sheet

---

## 10. CSS Layer Plan
### tokens.css
Defines:
- spacing
- radius
- shadows
- font sizes
- motion timings
- colors

### base.css
Defines:
- resets
- body
- typography
- base buttons

### layout.css
Defines:
- page wrappers
- grids
- responsive structure

### components.css
Defines:
- role cards
- group blocks
- info bars
- detail panel

### animations.css
Defines:
- entry and exit transitions
- stagger helper classes
- reduced motion overrides

### pages.css
Defines:
- page-specific arrangement and polish

---

## 11. JavaScript Module Plan
### app.js
Bootstraps the application and coordinates load/render.

### state.js
Stores global state and mutation helpers.

### data-loader.js
Fetches JSON files and validates basic references.

### render.js
Renders role cards, groups, and items.

### transitions.js
Handles orchestration of entry/exit timing.

### detail-panel.js
Controls open/close state and rich content rendering.

### utils.js
Generic helpers such as DOM utilities, safe HTML checks, random-in-range, and debounce.

---

## 12. Validation and Safety Checks
Before rendering:
- confirm referenced groups exist
- confirm referenced roles exist
- confirm detail references exist when flagged
- prevent broken UI when a group has zero items

If invalid data is found:
- log clear warning in console
- skip only the broken item if possible
- keep the page running

---

## 13. Progressive Build Phases
### Phase 1 — Structural Prototype
Build:
- role cards
- block rendering
- bar rendering
- simple role switching
- simple detail panel

### Phase 2 — Motion and Polish
Add:
- staggered transitions
- controlled random animation
- active/inactive visual states
- improved spacing and composition

### Phase 3 — Rich Content Expansion
Add:
- image blocks
- quote blocks
- list variants
- optional raw HTML support

### Phase 4 — Advanced Extensions
Possible later additions:
- multilingual content
- audience filters
- role-specific CTA modules
- case-study linking
- export views

---

## 14. Engineering Rules for AI Build
- do not hard-code role content inside HTML
- keep all position, group, item, and detail data external in JSON
- keep component responsibilities separated
- preserve transition flow when changing roles
- do not collapse all info into one long column of text
- prefer modular blocks and bars
- treat detail content as renderable rich content, not alert text
- maintain keyboard accessibility for cards and detail triggers

---

## 15. Definition of Done for V1
V1 is complete when:
- the page loads JSON content correctly
- role cards display properly
- selecting a role renders its groups and items
- switching roles replaces content cleanly
- bars with detail indicators can open a detail panel
- detail panel can display styled text and images from data
- layout remains usable on desktop and mobile

This is the minimum viable scaffold for the Dynamic CV concept.
