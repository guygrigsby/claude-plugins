---
name: defining-contracts
description: Use when a service's contracts are being decided or extended — a new service, a new endpoint, a new domain event, a schema change, a seam between two services, or any design session that has produced a domain model and is heading toward code. Also when a design describes an API but not its data, names events without defining them, or when an invariant exists in application code with no constraint behind it.
---

# Defining Contracts

## Overview

A design session reliably produces one contract well and the other two barely at
all. Measured on an unprompted design task: the API arrived as three
characterized surfaces with a handful of concrete endpoints, thirty-one domain
events arrived as a flat list of names with one payload between them, and the
data layer arrived as four constraints mentioned in passing prose and zero table
definitions.

Nobody decides to skip these. They get written later, in code, one at a time,
which is where invariants go to die.

**Core principle: three contracts, each defined to 100%, cross-checked against
each other. A design is not done when it reads well. It is done when every
aggregate transition can be traced through all three.**

**REQUIRED BACKGROUND:** run `ddd:domain-driven-design` first. Contracts are
defined in terms of aggregates, transitions and invariants, so without the model
there is nothing to be complete about.

## When to Use

- A design session has produced a domain model and is heading toward code.
- A new endpoint, event, or table is being added to something that exists.
- A seam between two services is being defined.
- A design describes an API but not its data.
- Events appear as names on arrows rather than as defined messages.
- An invariant lives in application code with no constraint behind it.

Not for: mechanical changes that add no endpoint, no event and no column.

## The three contracts

Fill every field. A blank is the finding, not a formatting problem.

### API, the service layer, 100%

Every endpoint, one row:

| Field | Content |
|---|---|
| Route and method | |
| Caller class | Which kind of caller may call it |
| Authentication | How that caller proves who it is |
| Authorization | The rule, in domain terms |
| Request | Shape and types |
| Response | Shape and types |
| Errors | Which failures, from the closed taxonomy |
| Idempotency | Safe to retry, and keyed how |
| Domain behavior | The aggregate method it invokes |

Enumerate **caller classes before endpoints**. Each one: how it authenticates,
what it is trusted to assert, what it must never be trusted to assert. Ports
then fall out of the list. A port reached by two caller classes cannot have one
authentication story, and finding that out here is free.

The domain behavior column is the anti-anemia check. An endpoint invoking no
named aggregate method is a rule leaking into a handler or a domain concept
nobody has found yet. An endpoint that creates an aggregate as a side effect of
doing something else says so on its row.

### Domain events, the domain layer, 100%

Partly derivable from the data model, still enumerated in full. A name is not a
contract. Every event:

| Field | Content |
|---|---|
| Name | |
| Emitting aggregate | |
| Emitting transition | Which state change publishes it |
| Payload | Fields and types |
| Consumers | Who reacts |
| Delivery | At-least-once, ordering guarantees, replay behavior |
| Boundary | Internal, or published across a context boundary |
| Domain service | The service owning the cross-aggregate rule it triggers |

Boundary matters because a published event is a versioning obligation and an
internal one is not.

On the domain service field: a domain service spans aggregates, an application
service only orchestrates (loads, calls, commits). Naming the application
service tells you nothing and does not count. The field may be empty only when
the reaction is a single aggregate's own method. **An event whose reaction names
neither an aggregate method nor a domain service has logic with no home**, which
is what this field exists to surface.

### DDL, the data layer, 100%

Every table:

| Field | Content |
|---|---|
| Owning aggregate | |
| Columns | Name, type, nullability |
| Primary key | |
| Foreign keys | |
| Unique constraints | |
| Check constraints | |
| Indexes | Each naming the query it serves |

**Normalized to 5NF unless there is a compelling reason otherwise, and the
reason is recorded next to the table it applies to.** An unrecorded exception is
a loophole, not an exception.

No JSON columns for payloads. TEXT or BYTEA, because byte fidelity is the
contract and because a JSON column is usually a normalization dodge in disguise.
Query-relevant fields get real columns.

## The cross-check

Checking the three separately misses the point. They describe one model.

**Every aggregate transition appears in all three contracts, or is deliberately
absent from one and you can say which and why.**

- An aggregate invariant should appear as a check or unique constraint in DDL.
  An invariant enforced only in application code is one refactor from being
  unenforced.
- A state transition should appear as an endpoint, and usually as an event.
- An event's payload should be derivable from the DDL of the emitting aggregate.

A transition complete in one contract and missing from another is the finding.

## This loops back

Contract work finds holes in the domain. That is the expected path, not a
failure: a payload with no column behind it, an endpoint with no aggregate
method, an invariant with nowhere to live. When it happens, go back to
`ddd:domain-driven-design`, revise the model, and run the contracts again.

Record which pass the artifact is on, so a reader knows whether they are looking
at a first cut or a settled contract.

## Completeness gate

Mechanical, which is the only kind that holds:

- Every endpoint has every field.
- Every event has every field.
- Every table has every field.
- Every caller class reaches at least one endpoint.
- No endpoint admits a caller class that was not enumerated.
- Every aggregate transition traces through all three contracts, or carries a
  recorded reason for its absence.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Events listed as names, or as labels on a diagram arrow | A name is not a contract. Fill every field, especially consumers and delivery. |
| No DDL at all, constraints mentioned only in prose | Prose constraints do not execute. Write the tables. |
| API characterized rather than enumerated ("resource oriented, account-scoped paths") | Every endpoint gets a row. A characterization is a plan to decide later, in code. |
| Authentication described once for the whole service | It is a property of the caller class, and services usually have several. |
| Errors invented per endpoint | One closed taxonomy, defined once, chosen from. |
| Invariants stated in the model and absent from DDL | Every invariant that can be a constraint should be one. |
| Contract written once and never revisited | Contracts iterate with the model. Record the pass number. |
