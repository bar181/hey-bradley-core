# Stage 2: DDD Bounded Context Map

**Date:** 2026-04-04
**Stage:** Pre-LLM MVP (Stage 2)
**Reference:** ADR-029, Master Backlog S2-01 through S2-11

---

## Bounded Contexts

### 1. Upload Context

**Responsibility:** Image upload, drag-and-drop handling, base64 encoding, file validation.

**Key Components:**
- `ImageUploader` -- drag-and-drop + file picker component
- `fileValidator` -- checks file type (png, jpg, webp, svg), enforces 2 MB limit
- `base64Encoder` -- converts File to base64 data URI via FileReader

**Domain Rules:**
- Accepted formats: PNG, JPG, WEBP, SVG
- Max file size: 2 MB per image
- Output: base64 data URI string (or error message)

**Store:** Writes to `configStore` (section images) or `siteStore` (brand images) depending on target.

---

### 2. Brand Context

**Responsibility:** Logo, favicon, og:image management. Brand identity assets that are distinct from theme styling.

**Key Components:**
- `BrandSection` -- right-panel UI for managing brand assets
- `siteStore.brand` -- stores logo URL, favicon URL, og:image URL

**Domain Rules:**
- Logo URL: displayed in Navbar, included in all spec exports
- Favicon URL: included in spec export HTML head
- og:image URL: used for social sharing metadata
- Each field accepts URL strings or base64 data URIs

**Aggregates:**
- `BrandIdentity` { logoUrl, faviconUrl, ogImageUrl }

---

### 3. Theme Context (Extended)

**Responsibility:** Custom hex colors, palette override, theme locking. Extends existing theme system from Stage 1.

**Key Components:**
- `CustomColorInput` -- hex input with validation and swatch preview
- `configStore.theme.colors` -- primary, accent, background, text palette slots
- Theme locking (already implemented in Phase 7)

**Domain Rules:**
- Hex validation: must match `#[0-9A-Fa-f]{6}`
- Custom colors override the selected theme's defaults
- When theme is locked, custom color inputs are disabled
- Changing theme resets custom colors (with confirmation dialog)

**Aggregates:**
- `ThemePalette` { primary, accent, background, text, ...slots }

---

### 4. Project Context (New)

**Responsibility:** Named projects, save/load lifecycle, localStorage persistence, JSON export/import.

**Key Components:**
- `projectStore` -- new Zustand store for project list and active project
- `ProjectSaveLoad` -- right-panel UI for save/load/export/import
- `projectSerializer` -- serializes configStore + siteStore to JSON
- `projectValidator` -- Zod schema validation on import

**Domain Rules:**
- Project names must be unique (slug-based keys)
- Save serializes full application state (config + site + theme)
- Load hydrates all stores from saved JSON
- Export produces a downloadable `.json` file
- Import validates with Zod before hydrating (rejects invalid files)
- localStorage key format: `hb-project-{slug}`

**Aggregates:**
- `Project` { name, slug, createdAt, updatedAt, data: ProjectData }
- `ProjectData` { config, site, theme }

---

### 5. Spec Context (Extended)

**Responsibility:** Spec generators (6 types, already built), spec export, spec validation. Extended with SEO fields integration.

**Key Components:**
- `src/lib/specGenerators/` -- 6 pure-function generators (already built)
- `XAIDocsTab` -- 6 sub-tabs for viewing generated specs
- `siteStore.seo` -- title, description, og:image for spec output

**Domain Rules:**
- Generators are pure functions: (projectData) => specDocument
- SEO fields are injected into Implementation Plan and AISP specs
- Spec export includes all SEO metadata for deployable HTML output
- AISP validation targets Platinum tier (95+/100)

**Aggregates:**
- `SpecDocument` { type, content, generatedAt }
- `SeoConfig` { siteTitle, siteDescription, ogImageUrl }

---

### 6. Section Context (Extended)

**Responsibility:** Section variant completeness, pricing variants, type casting fixes.

**Key Components:**
- All section template components in `src/templates/`
- Section content type definitions
- Variant rendering logic per section type

**Domain Rules:**
- Each section type must render all 8 declared variants
- Pricing section adds monthly/annual toggle and comparison table variants
- All `(section.content as any)` casts (62+ instances) replaced with proper typed interfaces
- Content type discriminated unions per section type

**Aggregates:**
- `Section` { type, variant, content: TypedContent }
- `PricingContent` { plans, billingToggle, comparisonRows }

---

## Context Interactions

```
+------------------+       writes to        +------------------+
|  Upload Context  | ---------------------> |  Brand Context   |
|  (file handling) |                        |  (logo/favicon)  |
+------------------+                        +------------------+
        |                                          |
        | writes to                                | reads brand assets
        v                                          v
+------------------+                        +------------------+
| Section Context  |                        |  Spec Context    |
| (section images) | ---------------------> | (spec generators)|
+------------------+   content feeds into   +------------------+
        ^                                          ^
        |                                          |
        | variant styling                          | SEO fields
        |                                          |
+------------------+                        +------------------+
|  Theme Context   |                        |  Project Context |
| (colors/palette) | ---------------------> | (save/load/JSON) |
+------------------+   serialized into      +------------------+
```

### Interaction Details

| From | To | Interaction | Type |
|------|----|-------------|------|
| Upload | Brand | Uploaded image becomes logo/favicon/og:image | Command |
| Upload | Section | Uploaded image assigned to section slot | Command |
| Brand | Spec | Logo/favicon/og:image included in spec output | Query |
| Theme | Section | Palette colors applied to section rendering | Query |
| Theme | Project | Theme state serialized into project save | Query |
| Section | Spec | Section content feeds spec generators | Query |
| Section | Project | Section state serialized into project save | Query |
| Spec | Project | SEO fields read from project/site store | Query |
| Project | All | Load action hydrates all other contexts | Command |

### Anti-Corruption Layers

- **Upload -> Brand/Section:** File validation happens entirely in Upload Context before passing data to Brand or Section. Invalid files never reach other contexts.
- **Project -> All:** Zod validation on project import acts as an anti-corruption layer. Malformed JSON is rejected before it can corrupt store state.
- **Theme -> Section:** Theme locking prevents Section from receiving color changes when the theme is locked.

---

## Notes

- All contexts are implemented as client-side modules (no backend services)
- Communication is synchronous via Zustand store reads/writes
- No event bus needed at this stage -- direct store access is sufficient
- Stage 3 will introduce an API Context that mediates between LLM responses and existing contexts
