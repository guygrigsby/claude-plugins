# your-voice — design

The mirror of `my-voice`. Where `my-voice` makes Claude **write as Guy**, `your-voice`
makes Claude **talk to Guy the way he needs** — interaction modes inferred from his
communication style, layered on top of his tuned baseline disposition.

## The three decisions that shape it

1. **Baseline is sacred.** Guy's global `~/.claude/CLAUDE.md` disposition (correctness over
   agreement, no sycophancy, terse, agreement earned by reasoning) is the home state and is
   never overridden away. modes.md does not replace it.
2. **Inference is on.** Claude reads Guy's communication style every turn — clipped/rapid →
   speed, venting → ease, "this is shaky" → stress-test — and that read is the signal.
3. **Switch silently, Guy corrects.** No tag, no asking, no offer. Claude adapts on the read;
   Guy snaps it back if misread.

(2) + (3) make this **ambient and always-on**, the same behavioral shape as `ponytail`.
That dictates the mechanism.

## Mechanism — ponytail-faithful, simpler

Ambient always-on means the mode framework must be **live in context on every response**.
An on-demand command can't do that. So, like ponytail:

- **SessionStart hook** (`hooks/hooks.json` → a bash script) prints a short operative
  preamble + the full `modes.md` to stdout. For Claude Code, SessionStart stdout *is* the
  injected context (verified against ponytail's `writeHookOutput`, which for Claude Code is
  just `process.stdout.write(context)`). Bash, no node dependency.
- **No state file.** Simpler than ponytail. The injected framework is static
  ("infer silently; baseline is home"). An explicit pin is a plain in-context instruction
  that outranks inference until released — nothing to persist. Modes are ephemeral by
  design; a mode must not leak into a later session.
- **No CLAUDE.md digest.** The hook delivers the always-on payload; Guy's personal CLAUDE.md
  stays untouched.

## Components

1. **`.claude-plugin/plugin.json`** — name `your-voice`, version `0.1.0`, MIT, author Guy J
   Grigsby.

2. **`modes.md`** — editable source of truth *and* the injected payload. Revised from the
   current rough draft:
   - Header reframed: the unset/home state is **Guy's baseline disposition (his CLAUDE.md)**,
     not "Coworker". Modes are silent deviations inferred from communication style.
   - "Coworker (Default)" demoted to a normal selectable mode.
   - Core Principles kept (they reinforce the baseline and bound every mode — no mode may
     trade away correctness or honesty).
   - The 11 mode definitions kept as Guy's content, lightly tightened, each gaining a one-line
     **signal:** cue (what in Guy's style triggers it) so silent inference has something to key
     on.

3. **`hooks/hooks.json` + `hooks/your-voice-activate.sh`** — SessionStart hook. Script prints:
   ```
   # your-voice — interaction modes (ACTIVE)
   Read Guy's communication style each turn and silently adopt the fitting mode below.
   Switch silently: no tag, no asking; Guy corrects a misread. Baseline disposition
   (his CLAUDE.md) is home — return to it on neutral signals. No mode overrides the
   baseline's core: correctness over agreement, no sycophancy, agreement earned. An
   explicit pin (/your-voice <mode> or "stay in X") outranks inference until released.
   ```
   then `cat modes.md`. Uses `${CLAUDE_PLUGIN_ROOT}`.

4. **`commands/your-voice.md`** — thin explicit override (mirrors ponytail's command):
   `/your-voice <mode>` pins a mode regardless of style; `/your-voice` lists modes;
   `/your-voice reset|baseline|normal` releases to baseline. Pin is in-context only.

5. **`CLAUDE.md`** + **`README.md`** — plugin docs, mirroring my-voice.

## Registry updates (one commit, every list — project rule)

- `.claude-plugin/marketplace.json` — add entry, `source: ./plugins/your-voice`, `0.1.0`.
- Root `README.md` plugin table — add row.
- Root `CLAUDE.md` `## Plugins` list — add entry.
- Versions `0.1.0` must match across plugin.json and marketplace.json.

## Out of scope (YAGNI)

State-file persistence, per-turn re-injection beyond SessionStart, a statusline badge, a
CLAUDE.md digest, auto-detect tuning knobs. Add a state file only if Guy later wants a pinned
mode to survive `/clear`.

## Verification

Prompt/data plugin — no executable logic beyond the hook printing text. Checks:
`bash hooks/your-voice-activate.sh` prints the preamble + modes; `jq` validates plugin.json
and marketplace.json; version parity `0.1.0`; `your-voice` present in all three registry
lists. One shell check; no test framework.
