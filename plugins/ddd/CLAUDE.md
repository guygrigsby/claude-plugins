# ddd

Domain-driven design as a Claude Code skill. Auto-triggers on large changes and forces the modeling discipline before code.

## What it does

Ships one skill, `domain-driven-design`, that fires when a change is large — a new subsystem, an architectural shift, encapsulating or replacing a dependency, or restructuring how modules relate. It walks five steps in order:

1. Map bounded contexts.
2. Name the ubiquitous language.
3. Model aggregates and their invariants.
4. Place the anti-corruption layer (keep vendor/impl types out of the domain).
5. Write a short ADR + context map to `docs/specs/` before implementing.

It explicitly skips bugfixes, single functions, and config tweaks.

## Structure

```
plugins/ddd/
├── .claude-plugin/plugin.json
├── CLAUDE.md
├── README.md
└── skills/
    └── domain-driven-design/
        ├── SKILL.md
        ├── templates/
        │   ├── context-map.md
        │   ├── adr.md
        │   └── anti-corruption-layer.md   # Go skeleton + checklist
        └── references/
            └── building-blocks.md          # entity/VO/aggregate/repo/ACL/context-mapping vocab
```

Core workflow is language-neutral; the ACL skeleton and the worked example are Go.

## Versioning

Version lives in `.claude-plugin/plugin.json` and the marketplace entry in `../../.claude-plugin/marketplace.json`. Bump both together.
