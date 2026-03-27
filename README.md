# guygrigsby-plugins

Claude Code plugins by Guy Grigsby.

## Install

```
/plugin marketplace add guygrigsby/sno
```

Then install individual plugins:

```
/plugin install sno
```

## Plugins

### sno

Lightweight spec-driven development. No bloat, no ceremony -- just a loop.

```
init -> learn -> plan -> build -> check -> ship
```

| Command | What it does |
|---------|-------------|
| `/sno:new` | Start a new cycle. Pulls latest, creates a branch, archives previous cycle. |
| `/sno:learn` | Understand the problem. Parallel Opus agents research the domain, data model, and codebase. Then asks you targeted questions. Produces a spec. |
| `/sno:plan` | Break the spec into structured tasks with verify/done criteria per task |
| `/sno:build` | Execute tasks in parallel waves with per-wave commits |
| `/sno:check` | Verify work against the spec. Auto-diagnoses failures with debug agents. |
| `/sno:ship` | Commit remaining changes and ship |
| `/sno:go` | Quick mode -- skip the ceremony for small tasks |
| `/sno:todo` | Parking lot for later |
| `/sno` | Where am I? Routes to the next step. |

## Adding a Plugin

1. Create a directory under `plugins/<name>/`
2. Add `.claude-plugin/plugin.json`, `commands/`, and optionally `agents/`
3. Add an entry to `.claude-plugin/marketplace.json`

## License

MIT
