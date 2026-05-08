# P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX — Preflight

> **Phase:** P106 · **Sprint:** DEAD-CODE-PURGE + ATOM-VIEW-FIX · **Date:** 2026-05-04
> **Predecessor:** P105 / RC-BLOCKERS-CLOSURE sealed at `424734c` (98/98 cumulative GREEN)

## Mandate

Close the architectural debt surfaced by Tracks A + B in the brutal-honest gap audit. Three concerns:

1. **B2 — twoStepPipeline orphan**: `src/contexts/intelligence/templates/twoStepPipeline.ts` (~245 LOC); ADR-057 SELECTION_ATOM LLM-driven path; ZERO production callers (templateMatcher.ts is the de-facto SELECTION). KISS = delete.
2. **A1 — Atom→view dependency inversion**: 4 files in `src/contexts/` import types from `src/components/` (PROCESS atom + exportClaudeCode + kissReviewer + tddScaffoldGenerator import from `@/components/planning/ProcessMapSVG` and `@/components/agentics/SpecWorkbench`). Violates ADR-118/121/122/128/129/130 D1 ("pure module, no React, no store imports"). Move shared types to a neutral location.
3. **A2 + Track D — PATCH_ATOM section-enum drift**: `src/contexts/intelligence/prompts/system.ts:44-45` lists 16 types using `navbar` (not in `sectionTypeSchema`); missing `case-study`, `contact-form`, `value-props`, `testimonials`, `faq`. Three sources of section-type truth disagree: schema (18) / PATCH_ATOM (16, one wrong) / `intentAtom.ts ALLOWED_TARGET_TYPES` (23). Reconcile to the canonical 18.

## Out of scope

- ASSUMPTIONS_FALLBACK_TEMPLATES wire (B8) — deferred to P107 if cheap; otherwise post-launch
- 5 unwired event_types → P107
- Empty p76 spec / mobile viewports → P108
- ADR README rebuild → P109

## Agents · 2 waves

### Wave 1 — 3 parallel disjoint-scope agents

#### A1 — twoStepPipeline orphan deletion
**Owns:**
- DELETE `src/contexts/intelligence/templates/twoStepPipeline.ts`
- VERIFY zero production import sites: `grep -rnE 'twoStepPipeline|runTwoStepPipeline|selectTemplate' src/ --include='*.ts' --include='*.tsx' | grep -v '\.spec\.'` → expect 0 hits
- If any import line references it (even commented), delete those import lines surgically
- Delete or update the spec file `tests/p28-sprint-c-p3-selection.spec.ts` if it has hard test against twoStepPipeline runtime (replace with grep-based "file removed" assertion)
- Update CLAUDE.md ADR ledger entry referencing ADR-057 to mark it SUPERSEDED (B2 deletion supersedes the LLM-driven selection)
**Cap:** -245 LOC; ≤30 LOC delta on consumer-side cleanup

#### A2 — Atom→view dependency inversion fix
**Owns:**
- Identify all 4 atom modules importing from `src/components/`:
  - `src/contexts/intelligence/aisp/processAtom.ts` (ProcessMapSVG type import)
  - `src/contexts/specification/exportClaudeCode.ts` (PhaseCard from SpecWorkbench)
  - `src/contexts/specification/kissReviewer.ts` (related types)
  - `src/contexts/specification/tddScaffoldGenerator.ts` (related types)
- Move shared types to a neutral location:
  - NEW: `src/contexts/specification/types.ts` — exports `PhaseCard`, `SprintSummary`, related interfaces
  - NEW: `src/components/planning/processMapTypes.ts` — exports `ProcessNode`, `ProcessEdge`, `ProcessMap` (or move to `src/contexts/intelligence/aisp/processMapTypes.ts`)
- Update the 4 atom files to import from the neutral location
- Update SpecWorkbench.tsx + ProcessMapSVG.tsx to import the same types (re-export not required)
- VERIFY no `from '@/components'` imports remain in `src/contexts/`
**Cap:** ~80 LOC delta; pure refactor — no behavior change

#### A3 — Section-enum 3-way reconciliation
**Owns:**
- `src/contexts/intelligence/prompts/system.ts` — fix the 16-type PATCH_ATOM enum:
  - `navbar` → `menu` (canonical name)
  - Add missing types: `case-study`, `contact-form`, `value-props`, `testimonials`, `faq`
  - Final count: 18 (matches `sectionTypeSchema`)
- `src/contexts/intelligence/aisp/intentAtom.ts` — `ALLOWED_TARGET_TYPES` (currently 23):
  - Audit each entry; remove anything NOT in the canonical 18
  - Document the remap inline if any aliases stay (e.g., `nav` → references `menu`)
- VERIFY all 3 sources match: schema (18) / PATCH_ATOM (18) / intentAtom (18-or-aliases-of-18)
**Cap:** ~30 LOC delta

### Wave 2 — Closer

#### A4 — ADR-134 + tests + EOP
**Owns:**
- `docs/adr/ADR-134-dead-code-purge-atom-view-fix.md` (NEW; ≤120 LOC; Status: Accepted)
  - 4 decisions: (1) twoStepPipeline deletion supersedes ADR-057's LLM-driven SELECTION; templateMatcher.ts is canonical; (2) atom modules MUST NOT import from `src/components/`; types live in `src/contexts/specification/types.ts` or `src/contexts/intelligence/aisp/*Types.ts`; (3) section-type 3-way drift reconciled to 18 canonical per `sectionTypeSchema`; (4) PATCH_ATOM `navbar` typo corrected to `menu`
  - Cross-refs: ADR-057 (SUPERSEDED), ADR-100 (section-type completeness), ADR-118/121/122/128/129/130 (atom pure-module discipline)
- `tests/p106-dead-code-purge.spec.ts` (NEW; ≥15 cases / ≥6 describes)
  - P106.1 — twoStepPipeline.ts file does NOT exist (existsSync false) + zero production callers
  - P106.2 — Atom modules do NOT import from `src/components/` (grep on 4 specific files)
  - P106.3 — Shared types module exists at neutral location
  - P106.4 — `prompts/system.ts` PATCH_ATOM enum has 18 types and includes `menu` not `navbar`
  - P106.5 — `intentAtom.ts ALLOWED_TARGET_TYPES` aligns with canonical 18
  - P106.6 — ADR-134 file shape (status accepted; cross-refs)
  - P106.7 — EOP triplet at `plans/implementation/phase-106/seal/`
- `plans/implementation/phase-106/seal/{02-post-review,session-log,retrospective}.md`
- `CLAUDE.md` sync (P106 entry; ADR ledger update with ADR-134 + ADR-057 SUPERSEDED note)

## Hard rules

1. NO new dependencies
2. NO behavior change beyond declared decisions (pure refactor + dead-code purge + enum fix)
3. Both tsc strict configs clean after seal
4. fire-and-forget contract preserved per ADR-126 D4
5. EOP triplet at `plans/implementation/phase-106/seal/`
6. KISS — ADR ≤120 LOC

## Acceptance gates

- twoStepPipeline.ts deleted; zero production callers
- 4 atom modules: zero `@/components/` imports
- Section-type enum aligned across 3 sources
- ADR-134 Accepted citing ADR-057+100+118+121+122+128+129+130
- ≥15 P106 tests GREEN
- Cumulative regression: P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) + P105 (17) + P106 (≥15) ≥ 113 GREEN
- Both tsc strict configs clean
