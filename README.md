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
| `/sno:build` | Execute tasks one at a time |
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

## State

sno stores workflow state in `.sno/` in your project directory. It's gitignored automatically by `/sno:init`.

## License

MIT
