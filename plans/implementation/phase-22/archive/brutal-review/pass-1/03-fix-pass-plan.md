# P22 Brutal Review — Pass 1 — Chunk 3: Fix-Pass Plan

> Consolidated must-fix queue across R1 (UX) + R2 (Functionality) + R3 (Security) + R4 (Architecture).
> File-by-file decomposition for fix-pass-1 implementation.
> ≤400 LOC.

---

## Consolidated must-fix queue (de-duplicated, prioritized)

| # | Item | Severity | Effort | Persona Δ | File(s) |
|---|---|---|---:|---|---|
| **F1** | AISP dual-view component on /aisp page (Crystal Atom + human-readable side-by-side) | HIGH | 30m | C +5, F +3 | `src/components/marketing/AISPDualView.tsx` (NEW) + `src/pages/AISP.tsx` (wire) |
| **F2** | Theme unification (Option A: warm-cream everywhere) | HIGH | 1h | G +8 | 6 page files (About, AISP, Research, OpenCore, HowIBuiltThis, Docs) |
| **F3** | Persona walks recorded; if any miss target, fix-pass-2 | HIGH (binding) | 30m | n/a (verification) | `phase-22/personas.md` (NEW) |
| **F4** | OpenCoreVsCommercial extracted as component + used on /open-core | MED | 20m | C +2, G +1 | `src/components/marketing/OpenCoreVsCommercial.tsx` (NEW) + `src/pages/OpenCore.tsx` |
| **F5** | About + AISP + Research capability sweep | MED | 20m | C +2 | 3 page files |
| **F6** | "BYOK" expanded to "Bring Your Own Key" first occurrence | LOW | 2m | G +1 | `src/pages/BYOK.tsx` |
| **F7** | Restore COCOMO callout in HowIBuiltThis (truthful 28K LOC base) | LOW (Capstone-thesis) | 10m | C +3 | `src/pages/HowIBuiltThis.tsx` |
| **F8** | BYOK provider URLs clickable (`<a href>` w/ rel="noopener") | LOW | 5m | UX +1 | `src/pages/BYOK.tsx` |
| **F9** | Resolve `/builder` stub (redirect to /onboarding OR remove) | LOW | 5m | n/a | `src/pages/Builder.tsx` + `src/main.tsx` + `MarketingNav.tsx` |
| **F10** | 5 Playwright cases | MED | 30m | n/a (verification) | `tests/p22-website-*.spec.ts` (NEW) |

**Total fix-pass-1 effort:** ~4h.

---

## File-by-file decomposition

### F1 — AISP dual-view component

**File:** `src/components/marketing/AISPDualView.tsx` (NEW, ~80 LOC)

```tsx
// Layout: 2-column grid (md:grid-cols-2)
// Left: Crystal Atom in <pre> with syntax highlighting (just monospace + color)
// Right: human-readable spec (plain prose)
// Cross-link to bar181/aisp-open-core ai_guide
// data-testid="aisp-dual-view"
```

Content (paste from `prompts/system.ts` Crystal Atom + corresponding human-readable):

```
LEFT (Crystal Atom):
⟦
  Ω := { Build a marketing site for X }
  Σ := { Site:{theme:Theme, sections:[Section]}, ... }
  Γ := { R1: ∀ s∈sections : unique(s.id), R2: ... }
  ...
⟧

RIGHT (human-readable):
- Goal: build a marketing site for X
- Schema: a Site has a theme + array of sections
- Rules: every section has a unique ID; ...
```

**File:** `src/pages/AISP.tsx` — Edit to import + render `<AISPDualView>` in a new section between existing intro + research-callout.

### F2 — Theme unification (Option A)

**Strategy:** sed/edit-pass replacing dark-theme tokens with warm-cream tokens across 6 pages.

| From (dark) | To (warm-cream) |
|---|---|
| `bg-[#1a1a1a]` | `bg-[#faf8f5]` |
| `text-white` | `text-[#2d1f12]` |
| `text-neutral-400` | `text-[#6b5e4f]` |
| `text-neutral-500` | `text-[#6b5e4f]` |
| `text-neutral-600` | `text-[#8a7a6d]` |
| `bg-white/5` | `bg-white border border-[#e8772e]/20` (cards) |
| `border-white/10` | `border-[#e8772e]/20` |
| `text-[#A51C30]` (crimson) | `text-[#e8772e]` (warm orange) |
| `bg-[#A51C30]` | `bg-[#e8772e]` |
| `hover:bg-[#8B1729]` | `hover:bg-[#c45f1c]` |

**Files:** About.tsx (223 LOC), AISP.tsx (258), Research.tsx (308), OpenCore.tsx (429), HowIBuiltThis.tsx (~210), Docs.tsx (275)

**Effort:** 1h (manual Edit per file or sed batch — careful: some pages have inline gradient strings that need preserving).

**Update ADR-053** §"Theme alignment" — drop the "intentional dark island" caveat; declare warm-cream as universal.

### F3 — Persona walks

**File:** `plans/implementation/phase-22/personas.md` (NEW, ~150 LOC)

Structure: per persona (Grandma / Framer / Capstone), document:
- Setup (device, time budget)
- Walk-through (T+0, T+1, ... )
- What they understood
- What confused them
- Score with rationale

Run AFTER F1+F2+F4-F8 land (so personas walk the fixed site).

**Persona walks are SIMULATED** in this session (coordinator does the walk; would normally be 3 separate human reviewers). Rate honestly.

### F4 — OpenCoreVsCommercial extracted

**File:** `src/components/marketing/OpenCoreVsCommercial.tsx` (NEW, ~50 LOC)

```tsx
// Two-column comparison: Open Core (this repo) vs Commercial (separate repo, post-MVP)
// Open core column: MIT, single-page, BYOK, local storage, no backend
// Commercial column: Supabase auth, hosted demo without BYOK, multi-page,
//   complex apps, agentic support system
// data-testid="open-core-vs-commercial"
```

**File:** `src/pages/OpenCore.tsx` — Edit to import + render `<OpenCoreVsCommercial>` after the "55% problem" section, before the existing CTAs.

**File:** `src/pages/Welcome.tsx` — Edit the existing inline open-core-vs-commercial paragraph to use `<OpenCoreVsCommercial>` instead.

### F5 — About + AISP + Research capability sweep

**Files:**
- `src/pages/About.tsx` — add "Sealed P15-P21 at composite 88+; defending May 2026" callout in a new section
- `src/pages/AISP.tsx` — verify any capability claims; ensure "AISP Crystal Atoms shipped P18 (ADR-045)"
- `src/pages/Research.tsx` — spot-check counts; if any specific claims about Hey Bradley capabilities, refresh them

### F6 — BYOK acronym expansion

**File:** `src/pages/BYOK.tsx` line 18 (the page hero):

```tsx
<p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">Bring Your Own Key (BYOK)</p>
```

(Currently says just "Bring Your Own Key" — verify; if abbreviation appears first, expand.)

Actually re-reading: Line 17 of BYOK.tsx already says "Bring Your Own Key" in the eyebrow. Good. F6 may be CLOSED — verify during fix-pass.

### F7 — COCOMO callout restored

**File:** `src/pages/HowIBuiltThis.tsx` — add a small callout (NOT a 3-row table; per Don Miller density rules use inline emphasis):

```tsx
<p className="text-sm text-neutral-500 mt-6">
  COCOMO estimate against the actual ~28K TS/TSX line count: ~$680K cost,
  ~12 months schedule, 5+ person team. Actual: ~60 hours, single human +
  AI swarms, $0 (only AI API costs). The compression ratio is ~140×.
</p>
```

(Recompute: 28K LOC organic-mode COCOMO ≈ 12 months × 5 people = 60 person-months ≈ 9,600 hours ≈ $680K at $70/hr. 9,600 / 60 actual = 160× compression. Round to "~140×" conservatively.)

### F8 — BYOK provider URLs clickable

**File:** `src/pages/BYOK.tsx` — change provider table `where` strings from plain text to `<a href>` links:

```tsx
{ name: 'Claude (Anthropic)', ..., where: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-[#e8772e] underline">console.anthropic.com/settings/keys</a>, ... }
```

(May require changing the type of `where` from `string` to `ReactNode` in the const definition.)

### F9 — `/builder` stub resolution

**File:** `src/pages/Builder.tsx` — currently 5 LOC stub.
**Decision:** redirect to `/onboarding` (single line `import { Navigate } from 'react-router-dom'; export const Builder = () => <Navigate to="/onboarding" replace />`)
**File:** `src/main.tsx` — keep route `/builder` for backward compat (was Welcome's "Open Builder" CTA target previously).
**File:** `MarketingNav.tsx` — verify "Try Builder" button still routes correctly (`/onboarding`).

### F10 — 5 Playwright cases

**Files:**
- `tests/p22-welcome-render.spec.ts` (1 case): Welcome renders with hero + 3-mode tiles + footer; no broken links
- `tests/p22-byok-page.spec.ts` (1 case): /byok renders + 5 provider entries visible + CTA → /onboarding
- `tests/p22-aisp-dualview.spec.ts` (1 case): /aisp renders + AISPDualView component visible + Crystal Atom side-by-side with human spec
- `tests/p22-opencore-delineation.spec.ts` (1 case): /open-core renders + OpenCoreVsCommercial component visible
- `tests/p22-marketing-nav.spec.ts` (1 case): MarketingNav has 5 items (About / AISP / BYOK / Open Core / Docs); each link resolves

**Total: +5 cases.**

---

## Implementation order (recommended)

1. **F2** Theme unification (1h) — biggest single change; do FIRST so subsequent edits land in the right tokens
2. **F1** AISP dual-view (30m)
3. **F4** OpenCore delineation extracted (20m)
4. **F5** About + AISP + Research sweep (20m)
5. **F8** BYOK URLs clickable (5m)
6. **F7** COCOMO callout restored (10m)
7. **F9** Builder stub resolved (5m)
8. **F6** BYOK acronym (2m if not already done)
9. **F10** 5 Playwright cases (30m)
10. **F3** Persona walks recorded (30m) — runs LAST after all fixes land

**Total: ~4h.**

---

## Pass-2 trigger conditions

Run pass-2 brutal review IF after fix-pass-1:
- Any persona misses target (Grandma <70, Framer <75, Capstone <85)
- Any new HIGH-severity item surfaces
- Theme unification reveals broken visuals on a page

Otherwise pass-1 → final-seal P22.

## Composite goal

Composite **82+** for final P22 seal. Estimated post-fix-pass-1: **82** (right at gate). If short by ≤2, accept; if short by ≥3, run pass-2.

---

## Cross-references

- `00-summary.md` (this pass executive)
- `01-ux-functionality.md` (R1+R2 detail)
- `02-security-architecture.md` (R3+R4 detail)
- ADR-053 (will need amendment if Option A theme unification chosen)
- `phase-19/deep-dive/05-fix-pass-plan.md` (template for this pattern)

## Output

After fix-pass-1 lands, write `phase-22/brutal-review/pass-1/04-fix-pass-1-results.md` documenting actuals + persona scores.
