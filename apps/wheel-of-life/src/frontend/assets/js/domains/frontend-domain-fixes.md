# Frontend domain fixes - v18

This pass changes the shell to mobile-first.

## Intent
- mobile is the primary viewport
- tablet is the upper target range
- desktop only stretches the same system
- view modules must not lose content because of equal-height rows

## Main fixes
- right rail on mobile no longer splits wheel and prompt into forced half-heights
- wheel panel uses auto height on mobile/tablet so the chart + legend stay visible
- prompt panel follows the same rule
- bottom nav stays mobile-first and centered on larger screens without becoming desktop-first

## Files touched
- src/frontend/assets/css/layout.css
- src/frontend/assets/css/components.css
