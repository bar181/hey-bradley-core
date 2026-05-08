# Phase 5: Section System Redesign -- Implementation Checklist

**Spec:** `plans/implementation/phase-5/redo-design-no-jargon.md`
**Date:** 2026-04-02
**Estimated Total:** 10-13 hours across 5 sub-phases

---

## Dependencies Between Phases

```
5A (Rename + Foundation)
 |
 +---> 5B (Column Selector) -- depends on 5A schema changes
 |
 +---> 5C (Variant Renderers) -- depends on 5A type names, 5B column prop
 |
 +---> 5D (Image + Video) -- depends on 5C variant renderers existing
          |
          +---> 5E (Playwright Verification) -- depends on all above
```

5A must complete first. 5B and 5C can run in parallel after 5A. 5D depends on 5C. 5E is last.

---

## Phase 5A: Rename + Foundation (2-3 hours)

All items are P0 unless marked otherwise. This phase is the critical path -- nothing else can start until it passes build + tests.

### Schema Updates

- [ ] **P0** (15 min) Update `sectionTypeSchema` enum in `src/lib/schemas/section.ts`:
  - `features` -> `columns`
  - `cta` -> `action`
  - `testimonials` -> `quotes`
  - `faq` -> `questions`
  - `value_props` -> `numbers`
  - `navbar` -> `menu`
- [ ] **P0** (5 min) Add `gallery` to `sectionTypeSchema` enum in `src/lib/schemas/section.ts`
- [ ] **P0** (5 min) Rename `featuresContentSchema` -> `columnsContentSchema` and `ctaContentSchema` -> `actionContentSchema` in `src/lib/schemas/section.ts`
- [ ] **P0** (5 min) Update re-exports in `src/lib/schemas/index.ts` if any type names changed

### Theme JSON Updates

- [ ] **P0** (10 min) Update `src/data/themes/saas.json` -- rename all section type values
- [ ] **P0** (10 min) Update `src/data/themes/agency.json`
- [ ] **P0** (10 min) Update `src/data/themes/portfolio.json`
- [ ] **P0** (10 min) Update `src/data/themes/startup.json`
- [ ] **P0** (10 min) Update `src/data/themes/personal.json`
- [ ] **P0** (10 min) Update `src/data/themes/professional.json`
- [ ] **P0** (10 min) Update `src/data/themes/wellness.json`
- [ ] **P0** (10 min) Update `src/data/themes/minimalist.json`
- [ ] **P0** (5 min) Update `src/data/themes/blog.json`
- [ ] **P0** (5 min) Update `src/data/themes/creative.json`

### Config + Data Files

- [ ] **P0** (10 min) Update `src/data/default-config.json` -- rename section type values
- [ ] **P0** (5 min) Update `src/data/template-config.json` -- rename section type values
- [ ] **P1** (10 min) Update example JSONs: `src/data/examples/consulting.json`, `photography.json`, `launchpad.json`, `bakery.json`

### Store Updates

- [ ] **P0** (15 min) Update `src/store/configStore.ts` -- `addSection()` template lookup uses new type strings; `applyVibe()` section type matching uses new names
- [ ] **P0** (5 min) Verify `duplicateSection()` -- uses `section.type` for ID prefix, will auto-work if enum is updated

### Chat / Command Updates

- [ ] **P0** (15 min) Update `src/components/shell/ChatInput.tsx` -- canned chat command patterns that reference old section names (features, cta, testimonials, faq, value_props, navbar)

### Left Panel UI

- [ ] **P0** (15 min) Update `src/components/left-panel/SectionsSection.tsx` -- display labels, section type references, add section dropdown options

### Right Panel UI

- [ ] **P0** (15 min) Update `src/components/right-panel/RightPanel.tsx` -- section type switch/conditional rendering
- [ ] **P0** (15 min) Update `src/components/right-panel/SimpleTab.tsx` -- editor labels and section type conditionals

### Center Canvas (Preview)

- [ ] **P0** (20 min) Update `src/components/center-canvas/RealityTab.tsx` -- section renderer switch statement, import names
- [ ] **P1** (5 min) Update `src/components/center-canvas/DataTab.tsx` -- section type references if any

### Verification Gate

- [ ] **P0** (10 min) Run `npm run build` -- zero errors
- [ ] **P0** (10 min) Run `npm test` -- all tests pass
- [ ] **P0** (5 min) Manual smoke test: load app, verify all renamed sections render in preview

---

## Phase 5B: Column Selector (1 hour)

**Depends on:** Phase 5A complete (new type names in schema)

### Schema

- [ ] **P0** (10 min) Add `columns` prop (z.number().optional().default(3)) to `sectionSchema` in `src/lib/schemas/section.ts`

### Component

- [ ] **P0** (20 min) Create `src/components/right-panel/ColumnSelector.tsx` -- 3 toggle buttons for 2/3/4 columns, highlights active count, calls `setSectionConfig(sectionId, { columns: n })`

### Editor Integration

- [ ] **P0** (5 min) Add ColumnSelector to Columns (features) editor in SimpleTab
- [ ] **P0** (5 min) Add ColumnSelector to Pricing editor in SimpleTab
- [ ] **P0** (5 min) Add ColumnSelector to Quotes (testimonials) editor in SimpleTab
- [ ] **P0** (5 min) Add ColumnSelector to Numbers (value_props) editor in SimpleTab
- [ ] **P0** (5 min) Add ColumnSelector to Gallery editor in SimpleTab (new section)

### Renderer Wiring

- [ ] **P0** (10 min) Wire column count to grid renderers in RealityTab -- use `grid-cols-{n}` classes based on `section.columns`, default to 3
- [ ] **P0** (5 min) Verify responsive: columns collapse to 1 on mobile (`grid-cols-1` at `sm:` breakpoint)

### Verification Gate

- [ ] **P0** (5 min) Run `npm run build` -- zero errors
- [ ] **P1** (10 min) Playwright test: toggle column count 2->3->4, verify grid changes

---

## Phase 5C: Variant Renderers -- Priority 3 per Section (4-6 hours)

**Depends on:** Phase 5A complete (type names), Phase 5B preferred (column prop)

Build 3 visually distinct variants per section. Each variant is a separate React component. The variant selector in the right panel must switch between them.

### Columns (renamed from Features) -- highest priority

- [ ] **P0** (30 min) Variant 1: **Cards** -- bordered cards with icon + title + description
- [ ] **P0** (30 min) Variant 2: **Image Cards** -- cards with Unsplash image on top + title + description
- [ ] **P0** (30 min) Variant 3: **Icon + Text** -- large centered icon above text, no card border

### Hero -- expand existing 5 to 8

- [ ] **P1** (20 min) Variant 6: **Gradient** -- bold gradient background, centered text
- [ ] **P1** (30 min) Variant 7: **Cards** -- text with floating product/app cards
- [ ] **P2** (30 min) Variant 8: **Video Background** -- autoplay video behind text overlay (stub with poster image)

### Quotes (renamed from Testimonials)

- [ ] **P0** (30 min) Variant 1: **Cards** -- photo + quote + name/role per card
- [ ] **P0** (20 min) Variant 2: **Single Quote** -- one large quote, centered
- [ ] **P1** (20 min) Variant 3: **Rating Stars** -- cards with star ratings

### Action (renamed from CTA)

- [ ] **P1** (10 min) Variant 1: **Centered** -- heading + button, centered (verify existing works)
- [ ] **P1** (10 min) Variant 2: **Split** -- text left, button right (verify existing works)
- [ ] **P1** (20 min) Variant 3: **Gradient** -- bold gradient background

### Questions (renamed from FAQ)

- [ ] **P1** (10 min) Variant 1: **Accordion** -- verify existing works after rename
- [ ] **P1** (10 min) Variant 2: **Two Column** -- verify existing works after rename
- [ ] **P1** (20 min) Variant 3: **Cards** -- each Q&A as a styled card

### Numbers (renamed from Value Props)

- [ ] **P1** (10 min) Variant 1: **Counters** -- verify existing works after rename
- [ ] **P1** (20 min) Variant 2: **Icons + Numbers** -- icon above each counter
- [ ] **P1** (20 min) Variant 3: **Cards** -- each stat in a styled card

### Gallery (new section)

- [ ] **P0** (30 min) Variant 1: **Grid** -- equal-size image grid with Unsplash placeholders
- [ ] **P1** (30 min) Variant 2: **Masonry** -- Pinterest-style mixed sizes
- [ ] **P2** (30 min) Variant 3: **Carousel** -- horizontal scroll slider

### Footer

- [ ] **P1** (10 min) Variant 1: **Multi-Column** -- verify existing works
- [ ] **P1** (20 min) Variant 2: **Simple** -- copyright + links in one line
- [ ] **P2** (15 min) Variant 3: **Minimal** -- copyright only

### Menu (renamed from Navbar)

- [ ] **P1** (10 min) Variant 1: **Simple** -- verify existing works after rename
- [ ] **P1** (20 min) Variant 2: **Centered** -- logo centered, links split left/right
- [ ] **P2** (20 min) Variant 3: **Transparent** -- no background, overlays hero

### Variant Infrastructure

- [ ] **P0** (20 min) Update variant selector UI in right panel to show visual thumbnail buttons for each section type's variants
- [ ] **P0** (15 min) Update RealityTab section renderer to dispatch to correct variant component based on `section.variant` string

### Verification Gate

- [ ] **P0** (10 min) Run `npm run build` -- zero errors
- [ ] **P0** (10 min) Run `npm test` -- all tests pass
- [ ] **P0** (10 min) Manual smoke: switch variants for each section type, verify visually distinct output

---

## Phase 5D: Image + Video Support (2 hours)

**Depends on:** Phase 5C complete (variant renderers must exist to add image pickers)

### Image Picker

- [ ] **P0** (30 min) Create `src/components/right-panel/ImagePicker.tsx` -- click to show URL text input, preview thumbnail when valid URL entered
- [ ] **P0** (15 min) Add ImagePicker to Columns Image Cards variant editor
- [ ] **P0** (10 min) Add ImagePicker to Hero Split/Background variants
- [ ] **P1** (10 min) Add ImagePicker to Gallery section editor (all variants)
- [ ] **P1** (10 min) Add ImagePicker to Quotes Cards variant (avatar photo)

### Default Unsplash Images

- [ ] **P0** (20 min) Add default Unsplash placeholder URLs to all card-based variants in theme JSONs (Columns Image Cards, Gallery Grid, Hero Split, Quotes Cards)
- [ ] **P0** (10 min) Verify placeholder images render in preview without user action

### Video Support

- [ ] **P1** (20 min) Create video URL input component with thumbnail preview (extract YouTube/Vimeo thumbnail)
- [ ] **P1** (10 min) Wire to Hero Video Background variant
- [ ] **P2** (10 min) Wire to Gallery Video variant
- [ ] **P2** (10 min) Wire to Action Video variant

### Verification Gate

- [ ] **P0** (5 min) Run `npm run build` -- zero errors
- [ ] **P0** (10 min) Verify all default images render in preview mode
- [ ] **P1** (5 min) Verify entering a custom image URL updates the preview

---

## Phase 5E: Playwright Visual Verification (1 hour)

**Depends on:** All previous phases complete

### Screenshot Suite

- [ ] **P1** (10 min) Screenshot every section type with default variant -- save to `tests/screenshots/phase5-{type}-default.png`
- [ ] **P1** (15 min) Screenshot 3 variants per section type -- save to `tests/screenshots/phase5-{type}-v{n}.png`
- [ ] **P1** (10 min) Screenshot column count changes (2/3/4 cols for Columns section)
- [ ] **P1** (10 min) Screenshot mobile responsive (375px viewport)

### Playwright Spec

- [ ] **P1** (15 min) Create `tests/e2e/phase5-sections.spec.ts` -- automated variant switching + screenshot capture
- [ ] **P2** (10 min) Add visual regression baseline comparison (optional, stretch)

### Quality Gate

- [ ] **P0** (10 min) UI/UX review: all 10 section types render without errors
- [ ] **P0** (5 min) Hybrid names visible in all user-facing UI (left panel, right panel, chat)
- [ ] **P0** (5 min) At least 3 working variants per section type
- [ ] **P0** (5 min) Column selector works for Columns, Pricing, Quotes, Numbers, Gallery
- [ ] **P1** (5 min) Theme colors apply correctly to all variants
- [ ] **P1** (5 min) Mobile responsive (1 column at 375px)
- [ ] **P1** Target UI/UX review score: 75+

---

## Files Affected (Complete List)

### Schema + Types
- `src/lib/schemas/section.ts` -- enum, content schemas, column prop
- `src/lib/schemas/index.ts` -- re-exports

### Data Files (13 files)
- `src/data/default-config.json`
- `src/data/template-config.json`
- `src/data/themes/saas.json`
- `src/data/themes/agency.json`
- `src/data/themes/portfolio.json`
- `src/data/themes/startup.json`
- `src/data/themes/personal.json`
- `src/data/themes/professional.json`
- `src/data/themes/wellness.json`
- `src/data/themes/minimalist.json`
- `src/data/themes/blog.json`
- `src/data/themes/creative.json`
- `src/data/examples/consulting.json`
- `src/data/examples/photography.json`
- `src/data/examples/launchpad.json`
- `src/data/examples/bakery.json`

### Store
- `src/store/configStore.ts`

### Left Panel
- `src/components/left-panel/SectionsSection.tsx`

### Right Panel
- `src/components/right-panel/RightPanel.tsx`
- `src/components/right-panel/SimpleTab.tsx`
- `src/components/right-panel/ColumnSelector.tsx` (new)
- `src/components/right-panel/ImagePicker.tsx` (new)

### Center Canvas
- `src/components/center-canvas/RealityTab.tsx`
- `src/components/center-canvas/DataTab.tsx`

### Chat
- `src/components/shell/ChatInput.tsx`

### New Variant Renderers (created in Phase 5C)
- Multiple new component files under `src/components/center-canvas/` or `src/components/sections/`

### Tests
- `tests/e2e/phase5-sections.spec.ts` (new)
- `tests/e2e/phase5-chat.spec.ts` (existing, may need updates)
- `tests/e2e/phase3-ui-ux-audit.spec.ts` (existing, may need updates)

---

## Rename Reference Table

| Old Type String | New Type String | Old UI Label | New UI Label |
|----------------|----------------|--------------|--------------|
| `features` | `columns` | Features | Columns |
| `cta` | `action` | Call to Action / CTA | Action |
| `testimonials` | `quotes` | Testimonials | Quotes |
| `faq` | `questions` | FAQ | Questions |
| `value_props` | `numbers` | Value Props | Numbers |
| `navbar` | `menu` | Navbar | Menu |
| `hero` | `hero` | Hero | Hero (no change) |
| `pricing` | `pricing` | Pricing | Pricing (no change) |
| `footer` | `footer` | Footer | Footer (no change) |
| *(new)* | `gallery` | -- | Gallery |
