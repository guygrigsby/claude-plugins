# File Focus

Large files are agent context-killers. An agent often must read a whole file to safely edit part of it, so a 1500-line file can eat a large fraction of its working context for a one-line change. A file over budget usually also signals one doing too much.

## What to check

- List files over the line budget: `git ls-files | xargs wc -l | sort -rn | head -30`.
- The budget is configurable in `.claude/agent-ready.local.md` (`line_budget`, default 400). Exclude generated/vendored files via `ignore`.
- For each offender, ask: is this one responsibility, or several stapled together?

## Fix

Split along real seams: one type or responsibility per file, handlers separate from business logic separate from storage. Within a package this is low-risk (the public API is unchanged).

**This skill reports oversized files; it does not split them automatically.** If the split is mechanical (extract cohesive functions into a sibling file), recommend it concretely. If it's a boundary change (the file is doing too much because responsibilities are tangled), hand it to `ddd:domain-driven-design`.

## Ongoing

The PreToolUse hook warns when an edited or written file is over budget, so the problem is caught at write time instead of accumulating. Set `file_size_rule: block` in config to make it a hard gate.
