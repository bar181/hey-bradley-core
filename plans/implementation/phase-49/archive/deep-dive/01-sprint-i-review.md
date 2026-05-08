# Sprint I End-of-Sprint Brutal-Honest Review (P47 + P48 + P49)

**Reviewer:** A8 (single-reviewer lean pass — Sprint H pattern)
**Date:** 2026-04-29
**Phase:** P49 (Sprint I close)
**Scope:** Cumulative review of UX / Functionality / Security / Architecture across the
three Sprint I waves: P47 builder UX (collapse + categories + a11y), P48 quick-add +
improvement suggester, P49 mobile polish (C11 closure).
**Pattern:** ≤200 LOC lean reviewer (matches Sprint H end-of-sprint format).

---

## Surfaces Reviewed

| File | LOC | Wave | Concern |
|---|---:|---|---|
| `src/components/left-panel/SectionsSection.tsx` | 591 | P47 A1 + P48 wiring | UX + a11y |
| `src/components/right-panel/simple/SectionSimple.tsx` | 294 | P47 A2 | a11y |
| `src/components/right-panel/simple/ImagePicker.tsx` | 495 | P47 A2 | Escape trap |
| `src/components/right-panel/simple/{CTA,Features,Testimonials,SectionHeading}*.tsx` | — | P47 A2 | a11y labels |
| `src/components/left-panel/QuickAddPicker.tsx` | 137 | P48 A4 | UX + a11y |
| `src/contexts/intelligence/aisp/improvementSuggester.ts` | 106 | P48 A5 | Σ-restriction |
| `src/contexts/intelligence/chatPipeline.ts` (deriveImprovements) | — | P48 A5 | defensive integration |
| `src/components/shell/ChatInput.tsx` (improvements rendering) | — | P48 A5 | UX surface |
| `src/pages/Welcome.tsx` | 171 | P49 A7 | C11 mobile carousel |

---

## Findings — UX / Functionality

1. **SectionsSection collapse-init effect can mis-fire on prop replacement.** `collapseInitRef.current` is a one-shot guard, but if a user switches between pages (multi-page mode) the new page's sections inherit the previous page's collapse set instead of re-initializing the "first open, rest collapsed" pattern. Severity: **should**. File: `SectionsSection.tsx:108-114`.
2. **QuickAddPicker hover-scale uses `hover:scale-[1.03]`** with no `motion-reduce:` variant. A user with `prefers-reduced-motion` still gets the scale animation. Severity: **should**. File: `QuickAddPicker.tsx:105-107`.
3. **improvementSuggester deterministic prefix** picks AFFIRMATIONS via `summary.charCodeAt(0) % 3`. When summary is the same on consecutive turns (e.g. duplicate "added hero"), the prefix is also identical — three identical "Nice — …" turns can read as canned. Severity: **nice**. File: `improvementSuggester.ts:44-48`.
4. **Welcome mobile carousel uses `max-h-[80vh]` + `min-h-[60vh]`** which on a 1024×600 desktop browser at 50% zoom (or any narrow-viewport desktop) makes a single card monopolise the viewport. The Tailwind `max-sm` breakpoint (≤639px) is the safety belt — but reviewers viewing a narrow window will see the carousel kick in unexpectedly. Severity: **nice**. File: `Welcome.tsx:96`.

## Findings — Security / Σ-restriction

5. **improvementSuggester does NOT widen Σ.** Verified: rule output is advisory text only, no patches, no INTENT_ATOM mutation. The `try { ... } catch { /* swallow */ }` in `chatPipeline.deriveImprovements` correctly fails closed (returns `undefined` improvements rather than throwing). Severity: **PASS**. ADR-053 discipline holds.
6. **No new dependencies added across all 3 waves.** Verified `package.json` does NOT contain `@dnd-kit/*`, `react-aria`, `embla*`, `swiper*`, or `@radix-ui/react-tooltip`. KISS guard satisfied. Severity: **PASS**.
7. **`addSection` is called via `useConfigStore.getState()` direct in QuickAddPicker** rather than the hook subscription. This is a deliberate one-shot write — no re-subscription needed — but it bypasses the React render cycle's reactive guard. Reviewers should confirm this is intentional. Severity: **nice**. File: `QuickAddPicker.tsx:48-51`.

## Findings — Architecture / ADR coverage

8. **ADR-070 covers P47, ADR-071 covers P48, ADR-072 (this seal) covers P49 mobile polish.** Three ADRs for three waves — full Sprint I coverage. Cross-references chain: ADR-070 → ADR-071 → ADR-072 → ADR-022 (Section Type Registry). Severity: **PASS**.
9. **improvementSuggester sits adjacent to `aisp/` Crystal Atoms** but is NOT itself a Crystal Atom (no Ω Σ Γ Λ Ε structure). This is correct — it's a heuristic helper, not a translation atom — but the file location implies otherwise. A future P50+ LLM-lift would migrate it to a proper Σ-tagged atom. Severity: **nice**. File: `improvementSuggester.ts` (top comment is honest about this).
10. **C11 closure scope is Welcome.tsx only.** SectionsSection + QuickAddPicker + RealityTab all carry `active:` variants for touch-parity (verified `grep -c "active:"`: SectionsSection=6, RealityTab=1, QuickAddPicker=0). QuickAddPicker has no `active:` because its primary affordance is `:hover` scale + `:focus` ring; touch users get the focus ring on tap. Severity: **nice**. Could harden by adding `active:scale-[0.98]` to the cards.

## Findings — Test discipline

11. **tests/p47-builder-ux.spec.ts (24 cases) + tests/p48-builder-enhancements.spec.ts (19 cases)** are pure-FS-level reads — no DB, no browser, no aisp barrel imports. Sprint I cumulative regression count carries forward to P49. Severity: **PASS**.

---

## Persona Re-Score (rubric per CLAUDE.md)

| Persona | Score | Rationale |
|---|---:|---|
| **Grandma** (cognitive load, copy clarity, recoverable) | **83** | Collapse-by-default + categorized picker reduce visual load; "Quick add" Zap icon + plain-English card descriptions ("Big intro at the top of your site"). Mobile carousel readable on phones. -1 vs P47 because improvements `💡 Next steps` add another chrome layer to parse. +3 vs P46 (78). |
| **Framer** (visual polish, micro-interactions) | **91** | hover:scale-[1.03] on QuickAdd cards + categorized pills + chevron rotation feels designed. Welcome snap-y carousel adds a tablet/phone-native gesture. -1 for missing motion-reduce variant. +1 vs P48 (90). |
| **Capstone** (architectural soundness, AISP discipline, ADR coverage) | **99** | 3 ADRs cover 3 waves; improvementSuggester is correctly NOT widening Σ; KISS dep guard; pure-unit test discipline preserved. Sprint I closes the builder-UX-vs-AISP-discipline tension cleanly. = P48 (99). |

**Composite:** (83 + 91 + 99) / 3 = **91.0 / 100**

---

## Verdict

**PASS** (composite ≥ 90).

Sprint I ships three coherent waves of builder-UX polish without compromising the AISP
pipeline. Improvement suggester is the most architecturally interesting addition:
deterministic, Σ-restricted, fail-safe — exactly the discipline the Capstone reviewer
needs to see at this stage. Mobile polish closes C11 (oldest open carryforward, P22
deferred → P49 sealed).

## Must-Fix Items

| # | Severity | File:Line | Issue |
|---|---|---|---|
| 1 | should | `SectionsSection.tsx:108-114` | collapse-init ref does not reset on page switch (multi-page mode) |
| 2 | should | `QuickAddPicker.tsx:105-107` | missing `motion-reduce:` variant on hover scale |
| 3 | nice | `improvementSuggester.ts:44-48` | deterministic-prefix can repeat 3× for identical summaries |
| 4 | nice | `Welcome.tsx:96` | narrow-viewport desktop accidentally enters mobile carousel |
| 5 | nice | `QuickAddPicker.tsx:102-108` | no `active:scale-[0.98]` for touch press feedback |

**Counts:** 0 must-fix, 2 should-fix, 3 nice-to-have. None block seal.

## Recommendation

**SEAL Sprint I at composite 91/100.** Defer the 2 should-fix items to a Sprint J
opener fix-pass (or a P49b carryforward row in `STATE.md`). The 3 nice-to-have items
are tracked in `plans/deferred-features.md` and revisited at Sprint J planning.
