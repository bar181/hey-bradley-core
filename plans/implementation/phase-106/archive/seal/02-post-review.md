# P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX — Post-Review

> **Phase:** P106 · **Sprint:** DEAD-CODE-PURGE + ATOM-VIEW-FIX · **Sealed:** 2026-05-03
> **Predecessor:** P105 / RC-BLOCKERS-CLOSURE at `424734c` (98 GREEN at anchor)
> **Audit basis:** `plans/strategic-reviews/2026-05-04-gaps-to-done/` (Tracks A + B + D items)
> **Wave 1 commit:** `1ee3f88`

## Sprint summary

P106 closes **architectural-debt P1 items** that did not block v2.0.0-RC1 release but that violated stated principles (atom purity, single source of truth):

1. **B2 — twoStepPipeline.ts orphan** (123 LOC at `src/contexts/intelligence/aisp/twoStepPipeline.ts`): an LLM-driven 2-step selection scaffolded at P28 / ADR-057; zero production callers (`templateMatcher.ts` is the de-facto SELECTION). KISS = delete.
2. **A1 — Atom→view dependency inversion**: 4 atom modules in `src/contexts/` imported types from `src/components/`. Violates pure-module discipline declared by ADR-118/121/122/128/129/130 D1.
3. **A2 + Track D — Section-type enum 3-way drift**: 5 sources of section-type truth disagreed (schema/PATCH_ATOM/intentAtom-Γ-R3/ALLOWED_TARGET_TYPES/intentTargetTypeSchema). Reconciled to canonical 18 per ADR-100; aliases live in `validateSectionType` runtime helper only.

Two waves: 3 disjoint-scope parallel agents (A1-A3) + 1 closer (A4).

## Per-agent deltas

### A1 — twoStepPipeline orphan deletion
- DELETE `src/contexts/intelligence/aisp/twoStepPipeline.ts` (-123 LOC; preflight guessed `templates/` path but actual location was `aisp/`)
- `aisp/index.ts` barrel exports removed (4-line edit + deletion comment referencing ADR-134)
- 3 p33 test describes converted to `.skip` with deletion comment
- Verifier `grep -rnE 'twoStepPipeline|runTwoStepPipeline' src/ --include='*.ts' --include='*.tsx' | grep -v '\.spec\.'` returns zero active hits

**Impact:** ADR-057 implementation SUPERSEDED (file remains for historical record; functional path is `templateSelector.ts` + `templateMatcher.ts` per ADR-098).

### A2 — Atom→view dependency inversion fix
- NEW `src/contexts/intelligence/aisp/processMapTypes.ts` (40 LOC) — exports `ProcessNode`, `ProcessEdge`, `ProcessMap`, `ProcessNodeStatus`, `ProcessEdgeType`
- NEW `src/contexts/specification/types.ts` (58 LOC) — exports `PhaseCard`, `SprintSummary`, related interfaces
- 4 atom modules updated to import from neutral location:
  - `src/contexts/intelligence/aisp/processAtom.ts`
  - `src/contexts/specification/exportClaudeCode.ts`
  - `src/contexts/specification/reviewers/kissReviewer.ts`
  - `src/contexts/specification/exporters/tddScaffoldGenerator.ts`
- `ProcessMapSVG.tsx` + `SpecWorkbench.tsx` re-export the same types (preserves public API)
- Verifier: zero `from '@/components/...'` imports remain in `src/contexts/`

**Impact:** atom purity now enforced by file structure, not just convention. Future atom additions importing from `src/components/` fail review obviously.

### A3 — Section-type enum 3-way reconciliation
- `src/contexts/intelligence/prompts/system.ts` PATCH_ATOM enum: `navbar` → `menu`; `+case-study`; `+contact-form` (16 → 18)
- `src/contexts/intelligence/aisp/intentAtom.ts` `ALLOWED_TARGET_TYPES` + `INTENT_ATOM Γ R3` + `PROJECT_TYPE_TARGET_BIAS`: 23 → 18 (aliases documented inline at `intentAtom.ts:60-63`)
- `src/lib/schemas/intent.ts` `intentTargetTypeSchema`: 23 → 18
- `src/contexts/intelligence/aisp/assumptions.ts` `SECTION_CUES` keys remapped (features→columns, cta→action, etc.)

**Impact:** 5 sources of section-type truth now agree on canonical 18. Aliases (features/cta/testimonials/faq/nav/value-props) live in `validateSectionType` runtime helper only. PATCH_ATOM + INTENT_ATOM + Zod schemas are now strict canonical-18 producers.

### A4 — Closer (this run)
- `docs/adr/ADR-134-dead-code-purge-atom-view-fix.md` (NEW; 82 LOC ≤ 120 cap; Status: Accepted; 4 decisions)
- `tests/p106-dead-code-purge.spec.ts` (NEW; 9 describe blocks / 19 cases)
- EOP triplet (this file + session-log + retrospective)
- `CLAUDE.md` sync

## Carry-forward closures

| ID | Audit chunk | Item | Status |
|----|-------------|------|--------|
| **B2** | architecture | `twoStepPipeline.ts` orphan deletion | **CLOSED** (A1) |
| **A1** | architecture | Atom→view dependency inversion (4 files) | **CLOSED** (A2) |
| **A2 + Track D** | features-functionality | PATCH_ATOM section-enum drift; 3-way reconciliation | **CLOSED** (A3) |

## ADR-057 supersession note

ADR-057 (Sprint C P3 SELECTION_ATOM, P28) is **SUPERSEDED in implementation**. The narrative survives via `templateSelector.ts` + `templateMatcher.ts` (P72 / OC-TI / ADR-098); only the LLM dispatcher in `twoStepPipeline.ts` is purged. The ADR-057 file remains on disk for historical record but its decisions section is functionally inert post-P106.

## Acceptance gate verification

- [x] ADR-134 exists at `docs/adr/ADR-134-dead-code-purge-atom-view-fix.md`; 82 LOC ≤ 120; Status: Accepted
- [x] `twoStepPipeline.ts` does NOT exist; zero production callers
- [x] Zero `from '@/components/'` imports in `src/contexts/` (4 atom files verified)
- [x] Neutral type modules exist: `processMapTypes.ts` + `types.ts`
- [x] PATCH_ATOM enum has 18 tokens (menu correct, case-study + contact-form present, no navbar)
- [x] `ALLOWED_TARGET_TYPES` length is 18
- [x] ≥15 P106 tests GREEN (19 cases / 9 describes)
- [x] Cumulative regression ≥113 GREEN (P101 25 + P102 22 + P-E2E-2 22 + P104 12 + P105 17 + P106 19 = 117)
- [x] Both tsc strict configs clean
- [x] EOP triplet at `plans/implementation/phase-106/seal/`
- [x] CLAUDE.md sync — P106 + ADR-134 + ADR-057 SUPERSEDED
- [x] No new deps
