---
name: override
description: "Force past a failed quality gate. Logged to audit with full context."
---

You are running the **override** command for wu.

## What to do

1. **Require a gate identifier.** The user must specify which gate to override. If no gate argument is provided:
   - Read `.wu/state.json` and phase records to find all gates with a `"failed"` status.
   - If failed gates exist, list them and ask: "Which gate do you want to override?"
   - If no failed gates exist, tell the user: "No failed gates to override." and stop.

   Do **not** guess or pick a default gate.

2. **Validate the gate.** Check that the specified gate is a recognized quality gate:
   - `slop-check`
   - `concordance`
   - `license`
   - `copyright`
   - `risk`
   - `performance`

   If not recognized, list valid gates and ask again.

3. **Require a reason.** Ask the user:
   > Override requires a reason. Why are you overriding the **<gate>** gate?

   Do **not** proceed without a reason. The reason must be a non-empty string from the user.

4. **Record the override in audit.** Append to `.wu/audit.jsonl` with full context:
   - Action: `"override"`
   - Gate name
   - User's stated reason
   - All findings that were present at the time of the gate failure (copy them into the audit entry)
   - Timestamp
   - Previous gate status

5. **Mark the gate as overridden.** Update the gate status to `"overridden"` — this is a **distinct status** from `"passed"`. The gate did not pass; it was bypassed.
   - Store the override metadata: reason, timestamp, original findings count.

6. **Advance past the gate.** Update `.wu/state.json` to move past the overridden gate to the next phase or step.

7. **Warn the user.** Always display:
   > Override recorded. The audit trail shows this gate was bypassed. The reason and all findings at the time of override are permanently logged.

## Rules

- A gate identifier is **mandatory**. Never assume which gate to override.
- A reason is **mandatory**. Never accept an empty or missing reason.
- Overridden is **not** the same as passed. The distinction must be preserved in all state and audit records.
- The full findings context at the time of override is recorded — not just a summary, but all individual findings.
- Overrides are permanent audit entries. They cannot be deleted or modified.
- This is a serious action. The confirmation and warning are not optional.
