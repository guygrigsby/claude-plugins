# Context Map: <change name>

> One row per bounded context. One relationship per directed edge.
> Delete this quote block and the examples before committing.

## Contexts

Sized by language: a context extends as far as its terms stay consistent, no further. Split at same-word-different-meaning seams; don't split where language and data are both shared. Language breaks the tie. Subdomain: core / supporting / generic — modeling investment follows it.

| Context | Subdomain | Responsibility (one line) | Owns (data / concepts) |
|---------|-----------|---------------------------|------------------------|
| Billing | core | Charges, refunds, provider integration | Charge, Customer, Invoice, Money |
| Ordering | supporting | Order lifecycle, line items, fulfillment | Order, LineItem, FulfillmentStatus |

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
