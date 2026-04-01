---
name: crew
description: "Show the current formation — who's assigned to what."
---

You are running the **crew** command for wu.

## What to do

1. **Show all 9 Wu-Tang members.** Display a table with every agent:

   | Alias | Display Name | Role | Default Phases | Current Model |
   |-------|-------------|------|----------------|---------------|
   | RZA | RZA | Orchestrator | all (coordination) | (from config or default) |
   | GZA | GZA | Technical Architect | learn, risk-analysis, performance-tradeoff | (from config or default) |
   | ODB | Ol' Dirty Bastard | Chaos Tester | check, cipher | (from config or default) |
   | Inspectah Deck | Inspectah Deck | Quality Verifier | cipher, check | (from config or default) |
   | Raekwon | Raekwon | Implementation Strategist | learn, plan, build, risk-analysis | (from config or default) |
   | Ghostface | Ghostface Killah | Domain Researcher | learn, plan | (from config or default) |
   | Method Man | Method Man | Integration Specialist | build, check | (from config or default) |
   | Masta Killa | Masta Killa | Compliance Specialist | learn, license-check, copyright-check, cipher | (from config or default) |
   | U-God | U-God | Infrastructure Analyst | build, performance-tradeoff | (from config or default) |

2. **Read config for model overrides.** Load `.wu/config.json` if it exists. Check for per-agent model overrides and reflect them in the "Current Model" column. If no config exists, show defaults and note that no config overrides are active.

3. **Show current formation.** Read `.wu/state.json` to get the active phase. Show which agents are assigned to the current phase:
   - List each agent assigned to the active phase with their role.
   - If no active cycle exists, show: "No active cycle. Showing default assignments only."

4. **Show per-cycle overrides.** If `.wu/config.json` contains any agent overrides for the current cycle (disabled agents, reassigned phases, model swaps), list them explicitly.

5. **Show agent stats.** Read `.wu/audit.jsonl` if it exists. For each agent that has been dispatched, show:
   - Total dispatches
   - Success rate (successes / total)
   - Average duration
   - Display as a table sorted by total dispatches descending.
   - If no audit log exists, show: "No dispatch history available."

## Output format

Use tables for all sections. Group with clear headers. This is a read-only informational command.

## Notes

- This command does not modify any state.
- If files are missing, degrade gracefully — show what you can and note what is unavailable.
