# Progressive Disclosure

The organizing principle. An agent should be able to act on a slice of the repo without reading the whole thing. Information is layered: a lean top points to deeper detail, loaded only when needed.

## What to check

- **Layered context files.** Root `CLAUDE.md`/`AGENTS.md` is a map, not a manual. It states what the project is, where things live, and the verify command, then *points* to deeper docs. It does not inline subsystem detail.
- **Co-located subsystem docs.** A complex package has its own `CLAUDE.md` (or `README.md`) next to the code it describes, so an agent working there reads that, not the root file.
- **Directory-level READMEs.** A directory with non-obvious contents has a short README so an agent reads one doc instead of every file.
- **Detail pushed down.** General rules live high; specifics live next to the code they govern. An agent never loads payment-specific rules to edit the scheduler.
- **Code-level disclosure.** Small, focused files (dimension 3) are progressive disclosure at the code level: an agent loads the one file that matters, not a 2000-line catch-all.

## Smells

- A single root context file over ~200 lines trying to document everything.
- Deep subsystems with zero local docs, forcing whole-tree reads.
- Detail duplicated at root and in subdirs (now they drift).

## Fix

Split the monolithic context file: keep a lean root map, move subsystem detail into co-located `CLAUDE.md`/README files, and link to them from the root. Report file splits (dimension 3) separately.
