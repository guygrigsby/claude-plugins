# sno

A lightweight Claude Code plugin for spec-driven development. No bloat, no ceremony — just a loop.

## Install

```
/plugin add guygrigsby/sno
```

## The Loop

```
init → learn → plan → build → check → ship
```

| Command | What it does |
|---------|-------------|
| `/sno:new` | Start a new cycle. Pulls latest, creates a branch, archives previous cycle. |
| `/sno:learn` | Understand the problem. Parallel Opus agents research the domain, data model, and codebase. Then asks you targeted questions. Produces a spec. |
| `/sno:plan` | Break the spec into structured tasks with verify/done criteria per task |
| `/sno:build` | Execute tasks in parallel waves with per-wave commits |
| `/sno:check` | Verify work against the spec. Auto-diagnoses failures with debug agents. |
| `/sno:ship` | Commit remaining changes and ship |
| `/sno:go` | Quick mode — skip the ceremony for small tasks |
| `/sno:todo` | Parking lot for later |
| `/sno` | Where am I? Routes to the next step. |

## Design Principles

- **DDD always.** Every spec identifies bounded contexts, aggregates, factories, and repositories.
- **5NF target.** Data models normalize fully. Denormalization requires justification.
- **No assumptions.** Ambiguity becomes an open question, not a guess.
- **Extensibility first.** Storage, network, parsing, alerting, syncing — all abstracted as ports.

## Learn Phase Agents

The learn phase spawns four Opus agents:

```
/sno:learn
  ├── domain-researcher  ─┐
  ├── data-modeler       ─┤ parallel
  └── codebase-scout     ─┘
          │
          ▼
  requirements-interviewer → user Q&A → spec.md
```

## Build Phase

The build phase parses task dependencies into waves and executes each wave in parallel:

```
/sno:build
  Wave 1: [task A, task B, task C]  ─── parallel agents
  Wave 2: [task D (depends: A, B)]  ─── waits for wave 1
  Wave 3: [task E (depends: D)]     ─── waits for wave 2
```

Each agent gets the task description, relevant spec sections, file scope, and the task's verification step. Agents verify their own work before reporting success. Each completed wave is committed atomically.

## Quick Mode

For small tasks that don't need the full loop:

```
/sno:go add a --verbose flag to the CLI
```

No state, no spec, no plan file. Scout the code, make the change, verify it, done.

## Cycle Archives

When you `/sno:new` after a completed cycle, the previous cycle's spec, plan, and research are archived to `.sno/archive/<N>/`. The last 5 cycles are kept.

## State

sno stores workflow state in `.sno/` in your project directory. It's gitignored automatically by `/sno:new`.

## License

MIT
