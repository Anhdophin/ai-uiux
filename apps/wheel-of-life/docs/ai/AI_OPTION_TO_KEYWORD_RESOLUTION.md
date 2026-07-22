# AI Option to Keyword Resolution Contract

AI in this product should ask selection-first questions. Once the user picks an option, the system must resolve that choice into structured state changes.

## Contract
An AI option selection should map to:
- zero or more keyword ids
- optional focus tags
- optional next mode
- a trail label key

## Why this exists
This prevents the product from treating AI output as loose prose. Instead, AI becomes a bridge from guided choice to typed domain state.

## Resolution rules
- resolution is deterministic when a contract entry exists
- suggested keyword ids are additive, not destructive by default
- if a keyword already exists in the session, do not duplicate it
- a resolution can update the next prompt mode suggestion

## Long-term extension
Later, a model can propose candidate resolutions, but only after passing through the same schema and validator.
