# Ambiguity & Redundancy

Dead code, duplicate concepts, and contradicting docs actively mislead agents. They read dead paths, pattern-match on them, and propagate the dead pattern into new code. Removing noise gives context budget back on every future task.

## What to check

- **Dead code.** Use the language's tooling, don't eyeball it:
  - Go: `deadcode ./...` (golang.org/x/tools), `staticcheck` (U1000), `go vet`.
  - JS/TS: `knip`, `ts-prune`, ESLint `no-unused`.
  - Python: `vulture`, `ruff` unused rules.
- **Duplicated logic.** Copy-paste blocks (`dupl` for Go, `jscpd` cross-language) that should be one function. Also duplicate *concepts*: two types/modules that mean the same thing.
- **Contradicting docs.** README or context files that disagree with the code (stale commands, renamed paths, removed features). These are worse than no docs, an agent trusts them.

## Fix

- Auto-fix: correct stale/contradicting documentation (stale commands, dead links, renamed paths).
- Report with evidence (don't delete): dead code and duplication. List each finding with the tool output that proves it, and recommend removal or consolidation. Deletion is the human's call, the code may be load-bearing in ways the tool missed (reflection, build tags, external callers).

Never auto-delete code.
