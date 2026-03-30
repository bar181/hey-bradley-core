# Phase 2 Grounding Document

**Date:** 2026-03-29
**Purpose:** Enable a new session to start working immediately without re-reading the entire codebase.

---

## 1. Project State Summary

Hey Bradley is a JSON-driven website builder for the Harvard capstone project. Users pick a theme (10 available), toggle between 8 section types (hero, features, pricing, CTA, footer, testimonials, FAQ, value props), edit content through a SIMPLE tab right panel, and preview the result in real time. The architecture follows a single-source-of-truth pattern: a `MasterConfig` JSON object drives everything — themes replace the entire config via `applyVibe()`, sections render from JSON, and CSS custom properties bridge the palette to Tailwind. The builder targets "grandmother-level" simplicity in Phase 2-3, with expert/pro features deferred to Phase 5+.

**Current phase:** Phase 2 — System Polish + ALL 8 Section Editors + Section CRUD.
**Phase 1 closed at 77%.** The hero loop works (theme pick, layout select, copy edit, toggle, palette/font, undo, export). Code quality is uneven and CSS architecture was half-migrated at close.

**Key ADRs to reference:**
- ADR-010: JSON single source of truth
- ADR-012: Three-level JSON hierarchy (global, theme, section)
- ADR-013: Section self-containment
- ADR-019: Six-slot palette (`bgPrimary`, `bgSecondary`, `textPrimary`, `textSecondary`, `accentPrimary`, `accentSecondary`)
- ADR-021: CSS custom properties theming
- ADR-022: Section type registry (added in Phase 2)

---

## 2. Phase 2 Completed Items

### 2.1 CSS Consolidation (commit `713a095`)
- Removed `colors` backward-compat block from `resolveColors.ts` — palette only now
- `resolveColors()` returns the 6-slot palette directly, no fallback to `colors`
- Research doc on section types + ADR-022 created in same commit

### 2.2 Section Routing (commit `b07b520`)
- `SimpleTab.tsx` dispatches to per-type editor via `switch (section.type)`
- `selectedContext` in `uiStore` tracks which section is selected
- Click section in left panel updates right panel to correct editor

### 2.3 ALL 8 Section Editors + Renderers (commit `b07b520`)
Renderers (in `src/templates/`):
| Section | Renderer | File |
|---------|----------|------|
| Hero | HeroCentered, HeroSplit, HeroOverlay, HeroMinimal | `hero/*.tsx` |
| Features | FeaturesGrid | `features/FeaturesGrid.tsx` |
| Pricing | PricingTiers | `pricing/PricingTiers.tsx` |
| CTA | CTASimple | `cta/CTASimple.tsx` |
| Footer | FooterSimple | `footer/FooterSimple.tsx` |
| Testimonials | TestimonialsCards | `testimonials/TestimonialsCards.tsx` |
| FAQ | FAQAccordion | `faq/FAQAccordion.tsx` |
| Value Props | ValuePropsGrid | `value-props/ValuePropsGrid.tsx` |

SIMPLE editors (in `src/components/right-panel/simple/`):
| Section | Editor | File |
|---------|--------|------|
| Hero | SectionSimple | `SectionSimple.tsx` |
| Features | FeaturesSectionSimple | `FeaturesSectionSimple.tsx` |
| Pricing | PricingSectionSimple | `PricingSectionSimple.tsx` |
| CTA | CTASectionSimple | `CTASectionSimple.tsx` |
| Footer | FooterSectionSimple | `FooterSectionSimple.tsx` |
| Testimonials | TestimonialsSectionSimple | `TestimonialsSectionSimple.tsx` |
| FAQ | FAQSectionSimple | `FAQSectionSimple.tsx` |
| Value Props | ValuePropsSectionSimple | `ValuePropsSectionSimple.tsx` |

### 2.4 Section CRUD (commit `05d162b`)
- `addSection(type, afterIndex?)` — creates section with UUID-based ID
- `removeSection(sectionId)` — deletes from config
- `duplicateSection(sectionId)` — clones below
- `reorderSections(newOrder)` — reorders by ID array
- `toggleSectionEnabled(sectionId)` — enable/disable toggle
- Default non-hero sections set to `enabled: false` (commit `112141d`)
- Drag-and-drop deferred to Phase 3 (@dnd-kit)

### 2.5 Light/Dark Mode (commit `0c1bac1`)
- `toggleMode()` in configStore swaps between palette and lightPalette/darkPalette
- Persists mode in localStorage
- Toggle UI in builder chrome

### UI Fixes
- Harvard crimson brand colors applied site-wide (commits `c5b33ef`, `10c6226`)
- Deleted stale `tailwind.config.js` (commit `10c6226`)
- Builder chrome: dark/light panel separation with Harvard crimson accent (commit `e2b2b42`)
- Palette + font moved to Expert tab (commit `a29db52`)
- Hero Style accordion: typography controls + color pickers (commit `599de5c`)
- Min 12px fonts + Visuals accordion + layout 2-col grid (commit `b7f4f01`)

---

## 3. Phase 2 Remaining Items

### 2.6 Media Pickers (P1)
- `MediaPickerDialog.tsx` — shared shadcn Dialog for images/videos
- Image mode: thumbnails from `media.json` with category filter
- Video mode: video thumbnails/previews
- "Add URL" tab for custom URLs
- Gradient picker: 5-6 presets + custom angle
- Wire into Layout accordion (replace plain URL inputs)
- Upload deferred to Phase 6+ (requires Supabase)

### 2.7 Tailwind/shadcn Audit + Playwright + Polish (P2)
- Audit theme JSONs for hardcoded hex that should reference palette
- Audit renderers for inline `style={{}}` (only gradients/dynamic URLs allowed)
- Ensure all interactive elements use shadcn components
- Playwright test suite: visual, functional, integrity agents
- Google Fonts dynamic loading from `fonts.json`
- Section highlight on click (dashed border in preview)

### Known Bugs / Issues
- Font changes may not visually cascade to all sections (Phase 1 review item 7)
- shadcn Button cannot be used for links (base-ui limitation) — using plain `<a>` tags
- No Playwright tests beyond Phase 1.0 initial suite
- `addSection()` creates minimal defaults (`content: {}`, hardcoded `#1E1E1E` background) — should populate from theme defaults
- Second variants per section type not yet implemented (e.g., FeaturesCards, CTASplit, FAQTwoCol, etc.)

---

## 4. Key Files Map

| File | Purpose |
|------|---------|
| `src/store/configStore.ts` | Zustand store — all state, patches, CRUD, undo/redo, theme switching |
| `src/store/uiStore.ts` | UI state — selected context, preview width, panel visibility |
| `src/lib/resolveColors.ts` | Maps 6-slot palette to resolved color object |
| `src/lib/useThemeVars.ts` | Hook: syncs palette to CSS custom properties on preview container |
| `src/lib/deepMerge.ts` | Deep merge utility for JSON patches |
| `src/lib/persistence.ts` | localStorage auto-save (2s debounce) + load on mount |
| `src/lib/schemas/masterConfig.ts` | Zod schema for MasterConfig (theme, sections, metadata) |
| `src/data/default-config.json` | Default MasterConfig loaded on fresh start |
| `src/data/template-config.json` | Template config for new projects |
| `src/data/themes/*.json` | 10 theme JSON files (full config replacement) |
| `src/data/palettes/` | Palette presets |
| `src/data/fonts/` | Font definitions |
| `src/data/media/` | Media library (images, videos) |
| `src/templates/{type}/*.tsx` | Section renderers (one dir per section type) |
| `src/components/right-panel/SimpleTab.tsx` | Dispatch hub — routes to per-type SIMPLE editor |
| `src/components/right-panel/simple/*.tsx` | Per-section SIMPLE editors + ThemeSimple, PaletteSelector, FontSelector |
| `src/components/center-canvas/RealityTab.tsx` | Preview renderer — dispatches sections to renderers |
| `src/components/left-panel/LeftPanel.tsx` | Section list + theme selector |
| `src/components/left-panel/SectionsSection.tsx` | Section list with CRUD controls |
| `docs/adr/ADR-010` through `ADR-022` | 13 architecture decision records |

---

## 5. Known Issues / Bugs

1. **`addSection()` defaults are bare-bones.** New sections get `content: {}` and hardcoded `#1E1E1E` background instead of theme-aware defaults with sample content. This makes newly added sections render as empty dark boxes.
2. **Only one variant per non-hero section.** The implementation plan calls for 2 variants each (e.g., FeaturesGrid + FeaturesCards). Currently only the first variant exists for each type.
3. **Font cascade incomplete.** `useThemeVars` sets `--theme-font` on the container, but not all renderers consistently pick it up.
4. **No `colors` block removal from theme JSONs.** `resolveColors.ts` was cleaned up (palette-only), but the theme JSON files may still contain a `colors` block that is now dead code.
5. **shadcn Button unusable for links.** base-ui's Button expects `<button>`, not `<a>`. CTA and hero link buttons use raw `<a>` tags.
6. **No automated test coverage for Phase 2 work.** All Phase 2 verification was manual/build-only.
7. **Harvard crimson colors are applied to builder chrome but may clash with some theme palettes** in the preview area.

---

## 6. Architecture Quick Reference

### How Themes Work
`applyVibe(themeName)` in `configStore.ts` does a **full JSON replacement** of the entire `MasterConfig` — theme object, all sections, everything. It is NOT a color swap. Each theme JSON in `src/data/themes/` is a complete config with its own section content, variants, palette, typography, and layout choices.

### How Sections Render
`RealityTab.tsx` iterates `config.sections.filter(s => s.enabled)` and dispatches each section to its renderer based on `section.type` and `section.variant`. The dispatch is a chain of `if (section.type === 'X')` blocks. Each renderer receives the full section object as a prop.

### How the Right Panel Routes
`SimpleTab.tsx` reads `uiStore.selectedContext` (set when user clicks a section in the left panel). It `switch`es on `section.type` to render the correct per-type SIMPLE editor (e.g., `FeaturesSectionSimple`). The `ThemeSimple` component renders when `selectedContext.type === 'theme'`.

### How Colors Work
1. Each theme JSON has a `palette` object with 6 slots (ADR-019)
2. `useThemeVars()` hook reads the palette via `resolveColors()` and sets CSS custom properties (`--theme-bg`, `--theme-surface`, `--theme-text`, `--theme-muted`, `--theme-accent`, `--theme-accent-secondary`) on the preview container
3. Tailwind classes reference these vars (e.g., `bg-[var(--theme-bg)]`, `text-[var(--theme-text)]`)
4. Individual sections can override via `section.style.background` and `section.style.color` as inline styles
5. Builder chrome uses Harvard crimson colors via separate `hb-*` CSS classes (not theme vars)

### How Persistence Works
- `persistence.ts` auto-saves to `localStorage` under key `hey-bradley-project` with a 2-second debounce
- On mount, `loadSavedProject()` reads from localStorage, validates against the Zod schema, and calls `loadConfig()`
- Undo/redo maintained in-memory via `history[]` and `future[]` arrays (limit 100)
- JSON export/import also available

---

## 7. Next Steps for Phase 3

Per `backlog/future-phases.md`, Phase 3 is **Full Site Builder UX**:

| # | Feature | Details |
|---|---------|---------|
| 3.1 | Onboarding page | Theme selection grid at `/`, "describe your site" textarea, "start from scratch" button |
| 3.2 | Drag-and-drop reorder | @dnd-kit for section reorder in left panel + main preview |
| 3.3 | Full-page preview | Hide panels, show complete multi-section page with smooth scroll |
| 3.4 | Builder UX polish | Tooltips, quick actions, first-time hints |
| 3.5 | Section templates | Pre-built section content per theme (not just empty sections) |
| 3.6 | Export to static HTML | Standalone HTML with inlined styles (stretch goal) |

**Phase 3.5 (Navbar section type)** is also scoped: a configurable navbar that auto-generates anchor links from enabled sections. Rendered outside the section loop as a shell element.

**Before starting Phase 3**, close out Phase 2 remaining items:
1. Finish 2.6 (Media Pickers) or explicitly defer to Phase 3
2. Finish 2.7 (Playwright tests + audit) or scope down to critical path
3. Fix `addSection()` defaults to use theme-aware content
4. Decide on second variants per section type — do now or defer

---

## 8. Open Questions

1. **Media Pickers (2.6) — do now or defer?** They are P1 but the builder is functional without them. Plain URL inputs work. Deferring to Phase 3 would let Phase 2 close sooner.

2. **Playwright scope for 2.7** — Full visual regression across 10 themes x 8 sections is expensive. Should we scope down to smoke tests (theme switch, section enable/disable, CRUD operations) for Phase 2 close and expand in Phase 3?

3. **Second variants per section type** — The plan calls for 2 variants each (e.g., FeaturesCards, CTASplit, FAQTwoCol). Currently only one variant exists per type. Should these be Phase 2 or Phase 3?

4. **`addSection()` defaults** — Currently creates empty sections. Should new sections inherit sample content from the current theme's JSON, or use a generic template per section type?

5. **Navbar section** — Listed as Phase 3.5. Should it be promoted to Phase 3.1 since it is essential for the full-page preview experience?

6. **Harvard crimson in builder chrome** — Is this the final brand direction, or should the builder chrome be theme-neutral (slate/gray)?

7. **Expert tab** — Phase 5 scope, but palette and font selectors were already moved there (commit `a29db52`). Should the Expert tab remain accessible with just those two controls, or be hidden until Phase 5?
