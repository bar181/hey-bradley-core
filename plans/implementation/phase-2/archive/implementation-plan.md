# Phase 2: Implementation Plan — Master Checklist

**Last Updated:** 2026-03-30
**Status:** COMPLETE
**Scope:** Per `human-1.md` — all 8 section types + section CRUD

---

## Sub-Phase 2.1 — CSS Consolidation (P0) ✅ DONE (commit `713a095`)

**Goal:** One color system. No dual palette/colors. Consistent text cascade.
**DoD:** Zero inline color styles except gradients. All text inherits from section.style.color.

- [x] Remove backward-compat from `resolveColors.ts` (palette only, no colors fallback)
- [x] Build passes, all 10 themes render correctly

---

## Sub-Phase 2.2 — Section Routing (P0) ✅ DONE (commit `b07b520`)

**Goal:** Right panel shows the correct editor for whichever section is selected.

- [x] `SimpleTab.tsx` dispatches to per-type editor based on section.type
- [x] Click section in left panel → right panel switches to that section's editor

---

## Sub-Phase 2.3 — Section Editors — ALL 8 Types (P0) ✅ DONE (commit `b07b520`)

**Goal:** Every section type has a SIMPLE tab editor with copy inputs + component toggles.

- [x] Hero: Schema, 4 renderers, SIMPLE editor (Layout + Visuals + Style + Content)
- [x] Features: FeaturesGrid renderer + FeaturesSectionSimple editor (grid cols, per-card icon/title/desc, add/remove)
- [x] Pricing: PricingTiers renderer + PricingSectionSimple editor (per-tier name/price/features/CTA, highlighted toggle)
- [x] CTA: CTASimple renderer + CTASectionSimple editor (heading/subtitle/button with toggles)
- [x] Footer: FooterSimple renderer + FooterSectionSimple editor (brand, 3 link columns, copyright)
- [x] Testimonials: TestimonialsCards renderer + TestimonialsSectionSimple editor (quote/author/role per card)
- [x] FAQ: FAQAccordion renderer + FAQSectionSimple editor (Q&A pairs with toggles)
- [x] Value Props: ValuePropsGrid renderer + ValuePropsSectionSimple editor (value/label/description per stat)
- [x] All editors have `data-testid` attributes for Playwright (added 2026-03-30)

**Deferred to Phase 3:** Second variants per section type (FeaturesCards, CTASplit, FAQTwoCol, etc.)

---

## Sub-Phase 2.4 — Section CRUD (P1) ✅ DONE (commit `05d162b`, improved `2026-03-30`)

**Goal:** Users can add, remove, duplicate, and reorder sections.

- [x] "Add Section" button opens type picker with all 8 types + descriptions
- [x] Adding a section now pulls template from current theme JSON with real sample content (fixed 2026-03-30)
- [x] Remove section with double-click confirmation
- [x] Duplicate section creates a copy below
- [x] Reorder via up/down arrow buttons
- Drag-and-drop deferred to Phase 3 (@dnd-kit)

---

## Sub-Phase 2.5 — Light/Dark Mode (P1) ✅ DONE (commit `0c1bac1`)

- [x] `toggleMode()` swaps between palette and lightPalette/darkPalette
- [x] Section styles update when palette swaps
- [x] Persists mode in localStorage

---

## Sub-Phase 2.6 — Media Pickers (P1) ⏩ DEFERRED to Phase 3

Plain URL inputs work. Media browse dialog deferred to Phase 3.

---

## Sub-Phase 2.7 — Playwright + Polish (P2) ✅ PARTIALLY DONE (2026-03-30)

### Playwright Smoke Tests (6 tests, all passing)
- [x] Theme switch changes preview (test 1)
- [x] addSection creates section with real content (test 2)
- [x] Remove section works (test 3)
- [x] Edit headline updates preview via data-testid (test 4)
- [x] Toggle component visibility (test 5)
- [x] All 10 themes render without page errors (test 6 — regression)

### Accessibility Fixes (2026-03-30)
- [x] aria-label on chat input, mic button, send button
- [x] aria-label on all TopBar icon buttons
- [x] Focus-visible rings on delete/duplicate buttons in sections
- [x] 11px fonts bumped to 12px (ModeToggle, section descriptions)

### Responsive Navbar (2026-03-30)
- [x] Hamburger menu on screens below md breakpoint
- [x] Dropdown with undo/redo, device preview, dark/light toggle, share

### Deferred
- Full Playwright test suite (112 checks) → Phase 3
- Tailwind/shadcn audit → Phase 3
- Google Fonts dynamic loading → Phase 5
- Section highlight on click → Phase 3

---

## Phase 2 Verification ✅

- [x] All 8 section types have renderers + SIMPLE editors
- [x] Section routing works (click section → right panel shows correct editor)
- [x] Section CRUD works (add/remove/duplicate/reorder) — addSection now pulls real content from theme
- [x] CSS: palette only, zero colors block fallback
- [x] Light/dark toggle visually changes preview
- [x] Responsive hamburger navbar for small devices
- [x] data-testid on all editor inputs for Playwright
- [x] Accessibility: aria-labels, focus indicators, 12px minimum fonts
- [x] 6 Playwright smoke tests passing (including 10-theme regression)
- [x] Build passes clean
- Media picker deferred to Phase 3 (URL inputs work)
