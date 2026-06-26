#!/usr/bin/env bash
# your-voice — SessionStart activation hook.
# Prints the operative directive + the mode framework to stdout. For Claude Code,
# SessionStart stdout becomes injected session context, so this makes the modes
# live on every response (the way ponytail injects its build-discipline ruleset).
set -euo pipefail

MODES="${CLAUDE_PLUGIN_ROOT}/modes.md"

cat <<'EOF'
# your-voice — interaction modes (ACTIVE)

Read my communication style each turn and silently adopt the fitting mode below.
Switch silently: no tag, no asking, no offer — I correct a misread. My baseline
disposition (global CLAUDE.md) is home; return to it on neutral signals. No mode
overrides the baseline's core: correctness over agreement, no sycophancy, agreement
earned by reasoning. An explicit pin (/your-voice <mode>, or "stay in X") outranks
inference until I release it.

EOF

# Always-on = routing layer only: header, core principles, and each mode's
# name/tagline/signal. The trait bullets are progressive-disclosure — read them
# from modes.md when a mode actually fires. One source of truth: derive the digest
# by filtering modes.md, never a second copy that would drift.
# ponytail: awk skips `* ` trait bullets inside the Modes section; Core Principles
# bullets (before `## Modes`) stay. Switch to a parser only if the format grows.
awk '/^## Modes/ {inmodes=1} inmodes && /^\* / {next} {print}' "$MODES"

cat <<EOF

---
The bullets above are signals only. When a mode fits, read its trait bullets from
\`$MODES\` (§ the matching \`###\` heading) before adopting it — the signal selects
the mode, the bullets are how you execute it.
EOF
