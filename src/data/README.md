# Data Architecture

This directory contains all JSON configuration data for Hey Bradley's spec engine.

## Directory Structure

```
src/data/
  themes/             # 10 theme preset files + index.ts registry
    index.ts          # Theme registry (THEME_REGISTRY array + named exports)
    saas.json         # Tech Business (dark, centered, gradient)
    agency.json       # Agency (light, split-right, bold)
    portfolio.json    # Portfolio (dark, overlay, visual)
    startup.json      # Startup (dark, centered, video)
    personal.json     # Personal (light, split-left, friendly)
    professional.json # Professional (light, centered, clean)
    wellness.json     # Wellness (dark, overlay, calm)
    minimalist.json   # Minimalist (light, minimal, clean)
    creative.json     # Creative (dark, centered, video)
    blog.json         # Blog (light, split-right, editorial)
  examples/           # Pre-built example configs (full site + theme + sections)
    index.ts          # Example registry
    blank.json        # Empty starting point
    kitchen-sink.json # All section types enabled
    bakery.json       # Bakery business example
    consulting.json   # Consulting firm example
    fitforge.json     # Fitness app example
    florist.json      # Florist shop example
    launchpad.json    # SaaS launch page example
    photography.json  # Photography portfolio example
  media/              # Media asset catalogs
    images.json       # Curated Unsplash image library
    videos.json       # Background video URLs
    effects.json      # Visual effect presets
    media.json        # Combined media index
  fonts/
    fonts.json        # Font family definitions
  palettes/
    palettes.json     # Standalone palette definitions
  template-config.json  # Superset of all possible keys (empty values = shape)
  default-config.json   # Default starting content for new projects
```

## Three-Level JSON Hierarchy (ADR-012)

Every configuration follows a three-level hierarchy:

```json
{
  "site": { ... },      // Level 1: Global metadata (non-visual)
  "theme": { ... },     // Level 2: Visual defaults for all sections
  "sections": [ ... ]   // Level 3: Ordered section array with components
}
```

### Level 1: `site`

Page title, author, domain, spec version, SEO fields. Changed rarely, usually once during setup.

| Field       | Type   | Default       | Description               |
|-------------|--------|---------------|---------------------------|
| title       | string | ""            | Page title                |
| description | string | ""            | Meta description          |
| author      | string | ""            | Site author               |
| email       | string | ""            | Contact email             |
| domain      | string | ""            | Production domain         |
| project     | string | ""            | Project identifier        |
| version     | string | "1.0.0-RC1"   | Config version            |
| spec        | string | "aisp-1.2"    | AISP spec version         |
| favicon     | string | (optional)    | Favicon URL               |
| ogImage     | string | (optional)    | Open Graph image URL      |

### Level 2: `theme`

Colors, typography, spacing, border radius. When a user picks a "vibe preset," it overwrites this object. All sections inherit theme values unless they provide section-level overrides.

| Field               | Type   | Default   | Description                     |
|---------------------|--------|-----------|---------------------------------|
| preset              | string | ""        | Theme preset identifier         |
| mode                | enum   | "dark"    | "light" or "dark"               |
| palette             | object | (optional)| 6-slot color palette (ADR-019)  |
| alternatePalette    | object | (optional)| Inverted palette for mode toggle|
| alternativePalettes | array  | (optional)| Named palette variants          |
| typography          | object | (defaults)| Font settings                   |
| spacing             | object | (defaults)| Layout spacing                  |
| borderRadius        | string | "12px"    | Global border radius            |

#### Palette (6-slot, ADR-019)

| Slot            | Purpose                          |
|-----------------|----------------------------------|
| bgPrimary       | Main background color            |
| bgSecondary     | Section alternate background     |
| textPrimary     | Headings, body text              |
| textSecondary   | Subtitles, captions              |
| accentPrimary   | Buttons, links, highlights       |
| accentSecondary | Hover states, secondary accents  |

#### Typography

| Field         | Default        | Description              |
|---------------|----------------|--------------------------|
| fontFamily    | "Inter"        | Body font family         |
| headingFamily | "Inter"        | Heading font family      |
| headingWeight | 700            | Heading font weight      |
| baseSize      | "16px"         | Base font size           |
| lineHeight    | 1.7            | Base line height         |

#### Spacing

| Field             | Default  | Description              |
|-------------------|----------|--------------------------|
| sectionPadding    | "64px"   | Vertical section padding |
| containerMaxWidth | "1280px" | Max content width        |
| componentGap      | "24px"   | Gap between components   |

### Level 3: `sections[]`

Each section is self-contained with `layout`, `style`, and `components[]`. Section-level `style` overrides theme defaults via deepMerge.

| Field      | Type    | Required | Description                              |
|------------|---------|----------|------------------------------------------|
| type       | enum    | yes      | Section type (hero, menu, columns, etc.) |
| id         | string  | yes      | Unique section identifier                |
| enabled    | boolean | yes      | Visibility toggle                        |
| order      | number  | no       | Render sequence                          |
| variant    | string  | no       | Visual variant (centered, split-right)   |
| layout     | object  | yes      | Flex/grid layout properties              |
| style      | object  | yes      | Section-level style overrides            |
| content    | object  | no       | Legacy content (deprecated Phase 2+)     |
| components | array   | yes      | Component array (ADR-016)                |

#### Section Types

`hero`, `menu`, `columns`, `pricing`, `action`, `footer`, `quotes`, `questions`, `numbers`, `gallery`, `logos`, `team`, `image`, `divider`, `text`

#### Component Schema

| Field   | Type    | Default | Description                    |
|---------|---------|---------|--------------------------------|
| id      | string  | (req)   | Stable ID within the section   |
| type    | string  | (req)   | Component type                 |
| enabled | boolean | true    | Visibility toggle              |
| order   | number  | 0       | Render sequence within section |
| props   | object  | {}      | Type-specific key-value pairs  |

## Theme JSON Schema Reference

Theme files live in `src/data/themes/` and follow this structure:

```json
{
  "meta": {
    "name": "Theme Display Name",
    "slug": "theme-slug",
    "description": "One-line description of who this theme is for",
    "tags": ["dark", "centered", "gradient", "technical"],
    "mood": "Short mood descriptor",
    "heroVariant": "centered"
  },
  "theme": {
    "preset": "theme-slug",
    "mode": "dark",
    "palette": {
      "bgPrimary": "#0a0a1a",
      "bgSecondary": "#12122a",
      "textPrimary": "#f8fafc",
      "textSecondary": "#94a3b8",
      "accentPrimary": "#6366f1",
      "accentSecondary": "#818cf8"
    },
    "alternativePalettes": [
      { "name": "Variant Name", "bgPrimary": "...", "..." : "..." }
    ],
    "alternatePalette": { "bgPrimary": "...", "..." : "..." },
    "typography": {
      "fontFamily": "Inter",
      "headingFamily": "Inter",
      "headingWeight": 700,
      "baseSize": "16px",
      "lineHeight": 1.7
    },
    "spacing": {
      "sectionPadding": "80px",
      "containerMaxWidth": "1200px",
      "componentGap": "24px"
    },
    "borderRadius": "12px"
  },
  "sections": [
    { "type": "hero", "id": "hero-01", "enabled": true, "..." : "..." },
    { "type": "columns", "id": "features-01", "..." : "..." },
    { "type": "pricing", "id": "pricing-01", "..." : "..." },
    { "type": "action", "id": "cta-01", "..." : "..." },
    { "type": "quotes", "id": "testimonials-01", "..." : "..." },
    { "type": "questions", "id": "faq-01", "..." : "..." },
    { "type": "numbers", "id": "value-props-01", "..." : "..." },
    { "type": "footer", "id": "footer-01", "..." : "..." }
  ]
}
```

### Required Meta Fields

| Field       | Type     | Description                               |
|-------------|----------|-------------------------------------------|
| name        | string   | Display name shown in theme picker        |
| slug        | string   | URL-safe identifier, matches preset       |
| description | string   | Target audience / use case                |
| tags        | string[] | 4 descriptive tags for filtering          |
| mood        | string   | Short emotional descriptor                |
| heroVariant | string   | Default hero variant for this theme       |

### Standard Section Set

Every theme includes at least 8 sections. The hero section is always enabled; other sections default to `enabled: false` and are toggled on by the user or AI.

| Order | Type      | ID                | Purpose             |
|-------|-----------|-------------------|----------------------|
| 0     | hero      | hero-01           | Above-the-fold hero  |
| 1     | columns   | features-01       | Feature grid         |
| 2     | pricing   | pricing-01        | Pricing tiers        |
| 3     | action    | cta-01            | Call to action       |
| 4     | quotes    | testimonials-01   | Testimonials         |
| 5     | questions | faq-01            | FAQ accordion        |
| 6     | numbers   | value-props-01    | Stats / metrics      |
| 7     | footer    | footer-01         | Footer columns       |

Note: The `saas` theme additionally includes a `menu` section (navbar-01) at order -1.

## How to Add a New Theme

1. Create `src/data/themes/{slug}.json` following the schema above
2. Include all required `meta` fields (name, slug, description, tags, mood, heroVariant)
3. Define the `theme` block with palette (6 colors), typography, spacing, borderRadius
4. Include at least the 8 standard sections with theme-appropriate colors in `style`
5. Add 4 `alternativePalettes` for palette switching
6. Add an `alternatePalette` for light/dark mode toggle
7. Import and register the theme in `src/data/themes/index.ts`:
   ```typescript
   import myTheme from './my-theme.json'
   // Add to THEME_REGISTRY array and export
   ```
8. Run `npx tsc -b` to verify no type errors

## How to Add a New Example

1. Create `src/data/examples/{slug}.json` as a full MasterConfig:
   ```json
   {
     "site": { "title": "...", "description": "...", ... },
     "theme": { "preset": "saas", "mode": "dark", ... },
     "sections": [ ... ]
   }
   ```
2. Import and register in `src/data/examples/index.ts`
3. Examples should reference an existing theme preset in `theme.preset`
4. Enable specific sections relevant to the example's use case
5. Customize component `props` with realistic content for the scenario

## Decision Tree: Where Does a Setting Live?

| What changed?                  | Target                                    |
|-------------------------------|-------------------------------------------|
| Page title, author, SEO       | `site.{key}`                              |
| All sections darker           | `theme.palette.bgPrimary`                 |
| Font family for everything    | `theme.typography.fontFamily`             |
| One section's background      | `sections[i].style.background`            |
| One section's padding         | `sections[i].layout.padding`              |
| One button's text             | `sections[i].components[j].props.text`    |
| Hide a component              | `sections[i].components[j].enabled = false` |

## Template vs Default

- **`template-config.json`** -- ALL possible keys. The superset. Values are empty strings. Shows shape, not content.
- **`default-config.json`** -- Hey Bradley's starting content. A strict subset of template.

Rule: `template keys >= default keys`. Every key in default MUST exist in template.

## Schema Source Files

- `src/lib/schemas/masterConfig.ts` -- Site, Theme, MasterConfig schemas
- `src/lib/schemas/section.ts` -- Section, Component, SectionType schemas
- `src/lib/schemas/layout.ts` -- Layout schema
- `src/lib/schemas/style.ts` -- Style schema

## Backward Compatibility

During Phase 1, sections support both `content` (legacy flat object) and `components[]` (new). The `componentsToHeroContent()` helper in `src/lib/schemas/section.ts` derives the legacy `HeroContent` shape from `components[]` so existing renderers keep working. Phase 2+ will deprecate `content` entirely.
