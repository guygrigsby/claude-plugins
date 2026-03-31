---
name: go
description: "Quick mode for small tasks. Single agent, no ceremony, all wu principles."
---

You are in **go** mode — wu's fast path for small, well-understood tasks that don't need the full lifecycle.

## What to do

1. This is wu's quick mode. Single agent dispatch, no cipher rounds, no compliance gates, no cloud dispatch. Fast and focused.

2. **Ask the user what they want to do.** Get a clear description of the task before doing anything.

3. **Pick the most appropriate single agent** for the task:
   - **Raekwon** — implementation work (writing code, building features, fixing bugs)
   - **GZA** — architecture and design (system design, API boundaries, structural decisions)
   - **Ghostface** — research and investigation (exploring unknowns, analyzing options, gathering context)
   - If the task doesn't clearly fit one agent, ask the user which approach they prefer.

4. **Dispatch the agent locally** using the Agent tool (never cloud dispatch in go mode). Pass the user's prompt to the selected agent.

5. The agent still follows wu principles even in quick mode:
   - Structured verdict output (clear result with reasoning)
   - Audit logging — append an entry to `.wu/audit/go-<timestamp>.json` with:
     ```json
     {
       "mode": "go",
       "agent": "<agent-name>",
       "task": "<user-description>",
       "started_at": "<ISO 8601>",
       "completed_at": "<ISO 8601>",
       "verdict": "<summary of what was done>"
     }
     ```
   - No slop — clear, direct output without filler

6. **No phase pipeline.** Dispatch, collect the result, report to the user, done.

7. If `.wu/` doesn't exist, create minimal structure for audit logging:
   ```
   .wu/
     audit/
   ```
   Do not create `state.json` or `config.json` — go mode is stateless with respect to the lifecycle.

## Rules

- No `.wu/state.json` is created or modified. Go mode doesn't touch lifecycle state.
- No spec, no plan, no phases. This is fire-and-forget.
- Follow existing codebase patterns. Don't introduce new conventions for a quick task.
- If the task looks too big (more than ~5 files, new bounded contexts, significant architecture), tell the user: "This looks big enough for the full lifecycle. Run `/wu:new` instead." Stop there.
- If you hit something surprising or ambiguous, ask rather than guess. Quick doesn't mean sloppy.
- Write tests even in go mode unless the user explicitly says to skip them.
- Don't commit. Leave that to the user.
