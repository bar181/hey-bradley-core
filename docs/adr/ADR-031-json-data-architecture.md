# ADR-031: JSON Data Architecture — Standardized Schema with Metadata

**Status:** Proposed
**Date:** 2026-04-04
**Deciders:** Bradley Ross
**Supersedes:** Extends ADR-010 (JSON Single Source of Truth), ADR-012 (Three-Level JSON Hierarchy)

---

## Context

Hey Bradley stores all configuration data in JSON files across five directories:

- `src/data/themes/` — 10 theme presets (agency, blog, creative, minimalist, personal, portfolio, professional, saas, startup, wellness)
- `src/data/examples/` — 7 example configs (bakery, blank, consulting, fitforge, florist, kitchen-sink, launchpad, photography)
- `src/data/palettes/` — 1 palettes file containing all palette definitions
- `src/data/media/` — 4 media files (effects, images, media, videos)
- `src/data/fonts/` — 1 fonts file

Plus two root data files: `default-config.json` and `template-config.json`.

These 26+ JSON files have grown organically across Phases 1-9 with the following problems:

1. **No metadata.** No file records its schema version, author, creation date, or last-modified date. When a schema changes, there is no way to identify which files are stale.
2. **Inconsistent structure.** Theme files use different key patterns than example files. Some use `camelCase`, others use `kebab-case` for the same concept. Palette keys differ between the palettes file (`bgPrimary`) and inline theme references.
3. **No validation at load time.** Files are imported as raw JSON with `as` type assertions or no validation at all. Malformed JSON silently produces undefined behavior.
4. **No index files.** Each consumer must know the exact file path. Adding a new theme or example requires updating import statements in multiple places.
5. **Duplicate data.** Some example configs embed full theme objects instead of referencing a theme by preset name, causing drift when the theme definition changes.

For Phase 10 (JSON Optimization), every JSON file must be standardized, validated, and indexed so that the AISP generators can reliably enumerate and reference all available data.

---

## Decision

### 1. Universal JSON Metadata Header

Every JSON data file in `src/data/` must include a `_meta` top-level key:

```json
{
  "_meta": {
    "schema": "hb-theme-v1",
    "version": "1.0.0",
    "author": "Hey Bradley",
    "created": "2026-04-04",
    "modified": "2026-04-04"
  },
  ...
}
```

The `schema` field is a namespaced identifier (`hb-{type}-v{major}`) that maps to a Zod schema. The `version` field follows semver for the data content (not the schema). The `created` and `modified` fields are ISO 8601 date strings.

### 2. Zod Schema Validation at Load Time

A new `src/lib/schemas/dataSchemas.ts` module defines Zod schemas for each JSON data type:

```typescript
const MetaSchema = z.object({
  schema: z.string().regex(/^hb-\w+-v\d+$/),
  version: z.string(),
  author: z.string(),
  created: z.string().date(),
  modified: z.string().date(),
})

const ThemeDataSchema = z.object({
  _meta: MetaSchema.extend({ schema: z.literal('hb-theme-v1') }),
  name: z.string(),
  preset: z.string(),
  palette: PaletteSchema,
  typography: TypographySchema,
  spacing: SpacingSchema,
})

const ExampleDataSchema = z.object({
  _meta: MetaSchema.extend({ schema: z.literal('hb-example-v1') }),
  ...MasterConfigSchema.shape,
})
```

All JSON imports pass through a `loadAndValidate<T>(path, schema)` function that throws a descriptive error on validation failure rather than silently producing garbage.

### 3. Consistent Naming Convention

- **File names:** `kebab-case.json` (already followed, no change needed)
- **JSON keys:** `camelCase` exclusively. No `snake_case`, no `kebab-case` keys inside JSON.
- **Palette keys:** Standardize on the existing `bgPrimary`, `bgSecondary`, `textPrimary`, `textSecondary`, `accentPrimary`, `accentSecondary` pattern from the Zod PaletteSchema.
- **Section types:** Lowercase with hyphens in display names, but `camelCase` in JSON keys.

### 4. Index Manifests

Each data subdirectory gets an `index.ts` barrel file that:
- Imports all JSON files in the directory
- Validates each against its schema
- Exports a typed record keyed by identifier (e.g., `themes['agency']`)
- Exports a typed array for enumeration (e.g., `allThemes`)

This eliminates scattered direct imports and provides a single place to register new data files.

### 5. Reference-by-Name for Theme Data in Examples

Example configs must not embed full theme objects. Instead, they reference a theme by its `preset` string:

```json
{
  "theme": {
    "preset": "agency",
    "mode": "light"
  }
}
```

The theme resolution happens at load time by looking up the preset in the theme index. This eliminates data duplication and drift.

---

## Consequences

### Positive

- **Single source of truth** — every data file is validated against a versioned Zod schema at import time
- **Discoverability** — index manifests make it trivial to enumerate all themes, examples, palettes, and media
- **AISP readiness** — the AISP generators can enumerate all data files programmatically via the index, producing accurate type definitions in the Sigma block
- **Migration safety** — the `_meta.schema` field enables automated migration scripts when schemas evolve
- **No silent failures** — Zod validation surfaces malformed data immediately during development instead of at runtime in production

### Negative

- **Migration effort** — all 26+ JSON files must be updated to include `_meta` headers and conform to consistent key casing
- **Larger file size** — the `_meta` header adds approximately 150 bytes per file (negligible in practice)
- **Breaking imports** — existing direct imports of JSON files must be updated to use the index barrel files

### Risks

- Example configs that embed full theme objects may have intentional overrides that differ from the referenced theme. The migration must audit each example to separate "theme reference" from "theme override" fields. Overrides are preserved in a `themeOverrides` key.

---

## References

- ADR-010: JSON Single Source of Truth
- ADR-012: Three-Level JSON Hierarchy
- ADR-018: Theme Meta Schema
- Existing schemas: `src/lib/schemas/` (palette, typography, section, masterConfig)
- Data directory: `src/data/`
