# guygrigsby-plugins

Claude Code plugins by Guy Grigsby.

## Install

```
/plugin marketplace add guygrigsby/claude-plugins
```

Then install individual plugins:

```
/plugin install <plugin>@guygrigsby-plugins
```

## Plugins

| Plugin | Description |
|--------|-------------|
| [sno](plugins/sno/) | **Deprecated.** Spec-driven development. Learn, plan, build, check, ship. |
| [wu](plugins/wu/) | **Deprecated.** Zero-slop development with persona-driven analysis and cloud-first agent dispatch. |
| [my-voice](plugins/my-voice/) | Build a personal writing-voice corpus, distill it into a style guide, draft new text in your own voice. |
| [ddd](plugins/ddd/) | Domain-driven design for every design session, however small. Distills subdomains, sizes bounded contexts by language, classifies every domain object entity or VO with constructor-enforced invariants, keeps aggregates disciplined via domain events, and places anti-corruption layers before code. |
| [db-schemas](plugins/db-schemas/) | Integrity-first SQL DDL. The database generates ids and timestamps, every FK declares ON DELETE, later facts are their own tables instead of nullable status columns, closed vocabularies are seeded enum tables, NOT NULL by default and every index names its query. |
| [agent-ready](plugins/agent-ready/) | Keep a repo optimized for coding agents. Audits seven agent-ergonomics dimensions, auto-fixes safe items, and enforces line budget + context drift via hooks. |
| [your-voice](plugins/your-voice/) | The mirror of my-voice: talk to the user the way they need. Interaction modes inferred silently from communication style, on a sacred baseline, injected always-on via a SessionStart hook. |
| [gyr-fleet](plugins/gyr-fleet/) | Register each Claude Code session in the gyr fleet: heartbeat on session start and every prompt, mark done on session end. Best-effort via the local gyr CLI; never blocks a session. |
| [drift-guards](plugins/drift-guards/) | Every fact that lives in more than one place gets a test comparing the copies, code side as the source of truth. Guard shapes for doc tables, config keys, version strings, generated artifacts, examples, paths, and schemas, wired into the project's default test gate. |

## Adding a Plugin

1. Create a directory under `plugins/<name>/`
2. Add `.claude-plugin/plugin.json`, `commands/`, and optionally `agents/` or `skills/`
3. Add the plugin to the table above and to the `## Plugins` list in [CLAUDE.md](CLAUDE.md)
4. Run `npm run gen` to regenerate `.claude-plugin/marketplace.json`, then `npm test`

`.claude-plugin/marketplace.json` is generated from the plugin manifests, so a version bump only ever touches `plugins/<name>/.claude-plugin/plugin.json`. CI regenerates and commits it on pushes to `main`; `npm test` catches a stale one everywhere else.

## License

MIT
