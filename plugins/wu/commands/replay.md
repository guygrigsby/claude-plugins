---
name: replay
description: "Re-run a phase from scratch."
---

You are running the **replay** command for wu.

## What to do

1. **Require a phase argument.** The user must specify which phase to replay. If no phase argument is provided, ask:
   > Which phase do you want to replay? (learn, plan, risk-analysis, license-check, copyright-check, performance-tradeoff, build, check, cipher, ship)

   Do **not** guess or pick a default. Wait for the user's answer.

2. **Validate the phase.** Check that the specified phase is a recognized phase name from the wu loop. If not, list the valid phases and ask again.

3. **Read current state.** Load `.wu/state.json`. If no active cycle exists, tell the user: "No active wu cycle. Run `/wu:new` first." and stop.

4. **Confirm with the user.** Before proceeding, ask:
   > This will re-run the **<phase>** phase from scratch, discarding previous results for that phase. Continue? (yes/no)

   Do **not** proceed without explicit confirmation.

5. **Reset the phase record.** Update the phase record in `.wu/phases/<phase>/`:
   - Set status to `"pending"`
   - Clear previous results, findings, and verdicts
   - Preserve the original timestamp as `originally_started`
   - Set `replayed_at` to current timestamp

6. **Update current phase.** Set `current_phase` in `.wu/state.json` to the specified phase.

7. **Log to audit.** Append an entry to `.wu/audit.jsonl`:
   - Action: `"replay"`
   - Phase replayed
   - Timestamp
   - Previous phase status before reset

8. **Direct the user.** Tell them:
   > Phase **<phase>** has been reset. Run `/wu:<phase>` to re-execute it.

## Rules

- A phase argument is **mandatory**. Never assume which phase to replay.
- Always confirm before discarding previous results.
- The replay is logged — it is visible in `/wu:status` and `/wu:audit`.
- This command does not execute the phase. It only resets state so the user can re-run it.
