# PATTERN DETECTION RULES

## Purpose
Detect repeated behavioral or thematic signals from session data.

## Build stage
This should start as simple rule-based detection before any advanced AI analysis.

## Minimum valid pattern rule
A pattern is only considered meaningful if it appears:
- at least 3 times
- across at least 2 sessions
- within a defined time span

## Pattern types for v1
- repeated_concern
- avoidance
- contradiction
- return_pattern

## Examples
### repeated_concern
A topic group appears in 3+ sessions.

### avoidance
A branch or option family is repeatedly skipped.

### contradiction
The user declares one direction but repeatedly chooses another.

### return_pattern
The user repeatedly returns to the same area or option family.

## Confidence rule
- low: early signal
- medium: repeated but limited span
- high: repeated consistently across time

## Forbidden behavior
Do not generate personality conclusions from patterns.
Patterns are evidence of repetition, not proof of identity.
