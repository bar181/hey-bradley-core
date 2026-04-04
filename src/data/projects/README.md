# Projects Data Structure

This directory defines the schema and examples for saved Hey Bradley projects. A "project" wraps a MasterConfig together with generated specs, brand assets, version history, and integration metadata.

## Files

| File | Purpose |
|------|---------|
| `project-schema.json` | JSON Schema (draft 2020-12) defining the saved project shape |
| `example-project.json` | Fully populated example based on the Sweet Spot Bakery config |

## Current Storage: localStorage via projectStore

Today, projects are saved in the browser using `src/store/projectStore.ts`:

- **Project list** is stored under key `hb-project-list` as an array of `ProjectMeta` objects (slug, name, savedAt, sectionCount, theme).
- **Each project config** is stored under `hb-project-{slug}` as a serialized `MasterConfig` JSON blob.
- The store handles save, load, delete, export (file download), and import (file upload with Zod validation).

This approach has no server dependency, works offline, and is sufficient for single-user workflows during Stage 1 (Presentation).

### Limitations

- No cross-device sync.
- No collaboration or sharing.
- localStorage has a ~5 MB limit per origin.
- No generated specs are persisted (they are regenerated on demand).

## Future Storage: Supabase Postgres with RLS

When the platform moves to Stage 2 (Pre-LLM MVP) and beyond, projects will be stored in Supabase:

### Table: `projects`

```sql
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  owner       UUID NOT NULL REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  version     TEXT NOT NULL DEFAULT '1.0.0',
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  config      JSONB NOT NULL,
  specs       JSONB,
  brand       JSONB,
  integrations JSONB,
  UNIQUE (owner, slug)
);

-- Row-Level Security: users can only access their own projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own projects"
  ON projects FOR ALL
  USING (auth.uid() = owner)
  WITH CHECK (auth.uid() = owner);
```

### Table: `project_history`

```sql
CREATE TABLE project_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT now(),
  action      TEXT NOT NULL,
  snapshot    JSONB,
  created_by  UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_history_project ON project_history(project_id, timestamp DESC);
```

## Migration Path: localStorage to Database

The migration will be a gradual, non-breaking transition:

1. **Dual-write phase**: When Supabase is introduced, `projectStore` will write to both localStorage and the database. localStorage remains the source of truth for offline/anonymous users.

2. **Import existing projects**: A one-time migration flow will read all `hb-project-*` keys from localStorage, validate each against `masterConfigSchema`, and upsert them into the `projects` table under the authenticated user's ID.

3. **Database-primary phase**: Once the user is authenticated, the database becomes the source of truth. localStorage is used only as a cache for offline resilience.

4. **Cleanup**: After confirming successful migration, the old localStorage keys can be cleared.

### Code change outline

```typescript
// projectStore.ts — future shape
saveProject: async (name, config) => {
  // 1. Always save to localStorage (offline fallback)
  saveToLocalStorage(slug, config);

  // 2. If authenticated, also save to Supabase
  if (supabase.auth.user()) {
    await supabase.from('projects').upsert({
      slug,
      name,
      owner: supabase.auth.user().id,
      config,
      updated_at: new Date().toISOString(),
    });
  }
}
```

## How Specs Are Stored

Generated specs (North Star, SADD, Build Plan, Features, Human Spec, AISP) are stored as markdown or plain-text strings inside the `specs` object:

```json
{
  "specs": {
    "northStar": "# North Star: My Project\n\n## Vision\n...",
    "sadd": "# SADD\n\n## Architecture\n...",
    "buildPlan": "# Build Plan\n\n## Phase 1\n...",
    "features": "# Features\n\n## F1: ...",
    "humanSpec": "# My Project\n\nA plain-language description...",
    "aisp": "AISP v1.2 | my-project | 1.0.0\n..."
  }
}
```

- Specs are generated on demand by the generators in `src/lib/specGenerators/`.
- In the current localStorage model, specs are not persisted (they are regenerated each time).
- In the database model, specs will be persisted in the `specs` JSONB column so they can be shared, exported, and versioned without regeneration.

## How History and Versioning Will Work

The `history` array provides an append-only audit log:

- **Each entry** records a timestamp, a human-readable action string, and an optional config snapshot.
- **Snapshots are optional** to save space. Full snapshots are stored only for major changes (publish, theme change). Minor edits store just the action.
- **In the database model**, history moves to a separate `project_history` table with proper indexing by project and timestamp.
- **Undo/restore** is supported by loading a previous snapshot from the history and applying it as the current config.
- **Diffing** between versions can be computed by comparing adjacent snapshots.
