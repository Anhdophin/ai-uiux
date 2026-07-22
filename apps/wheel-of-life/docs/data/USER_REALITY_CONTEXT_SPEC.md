# USER_REALITY_CONTEXT_SPEC

<!--
Purpose:
Define the real-life context layer chosen by the user.
This is different from persona matrix.
-->

## Distinction

### Persona matrix
A generalized context model.
Used to estimate likely pressures, priorities, and blind spots.

### User reality context
The current actual situation chosen by the user.
Used to ground the experience in what is true now.

## Required context groups

### 1. Current life setup
Examples:
- studying
- graduating_soon
- first_job
- working_few_years
- paused_or_interrupted
- changing_career
- small_business
- planning_startup

### 2. Current pressures
Examples:
- money_pressure
- career_pressure
- direction_pressure
- family_pressure
- health_pressure
- time_pressure
- confidence_drop
- falling_behind

### 3. Current goals
Examples:
- find_direction
- stabilize
- increase_income
- change_career
- grow_capability
- build_long_term_foundation
- catch_up_with_the_times
- build_something_own

### 4. Current constraints
Examples:
- low_time
- low_money
- no_mentor
- family_responsibility
- skill_gap_after_pause
- low_focus
- unsupportive_environment

### 5. Readiness level
Examples:
- just_want_clarity
- want_direction_suggestions
- ready_to_start_change
- ready_to_plan

## Data rules
- all values must be selectable ids
- labels are localized separately
- one user may choose multiple pressures, goals, and constraints
- a context snapshot should preserve the exact chosen ids

## Why this layer exists
Without user reality context, the system may become too generic.
This layer lets the engine compare:
- who this kind of user may be
- what this user is actually dealing with now

## Context snapshot usage
User reality context should influence:
- suggested entry keywords
- AI follow-up option generation
- wheel interpretation tone
- prioritization of next branches

## Audit rules
The system must report:
- context option ids referenced by UI but missing in seed
- selected ids that are deprecated
- locale labels missing for context options
