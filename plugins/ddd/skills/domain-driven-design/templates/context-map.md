# Context Map: <change name>

> One row per bounded context. One relationship per directed edge.
> Delete this quote block and the examples before committing.

## Contexts

| Context | Responsibility (one line) | Owns (data / concepts) |
|---------|---------------------------|------------------------|
| Billing | Charges, refunds, provider integration | Charge, Customer, Invoice, Money |
| Ordering | Order lifecycle, line items, fulfillment | Order, LineItem, FulfillmentStatus |

## Relationships

Notation: `Upstream -> Downstream`. Tag each edge with the pattern.

- Patterns: `Customer/Supplier`, `Conformist`, `Anti-Corruption Layer (ACL)`, `Shared Kernel`, `Open Host Service`, `Published Language`.

| Upstream | Downstream | Pattern | Notes |
|----------|-----------|---------|-------|
| Billing | Ordering | Customer/Supplier | Ordering consumes `PaymentProvider`; depends on billing domain types only |
| Vendor SDK (Stripe) | Billing | ACL | `billing/stripe` adapter; vendor types never leave it |

## Ambiguous terms (same word, different meaning)

| Term | Context A meaning | Context B meaning | Resolution |
|------|-------------------|-------------------|------------|
| "account" | Billing: payment account | Identity: login account | Rename one; keep distinct types per context |
