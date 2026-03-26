# sno

A lightweight Claude Code plugin for spec-driven development.

## The Loop

`learn → plan → build → check → ship`

- `/sno` — routes to the next step
- `/sno:new` — start a new cycle (pulls latest, creates branch, archives previous cycle if done)
- `/sno:learn` — gather context, write a spec
- `/sno:plan` — break spec into tasks (structured format with verify/done per task)
- `/sno:build` — execute tasks in parallel waves (commits per wave)
- `/sno:check` — verify work against spec (auto-diagnoses failures)
- `/sno:ship` — commit remaining changes and ship
- `/sno:todo` — parking lot for later
- `/sno:go` — quick mode for small tasks, skip the full ceremony

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
