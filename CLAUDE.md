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
3. Add a `CLAUDE.md` in the plugin directory describing the plugin
4. **Always update both plugin lists in the same commit:** the table in the root `README.md` AND the `## Plugins` list at the bottom of this `CLAUDE.md`. A new plugin isn't done until it appears in both.
5. Run `npm run gen` to regenerate `.claude-plugin/marketplace.json`, then `npm test`

Steps 4 and 5 are enforced by `tests/manifests.test.js`, so a forgotten list or a stale manifest fails the build rather than shipping.

## Versioning

The version lives in exactly one place: `plugins/<name>/.claude-plugin/plugin.json`. Bump it there and nowhere else.

Patch vs minor: bump **minor** when the plugin's behavior contract changes — what it triggers on, mandates, or forbids; an installed user would notice different agent behavior after updating. Bump **patch** for everything else: rewording, docs, internals. Lean toward patch when in doubt. Every content change needs *some* bump — the marketplace updater keys on the version string, so an unbumped change never reaches installed copies.

`.claude-plugin/marketplace.json` is **generated** from the plugin manifests by `tools/marketplace.js` (`npm run gen`). Never hand-edit it. Name, version, description, and source all derive from the plugin manifest; only the marketplace's own name/description/owner are hand-authored, in the generator.

CI regenerates and commits it on every push to `main`, so a release is a one-line edit. On a pull request CI cannot push, so the guard fails instead and tells you to run `npm run gen`.

## Checks

`npm test` runs the drift guards in `tests/manifests.test.js`: manifest present and named after its directory, versions well-formed, `marketplace.json` in sync, both root doc lists matching `plugins/` in both directions, relative links in the root docs resolving, and hook `command` paths pointing at files that exist. CI runs the same gate plus `plugins/agent-ready/tests/`.

Guards discover plugins by listing `plugins/`, so a new one is covered without editing the tests.

## Plugins

- **[sno](plugins/sno/CLAUDE.md)** -- spec-driven development loop (learn, plan, build, check, ship)
- **[wu](plugins/wu/CLAUDE.md)** -- zero-slop development with persona-driven analysis and cloud-first dispatch
- **[my-voice](plugins/my-voice/CLAUDE.md)** -- personal writing-voice corpus, style-guide distillation, and voiced drafting
- **[ddd](plugins/ddd/CLAUDE.md)** -- domain-driven design for every design session (subdomain distillation, language-sized bounded contexts, entity/VO-classified domain objects with constructor-enforced invariants, aggregate discipline with domain events, anti-corruption layers) before code
- **[db-schemas](plugins/db-schemas/CLAUDE.md)** -- integrity-first SQL DDL whenever schemas or migrations are written (DB-generated ids and timestamps, ON DELETE on every FK, later facts as their own tables, enum tables for closed vocabularies, NOT NULL by default, indexes naming their queries)
- **[agent-ready](plugins/agent-ready/CLAUDE.md)** -- keep a repo agent-optimized (seven dimensions, progressive disclosure) via skill + /agent-ready command + line-budget/context-drift hooks
- **[your-voice](plugins/your-voice/CLAUDE.md)** -- the mirror of my-voice: talk to the user the way they need; interaction modes inferred silently from communication style on a sacred baseline, injected always-on via a SessionStart hook
- **[gyr-fleet](plugins/gyr-fleet/CLAUDE.md)** -- register each Claude Code session in the gyr fleet (heartbeat on start + each prompt, done on end) via best-effort hooks calling the local gyr CLI
- **[drift-guards](plugins/drift-guards/CLAUDE.md)** -- every fact that lives in more than one place gets a test comparing the copies (registry/table, config keys, version strings, generated artifacts, executable examples, path existence, determinism), wired into the project's default gate
