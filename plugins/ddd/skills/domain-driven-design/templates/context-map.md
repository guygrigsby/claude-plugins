# Context Map: <change name>

> The words this system uses, the contexts, and how they relate.
> One row per bounded context. One relationship per directed edge.
> Delete this quote block and the examples before committing.

## Ubiquitous language

The terms and where each lives. Define our words; do not catalog anyone
else's, and do not write essays about words we rejected.

| Term | Means | Lives in |
|------|-------|----------|
| Order | <one line> | `orders` |

## Contexts

Sized by language: a context extends as far as its terms stay consistent, no
further. Split at same-word-different-meaning seams; don't split where
language and data are both shared. Language breaks the tie. Subdomain: core /
supporting / generic — modeling investment follows it.

**Contexts are big.** They are the size of "Platform", "Cluster", "IAM" — a
whole model with its own language. They are not the size of an aggregate, a
responsibility, or a package. If a "context" owns two objects that share
every word with the context next door, it is a grouping inside one context,
not a context.

**One subdomain can appear as several contexts.** IAM in the platform and IAM
in a customer's deployed instance are the same subdomain and deliberately
different models: same word, different meaning, no shared data. Two contexts.
Say so rather than merging them for tidiness.

| Context | Subdomain | About |
|---------|-----------|-------|
| Billing | core | Charges, refunds, provider integration |
| Platform IAM | generic (IAM) | Who may act on the platform |

<If the context has internal groupings worth naming, list them as groupings,
explicitly not contexts:>

Inside <context>, aggregate groupings — one language throughout:

| Grouping | Owns |
|----------|------|
| Ordering | Order, LineItem |

## Relationships

Notation: `Upstream -> Downstream`. Tag each edge with the pattern.

- Patterns: `Partnership`, `Customer/Supplier`, `Conformist`, `Anti-Corruption Layer (ACL)`, `Shared Kernel`, `Open Host Service`, `Published Language`, `Separate Ways` (no integration — a legitimate edge label, or the reason a pair has no edge).

| Upstream | Downstream | Pattern | Notes |
|----------|-----------|---------|-------|
| Billing | Ordering | Customer/Supplier | Ordering consumes `PaymentProvider`; depends on billing domain types only |
| Vendor SDK (Stripe) | Billing | ACL | `billing/stripe` adapter; vendor types never leave it |

## Ambiguous terms (same word, different meaning)

| Term | Context A meaning | Context B meaning | Resolution |
|------|-------------------|-------------------|------------|
| "account" | Billing: payment account | Identity: login account | Rename one; keep distinct types per context |

## Stored and derived

Storing what can be derived is how numbers drift. State which is which, and
where a stored copy of an external fact is deliberate.

- Stored: <the facts this system owns, and external facts recorded verbatim>
- Derived, never stored: <what is computed on read>

## Still open

Questions nobody has answered, named as questions. An artifact with no open
list has usually filled its gaps with assumptions.

- <the undecided thing>
