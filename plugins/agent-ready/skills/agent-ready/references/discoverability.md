# Discoverability

The on-ramp. An agent (or a new human) should orient from the docs in minutes, and find the tools the repo expects them to use.

## What to check

- **README orients fast.** What the project is, how to run it, how to test it, where to look next. Not a feature tour, a launchpad.
- **Scripts explain themselves.** Entries in `scripts/` / `Makefile` have a one-line purpose. A `make help` or commented targets beats a pile of opaque names.
- **Generated artifacts are labeled.** A header comment or path convention (`*.gen.*`) so an agent doesn't hand-edit generated files.
- **The expected toolchain is stated.** If the repo wants `golangci-lint` / a specific formatter / a task runner, the context file says so and the command is runnable.

## Fix

- Auto-fix: add or tighten a `make help`; add one-line descriptions to scripts; note generated-file conventions in the context file.
- Report: a missing or thin README, draft a launchpad version from what's actually in the repo and propose it.

## Relation to progressive disclosure

Discoverability is the top layer of progressive disclosure: the README and `make help` are the lean entry that points an agent to everything else. Keep them short and pointing outward, not exhaustive.
