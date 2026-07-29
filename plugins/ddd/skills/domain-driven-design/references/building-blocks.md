# DDD Building Blocks (reference)

Vocabulary for modeling. Use the precise term so the design and the code agree.

## Tactical patterns

| Pattern | What it is | Test for it |
|---------|-----------|-------------|
| **Entity** | Has identity that persists across state changes. Two entities with the same field values are still distinct. | Does identity matter beyond the current values? (an `Order` is the same order even after its status changes) |
| **Value Object** | Defined entirely by its values. Immutable, interchangeable, no identity. | Are two equal-valued instances interchangeable? (`Money{100,"USD"}`) |

Every domain object is one or the other — classify it explicitly in the artifact. The classification decides equality, mutability and lifecycle; an unclassified object gets those decided by accident.
| **Aggregate** | A cluster of entities/value objects treated as one unit for consistency. Has a single **aggregate root** that is the only entry point. | What must stay consistent together within one transaction? |
| **Aggregate root** | The one entity through which all external access to the aggregate flows. Enforces invariants. | Who guarantees the invariant holds? |
| **Repository** | Collection-like interface for loading/saving aggregates. Hides persistence. | Can you swap the DB without touching domain logic? |
| **Domain event** | A record that something meaningful happened in the domain (`ChargeRefunded`). | Do other contexts need to react to this? |
| **Domain service** | Domain logic that doesn't naturally belong to one entity/value object. | Is this an operation across aggregates, not state of one? |
| **Factory** | Encapsulates complex creation so an aggregate is born valid. | Is constructing this thing non-trivial / invariant-laden? |

## Invariants

A rule that must **always** be true for the object (`reserved <= on_hand`). Two enforcement points, both required:

- **Construction:** the constructor (or factory) validates and refuses. An object that exists is valid; there is no path to an instance that skips the check — no exported fields, no setters that bypass it.
- **Mutation:** every operation that can break the invariant lives inside the aggregate root, never in callers.

If a caller can construct or mutate the object into an invalid state, the model is anemic — data with the rules living elsewhere — and the boundary is wrong.

## Model parsimony

As few domain objects as possible. An object earns its existence with an invariant to enforce or an identity to track; with neither, it's a field on an existing object. Same at the strategic level: as few bounded contexts as necessary — a context earns its boundary by owning its own language and its own data.

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
