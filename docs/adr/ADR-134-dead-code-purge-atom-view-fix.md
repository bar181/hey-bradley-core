# ADR-134 — Dead-Code Purge + Atom→View Inversion Fix + Section-Enum Reconciliation

- **Status:** Accepted
- **Date:** 2026-05-03
- **Phase:** P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX
- **Cross-refs (primary):** ADR-057 (SUPERSEDED — LLM-driven SELECTION_ATOM 2-step path; `templateMatcher.ts` is now the canonical SELECTION), ADR-100 (Section Type Completeness — canonical 18 enum), ADR-118 (PROCESS_ATOM pure-module discipline), ADR-121 (SpecWorkbench store-agnostic component), ADR-122 (Export Claude Code emitter), ADR-128 (TDD Scaffold pure module), ADR-129 (KISS Reviewer pure module), ADR-130 (Seal Panel pure component)
- **Cross-refs (secondary):** ADR-098 (Template Intelligence — 3-layer matcher), ADR-099 (DECOMP_ATOM), ADR-104 (Page-Aware Pipeline), ADR-127 (Format Verification — exposed atom-helper drift)

## Context

The brutal-honest gap audit at `plans/strategic-reviews/2026-05-04-gaps-to-done/` (5-chunk deep-dive) surfaced three architectural-debt P1 items left over from the v2.0.0-RC1 push that did NOT block release but that violate stated principles:

1. **B2 — twoStepPipeline orphan** (~123 LOC at `src/contexts/intelligence/aisp/twoStepPipeline.ts`): an LLM-driven 2-step selection pipeline scaffolded at P28 / Sprint C P3 / ADR-057 with **zero production callers**. The de-facto SELECTION path is `templateSelector.ts` + `templateMatcher.ts` (P72 / OC-TI / ADR-098). KISS principle (ADR-129) says delete.
2. **A1 — Atom→view dependency inversion**: 4 atom modules in `src/contexts/` imported types from `src/components/` (`@/components/planning/ProcessMapSVG` + `@/components/agentics/SpecWorkbench`). This violates the pure-module discipline declared by ADR-118 D1 + ADR-121 D3 + ADR-122 D1 + ADR-128 D1 + ADR-129 D1 + ADR-130 D1: atoms are pure data transforms; React components consume them, not the reverse.
3. **A2 + Track D — Section-type enum 3-way drift**: 5 sources of section-type truth disagreed. `prompts/system.ts:44-45` PATCH_ATOM listed 16 types using `navbar` (not in `sectionTypeSchema`); `intentAtom.ts ALLOWED_TARGET_TYPES` had 23 entries with raw aliases; `intent.ts intentTargetTypeSchema` had 23; `assumptions.ts SECTION_CUES` keyed on stale names. Canonical truth per ADR-100 is **18 types**.

P104 / SCHEMA-GUARDS shipped `validateSectionType` as the runtime alias-to-canonical remap helper. P106 now reconciles the static enum sources to the canonical 18 so the helper handles aliases at the boundary, not at every call site.

## Decisions

### Decision 1 — twoStepPipeline.ts deletion supersedes ADR-057

`src/contexts/intelligence/aisp/twoStepPipeline.ts` (123 LOC) is **DELETED**. ADR-057 (Sprint C P3 SELECTION_ATOM, P28) is **SUPERSEDED** in implementation: the canonical SELECTION path is `templateSelector.ts` (rules-first 3-layer match per ADR-098) + `templateMatcher.ts`. The LLM-driven 2-step pipeline was an ADR-057 era experiment that never reached production wire — zero `runTwoStepPipeline|twoStepPipeline` callers in `src/`. P28's narrative (template selection from candidates) survives via the matcher; only the LLM dispatcher in `twoStepPipeline.ts` is purged. Three p33 test describes referencing the removed surface are converted to `.skip` with a deletion comment pointing here. ADR-057 file remains on disk for historical record but its decisions section is functionally inert post-P106.

### Decision 2 — Atoms MUST NOT import from `src/components/`

The atom-module purity rule is now enforced by file structure, not just convention:

- Shared spec types live at `src/contexts/specification/types.ts` (NEW; 58 LOC) — exports `PhaseCard`, `SprintSummary`, related interfaces.
- Process-map graph types live at `src/contexts/intelligence/aisp/processMapTypes.ts` (NEW; 40 LOC) — exports `ProcessNode`, `ProcessEdge`, `ProcessMap`, `ProcessNodeStatus`, `ProcessEdgeType`.
- The 4 atom modules (`processAtom.ts` + `exportClaudeCode.ts` + `kissReviewer.ts` + `tddScaffoldGenerator.ts`) import from these neutral locations.
- React surfaces (`ProcessMapSVG.tsx` + `SpecWorkbench.tsx`) **re-export** the same types from the neutral modules so existing public-API consumers continue to work without source-side churn.

Verifier: `grep -rE "from ['\"]@/components" src/contexts/` returns zero hits across all 4 atom files. The directional rule is now visible in the import graph.

### Decision 3 — Section-type 3-way drift reconciled to canonical 18

The 18 section types per ADR-100 (`sectionTypeSchema` is the source of truth) propagate to all static enum sources:

| Source | Pre-P106 | Post-P106 |
|--------|----------|-----------|
| `sectionTypeSchema` (Zod) | 18 | 18 (unchanged — canonical) |
| `VALID_SECTION_TYPES` (validateSectionType) | 18 | 18 (unchanged) |
| `prompts/system.ts` PATCH_ATOM | 16 (with `navbar`) | 18 (`menu` correct + `case-study` + `contact-form`) |
| `intentAtom.ts ALLOWED_TARGET_TYPES` | 23 (raw aliases) | 18 (aliases moved to `validateSectionType` helper per Decision 4) |
| `intentAtom.ts INTENT_ATOM Γ R3` | 23 | 18 |
| `intent.ts intentTargetTypeSchema` | 23 | 18 |
| `assumptions.ts SECTION_CUES` keys | mixed (features / cta) | canonical (columns / action) |

Aliases (`features`→`columns`, `cta`→`action`, `testimonials`→`quotes`, `faq`→`questions`, `nav`→`menu`, `value-props`→`columns`, etc.) are documented inline at `intentAtom.ts:60-63` and live in `validateSectionType` runtime helper only. PATCH_ATOM, INTENT_ATOM, and the Zod schemas are now strict canonical-18 producers; user-facing input flows through `validateSectionType` for friendly remap.

### Decision 4 — PATCH_ATOM `navbar` typo → `menu`

`prompts/system.ts:44-45` had `navbar` in the SectionType enum — historical drift from a pre-ADR-100 era. Corrected to `menu` (canonical). Matchers / classifiers were unaffected because no code path emitted `navbar` post-P75; the LLM prompt enum was the only stale surface. PATCH_ATOM now reads:

```
SectionType := 𝔼{ hero, menu, columns, pricing, action, footer,
                  quotes, questions, numbers, gallery, logos, team,
                  image, divider, text, blog, case-study, contact-form }
```

18 types · matches ADR-100 · matches `sectionTypeSchema`.

## Acceptance Gates

1. ADR-134 exists at `docs/adr/ADR-134-dead-code-purge-atom-view-fix.md`; ≤120 LOC; Status: Accepted.
2. `src/contexts/intelligence/aisp/twoStepPipeline.ts` does NOT exist (existsSync false); zero production callers.
3. Zero `from '@/components/...'` imports in `src/contexts/` (verified by grep on 4 specific atom files).
4. Neutral type modules exist: `src/contexts/specification/types.ts` + `src/contexts/intelligence/aisp/processMapTypes.ts`.
5. PATCH_ATOM enum in `prompts/system.ts` contains `menu` + `case-study` + `contact-form`; does NOT contain `navbar`.
6. `ALLOWED_TARGET_TYPES` length is 18 in `intentAtom.ts`.
7. P106 EOP triplet at `plans/implementation/phase-106/seal/{02-post-review,session-log,retrospective}.md`.
8. CLAUDE.md sync: P106 entry; ADR-134 ledger entry; ADR-057 marked SUPERSEDED.
9. Cumulative regression GREEN: P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) + P105 (17) + P106 (≥15) ≥ 113.

## Consequences

**Positive:** The atom-purity rule is now enforced by structure — future atom additions that import from `src/components/` will fail review obviously. The section-enum drift that wasted ~6 person-hours of P104 + P105 + P106 reconciliation is closed: one source per fact, aliases via helper. The orphan deletion (-123 LOC) reduces maintenance surface and removes a misleading code path that future readers might assume was wired. ADR-057 status is honest at the seal — it shipped the matcher but not the pipeline.

**Negative:** The 4 atom modules + 2 React surfaces re-import shape changed; downstream consumers that reached into `aisp/processAtom.ts` for `ProcessMap` types (none known) would need a one-line import-path fix. p33 test describes are skipped, not deleted — minor noise in test output.

**Mitigations:** Re-exports from `ProcessMapSVG.tsx` + `SpecWorkbench.tsx` preserve the public-API surface for any consumer that imports from the React component (the documented path). p33 skipped describes carry deletion comments pointing to ADR-134. Cumulative-regression delta is +15 (P106 spec) with no baseline regressions.
