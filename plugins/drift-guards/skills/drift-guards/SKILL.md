---
name: drift-guards
description: Use when a fact is about to live in two places (docs describing code, a README command, a catalog or config mirrored in a spec, a status table, an onboarding doc), when writing or updating READMEs/specs/CLAUDE.md, when adding an op/endpoint/flag that docs mention, or when a reviewer or user notices docs out of date. Automate everything so drift is impossible.
---

# Drift guards

Every fact that lives in two places gets a test comparing them, code side
as the source of truth. Review only has to catch prose semantics;
existence, status, counts, shapes, and examples are machine-checked.
Adding a fact without a guard is the bug.

## The rule

Before writing a fact into a second place (doc, table, example, path
reference), ask: what test fails when these two diverge? No answer means
write that test first, in the project's own language (no sidecar
scripts), wired into the default test run and CI. A guard that only runs
when remembered is a wish.

Failure messages must name the fix: which file to touch, what to record,
where new things go instead. A guard that fails without instructions
just moves the drift to the person debugging it.

## Guard shapes (pick by fact type)

1. **Registry ↔ doc table.** Every key in the code registry has a row in
   the doc; every documented row is registered (or explicitly marked
   UNSHIPPED, in which case it must NOT be registered). Parse the
   markdown table, compare both directions.
2. **Recorded hash freeze.** For content that must not change casually
   (a fixture other tests depend on positionally, a wire-shape catalog):
   hash it, compare to a constant in the test. The failure message
   prints the new hash and states when recording it is legitimate and
   what to do otherwise. Pair with a version constant when consumers
   cache the content ("bump vN AND record the hash").
3. **Examples execute.** Every example in docs or a help catalog is
   lifted verbatim and run against a real fixture (dry-run if the system
   has one). An example that parses but fails teaches every reader the
   wrong call. Exemptions are explicit fields with a named reason, never
   silent skips.
4. **Status ↔ tracker.** A doc row marked planned/candidate must cite an
   open issue; when the issue closes, the guard forces the row to flip.
5. **Doc commands match reality.** README/CLAUDE.md invocations are
   parsed and checked against the actual CLI dispatch table, flag sets,
   or API surface.
6. **Referenced paths exist.** Any doc that names files or directories
   gets a guard that stats every reference.
7. **Evidence identity.** Committed data records (results, benchmarks,
   logs kept in git) must carry the fields that make them
   distinguishable and reproducible. Old records are grandfathered by
   date, never rewritten.
8. **No sidecar scripts.** `git ls-files` has no `.py`/`.sh`/etc: a
   committed script is a missing subcommand in the project's language.
9. **Determinism.** Where identical input must give identical bytes
   (caches, comparable results), run it twice and compare, excluding
   timing fields.

## Applying it

- New guards land TDD: watch the guard fail (seed a wrong hash, break a
  row) before recording the real value.
- Guards live next to what they check and run in plain `go test ./...`
  (or the project's default gate) AND CI on every push. If the project
  has no CI, adding it is part of this skill's job.
- When a guard fires during unrelated work, that is the system working:
  fix the named file in the same change, never suppress or skip.
- Prose meaning still needs human review. Guards cover existence,
  status, counts, shapes, examples, and paths; they do not make claims
  true, only consistent.

## Smell test

You just wrote a number, a name, a path, a table row, or an example into
a doc. If editing the code it describes would leave your sentence
standing, you owe a guard.
