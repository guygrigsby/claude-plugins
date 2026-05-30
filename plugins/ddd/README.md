# ddd

Domain-driven design as a Claude Code skill. When a change is large enough to calcify coupling or lock you into a vendor, this skill makes Claude model the domain and the boundaries *before* writing code.

## Install

From the `guygrigsby-plugins` marketplace:

```
/plugin marketplace add guygrigsby/claude-plugins
/plugin install ddd
```

## What triggers it

The skill auto-fires on large changes:

- A new subsystem or service.
- An architectural shift (splitting/merging packages, changing how modules relate).
- Encapsulating, wrapping, or replacing an external dependency (a payment provider, a vendor SDK, a third-party API).
- Restructuring data ownership across modules.

It also reacts to the symptoms: vendor types leaking across module boundaries, or the same domain word meaning different things in different places.

It deliberately **skips** bugfixes, single functions, and config tweaks.

## What it produces

1. A **context map** — the bounded contexts and how they relate.
2. The **ubiquitous language** — the terms each context owns, ambiguities resolved.
3. **Aggregates and invariants** — the consistency boundaries and rules that must always hold.
4. An **anti-corruption layer** — when wrapping or swapping a dependency, the boundary that keeps vendor types out of the domain.
5. A short **ADR** in `docs/specs/`, written before implementation.

Templates for the context map, ADR, and ACL ship with the skill. The core workflow is language-neutral; the ACL skeleton and worked example are Go.

## License

MIT.
