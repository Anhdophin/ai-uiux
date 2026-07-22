# SELECTION_FIRST_UX_RULES

<!--
Purpose:
Lock the primary interaction model.
This app is selection-first, not typing-first.
-->

## Core rule
Primary interaction must be choice-based.
The user should mainly:
- choose cards
- choose chips
- choose keyword paths
- choose current pressures
- choose goals and constraints
- choose AI follow-up options

## Why this matters
- reduces friction
- improves data consistency
- improves multilingual support
- makes AI mapping more reliable
- keeps auditability higher

## Input hierarchy

### Tier 1 — required interaction
Selection only.
Examples:
- age band
- gender
- life stage
- career stage
- current pressures
- goals
- constraints
- feeling entry
- keyword expansion

### Tier 2 — optional lightweight input
Short additive input only.
Allowed examples:
- one short custom keyword
- one brief note fragment
- one correction tag

### Tier 3 — long free text
Not default.
Must remain hidden or optional.
Should only appear after the user already has a context trail.

## AI question pattern
AI should ask in selectable form.
Prefer:
- “Which of these feels closer?”
- “Which pressure is stronger right now?”
- “Which next path should we open?”

Avoid:
- “Please describe everything in detail.”
- “Write your whole situation.”

## UI design implications
- chips should be first-class components
- every AI response should try to produce 2–6 selectable paths
- long text areas must not dominate early screens
- journey should feel like layered discovery

## Reflection rules
Reflection is still allowed, but should be scaffolded by choices.
Example pattern:
1. choose which statement is closest
2. optionally add 1 short note
3. continue

## Accessibility note
Selection-first does not mean shallow.
The system should reveal deeper nuance through progressive branching, not through forcing large text input.
