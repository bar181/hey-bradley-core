# JSON Configuration Structure

## Three-Level Hierarchy

Hey Bradley uses a three-level JSON hierarchy (ADR-012):

```
{
  "site": { ... },      // Level 1: Global metadata (non-visual)
  "theme": { ... },     // Level 2: Visual defaults for all sections
  "sections": [ ... ]   // Level 3: Ordered section array with components
}
```

### Level 1: `site`

Page title, author, domain, spec version, SEO fields. Changed rarely, usually once during setup.

### Level 2: `theme`

Colors, typography, spacing, border radius. When a user picks a "vibe preset," it overwrites this object. All sections inherit theme values unless they provide section-level overrides.

### Level 3: `sections[]`

Each section is self-contained with `layout`, `style`, and `components[]`. Section-level `style` overrides theme defaults via deepMerge.

Each section contains a `components[]` array (ADR-016). Each component has:

- `id` -- Stable identifier within the section
- `type` -- Component type (badge, heading, text, button, image, trust, feature-card)
- `enabled` -- Visibility toggle (false = hidden but preserved)
- `order` -- Render sequence within the section
- `props` -- Type-specific key-value pairs

## Decision Tree: Where Does a Setting Live?

| What changed? | Target |
|---|---|
| Page title, author, version, SEO | `site.{key}` |
| All sections should be darker | `theme.colors.background` |
| Font family for everything | `theme.typography.fontFamily` |
| One section's background | `sections[i].style.background` |
| One section's padding | `sections[i].layout.padding` |
| One button's text | `sections[i].components[j].props.text` |
| Hide a component | `sections[i].components[j].enabled = false` |

## Adding a New Section Type

1. Add the type name to `sectionTypeSchema` in `src/lib/schemas/section.ts`
2. Add a stub section to `src/data/template-config.json` with all possible components
3. Add a populated section to `src/data/default-config.json` if it should appear on first load
4. Create a renderer component in `src/templates/{type}/`

## Template vs Default

- **`template-config.json`** -- ALL possible keys. The superset. Values are empty strings. Shows shape, not content.
- **`default-config.json`** -- Hey Bradley's starting content. A strict subset of template.

Rule: `template keys >= default keys`. Every key in default MUST exist in template.

## Backward Compatibility

During Phase 1, sections support both `content` (legacy flat object) and `components[]` (new). The `componentsToHeroContent()` helper in `src/lib/schemas/section.ts` derives the legacy `HeroContent` shape from `components[]` so existing renderers keep working. Phase 2+ will deprecate `content` entirely.
