# Boundaries & Navigability

An agent should find where a thing lives without reading everything. That requires clear structure, consistent naming, and discoverable entry points.

## What to check

- **Entry points obvious?** Can you point to where execution starts (`cmd/`, `main`, the server bootstrap) from the root map?
- **Names predictable?** Does `internal/billing` hold billing, or is billing logic smeared across unrelated packages? Inconsistent or misleading names force exploratory reads.
- **One concept, one home?** The same responsibility shouldn't live in three packages. (Overlaps ambiguity, duplicate concepts.)
- **Shallow over deep?** Deeply nested trees are hard to map. A flat, well-named layout is easier for an agent to hold.

## Fix

- Document the layout in the root context file (cheap, immediate).
- Rename for predictability where it's local and safe.

**Stop at anything structural.** Moving packages, splitting a module, or redrawing responsibilities is a large change, hand it to `ddd:domain-driven-design`, which models bounded contexts and the anti-corruption boundary. This skill does not restructure modules; it reports the need and defers.
