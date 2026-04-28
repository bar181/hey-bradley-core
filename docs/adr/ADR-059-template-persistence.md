# ADR-059: Template Persistence

**Status:** Accepted
**Date:** 2026-04-28 (P30 Sprint D P2)
**Deciders:** Bradley Ross
**Phase:** P30

## Context

P29 (ADR-058) shipped the Template Library API as a decoration over the static `TEMPLATE_REGISTRY`. Sprint D P2 needs to make the library **dynamic** — users author templates via chat (e.g., "save this as a hero-CTA template"), the library persists them to IndexedDB, and they show up alongside the 3 P23 baselines on browse.

The wrinkle: the existing `Template` runtime contract (P23/ADR-050) carries `matchPattern: RegExp` + `envelope: (ctx) => TemplateEnvelope` — function values that don't survive JSON round-tripping. P30 must persist user templates without violating that contract or forcing a runtime-materialization detour that buys little before the content arc (P31-P33) lands.

## Decision

### Migration

`src/contexts/persistence/migrations/003-user-templates.sql` — adds:

```sql
CREATE TABLE user_templates (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('theme','section','content')),
  kind          TEXT NOT NULL CHECK (kind IN ('patcher','generator')),
  examples_json TEXT NOT NULL DEFAULT '[]',
  payload_json  TEXT NOT NULL,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);
CREATE INDEX idx_user_templates_category ON user_templates(category);
CREATE INDEX idx_user_templates_kind     ON user_templates(kind);
```

Migration runner bumps `schema_version` 3 → 4. Migration is **idempotent on re-init** because the runner only re-applies migrations whose number ≥ current version (see `migrations/index.ts`).

### Repository

`src/contexts/persistence/repositories/userTemplates.ts` — typed CRUD:
- `createUserTemplate(input)` — validates id+name; inserts row; persists IndexedDB; returns row
- `listUserTemplates(filter?)` — optional `{category, kind}` filter
- `getUserTemplate(id)` — single-row lookup
- `deleteUserTemplate(id)` — hard delete; returns boolean rowsAffected
- `parseUserTemplate(row)` — JSON-parse helper (returns `null` on parse failure)

### Browse view (split-type pattern)

The Library API gains `listAllForBrowse(loadUserRows)` which returns `BrowseTemplate[]` — a **metadata-only projection** of the merged set:

```ts
interface BrowseTemplate {
  id: string
  name: string
  category: TemplateCategory
  kind: TemplateKind
  examples: readonly string[]
  source: 'registry' | 'user'
}
```

`BrowseTemplate` deliberately **does not extend `Template`** because user rows lack the runtime function fields. This is the split-type pattern: `TemplateMeta` for runtime dispatch (P23-P29 consumers unchanged) and `BrowseTemplate` for the browse UI (P30+).

The injected `loadUserRows` callback keeps `library.ts` DB-free at module load (pure-unit tests pass without sql.js). Production callers wire `loadUserRows = () => listUserTemplates().map(parseAndProject)`.

### Privacy / export rules

User templates are **opt-in user content** — they are NOT stripped from `.heybradley` export bundles (consistent with `chat_messages` and `projects`). This differs from `llm_logs` (ADR-047) which strips because of inferred-secret leakage risk. ADR-046 `SENSITIVE_TABLE_OPS` registry remains unchanged.

### FK to projects: deferred

The `user_templates` table has no FK to `projects`. This is consistent with ADR-040b (P28; sql.js DDL-rebuild cost not justified). Application-layer invariant in `createUserTemplate` validates input before insert. Revisit at backend swap (post-MVP Tauri/Electron) or first observed orphan row.

## Trade-offs accepted

- **Two metadata types** (`TemplateMeta` and `BrowseTemplate`). The browse UI doesn't need runtime functions; the dispatcher doesn't need `source`. Splitting is cheaper than forcing user rows through a runtime-materialization layer that doesn't ship until P31.
- **`payload_json` is opaque to the library.** Sprint D P31+ will define the schema (likely a Zod-validated `Generator` shape with `prompt: string`, `outputSchema`, etc.). Until then, callers persist whatever shape they choose at their own risk. Acceptable while no production caller exists.
- **No template versioning.** Updates overwrite. Acceptable until a user collides with a baseline ID (we'll add a `source: 'override'` then).

## Consequences

- (+) Foundation for Sprint D P31 (CONTENT_ATOM + first generator template) — P31 generator can be either registry-baked (default) or user-authored (via this table)
- (+) Browse UI (deferred to a later mini-phase) plugs in via `listAllForBrowse` with one DB-backed callback
- (+) Migration 003 is the first DB schema addition since P18b (ADR-046) — establishes the "Sprint D adds tables" pattern for future Sprints E-K
- (-) Adds 1 migration + 1 repo + 1 type (~150 LOC); minimal complexity
- (-) `BrowseTemplate` introduces a second metadata projection — surface area grows but each axis is single-purpose

## Cross-references

- ADR-040 (Local persistence; P16) — parent contract
- ADR-040b (P28; sql.js FK deferral) — symmetry for FK decision
- ADR-046 (P18b; SENSITIVE_TABLE_OPS strip rules) — referenced for export-strip decision
- ADR-050 (Template-First Chat; P23) — parent
- ADR-058 (Template Library API; P29) — direct predecessor
- `phase-18/roadmap-sprints-a-to-h.md` Sprint D P29-P33

## Status as of P30 seal

- migration 003-user-templates.sql shipped ✅
- userTemplates repository CRUD shipped ✅
- BrowseTemplate type + listAllForBrowse() API shipped ✅
- ADR-059 full Accepted ✅
- 5+ pure-unit tests covering CRUD round-trip + browse merge + parse helpers ✅
- Build green; tsc clean; backward-compat with P15-P29 ✅
