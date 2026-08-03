---
name: writing-db-schemas
description: Use when writing or reviewing SQL DDL — creating a table, adding a column, designing a schema or a migration — before the first CREATE TABLE is typed. Also when a schema shows nullable status columns (returned_at, deleted_at, closed_at), foreign keys without ON DELETE, TEXT timestamps, application-generated ids, CHECK (col IN (...)) vocabularies, delimited lists or JSON columns standing in for child tables, or tables whose only key is the surrogate id.
---

# Writing DB Schemas

## Overview

Normalization is the means; **integrity is the point**. A schema is correct
when the database itself refuses invalid states. A normalized schema that
trusts the application to behave is not done — every rule below moves a check
from code, where it can be forgotten, into the database, where it cannot.

## The Rules

1. **The database generates ids and row timestamps.** `DEFAULT` expressions —
   `(lower(hex(randomblob(16))))` in SQLite, `gen_random_uuid()` in Postgres,
   `CURRENT_TIMESTAMP` for both — read back with `RETURNING`. The application
   never invents a primary key or a `created_at`.
2. **A surrogate PK never replaces the natural key — declare both.** Every
   table whose rows have a real-world identity carries `UNIQUE` on that
   identity (`isbn`, `email`, `(org_id, slug)`). Every normal form is defined
   over candidate keys; a table whose only key is the surrogate is vacuously
   normalized and stores the same entity twice without complaint. A table
   with genuinely no natural key (pure event rows) says so in a comment
   where the UNIQUE would have been.
3. **Every reference is a foreign key, and every FK declares ON DELETE.**
   CASCADE for owned child and fact rows (line items, deletions, closures,
   memberships); RESTRICT for cross-aggregate references. A bare TEXT/INTEGER
   column that names another table's row is a missing constraint.
4. **A fact that happens later is its own table.** `returned_at`,
   `closed_at`, `deleted_at`, `revoked_at` sitting NULL on every live row is a
   column about a non-event. Give the fact its own table keyed by the parent
   (`loan_returns`, `account_closures`) and derive state from row existence.
   The PK on the parent id makes "can't happen twice" structural, not
   procedural.
5. **No conditional columns.** A column whose meaning depends on a sibling
   (`fulfilled_at` vs `cancelled_at`, `reason` only when suspended) is two
   fact tables wearing one row.
6. **Closed vocabularies are seeded enum tables**, FK targets — never
   `CHECK (col IN (...))`, never app-enforced strings. Adding a value is an
   INSERT, not a migration rebuilding a CHECK.
7. **Real types.** `TIMESTAMPTZ`/`DATE` for time (SQLite: declare them
   anyway — affinity stores ISO8601 text and the schema stays honest and
   portable), INTEGER minor units for money. Never float for money, never
   TEXT-declared timestamps.
8. **NOT NULL is the default.** NULL means "a value exists but we don't know
   it yet" — never "hasn't happened" (rule 4) and never "not applicable"
   (rule 5). Every surviving nullable column states what NULL means in a
   comment beside it, or loses its nullability.
9. **5NF means every form, not just the name.**
   - **1NF — columns are atomic.** No delimited lists, no numbered column
     families (`phone1`, `phone2`), no JSON or array column hiding a
     relation. Each is a child table; query-relevant data never lives
     inside a blob.
   - **2NF/3NF/BCNF — nothing depends on less than a whole key.** A value
     identical across an operation's child rows (date, memo, author,
     client) belongs on the parent, once. A non-key column determined by
     another non-key column (`city` beside `zip`, a customer's tier copied
     onto the order row) is a JOIN, not a column. Display names come from
     JOINs, not snapshot copies.
   - **4NF — independent multivalued facts get separate tables.** One join
     table whose FKs serve two unrelated many-to-manys stores cartesian
     noise; split it into one table per relationship.
   - **5NF — projections that rejoin losslessly are the real tables.** Test
     three-way relationship tables against the business rule: if the rule
     is really two or three pairwise facts, store those.
   - **No derivable columns anywhere.** A deliberate exception is recorded
     in a comment beside the column — an unrecorded exception is a
     loophole.
10. **No compound-key ceremony.** `UNIQUE (scope_id, id)` beside a
    single-column PK exists only to feed composite FKs; when the PK is not
    compound, use plain single-column FKs and delete the apparatus.
11. **Every index names the query it serves**, in a comment. A rule SQL
    cannot express (uniqueness spanning a fact table, a derived-balance
    check) is enforced in the store's write transaction and recorded in a
    comment exactly where the constraint would have been.

## Core pattern

```sql
-- ❌ state as nullable columns, bare FKs, TEXT time
CREATE TABLE loans (
    id          INTEGER PRIMARY KEY,
    book_id     INTEGER NOT NULL REFERENCES books(id),
    due_at      TEXT NOT NULL,
    returned_at TEXT              -- NULL = still out
);

-- ✅ facts as rows, ON DELETE everywhere, real types, DB-generated ids,
--    natural key declared beside the surrogate
CREATE TABLE books (
    id   TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    isbn TEXT NOT NULL UNIQUE   -- candidate key: the surrogate alone would
                                -- admit the same book twice
);
CREATE TABLE loans (
    id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    book_id   TEXT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    loaned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at    TIMESTAMPTZ NOT NULL
);
CREATE TABLE loan_returns (
    loan_id     TEXT PRIMARY KEY REFERENCES loans(id) ON DELETE CASCADE,
        -- PK: a loan cannot be returned twice
    returned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- "one open loan per book" spans loan_returns, beyond a partial index:
-- store-enforced in the checkout transaction (recorded here).
```

## Red flags — stop and restructure

- A `*_at` column that is NULL until something happens
- Two nullable columns of which at most one may be set
- An FK with no ON DELETE behavior chosen
- An id or `created_at` assigned in application code
- `CHECK (col IN (...))` for a vocabulary
- `UNIQUE (x, id)` next to `PRIMARY KEY (id)`
- A copied display name a JOIN would have fetched
- A nullable column with no comment saying what NULL means
- A delimited list, JSON blob or numbered column family standing in for a child table
- A surrogate-PK table with no UNIQUE on any natural key and no comment saying why
- A join table whose FKs serve two independent relationships

## Rationalizations

| Excuse | Reality |
|---|---|
| "Quick schema, we'll harden later" | Quick schemas ship, then the migration costs 100× the constraint line |
| "The app validates it" | Every caller is a place the rule can be forgotten; the database is the one place it can't |
| "The partial index needs the nullable column" | The fact-table shape has an equivalent: a current-state row (`book_checkouts`), or a store-enforced check recorded inline |
| "Nullable is simpler than another table" | Simpler to write, and then every query carries `IS NULL` state logic forever |
