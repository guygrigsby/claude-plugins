---
name: voice:pull-emails
description: "Pull recent sent emails from Gmail and append substantive ones to the corpus. Requires the Gmail MCP to be configured."
arguments:
  - name: window
    description: "How far back to pull. Examples: '14d', '90d', '6mo'. Default: '90d'."
    required: false
  - name: page_size
    description: "How many threads to fetch per page. Default: 50, max: 50."
    required: false
---

You are pulling sent emails into the voice corpus.

## Step 1: Verify the Gmail MCP is available

If no Gmail MCP search/get tools are reachable, tell the user to install/enable the Gmail MCP server, then stop.

## Step 2: Resolve config

- `$VOICE_HOME`: default `~/.claude/voice/`. Output goes to `$VOICE_HOME/corpus/emails/`.
- `window`: default `90d`. Build a Gmail query: `from:me newer_than:<window>`.
- `page_size`: default 50.

## Step 3: Fetch threads and bodies

1. Call the Gmail thread-search tool with the query and `pageSize`. Capture the list of threads.
2. For each thread, call the thread-get tool with `messageFormat=FULL_CONTENT`.
3. From each message, keep only those where the sender is the user (their own address). Drop everything else.

## Step 4: Filter

Drop messages that match any of:
- Body length < 30 characters and not a substantive short reply (e.g., "Sounds good." is fine; a single URL is not).
- Body is a forward template with no original commentary (look for `---------- Forwarded message ---------` followed by no original text before the quote).
- Body is essentially just a URL, a token, or a command line (self-notes).
- Body matches an agent-footer signature (`Generated with Claude Code`, etc.).
- Subject is `test`, `asdf`, etc. (look for very short low-effort subjects on self-addressed mail).

## Step 5: Write JSONL

Append to `$VOICE_HOME/corpus/emails/<YYYY-MM>.jsonl`, one JSON object per line:

```json
{"id": "<thread or message id>", "date": "<ISO date>", "subject": "...", "to": ["..."], "body": "<plaintext>", "register_hint": "email"}
```

Dedupe by `id` against any existing rows in the file.

## Step 6: Update the manifest

Append a row to `$VOICE_HOME/manifest.md` under the emails section: date, count added, count after dedupe.

## Step 7: Report

Print: total threads scanned, threads kept after filtering, threads added after dedupe, file path written. Stop. Do not auto-distill; the user can run `/voice:distill` when they're ready.
