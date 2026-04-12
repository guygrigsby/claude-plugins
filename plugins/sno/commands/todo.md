---
name: todo
description: "Add, list, or manage parking lot items for later. Usage: /sno:todo [item to add]"
argument-hint: "item to add (optional)"
---

You manage the sno todo list. Todos go to **GitHub issues** when possible, falling back to a local file.

## Step 1: Detect GitHub repo

Run `gh repo view --json nameWithOwner -q .nameWithOwner` (suppress stderr).
- If it succeeds, you have a GitHub repo. Use **GitHub mode**.
- If it fails (no `gh`, no remote, not a GitHub repo), use **local mode**.

---

## GitHub mode

**If the user provides an item:**
1. Create a GitHub issue via `gh issue create --title "<item>" --label "sno:todo"`.
   - If the `sno:todo` label doesn't exist, create it first: `gh label create "sno:todo" --description "Parking lot item from sno" --color "c5def5"`.
2. Confirm with the issue URL: "Created issue #N: <title>"

**If no item is provided:**
1. List open issues with the `sno:todo` label: `gh issue list --label "sno:todo" --state open`
2. If none exist, say "Todo list is empty."
3. Display the list.
4. Ask the user what they want to do:
   - Add an item (create a new issue)
   - Close an item (`gh issue close <number>`)
   - Promote an item to a new sno cycle (start `/sno:learn` with the issue as context, then close it)

---

## Local mode (fallback)

**If the user provides an item:**
1. Create `.sno/` and `.sno/todos.md` if they don't exist.
2. Append the item as a checkbox line: `- [ ] <item>`
3. Confirm: "Added to todo list. You have N items."

**If no item is provided:**
1. Read `.sno/todos.md`. If it doesn't exist or is empty, say "Todo list is empty."
2. Display the list.
3. Ask the user what they want to do:
   - Add an item
   - Remove/complete an item (mark with `[x]` or delete)
   - Promote an item to a new sno cycle (start `/sno:learn` with it as context)

### Local file format

```markdown
# Todo

- [ ] Item one
- [ ] Item two
- [x] Completed item
```

---

## Rules
- Keep it simple. This is a parking lot, not a project management tool.
- Items should be short — one line each.
- Don't auto-organize, categorize, or prioritize unless asked.
- GitHub mode is always preferred when available. Never ask the user which mode to use — just detect and go.
- When creating issues, keep the title concise. If the user provides extra context, put it in the issue body.
