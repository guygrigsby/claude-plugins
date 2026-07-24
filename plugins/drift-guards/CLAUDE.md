# drift-guards

Docs-vs-code drift, made impossible by test. Ships one skill, `drift-guards`.

## What it does

Fires when a fact is about to live in two places: docs describing code, a README
command, a catalog mirrored in a spec, a status table, an onboarding doc. Also on
writing or updating READMEs/specs/CLAUDE.md, on adding an op/endpoint/flag that
docs mention, and when someone notices docs out of date.

The rule: before writing a fact into a second place, name the test that fails when
the two diverge. No answer means write that test first, in the project's own
language, wired into the default test run and CI.

Nine guard shapes cover registry-vs-table, recorded hash freeze, executable
examples, status-vs-tracker, doc commands vs CLI dispatch, referenced paths,
evidence identity, no-sidecar-scripts, and determinism.

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
