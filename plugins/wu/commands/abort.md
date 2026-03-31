---
name: abort
description: "Abort the current wu cycle. Archives partial results, offers branch cleanup."
---

You are aborting the current wu cycle.

## What to do

1. Read `.wu/state.json`. If the file doesn't exist or there's no active cycle, tell the user: "No active wu cycle to abort." Stop here.

2. **Confirm with the user.** Ask: "Are you sure you want to abort the current wu cycle? This will archive partial results and mark the cycle as aborted." Wait for confirmation before proceeding.

3. Update `.wu/state.json`:
   - Set `status` to `aborted`
   - Add `aborted_at` with the current ISO 8601 timestamp

4. **Archive the current cycle** to `.wu/archive/<N>/`:
   - Create `.wu/archive/` if it doesn't exist.
   - Determine the next available archive number (1, 2, 3...).
   - Copy all current cycle files into `.wu/archive/<N>/` (everything except `archive/` itself).
   - Keep only the last 5 archived cycles. If there are more than 5, delete the oldest.

5. **Seal the audit trail.** Append a final entry to `.wu/audit/`:
   ```json
   {
     "event": "cycle_aborted",
     "cycle_slug": "<slug from state>",
     "phase_at_abort": "<current_phase from state>",
     "aborted_at": "<ISO 8601 timestamp>",
     "reason": "user-initiated abort"
   }
   ```

6. **Offer branch cleanup.** Check the current git branch:
   - If on a `wu/<slug>` branch, ask: "Delete branch `wu/<slug>` and switch back to the base branch? (y/n)"
   - If the user says yes, switch to the base branch and delete the wu branch.
   - If the user says no, leave the branch as-is.

7. Tell the user: "Wu cycle aborted. Partial results archived to `.wu/archive/<N>/`. Run `/wu:new` to start fresh."

That's it. Don't start a new cycle or do anything else beyond these steps.
