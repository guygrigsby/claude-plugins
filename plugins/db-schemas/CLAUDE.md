# db-schemas

Integrity-first SQL DDL as a Claude Code skill. Fires whenever DDL is written or reviewed and moves every rule it can from application code, where it can be forgotten, into the database, where it cannot.

## What it does

Ships one skill, `writing-db-schemas`. It triggers before the first `CREATE TABLE` of any schema or migration work, and reacts to the symptoms in existing schemas: nullable status columns (`returned_at`, `deleted_at`), foreign keys without ON DELETE, TEXT timestamps, application-generated ids, `CHECK (col IN (...))` vocabularies.

The stance: normalization is the means, integrity is the point. The rules it enforces:

1. The database generates ids and row timestamps; the application reads them back with `RETURNING`.
2. Every reference is a foreign key and every FK declares ON DELETE (CASCADE for owned rows, RESTRICT across aggregates).
3. A fact that happens later is its own table keyed by the parent; state derives from row existence.
4. No conditional columns whose meaning depends on a sibling.
5. Closed vocabularies are seeded enum tables, never CHECK constraints or app-enforced strings.
6. Real types: TIMESTAMPTZ/DATE for time, integer minor units for money.
7. NOT NULL is the default; every surviving nullable column states what NULL means.
8. 5NF, no derivable columns; deliberate exceptions recorded beside the column.
9. No compound-key ceremony feeding nothing.
10. Every index names the query it serves; rules SQL cannot express are store-enforced and recorded inline.

Extracted from the [ddd](../ddd/CLAUDE.md) plugin, whose `defining-contracts` skill still owns the contract-completeness pass (every table defined to 100% alongside API and event contracts); this plugin owns how the DDL itself is written.

## Structure

```
plugins/db-schemas/
├── .claude-plugin/plugin.json
├── CLAUDE.md
├── README.md
└── skills/
    └── writing-db-schemas/
        └── SKILL.md
```

## Versioning

Version lives in `.claude-plugin/plugin.json` only. The marketplace entry in `../../.claude-plugin/marketplace.json` is generated from it (`npm run gen`); never hand-edit it.
