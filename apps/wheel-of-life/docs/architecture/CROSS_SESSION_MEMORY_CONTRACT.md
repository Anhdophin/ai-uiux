# Cross-Session Memory Contract

This document defines the durable memory layer that sits above single sessions.

## Purpose
- preserve useful patterns across sessions without storing raw chat as the primary memory unit
- keep memory selection-first, auditable, and language-neutral
- allow future AI layers to reason from structured memory snapshots rather than loose transcripts

## Core units
- **memory profile key**: stable grouping key derived from locale + context profile + life setup
- **memory snapshot**: summarized record captured from one completed or partial session
- **memory aggregate**: cross-session rollup for a memory profile key
- **longitudinal wheel record**: time-stamped wheel preview evidence from a memory snapshot
- **pattern signal**: derived recurring signal such as repeated keyword clusters or recurring life-area imbalance

## Rules
1. Cross-session memory must never overwrite raw session state.
2. Memory snapshots are derived artifacts and must retain source session ids.
3. Memory keys remain semantic and locale-neutral where possible.
4. Pattern detection must stay explainable and traceable to snapshots.
5. Longitudinal wheel tracking must always reference evidence keyword ids.

## Storage shape
- file-backed for scaffold stage
- replaceable by database later with no route contract break

## Future extension
- per-user account linkage
- privacy mode / memory retention policy
- reviewed memory versus auto-derived memory
