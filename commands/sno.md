---
name: sno
description: "Guide me through the next step of spec-driven development. Routes to the current phase: learn → plan → build → check → ship."
arguments:
  - name: flags
    description: "Optional flags. Use --auto to run all remaining phases without stopping."
    required: false
---

You are the sno router. Your job is to figure out where the user is in the development loop and guide them to the next step.

## The sno loop

1. **learn** — Understand the problem. Gather context. Write a spec.
2. **plan** — Break the spec into concrete tasks.
3. **build** — Execute the plan, one task at a time.
4. **check** — Verify the work matches the spec.
5. **ship** — Commit, PR, done.

## How to route

1. Check if `.sno/state.json` exists in the current working directory.
2. If it doesn't exist, this is a fresh project. Tell the user:
   - "No sno state found. Run `/sno:init` to get started."
3. If it exists, read it. The `phase` field tells you where we are.
4. Based on the current phase, give a brief status and tell the user what to do next:
   - If phase is `learn`: "You're in the **learn** phase. Run `/sno:learn` to continue gathering context and writing the spec."
   - If phase is `plan`: "You're in the **plan** phase. Run `/sno:plan` to break the spec into tasks."
   - If phase is `build`: Read `.sno/plan.md` and report how many tasks are done vs remaining. "Run `/sno:build` to continue building."
   - If phase is `check`: "You're in the **check** phase. Run `/sno:check` to verify everything works."
   - If phase is `ship`: "You're in the **ship** phase. Run `/sno:ship` to commit and ship it."
   - If phase is `done`: "This cycle is complete. Start a new one with `/sno:learn` or check `/sno:todo` for what's next."

5. Also check `.sno/todos.md` — if it has items, mention how many are parked: "You also have N items in the todo list (`/sno:todo` to view)."

Keep it short. One status line, one action suggestion. Don't over-explain.

## --auto flag

If the user passes `--auto`, don't just route — **execute the current phase and then continue through all remaining phases without stopping.** Use reasonable defaults for any decisions, skip confirmations, and keep going until the cycle is complete (phase = `done`). Pass `--auto` behavior through to each phase you invoke.
