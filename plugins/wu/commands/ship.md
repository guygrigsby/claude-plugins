---
name: ship
description: "Commit, create PR, and close the wu cycle."
---

You are in the **ship** phase of wu.

## What to do

1. **Read state and validate phase.**
   - Read `.wu/state.json`. Verify `current_phase` is `ship`.
   - If the phase doesn't match, tell the user: "Current phase is **<current_phase>**. Run `/wu` to see what's next." Stop here.

2. **Read check summary for context.**
   - Load `.wu/summaries/check-summary.md`.
   - If no check summary exists, warn: "No check summary found. Did the check phase complete? Run `/wu:check` first." Stop here.
   - Extract: gate results, compliance verdicts, any overrides used, cycle description.

3. **Stage and commit all changes from the cycle.**
   - Run `git status` to see what changed.
   - Stage all modified, added, and deleted files from the working tree.
   - Do NOT stage `.wu/` directory contents (it should be in `.gitignore`).
   - Create a commit with a message derived from the cycle description in `state.json`.
   - Use standard commit format: concise subject line, blank line, body with key details.

4. **Create PR using `gh pr create`.**
   - **Title**: derived from the cycle description (keep under 70 characters).
   - **Body** must include all of the following sections:
     - **Summary**: what was built and why (from cycle description and build summary).
     - **Agent verdicts**: condensed results from cipher round reviewers.
     - **Compliance gate results**: pass/fail for each sub-phase (risk-analysis, license-check, copyright-check, performance-tradeoff).
     - **Overrides**: list any gates that were overridden via `/wu:override`, with justification if recorded.
   - Use `gh pr create --title "<title>" --body "<body>"`.
   - Capture and store the PR URL from the output.

5. **Archive the cycle.**
   - Create `.wu/archive/` if it doesn't exist.
   - Determine the next archive number N (1, 2, 3...).
   - Move all `.wu/` contents (except `archive/`) into `.wu/archive/<N>/`.
   - Keep only the last 5 archived cycles. Delete oldest if more than 5.

6. **Seal the audit trail.**
   - Append a final entry to `.wu/audit.jsonl` (before archiving moves it):
     ```json
     {
       "event": "cycle_complete",
       "timestamp": "<ISO 8601>",
       "cycle_slug": "<slug>",
       "pr_url": "<PR URL>",
       "total_tokens_used": <number>,
       "gate_status": "passed|overridden",
       "overrides": []
     }
     ```
   - The audit file moves with the archive.

7. **Update state.**
   - Write a final `state.json` in the archive with `status` set to `completed`.
   - The live `.wu/state.json` should reflect completion so `/wu:new` knows the cycle is done.
   - Write minimal state.json at `.wu/state.json`:
     ```json
     {
       "cycle_slug": "<slug>",
       "created_at": "<original>",
       "updated_at": "<now>",
       "description": "<description>",
       "current_phase": "ship",
       "status": "completed",
       "config": {}
     }
     ```

8. **Tell the user.**
   - "Shipped! PR created at <URL>."
   - "Cycle archived to `.wu/archive/<N>/`."
   - "Run `/wu:new` to start a new cycle."
