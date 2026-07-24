# drift-guards

Every fact that lives in more than one place gets a test comparing the copies, code
side as the source of truth. Review only has to catch prose semantics; existence,
status, counts, shapes, and examples are machine-checked. Adding a copy without a
guard is the bug.

## Install

From the `guygrigsby-plugins` marketplace:

```
/plugin marketplace add guygrigsby/claude-plugins
/plugin install drift-guards
```

## What triggers it

- A fact is about to live in more than one place (docs describing code, a README
  command, a catalog mirrored in a spec, a version string across manifests, an env
  key in code and `.env.example` and a deploy unit, a status table).
- Writing or updating a README, spec, or `CLAUDE.md`.
- Adding an op, endpoint, flag, config key, or enum variant something else mentions.
- Committing generated artifacts.
- A reviewer or user notices docs out of date.

## How it works

Name one authority, always the code or whatever is closest to execution, and check
every other copy against it by discovery rather than a hand-written list. Pairwise
comparison stops working past two copies: the pair you tested agrees while the
third rots.

Guard shapes cover set equality (registry vs doc table, config keys, enum
exhaustiveness), value equality (version strings, hash freeze, generated artifacts
regenerating clean), executable truth (examples that run, doc commands vs the real
dispatch table, schema vs implementation vs fixtures, determinism), reference
integrity (paths that exist, counts in prose), drift against things outside the
repo (issue tracker status, vendored copies and deploy targets, calendar expiries),
and hygiene. Full list in
[`skills/drift-guards/SKILL.md`](skills/drift-guards/SKILL.md).

Guards land TDD (watch them fail first, breaking the *last* copy), live next to
what they check, and run in the project's default gate plus CI. Failure messages
name the fix: which file to touch, what to record, where new things go instead.
Deleting the duplicate beats guarding it.

## License

MIT.
