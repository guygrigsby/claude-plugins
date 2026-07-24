# drift-guards

Every fact that lives in two places gets a test comparing them, code side as the
source of truth. Review only has to catch prose semantics; existence, status,
counts, shapes, and examples are machine-checked. Adding a fact without a guard is
the bug.

## Install

From the `guygrigsby-plugins` marketplace:

```
/plugin marketplace add guygrigsby/claude-plugins
/plugin install drift-guards
```

## What triggers it

- A fact is about to live in two places (docs describing code, a README command, a
  catalog or config mirrored in a spec, a status table, an onboarding doc).
- Writing or updating a README, spec, or `CLAUDE.md`.
- Adding an op, endpoint, or flag that docs mention.
- A reviewer or user notices docs out of date.

## Guard shapes

1. Registry vs doc table, compared both directions.
2. Recorded hash freeze for content that must not change casually.
3. Examples lifted verbatim from docs and executed.
4. Status rows vs the issue tracker.
5. Doc commands vs the real CLI dispatch table and flag sets.
6. Referenced paths stat'd.
7. Evidence identity on committed data records.
8. No sidecar scripts (`git ls-files` has no stray `.py`/`.sh`).
9. Determinism: same input, same bytes.

Guards land TDD (watch them fail first), live next to what they check, and run in
the project's default gate plus CI. Failure messages name the fix: which file to
touch, what to record, where new things go instead.

## License

MIT.
