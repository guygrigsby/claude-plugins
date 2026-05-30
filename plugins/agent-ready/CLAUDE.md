# agent-ready

Keeps a repo optimized for coding agents, continuously. Same capability delivered three ways: a skill (the rubric and method), an on-demand command, and hooks that enforce it during normal work.

## The principle

Progressive disclosure: an agent should act on the slice it needs without ingesting the whole tree. Lean entry points point to deeper detail, loaded on demand. The seven audited dimensions all serve this.

## The seven dimensions

1. Progressive disclosure (organizing principle)
2. Context files (`CLAUDE.md` + `AGENTS.md`, in sync)
3. File focus (line budget)
4. Boundaries & navigability (defers to `ddd` for structural changes)
5. Verification (one documented gate, matches CI)
6. Ambiguity & redundancy (dead code, duplication, contradicting docs)
7. Discoverability (README, `make help`, self-explaining scripts)

## Components

```
plugins/agent-ready/
├── .claude-plugin/plugin.json
├── CLAUDE.md
├── README.md
├── package.json                 # node --test runner, zero deps
├── agent-ready.local.md.sample  # copy to .claude/agent-ready.local.md to configure
├── commands/agent-ready.md       # /agent-ready: on-demand audit + safe-fix
├── hooks/
│   ├── hooks.json                # PreToolUse line-budget + SessionStart drift
│   ├── check-file-size.js        # glue
│   ├── check-context-drift.js    # glue
│   └── lib/                       # config.js, file-size.js, drift.js (pure, tested)
├── tests/                         # node:test unit tests for the pure logic
└── skills/agent-ready/
    ├── SKILL.md                   # lean: rubric + method, links to references
    └── references/                # one file per dimension, loaded on demand
```

## Safe-fix policy

Auto-fix only the safe class: regenerate/sync context files, fix stale doc links and contradicting docs, document the verify command and `make help`. Never auto-delete code or move files. Dead code is reported with evidence; structural changes defer to `ddd:domain-driven-design`.

## Config

`.claude/agent-ready.local.md` (per repo, YAML frontmatter): `line_budget`, `file_size_rule` (warn/block/off), `context_drift_commits`, `ignore` globs. See `agent-ready.local.md.sample`. Hooks ship advisory by default.

## Tests

`cd plugins/agent-ready && node --test`. The hook logic (config parsing, file-size decision, drift evaluation) is pure and unit-tested; the hook scripts are thin glue over it.

## Versioning

Version lives in `.claude-plugin/plugin.json` and the marketplace entry in `../../.claude-plugin/marketplace.json`. Bump both together.
