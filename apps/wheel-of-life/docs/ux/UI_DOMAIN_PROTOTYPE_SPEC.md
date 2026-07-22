# UI Domain Prototype Spec

## Goal
Build a responsive, icon-first, selection-first UI shell that can be tested before deep backend wiring.

## Locked principles
- Main UI shows only user-facing information.
- Icons appear before detail.
- Tiles stay same-size and square.
- New layers open in horizontal lanes, not long vertical pages.
- Detail lives in a sheet, not inside the main stage.
- Mobile uses view switching instead of vertical overflow.

## Current structure
- top bar
- home strip
- trail bar
- left rail for topic/context/explore lanes
- right rail for snapshot/wheel/prompt
- bottom nav on small screens
- detail sheet for focused information

## Code split
- `index.html`: shell only
- `assets/css/*`: tokens, effects, components, layout
- `assets/js/main.js`: orchestration only
- `assets/js/domains/ui-prototype/*`: UI-only domain pieces

## Responsive constraints
- page stays within viewport
- horizontal drag lanes are the primary overflow model
- vertical document scroll is intentionally blocked
- desktop keeps explore + view visible together
- mobile switches between explore/context/view/detail
