# SESSION ANALYTICS SPEC

This document defines the analytics layer for selection-first sessions.

## Purpose
- summarize session progress without reading raw trail manually
- surface journey density, prompt usage, and signal strength
- keep analytics derived, never overwrite raw user selections

## Core outputs
- total trail events
- distinct event types
- keyword count
- prompt generation count
- AI option resolution count
- engagement stage: early / active / deep
- resume readiness score

## Rules
- analytics are derived snapshots
- analytics must be reproducible from stored session state
- analytics must not invent meaning beyond existing state
- analytics should remain locale-neutral at the key level
