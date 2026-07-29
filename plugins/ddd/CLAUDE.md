# ddd

Domain-driven design as a Claude Code skill. Auto-triggers on every architecture or design session, however small, and forces the modeling discipline before code.

## What it does

Ships one skill, `domain-driven-design`, that fires whenever the shape of code is being decided — a new feature, subsystem, or service, an architectural shift, encapsulating or replacing a dependency, or restructuring how modules relate. The only opt-out is the user saying so. It walks five steps in order:

1. Map bounded contexts (as few as necessary; a context earns its boundary with its own language and data).
2. Name the ubiquitous language.
3. Model domain objects and invariants: every object classified entity or value object, as few objects as possible, every invariant captured in a constructor (no anemic models).
4. Place the anti-corruption layer (keep vendor/impl types out of the domain).
5. Write a short ADR + context map to `docs/specs/` before implementing.

It skips only work with no design decision at all: mechanical bugfixes, config tweaks.

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

Version lives in `.claude-plugin/plugin.json` only. The marketplace entry in `../../.claude-plugin/marketplace.json` is generated from it (`npm run gen`); never hand-edit it.
