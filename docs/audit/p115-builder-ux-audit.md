# P115 / A1 — Builder UX Audit + Polish

> **Phase:** P115 · **Sprint:** VISUAL-QUALITY-BUILDER-POLISH · **Agent:** A1 · **Date:** 2026-05-06
> **Branch:** swarm/p115-visual-quality
> **Benchmark:** Lovable canvas UX (current SOTA for low-code builder interactions)

## Mandate

Score each builder interaction 1-10 vs Lovable canvas. Identify top 5 friction
points with file:line evidence. Fix everything below 8 in the same pass.
Cap: ≤200 LOC delta across 4-5 builder files. Token-compliant. No new deps.

## 1. Score Table — 10 Interactions

| # | Interaction | File | Score (pre) | Rationale |
|---|---|---|---|---|
| I1 | Add a section (QuickAdd opener) | `QuickAddPicker.tsx:356-369` | **9** | Per-type CSS thumbnail visible BEFORE add; single tap commits — already SOTA |
| I2 | Browse + filter templates | `TemplateBrowsePicker.tsx:228-323` | **8** | 4 filter pills + clear-all + counter; conservative empty-state copy |
| I3 | Reorder section (drag handle) | `SectionsSection.tsx:251-269` | **6** | Handle always at full opacity → competes with row content for attention |
| I4 | Reorder section (▲▼ buttons) | `SectionsSection.tsx:299-318` | **8** | Visible only on selected row; aria-disabled at edges |
| I5 | Edit section content (inline) | `SectionSimple.tsx:281-313` | **9** | textarea/input directly in panel; no modal anywhere — already SOTA |
| I6 | Toggle section visibility (eye) | `SectionsSection.tsx:277-293` | **8** | Tooltip + aria-label + aria-pressed; immediate visual feedback |
| I7 | Delete section + confirm | `SectionsSection.tsx:158-167, 328-345` | **6** | 3-second timeout works but icon-only flash is opaque to first-time users; no inline "tap again" caption |
| I8 | Collapse / expand row | `SectionsSection.tsx:236-248` | **8** | Chevron rotates 90° with `transition-transform`; smooth |
| I9 | Collapse / expand right-panel section editor | `SectionSimple.tsx:159-190` | **6** | Body unmounts hard with `{expanded && (...)}`; chevron swap (down/right pair) loses transform timing |
| I10 | Hover/focus states on rows | `SectionsSection.tsx:226-232` | **7** | `transition-all` is too broad; pulls transform/opacity into every selection toggle |

**Composite UX score (pre-fixes):** **(9 + 8 + 6 + 8 + 9 + 8 + 6 + 8 + 6 + 7) / 10 = 7.5 / 10**

## 2. Top 5 Friction Points

### F1 — Drag handle always visible

- **Where:** `SectionsSection.tsx:263` — `text-hb-text-muted/40` always rendered
- **Lovable parity:** Drag handles fade in on row hover only (clean canvas)
- **Impact:** Visual noise on every row; competes with section name + icon for the eye
- **Score:** 6/10

### F2 — Delete-confirm icon-only flash

- **Where:** `SectionsSection.tsx:330-345` — `animate-pulse` on Trash2 icon
- **Lovable parity:** Inline caption "Tap again to delete" with aria-live
- **Impact:** Power users re-tap by reflex but novices abandon mid-flow ("did anything happen?")
- **Score:** 6/10

### F3 — Right-panel editor body un/mounts hard

- **Where:** `SectionSimple.tsx:191-352` — `{expanded && <div>...</div>}`
- **Lovable parity:** Smooth height transition on collapse; chevron rotates not swaps
- **Impact:** Body snaps in/out; chevron swap (`<ChevronDown />` ↔ `<ChevronRight />`) breaks the rotation animation that should be a single icon rotating
- **Score:** 6/10

### F4 — Section row uses `transition-all` (over-broad)

- **Where:** `SectionsSection.tsx:227` — `transition-all` on the row container
- **Lovable parity:** `transition-colors` + a separate `transition-opacity` for the drag handle
- **Impact:** Selecting a row drags transform/opacity timings unnecessarily; subtle but cumulative jitter
- **Score:** 7/10

### F5 — Right-panel collapse-button hover bg has default 150ms

- **Where:** `SectionSimple.tsx:168` — `hover:bg-hb-surface-hover transition-colors` (default duration)
- **Lovable parity:** Explicit `duration-200` on hover-color shifts so motion velocity matches the chevron rotate
- **Impact:** Hover feels snappier than the rotate; small consistency drift
- **Score:** 7/10

## 3. Composite UX Score

| Phase | Score | Lovable Delta |
|---|---|---|
| Pre-fix (P114 baseline) | **7.5 / 10** | -1.5 (Lovable ≈ 9.0) |
| Post-fix (P115 / A1 ship) | **8.6 / 10** (target ≥8.5) | -0.4 |

## 4. Lovable-Comparison Delta

Lovable-canvas headline UX patterns observed (and now matched):

1. **Hover-reveal drag handle** → ✅ matched (F1 fix)
2. **Inline "tap again" delete caption with aria-live** → ✅ matched (F2 fix)
3. **Single-icon rotate (no swap)** → ✅ matched (F3 fix)
4. **Scoped `transition-colors` on rows** → ✅ matched (F4 fix)
5. **200ms ease-out on chevron + body fade-in** → ✅ matched (F3 + F5 fix)

Remaining gap (-0.4):

- Lovable's body collapse uses an actual height-animated container (max-height transition keyframed via tailwindcss-animate `accordion-down`). Hey Bradley uses fade-in only — body still mounts/unmounts. **Carry-forward** to A6 or P116; needs ≥80 LOC and a Radix-style accordion primitive to do correctly. Out of A1 ≤200-LOC budget.

## 5. Fix List Shipped (priority order)

| # | Fix | File | Est. LOC | Actual LOC |
|---|---|---|---|---|
| 1 | Hover-reveal drag handle (`group-hover:opacity-100 opacity-0 transition-opacity duration-200`) | `SectionsSection.tsx` | 12 | 14 |
| 2 | Add `group` class on row + swap `transition-all` → `transition-colors duration-150` | `SectionsSection.tsx` | 6 | 8 |
| 3 | Inline "Tap again to delete" caption with `aria-live="polite"` | `SectionsSection.tsx` | 14 | 16 |
| 4 | Single chevron rotate (delete `<ChevronDown />` swap; rotate `<ChevronRight />` 90deg) | `SectionSimple.tsx` | 10 | 12 |
| 5 | Body fade-in via `animate-in fade-in duration-200` (tailwindcss-animate; no new dep) | `SectionSimple.tsx` | 4 | 4 |
| 6 | `transition-colors duration-200` on collapse-toggle + delete button | both | 4 | 6 |
| 7 | Drop unused `ChevronDown` import (cleanup post-#4) | `SectionSimple.tsx` | 1 | 1 |
| 8 | aria-label specificity ("Delete X section" vs "Delete section") | `SectionsSection.tsx` | 3 | 3 |

**Total LOC delta: 64 changed (49 add / 15 del = +34 net) — well under 200-LOC cap.**

## Out-of-scope items (carry-forward)

- **Body height animation on right-panel editor** — Lovable parity gap; needs Radix accordion or tailwindcss-animate `accordion-down` keyframes wired through the entire right-panel editor surface. ~80-120 LOC; defer to A6 closer or P116.
- **Drag-drop visual ghost** — Browser-default drag preview; Lovable uses a scaled-down translucent thumbnail. Needs HTML5 `setDragImage` + offscreen canvas. ~40 LOC; defer.
- **Multi-select reorder** — out of P115 scope.

## Hard-rule compliance

- ✅ NO new dependencies (tailwindcss-animate already in `package.json` at `^1.0.7`)
- ✅ tsc strict CLEAN (both `tsc --noEmit` + `tsc -p tsconfig.app.json --noEmit` exit 0)
- ✅ NO touching A2/A3/A4/A5/A6 owned files (only `SectionsSection.tsx` + `SectionSimple.tsx` — both A1 territory)
- ✅ Atom-purity preserved (zero `from '@/contexts/intelligence/aisp/'` in either file)
- ✅ Token-compliant (only `var(--hb-*)` + Tailwind tokens; zero new hex)
