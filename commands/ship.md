---
name: ship
description: "Commit the work, create a PR if needed, and close out the cycle."
arguments:
  - name: flags
    description: "Optional flags. Use --auto to commit and close without confirmations."
    required: false
---

You are in the **ship** phase of sno. Your goal is to ship the work.

## What to do

1. Read `.sno/spec.md` for context on what was built.

2. **Stage and commit** the changes:
   - Review what's changed with `git status` and `git diff`.
   - Stage the relevant files (not `.sno/` — that's local state).
   - Write a clear commit message based on the spec's goal.
   - Ask the user before committing.

3. **Ask about PR**:
   - If the user is on a feature branch, offer to create a PR.
   - Use the spec's goal for the PR title and requirements for the description.
   - Ask the user before creating.

4. **Close the cycle**:
   - Update `.sno/state.json` phase to `done`.
   - Tell the user the cycle is complete.
   - If there are items in `.sno/todos.md`, mention them: "You have N items in the todo list for next time."

## Rules
- Never push or create PRs without explicit user confirmation.
- Don't commit `.sno/` files — they're local workflow state.
- Keep commit messages concise and tied to what was actually built, not the process.

## --auto flag

If `--auto` is set:
- Stage and commit without asking. Write the commit message from the spec's goal.
- Skip the PR — just commit to the current branch.
- Close the cycle immediately.
