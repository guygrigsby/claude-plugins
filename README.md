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
| `/sno:init` | Initialize sno in your project |
| `/sno:learn` | Understand the problem. Parallel Opus agents research the domain, data model, and codebase. Then asks you targeted questions. Produces a spec. |
| `/sno:plan` | Break the spec into ordered tasks |
| `/sno:build` | Execute tasks in parallel waves. Independent tasks run as concurrent agents; dependent tasks wait. |
| `/sno:check` | Verify work against the spec |
| `/sno:ship` | Commit and ship |
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

Each agent gets the task description, relevant spec sections, and file scope. Agents are told to implement exactly what the task says — nothing more. If an agent hits a problem, the wave stops and you decide what to do next.

## State

sno stores workflow state in `.sno/` in your project directory. It's gitignored automatically by `/sno:init`.

## License

MIT
