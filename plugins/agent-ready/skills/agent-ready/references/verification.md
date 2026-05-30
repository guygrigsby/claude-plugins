# Verification

An agent is dramatically safer when it can verify its own work. That needs one documented command that builds, tests, and lints, and it must match what CI runs.

## What to check

- **Is there a single gate command?** `make check`, `npm test`, `task ci`, one entry that runs fmt + vet/lint + build + test.
- **Is it documented in the context file?** If an agent has to discover the command, it invents a slower or wrong one.
- **Does it match CI?** If `make check` and CI diverge, agents (and humans) chase phantom failures. The local gate passing should mean CI passes.
- **Is it fast enough to actually run?** Slow suites get skipped. Unit tests should avoid network; parallelize where possible.

## Fix

- Auto-fix: add or correct the documented verify command in `CLAUDE.md`/`AGENTS.md`. Add a `make help` listing targets with one-line descriptions.
- Report (don't auto-build): a missing gate target, or divergence between the gate and CI, recommend the specific target to add, mirroring the CI workflow.

## Why it matters for agents

The verify command is the agent's feedback loop. Without it, "done" is a guess. With it, the agent closes the loop itself: change, run the gate, fix, repeat, no human round-trip.
