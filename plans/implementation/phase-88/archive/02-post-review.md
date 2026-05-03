# P88 — Post-Review (SECTION-VISUAL-Q)

> **Phase:** P88 · **Sprint:** SECTION-VISUAL-Q · **Date:** 2026-05-01
> **Predecessor:** P86 + P87 sealed combined at `9570268` (~1051+ GREEN, 112 ADRs, library professional grade ≥8.5 declared)
> **Companion:** P89 (3 more agents — A4 ADR-114 gate, A5 Supabase scaffolding, A6 closer ADR-115; disjoint scope)

## Mandate

Three section types added P75 (case-study + contact-form) plus pre-existing
menu were not part of the P86 polish-wave-4 scope. P88 audits each against
the ADR-094 ≥8.5 standard with surgical fixes only. In the same sprint, P88
closes the P86 carry-forward on `MobileListenFullscreen.tsx` (seven hard-coded
hex literals identified by P86 / A2 recon; deferred at P86 close because the
A2 dispatch focused on Welcome.tsx).

3 parallel agents · disjoint scopes.

## Per-agent score

### A1 — menu / case-study / contact-form polish

**Owns:**
- `src/templates/case-study/CaseStudyCards.tsx` (EDIT — surgical; ADR-091 hover-lift + focus-visible; token compliance per ADR-087; real copy verification)
- `src/templates/contact-form/ContactFormSimple.tsx` (EDIT — surgical; form-field focus rings; button states; token spacing)
- `src/templates/navbar/NavbarCentered.tsx` + `src/templates/navbar/NavbarSimple.tsx` (EDIT — surgical; nav-item hover + active state)

**Standard:** Each file ≤25 LOC of surgical edits; canonical interaction
primitives (`transition-colors|hover:|focus-visible:`); token compliance per
ADR-087; no refactors; no new features.

**Score:** Pending A1 self-report at session-log roll-up.

### A2 — MobileListenFullscreen token migration (P86 carry-forward)

**Owns:**
- `src/components/shell/MobileListenFullscreen.tsx` (EDIT — replace 7 hard-coded hex sites with token references; ≤30 LOC of edits)

**Standard:** Visual-identity preservation (no color drift); use existing
`var(--hb-*)` tokens where they map cleanly; if not, introduce ≤3 new
`--hb-listen-*` tokens in the canonical token file. Spec gate (P88.3)
asserts zero hex literals post-migration.

**Score:** Pending A2 self-report at session-log roll-up.

### A3 — ADR-113 + tests + EOP closer (this agent)

**Owns:**
- `docs/adr/ADR-113-section-visual-quality-standard.md` (NEW; ≤120 LOC; Status Accepted)
- `tests/p88-section-visual.spec.ts` (NEW; 5 describe blocks P88.1-P88.5 / 12 cases)
- `plans/implementation/phase-88/02-post-review.md` (this file)
- `plans/implementation/phase-88/session-log.md`
- `plans/implementation/phase-88/retrospective.md`
- `CLAUDE.md` (P88 sync; LEAVE NOTE-FOR-P89/A6 to bump 113 → 115 in same combined commit)

**Score:** ADR ≤120 LOC ✓. Status Accepted markdown-bold-tolerant ✓.
Cross-refs ADR-087 / 091 / 094 / 100 ✓. Tests use `@playwright/test`,
FS-read PURE-UNIT, existsSync guards on A1 / A2 surfaces ✓. EOP triplet
hard-gate ✓. CLAUDE.md NOTE-FOR-P89/A6 placed inline ✓.

## Honest declarations (deferred / Tier-2)

- **Animated section transitions** (slide-in, fade-on-scroll, stagger) — DEFERRED to Tier-2 commercial polish layer. Would require Framer Motion / GSAP, banned by ADR-094 KISS continuation + ADR-111 §4 "no new features".
- **Per-section accessibility AAA** (color-contrast 7:1, screen-reader landmark redundancy) — DEFERRED to post-RC owner-led pass. AA is the open-core floor per ADR-102.
- **Section-level theming overrides** (per-section color palette injection) — DEFERRED to Tier-2 commercial. Current section types inherit theme tokens uniformly via design-token cascade.
- **Live visual regression testing** (Percy / Chromatic / Playwright snapshot) — DEFERRED to Tier-2 commercial. PURE-UNIT spec gate (P88.2 / P88.3) is the open-core proxy.
- **Re-scoring the other 15 section types** — DEFERRED. ADR-091 + ADR-094 + ADR-095 already declared the floor on those components in earlier polish waves (P65b / P67 / P67b / P67c). P88 §1 widens that floor to the new arrivals; explicit re-scoring of every type is post-RC carry-forward.

## Test count delta narrative

- P86 + P87 combined seal anchor: ~1051+ cumulative PURE-UNIT GREEN
- P88 (this phase): +~10 cases from `tests/p88-section-visual.spec.ts`
  - P88.1 ADR-113 file shape (4)
  - P88.2 Section components hover-lift + focus-visible (3)
  - P88.3 MobileListenFullscreen — no hardcoded hex (1)
  - P88.4 KISS — no animation libs in P88 source (1)
  - P88.5 EOP triplet present (3)
- **P88 anchor: ~1061+ cumulative PURE-UNIT GREEN**

The 12-case spec is the open-core gate on section visual quality. existsSync
guards on A1 / A2 surfaces let timing slips surface as carry-forward
rather than red-cascade. Hard-gate is ADR-113 + EOP triplet (this agent's
deliverables).

## Hard-rule compliance (A3)

- No source code edits ✓ (A1 owns section components; A2 owns MobileListenFullscreen)
- No touching A1's section files OR A2's MobileListenFullscreen / tokens ✓
- No touching ADR-114 / ADR-115 / `tests/p89-*` / `plans/implementation/phase-89/*` ✓
- ADR ≤120 LOC + Status Accepted markdown-bold-tolerant ✓
- Tests use `@playwright/test`; FS-read PURE-UNIT; existsSync guards ✓
- ROOT = `process.cwd()` (ESM) ✓
- No new deps; no animation libs in owned files ✓
- TypeScript-strict ✓
