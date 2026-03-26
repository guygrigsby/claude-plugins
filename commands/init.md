---
name: init
description: "Initialize sno in the current project. Creates .sno/ directory and state file."
---

You are initializing sno in the current project.

## What to do

1. Check if `.sno/state.json` already exists. If it does, tell the user: "sno is already initialized. Current phase: **<phase>**. Run `/sno` to continue."

2. Create `.sno/` directory and `.sno/state.json`:
   ```json
   {"phase": "learn", "started": "<ISO date>"}
   ```

3. Check if `.gitignore` exists. If it does, check whether `.sno/` is already in it. If not, append `.sno/` to `.gitignore`. If no `.gitignore` exists, create one with `.sno/` in it.

4. Tell the user:
   - "sno initialized. Run `/sno:learn` to start, or `/sno` to see where you are."

That's it. Don't ask questions, don't start the learn phase, don't do anything else.
