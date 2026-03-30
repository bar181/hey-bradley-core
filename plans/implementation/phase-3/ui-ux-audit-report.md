# Hey Bradley — Phase 3 Comprehensive UI/UX Audit Report

**Date:** 2026-03-30
**URL:** http://localhost:5173/
**Tool:** Playwright 1.58.2 (headless Chromium) + visual inspection
**Routes tested:** `/` (onboarding), `/builder` (3-panel editor)

---

## Summary Table

| # | Category | Score (1-5) | Key Finding |
|---|----------|:-----------:|-------------|
| 1 | Onboarding Page | 4 | Clean grid, all 10 themes, navigation works. Needs design polish. |
| 2 | Builder Layout | 4 | Three panels render correctly. TopBar responsive. |
| 3 | Preview Mode | 4 | Sections stack, navbar renders. No smooth scroll. |
| 4 | Section Editors | 4 | All 9 editors work. Hero simplified. Variant selectors present. |
| 5 | Theme Switching | 5 | All 10 themes render without errors. Visual diversity good. |
| 6 | Section CRUD | 4 | Add/remove/duplicate work with theme-aware defaults. |
| 7 | Font Cascade | 4 | All renderers inherit theme font. Working correctly. |
| 8 | Light/Dark Toggle | 3 | Toggle works but "Auto" mode is cosmetic only. |
| 9 | Accessibility | 3 | aria-labels present. Some contrast issues remain. No skip link. |
| 10 | Responsive | 3 | Hamburger menu works. Onboarding responsive. Builder is desktop-first. |
| | **Overall** | **3.8/5** | **Functional POC. Needs Phase 4 "wow factor" and Phase 5 polish.** |

---

## 1. Onboarding Page (/)

**Score: 4/5**

**Passes:**
- "Hey Bradley" title and "Pick a theme to start building" subtitle visible
- All 10 theme cards render in a responsive grid (2 cols mobile, 4 cols desktop)
- Each card shows theme name, description, mood, and a mini-preview with actual theme colors
- Click any theme → navigates to `/builder` with that theme loaded
- "or start from scratch →" link at bottom
- No console errors

**Issues:**
- P1: Theme card descriptions are truncated on some cards at smaller widths
- P1: No "Continue editing" button visible (requires saved project in localStorage — correct behavior, but empty state has no affordance)
- P2: The page is functional but not "wow" — no animation, no hero showcase, no chat panel like the splash reference from Bradley
- P2: Dark background only — no option for light onboarding page

**Screenshot:** `tests/screenshots/onboarding.png`

---

## 2. Builder Layout (/builder)

**Score: 4/5**

**Passes:**
- Three-panel layout renders (left ~20%, center ~55%, right ~25%)
- All 4 tabs navigable (REALITY, DATA, XAI DOCS, WORKFLOW)
- Left panel shows section list: Navbar, Theme, Hero, Features, Call to Action, etc.
- Right panel context switches: click Theme → theme cards + Light/Dark/Auto toggle
- TopBar: HB logo, LISTEN/BUILD toggle, Preview/Edit button, undo/redo, device toggles
- StatusBar at bottom with READY indicator

**Issues:**
- P1: Navbar section appears in left panel section list but shows with "-01" ID suffix — could be cleaner
- P2: The "XAI DOCS" and "WORKFLOW" tabs show placeholder content
- P2: Left panel chat input at bottom is non-functional (placeholder for Phase 4)

**Screenshot:** `tests/screenshots/builder-default.png`

---

## 3. Preview Mode

**Score: 4/5**

**Passes:**
- Preview button visible in TopBar desktop controls
- Click Preview → left and right panels hide, center goes full-width
- All enabled sections render stacked vertically
- Navbar renders at top with "Hey Bradley" logo + auto-generated section links + "Get Started" CTA
- StatusBar hides in preview mode
- Button changes to "Edit" with PenLine icon
- Escape key returns to editor

**Issues:**
- P1: Navbar links (Features, Pricing, etc.) don't scroll to sections — `href="#section-id"` but no scroll-to behavior
- P1: Only Hero section enabled by default — other sections are `enabled: false`. Preview shows just navbar + hero unless user manually enables sections.
- P2: No transition animation when entering/exiting preview mode

---

## 4. Section Editors

**Score: 4/5**

**Passes:**
- Hero: 3 clean accordions (Layout, Visuals, Content). 8 layout wireframes. Single media URL. Badge/headline/subtitle/CTA inputs with char counts and toggles.
- Features: Grid/Cards variant selector + grid column selector + per-card editing
- Pricing: Per-tier name/price/period/features/CTA editing + highlighted toggle
- CTA: Centered/Split variant selector + heading/subtitle/button
- FAQ: Accordion/Two Column variant selector + Q&A pairs
- Testimonials: Per-testimonial quote/author/role
- Value Props: Per-stat value/label/description
- Footer: Brand/columns/copyright
- Navbar: Logo text + CTA toggle

**Issues:**
- P1: No data-testid on variant selector buttons (Features Grid/Cards, CTA Centered/Split, FAQ Accordion/Two Column)
- P2: Feature card add/remove buttons could have more visible affordance

---

## 5. Theme Switching

**Score: 5/5**

**Passes:**
- All 10 themes render without errors (verified via Playwright regression test)
- Each theme produces visually distinct hero: different layout, colors, fonts, components
- Light/Dark/Auto toggle works (Light/Dark swap palettes, Auto sets schema)
- Theme cards in right panel show accurate mini-previews
- No React error boundaries or console errors across all 10 themes

---

## 6. Section CRUD

**Score: 4/5**

**Passes:**
- "Add Section" opens picker with all 9 section types (including Navbar)
- New sections pull template from current theme JSON with real sample content
- Remove section with double-click confirmation
- Duplicate section works
- Reorder via up/down arrow buttons
- Section enable/disable toggle (eye icon)

**Issues:**
- P2: No drag-and-drop reorder (deferred to backlog)
- P2: Adding a section type that already exists in the theme duplicates it rather than warning

---

## 7. Font Cascade

**Score: 4/5**

**Passes:**
- All 11 section renderers have `fontFamily: var(--theme-font)`
- Switching font in Expert tab updates all sections
- Theme switching updates font correctly

**Issues:**
- P2: Google Fonts not dynamically loaded — only works if the font is installed on the user's system or available as a web font

---

## 8. Light/Dark Toggle

**Score: 3/5**

**Passes:**
- 3-button segmented control (Light/Auto/Dark) in Theme SIMPLE
- Light/Dark correctly swap palettes and update all sections
- Separate Light/Dark toggle in Hero Visuals accordion

**Issues:**
- P1: "Auto" mode sets `theme.mode: "auto"` but has no `prefers-color-scheme` logic
- P1: Builder chrome Light/Dark (TopBar sun/moon icon) is separate from theme Light/Dark — potentially confusing
- P2: Some theme JSONs may not have complete light/dark palette pairs

---

## 9. Accessibility

**Score: 3/5**

**Passes:**
- aria-labels on chat input, mic button, send button
- aria-labels on all TopBar icon buttons
- Focus-visible rings on section action buttons
- 12px minimum font size enforced on most elements
- Heading hierarchy (single h1 in preview)

**Issues:**
- P1: No skip navigation link
- P1: No `<nav>` landmarks around tab bars
- P1: Some theme card labels in right panel may have low contrast on light backgrounds
- P2: `<div role="button">` used for section items instead of `<button>`
- P2: Icon buttons still use `title` instead of `aria-label` in some places

---

## 10. Responsive

**Score: 3/5**

**Passes:**
- TopBar hamburger menu appears below md breakpoint
- Hamburger dropdown has undo/redo, device preview, dark/light, share
- Onboarding page responsive: 2 cols on mobile, 3-4 on desktop

**Issues:**
- P1: Builder 3-panel layout doesn't collapse on mobile — panels become extremely narrow
- P1: Navbar in preview has no mobile hamburger (links overflow on narrow viewports)
- P2: Right panel content overflows horizontally at very narrow widths

**Screenshot:** `tests/screenshots/responsive-mobile.png`

---

## P0 Blockers (Must Fix Before Phase 4)

None identified. The product is functional.

## P1 Issues (Should Fix)

| # | Issue | Category | Effort |
|---|-------|----------|--------|
| 1 | Navbar links don't scroll to sections in preview | Preview | Medium |
| 2 | Most sections disabled by default — preview shows only hero | Preview | Small (enable sections in default config) |
| 3 | "Auto" mode is cosmetic only | Light/Dark | Small (document as intentional for POC) |
| 4 | Builder chrome L/D vs theme L/D confusion | Light/Dark | Medium (unify or document) |
| 5 | No skip navigation link | a11y | Small |
| 6 | No `<nav>` landmarks | a11y | Small |
| 7 | Builder doesn't collapse on mobile | Responsive | Large (defer to Phase 5) |
| 8 | Navbar no mobile hamburger in preview | Responsive | Medium |

## P2 Nice-to-Haves

| # | Issue | Category |
|---|-------|----------|
| 1 | Onboarding page needs more "wow" (animation, hero showcase) | Design |
| 2 | No smooth transition entering/exiting preview | UX |
| 3 | Google Fonts not loaded | Typography |
| 4 | No drag-and-drop reorder | UX |
| 5 | XAI DOCS and WORKFLOW tabs are placeholders | Content |

---

## Recommendations for Phase 4

1. **Enable 3-5 sections by default** so preview mode shows a complete website, not just hero
2. **Add smooth scroll** to navbar links in preview (small CSS addition)
3. **XAI Docs and Workflow tabs** are the Phase 4 deliverables — they'll fill the placeholder content
4. **Chat input** will become functional in Phase 4 with canned responses
5. **Listen mode simulation** will add the "wow" that the onboarding page currently lacks

---

## Screenshots

| File | Description |
|------|-------------|
| `tests/screenshots/onboarding.png` | Onboarding page with 10 theme cards |
| `tests/screenshots/builder-default.png` | Builder 3-panel layout (SaaS theme) |
| `tests/screenshots/responsive-mobile.png` | Mobile 375px view of onboarding |
| `tests/screenshots/responsive-tablet.png` | Tablet 768px view |
