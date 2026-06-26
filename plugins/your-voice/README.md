# your-voice

The other side of `my-voice`. Where `my-voice` helps Claude **write as you**, `your-voice`
helps Claude **talk to you the way you need**: interaction modes inferred from your
communication style, layered on top of the baseline disposition you've already tuned.

The premise: a good default disposition is sacred, but real conversations shift gears —
sometimes you want a stress-test, sometimes you're thinking out loud, sometimes it's a rough
day and you want less friction. `your-voice` reads those gear-shifts from how you're writing
and adapts tone (never correctness) to match, then returns to baseline.

## Install

```
/plugin marketplace add guygrigsby/claude-plugins
/plugin install your-voice@guygrigsby-plugins
```

A SessionStart hook ships with the plugin; restart your session after install so it loads.

## How it works

- **Always-on, silent.** A SessionStart hook injects the mode framework (`modes.md`) every
  session, so Claude reads your style each turn and silently shifts mode — no announcing, no
  asking. You correct a misread.
- **Baseline is home.** Your global CLAUDE.md disposition is never overridden. Modes change
  tone, pacing, and emphasis — never correctness or honesty. The Core Principles (correctness
  over agreement, no sycophancy, earned agreement) bind in every mode.
- **Manual override.** `/your-voice <mode>` pins a mode regardless of style; `/your-voice`
  lists the modes; `/your-voice reset` returns to baseline. A pin holds until you release it.

## The modes

`coworker`, `mentor`, `research-partner`, `skeptic`, `rubber-duck`, `brainstorming`,
`professor`, `nurturing`, `drill-sergeant`, `minimalist` — each with a `signal:` line naming
the cue in your writing that calls for it. Tune them by editing `modes.md`; changes take
effect next session.

## Customize

`modes.md` is the source of truth and the injected payload. Edit it to add, remove, or
reword modes and their signals. It does not touch your personal `~/.claude/CLAUDE.md`.
