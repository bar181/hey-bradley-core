# P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX — Retrospective

> **Sprint:** DEAD-CODE-PURGE + ATOM-VIEW-FIX · **Sealed:** 2026-05-03
> **Predecessor:** P105 sealed at `424734c`

## What to keep

- **3-agent disjoint-scope parallel dispatch + 1 closer pattern** (mirrors P98 / P99 / P100W2-FMT). Three agents owned non-overlapping surfaces (deletion / type-extraction / enum-reconciliation) — zero merge conflicts. Closer added ADR + tests + EOP triplet + CLAUDE.md sync without touching A1/A2/A3 outputs.
- **Preflight-as-charter discipline.** Preflight named the architectural-debt items by ID + audit-chunk reference, set LOC caps, and listed verifier commands. A4 closer used the same verifier commands to confirm Wave 1 outcomes before authoring tests — cycle-time win.
- **Soft-pass guards on file-shape tests.** `existsSync` skip pattern means a partial Wave-1 commit doesn't bring down the whole spec; hard-gate is reserved for canonical-truth assertions (ADR-134 cross-refs, EOP triplet, enum-count = 18).
- **Re-export pattern on React surfaces** (`ProcessMapSVG.tsx` + `SpecWorkbench.tsx`). Atoms moved to neutral type modules; surfaces re-export to preserve public API. Zero downstream churn for any consumer importing from the React component path.
- **ADR-057 SUPERSEDED honest.** The orphan deletion is recorded as superseding the ADR-057 implementation, not as silent removal. ADR-134 documents the supersession; future readers know `templateMatcher.ts` is the canonical SELECTION.

## What to drop

- **The preflight assumption that twoStepPipeline.ts lived at `templates/`.** It was at `aisp/`. A1 had to grep first; preflight could have run the existsSync check itself before guessing the path. Cost: ~2 minutes of confusion in A1.
- **Per-source-file alias enumeration in CLAUDE.md.** P104 + P105 + P106 all carried slightly different alias lists in their CLAUDE.md entries. The canonical alias list now lives in `validateSectionType` + `intentAtom.ts:60-63` inline comment; CLAUDE.md should reference the helper, not enumerate.
- **Manual track-letter audit-chunk references.** "B2", "A1", "A2 + Track D" — the audit doc has 5 chunks and the letter-prefixes inside each chunk repeat. P107 should reference items by line-anchor in the audit doc instead.

## What to reframe

- **Atom purity is a structural rule, not a convention.** Pre-P106 the rule was "atoms should be pure modules" stated 6 times across ADR-118/121/122/128/129/130. Post-P106 the rule is "atoms cannot import from `src/components/`" enforceable by grep. Future ADRs should encode rules as grep-checkable assertions where possible.
- **Section-type enum drift is a testing gap, not a discipline gap.** Five sources existed because no test asserted they were the same. P106 added `tests/p106-dead-code-purge.spec.ts` P106.5 + P106.6 to count tokens in each source. This is the right-shape gate for any future canonical-list claim.
- **Dead code outlives its rationale.** twoStepPipeline.ts shipped at P28 (Sprint C P3, ADR-057). It was orphaned by P72 (OC-TI / ADR-098) when the rules-first matcher won. It survived 33 phases of "we'll get to it" until the brutal-honest audit forced the deletion. Lesson: when a P-arc invalidates a prior approach, supersede the ADR + delete the code in the same commit, not later.

## Velocity note

P106 estimated 4-6 hours per the post-P105 priority-list table; actual elapsed was ~2 hours from preflight commit (`f63bdff`) to seal. Consistent with the velocity-corrected estimate. Three-agent disjoint-scope dispatch held — zero merge conflicts, zero cross-agent rework.

## Quality discipline

- ADR-134 ≤ 120 LOC cap → 82 LOC actual.
- 4-decision structure mirrors ADR-127 + ADR-128 + ADR-129 + ADR-130 (small-ADR cadence at the seal-arc).
- Cross-refs span 8 ADRs: ADR-057 (SUPERSEDED) + ADR-098 + ADR-099 + ADR-100 + ADR-118 + ADR-121 + ADR-122 + ADR-128 + ADR-129 + ADR-130 (lineage from SELECTION → atoms → seal panel).
- Both tsc strict configs clean after Wave 1 commit; closer adds zero source code.
- KISS denylist verified at P106.9: zero new deps.
