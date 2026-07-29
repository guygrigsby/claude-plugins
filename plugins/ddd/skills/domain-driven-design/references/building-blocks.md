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
| **Domain service** | Logic for interactions *between* domain objects — only what genuinely belongs to no single one. A service touching one object's state is that object's method, misplaced. | Is this an operation across aggregates, not state of one? |
| **Factory** | Encapsulates complex creation so an aggregate is born valid. | Is constructing this thing non-trivial / invariant-laden? |

## Invariants

A **true invariant** is a rule that must hold transactionally (`reserved <= on_hand`), and it lives inside one aggregate. Two enforcement points, both required:

- **Construction:** the constructor (or factory) validates and refuses. An object that exists is valid; there is no path to an instance that skips the check — no exported fields, no setters that bypass it.
- **Mutation:** every operation that can break the invariant lives inside the aggregate root, never in callers.

A rule spanning aggregates is not a true invariant and never justifies growing the aggregate to swallow it. It goes **eventually consistent**: one aggregate commits, emits a domain event, the other reacts and reconciles.

**Aggregate rules of the road** (Vernon): reference other aggregates by ID only, never by direct object reference; modify one aggregate per transaction; integrate between aggregates and contexts with domain events.

The entity owns its invariants and the behavior that changes its state. A model whose objects hold data but almost no behavior is **anemic**: the rules leak into callers and services, and every caller becomes a place an invariant can be forgotten. Domain services are only for interactions between objects, never a home for one object's behavior. **Application services** are a different thing again: orchestration — load aggregates, invoke their behavior, manage transactions — living outside the model and holding no domain rules.

## What earns a place in the model

An object earns its place by making a domain concept explicit: an invariant to enforce, an identity to track, or a concept that would otherwise hide in a primitive or a flag (an `EmailAddress`, a `Specification`, a domain event). Both failure modes are real — a type per requirement noun is sprawl; domain concepts as raw `string`/`int64` is primitive obsession. Prefer a small value object over a bare primitive, and delete objects that make nothing explicit.

## Subdomain distillation

Classify before modeling; investment follows the classification.

| Subdomain | Meaning | Treatment |
|-----------|---------|-----------|
| **Core** | The differentiator — what the system exists to do well. | Deep modeling, best people, full ceremony. |
| **Supporting** | Necessary, specific to you, not differentiating. | Model it, but modestly. |
| **Generic** | Commodity (auth, notifications, payments-as-plumbing). | Buy, conform, or keep the model shallow. |

## Strategic patterns (context mapping)

| Relationship | Meaning |
|--------------|---------|
| **Bounded context** | An explicit boundary within which a model and its language are consistent. The same term can mean different things in different contexts. |
| **Ubiquitous language** | The shared vocabulary of a single context, used identically in conversation, docs, and code. |
| **Customer/Supplier** | Downstream depends on upstream; upstream considers downstream's needs. |
| **Partnership** | Two contexts succeed or fail together; teams plan and coordinate changes jointly. |
| **Conformist** | Downstream adopts upstream's model wholesale (no translation). Cheap, but couples you. Often right for a generic subdomain. |
| **Separate Ways** | No integration at all. When the cost of any relationship outweighs the benefit, duplicate or do without. |
| **Anti-Corruption Layer (ACL)** | Downstream translates upstream's model into its own at the boundary. Use when you must not let the other model leak in (vendor SDKs, legacy systems). |
| **Shared Kernel** | Two contexts share a small common model. High coupling; change requires coordination. |
| **Open Host Service** | Upstream publishes a well-defined protocol for many downstreams. |
| **Published Language** | A shared, documented interchange format (e.g. a schema) between contexts. |

## When to reach for which

- Wrapping/replacing a vendor or legacy system → **ACL**.
- Carving a tangled module into its own thing → name the **bounded contexts**, decide the relationship (usually **Customer/Supplier**), give each its own data.
- Numbers drifting / inconsistent state → find the missing **aggregate** and move the **invariant** inside it.
- "Same word, different meaning" bugs → you've found a **bounded context** seam; split the term.
- A rule spanning aggregates or contexts → **domain event** + eventual consistency, not a bigger aggregate.
- Integration whose cost outweighs its benefit → **Separate Ways**; duplicate or do without.
- Commodity capability (auth, notifications) → **generic subdomain**; buy or **Conformist**, don't deep-model.
