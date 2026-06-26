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

# ponytail: cat the whole file — small, and keeping one source of truth beats a
# second condensed copy that would drift. Trim to a digest only if token cost bites.
cat "$MODES"
