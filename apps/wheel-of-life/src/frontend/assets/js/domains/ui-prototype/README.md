# UI Prototype Domain

Purpose:
- lock visual language and responsive behavior before deep app integration
- keep interaction selection-first and icon-first
- let AI/dev later replace demo content without breaking UI structure

Files:
- `prototype-data.js`: demo semantic data for topics, contexts, feelings, keywords
- `prototype-store.js`: small client-only state container
- `renderers.js`: DOM rendering only
- `interaction.js`: drag-scroll and detail-sheet helpers

Rules:
- keep tiles square
- use short labels only on the main UI
- push longer copy into the detail sheet only
- do not add vertical page scroll for new flows
- new lanes should stay horizontally scrollable and drag-safe
