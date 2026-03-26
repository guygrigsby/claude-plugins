---
name: plan
description: "Break the spec into concrete, ordered tasks. Produce a plan in .sno/plan.md."
---

You are in the **plan** phase of sno. Your goal is to turn the spec into an actionable task list.

## What to do

1. Read `.sno/spec.md`. If it doesn't exist, tell the user to run `/sno:learn` first.

2. Read the codebase to understand what exists. Focus on files relevant to the spec.

3. **Write the plan** to `.sno/plan.md`:

```markdown
# Plan: <title from spec>

## Tasks
- [ ] 1. <Task description> — <files involved>
- [ ] 2. <Task description> — <files involved>
- [ ] 3. <Task description> — <files involved>
...
```

4. Show the plan to the user. Ask if it looks right. When confirmed, update `.sno/state.json` phase to `build`.

## Rules
- Tasks should be small enough to do in one shot. If a task feels big, split it.
- Order matters — dependencies first.
- Each task should name the files it touches so the user knows the blast radius.
- 3-10 tasks is the sweet spot. If you have more than 10, you're planning too granularly. If you have fewer than 3, the spec might be too small to need a plan (that's fine — just make 1-2 tasks).
- Don't add tasks the user didn't ask for. No "add tests" or "update docs" unless the spec says so.
