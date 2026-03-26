---
name: learn
description: "Understand the problem. Launch parallel research agents (Opus) for domain analysis, data modeling, and codebase scouting. Then interview for gaps. Produce a spec in .sno/spec.md."
---

You are in the **learn** phase of sno. Your goal is deep understanding before writing a single line of spec.

## What to do

### Step 0: Check state
If `.sno/state.json` doesn't exist, tell the user: "Run `/sno:init` first." and stop.

If `.sno/spec.md` already exists, read it and ask the user if they want to refine it or move on to `/sno:plan`.

### Step 1: Get the user's intent
Ask the user what they want to build — or read what they've already said. Get enough context to brief the research agents. You need at minimum:
- What is the goal?
- Any constraints they already know about?

Don't over-interview here. Get the basics, then let the agents dig.

### Step 2: Launch parallel research agents
Spawn these three agents **in parallel** using the Agent tool:

1. **domain-researcher** — DDD analysis: bounded contexts, aggregates, entities, ubiquitous language, domain events. Uses Opus.
2. **data-modeler** — Entity identification, relationship mapping, 5NF normalization analysis. Uses Opus.
3. **codebase-scout** — Explores existing code for patterns, conventions, relevant modules, risks. Uses Opus.

Give each agent the user's description of what they want to build. If there's existing context (prior conversation, existing code), include that too.

Write each agent's output to `.sno/research/`:
- `.sno/research/domain.md`
- `.sno/research/data-model.md`
- `.sno/research/codebase.md`

### Step 3: Synthesize and interview
Once all three agents return:

1. Read all three research outputs.
2. Collect ALL open questions from every agent.
3. Spawn the **requirements-interviewer** agent to synthesize the questions into a focused interview.
4. Present the questions to the user in batches of 3-5, grouped by topic.
5. Each question must explain WHY it matters — what depends on the answer.
6. Record answers in `.sno/research/answers.md`.

If the user says "just pick defaults" for any question, pick a reasonable default and document it clearly as a chosen default (not a confirmed requirement).

### Step 4: Write the spec
Once all questions are resolved (or defaulted), write `.sno/spec.md`:

```markdown
# Spec: <title>

## Goal
<What we're building and why, 2-3 sentences>

## Context
<What exists, what we're working with>

## Domain Model

### Bounded Contexts
<From domain research — refined by user answers>

### Aggregates & Entities
<From domain research — each aggregate with its factory and repository>

### Repositories
<Repository interfaces the domain defines — persistence is abstracted>

### Infrastructure Ports
<Every external concern abstracted: storage, network, parsing, alerting, syncing, etc.>
<Each port lists its interface and known adapters>

### Domain Services
<Cross-entity behavior and coordination>

### Domain Events
<Key state transitions and triggers>

## Data Model
### Entities & Relationships
<From data modeling — 5NF normalized>

### Data Constraints
- <Cardinality, nullability, uniqueness decisions>
- <Normalization decisions and rationale>

## Requirements
- <Concrete, testable requirement 1>
- <Concrete, testable requirement 2>
- ...

## Done when
- [ ] <Acceptance criterion 1>
- [ ] <Acceptance criterion 2>
- ...

## Decisions Log
- <Decision made>: <rationale> (user-confirmed | default-chosen)
```

### Step 5: Confirm
Show the spec to the user. When they confirm, update `.sno/state.json` phase to `plan`.

## Rules

- **Never assume.** If the user didn't say it and you can't derive it from code, it's an open question.
- **DDD is not optional.** Every spec must identify bounded contexts and aggregates, even for small features.
- **5NF is the target.** Any denormalization must be explicitly justified, not accidental.
- **Keep the spec under 2 pages.** Domain model and data constraints replace prose — they're more precise.
- Requirements must be concrete and testable. "Good UX" is not a requirement. "User can complete checkout in under 3 clicks" is.
- Don't gold-plate. Capture what the user said. Flag what they didn't say as defaults.
- If the user says "just do X", still run the agents but be fast about it. Minimal questions, reasonable defaults, tight spec.
- The research agents use Opus because this phase is where bad assumptions compound. Cheap models here means expensive bugs later.
