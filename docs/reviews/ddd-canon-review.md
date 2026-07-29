# ddd skill: canon review against Evans and Vernon

- **Date:** 2026-07-29
- **Reviewed:** `plugins/ddd` at 0.2.0 (fresh-context independent review)
- **Sources:** Evans, *Domain-Driven Design* (2003, blue book); Vernon, *Implementing Domain-Driven Design* (2013, red book, esp. ch. 10 "Effective Aggregate Design") and *Domain-Driven Design Distilled* (2016)
- **Resolution:** findings applied in 0.3.0 (`f907f33`); dispositions noted per finding

## Contradictions / overreach

### 1. "As few domain objects as possible" points opposite the canon's pressure

Evans devotes Part III to *adding* model concepts as insight deepens (Making Implicit Concepts Explicit, ch. 9); Vernon urges liberal value objects against primitive obsession (ch. 6). The canonical failure DDD fights is too *few* domain concepts, not too many. The 0.2.0 earning test (invariant or identity, else it's a field) deleted canonical building blocks by its own rule: a domain event has no invariant and no tracked identity; a `Specification` has neither; an `EmailAddress` VO whose only job is type safety fails it. It was also internally inconsistent with `building-blocks.md`, which lists Domain Event and Factory.

**Severity:** material overreach.
**Disposition:** rescoped, not reverted. An object now earns its keep by making a concept explicit — an invariant, an identity, or a concept otherwise hiding in a primitive or a flag. Sprawl (a type per requirement noun) and primitive obsession are named as twin failure modes.

### 2. "Fewest contexts; when in doubt, merge" treats a linguistic rule as an economic one

Canon sizes a bounded context by where the language stays consistent and by team/ownership reality, not by minimizing count (Evans ch. 14; Vernon ch. 2–3). Vernon's headline warning is the opposite failure: merging distinct linguistic models into one context, producing the Big Ball of Mud. The 0.2.0 merge bias ("shares data → merge") would entrench exactly the same-word-different-meaning ambiguity the skill elsewhere calls the source of the tangle.

**Severity:** material overreach.
**Disposition:** contexts are now sized by language; split at same-word-different-meaning seams regardless of schema; don't split where language *and* data are both shared; language breaks the tie.

### 3. "Capture every invariant in a constructor" lacked the cross-aggregate escape hatch

Canon splits invariants by consistency boundary: true invariants are transactionally consistent *within* an aggregate; rules spanning aggregates are eventually consistent (Vernon ch. 10; Evans ch. 6). Stated absolutely, the rule pushes a practitioner facing a cross-aggregate rule (customer outstanding ≤ credit limit) to grow one giant aggregate — the lock-contention, concurrency-conflict failure Vernon's essay exists to prevent.

**Severity:** minor-to-material overreach.
**Disposition:** constructor rule kept for true invariants within one aggregate; cross-aggregate rules go eventually consistent — commit one aggregate, emit a domain event, react and reconcile.

## Material gaps

### 4. Core domain / subdomain distillation absent

For both authors this is *the* strategic question: where does deep modeling investment pay (Evans ch. 15; Vernon opens IDDD with it). Without it, a skill that fires on every design session would hand-model commodity subdomains and spread effort evenly. Its absence also removed the canon's justification for when Conformist is the right relationship.

**Disposition:** added — classify core / supporting / generic before modeling; investment follows classification; generic → buy, conform or stay shallow.

### 5. Aggregate rules of the road missing

Vernon (IDDD ch. 10): reference other aggregates by ID only; modify one aggregate per transaction; integrate between aggregates with domain events. Without them, a design holding a direct `*Customer` reference and mutating two aggregates in one transaction complied with everything the skill said while dissolving the declared boundary.

**Disposition:** added verbatim as rules of the road in step 3, `building-blocks.md`, and the ADR template.

## Minor gaps (all applied)

6. **Separate Ways and Partnership** missing from the relationship catalog (Evans ch. 14). Without Separate Ways, every pair of contexts looks like it needs an integration. Added to `building-blocks.md` and the context-map template.
7. **Ubiquitous language thinned to a solo naming pass.** Canon hammers the language out *with* domain experts (Evans ch. 1–2); here the expert is the user. Added: confirm ambiguous terms with the user.
8. **Application service vs domain service** absent, so orchestration had no home. Added the distinction: application services orchestrate and hold no domain rules.
9. **One-way workflow.** Canon insists implementation feedback reshapes the model (Refactoring Toward Deeper Insight, Evans Part III). Added the dashed back edge and prose.
10. **Domain events underweighted** — one table row, absent from the "when to reach for which" list. Now the named mechanism for cross-aggregate and cross-context rules.

## Internal inconsistency

### 11. ACL template's `Money` violated the skill's own constructor rule

`templates/anti-corruption-layer.md` shipped `Money` with exported fields and no constructor while `SKILL.md` made unexported-fields-plus-`NewMoney` non-negotiable. The template is what gets copied.

**Disposition:** fixed separately in `12574cc` (pre-dates this review's application; it was a bug in the 0.2.0 edit, not review content).

## Verdict (as delivered)

Adequate on tactical vocabulary and the ACL/vendor-isolation story. Not adequate at 0.2.0 on strategic design: subdomain distillation absent, and three hardened opinions (object parsimony, merge bias, constructor absolutism) each pointed away from canon in ways that produce concretely wrong designs — primitive obsession, merged linguistic boundaries, oversized aggregates. Findings 1–5 material, 6–11 line-level.
