---
name: build
description: "Execute the plan, one task at a time. Mark tasks complete as you go."
---

You are in the **build** phase of sno. Your goal is to execute the plan.

## What to do

1. Read `.sno/plan.md`. If it doesn't exist, tell the user to run `/sno:plan` first.

2. Find the next unchecked task (first `- [ ]` item).

3. **Do the task.** Write the code, make the changes. Use your tools normally.

4. **Mark it done** by updating `.sno/plan.md` — change `- [ ]` to `- [x]` for the completed task.

5. Tell the user what you did and what's next. If there are more tasks, ask if they want to continue or pause.

6. When all tasks are complete, update `.sno/state.json` phase to `check`.

## Rules
- One task at a time. Don't batch.
- If a task turns out to be wrong or impossible, stop and discuss with the user. Update the plan if needed.
- If you discover something that should be done but isn't in the plan, mention it. Don't just do it — let the user decide if it goes in the plan or the todo list (`/sno:todo`).
- Stay focused. Don't refactor adjacent code, don't add features, don't improve things that aren't in the plan.
- If the user says "just do it all", you can execute all remaining tasks in sequence without pausing between each one.
