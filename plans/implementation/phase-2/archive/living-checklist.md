# Hey Bradley — UI/UX Expectations Checklist (Living Document)

**Purpose:** This document is the single source of truth for UI/UX quality expectations. The swarm must run Playwright checks against this checklist after every sub-phase. Items are added as features are built — it grows with the product.

**Last Updated:** Phase 2.3 complete (all 8 sections)

---

## 1. GLOBAL EXPECTATIONS (Apply to Every Page State)

### 1.1 No Broken Renders

| # | Check | Playwright Assertion | Severity |
|---|-------|---------------------|----------|
| G1 | No raw HTML/CSS class names visible in any rendered text | `expect(bodyText).not.toContain('text-blue-400')` and `not.toContain('class=')` | P0 — blocking |
| G2 | No "undefined", "null", "[object Object]" visible in UI | `expect(bodyText).not.toMatch(/undefined|null|\[object Object\]/)` | P0 — blocking |
| G3 | No React error boundaries showing "Something went wrong" | `expect(bodyText).not.toContain('Something went wrong')` | P0 — blocking |
| G4 | No console errors (check browser logs) | `page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })` | P0 — blocking |
| G5 | No empty/blank sections where content should be | Visual screenshot comparison | P1 |
| G6 | No overlapping text or elements | Visual screenshot comparison | P1 |
| G7 | No horizontal scrollbar on main viewport | `expect(document.body.scrollWidth).toBeLessThanOrEqual(window.innerWidth)` | P1 |

### 1.2 Typography & Color

| # | Check | Playwright Assertion | Severity |
|---|-------|---------------------|----------|
| T1 | All text in preview uses the theme's font family (not system default) | `expect(heroSection).toHaveCSS('font-family', /Inter|DM Sans|Space Grotesk|JetBrains|Plus Jakarta/)` | P1 |
| T2 | Text color has sufficient contrast against background (visible, not washed out) | Screenshot comparison — text must be readable | P1 |
| T3 | Light theme text is dark; dark theme text is light | `getComputedStyle` check on section element | P0 |
| T4 | No white text on white background or black text on black background | Contrast ratio check | P0 |
| T5 | Headings are visually larger than body text | Font size comparison | P2 |
| T6 | Monospace font used for labels in builder chrome (LAYOUT, CONTENT, STYLE, etc.) | CSS check on label elements | P2 |

### 1.3 Layout & Spacing

| # | Check | Playwright Assertion | Severity |
|---|-------|---------------------|----------|
| L1 | Three-panel layout renders (left, center, right all visible) | `expect(page.locator('[data-panel="left"]')).toBeVisible()` (×3) | P0 |
| L2 | Left panel has flat navigation list (Theme + sections + Add Section) | `expect(page.locator('text=Theme')).toBeVisible()` + section names | P0 |
| L3 | Right panel shows correct context based on left panel selection | Click Theme → right panel header says "THEME"; click Hero → says "HERO" | P0 |
| L4 | Chat input pinned at bottom of left panel, always visible | `expect(page.locator('[placeholder*="Tell Bradley"]')).toBeVisible()` | P1 |
| L5 | Status bar at bottom with monospace text | `expect(page.locator('text=READY')).toBeVisible()` | P2 |
| L6 | All 4 center tabs navigable (REALITY, DATA, XAI DOCS, WORKFLOW) | Click each tab, verify content changes | P0 |

---

## 2. THEME EXPECTATIONS

| # | Check | Playwright Assertion | Severity |
|---|-------|---------------------|----------|
| TH1 | 10 theme cards visible in right panel when Theme is selected | `expect(page.locator('[data-theme-card]')).toHaveCount(10)` | P0 |
| TH2 | Each theme card shows a visually distinct mini-preview | Screenshot all 10 — no two identical | P1 |
| TH3 | Clicking a theme changes the hero layout variant | Check `data-variant` attribute changes | P0 |
| TH4 | Clicking a theme changes visible components (some appear/disappear) | Count visible components before/after switch | P0 |
| TH5 | Clicking a theme changes colors (background and text) | `getComputedStyle` comparison before/after | P0 |
| TH6 | Copy (headline, CTA text) preserved across theme switches | `expect(headline.textContent).toBe(originalText)` after switch | P0 |
| TH7 | Palette selector shows 5 options with colored dots | `expect(page.locator('[data-palette-row]')).toHaveCount(5)` | P1 |
| TH8 | Font selector shows font options rendered in their own font | Visual check | P1 |
| TH9 | Light/dark toggle changes preview appearance | Background color check before/after | P1 |

---

## 3. HERO SECTION EXPECTATIONS

| # | Check | Playwright Assertion | Severity |
|---|-------|---------------------|----------|
| H1 | Hero section renders with visible headline text | `expect(page.locator('h1, h2').first()).toBeVisible()` | P0 |
| H2 | CTA buttons render and are clickable | `expect(page.locator('a, button').filter({ hasText: /Start|Get Started|Learn/ })).toBeVisible()` | P0 |
| H3 | Editing headline in right panel updates preview text within 200ms | Fill input → wait 200ms → verify preview text matches | P0 |
| H4 | Component toggle OFF hides component from preview | Toggle trust badges off → `expect(trustBadges).not.toBeVisible()` | P0 |
| H5 | Component toggle ON shows component in preview | Toggle trust badges on → `expect(trustBadges).toBeVisible()` | P0 |
| H6 | Image URL input changes hero image in preview | Fill URL → wait 500ms → verify image src updated | P1 |
| H7 | Background image themes show the background image | For Portfolio/Wellness: verify background-image CSS property set | P1 |
| H8 | Video themes have video element (or placeholder) | For Startup/Creative: verify video element or placeholder exists | P2 |

---

## 4. SECTION EXPECTATIONS (All 8 Types)

### 4.1 Universal Section Checks

| # | Check | Applies To | Severity |
|---|-------|-----------|----------|
| S1 | Section renders without error when enabled | All 8 | P0 |
| S2 | Section disappears when disabled (eye toggle in left panel) | All 8 | P0 |
| S3 | Clicking section in left panel updates right panel to that section's editor | All 8 | P0 |
| S4 | SIMPLE tab editor has copy inputs for the section's primary text | All 8 | P0 |
| S5 | Editing copy in right panel updates preview text | All 8 | P0 |
| S6 | Section uses theme colors (not hardcoded) | All 8 | P1 |
| S7 | Section uses theme font family | All 8 | P1 |

### 4.2 Per-Section Specific Checks

| Section | Specific Check | Severity |
|---------|---------------|----------|
| **Features** | Shows correct number of feature cards (matching editor count) | P0 |
| **Features** | Add/remove feature card updates preview | P1 |
| **Pricing** | Shows correct number of tiers | P0 |
| **Pricing** | Highlighted tier visually distinct | P1 |
| **CTA** | Button renders with accent color | P0 |
| **Footer** | Copyright text visible | P1 |
| **Footer** | Link columns render | P1 |
| **Testimonials** | Quote text and author name visible per card | P0 |
| **FAQ** | Questions are expandable/collapsible | P0 |
| **FAQ** | Answer text visible when expanded | P1 |
| **Value Props** | Value/number prominently displayed | P0 |

---

## 5. DATA TAB EXPECTATIONS

| # | Check | Severity |
|---|-------|----------|
| D1 | JSON renders with syntax highlighting (no raw HTML classes) | P0 |
| D2 | LIVE indicator visible and green | P1 |
| D3 | COPY button copies JSON to clipboard | P1 |
| D4 | EXPORT button downloads valid JSON file | P1 |
| D5 | Collapsible section headers show section names | P1 |
| D6 | Editing copy in right panel → JSON updates in Data Tab | P0 |
| D7 | Theme switch → JSON fully updates in Data Tab | P0 |

---

## 6. INTERACTION FLOW EXPECTATIONS

| # | Flow | Steps | Expected Result | Severity |
|---|------|-------|----------------|----------|
| F1 | Theme → Preview | Click "Agency" theme card | Preview changes to split layout with image | P0 |
| F2 | Theme → JSON | Click "Minimalist" theme card | Data Tab JSON shows minimal components | P0 |
| F3 | Copy → Preview | Type "Hello World" in headline input | Preview headline shows "Hello World" | P0 |
| F4 | Toggle → Preview | Turn off "Trust Badges" toggle | Trust badges disappear from preview | P0 |
| F5 | Section nav → Editor | Click "Pricing" in left panel | Right panel shows Pricing editor with tiers | P0 |
| F6 | Undo → Restore | Make a change, press Ctrl+Z | Previous state restored in preview + JSON | P1 |
| F7 | Persistence | Reload page | Same theme, sections, and copy as before reload | P1 |
| F8 | Responsive | Click mobile device button | Preview constrains to 375px width | P1 |

---

## 7. PLAYWRIGHT AGENT SWARM PROTOCOL

### 7.1 When to Run

The UI/UX agent swarm runs:
- After every sub-phase completion (before requesting human review)
- After any hotfix that touches renderers, editors, or configStore
- Before any git push to main

### 7.2 Agent Structure

```
UI/UX Agent Swarm (3 agents, parallel):

┌─────────────────────────┐
│ visual-agent             │  Captures screenshots of:
│                          │  - All 10 themes (hero only)
│                          │  - All 8 sections (with SaaS theme)
│                          │  - Data Tab, XAI Docs Tab
│                          │  - Right panel in each section context
│                          │  Saves to: playwright-report/screenshots/
└─────────────────────────┘

┌─────────────────────────┐
│ functional-agent         │  Runs all interaction flow tests (F1-F8):
│                          │  - Theme switch changes preview
│                          │  - Copy edit updates preview
│                          │  - Toggle hides/shows components
│                          │  - Section navigation updates right panel
│                          │  - Undo/redo works
│                          │  - Persistence across reload
└─────────────────────────┘

┌─────────────────────────┐
│ integrity-agent          │  Runs all "no broken" checks (G1-G7):
│                          │  - No raw HTML in output
│                          │  - No undefined/null visible
│                          │  - No console errors
│                          │  - No error boundaries
│                          │  - No white-on-white text
│                          │  - No horizontal overflow
│                          │  Checks every tab, every theme
└─────────────────────────┘
```

### 7.3 Test File Structure

```
tests/
├── ui-ux/
│   ├── global-integrity.spec.ts     ← G1-G7 checks across all states
│   ├── theme-switching.spec.ts      ← TH1-TH9 checks
│   ├── hero-editing.spec.ts         ← H1-H8 checks
│   ├── section-rendering.spec.ts    ← S1-S7 + per-section checks
│   ├── data-tab.spec.ts             ← D1-D7 checks
│   ├── interaction-flows.spec.ts    ← F1-F8 end-to-end flows
│   └── typography-color.spec.ts     ← T1-T6 checks
└── screenshots/
    ├── themes/                      ← 10 theme screenshots
    ├── sections/                    ← 8 section screenshots
    └── flows/                       ← Flow step screenshots
```

### 7.4 Reporting

After the agent swarm completes, generate a report:

```markdown
# UI/UX Quality Report — Phase {X}

## Summary
- Total checks: {N}
- Passed: {P} ({P/N * 100}%)
- Failed: {F}
- Skipped: {S}

## P0 Failures (BLOCKING — must fix before commit)
- [ ] {description} — {screenshot link}

## P1 Failures (Should fix, not blocking)
- [ ] {description} — {screenshot link}

## P2 Failures (Log for backlog)
- [ ] {description}

## Screenshots
- themes/ — {10 files}
- sections/ — {8 files}
```

Save to `playwright-report/ui-ux-report.md`.

### 7.5 Pass/Fail Criteria

| Severity | Rule |
|----------|------|
| P0 failures | **BLOCKING** — cannot push to main. Must fix immediately. |
| P1 failures | Should fix in current sub-phase. Can push with documented exceptions. |
| P2 failures | Log in backlog. Fix when convenient. |

**Overall pass:** Zero P0 failures + fewer than 5 P1 failures.

---

## 8. HOW TO ADD NEW CHECKS

When a new feature is built, add checks to this document following this pattern:

```markdown
| # | Check | Playwright Assertion | Severity |
|---|-------|---------------------|----------|
| {ID} | {Human-readable description} | {Code snippet or approach} | P0/P1/P2 |
```

Then add the corresponding test to the appropriate `tests/ui-ux/*.spec.ts` file.

**This document grows with the product. Every feature shipped without a corresponding check is technical debt.**

---

## 9. CURRENT STATUS

### Phase 2.3 (All 8 Sections Complete)

| Category | Total Checks | Estimated Pass | Known Issues |
|----------|-------------|---------------|-------------|
| Global (G1-G7) | 7 | ~6 | G5 needs visual comparison baseline |
| Typography (T1-T6) | 6 | ~4 | T1 may fail for sections not yet using theme font |
| Theme (TH1-TH9) | 9 | ~7 | TH2 needs screenshot comparison |
| Hero (H1-H8) | 8 | ~7 | H8 video placeholder not implemented |
| Sections (S1-S7 × 8) | 56 | ~48 | New sections may have color/font inheritance issues |
| Per-Section Specific | 11 | ~8 | FAQ accordion behavior, pricing highlight |
| Data Tab (D1-D7) | 7 | ~6 | D3 clipboard test may need permissions |
| Flows (F1-F8) | 8 | ~6 | F6 undo, F7 persistence need verification |
| **TOTAL** | **112** | **~92 (82%)** | |

**Target for Phase 2 complete: 95%+ pass rate on P0+P1 checks.**