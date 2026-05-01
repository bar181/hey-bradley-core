# P88 — Section Type Visual Quality (Preflight)

> **Phase:** P88 · **Sprint:** SECTION-VISUAL-Q · **Date:** 2026-05-01
> **Predecessor:** P86+P87 sealed at `9570268` (~1051+ GREEN, 112 ADRs, library professional grade ≥8.5 declared)
> **Cross-refs:** ADR-087 (Design Tokens), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-100 (Section Type Completeness)

## Mandate

Three section types added P75 (case-study + contact-form) and pre-existing menu were not part of the P86 polish scope. P88 audits each against ADR-094 ≥8.5 standard; surgical fixes only. Plus closes P86 carry-forward (MobileListenFullscreen token migration).

## 3 parallel agents · disjoint scopes

### A1 — menu / case-study / contact-form polish
**Owns:**
- `src/templates/case-study/CaseStudyCards.tsx` (EDIT — 139 LOC; audit hover states, token compliance, real copy, hover-lift per ADR-091)
- `src/templates/contact-form/ContactFormSimple.tsx` (EDIT — 190 LOC; audit form field focus rings, button states, token spacing)
- `src/templates/navbar/NavbarCentered.tsx` (EDIT — 89 LOC; menu component; audit nav-item hover, active state)
- `src/templates/navbar/NavbarSimple.tsx` (EDIT — 78 LOC; audit same)

**Constraints:** Each file ≤25 LOC of surgical edits. Token compliance per ADR-087. ADR-091 hover-lift / focus-visible patterns. NO refactors. NO new features.

DO NOT touch: MobileListenFullscreen.tsx (A2 owns), tests/ADRs/plans/CLAUDE.md (A3 owns).

### A2 — MobileListenFullscreen token migration (P86 carry-forward)
**Owns:**
- `src/components/shell/MobileListenFullscreen.tsx` (EDIT — 124 LOC; replace 7 hard-coded hex sites with token references)

**Hard-coded sites (per recon):**
- `bg-[#faf8f5]` (line 62) — listen-mode page background
- `bg-[#2d1f12]` + `text-[#faf8f5]` (lines 82, 114) — primary mic button
- `ring-[#6b5e4f]` (lines 84, 116) — focus ring
- `bg-[#2d1f12]/30` (line 91) — pulse ring
- `text-[#6b5e4f]` (line 100) — transcript text
- `hover:bg-[#6b5e4f]` (line 115) — button hover

**Strategy:** Use existing tokens where they map cleanly (e.g., `bg-[var(--hb-paper)]` → `#faf8f5` analog; `bg-[var(--hb-ink)]` → `#2d1f12`; `text-[var(--hb-text-muted)]` → `#6b5e4f`). Verify token names via `grep -E "hb-paper|hb-ink|hb-text-muted|hb-accent" src/styles/`. If existing tokens don't map cleanly, introduce 3 new tokens prefixed `--hb-listen-*` in `src/styles/design-tokens.ts` (or `src/index.css`) and use those.

**Constraints:** Surgical — replace literals with tokens; preserve EXACT visual identity (no color drift). NO new deps. NO animation libs. ≤30 LOC of edits in MobileListenFullscreen + ≤10 LOC in tokens file if new tokens needed.

### A3 — ADR-113 + tests + EOP
**Owns:**
- `docs/adr/ADR-113-section-visual-quality-standard.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-087 + ADR-091 + ADR-094 + ADR-100)
  - Decisions: (1) all 18 section types score ≥8.5 ADR-094 rubric; (2) menu / case-study / contact-form visual quality verified; (3) MobileListenFullscreen tokenized (closes P86 carry-forward); (4) future section types must ship with token compliance from day one
- `tests/p88-section-visual.spec.ts` (NEW; ≥10 cases; Playwright):
  - P88.1 ADR-113 file shape (4)
  - P88.2 Section components contain hover-lift + focus-visible (3 — case-study, contact-form, navbar both variants checked together)
  - P88.3 MobileListenFullscreen — no hardcoded hex (1 — verifies A2 migration: source contains 0 `#[0-9a-fA-F]{6}` literals)
  - P88.4 KISS — no animation libs in P88 source (1)
  - P88.5 EOP triplet (3)
- `plans/implementation/phase-88/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync — ADRs 112 → 113; tests +10; capabilities entry; LEAVE NOTE-FOR-P89/A6 to bump 113 → 115 in same combined commit (P89 ships ADR-114 + ADR-115)

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`.

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new features — polish only
4. Each A1 file ≤25 LOC of edits; A2 file ≤30 LOC
5. NO touching files outside owned list
6. NO shell commands inside agents (except tsc + targeted playwright run)
7. TypeScript-strict
8. Backward-compat — every existing test must remain GREEN

## Acceptance gates
- All 3 section types (menu/case-study/contact-form) score ≥8.5
- MobileListenFullscreen — zero hard-coded hex literals
- ADR-113 Accepted
- ≥10 P88 tests GREEN
- Cumulative ≥740 session OC chain regression
- tsc strict clean
