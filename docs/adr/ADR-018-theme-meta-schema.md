# ADR-018: Theme as Full JSON Template Replacement (with Meta Block)

**Date:** 2026-03-29 | **Status:** ACCEPTED

## Context

Previous theme implementations only swapped CSS variables (colors), producing 10 identical-looking websites with different colors. ADR-012 established the three-level hierarchy (site → theme → sections), and ADR-016 added component-level configuration. But without a formal meta block, theme display metadata (name, description, tags, mood, hero variant) was hardcoded in ThemeSimple.tsx separately from the theme JSON files, creating a maintenance burden and drift risk.

A theme is a complete website personality — layout, components, imagery, typography, spacing, mood — expressed as a JSON template. The `applyTheme()` function must replace the entire project JSON (theme + sections) while preserving only user-entered copy (text and URLs).

## Decision

### 1. Each theme JSON includes a `meta` block:

```json
{
  "meta": {
    "name": "SaaS",
    "slug": "saas",
    "description": "For software products, developer tools, and tech platforms",
    "tags": ["dark", "centered", "gradient", "technical"],
    "mood": "Premium and technical",
    "heroVariant": "centered"
  },
  "theme": { ... },
  "sections": [ ... ]
}
```

### 2. `applyTheme()` replaces everything except copy:

**Replaced:** theme object (palette, typography, spacing, borderRadius), sections array (layout, components, enabled flags, style, variant)

**Preserved:** site object, text props from components, url props from components

### 3. Theme card UI derives display data from meta block:

ThemeSimple.tsx reads `meta.name`, `meta.tags`, `meta.mood`, `meta.heroVariant`, and `theme.palette` directly from the imported theme JSON — no hardcoded display arrays.

## Consequences

**Positive:**
- Single source of truth: theme JSON IS the complete specification
- Theme cards automatically update when theme JSON changes
- No drift between display metadata and actual theme content
- Enables future features: theme marketplace, user-created themes, LLM-generated themes
- `heroVariant` in meta enables accurate theme card previews

**Negative:**
- Theme JSON files are larger (meta block adds ~6 lines)
- All 10 theme JSONs must include meta block (migration cost)

**Supersedes:** The hardcoded `themes: ThemeData[]` array in ThemeSimple.tsx.
