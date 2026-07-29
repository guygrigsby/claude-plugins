# ddd

Domain-driven design as a Claude Code skill. Whenever the shape of code is being decided — however small the design — this skill makes Claude model the domain and the boundaries *before* writing code.

## Install

From the `guygrigsby-plugins` marketplace:

```
/plugin marketplace add guygrigsby/claude-plugins
/plugin install ddd
```

## What triggers it

The skill auto-fires on every architecture or design session, no matter how small:

- Designing a new feature, subsystem, or service.
- An architectural shift (splitting/merging packages, changing how modules relate).
- Encapsulating, wrapping, or replacing an external dependency (a payment provider, a vendor SDK, a third-party API).
- Restructuring data ownership across modules.
- Any discussion where types, boundaries, or responsibilities get chosen.

It also reacts to the symptoms: vendor types leaking across module boundaries, the same domain word meaning different things in different places, or anemic domain models — objects holding data but almost no behavior, rules living in callers.

The only opt-out is saying so ("no DDD"). It skips only work with no design decision at all: mechanical bugfixes, config tweaks.

## What it produces

1. A **context map** — the bounded contexts and how they relate. As few contexts as necessary; a context earns its boundary with its own language and data.
2. The **ubiquitous language** — the terms each context owns, ambiguities resolved.
3. **Domain objects and invariants** — every object classified entity or value object, as few objects as possible, every invariant captured in a constructor so objects are born valid.
4. An **anti-corruption layer** — when wrapping or swapping a dependency, the boundary that keeps vendor types out of the domain.
5. A short **ADR** in `docs/specs/`, written before implementation.

Templates for the context map, ADR, and ACL ship with the skill. The core workflow is language-neutral; the ACL skeleton and worked example are Go.

## License

MIT.
