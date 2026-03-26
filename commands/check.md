---
name: check
description: "Verify the work matches the spec. Run tests, review changes, check acceptance criteria."
---

You are in the **check** phase of sno. Your goal is to verify the work.

## What to do

1. Read `.sno/spec.md` and `.sno/plan.md`.

2. **Check each acceptance criterion** from the spec's "Done when" section:
   - Read the relevant code to verify it's implemented.
   - Run tests if they exist.
   - Run the build/lint if applicable.
   - Mark each criterion as met or not met.

3. **Report results** to the user:
   - List each criterion with pass/fail.
   - If something fails, explain what's wrong and suggest a fix.

4. If everything passes, update `.sno/state.json` phase to `ship`.

5. If something fails, tell the user they can:
   - Fix it manually
   - Run `/sno:build` to address the gaps (update the plan with fix tasks first)
   - Ship it anyway if the gap is acceptable

## Rules
- Be honest. Don't rubber-stamp. If something doesn't meet the spec, say so.
- But also be practical. If a criterion is 95% met and the gap is trivial, note it but don't block.
- Don't add new requirements during check. If you notice something that should be improved, suggest adding it to `/sno:todo`.
