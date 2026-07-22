# AI_INVESTMENT_AND_OPERATIONS

<!--
Purpose:
Clarify what must be invested if AI is used in this project.
This app should not be treated like a free-form chatbot project.
-->

## What to invest in first
The first investment is not the most powerful model.
The first investment is control.

### Priority order
1. semantic schemas
2. prompt contracts
3. output validation
4. audit logs and traceability
5. model choice and cost optimization

## Required AI stack layers

### 1. Context snapshot builder
Before any AI call, the system must build a normalized snapshot including:
- locale
- persona profile
- user reality context
- selected feeling
- selected keyword keys
- current wheel preview
- allowed AI mode

### 2. Prompt contract layer
Prompt assembly must stay centralized.
Prompt builders must be versioned.
The prompt should consume structured inputs, not raw screen text alone.

### 3. AI mode system
Supported foundational modes:
- `clarify_context`
- `suggest_keywords`
- `deepen_selection`
- `map_pattern`
- `wheel_interpretation`
- `reflection_prompt_generation`
- `locale_generation`

### 4. Structured output layer
AI output must be machine-checkable.
Preferred output sections:
- summary
- selectable options
- possible patterns
- follow-up questions
- suggested next nodes
- confidence note
- locale used

### 5. Validation layer
Reject AI output when:
- schema fields are missing
- selectable options are not actually selectable
- output ignores current locale
- output overreaches beyond available context
- output contains long free-form advice in selection-first mode

## Minimum viable AI spending plan

### Starter stage
- one reliable API model
- strict schema outputs
- caching for repeated context + node combinations
- prompt version registry

### Growth stage
- evaluation set for AI responses
- output review dashboard
- locale generation queue
- analytics for dead-end flows

### Mature stage
- quality scoring per AI mode
- content QA workflow
- multilingual review pipeline
- model routing by task type

## Operational rules
- AI cannot mutate raw user data
- AI cannot mutate approved seed bundles directly
- AI-generated suggestions are derived content
- every AI output must include enough trace fields to audit later

## Cost control ideas
- cache locale generation results
- precompute common selectable follow-ups for popular nodes
- reserve high-cost models for ambiguous cases or final summaries
- use narrow prompts with rich context snapshots instead of long chat history

## What not to underinvest in
Do not skip:
- validator code
- schema tests
- prompt versioning
- audit logs

Without these, the app will sound smart but become structurally unreliable.
