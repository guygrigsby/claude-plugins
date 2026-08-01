# ADR <NNNN>: <title>

- **Status:** Proposed | Accepted | Superseded by ADR-<NNNN>
- **Date:** YYYY-MM-DD
- **Change size:** large (DDD applied)

## Context

What's changing and why. The forces in play: existing coupling, vendor lock-in, scope pressure. Link the context map.

## Bounded contexts

The contexts this change touches, their subdomain classification (core / supporting / generic — where the modeling investment goes), and their relationships. (Summarize; full detail in the context map.)

## Ubiquitous language

The domain terms this change pins down. Note any term that was ambiguous and how it's resolved. State which values are stored vs derived.

## Domain objects and invariants

**Full detail lives in the domain model artifact — link it here, do not inline it.** One flat object table stops being readable past two contexts, and structure is not what an ADR is for. This section names only the aggregate roots, their consistency boundaries, and the invariants a reader needs to understand *this decision*.

See [domain model](../specs/<name>-domain-model.md) for every object, every field and every relationship.

| Aggregate root | Consistency boundary | Invariants that shaped this decision |
|---------------|----------------------|--------------------------------------|
| StockItem | per SKU + location | `reserved <= on_hand`; `available = on_hand - reserved >= 0` |

True (in-aggregate) invariants are enforced in the constructor or factory — note any that can't be and why. Aggregates reference each other by ID only; one aggregate per transaction.

| Cross-aggregate rule | Event | Reaction |
|----------------------|-------|----------|
| customer outstanding `<=` credit limit | `ChargeCreated` | Credit context recalculates; flags or holds the account |

## Anti-corruption layer

Which dependency is wrapped, where the boundary sits, which package is the only one allowed to import the vendor SDK, and how types translate at the edge.

## Decision

The chosen design in a few sentences. The phasing if it's a migration (introduce boundary → swap behind it → decommission).

## Consequences

What gets easier, what gets harder, what we're deferring (and the condition that would make us revisit).

## Alternatives considered

Brief: what else was on the table and why it lost.
