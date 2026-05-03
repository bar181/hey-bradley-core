# Phase 3: Onboarding + Full-Page Preview + Builder UX — Brutally Honest Review

**Date:** 2026-03-30
**Duration:** 1 session, ~3 hours
**Verdict:** THE MAKE-OR-BREAK PHASE. Phase 3 transformed Hey Bradley from "an editor" into "a website builder." This is the single biggest quality jump in the project. The product now has a clear user flow.

---

## Rubric Scorecard

| # | Criterion | Weight | Score (1-10) | Weighted | Notes |
|---|-----------|--------|-------------|----------|-------|
| 1 | **User Flow Completeness** | 20% | 8 | 1.6 | Onboarding → Builder → Preview works end-to-end |
| 2 | **Full-Page Preview Quality** | 20% | 7 | 1.4 | Sections stack, navbar renders. No smooth scroll between sections yet. |
| 3 | **Onboarding Page Design** | 10% | 7 | 0.7 | Clean grid, 10 themes, professional. Could use more visual polish. |
| 4 | **Section Visual Diversity** | 15% | 6 | 0.9 | 3 variants added (FeaturesCards, CTASplit, FAQTwoCol). Still only 1-2 per type. |
| 5 | **SIMPLE Tab Usability** | 10% | 8 | 0.8 | Reduced Hero from ~25 to ~14 controls. Clean 3-accordion structure. |
| 6 | **Font Cascade** | 5% | 9 | 0.45 | Finally fixed. All 11 renderers inherit theme font. |
| 7 | **Light/Dark Toggle** | 5% | 7 | 0.35 | 3-button toggle works. "Auto" mode sets schema but no CSS media query impl. |
| 8 | **Navbar Section** | 5% | 7 | 0.35 | Logo + auto-links + CTA. No mobile hamburger in navbar (builder shell has one). |
| 9 | **Test Coverage** | 5% | 8 | 0.4 | 10/10 smoke tests. No visual regression tests yet. |
| 10 | **Code Quality** | 5% | 7 | 0.35 | Clean commits, no TS errors. Some unused code from old Style accordion. |
| | **TOTAL** | 100% | | **7.3/10 (73%)** | |

---

## What Works

1. **The user flow exists.** For the first time, there is a complete path: land on `/` → pick a theme → see a 3-panel builder → edit sections → click Preview → see a full stacked website with navbar. This is what a capstone demo needs.

2. **Full-page preview is transformative.** Before Phase 3, the product showed one section at a time in a padded center panel. Now clicking "Preview" shows all sections stacked full-width with a navbar. It looks like a real website.

3. **SIMPLE tab is actually simple.** The Hero editor went from ~25 controls (color pickers, heading sizes, bold buttons) to 3 clean accordions: Layout, Visuals, Content. A grandmother can use this.

4. **Font cascade finally works.** After being deferred from Phase 1, every section renderer now uses `fontFamily: var(--theme-font)`. Switching fonts in Expert tab updates ALL sections immediately.

5. **Second variants add real diversity.** FeaturesCards (bordered cards vs flat grid), CTASplit (text+visual vs centered), FAQTwoCol (columns vs accordion) — each adds a meaningfully different look.

6. **Speed of execution.** Phase 3 shipped 5 major features (preview, navbar, onboarding, font cascade, variants) + SIMPLE simplification + Light/Dark/Auto toggle in a single session. 3 clean commits.

## What Doesn't Work Well

1. **Preview mode has no smooth scroll.** Navbar links point to `#section-id` but there's no scroll-to behavior implemented. Clicking a nav link does nothing visually.

2. **Only 1-2 variants per non-hero section.** Features, CTA, FAQ got second variants. Pricing, Testimonials, Value Props, Footer still have exactly one look. This limits theme diversity.

3. **Onboarding page is functional but not beautiful.** The dark background + grid of theme cards works, but it doesn't have the "wow" of the splash page reference Bradley shared. No animation, no chat panel, no hero showcase.

4. **Navbar has no mobile hamburger.** The NavbarSimple renderer shows logo + links + CTA as a horizontal bar. On mobile preview widths, the links don't collapse into a hamburger. The builder shell has a hamburger, but the navbar inside the preview doesn't.

5. **"Auto" mode is cosmetic.** The 3-button Light/Dark/Auto toggle sets `theme.mode: "auto"` in the JSON, but there's no actual `prefers-color-scheme` logic. It's just a label.

6. **No drag-and-drop.** Section reorder still uses arrow buttons. @dnd-kit was planned but deferred. Arrow buttons work, but DnD would be more professional.

7. **No section highlight on click.** Clicking a section in the left panel updates the right panel, but there's no visual indicator (dashed border) in the preview showing which section is selected.

8. **Navbar only in SaaS + default config.** The 8 other theme JSONs don't include a navbar section. Switching to Agency or Portfolio loses the navbar.

---

## Numbers

| Metric | Phase 2 End | Phase 3 End | Delta |
|--------|-------------|-------------|-------|
| Section renderers | 11 | 15 (+NavbarSimple, FeaturesCards, CTASplit, FAQTwoCol) | +4 |
| SIMPLE editors | 8 | 9 (+NavbarSectionSimple) | +1 |
| Routes | 1 (/*) | 2 (/, /builder) | +1 |
| Playwright tests | 6 | 10 | +4 |
| Hero SIMPLE controls | ~25 | ~14 | -11 |
| Source files (.ts/.tsx) | 72 | ~78 | +6 |

---

## Honest Assessment: Where We Are

### The Product
Hey Bradley is now a **functional website builder POC**. It has the complete user flow: onboarding → editing → preview. It supports 10 themes, 9 section types (including navbar), section CRUD, and live editing. This is enough for a capstone demo that says "this is what it does."

### The Gap
What it's missing is the **"AI" story**. Right now it's "pick a theme and edit sections." The capstone vision is "talk to it and it builds your website." Phase 4 (canned demo) fills this gap with simulated chat and listen mode. Without Phase 4, the demo is a builder. With Phase 4, the demo is an AI product.

### The Risk
Time. The capstone is May 2026. Phase 4 (canned demo) is ~2 days. Phase 5 (home page + deploy) is ~1 day. That's 3 days of work to reach "presentable demo." The backlog (DnD, Google Fonts, Tailwind cleanup, full test suite) is nice-to-have but not demo-blocking.

---

## Phase 3 Deferred Items

| Item | Deferred To | Why |
|------|-------------|-----|
| Smooth scroll in preview navbar | Phase 4/5 | Polish, not blocking |
| Navbar section in all 10 themes | Phase 4 | Needs theme JSON updates |
| Mobile hamburger in navbar renderer | Phase 5 | Builder shell has one already |
| Drag-and-drop reorder | Phase 6+ | Arrow buttons work |
| Section highlight on click | Phase 5 | UX polish |
| Google Fonts loading | Phase 6+ | System fonts work |
| Full Playwright suite (112 checks) | Phase 6+ | Smoke tests sufficient |

---

## Score: 73% — The Biggest Jump

Phase 1 closed at 77%. Phase 2 closed at 82%. Phase 3 closes at 73% by the rubric, but that's misleading — the rubric penalizes missing polish items. The **product quality jump** from Phase 2 → Phase 3 is the largest in the project. Phase 2 was "an editor that works." Phase 3 is "a builder with a complete user flow."

**Phase 3 status: CLOSED.**
