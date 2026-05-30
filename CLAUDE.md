# guygrigsby-plugins

A Claude Code plugin marketplace by Guy Grigsby.

## Structure

Each plugin lives in its own directory under `plugins/`:

```
plugins/
├── sno/           # spec-driven development
│   ├── .claude-plugin/plugin.json
│   ├── commands/
│   ├── agents/
│   └── CLAUDE.md
└── wu/            # zero-slop development
    ├── .claude-plugin/plugin.json
    ├── schemas/
    ├── agents/
    └── CLAUDE.md
```

## Adding a New Plugin

1. Create `plugins/<name>/` with a `.claude-plugin/plugin.json`
2. Add commands in `plugins/<name>/commands/` and agents in `plugins/<name>/agents/` (or `skills/` for a skill plugin)
3. Add an entry to `.claude-plugin/marketplace.json` with `git-subdir` source pointing to `plugins/<name>`
4. Add a `CLAUDE.md` in the plugin directory describing the plugin
5. **Always update both plugin lists in the same commit:** the table in the root `README.md` AND the `## Plugins` list at the bottom of this `CLAUDE.md`. A new plugin isn't done until it appears in both. When in doubt, grep the root docs for an existing plugin name and add the new one everywhere that name shows up.

## Versioning

**The plugin version lives in two places and they MUST be bumped together:**

1. `plugins/<name>/.claude-plugin/plugin.json` — the plugin's own manifest
2. `.claude-plugin/marketplace.json` — the marketplace entry users install from

If these drift, users install a stale version. Any commit that bumps one must bump the other in the same commit. When shipping a new version, grep for the old version string to confirm nothing was missed.

## Plugins

- **[sno](plugins/sno/CLAUDE.md)** -- spec-driven development loop (learn, plan, build, check, ship)
- **[wu](plugins/wu/CLAUDE.md)** -- zero-slop development with persona-driven analysis and cloud-first dispatch
- **[my-voice](plugins/my-voice/CLAUDE.md)** -- personal writing-voice corpus, style-guide distillation, and voiced drafting
- **[ddd](plugins/ddd/CLAUDE.md)** -- domain-driven design for large changes (bounded contexts, ubiquitous language, aggregates/invariants, anti-corruption layers) before code
- **[agent-ready](plugins/agent-ready/CLAUDE.md)** -- keep a repo agent-optimized (seven dimensions, progressive disclosure) via skill + /agent-ready command + line-budget/context-drift hooks
