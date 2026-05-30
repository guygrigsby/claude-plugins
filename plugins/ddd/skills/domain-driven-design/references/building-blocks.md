# DDD Building Blocks (reference)

Vocabulary for modeling. Use the precise term so the design and the code agree.

## Tactical patterns

| Pattern | What it is | Test for it |
|---------|-----------|-------------|
| **Entity** | Has identity that persists across state changes. Two entities with the same field values are still distinct. | Does identity matter beyond the current values? (an `Order` is the same order even after its status changes) |
| **Value Object** | Defined entirely by its values. Immutable, interchangeable, no identity. | Are two equal-valued instances interchangeable? (`Money{100,"USD"}`) |
| **Aggregate** | A cluster of entities/value objects treated as one unit for consistency. Has a single **aggregate root** that is the only entry point. | What must stay consistent together within one transaction? |
| **Aggregate root** | The one entity through which all external access to the aggregate flows. Enforces invariants. | Who guarantees the invariant holds? |
| **Repository** | Collection-like interface for loading/saving aggregates. Hides persistence. | Can you swap the DB without touching domain logic? |
| **Domain event** | A record that something meaningful happened in the domain (`ChargeRefunded`). | Do other contexts need to react to this? |
| **Domain service** | Domain logic that doesn't naturally belong to one entity/value object. | Is this an operation across aggregates, not state of one? |
| **Factory** | Encapsulates complex creation so an aggregate is born valid. | Is constructing this thing non-trivial / invariant-laden? |

## Invariants

A rule that must **always** be true for the aggregate (`reserved <= on_hand`). Enforce inside the aggregate root, never in callers. If a caller can put the aggregate in an invalid state, the boundary is wrong.

## Strategic patterns (context mapping)

| Relationship | Meaning |
|--------------|---------|
| **Bounded context** | An explicit boundary within which a model and its language are consistent. The same term can mean different things in different contexts. |
| **Ubiquitous language** | The shared vocabulary of a single context, used identically in conversation, docs, and code. |
| **Customer/Supplier** | Downstream depends on upstream; upstream considers downstream's needs. |
| **Conformist** | Downstream adopts upstream's model wholesale (no translation). Cheap, but couples you. |
| **Anti-Corruption Layer (ACL)** | Downstream translates upstream's model into its own at the boundary. Use when you must not let the other model leak in (vendor SDKs, legacy systems). |
| **Shared Kernel** | Two contexts share a small common model. High coupling; change requires coordination. |
| **Open Host Service** | Upstream publishes a well-defined protocol for many downstreams. |
| **Published Language** | A shared, documented interchange format (e.g. a schema) between contexts. |

## When to reach for which

- Wrapping/replacing a vendor or legacy system → **ACL**.
- Carving a tangled module into its own thing → name the **bounded contexts**, decide the relationship (usually **Customer/Supplier**), give each its own data.
- Numbers drifting / inconsistent state → find the missing **aggregate** and move the **invariant** inside it.
- "Same word, different meaning" bugs → you've found a **bounded context** seam; split the term.
