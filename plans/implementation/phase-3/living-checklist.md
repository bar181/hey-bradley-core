# Phase 3: Living Checklist

**Purpose:** Single source of truth for Phase 3 acceptance criteria. Updated after each sub-phase.

---

## Onboarding Page (3.1)

| # | Check | Severity |
|---|-------|----------|
| O1 | `/` route renders onboarding page (not builder) | P0 |
| O2 | 10 theme cards visible with distinct previews | P0 |
| O3 | Click theme → navigates to `/builder` with that theme loaded | P0 |
| O4 | "Start from scratch" option loads default config | P0 |
| O5 | Page looks professional (gradient bg, typography, spacing) | P1 |
| O6 | "Describe your site" textarea visible as placeholder | P2 |

## Navbar Section (3.2)

| # | Check | Severity |
|---|-------|----------|
| N1 | Navbar renders at top of preview in builder | P0 |
| N2 | Navbar shows logo text from config | P0 |
| N3 | Navbar auto-generates links from enabled sections | P0 |
| N4 | SIMPLE editor: edit logo text, toggle section links | P0 |
| N5 | Navbar uses theme colors (accent for links, bg from palette) | P1 |
| N6 | Navbar is sticky in full-page preview | P1 |

## Full-Page Preview (3.3)

| # | Check | Severity |
|---|-------|----------|
| P1 | Preview toggle button visible in TopBar | P0 |
| P2 | Toggle hides left + right panels | P0 |
| P3 | All enabled sections render stacked vertically | P0 |
| P4 | Navbar at top, footer at bottom | P0 |
| P5 | Sections use full viewport width | P1 |
| P6 | Smooth scroll between sections via navbar links | P1 |
| P7 | Press Escape returns to builder view | P1 |

## Section Variants (3.4)

| # | Check | Severity |
|---|-------|----------|
| V1 | At least 2 variants exist per non-hero section type | P1 |
| V2 | Variant selector visible in Layout accordion | P1 |
| V3 | Switching variant changes the render without losing content | P1 |

## Drag-and-Drop (3.5)

| # | Check | Severity |
|---|-------|----------|
| D1 | Drag handle visible on section items in left panel | P1 |
| D2 | Dragging reorders sections in preview | P1 |
| D3 | Visual feedback during drag (placeholder, opacity) | P2 |

## Builder UX (3.6)

| # | Check | Severity |
|---|-------|----------|
| U1 | Click section in preview highlights it with dashed border | P2 |
| U2 | Empty sections panel shows "Add your first section" | P2 |

---

## Phase 3 Pass Criteria

| Severity | Rule |
|----------|------|
| P0 failures | **BLOCKING** — cannot close Phase 3 |
| P1 failures | Should fix, can close with documented exceptions |
| P2 failures | Log for backlog |

**Overall pass:** Zero P0 failures + fewer than 3 P1 failures.
