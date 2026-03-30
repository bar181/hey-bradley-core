# Hey Bradley — Accessibility Audit Results

**Date:** 2026-03-29
**URL tested:** http://localhost:5173/
**Tool:** Playwright 1.58.2 (headless Chromium)
**Standard:** WCAG 2.2 Level AA
**Checklist:** `plans/intial-plans/accessibility-checklist.md`
**Accessibility Dialog Spec:** `plans/intial-plans/07.accessibility-button.md`

---

## Summary

| Category | Pass | Fail | Partial | Total |
|----------|------|------|---------|-------|
| Color Contrast | 53 | 9 | 0 | 62 |
| Font Sizes | ~128 | 8 | 0 | ~136 |
| Keyboard/Focus | 18 | 2 | 0 | 20 |
| ARIA Labels | ~40 | 5 | 0 | ~45 |
| Images/Alt Text | 1 | 0 | 0 | 1 |
| Heading Hierarchy | PASS | — | — | — |
| HTML/Landmarks | 4 | 2 | 0 | 6 |

**Overall verdict:** The builder shell has a solid foundation (semantic HTML, focus visible via browser defaults, good heading structure). The primary gaps are color contrast failures across themes and the builder chrome, missing input labels, and a few icon buttons without accessible names.

---

## 1. Color Contrast

**WCAG 1.4.3 Contrast (Minimum) — P0**

### FAILURES

| Element | Text | Foreground | Background | Ratio | Required | Location |
|---------|------|-----------|------------|-------|----------|----------|
| `<span>` | "V1.0.0-RC1" | `rgba(255,255,255,0.8)` | `rgb(255,255,255)` | **1.00:1** | 4.5:1 | TopBar version badge |
| `<button>` | "REALITY" | `rgb(165,28,48)` | `rgb(30,30,30)` | **2.23:1** | 4.5:1 | Center canvas tab (active) |
| `<a>` | "Start Building" | `rgb(10,10,26)` | `rgb(99,102,241)` | **4.39:1** | 4.5:1 | Hero CTA button |
| `<button>` | "SIMPLE" | `rgb(165,28,48)` | `rgb(30,30,30)` | **2.23:1** | 4.5:1 | Right panel tab (active) |
| `<div>` | "Agency" | `rgb(243,243,241)` | `rgb(255,255,255)` | **1.11:1** | 4.5:1 | Theme card label (right panel) |
| `<div>` | "Blog" | `rgb(243,243,241)` | `rgb(250,248,245)` | **1.05:1** | 4.5:1 | Theme card label (right panel) |
| `<div>` | "Personal" | `rgb(243,243,241)` | `rgb(255,255,255)` | **1.11:1** | 4.5:1 | Theme card label (right panel) |
| `<div>` | "Professional" | `rgb(243,243,241)` | `rgb(255,255,255)` | **1.11:1** | 4.5:1 | Theme card label (right panel) |
| `<div>` | "Minimalist" | `rgb(243,243,241)` | `rgb(255,255,255)` | **1.11:1** | 4.5:1 | Theme card label (right panel) |

### Analysis

**Critical issues (ratio < 2:1):**

1. **Version badge text** (1.00:1) — White-on-white. The `rgba(255,255,255,0.8)` foreground is effectively invisible on a white-ish background. This is likely a dark-theme color leaking into light context, or the background calculation picked up the wrong ancestor.

2. **Theme card labels** (1.05-1.11:1) — Near-white text `rgb(243,243,241)` on white/cream backgrounds. These theme name labels in the right panel have virtually no contrast. The theme cards appear to be rendering with dark-theme text colors on a light background.

**Moderate issues (ratio 2-4.5:1):**

3. **Active tab indicators** (2.23:1) — The crimson `rgb(165,28,48)` used for active REALITY/SIMPLE tabs against the dark panel background `rgb(30,30,30)` fails. Crimson on near-black needs to be brighter or the background lighter.

4. **"Start Building" CTA** (4.39:1) — Very close to passing at 4.39:1 vs the 4.5:1 requirement. The dark text on indigo background needs a slight bump. Since the text is 14px/600 weight, it does not qualify as large text (would need 14px/700+).

### PASSES (53 elements sampled)

Key passing elements:
- "HB" logo: 18.15:1 (white on dark maroon)
- "Untitled Project": 18.15:1
- Mode toggle text: 16.34:1
- Most body text in Reality canvas preview: passing

### Recommendations

| Fix | Effort | Phase |
|-----|--------|-------|
| Change active tab color from crimson to a lighter variant (e.g., `rgb(220,60,80)`) on dark backgrounds | Small | Phase 2 |
| Fix theme card label colors — use `--hb-text-primary` which resolves to dark text on light backgrounds | Small | Phase 2 |
| Bump "Start Building" CTA text to bold 700 (qualifying as large text at 3:1) or darken the text | Small | Phase 2 |
| Fix version badge — use `--hb-text-muted` on dark backgrounds, not white-on-white | Small | Phase 2 |
| Phase 4 accessibility dialog adds "Enhanced" and "High" contrast modes for all themes | — | Phase 4 |

---

## 2. Font Sizes

**WCAG 1.4.4 Resize Text — P1**

### FAILURES (< 12px)

| Element | Text | Size | Location |
|---------|------|------|----------|
| `<span>` | "LISTEN" | 11px | TopBar mode toggle |
| `<span>` | "BUILD" | 11px | TopBar mode toggle |
| `<p>` | "Trusted by 500+ teams worldwide" | 11px | Hero section social proof |
| `<span>` | "THEME CONFIGURATION" | 11px | Right panel section label |
| `<button>` | "SIMPLE" | 11px | Right panel tab |
| `<button>` | "EXPERT" | 11px | Right panel tab |
| `<span>` | "AISP Spec V1.2" | 11px | StatusBar |
| `<span>` | "Tab: SIMPLE Connected" | 11px | StatusBar |

### Font Size Distribution

| Size | Count | Notes |
|------|-------|-------|
| 56px | 1 | Hero heading |
| 20px | 1 | Subheadings |
| 18px | 1 | Logo "HB" |
| 16px | 83 | Body text (good default) |
| 14px | 11 | Secondary text |
| 12px | 31 | Labels, captions |
| 11px | 13 | **Below minimum** |

### Analysis

All 11px text is in the builder chrome (TopBar, StatusBar, panel tabs, section labels). This is the mono-spaced UI chrome text using `text-[11px]` Tailwind classes. While the builder chrome is not end-user-facing content, it still needs to be readable for all builder users including those with visual impairments.

### Recommendations

| Fix | Effort | Phase |
|-----|--------|-------|
| Change `text-[11px]` to `text-xs` (12px) across builder chrome components | Small | Phase 2 |
| Phase 4 "Accessible" text scale setting increases base to 20px with 44px touch targets | — | Phase 4 |

---

## 3. Keyboard Navigation & Focus Indicators

**WCAG 2.4.7 Focus Visible, 2.1.1 Keyboard — P0**

### Tab Order Test (first 20 Tab presses)

| # | Element | Text | Visible Focus? |
|---|---------|------|---------------|
| 1 | `<button>` | LISTEN | YES — `auto 1px` outline |
| 2 | `<button>` | BUILD | YES |
| 3 | `<button>` | (dark mode toggle) | YES |
| 4 | `<button>` | (undo) | YES |
| 5 | `<button>` | (redo) | YES |
| 6 | `<button>` | (desktop preview) | YES |
| 7 | `<button>` | (tablet preview) | YES |
| 8 | `<button>` | Share | YES |
| 9 | `<div role="button">` | Theme | YES |
| 10 | `<div role="button">` | Hero | YES |
| 11 | `<button>` | (section action) | YES |
| 12 | `<button>` | (section action) | YES |
| 13 | `<button>` | (section action) | YES |
| 14 | `<button>` | (section action) | **NO** — outline 0px |
| 15 | `<div role="button">` | Features | YES |
| 16 | `<button>` | (section action) | YES |
| 17 | `<button>` | (section action) | YES |
| 18 | `<button>` | (section action) | YES |
| 19 | `<button>` | (section action) | YES |
| 20 | `<button>` | (section action) | **NO** — outline 0px |

### Analysis

**Mostly passing.** Browser default `auto 1px` outline is functional but minimal. 18 of 20 tabbed elements showed visible focus. Two icon buttons (appear to be the "delete section" buttons at positions 14 and 20) lost their focus indicators — likely due to `outline: none` in their CSS without a replacement focus style.

**Issues:**
1. Two buttons have no visible focus indicator at all (P0 violation of 2.4.7)
2. The `auto 1px` browser default outline is thin and may not meet the WCAG 2.4.13 Focus Appearance criteria (minimum 2px contrasting indicator)
3. `<div role="button">` elements for section accordion items are keyboard-accessible (good) but use non-semantic elements

### Recommendations

| Fix | Effort | Phase |
|-----|--------|-------|
| Add `focus-visible:ring-2 focus-visible:ring-hb-accent` to all interactive elements | Medium | Phase 2 |
| Fix the 2 buttons with `outline: none` that have no replacement focus style | Small | Phase 2 |
| Consider replacing `<div role="button">` with `<button>` for section items | Medium | Phase 3 |

---

## 4. ARIA Labels & Accessible Names

**WCAG 4.1.2 Name, Role, Value — P0**

### Buttons Without Accessible Names

3 buttons were found with **no text, no aria-label, no title, no aria-labelledby**:

| # | Element | Text Content | Context |
|---|---------|-------------|---------|
| 1 | `<button>` | (empty) | Appears to be in the bottom chat area |
| 2 | `<button>` | (empty) | Appears to be in the bottom chat area |
| 3 | `<button>` | (empty) | Unknown — possibly a collapse/expand toggle |

These are P0 failures. A screen reader will announce them only as "button" with no indication of purpose.

### Buttons Using `title` Instead of `aria-label`

Many icon buttons use `title` for their accessible name. While technically valid, `aria-label` is the preferred method:

- "Switch to light mode" (title)
- "Undo (Ctrl+Z)" (title)
- "Redo (Ctrl+Shift+Z)" (title)
- "Preview at desktop/tablet/mobile" (title)
- "Disable/Enable section" (title)
- "Move up/down" (title)
- "Duplicate section" (title)
- "Delete section" (title)

**Verdict:** These pass because `title` provides an accessible name. Recommend migrating to `aria-label` for better screen reader support (some screen readers don't consistently announce `title`).

### Input Without Label

| Element | Type | Placeholder | Has Label? | Has aria-label? |
|---------|------|------------|------------|-----------------|
| `<input>` | text | "Tell Bradley what to build..." | NO | NO |

**P0 failure.** The chat input relies solely on placeholder text for identification. Placeholder text disappears on focus and is not reliably announced by all screen readers. Needs either:
- `<label for="chat-input">` (can be visually hidden with `sr-only`)
- `aria-label="Tell Bradley what to build"`

### ARIA Role Usage

| Element | Role | Assessment |
|---------|------|-----------|
| `<div role="button">` | button | PARTIAL — Has `tabindex="0"` (good), but needs `onKeyDown` for Enter/Space activation |
| `<div role="separator">` | separator | PASS |

### Recommendations

| Fix | Effort | Phase |
|-----|--------|-------|
| Add `aria-label` to the 3 unnamed buttons | Small | Phase 2 |
| Add `aria-label="Tell Bradley what to build"` to chat input | Small | Phase 2 |
| Migrate icon button accessible names from `title` to `aria-label` | Small | Phase 2 |
| Verify `<div role="button">` elements handle Enter/Space keypress | Small | Phase 2 |

---

## 5. Images & Alt Text

**WCAG 1.1.1 Non-text Content — P0**

### Images

| Image | Alt Text | Status |
|-------|----------|--------|
| Unsplash hero image (photo-1551288049...) | "Dashboard analytics dark mode" | **PASS** |

Only one `<img>` element found on the page. It has descriptive alt text.

### SVG Icons

All SVGs detected (30 sampled) have `aria-hidden="true"`, which is correct when the parent element provides the accessible name via text or `title`. This is properly implemented.

**Verdict: PASS**

---

## 6. Heading Hierarchy

**WCAG 2.4.6 Headings and Labels — P1**

### Heading Structure

| Level | Text | Visible |
|-------|------|---------|
| h1 | "Build Websites by Just Talking" | YES |

### Analysis

- **One h1:** PASS (exactly one h1 on the page)
- **No skipped levels:** PASS (only h1 found, no jumps)
- **Minimal headings:** The builder shell has very few semantic headings. The Reality Canvas preview has an h1 from the hero section. Builder chrome (left panel, right panel) uses div-based labels instead of headings.

### Recommendations

| Fix | Effort | Phase |
|-----|--------|-------|
| Consider adding visually hidden h2 headings for panel regions ("Sections", "Theme Configuration") to improve screen reader navigation | Small | Phase 3 |

---

## 7. HTML Validity & Landmarks

**WCAG 1.3.1 Info and Relationships — P1**

### General HTML Checks

| Check | Value | Status |
|-------|-------|--------|
| `<html lang>` | `"en"` | **PASS** |
| `<title>` | "Hey Bradley -- Designer Mode" | **PASS** |
| Skip navigation link | None | **FAIL** |
| `<main>` landmark | 1 | **PASS** |
| `<nav>` landmark | 0 | **FAIL** |
| `<header>` landmark | 1 | **PASS** |
| `<footer>` landmark | 1 | **PASS** |
| Duplicate IDs | None | **PASS** |
| Auto-playing media | 0 | **PASS** |

### Analysis

1. **No skip link (P1):** Users must Tab through the entire TopBar and left panel to reach the main content area. A "Skip to main content" link (visually hidden until focused) would dramatically improve keyboard-only navigation.

2. **No `<nav>` landmark (P1):** The TabBar (REALITY/DATA/XAI DOCS/WORKFLOW) and the right panel tabs (SIMPLE/EXPERT) function as navigation but are not wrapped in `<nav>` elements. Screen reader users cannot quickly jump to navigation regions.

3. **Good foundations:** Proper `lang`, meaningful `<title>`, no duplicate IDs, and existing `<main>`/`<header>`/`<footer>` landmarks.

### Recommendations

| Fix | Effort | Phase |
|-----|--------|-------|
| Add skip link: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>` | Small | Phase 2 |
| Wrap TabBar in `<nav aria-label="Canvas views">` | Small | Phase 2 |
| Wrap right panel tabs in `<nav aria-label="Configuration mode">` | Small | Phase 2 |

---

## Priority Fix List

### Phase 2 (Easy Fixes)

| # | Issue | Severity | Effort | WCAG |
|---|-------|----------|--------|------|
| 1 | Fix theme card label contrast (near-white on white, ~1.1:1) | P0 | Small | 1.4.3 |
| 2 | Fix active tab color contrast (crimson on dark, 2.23:1) | P0 | Small | 1.4.3 |
| 3 | Fix version badge contrast (white on white, 1.0:1) | P0 | Small | 1.4.3 |
| 4 | Add `aria-label` to 3 unnamed icon buttons | P0 | Small | 4.1.2 |
| 5 | Add `aria-label` to chat input | P0 | Small | 4.1.2 |
| 6 | Bump "Start Building" CTA contrast (4.39:1 -> 4.5:1+) | P0 | Small | 1.4.3 |
| 7 | Change 11px text to 12px minimum across builder chrome | P1 | Small | 1.4.4 |
| 8 | Add skip navigation link | P1 | Small | 2.4.1 |
| 9 | Add `<nav>` landmarks around tab bars | P1 | Small | 1.3.1 |
| 10 | Fix 2 buttons with missing focus indicators | P0 | Small | 2.4.7 |
| 11 | Add `focus-visible:ring-2` to all interactive elements | P1 | Medium | 2.4.13 |

### Phase 3

| # | Issue | Severity | WCAG |
|---|-------|----------|------|
| 1 | Replace `<div role="button">` with `<button>` for section items | P1 | 4.1.2 |
| 2 | Add visually hidden headings for panel regions | P1 | 2.4.6 |
| 3 | Respect `prefers-reduced-motion` for all animations | P1 | 2.3.3 |
| 4 | Migrate `title` to `aria-label` on icon buttons | P1 | 4.1.2 |

### Phase 4 (Accessibility Dialog)

Per `07.accessibility-button.md`, the Master Settings dialog will provide:
- Text scale: Default / Large (18px base) / Accessible (20px base + 44px touch targets)
- Contrast: Standard / Enhanced (4.5:1 minimum) / High (7:1, 3-color palette)
- Reduce motion: Toggle to disable all animations
- Appearance: Light / Dark mode
- OS preference detection for reduced motion and dark mode

This dialog addresses the systemic accessibility controls that cannot be solved with one-off fixes.

---

## Automated Test Script

The Playwright audit script is saved at:
```
scripts/a11y-audit.cjs
```

Run it against the dev server:
```bash
node scripts/a11y-audit.cjs
```

It tests: color contrast ratios, font sizes, focus indicators, ARIA labels, alt text, heading hierarchy, and HTML landmark structure.

---

## Appendix: Raw Data

### Contrast Passes (sample)

| Element | Text | Ratio | Fg | Bg |
|---------|------|-------|----|----|
| div | "HBUntitled Project" | 16.34:1 | `rgb(243,243,241)` | `rgb(46,8,13)` |
| span | "HB" | 18.15:1 | `rgb(255,255,255)` | `rgb(46,8,13)` |
| span | "Untitled Project" | 18.15:1 | `rgba(255,255,255,0.7)` | `rgb(46,8,13)` |
| div | "LISTENBUILD" | 16.34:1 | `rgb(243,243,241)` | `rgb(46,8,13)` |

### Font Size Distribution

Total elements with text: ~136
- 56px: 1 (hero h1)
- 20px: 1
- 18px: 1
- 16px: 83 (dominant)
- 14px: 11
- 12px: 31
- 11px: 13 (violations)
