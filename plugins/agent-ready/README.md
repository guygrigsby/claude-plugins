# agent-ready

Keep a repository optimized for coding agents, and keep it that way day to day. Not a one-time retrofit: a skill, an on-demand command, and hooks that hold the line during normal work.

## Install

```
/plugin marketplace add guygrigsby/claude-plugins
/plugin install agent-ready
```

## The idea

A repo is agent-ready when an agent can navigate it, understand just the slice it needs, and verify its own work without reading the whole tree. The organizing principle is **progressive disclosure**: lean entry points that point to deeper detail, loaded on demand.

## What it audits (seven dimensions)

1. **Progressive disclosure**: layered docs; an agent loads only its slice.
2. **Context files**: `CLAUDE.md` + `AGENTS.md`, current, concise, kept in sync.
3. **File focus**: files within a line budget; oversized files flagged.
4. **Boundaries & navigability**: clear structure, discoverable entry points.
5. **Verification**: one documented gate command an agent runs to self-verify, matching CI.
6. **Ambiguity & redundancy**: dead code, duplication, contradicting docs.
7. **Discoverability**: README, `make help`, self-explaining scripts.

## How you use it

- **`/agent-ready`**: on-demand audit across the seven dimensions. Produces a prioritized remediation report and auto-applies the safe fixes.
- **Hooks (automatic)**: a line-budget check on writes and a context-drift check at session start. Advisory by default; configurable.
- **Skill**: the rubric and method the command and hooks call into; also fires when you ask to make a repo agent-ready or refresh its context files.

## Safe by default

Auto-fixes only the safe class: regenerate/sync context files, fix stale doc links, document the verify command. It never deletes code or moves files, dead code is reported with evidence, and structural changes are handed to the `ddd` plugin.

## Configure

Copy `agent-ready.local.md.sample` to `.claude/agent-ready.local.md` in your repo and tune:

- `line_budget` (default 400)
- `file_size_rule`: `warn` (default), `block`, or `off`
- `context_drift_commits` (default 15)
- `ignore` globs

## Develop

```
cd plugins/agent-ready
node --test
```

The hook logic is pure and unit-tested; the hook scripts are thin glue.

## License

MIT.
