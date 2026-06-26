# your-voice

The mirror of `my-voice`. `my-voice` makes Claude **write as you**; `your-voice` makes Claude
**talk to you the way you need** — interaction modes inferred from your communication style,
layered on top of your tuned baseline disposition.

## How it works

- A **SessionStart hook** (`hooks/your-voice-activate.sh`) injects the mode framework
  (`modes.md`) as always-on context every session. That's what makes silent, style-based
  switching live on every response — the same delivery trick `ponytail` uses for build
  discipline, applied to talk-style instead.
- **Silent inference is the default.** Claude reads your communication style each turn and
  shifts mode without announcing or asking; you correct a misread. Your baseline disposition
  (global CLAUDE.md) is home and is never overridden — modes change tone, never correctness.
- **`/your-voice <mode>`** is the manual override: pin a mode regardless of style, list modes,
  or `reset` to baseline. A pin outranks inference until you release it.

## Files

- **`modes.md`** — the editable source of truth and the injected payload. Each mode carries a
  `signal:` line (the cue in your writing that calls for it). Edit this to tune the modes;
  changes take effect next session (hooks load at session start).
- **`hooks/`** — the SessionStart hook + activation script.
- **`commands/your-voice.md`** — the manual-override command.

## Design

- The baseline is sacred. `modes.md` does not replace how you're treated by default; it's a
  menu of deliberate, temporary deviations from it — never a replacement for the default.
- Modes are ephemeral. No state file, no cross-session persistence — a mode must not leak into
  a later session. Pins live in conversation context only.
- One source of truth. The hook injects `modes.md` whole rather than a condensed copy, so there
  is nothing to drift. Trim to a digest only if token cost ever bites.
- Never edits your personal `~/.claude/CLAUDE.md`. The always-on footprint is delivered by the
  plugin's own hook.
