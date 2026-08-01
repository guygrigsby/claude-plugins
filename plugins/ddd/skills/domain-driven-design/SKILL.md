---
name: domain-driven-design
description: Use when any architecture or design work begins, however small — designing a new feature, subsystem, or service, an architectural shift, encapsulating or replacing a dependency, restructuring how modules relate, or any session where the shape of the code is being decided. Also when vendor or implementation types have leaked across module boundaries, when the same domain term means different things in different parts of the code, or when the domain model is anemic — objects holding data but almost no behavior, rules living in callers or services. Active by default for design work; the user opting out ("no DDD") is the only skip. Not for mechanical bugfixes or config tweaks that decide nothing about design.
---

# Domain-Driven Design

## Overview

Design sessions are where unexamined coupling, anemic models and vendor lock-in calcify — the large ones and the small ones alike. DDD makes the boundaries and the domain model explicit *before* code, so the design survives the next dependency swap or scope expansion.

**Core principle:** model the domain first, name the boundaries, classify every domain object (entity, value object or enumeration), give every object all of its fields and every relationship a cardinality, enforce each aggregate's invariants at construction and mutation, keep each context's types free of leaked implementation or vendor types, and translate at the edge. Contexts sized by language, modeling effort concentrated on the core domain, every object earning its keep by making a concept explicit. Produce written artifacts — context map, domain model, ADR — before implementation.

This is a discipline skill. The steps are not optional decoration on top of "just write the adapter." Arriving at a reasonable structure without naming the contexts, the language, and the invariants leaves the next person (and the next dependency swap) to rediscover them.

## When to use

Apply DDD to **every architecture or design session, no matter how small**. If the shape of the code is being decided, the skill is on:

- Designing a new feature, subsystem, or service.
- An architectural shift (changing how modules relate, splitting or merging packages).
- Encapsulating, wrapping, or replacing an external dependency (a payment provider, a vendor SDK, a third-party API).
- Restructuring data ownership across modules.
- Any design discussion where types, boundaries, or responsibilities get chosen — even one small type.

The **only opt-out is the user saying so** ("no DDD", "skip the modeling"). Never self-exempt because the change feels small; small designs are where anemic models slip in. Scale the artifact to the change — a small design gets a short artifact, not a skipped one.

Symptoms that you're already in DDD territory:

- Vendor or implementation types (`stripe.Charge`, `sql.DB`, `s3.Client`) appear in signatures or struct fields across more than one module.
- The same word ("order", "stock", "account") means different things in different parts of the code.
- A single change forces edits across several otherwise-unrelated packages.
- Anemic domain model: objects hold data but almost no behavior; every rule enforced (or forgotten) in callers and services.

**Skip it** only for work with no design decision at all — a mechanical bugfix, a config tweak. Say so explicitly when you skip: "no design decision here, no DDD modeling needed."

## The workflow

Work these in order. Do not jump to code until the artifact exists.

```dot
digraph ddd {
    "Design decision involved?" [shape=diamond];
    "Say so, proceed normally" [shape=box];
    "1. Map bounded contexts" [shape=box];
    "2. Name ubiquitous language" [shape=box];
    "3. Model objects, fields, relationships" [shape=box];
    "4. Place anti-corruption layer" [shape=box];
    "5. Write artifacts: map, model, ADR" [shape=box];
    "Implement" [shape=doublecircle];

    "Design decision involved?" -> "Say so, proceed normally" [label="no"];
    "Design decision involved?" -> "1. Map bounded contexts" [label="yes"];
    "1. Map bounded contexts" -> "2. Name ubiquitous language";
    "2. Name ubiquitous language" -> "3. Model objects, fields, relationships";
    "3. Model objects, fields, relationships" -> "4. Place anti-corruption layer";
    "4. Place anti-corruption layer" -> "5. Write artifacts: map, model, ADR";
    "5. Write artifacts: map, model, ADR" -> "Implement";
    "Implement" -> "1. Map bounded contexts" [label="code contradicts model", style=dashed];
}
```

The back edge is real: when implementation contradicts the model, revise the artifact — refactoring toward deeper insight is part of the discipline, not a failure of it.

### 1. Distill the domain, map bounded contexts

First classify each subdomain: **core** (the differentiator — this is where deep modeling investment pays), **supporting**, or **generic** (auth, notifications, commodity billing — buy it, conform to it, or keep the model shallow). Effort follows the classification; full ceremony on a generic subdomain is misdirected, and a conformist relationship is often the *right* answer there.

Then name each context and its responsibility. Draw the relationships: partnership, customer/supplier, conformist, shielded by an anti-corruption layer, or separate ways (no integration at all — the cheapest correct answer more often than it gets picked). Use the `templates/context-map.md` template.

**A context is sized by its language.** It extends exactly as far as the model and its terms stay consistent. Same word, different meaning is a seam — split there, whatever the current schema or team layout says. Don't split where language *and* data are both shared; every extra context is a translation layer and a coordination cost. When the two pressures conflict, language breaks the tie.

### 2. Name the ubiquitous language

List the domain terms each context owns. Flag terms that mean different things in different contexts — that ambiguity is usually the source of the tangle. State which values are *stored* and which are *derived* (storing a derived value is how numbers drift).

The language is crunched *with* the domain expert, not invented solo — here, that's the user. Confirm any term whose meaning you inferred; a wrong meaning pinned into the artifact ships with full ceremony behind it.

### 3. Model domain objects, fields and relationships

The output is a **domain model artifact**, separate from the ADR: the ADR records decisions, this records structure. Use `templates/domain-model.md`. Nine rules, all mandatory.

**Classify every domain object as an entity, a value object, or an enumeration.** No unclassified objects. Entity: identity persists across state changes. Value object: defined entirely by its values, immutable, interchangeable. Enumeration: a closed set of named values. Write the classification into the artifact — it decides equality, mutability, and lifecycle, so leaving it implicit means deciding it by accident later.

**List every field of every object: name, type, optionality, meaning.** Not the interesting ones, all of them. A model that names objects but not their fields cannot be checked against a schema, an API, or anyone's understanding, and the fields are where the disagreements actually live. For every optional field state **what absence means** — "absent means never cancelled" is a fact someone can act on; an optional field with no stated meaning gets interpreted two different ways by two different readers.

**Every object earns its keep, and a type earns its place with an invariant beyond existing.** A type per noun in the requirements is sprawl: merge or delete until everything left is load-bearing. Genuine *primitive obsession* is a concept with real rules riding around as a bare `string` — an email address, a money amount, a percentage — and those deserve a value object carrying the validation.

**An identifier is not one of them.** `OrderId`, `ClusterId`, `UserId` wrapping a string whose only rule is "non-empty" is ceremony: a constructor, a conversion at every boundary, and nothing enforced. Same for version strings, plan codes, and opaque vendor references. Ask what the constructor would *reject*; if the answer is "the empty string", use the primitive. This is the most common way a model bloats while looking rigorous.

**State who owns what.** For each aggregate root, list the objects it owns outright — created with it, removed with it, never referenced from another aggregate — and everything else it merely names by id. An object owned by two roots is a modeling error, and it is invisible until ownership is written down.

**Give every relationship a direction, a kind, and a cardinality.** Kind is `has-a` (composition: the part dies with the whole), `references` (association by id across an aggregate boundary), `is-a`, or `derived-from`. Cardinality is explicit — **1-1, 1-n, n-1, n-n** — with the lower bound stated when it is an invariant (`1 to n, n ≥ 1` is a different claim from `1 to n`). An arrow with no cardinality is a diagram, not a model.

For `is-a`, say whether it is a **sum** (the thing is exactly one of a closed set of alternatives) or genuine **inheritance** (shared behavior specialized). Most domain `is-a` is a sum, and modeling a sum as a class hierarchy is how a two-case enum becomes six files. When two variants differ only in what they are permitted to do, that is a `role` field and an authorization rule, not a subtype.

**Capture every invariant in a constructor — scoped to its aggregate.** A *true* invariant is one that must hold transactionally, and it lives inside one aggregate: the constructor (or factory, when creation is complex) establishes it and refuses invalid states; every mutating operation preserves it inside the aggregate; no exported fields or setters bypass it. An object that exists is valid — that's the contract. A rule spanning aggregates is *not* a constructor's job: never grow a giant aggregate to make it one (that's the lock-contention, concurrency-conflict failure). Cross-aggregate rules are eventually consistent — one aggregate commits, emits a domain event, the other reacts and reconciles. Rules of the road for the boundary: reference other aggregates **by ID only**, modify **one aggregate per transaction**, integrate between aggregates and contexts **with domain events**.

**The object owns its behavior, not just its data.** An *anemic domain model* is one whose objects contain data but almost no behavior — the rules live in callers and services, and every caller becomes a place an invariant can be forgotten. Any behavior specific to one domain object belongs on that object: the entity enforces its own invariants and exposes the operations that change its state. Domain services exist only for interactions *between* objects — logic that genuinely spans aggregates. A domain service that manipulates one object's state is that object's method in the wrong place. Orchestration — loading aggregates, invoking their behavior, managing transactions — is an *application* service, outside the model, and holds no domain rules at all.

List each root's methods in the artifact. An empty method column is anemia, visible at a glance.

**Draw a state machine for every object with a lifecycle.** Objects that move through named states carry most of their invariants in the *transitions*, and a constructor-focused invariant column cannot express them. Enumerate the legal transitions as from / to / trigger, and say that anything unlisted is refused by the aggregate — that sentence turns the table into the invariant instead of a comment near it. Keep the state set as small as the domain actually needs; states invented for symmetry are the same failure as types invented for nouns.

**Mark what was inferred rather than confirmed.** The language is crunched with the domain expert (step 2), but modeling always produces some choices nobody was asked about. List them, in the artifact, as inferred. Everything unmarked reads as settled and gets built on, and a wrong assumption that shipped with full ceremony behind it is the most expensive kind.

#### Diagrams

Three, all in the artifact. Use Mermaid so they render in the review tool and diff as text. **Render them before committing** — a diagram that fails to parse is invisible in a diff and shows up as a blank box for the reviewer.

- **Context diagram.** Contexts as subgraphs, the objects inside each, external systems as distinct nodes with the one object each reaches. Answers "what is where".
- **Relationship diagram.** Every object and every relationship with its cardinality. An `erDiagram` carries crow's feet natively. Answers "who owns whom, and how many".
- **Structure diagram.** A `classDiagram` with fields and methods, composition for ownership and plain arrows for references. Answers "what does this object actually look like".

Plus a **state diagram** per object with a lifecycle.

### 4. Place the anti-corruption layer

When wrapping or replacing a dependency, define the boundary that keeps vendor/implementation types out of the domain. The domain defines an interface in its own types; the adapter translates. See `templates/anti-corruption-layer.md` for a Go skeleton and checklist.

### 5. Write the artifacts before code

Three documents, in `docs/specs/` and `docs/adr/` (or wherever the project already keeps them — never a tool-named folder):

| Artifact | Template | Holds |
|---|---|---|
| Context map | `templates/context-map.md` | Ubiquitous language, contexts, ambiguous terms, stored vs derived |
| Domain model | `templates/domain-model.md` | Objects, every field, ownership, relationships with cardinality, diagrams |
| ADR | `templates/adr.md` | The decisions and why, the alternatives, the consequences |

They are separate because they answer different questions and change at different rates. The ADR is append-only and supersedes; the model is rewritten as it deepens. Do not inline the full object tables into the ADR — one flat table stops being readable past two contexts, and the ADR is not where structure belongs.

Then implement.

## One concrete example (Go)

Domain owns a provider-neutral type and the interface. The vendor SDK is confined to one adapter package and never leaks.

```go
// package billing — the domain. No vendor types here.

// Money is a value object: defined by its values, immutable, no identity.
// Fields are unexported; NewMoney is the only way in.
type Money struct {
    minor    int64  // amount in minor units; never float
    currency string
}

// NewMoney captures the invariants at construction. A Money that exists
// is valid — callers never re-check.
func NewMoney(minor int64, currency string) (Money, error) {
    if minor < 0 {
        return Money{}, fmt.Errorf("money: negative amount %d", minor)
    }
    if !validCurrency(currency) {
        return Money{}, fmt.Errorf("money: unknown currency %q", currency)
    }
    return Money{minor: minor, currency: currency}, nil
}

// Charge is an entity: ID persists across status changes.
type Charge struct {
    ID     string
    Amount Money
    Status ChargeStatus
}

// PaymentProvider is expressed entirely in domain types.
// Stripe and Adyen each become one implementation.
type PaymentProvider interface {
    CreateCharge(ctx context.Context, req ChargeRequest) (Charge, error)
    Refund(ctx context.Context, chargeID string) error
    VerifyWebhook(payload []byte, sig string) (Event, error)
}
```

```go
// package billing/stripe — the anti-corruption layer.
// The ONLY package allowed to import stripe-go. Deleted when Stripe is gone.
type Provider struct{ client *stripe.Client }

func (p *Provider) CreateCharge(ctx context.Context, req billing.ChargeRequest) (billing.Charge, error) {
    sc, err := p.client.Charges.New(toStripeParams(req)) // translate IN
    if err != nil {
        return billing.Charge{}, mapStripeErr(err)       // translate errors too
    }
    return toDomainCharge(sc), nil                        // translate OUT
}
```

Order, subscription, and reporting code import `billing` only — never `billing/stripe`. After the boundary exists, `grep stripe.` returns hits only inside the adapter.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| "I'll just write the adapter" — skips contexts/language/invariants | The adapter is step 4 of 5. Name the contexts and invariants first or the boundary is in the wrong place. |
| Anemic domain model: objects hold data but almost no behavior | Object-specific behavior goes on the object; the entity owns its invariants. Constructors validate; methods mutate. Domain services only for interactions between objects. |
| Object constructible in an invalid state | Constructor or factory validates and refuses. Born valid or not born; no bypass via exported fields or setters. |
| Domain object with no declared kind | Classify it: entity, value object, or enumeration. Every object, no exceptions. |
| Domain object sprawl — a type per noun in the requirements | An object earns its place by making a concept explicit: invariant, identity, or a concept hiding in a primitive. Otherwise it's a field. |
| Primitive obsession — a concept with real rules riding as a raw string | Wrap in a value object. The type carries the meaning and the validation. |
| The opposite: a wrapper type per identifier (`OrderId`, `UserId`) | Ask what the constructor rejects. "The empty string" is not an invariant. Identifiers, version strings and opaque vendor references are primitives. |
| Objects listed without their fields | Every field, with type, optionality and meaning. A model with no fields cannot be checked against anything. |
| An optional field with no stated meaning for absence | Say what absent means. Otherwise two readers interpret it two ways and both write code. |
| Relationships drawn as bare arrows | Every relationship gets a kind (has-a, references, is-a, derived-from) and a cardinality (1-1, 1-n, n-1, n-n), with the lower bound when it is an invariant. |
| Ownership left implicit | Say which root owns which objects outright and what it merely names by id. An object owned by two roots is a bug you cannot see until it is written down. |
| A class hierarchy for what is a closed set of alternatives | Most domain is-a is a sum, not inheritance. Variants that differ only in permissions are a role field and an authorization rule. |
| A lifecycle object with no state machine | Enumerate legal transitions as from / to / trigger, and state that anything unlisted is refused. Transition invariants have nowhere else to live. |
| Inferred choices presented as settled | Mark them inferred in the artifact. Unmarked, they get built on. |
| Diagrams committed without rendering them | Render first. A diagram that fails to parse is invisible in a diff and blank for the reviewer. |
| One giant aggregate so every rule is constructor-enforceable | True invariants only within one aggregate. Cross-aggregate rules go eventually consistent: commit one, emit an event, reconcile. |
| Direct object references or multi-aggregate transactions | Reference other aggregates by ID only; modify one aggregate per transaction; events between. |
| Context sprawl — a bounded context per team, module, or noun | A context earns its boundary with its own language and data. Sharing both → one context. |
| Merging contexts that speak different languages | Same word, different meaning is a seam. Split there; language outranks shared data or convenience. |
| Deep-modeling a generic subdomain | Distill first. Core gets the investment; generic gets bought, conformed to, or kept shallow. |
| Vendor types in domain signatures | Domain interface uses domain types only. Translate in the adapter. |
| Storing a derived value (e.g. `available`) | Store the inputs (`on_hand`, `reserved`), compute the derived value. |
| Invariant checks scattered across callers | Move them inside the aggregate. One enforcement point. |
| Big-bang swap of code + data + dependency at once | Phase it: introduce the boundary keeping the old impl, then swap behind it, then decommission. |
| Spec written under a tool-named folder | Artifacts go in `docs/specs/`, named by content, not by tool. |
| The whole model inlined into the ADR | The ADR records decisions. Structure goes in the domain model artifact; one flat table stops being readable past two contexts. |

## Red flags — stop and model first

- About to add a vendor type to a function signature outside its adapter package.
- About to start design work by editing implementation directly.
- About to write a domain type with exported fields and no constructor.
- "I'll validate in the service layer" / "callers will check before constructing."
- A domain concept with real rules riding around as a raw string or int.
- About to write an id wrapper whose only rule is non-empty.
- A new domain object that doesn't earn its keep — no invariant, no identity, no hidden concept made explicit.
- A domain object nobody has classified as entity, value object or enumeration.
- An object listed without its fields, or an optional field with no stated meaning for absence.
- A relationship with no cardinality, or an object whose owner nobody named.
- An object with named states and no transition table.
- A transaction about to touch two aggregates, or an aggregate holding a direct reference to another.
- Growing an aggregate so a cross-aggregate rule fits in one constructor.
- Splitting a bounded context when neither side owns distinct language or data — or merging two that speak different languages.
- "This design is too small for the ceremony" — only the user can say that.

All of these mean: run the five steps and write the artifacts first.

## Reference

`references/building-blocks.md` — entity vs value object, aggregate, repository, domain event, ACL, context-mapping relationship types. Read it when you need the vocabulary precisely.
