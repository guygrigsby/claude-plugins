---
name: agent-ready
description: Use when making a repository easy for coding agents to work in, or keeping it that way, auditing a repo for agent ergonomics, bootstrapping or refreshing CLAUDE.md / AGENTS.md, when a session-start notice says context files are missing or stale, when a file has grown too large for an agent to hold in context, or when onboarding a codebase for agentic development. Not for writing application features.
---

# Agent-Ready

## Overview

A repo is agent-ready when an agent can navigate it, understand the slice it needs, and verify its own work, without ingesting the whole tree. The organizing principle is **progressive disclosure**: lean entry points that point to deeper detail, loaded only on demand. Every dimension below serves that principle.

Agents fail in repos for predictable reasons: they can't find entry points, don't know the rules so they guess, read huge files to answer small questions, can't tell live code from dead, and have no fast feedback loop. Agent-ready closes those gaps and keeps them closed.

## When to use

- Asked to make a repo agent-ready / agent-optimized, or audit one.
- Bootstrapping or refreshing `CLAUDE.md` / `AGENTS.md`.
- A SessionStart notice reports missing or stale context files.
- A file has outgrown the line budget.

Not for building application features. For a large structural change (carving a subsystem, swapping a dependency), this skill **defers to `ddd:domain-driven-design`** rather than duplicating it.

## How to run an audit (progressive disclosure in practice)

Do not read all seven references up front. Cheap scan first, then drill only into what flagged.

1. **Cheap scan**: cheaply detect which dimensions have issues: `ls` the root for `CLAUDE.md`/`AGENTS.md`, list files over the budget (`git ls-files | xargs wc -l`), check for a documented build/test command, skim the top-level layout.
2. **Drill in**: for each dimension that flagged, read its reference (below) and apply its checks.
3. **Report**: produce a prioritized remediation list, highest leverage first (context files usually win).
4. **Safe-fix**: apply only the safe class automatically (see policy). Everything else is reported for the human.

## The seven dimensions

Each links to its reference. Load a reference only when that dimension flagged.

1. **Progressive disclosure**: layered docs, agent loads only its slice. `references/progressive-disclosure.md`
2. **Context files**: `CLAUDE.md` + `AGENTS.md`, current, concise, kept in sync. `references/context-files.md`
3. **File focus**: files within a line budget; oversized files split. `references/file-focus.md`
4. **Boundaries & navigability**: clear structure, discoverable entry points. `references/boundaries.md`
5. **Verification**: one documented command an agent runs to self-verify. `references/verification.md`
6. **Ambiguity & redundancy**: dead code, duplicate concepts, contradicting docs. `references/ambiguity.md`
7. **Discoverability**: README, dir-level docs, self-explaining scripts. `references/discoverability.md`

## Safe-fix policy

| Class | Action |
|-------|--------|
| Regenerate / sync `CLAUDE.md` + `AGENTS.md` | Auto-fix |
| Fix stale doc links, dead references in docs | Auto-fix |
| Add a `make help` / document the verify command | Auto-fix |
| Flag dead code (with evidence) | Report, don't delete |
| Split an oversized file | Report (or hand to `ddd` if it's a boundary change) |
| Restructure modules / move packages | Report, defer to `ddd` |

Never delete code or move files automatically. Surface those with a recommendation and let the human decide.

## Relationship to the rest of the plugin

- The `/agent-ready` command runs this audit on demand and applies the safe-fix class.
- The plugin's hooks enforce two dimensions continuously: a PreToolUse line-budget check (dimension 3) and a SessionStart context-drift check (dimension 2). Thresholds live in `.claude/agent-ready.local.md`.
