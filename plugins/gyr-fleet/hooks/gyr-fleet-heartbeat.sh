#!/usr/bin/env bash
# gyr-fleet — register this Claude Code session in the gyr fleet via heartbeats.
#
# Reads the hook event JSON on stdin and calls `gyr heartbeat` so the session
# shows up in `gyr fleet`. Best-effort by design: if the gyr CLI, jq, or a
# running gyrd is missing, it exits 0 silently and never blocks the session.
#
# Mapping:
#   SessionStart     -> register (op=agent, presence-only interval=0, detail=cwd)
#   UserPromptSubmit -> liveness pulse (status=ok)
#   SessionEnd       -> done (deregister)
#
# ponytail: presence-only (interval=0) means a crashed session lingers as "ok"
# until SessionEnd or manual prune — fine for v1. Add an agent TTL/dead-man if
# zombie sessions become noise.
set -uo pipefail

# Resolve the gyr CLI; bail silently if absent.
GYR="$(command -v gyr || true)"
[ -z "$GYR" ] && [ -x "$HOME/.local/bin/gyr" ] && GYR="$HOME/.local/bin/gyr"
[ -z "$GYR" ] && exit 0

# jq parses the hook payload; bail silently if absent.
command -v jq >/dev/null 2>&1 || exit 0

input="$(cat)"
sid="$(printf '%s' "$input" | jq -r '.session_id // empty')"
cwd="$(printf '%s' "$input" | jq -r '.cwd // empty')"
event="$(printf '%s' "$input" | jq -r '.hook_event_name // empty')"
[ -z "$sid" ] && exit 0

name="claude-${sid}"

case "$event" in
  SessionStart)
    "$GYR" heartbeat "$name" --op=agent --interval=0 --detail="$cwd" >/dev/null 2>&1 || true
    ;;
  UserPromptSubmit)
    "$GYR" heartbeat "$name" --status=ok --detail="$cwd" >/dev/null 2>&1 || true
    ;;
  SessionEnd)
    "$GYR" heartbeat "$name" --status=done >/dev/null 2>&1 || true
    ;;
esac

exit 0
