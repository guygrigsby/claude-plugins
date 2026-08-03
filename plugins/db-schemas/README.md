# db-schemas

Integrity-first SQL DDL as a Claude Code skill. Whenever SQL DDL is being written or reviewed — a new table, a column, a schema, a migration — this skill makes the database itself refuse invalid states instead of trusting the application to behave.

## Install

From the `guygrigsby-plugins` marketplace:

```
/plugin marketplace add guygrigsby/claude-plugins
/plugin install db-schemas
```

## What triggers it

The `writing-db-schemas` skill fires before the first `CREATE TABLE` of any schema or migration work. It also reacts to the symptoms in an existing schema:

- Nullable status columns: `returned_at`, `deleted_at`, `closed_at` sitting NULL on every live row.
- Foreign keys with no ON DELETE behavior chosen.
- TEXT-declared timestamps, floats for money.
- Ids or `created_at` assigned in application code.
- `CHECK (col IN (...))` standing in for a vocabulary table.

## What it enforces

Normalization is the means; integrity is the point. The database generates ids and timestamps; every reference is an FK with explicit ON DELETE; a fact that happens later is its own table keyed by the parent, with state derived from row existence; no conditional columns; closed vocabularies are seeded enum tables; real types for time and money; NOT NULL is the default and every surviving NULL states its meaning; 5NF with deliberate exceptions recorded beside the column; every index names the query it serves; rules SQL cannot express are enforced in the store's write transaction and recorded inline.

Extracted from the [ddd](../ddd/) plugin. ddd's `defining-contracts` skill still owns defining every table to 100% alongside API and event contracts; this plugin owns how that DDL is written.

## License

MIT.
