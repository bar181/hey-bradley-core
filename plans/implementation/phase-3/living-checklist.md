# Phase 3: Living Checklist — FINAL STATUS

**Last Updated:** 2026-03-30 (Phase 3 close)

---

## Onboarding Page (3.1) — DONE

| # | Check | Severity | Status |
|---|-------|----------|--------|
| O1 | `/` route renders onboarding page | P0 | PASS |
| O2 | 10 theme cards visible with distinct previews | P0 | PASS |
| O3 | Click theme → navigates to `/builder` with that theme loaded | P0 | PASS |
| O4 | "Start from scratch" option loads default config | P0 | PASS |
| O5 | Page looks professional | P1 | PASS (functional, not "wow") |
| O6 | "Describe your site" textarea placeholder | P2 | DEFERRED to Phase 4 |

## Navbar Section (3.2) — DONE

| # | Check | Severity | Status |
|---|-------|----------|--------|
| N1 | Navbar renders at top of preview | P0 | PASS |
| N2 | Navbar shows logo text from config | P0 | PASS |
| N3 | Navbar auto-generates links from enabled sections | P0 | PASS |
| N4 | SIMPLE editor: logo text + CTA text inputs | P0 | PASS |
| N5 | Navbar uses theme colors | P1 | PASS |
| N6 | Navbar sticky in full-page preview | P1 | PASS |

## Full-Page Preview (3.3) — DONE

| # | Check | Severity | Status |
|---|-------|----------|--------|
| P1 | Preview toggle button visible in TopBar | P0 | PASS |
| P2 | Toggle hides left + right panels | P0 | PASS |
| P3 | All enabled sections render stacked vertically | P0 | PASS |
| P4 | Navbar at top | P0 | PASS |
| P5 | Sections use full viewport width | P1 | PASS |
| P6 | Smooth scroll via navbar links | P1 | FAIL — links don't scroll |
| P7 | Press Escape returns to builder view | P1 | PASS |

## Section Variants (3.4) — DONE

| # | Check | Severity | Status |
|---|-------|----------|--------|
| V1 | At least 2 variants for Features, CTA, FAQ | P1 | PASS (FeaturesCards, CTASplit, FAQTwoCol) |
| V2 | Variant selector visible in Layout accordion | P1 | PASS |
| V3 | Switching variant changes render without losing content | P1 | PASS |

## Drag-and-Drop (3.5) — DEFERRED

| # | Check | Severity | Status |
|---|-------|----------|--------|
| D1 | Drag handle on section items | P1 | DEFERRED to backlog |
| D2 | Dragging reorders sections | P1 | DEFERRED (arrows work) |

## Builder UX (3.6) — PARTIAL

| # | Check | Severity | Status |
|---|-------|----------|--------|
| U1 | Click section highlights it in preview | P2 | DEFERRED |
| U2 | Empty sections panel shows helpful message | P2 | DEFERRED |

## Additional Items (Added During Phase 3)

| # | Check | Severity | Status |
|---|-------|----------|--------|
| A1 | Font cascade: all renderers inherit theme font | P1 | PASS |
| A2 | SIMPLE tab simplified (Hero ~14 controls, not ~25) | P1 | PASS |
| A3 | Light/Dark/Auto 3-button toggle in Theme SIMPLE | P1 | PASS |
| A4 | Navbar section type added to schema + section maps | P0 | PASS |

---

## Phase 3 Pass Criteria

| Severity | Rule | Result |
|----------|------|--------|
| P0 failures | BLOCKING | **0 P0 failures — PASS** |
| P1 failures | < 3 allowed | **1 P1 failure (smooth scroll) — PASS** |
| P2 failures | Log for backlog | 3 deferred |

**Phase 3: PASSED**
