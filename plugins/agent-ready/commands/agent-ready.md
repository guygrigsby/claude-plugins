---
description: Audit this repo for agent-readiness across seven dimensions and apply the safe fixes.
---

Run an agent-readiness audit of the current repository.

**Use the `agent-ready` skill as the rubric and method.** Follow its progressive-disclosure approach: cheap scan first, then drill only into the dimensions that flagged. Do not read all seven references up front.

## Steps

1. **Cheap scan.** Without loading the deep references, detect which of the seven dimensions have issues:
   - Root has `CLAUDE.md` and/or `AGENTS.md`? Are they in sync?
   - Files over the line budget: `git ls-files | xargs wc -l 2>/dev/null | sort -rn | head -30` (budget from `.claude/agent-ready.local.md`, default 400).
   - A single documented build/test/lint gate command? Does it match CI?
   - Top-level layout legible? README present and orienting?
   - Obvious dead code / duplication (run the language's tooling if quick)?

2. **Drill in.** For each flagged dimension, read its reference under the skill's `references/` and apply its checks.

3. **Report.** Produce a prioritized remediation list, highest leverage first. For each finding: the dimension, what's wrong, the recommended fix, and whether it's auto-fixable or needs the human.

4. **Apply safe fixes only** (per the skill's safe-fix policy): regenerate/sync `CLAUDE.md` + `AGENTS.md`, fix stale doc links and contradicting docs, add/correct the documented verify command and `make help`. 

5. **Defer the rest.** Never auto-delete code or move files. Report dead code with evidence. Hand structural changes (module restructure, file splits that are really boundary changes) to `ddd:domain-driven-design`.

End with a short summary: what was auto-fixed, and the prioritized list of what the human should tackle next.

$ARGUMENTS
