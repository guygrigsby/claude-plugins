# drift-guards

Docs-vs-code drift, made impossible by test. Ships one skill, `drift-guards`.

## What it does

Fires when a fact is about to live in more than one place: docs describing code, a
README command, a catalog mirrored in a spec, a version string across manifests, an
env key in code and `.env.example` and a deploy unit, a status table. Also on
writing or updating READMEs/specs/CLAUDE.md, on adding an op/endpoint/flag/config
key/enum variant something else mentions, on committing generated artifacts, and
when someone notices docs out of date.

The rule: before writing a fact into another place, name the test that fails when
the copies diverge. No answer means write that test first, in the project's own
language, wired into the default test run and CI. One authority, every copy found
by discovery, because pairwise checks pass while the third copy rots.

Guard shapes are grouped by fact type in the skill: set equality, value equality,
executable truth, reference integrity, drift against things outside the repo, and
hygiene.

## Structure

```
plugins/drift-guards/
├── .claude-plugin/plugin.json
├── CLAUDE.md
├── README.md
└── skills/
    └── drift-guards/
        └── SKILL.md
```

Language-neutral; the default-gate examples name `go test ./...`.

## Versioning

Version lives in `.claude-plugin/plugin.json` and the marketplace entry in
`../../.claude-plugin/marketplace.json`. Bump both together.
