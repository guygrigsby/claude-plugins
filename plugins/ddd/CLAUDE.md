# ddd

Domain-driven design and contract completeness as Claude Code skills. Auto-triggers on every architecture or design session, however small, and forces the modeling discipline, then the contract discipline, before code.

## What it does

Ships two skills. `domain-driven-design` fires whenever the shape of code is being decided — a new feature, subsystem, or service, an architectural shift, encapsulating or replacing a dependency, or restructuring how modules relate. The only opt-out is the user saying so. It walks five steps in order:

1. Distill subdomains (core / supporting / generic) and map bounded contexts, sized by language — split at same-word-different-meaning seams, don't split where language and data are both shared.
2. Name the ubiquitous language, confirming ambiguous terms with the user.
3. Model domain objects and invariants: every object classified entity or value object and earning its place by making a concept explicit, true invariants captured in constructors within one aggregate, cross-aggregate rules eventually consistent via domain events (no anemic models, no primitive obsession, no giant aggregates).
4. Place the anti-corruption layer (keep vendor/impl types out of the domain).
5. Write a short ADR + context map to `docs/specs/` before implementing; revise it when implementation contradicts the model.

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
