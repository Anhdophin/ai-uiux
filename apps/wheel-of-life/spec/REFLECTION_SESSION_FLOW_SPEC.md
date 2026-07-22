# REFLECTION SESSION FLOW SPEC

## Purpose
Define the UI and logic for a reflection session.

This is the first thing to build because it creates the raw observed data.

## Session goal
A session should help the user move through a short, guided reflection path using choices instead of long typing.

## Core flow
1. Entry context
2. Session opening prompt
3. Step-based option flow
4. Optional note
5. Session close summary
6. Save session log

## Minimum inputs
- entry_context
- emotional_hint
- stated_reason (optional / short)
- timestamp

## Per-step logging
For each step, save:
- step_id
- options_shown
- option_chosen
- option_skipped
- dwell_time
- return_count

## UI rules
- 3 to 5 options per step
- always allow back
- always allow skip
- always allow soft exit
- no open-ended identity questions

## Good example
“When you feel overloaded, what do you usually do first?”
- push through
- avoid and distract
- talk to someone
- stop and rest

## Bad example
“What kind of person are you?”

## Output
A session produces:
- one reflection-session record
- one behavior trace
- optional declared note
