---
name: new
description: "Initialize a new wu cycle. Creates branch, .wu/ state, and configuration."
---

You are initializing wu in the current project.

## What to do

1. Check if `.wu/state.json` already exists. If it does:
   - Read it. If `status` is `completed` or `aborted`, **archive the old cycle** before re-initializing:
     - Create `.wu/archive/` if it doesn't exist.
     - Move the current cycle's files into `.wu/archive/<N>/` where N is the next available number (1, 2, 3...).
     - Archive everything except `archive/` itself.
     - Keep only the last 5 archived cycles. If there are more than 5, delete the oldest.
   - If the cycle is still active (status is not `completed` or `aborted`), tell the user: "A wu cycle is already in progress (phase: **<current_phase>**). Run `/wu` to continue or `/wu:abort` to abandon it." Stop here.

2. **Pull latest and create a branch.**
   - Run `git pull` on the current branch to get latest changes.
   - Ask the user what they're working on (one short phrase). Use it to create a branch name: `wu/<slugified-phrase>` (e.g., `wu/add-retry-logic`).
   - Run `git checkout -b wu/<branch-name>`.
   - If the branch already exists, tell the user and ask them to pick a different name.

3. Create the `.wu/` directory structure:
   ```
   .wu/
     state.json
     config.json
     memory/
     audit/
     phases/
   ```

4. Write initial `state.json`:
   ```json
   {
     "cycle_slug": "<slugified-phrase>",
     "created_at": "<ISO 8601 timestamp>",
     "current_phase": "learn",
     "status": "active"
   }
   ```

5. Write default `config.json`:
   ```json
   {
     "skip_phases": [],
     "model_overrides": {},
     "budget": {
       "warning_threshold_tokens": 500000,
       "total_tokens_used": 0
     },
     "concurrency": {
       "max_parallel_agents": 4
     },
     "slop_threshold": 0.3,
     "cipher_rounds": {
       "learn": 3,
       "plan": 3,
       "build": 2,
       "check": 2,
       "cipher": 1,
       "ship": 1
     }
   }
   ```

6. **Print the config and ask the user to confirm or edit before proceeding.** Show each section with a brief explanation:
   - `skip_phases`: phases to skip entirely (empty by default)
   - `model_overrides`: override which model handles specific agents (empty by default)
   - `budget`: token budget controls — warn at 500k tokens
   - `concurrency`: max parallel agents (4 by default)
   - `slop_threshold`: maximum allowed slop score before flagging (0.3 = 30%)
   - `cipher_rounds`: how many cipher review rounds per phase
   - **Wait for the user to approve or request changes.** Do not proceed until confirmed.

7. Check if `.gitignore` exists. If it does, check whether `.wu/` is already in it. If not, append `.wu/` to `.gitignore`. If no `.gitignore` exists, create one with `.wu/` in it.

8. Tell the user:
   - "wu initialized on branch `wu/<branch-name>`. Run `/wu:learn` to start."
   - If a cycle was archived, mention: "Previous cycle archived to `.wu/archive/<N>/`."

That's it. Don't start the learn phase, don't do anything else beyond these steps.
