---
name: status
description: "Agent execution dashboard. Show current cycle state and agent activity."
---

You are running the **status** dashboard for wu.

## What to do

1. **Read cycle state.** Load `.wu/state.json`. If it does not exist, tell the user: "No active wu cycle. Run `/wu:new` to start one." and stop.

2. **Show current cycle info:**
   - Cycle slug
   - Description
   - Current phase
   - Status (active, paused, completed, failed)
   - Created timestamp

3. **Show phase history.** Read `.wu/phases/` directory. For each phase record:
   - Phase name
   - Status: completed, pending, skipped, failed, overridden
   - Duration (if completed)
   - Display as a table with checkmarks for completed, dashes for pending, X for failed.

4. **Show agent activity.** Read `.wu/audit.jsonl` (or `.wu/audit.log`). Show the most recent 10 dispatches:
   - Agent alias and display name
   - Phase dispatched in
   - Status (success, failure, timeout)
   - Duration
   - Tokens used (if recorded)
   - Display as a table sorted by most recent first.

5. **Show budget summary.** Read `.wu/config.json` for `budget_threshold`. Compute total tokens used from audit log.
   - Tokens used vs threshold
   - Percentage consumed
   - If over 80%, warn: "Budget approaching limit."
   - If over 100%, warn: "Budget exceeded."

6. **Show active conflicts.** Check phase records and cipher round results for unresolved conflicts.
   - If any exist, list them with: source agents, severity, description.
   - If none, show: "No active conflicts."

## Output format

Use tables for readability. Group sections with headers. Keep output concise — this is a dashboard, not a report.

## Notes

- This command is read-only. It does not modify any state.
- If audit log is empty, show "No agent activity recorded."
- If config is missing, skip budget section and note it.
