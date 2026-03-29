# Phase 2: Implementation Plan — Master Checklist

**Last Updated:** 2026-03-29
**Status:** READY TO START
**Scope:** Per `human-1.md` — all 8 section types + section CRUD

---

## Sub-Phase 2.1 — CSS Consolidation (P0)

**Goal:** One color system. No dual palette/colors. Consistent text cascade.
**DoD:** Zero inline color styles except gradients. All text inherits from section.style.color.

- [ ] Remove `colors` block from all 10 theme JSONs — palette only
- [ ] Remove backward-compat from `resolveColors.ts` (palette only, no colors fallback)
- [ ] Deprecate `themeColorsSchema` in masterConfig.ts
- [ ] Audit all renderers: `color: section.style.color` on `<section>`, `text-inherit` on children
- [ ] Remove all `text-theme-text` / `text-theme-muted` from renderers
- [ ] Zero `text-white` or `border-white` outside HeroOverlay
- [ ] Update default-config.json and template-config.json — remove colors block
- [ ] Build passes, all 10 themes render correctly

---

## Sub-Phase 2.2 — Section Routing (P0)

**Goal:** Right panel shows the correct editor for whichever section is selected.
**DoD:** Click hero → hero editor. Click features → features editor. Every section type routable.

- [ ] `SimpleTab.tsx` dispatches to per-type editor based on section.type
- [ ] Click section in left panel → right panel switches to that section's editor
- [ ] Click section in main preview → right panel switches (edit icon hover overlay)
- [ ] Right panel header shows section type + ID
- [ ] Section dropdown in right panel header to switch sections
- [ ] Un-hide Features and CTA in RealityTab (remove hero-only filter)

---

## Sub-Phase 2.3 — Section Editors — ALL 8 Types (P0)

**Goal:** Every section type has a SIMPLE tab editor with at minimum: copy inputs + component toggles + variant selector.
**DoD:** User can edit all content for all sections through the SIMPLE tab.

### Per-Section Requirements

Each section needs:
1. **Zod schema** (`src/templates/{type}/schema.ts`)
2. **JSON template** (entry in each theme's `sections[]`)
3. **Renderer** (`src/templates/{type}/{Variant}.tsx`)
4. **SIMPLE editor** (`src/components/right-panel/simple/Section{Type}Simple.tsx`)

### Hero (DONE — Phase 1)
- [x] Schema, renderer (4 variants), SIMPLE editor (Layout + Style + Content)

### Features
- [ ] Schema: title, items[{icon, title, description}]
- [ ] Renderer: FeaturesGrid (3-col) — already exists
- [ ] Renderer: FeaturesCards (bordered cards variant)
- [ ] SIMPLE editor: variant selector, per-card icon/title/description with toggles
- [ ] Add/remove feature cards (min 2, max 6)

### Pricing
- [ ] Schema: tiers[{name, price, period, features[], cta, highlighted}]
- [ ] Renderer: Pricing2Tier, Pricing3Tier
- [ ] SIMPLE editor: per-tier editing (name, price, features list, CTA button)
- [ ] Highlighted tier toggle (accent border + recommended badge)
- [ ] JSON template added to all 10 theme files

### CTA
- [ ] Schema: heading, subtitle, button{text, url}, background
- [ ] Renderer: CTASimple — already exists
- [ ] Renderer: CTASplit (text left, image right)
- [ ] SIMPLE editor: heading, subtitle, button with toggles
- [ ] JSON template in themes (already exists)

### Footer
- [ ] Schema: columns[{heading, links[]}], social[], copyright
- [ ] Renderer: FooterSimple, FooterMultiCol
- [ ] SIMPLE editor: column editing, link management, social icons, copyright
- [ ] JSON template added to all 10 theme files

### Testimonials
- [ ] Schema: items[{quote, author, role, avatar}]
- [ ] Renderer: TestimonialsCards, TestimonialSingle
- [ ] SIMPLE editor: per-testimonial editing (quote, author, role, avatar URL)
- [ ] Add/remove testimonials
- [ ] JSON template added to all 10 theme files

### FAQ
- [ ] Schema: items[{question, answer}]
- [ ] Renderer: FAQAccordion, FAQTwoCol
- [ ] SIMPLE editor: Q&A pairs with add/remove
- [ ] JSON template added to all 10 theme files

### Value Props
- [ ] Schema: items[{icon, value, label, description}]
- [ ] Renderer: ValuePropsIcons, ValuePropsNumbers
- [ ] SIMPLE editor: per-item editing (icon, value/stat, label, description)
- [ ] JSON template added to all 10 theme files

---

## Sub-Phase 2.4 — Section CRUD (P1)

**Goal:** Users can add, remove, duplicate, and reorder sections.
**DoD:** "Add Section" shows a picker with all 8 types. Remove/duplicate/reorder all work.

- [ ] "Add Section" button in left panel opens type picker dialog
- [ ] Type picker shows all 8 section types with description + preview
- [ ] Adding a section inserts it below the current selection with default content
- [ ] Remove section button with confirmation dialog
- [ ] Duplicate section creates a copy below
- [ ] Reorder: up/down arrow buttons per section in left panel
- [ ] Drag-and-drop reorder → deferred to Phase 3 (@dnd-kit)

---

## Sub-Phase 2.5 — Light/Dark Mode (P1)

**Goal:** Light/dark toggle visually transforms the preview.
**DoD:** Dark theme → light variant looks good. Light theme → dark variant looks good.

- [ ] Add `lightPalette` to each dark theme JSON
- [ ] Add `darkPalette` to each light theme JSON
- [ ] `toggleMode()` swaps between palette and light/dark alternative
- [ ] Update section styles when palette swaps
- [ ] Detect `prefers-color-scheme` on first load
- [ ] Persist mode in localStorage

---

## Sub-Phase 2.6 — Media Pickers (P1)

**Goal:** Browse and select images/videos from the library.
**DoD:** Click image field → picker opens → select → URL inserted.

- [ ] `MediaPickerDialog.tsx` (shadcn Dialog) — shared component
- [ ] Image mode: thumbnails from media.json (50 images) with category filter
- [ ] Video mode: video thumbnails/previews (20 videos)
- [ ] "Add URL" tab for custom URLs with preview
- [ ] Gradient picker: 5-6 preset gradients + custom angle
- [ ] Wire into Layout accordion (replace plain URL inputs)
- [ ] Upload → deferred to Phase 6+ (requires Supabase)

---

## Sub-Phase 2.7 — Playwright + Polish (P2)

**Goal:** Automated tests + remaining quality items.

- [ ] Playwright: theme switch, layout change, copy edit, toggle, responsive
- [ ] Playwright: section add/remove/reorder
- [ ] Playwright: screenshots for all 10 themes
- [ ] Google Fonts dynamic loading from fonts.json URLs
- [ ] Section highlight on click (dashed border in preview)

---

## Phase 2 Verification (All Complete)

- [ ] All 8 section types have renderers + SIMPLE editors
- [ ] Section routing works (click section → right panel shows correct editor)
- [ ] Section CRUD works (add/remove/duplicate/reorder)
- [ ] CSS: palette only, zero colors block, consistent text pattern
- [ ] Light/dark toggle visually changes preview
- [ ] Media picker works for images and videos
- [ ] Playwright passes all tests
- [ ] Build passes clean
- [ ] Score ≥ 80%
