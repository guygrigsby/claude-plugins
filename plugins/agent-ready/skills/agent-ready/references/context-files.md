# Context Files (CLAUDE.md + AGENTS.md)

The single highest-leverage dimension. `AGENTS.md` is the cross-tool convention (Codex, Cursor, Gemini, and more); `CLAUDE.md` is Claude Code's. Maintain both from one source of truth so they never drift.

## What belongs in the root context file

Keep it short and operational, not a design essay. Answer the questions an agent asks in its first 30 seconds:

- One paragraph: what this project is, and the request/data lifecycle (where work enters, where it exits).
- The map: where entry points live, what each top-level area does, the area most work touches.
- **The exact commands** to build, test, lint, and run one test. Agents run what you tell them; if you don't, they invent slow or wrong ones.
- Conventions not obvious from the code: error handling, logging, config loading, what's generated vs hand-written (and the regen command), what not to touch.
- Definition of done: the verify command must pass before claiming done.

What does NOT belong: anything an agent can read from the code, long narrative, subsystem specifics (those go in co-located docs, see progressive-disclosure).

## Keeping the two in sync

One source of truth, no hand-copying. Pick one:

- **Symlink** `CLAUDE.md -> AGENTS.md` (simplest; both tools read identical content).
- **Import**: keep canonical content in `AGENTS.md`; `CLAUDE.md` is a thin file that references it (`@AGENTS.md`) plus any Claude-only notes.

Prefer the symlink unless the repo needs Claude-specific additions. Whichever you pick, the audit verifies they haven't diverged.

## Living document

Every time an agent misunderstands the repo, the durable fix is a one-line addition here, not a one-off correction in chat. Over weeks this file is what makes agents good in the repo.
