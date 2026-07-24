---
name: drift-guards
description: Use when a fact is about to live in more than one place (docs describing code, a README command, a catalog or config mirrored in a spec, a version string repeated across manifests, an env key in code and .env.example and a deploy unit, a status table, an onboarding doc), when writing or updating READMEs/specs/CLAUDE.md, when adding an op/endpoint/flag/config key/enum variant that something else mentions, when committing generated artifacts, or when a reviewer or user notices docs out of date. Automate everything so drift is impossible.
---

# Drift guards

Every fact that lives in more than one place gets a test comparing the copies,
code side as the source of truth. Review only has to catch prose semantics;
existence, status, counts, shapes, and examples are machine-checked.
Adding a copy without a guard is the bug.

## The rule

Before writing a fact into another place (doc, table, example, manifest, path
reference), ask: what test fails when the copies diverge? No answer means write
that test first, in the project's own language (no sidecar scripts), wired into
the default test run and CI. A guard that only runs when remembered is a wish.

Name one authority, always the code or whatever is closest to execution, and
check every other copy against it. Pairwise is not enough past two copies: the
pair you tested agrees while the third rots, and the guard still reports green.
Enumerate copies by discovery, not by hand: glob the manifests, walk the docs
tree, list the deploy units, so the copy someone adds next year is covered
without editing the guard. A hardcoded list of the places to check is itself a
fact living in two places.

Failure messages must name the fix: which file to touch, what to record, where
new things go instead. A guard that fails without instructions just moves the
drift to the person debugging it.

## Guard shapes (pick by fact type)

### Set equality (a collection mirrored somewhere)

1. **Registry ↔ doc table.** Every key in the code registry has a row in the
   doc; every documented row is registered (or explicitly marked UNSHIPPED, in
   which case it must NOT be registered). Parse the markdown table, compare both
   directions, across every doc that carries the table.
2. **Config keys both directions.** Every env var or setting the code reads
   appears in `.env.example`, the deploy unit, the chart, and the docs; every
   key any of those declare is actually read. Grep the reader call sites for the
   authoritative set. Unread keys are as much a lie as undocumented ones.
3. **Exhaustiveness.** Adding an enum variant, error code, event type, or state
   must break every consumer that switches on it. Prefer a compiler-enforced
   switch; where the language will not, a test asserts each consumer's handled
   set equals the declared set.

### Value equality (one literal, many copies)

4. **Single-source constants.** A version, port, timeout, limit, module path, or
   URL echoed across manifests, lockfiles, Dockerfiles, install docs, and
   badges. Derive the copies from one authority where the format allows;
   otherwise a guard reads all of them and asserts equality. Discover the files
   by glob so a new manifest joins the check for free.
5. **Recorded hash freeze.** For content that must not change casually (a
   fixture other tests depend on positionally, a wire-shape catalog): hash it,
   compare to a constant in the test. The failure message prints the new hash
   and states when recording it is legitimate and what to do otherwise. Pair
   with a version constant when consumers cache the content ("bump vN AND record
   the hash").
6. **Generated artifacts regenerate clean.** Anything committed that a generator
   produces (protobuf stubs, mocks, API clients, embedded assets, generated
   docs): rerun the generator in the gate and fail on a non-empty
   `git diff --exit-code`. Stale generated code passes every test that only
   reads it.

### Executable truth (the claim runs)

7. **Examples execute.** Every example in docs or a help catalog is lifted
   verbatim and run against a real fixture (dry-run if the system has one). An
   example that parses but fails teaches every reader the wrong call.
   Exemptions are explicit fields with a named reason, never silent skips.
8. **Doc commands match reality.** README/CLAUDE.md invocations are parsed and
   checked against the actual CLI dispatch table, flag sets, or API surface.
9. **Schema ↔ implementation ↔ fixtures.** Regenerate the schema (OpenAPI, JSON
   Schema, DDL) from the code and compare to the committed one; then validate
   every test fixture and documented payload against it. Three copies, one
   authority, both hops guarded.
10. **Determinism.** Where identical input must give identical bytes (caches,
    comparable results), run it twice and compare, excluding timing fields.

### Reference integrity (the thing pointed at)

11. **Referenced paths exist.** Any doc that names files or directories gets a
    guard that stats every reference. Same for the paths inside hooks, CI
    configs, and unit files, which name scripts that get renamed later.
12. **Counts and quantified prose.** "Seven dimensions", "all three modes",
    "the only endpoint that". A number or a totalizer in prose is a mirror of a
    collection's length; recount it in the guard. When the count is not worth a
    guard, delete the number from the sentence instead: the cheapest guard is
    not writing the second copy.

### Outside the repo (drift against something you do not own)

13. **Status ↔ tracker.** A doc row marked planned/candidate must cite an open
    issue; when the issue closes, the guard forces the row to flip.
14. **Cross-boundary copies.** A vendored file, a duplicated proto, a consumer's
    copy of producer constants, a deploy target's checkout of source. A repo
    boundary does not make it not-drift. Fetch the authority in CI and compare,
    or hold both ends to a contract test. Where the copy is a deployment, the
    guard is a health check asserting the running version equals the released
    one.
15. **Calendar drift.** Expiries, deprecation windows, "as of <year>" claims,
    TODO-after-v2, pinned certificate and token lifetimes. The second copy is
    the calendar. A test that fails a set interval before the date turns a
    future outage into a today failure.

### Hygiene

16. **Evidence identity.** Committed data records (results, benchmarks, logs
    kept in git) must carry the fields that make them distinguishable and
    reproducible. Old records are grandfathered by date, never rewritten.
17. **No sidecar scripts.** `git ls-files` has no `.py`/`.sh`/etc: a committed
    script is a missing subcommand in the project's language.

## Applying it

- New guards land TDD: watch the guard fail (seed a wrong hash, break a row)
  before recording the real value. For an N-copy guard, break the *last* copy,
  the one a pairwise check would have missed.
- Guards live next to what they check and run in plain `go test ./...` (or the
  project's default gate) AND CI on every push. If the project has no CI, adding
  it is part of this skill's job.
- When a guard fires during unrelated work, that is the system working: fix the
  named file in the same change, never suppress or skip.
- Deleting the duplicate beats guarding it. Generate the doc from the registry,
  derive the version from one manifest, drop the count from the sentence. Reach
  for a guard when the copy has to exist for humans or for a tool that cannot
  read the authority.
- Prose meaning still needs human review. Guards cover existence, status,
  counts, shapes, examples, and paths; they do not make claims true, only
  consistent.

## Smell test

You just wrote a number, a name, a path, a version, a config key, a table row,
or an example into a doc. If editing the code it describes would leave your
sentence standing, you owe a guard. If this is the third place that fact now
lives, you owe a guard that finds all three by discovery, and probably owe a
deletion.
