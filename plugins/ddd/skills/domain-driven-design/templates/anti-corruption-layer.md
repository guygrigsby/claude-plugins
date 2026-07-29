# Anti-Corruption Layer (Go skeleton + checklist)

An ACL keeps a vendor's or legacy system's model from leaking into your domain. The domain defines an interface in its own types; one adapter package translates in both directions.

## Skeleton

```go
// package billing — the domain. Knows nothing about any vendor.
package billing

// Money is a value object. Unexported fields; NewMoney is the only way in,
// so the invariants (non-negative, known currency) hold for every instance.
type Money struct {
    minor    int64  // minor units (cents); never float
    currency string
}

func NewMoney(minor int64, currency string) (Money, error) { /* validate, refuse */ }

type ChargeRequest struct {
    Amount     Money
    CustomerID string
    Idempotency string
}

type Charge struct {
    ID     string
    Amount Money
    Status ChargeStatus
}

// The port. Expressed entirely in domain types.
type PaymentProvider interface {
    CreateCharge(ctx context.Context, req ChargeRequest) (Charge, error)
    Refund(ctx context.Context, chargeID string) error
    VerifyWebhook(payload []byte, sig string) (Event, error)
}
```

```go
// package billing/stripe — the adapter. THE ONLY package importing stripe-go.
package stripe

import (
    stripe "github.com/stripe/stripe-go/v76"
    "yourmod/billing"
)

type Provider struct{ client *stripe.Client }

func (p *Provider) CreateCharge(ctx context.Context, req billing.ChargeRequest) (billing.Charge, error) {
    sc, err := p.client.Charges.New(toParams(req)) // translate IN: domain -> vendor
    if err != nil {
        return billing.Charge{}, mapErr(err)        // translate errors too
    }
    return toDomain(sc), nil                         // translate OUT: vendor -> domain
}

// toParams, toDomain, mapErr are the translation surface. They are the ACL.
func toParams(r billing.ChargeRequest) *stripe.ChargeParams { /* ... */ }
func toDomain(c *stripe.Charge) billing.Charge              { /* ... */ }
func mapErr(err error) error                                { /* vendor error -> domain error */ }
```

Consumers (`order`, `subscription`, `reporting`) import `billing` only. After the boundary exists, `grep -rn "stripe\." --include=*.go` returns hits **only** inside `billing/stripe`.

## Checklist

- [ ] Domain interface uses **zero** vendor types in its signatures.
- [ ] Exactly one package imports the vendor SDK.
- [ ] Translation goes both ways: requests in, responses out, **and errors**.
- [ ] Money is minor units + currency, never float.
- [ ] Persisted vendor IDs use a `provider` discriminator + `provider_ref`, so old records stay resolvable across a swap.
- [ ] Concept mismatches between domain and vendor are written down (a mapping table) before coding the adapter.
- [ ] Webhook/event ingestion verifies the vendor signature in the adapter and emits a domain `Event`.
- [ ] Migration is phased: introduce boundary keeping current impl → add new impl behind interface → decommission old.
