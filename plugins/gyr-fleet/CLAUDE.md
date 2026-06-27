# gyr-fleet

Registers each Claude Code session in the [gyr](https://github.com/guygrigsby/gyr) fleet so your running instances show up in `gyr fleet` and can receive orders.

## How it works

Three hooks call one best-effort script (`hooks/gyr-fleet-heartbeat.sh`), which reads the hook payload and shells out to the local `gyr` CLI:

| Hook | Action |
|------|--------|
| `SessionStart` | register: `gyr heartbeat claude-<session> --op=agent --interval=0 --detail=<cwd>` |
| `UserPromptSubmit` | liveness pulse: `gyr heartbeat claude-<session> --status=ok` |
| `SessionEnd` | deregister: `gyr heartbeat claude-<session> --status=done` |

The member name is `claude-<session_id>` (unique per session). Registration is presence-only (`interval=0`) — a live session shows as `ok`; it never pages you on silence. A clean exit marks it `done`.

## Requirements

- `gyr` CLI on `PATH` (or at `~/.local/bin/gyr`) — `make install` in the gyr repo.
- `gyrd` running locally; the CLI reaches it over the unix socket. Run `gyr auth login` once.
- `jq` for parsing the hook payload.

Missing any of these → the hook exits silently. It never blocks or fails a session.

## Limitations (v1)

- Presence-only: a *crashed* session (no `SessionEnd`) lingers as `ok` until manually pruned. Acceptable for v1; an agent TTL/dead-man is future work.
- Liveness pulse fires on prompt submit, not on a timer.
- Order response is not wired yet: this plugin makes a session *visible*, not yet *reactive* to `self_heal`/`stop` orders. That's the broader enrollment framework (gyr `gyr-wot`).
