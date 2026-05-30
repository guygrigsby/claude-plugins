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
| [sno](plugins/sno/) | Spec-driven development. Learn, plan, build, check, ship. |
| [wu](plugins/wu/) | Zero-slop development with persona-driven analysis and cloud-first agent dispatch. |
| [my-voice](plugins/my-voice/) | Build a personal writing-voice corpus, distill it into a style guide, draft new text in your own voice. |
| [ddd](plugins/ddd/) | Domain-driven design for large changes. Models bounded contexts, ubiquitous language, aggregates/invariants, and anti-corruption layers before code. |
| [agent-ready](plugins/agent-ready/) | Keep a repo optimized for coding agents. Audits seven agent-ergonomics dimensions, auto-fixes safe items, and enforces line budget + context drift via hooks. |

## Adding a Plugin

1. Create a directory under `plugins/<name>/`
2. Add `.claude-plugin/plugin.json`, `commands/`, and optionally `agents/`
3. Add an entry to `.claude-plugin/marketplace.json`

## License

MIT
