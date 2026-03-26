# sno

A lightweight Claude Code plugin for spec-driven development.

## The Loop

`learn → plan → build → check → ship`

- `/sno` — routes to the next step
- `/sno:init` — initialize sno in a project
- `/sno:learn` — gather context, write a spec
- `/sno:plan` — break spec into tasks
- `/sno:build` — execute tasks one at a time
- `/sno:check` — verify work against spec
- `/sno:ship` — commit and ship
- `/sno:todo` — parking lot for later

## Design Principles

- **DDD always.** Every spec identifies bounded contexts and aggregates.
- **5NF target.** Data models normalize fully; denormalization requires justification.
- **No assumptions.** If the user didn't say it, it's an open question. Ask, don't guess.

## Learn Phase Agents

The learn phase spawns parallel Opus agents:
- `domain-researcher` — DDD analysis (bounded contexts, aggregates, events)
- `data-modeler` — entity/relationship modeling, 5NF normalization
- `codebase-scout` — existing code patterns, conventions, risks
- `requirements-interviewer` — synthesizes open questions into focused interview

## Project State

All workflow state lives in `.sno/` in the user's project directory:
- `state.json` — current phase
- `spec.md` — the spec
- `plan.md` — the task list
- `todos.md` — parking lot
- `research/` — agent outputs from learn phase

## Plugin Structure

See [.claude/plugin-layout.md](.claude/plugin-layout.md) for details.
