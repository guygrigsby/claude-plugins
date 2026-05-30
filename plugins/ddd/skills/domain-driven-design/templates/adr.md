# ADR <NNNN>: <title>

- **Status:** Proposed | Accepted | Superseded by ADR-<NNNN>
- **Date:** YYYY-MM-DD
- **Change size:** large (DDD applied)

## Context

What's changing and why. The forces in play: existing coupling, vendor lock-in, scope pressure. Link the context map.

## Bounded contexts

The contexts this change touches and their relationships. (Summarize; full detail in the context map.)

## Ubiquitous language

The domain terms this change pins down. Note any term that was ambiguous and how it's resolved. State which values are stored vs derived.

## Aggregates and invariants

| Aggregate | Consistency boundary | Invariants that must always hold |
|-----------|----------------------|----------------------------------|
| StockItem | per SKU + location | `reserved <= on_hand`; `available = on_hand - reserved >= 0` |

## Anti-corruption layer

Which dependency is wrapped, where the boundary sits, which package is the only one allowed to import the vendor SDK, and how types translate at the edge.

## Decision

The chosen design in a few sentences. The phasing if it's a migration (introduce boundary → swap behind it → decommission).

## Consequences

What gets easier, what gets harder, what we're deferring (and the condition that would make us revisit).

## Alternatives considered

Brief: what else was on the table and why it lost.
