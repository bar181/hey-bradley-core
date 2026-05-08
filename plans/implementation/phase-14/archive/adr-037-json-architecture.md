# ADR-037: JSON Architecture — Design/Content/Project Separation

**Status:** PROPOSED (planning only — implementation deferred)  
**Date:** 2026-04-06  
**Context:** The current MasterConfig schema merges design tokens, content copy, layout configuration, and site metadata into a single flat JSON structure. This works for pre-LLM phases but creates ambiguity when an LLM or chat command needs to distinguish "change the content" from "change the design." Separating these concerns now (as a plan) ensures the architecture is ready when LLM integration (Phase 23+) demands it.

## Current Architecture

### MasterConfig (single JSON object)

The schema in `src/lib/schemas/masterConfig.ts` defines a three-level hierarchy that is **conceptually layered but physically flat**:

```
masterConfigSchema = {
  site:     { title, description, author, email, domain, project, purpose, audience, tone, brandName, tagline, voiceAttributes, ... }
  theme:    { preset, mode, palette, alternatePalette, alternativePalettes, typography, spacing, borderRadius }
  sections: Section[]
  pages?:   Page[]
}
```

Each `Section` (defined in `src/lib/schemas/section.ts`) bundles together:

| Concern | Fields | Example |
|---------|--------|---------|
| **Structure** | `type`, `id`, `enabled`, `order`, `variant` | `type: "hero"`, `variant: "centered"` |
| **Layout** | `layout: { display, direction, align, gap, padding, columns, maxWidth }` | `display: "grid"`, `columns: 3` |
| **Style (design)** | `style: { background, color, fontFamily, borderRadius, imageEffect }` | `background: "#0a0a1a"` |
| **Content (copy)** | `content: Record<string, unknown>` | `{ heading: "Simple Pricing", subheading: "..." }` |
| **Components** | `components: Component[]` where each component has `props` mixing content + style | `props: { text: "Ship AI Products 10x Faster", size: "56px", weight: 700 }` |

### The mixing problem

Within `components[].props`, design and content are interleaved:

```json
{
  "id": "headline",
  "type": "heading",
  "props": {
    "text": "Ship AI Products 10x Faster",   // <-- CONTENT
    "level": 1,                                // <-- STRUCTURE
    "size": "56px",                            // <-- DESIGN
    "weight": 700                              // <-- DESIGN
  }
}
```

A chat command like "make the headline bolder" should touch `weight` only, while "change the headline" should touch `text` only. Today, both live in the same `props` bag with no metadata distinguishing them.

### Theme files are also mixed

Theme JSON files (e.g., `src/data/themes/saas.json`) contain:
- **Meta** (name, slug, tags, mood, chatMappings) — theme identity
- **Theme design** (palette, typography, spacing) — visual defaults
- **Section defaults** (full section array with content + layout + style) — starter content baked into the theme

When a user switches themes, the entire sections array (including all content) gets replaced, losing any content customizations.

### Example files duplicate everything

Example JSON files (e.g., `src/data/examples/launchpad.json`) are complete MasterConfig snapshots. They duplicate theme design tokens inline and embed all content. There is no inheritance or diff layer.

## Proposed Architecture (3-Layer)

### Layer 1: Master Design Template (per theme)

Owns all visual defaults. Read-only from the user's perspective.

```typescript
interface DesignTemplate {
  themeId: string
  mode: 'light' | 'dark'
  palette: Palette
  alternativePalettes: AlternativePalette[]
  typography: ThemeTypography
  spacing: ThemeSpacing
  borderRadius: string
  // Section-type-level design defaults
  sectionStyles: Record<SectionType, {
    variants: Record<string, {
      background: string
      color: string
      fontFamily?: string
      imageEffect?: ImageEffect
    }>
    componentStyles: Record<string, {
      size?: string
      weight?: number
      style?: string
    }>
  }>
}
```

- One file per theme (12 files)
- Contains zero content text
- Versioned independently so theme updates don't touch user content

### Layer 2: Master Content Template (per example/purpose)

Owns all default copy, organized by section type.

```typescript
interface ContentTemplate {
  templateId: string
  purpose: SitePurpose
  audience: SiteAudience
  tone: SiteTone
  site: { title: string; description: string; tagline: string; brandName: string }
  // Section-type-level content defaults
  sectionContent: Record<SectionType, {
    variants: Record<string, {
      heading?: string
      subheading?: string
      components: Record<string, {
        text?: string
        // other content-only props
      }>
    }>
  }>
}
```

- One file per example (10 files)
- Contains zero design tokens
- Reusable across themes (e.g., "launchpad" content + "neon" design)

### Layer 3: Project JSON (per user project)

Stores only what the user changed, as diffs from the templates.

```typescript
interface ProjectConfig {
  projectId: string
  designTemplateRef: string   // e.g., "saas"
  contentTemplateRef: string  // e.g., "launchpad"
  // Overrides only — anything not here inherits from templates
  siteOverrides?: Partial<Site>
  designOverrides?: Partial<DesignTemplate>
  contentOverrides?: {
    [sectionId: string]: {
      style?: Partial<Style>       // design overrides for this section
      content?: Record<string, unknown>  // content overrides
      componentOverrides?: {
        [componentId: string]: {
          designProps?: Record<string, unknown>
          contentProps?: Record<string, unknown>
        }
      }
    }
  }
  // Structural changes
  sectionOrder?: string[]
  sectionsEnabled?: Record<string, boolean>
  addedSections?: Section[]
}
```

- Compact: only stores diffs
- Theme switching preserves all content overrides (just change `designTemplateRef`)
- LLM can target `contentOverrides` or `designOverrides` independently

### Resolution algorithm

```
resolved = merge(
  designTemplate[designTemplateRef],
  contentTemplate[contentTemplateRef],
  projectConfig.overrides
)
```

Priority: project overrides > content template > design template > schema defaults.

## Impact Assessment

### Files that would change

| File | Change type | Complexity |
|------|------------|------------|
| `src/lib/schemas/masterConfig.ts` | Major rewrite — new schema types | High |
| `src/lib/schemas/section.ts` | Split `props` into design vs content | Medium |
| `src/lib/schemas/style.ts` | Extend for section-type defaults | Low |
| `src/store/configStore.ts` | New merge/resolution logic | High |
| `src/store/projectStore.ts` | Diff-based persistence | High |
| `src/data/themes/*.json` (12 files) | Extract content, keep design only | Medium |
| `src/data/examples/*.json` (10 files) | Convert to content templates | Medium |
| `src/lib/demoSimulator.ts` | Update to target content vs design | Medium |
| `src/lib/exportProject.ts` | Resolve before export | Low |
| `src/lib/specGenerators/*.ts` (6 files) | Read from resolved config | Low |
| All section renderers | Read from resolved props | Medium |

### Effort Estimate

- **Planning + schema design:** 1-2 sessions
- **Core merge engine + new schemas:** 2-3 sessions
- **Theme/example JSON migration:** 1-2 sessions
- **Renderer updates:** 2-3 sessions
- **Testing + regression:** 1-2 sessions
- **Total:** ~8-12 sessions (Phase 19+ scope)

### Migration Path

1. **Phase A — Annotate:** Add `_category: "design" | "content" | "structure"` metadata to component prop schemas (non-breaking, informational only)
2. **Phase B — Dual-read:** Build the merge engine that can resolve from 3 layers but also accept the current flat format. Feature-flagged.
3. **Phase C — Split files:** Convert theme JSONs to design-only, create content template JSONs from examples. The merge engine makes both formats produce identical output.
4. **Phase D — Cutover:** Remove legacy flat-format support. Project store writes diffs only.
5. **Phase E — LLM integration:** Chat commands use layer metadata to route "change content" vs "change design" to the correct override layer.

Each phase is independently deployable with zero user-facing regression.

## Decision

Defer implementation to Phase 19+ (system-wide review) or later. The current flat structure works for the pre-LLM phases. The separation becomes critical when:

1. **LLM needs to "change the content" without touching design** — today the system has no metadata to distinguish content fields from design fields in `component.props`
2. **Theme switching needs to preserve user's content changes** — today switching themes replaces the entire sections array, including all user-authored copy
3. **Multiple users share templates but customize individually** — today each project is a full snapshot with no inheritance

## Consequences

- **Now:** No code changes. This ADR documents the plan and provides a reference for future implementers.
- **Phase 19+:** Cleaner separation enables better LLM integration, theme switching without content loss, and smaller project files (diffs only).
- **Risk:** The migration touches 15+ files and all 22 theme/example JSONs. The dual-read phase (B) mitigates this by ensuring backward compatibility throughout.
- **Benefit:** Once complete, chat commands can be routed to the correct layer with zero ambiguity, and theme/content can evolve independently.
