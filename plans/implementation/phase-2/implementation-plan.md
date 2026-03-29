# Phase 2: Implementation Plan — Master Checklist

**Last Updated:** 2026-03-29
**Status:** READY TO START

---

## Sub-Phase 2.1 — CSS Consolidation (P0)

**Goal:** One consistent color system. No dual palette/colors. No hardcoded white text.
**DoD:** Zero inline color styles except gradients. All text colors cascade from section.style.color.

- [ ] Remove `colors` block from all 10 theme JSONs — palette only
- [ ] Remove `themeColorsSchema` from masterConfig.ts (or mark fully deprecated)
- [ ] Update `resolveColors.ts` to only read palette (no fallback to colors)
- [ ] Audit all renderers: `color: section.style.color` on `<section>`, `text-inherit` on children
- [ ] Remove all `text-theme-text` / `text-theme-muted` from renderers (use inherit + opacity)
- [ ] Audit: zero `text-white` or `border-white` outside HeroOverlay.tsx
- [ ] Update `default-config.json` — remove colors block
- [ ] Update `template-config.json` — remove colors block
- [ ] Verify: all 10 themes render correctly after migration
- [ ] Build passes clean

---

## Sub-Phase 2.2 — Section Routing + Edit UX (P0)

**Goal:** Right panel shows the correct editor for whichever section is selected.
**DoD:** Click hero → hero editor. Click features → features editor. Click CTA → CTA editor.

- [ ] Right panel dispatches to per-type editor based on `selectedContext.sectionId` → `section.type`
- [ ] Create `FeaturesSectionSimple.tsx` — stub with Layout + Content accordions
- [ ] Create `CTASectionSimple.tsx` — stub with Layout + Content accordions
- [ ] Click section in left panel → right panel switches to that section's editor
- [ ] Click section in main preview → right panel switches (add edit icon hover overlay)
- [ ] Right panel header shows section type + ID (e.g., "HERO • hero-01")
- [ ] Section dropdown in right panel header to switch between sections
- [ ] Un-hide Features and CTA sections in RealityTab (remove hero-only filter)

---

## Sub-Phase 2.3 — Media Pickers (P1)

**Goal:** Browse and select images/videos from the library instead of pasting URLs.
**DoD:** Click image field → picker opens → thumbnails grid → click to select → URL inserted.

- [ ] Create shared `MediaPickerDialog.tsx` component (shadcn Dialog)
- [ ] Image picker mode: shows thumbnails from `media.json` library.images (50 items)
- [ ] Video picker mode: shows thumbnails/previews from `media.json` library.videos (20 items)
- [ ] Filter by category (saas, agency, portfolio, etc.)
- [ ] "Add URL" tab: paste custom URL with preview
- [ ] On select: updates the component's `props.url` in configStore
- [ ] Gradient picker for section backgrounds (simple: 5-6 preset gradients + custom angle)
- [ ] Wire picker buttons into Layout accordion (replace plain URL text inputs)
- [ ] Image/video upload → deferred to Phase 5 (requires Supabase storage)

---

## Sub-Phase 2.4 — Section Editors (P1)

**Goal:** Features, CTA, and Footer sections have SIMPLE tab editors matching the hero pattern.
**DoD:** Each section type has Layout + Style + Content accordions. Changes update preview.

### Features Editor
- [ ] Layout accordion: grid columns (2/3/4), card style (flat/bordered/shadow)
- [ ] Content accordion: per-card editing (icon picker, title, description) with toggle
- [ ] Add/remove feature cards
- [ ] FeaturesGrid renderer respects all edits

### CTA Editor
- [ ] Layout accordion: variant (simple/split), background style
- [ ] Content accordion: heading, subtitle, button text + URL with toggles
- [ ] CTASimple renderer respects all edits

### Footer Editor
- [ ] Layout accordion: column count (1-4), style
- [ ] Content accordion: links, social icons, copyright text
- [ ] Create `FooterSimple.tsx` renderer
- [ ] Create `FooterSectionSimple.tsx` editor

---

## Sub-Phase 2.5 — Light/Dark Mode (P1)

**Goal:** Light/dark toggle actually changes the visual appearance (not just a mode flag).
**DoD:** Switching to light mode on a dark theme produces a visible light variant.

- [ ] Add `lightPalette` to each dark theme JSON (inverted palette)
- [ ] Add `darkPalette` to each light theme JSON (inverted palette)
- [ ] `toggleMode()` swaps between palette and lightPalette/darkPalette
- [ ] Update all section styles when palette swaps (walk sections, update colors)
- [ ] Detect system preference on first load (`prefers-color-scheme`)
- [ ] Persist mode preference in localStorage

---

## Sub-Phase 2.6 — Playwright Testing (P1)

**Goal:** Automated tests for all Phase 1 + Phase 2 features.
**DoD:** Full test suite passes. Screenshots for all themes.

- [ ] Theme switch: select each of 10 themes → verify JSON + preview changes
- [ ] Layout change: select each of 8 layouts → verify variant + component visibility
- [ ] Copy edit: type in headline → verify JSON + preview updates
- [ ] Component toggle: toggle each component → verify visual show/hide
- [ ] Responsive preview: switch device widths → verify canvas width changes
- [ ] Undo/redo: make changes → undo → verify previous state restored
- [ ] LocalStorage: make changes → reload → verify state persisted
- [ ] Export/Import: export JSON → import → verify state matches
- [ ] Media picker: open picker → select image → verify URL updated
- [ ] Screenshot all 10 themes (SaaS through Minimalist)

---

## Sub-Phase 2.7 — Polish (P2)

**Goal:** Remaining quality items from Phase 1 backlog.

- [ ] Accessibility dialog (doc 07 spec): appearance, textScale, contrast, reduceMotion
- [ ] XAI Docs HUMAN view: generate structured spec from current config
- [ ] XAI Docs AISP view: generate @aisp formatted syntax
- [ ] Listen mode visual: red orb render, dark overlay transition, pulse animation
- [ ] Google Fonts dynamic loading from fonts.json URLs
- [ ] Workflow tab: mock pipeline stepper with simulated progress
- [ ] Section click-to-select with dashed border in Reality tab
- [ ] "+ Add Section" dropdown with section type picker

---

## Verification (Phase 2 Complete)

- [ ] All 10 themes render correctly with palette-only colors
- [ ] 3 section types editable in SIMPLE tab (hero, features, CTA)
- [ ] Footer section renders and is editable
- [ ] Media picker works for images and videos
- [ ] Light/dark toggle visually changes the preview
- [ ] Playwright test suite passes (all tests green)
- [ ] Build passes clean
- [ ] Score ≥ 80% on rubric
