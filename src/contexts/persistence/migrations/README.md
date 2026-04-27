# Persistence Migrations

Forward-only SQL migrations for the local SQLite (sql.js) database.
See ADR-041 for the schema versioning policy.

## Policy

- **Forward-only.** No down migrations. To undo, write a new migration that
  performs the inverse change.
- **Idempotent runner.** `runMigrations(db)` is safe to call on every boot;
  it skips migrations whose number is below the current `schema_version`.
- **Single source of truth.** The `schema_version` table holds exactly one
  row whose `version` is the highest applied migration number + 1
  (i.e., the next expected file index). After `000-init.sql`, it is `1`.

## Adding a new migration

1. Create `NNN-slug.sql` in this directory, where `NNN` is the next
   monotonically increasing zero-padded integer (e.g., `001-add-embeddings.sql`).
2. Write the schema change as plain SQL. Every statement ends with `;`.
3. As the **last** statement, bump the version:
   ```sql
   UPDATE schema_version SET version = <NNN + 1>;
   ```
4. The runner discovers files via `import.meta.glob('./*.sql', { as: 'raw',
   eager: true })` and sorts by filename.
5. Each migration runs inside a `BEGIN` / `COMMIT` transaction; failures
   `ROLLBACK` and re-throw with the failing migration number.

## Notes

- Do not edit existing migration files after they ship — they are append-only
  history.
- Do not rely on file modification time for ordering; only the filename
  prefix matters.
- Tests should call `runMigrations` against a fresh `new SQL.Database()`
  to verify the full chain applies cleanly.
