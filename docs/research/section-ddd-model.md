# Domain-Driven Design: Section Builder

> Bounded Context for the Hey Bradley section system redesign.
> Date: 2026-04-02

---

## Ubiquitous Language

| Term | Scope | Definition |
|------|-------|------------|
| **Block** | User-facing | A configurable content section on a marketing page. What users see and manipulate. |
| **Section** | Code-level | Internal representation of a block. The primary aggregate in the config store. |
| **Variant** | Both | A visual style/layout option within a section type (e.g., "centered", "split-right", "overlay"). |
| **Column Count** | Both | Independent layout control for multi-column sections (2/3/4). Applies only to certain section types. |
| **Component** | Code-level | An individual element within a section (headline, button, image, etc.). Represented as a value object with `id`, `type`, `enabled`, `order`, and `props`. |
| **Theme** | Both | A preset color palette, font, typography, and full section configuration. Themes provide the template for all sections. |
| **Editor** | Code-level | The right panel SIMPLE tab that configures a selected section. Each section type has its own editor component. |
| **Vibe** | User-facing | Synonym for theme as applied via `applyVibe()`. Full replacement of config from a theme template. |
| **Palette** | Both | A 6-slot color scheme (bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary). |
| **Master Config** | Code-level | The three-level hierarchy (site + theme + sections) that represents the entire page state. |

---

## Aggregates

### Section Aggregate

The Section is the primary aggregate. It owns its components and is managed through the `configStore`.

```
Section {
  id: string                          // auto-generated, hidden from UI (e.g., "hero-a1b2c3d4")
  type: SectionType                   // hero | navbar | features | pricing | cta | footer | testimonials | faq | value_props
  variant: string                     // one of the valid variants per type (see Section Type Registry)
  enabled: boolean                    // show/hide toggle
  order: number                       // implicit via array index in config.sections[]
  layout: Layout {                    // display, gap, padding, heroLayout, etc.
    display: string
    gap: string
    padding: string
  }
  style: Style {                      // per-section visual overrides
    background: string
    color: string
    fontFamily?: string
  }
  content: Record<string, unknown>    // legacy content (Phase 1 backward compatibility)
  components: Component[]             // new component-based structure (ADR-016)
}
```

### Component Value Object

Components are value objects owned by their parent Section aggregate. They are never referenced independently outside their section.

```
Component {
  id: string                          // semantic identifier (e.g., "headline", "primaryCta", "f1")
  type: string                        // heading, button, image, icon, text, badge, video, link, tier, question, etc.
  enabled: boolean                    // toggle visibility without removing
  order: number                       // position within the section
  props: Record<string, unknown>      // type-specific properties (text, url, alt, icon, items, etc.)
}
```

### Master Config (Root Entity)

```
MasterConfig {
  site: Site                          // global metadata (title, description, author, spec version)
  theme: Theme                        // visual defaults (palette, typography, spacing, mode)
  sections: Section[]                 // ordered array of section aggregates
}
```

---

## Domain Events

| Event | Payload | Triggered By |
|-------|---------|-------------|
| `SectionAdded` | `{ type: SectionType, variant: string, afterIndex?: number }` | `addSection()` in configStore |
| `SectionRemoved` | `{ sectionId: string }` | `removeSection()` in configStore |
| `SectionReordered` | `{ newOrder: string[] }` | `reorderSections()` in configStore |
| `SectionDuplicated` | `{ sourceSectionId: string, newSectionId: string }` | `duplicateSection()` in configStore |
| `SectionToggled` | `{ sectionId: string, enabled: boolean }` | `toggleSectionEnabled()` in configStore |
| `VariantChanged` | `{ sectionId: string, variant: string }` | `setSectionConfig()` with variant patch |
| `ColumnsChanged` | `{ sectionId: string, columns: 2 \| 3 \| 4 }` | `setSectionConfig()` with layout patch |
| `ComponentToggled` | `{ sectionId: string, componentId: string, enabled: boolean }` | `setComponentEnabled()` helper |
| `ComponentEdited` | `{ sectionId: string, componentId: string, props: Record<string, unknown> }` | `updateComponentProps()` helper |
| `ImageSelected` | `{ sectionId: string, componentId: string, url: string }` | ImagePicker onChange callback |
| `ThemeApplied` | `{ themeName: string }` | `applyVibe()` in configStore |
| `PaletteApplied` | `{ paletteIndex: number }` | `applyPalette()` in configStore |
| `ModeToggled` | `{ newMode: 'light' \| 'dark' }` | `toggleMode()` in configStore |

> Note: Currently these are implicit (Zustand state mutations with undo history). The redesign could make them explicit event-sourced operations.

---

## Invariants

1. **Minimum section count** -- A page must have at least one section. The `removeSection()` method should enforce this.
2. **Column count applicability** -- Column count only applies to section types that render multi-column layouts: `features`, `pricing`, `testimonials`, `value_props`. Other types ignore column configuration.
3. **Variant validity** -- A variant must be one of the valid variants for the section type (see Section Type Registry below). Invalid variants fall through to the default renderer.
4. **Section duplicability** -- Each section type can appear multiple times on a page. There is no uniqueness constraint on section types.
5. **Deterministic order** -- Section order is determined by array index in `config.sections[]`. The `order` field is optional and secondary to position.
6. **Component ownership** -- Components within a section maintain their own order and are never shared across sections.
7. **Theme full replacement** -- When applying a theme via `applyVibe()`, the entire section structure is replaced from the theme template. Only user copy (text props) and enabled state are preserved.
8. **ID uniqueness** -- Section IDs are auto-generated using `{type}-{uuid8}` and must be unique within the config.
9. **Undo boundary** -- Every state mutation pushes the previous config onto the history stack (up to 100 entries).

---

## Section Type Registry

### 1. hero

| Property | Value |
|----------|-------|
| Internal type | `hero` |
| User-facing name | Main Banner |
| Available variants | `centered`, `split-right`, `split-left`, `overlay`, `minimal` |
| Column selector applies | No |
| Default variant | `centered` |
| Required components | `headline`, `subtitle`, `primaryCta` |
| Optional components | `eyebrow`, `secondaryCta`, `heroImage`, `backgroundImage`, `heroVideo`, `trustBadges` |
| Renderer mapping | `centered` -> HeroCentered, `split-right`/`split-left` -> HeroSplit, `overlay` -> HeroOverlay, `minimal` -> HeroMinimal |

### 2. navbar

| Property | Value |
|----------|-------|
| Internal type | `navbar` |
| User-facing name | Top Menu |
| Available variants | `simple` |
| Column selector applies | No |
| Default variant | `simple` |
| Required components | `logo` |
| Optional components | `cta` |
| Renderer mapping | `simple` -> NavbarSimple |

### 3. features

| Property | Value |
|----------|-------|
| Internal type | `features` |
| User-facing name | Features |
| Available variants | `grid`, `grid-3col`, `cards` |
| Column selector applies | Yes (implicit via variant: grid vs grid-3col) |
| Default variant | `grid` |
| Required components | `f1` |
| Optional components | `f2`, `f3` (extensible) |
| Renderer mapping | `cards` -> FeaturesCards, default -> FeaturesGrid |

### 4. pricing

| Property | Value |
|----------|-------|
| Internal type | `pricing` |
| User-facing name | Pricing |
| Available variants | `3-tier` |
| Column selector applies | Yes (tier count maps to columns) |
| Default variant | `3-tier` |
| Required components | `tier-1` |
| Optional components | `tier-2`, `tier-3` |
| Renderer mapping | default -> PricingTiers |

### 5. cta

| Property | Value |
|----------|-------|
| Internal type | `cta` |
| User-facing name | Action Block |
| Available variants | `simple`, `split` |
| Column selector applies | No |
| Default variant | `simple` |
| Required components | `heading`, `button` |
| Optional components | `subtitle` |
| Renderer mapping | `split` -> CTASplit, default -> CTASimple |

### 6. footer

| Property | Value |
|----------|-------|
| Internal type | `footer` |
| User-facing name | Footer |
| Available variants | `multi-column` |
| Column selector applies | Yes (col-1, col-2, col-3 columns) |
| Default variant | `multi-column` |
| Required components | `brand`, `copyright` |
| Optional components | `col-1`, `col-2`, `col-3` |
| Renderer mapping | default -> FooterSimple |

### 7. testimonials

| Property | Value |
|----------|-------|
| Internal type | `testimonials` |
| User-facing name | Reviews |
| Available variants | `cards` |
| Column selector applies | Yes (number of testimonial cards) |
| Default variant | `cards` |
| Required components | `t-1` |
| Optional components | `t-2`, `t-3` |
| Renderer mapping | default -> TestimonialsCards |

### 8. faq

| Property | Value |
|----------|-------|
| Internal type | `faq` |
| User-facing name | FAQ |
| Available variants | `accordion`, `two-column` |
| Column selector applies | No |
| Default variant | `accordion` |
| Required components | `q-1` |
| Optional components | `q-2`, `q-3`, `q-4`, `q-5` |
| Renderer mapping | `two-column` -> FAQTwoCol, default -> FAQAccordion |

### 9. value_props

| Property | Value |
|----------|-------|
| Internal type | `value_props` |
| User-facing name | Highlights |
| Available variants | `numbers` |
| Column selector applies | Yes (4 value props by default) |
| Default variant | `numbers` |
| Required components | `vp-1` |
| Optional components | `vp-2`, `vp-3`, `vp-4` |
| Renderer mapping | default -> ValuePropsGrid |

---

## Implementation Mapping

### Current Codebase File Map

| DDD Concept | File(s) | Notes |
|-------------|---------|-------|
| **Section Aggregate** | `src/store/configStore.ts` | `config.sections[]` array. All mutations go through Zustand actions with undo history. |
| **Component Value Object** | `src/lib/schemas/section.ts` | `componentSchema` defines the shape. Components live inside `section.components[]`. |
| **Section Type Registry** | `src/lib/schemas/section.ts` | `sectionTypeSchema` enum defines the 9 valid types. |
| **Section Templates** | `src/data/themes/*.json` | Each theme JSON contains a full `sections[]` array with default components, variants, and styles. |
| **Component Helpers** | `src/lib/componentHelpers.ts` | `updateComponentProps()`, `toggleComponentEnabled()`, `setComponentEnabled()` pure functions. |
| **Legacy Compat** | `src/lib/schemas/section.ts` | `resolveHeroContent()` and `componentsToHeroContent()` bridge old content format to new components. |
| **Master Config Schema** | `src/lib/schemas/masterConfig.ts` | Three-level hierarchy: `siteSchema` + `themeSchema` + `sectionSchema[]`. |
| **Editor (Hero)** | `src/components/right-panel/simple/SectionSimple.tsx` | Hero-specific editor with layout presets, element toggles, media picker, content fields. |
| **Editor (Features)** | `src/components/right-panel/simple/FeaturesSectionSimple.tsx` | |
| **Editor (CTA)** | `src/components/right-panel/simple/CTASectionSimple.tsx` | |
| **Editor (Pricing)** | `src/components/right-panel/simple/PricingSectionSimple.tsx` | |
| **Editor (Footer)** | `src/components/right-panel/simple/FooterSectionSimple.tsx` | |
| **Editor (Testimonials)** | `src/components/right-panel/simple/TestimonialsSectionSimple.tsx` | |
| **Editor (FAQ)** | `src/components/right-panel/simple/FAQSectionSimple.tsx` | |
| **Editor (Value Props)** | `src/components/right-panel/simple/ValuePropsSectionSimple.tsx` | |
| **Editor (Navbar)** | `src/components/right-panel/simple/NavbarSectionSimple.tsx` | |
| **Editor Router** | `src/components/right-panel/SimpleTab.tsx` | Routes `selectedContext.sectionId` to the correct `*SectionSimple` component. |
| **Renderer (Hero)** | `src/templates/hero/HeroCentered.tsx`, `HeroSplit.tsx`, `HeroOverlay.tsx`, `HeroMinimal.tsx` | Variant determines which template renders. |
| **Renderer (Features)** | `src/templates/features/FeaturesGrid.tsx`, `FeaturesCards.tsx` | |
| **Renderer (CTA)** | `src/templates/cta/CTASimple.tsx`, `CTASplit.tsx` | |
| **Renderer (Pricing)** | `src/templates/pricing/PricingTiers.tsx` | |
| **Renderer (Footer)** | `src/templates/footer/FooterSimple.tsx` | |
| **Renderer (Testimonials)** | `src/templates/testimonials/TestimonialsCards.tsx` | |
| **Renderer (FAQ)** | `src/templates/faq/FAQAccordion.tsx`, `FAQTwoCol.tsx` | |
| **Renderer (Value Props)** | `src/templates/value-props/ValuePropsGrid.tsx` | |
| **Renderer (Navbar)** | `src/templates/navbar/NavbarSimple.tsx` | |
| **Render Dispatcher** | `src/components/center-canvas/RealityTab.tsx` | `renderSection()` function maps section type + variant to the correct template component. |
| **Left Panel (Section List)** | `src/components/left-panel/SectionsSection.tsx` | Drag-and-drop section ordering, add/remove/duplicate/toggle, section name and icon maps. |
| **Preview Canvas** | `src/components/center-canvas/RealityTab.tsx` | Renders enabled sections in order with SectionWrapper (hover toolbar) and AddSectionDivider. |
| **UI State** | `src/store/uiStore.ts` | `SelectedContext` tracks which section/theme is being edited. Drives right panel routing. |
| **Theme Registry** | `src/data/themes/index.ts` | Exports 8 theme presets: saas, agency, portfolio, startup, personal, professional, wellness, minimalist. |

### Data Flow

```
User clicks section in Left Panel (SectionsSection)
  -> uiStore.setSelectedContext({ type: 'section', sectionId })
  -> SimpleTab reads selectedContext, finds section in config
  -> Routes to correct *SectionSimple editor
  -> Editor reads section.components[] and section.variant
  -> User edits trigger configStore.setSectionConfig() or helper functions
  -> configStore pushes to undo history, updates config
  -> RealityTab re-renders: renderSection() dispatches to correct template
  -> Template reads section.components[] via resolveHeroContent() or directly
```

### Planned Section Types (Redesign)

The current `sectionTypeSchema` defines 9 types. The redesign specification calls for 10 types with these additions/renames:

| Redesign Name | Current Equivalent | Status |
|---------------|-------------------|--------|
| hero | hero | Exists |
| columns | features | Rename candidate (more generic) |
| pricing | pricing | Exists |
| action | cta | Rename candidate (user-facing: "Action Block") |
| quotes | testimonials | Rename candidate (user-facing: "Reviews") |
| questions | faq | Rename candidate |
| numbers | value_props | Rename candidate (user-facing: "Highlights") |
| gallery | -- | New (not yet implemented) |
| menu | navbar | Rename candidate (user-facing: "Top Menu") |
| footer | footer | Exists |

### Variant Expansion (Redesign Target)

The redesign calls for up to 8 variants per section type. Current variant coverage:

| Section Type | Current Variants | Gap to 8 |
|--------------|-----------------|-----------|
| hero | 5 (centered, split-right, split-left, overlay, minimal) | +3 needed |
| navbar | 1 (simple) | +7 needed |
| features | 3 (grid, grid-3col, cards) | +5 needed |
| pricing | 1 (3-tier) | +7 needed |
| cta | 2 (simple, split) | +6 needed |
| footer | 1 (multi-column) | +7 needed |
| testimonials | 1 (cards) | +7 needed |
| faq | 2 (accordion, two-column) | +6 needed |
| value_props | 1 (numbers) | +7 needed |
