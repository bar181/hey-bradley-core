# ADR-137 — ADR Ledger Truth-Up + Section-Enum Drift Regression Guard

- **Status:** Accepted
- **Date:** 2026-05-03
- **Phase:** P109 / ADR-LEDGER-TRUTH-UP
- **Cross-refs (primary):** ADR-100 (Section Type Completeness — canonical 18 enum is the source of truth this ADR pins), ADR-134 (Dead-Code Purge + Atom→View Inversion Fix + Section-Enum Reconciliation — P106 closed the 3-way drift; P109 prevents regression), ADR-104 (Page-Aware Pipeline — `validateSectionType` callers in `data/examples/index.ts` consume the alias map this ADR documents)
- **Cross-refs (secondary):** ADR-127 (Format Verification — surfaced the atom-helper drift that motivated P106), ADR-126 (Comprehensive LLM Interaction Logging — sibling validator pattern for `validateEventType`)

## Context

The `docs/adr/README.md` index was last touched 2026-04-27 (post-P19) when the project had 38 ADRs through ADR-048. Disk reality at P108 seal was 127 files through ADR-136 across 60+ phases. The ledger had been stale by 89 ADR entries through 18 phase families — Foundation (P11-P15), Sprints A-F (P23-P38), Sprints H-J (P44-P53), Moat K-N (P54-P57), RC+QA (P58-P60), OC arc (P61-P83), v1.0.0 (P84), Agentic Workbench (P85-P101), and RC1 hardening (P102-P109). New contributors had no map; the audit trail Track A relied on was unreliable. Separately, P106 / ADR-134 closed a 3-way section-type enum drift across 5 source files (`sectionTypeSchema` Zod, `VALID_SECTION_TYPES` helper, PATCH_ATOM `SectionType`, INTENT_ATOM `ALLOWED_TARGET_TYPES`, `intentTargetTypeSchema`) — but no regression guard existed to prevent future drift when a new section type lands or an alias gets miscategorised. P109 closes both gaps in one sprint: rebuild the README to disk reality and lock the canonical 18 across all 5 sources at every CI run.

## Decisions

### Decision 1 — `docs/adr/README.md` rebuilt to 127-file disk reality

The index now lists every ADR by ID + title + status, sourced verbatim from each file's first heading (no fabricated titles). Entries are bucketed under 18 phase-family headings matching the CLAUDE.md timeline: Foundation (P11-P15), AISP P21-stub-then-superseded duplicates (ADR-051/052/053 each have a P21 stub at `docs/adr/ADR-NNN-aisp-*.md` plus a later Accepted file at the same number — both retained for audit; documented), Local Persistence (P16), LLM Provider (P17-P19), MVP Close (P20), Sprint A-F (P23-P38), Sprint H-J (P44-P53), Moat K-N (P54-P57), RC+QA (P58-P60), Multi-Page MVP (P61), OC arc (P62-P83), v1.0.0 (P84), Agentic Workbench (P85-P101), and RC1 hardening (P102-P109). Documented ID gaps (002-004, 006-009, 034-037, 123-125 reserved) are explicit; the SUPERSEDED list names ADR-076 → ADR-090 (Sprint J 3-tab nav superseded by Mobile UX Redesign) and ADR-057 → ADR-134 (LLM-driven SELECTION_ATOM superseded by deterministic `templateMatcher.ts`). README cap held at ≤500 LOC; actual 260 LOC.

### Decision 2 — Section-enum drift regression guard locks 5 sources to the canonical 18

`tests/p109-section-enum-drift-guard.spec.ts` (211 LOC; 13 cases / 7 describes; 13/13 GREEN) reads all 5 sources of section-type truth at every CI run and asserts mutual consistency. The 5 sources: (1) `sectionTypeSchema` Zod enum in `src/lib/schemas/section.ts`; (2) `VALID_SECTION_TYPES` array in the same file (P104 helper); (3) PATCH_ATOM `SectionType` enum in `src/contexts/intelligence/prompts/system.ts` written in AISP math-symbol notation `𝔼{...}` and parsed by a custom math-symbol parser inline in the spec; (4) INTENT_ATOM `ALLOWED_TARGET_TYPES` array in `src/contexts/intelligence/aisp/intentAtom.ts`; (5) `intentTargetTypeSchema` Zod enum in `src/lib/schemas/intent.ts`. Each source must produce exactly 18 sorted-equal entries; aliases (article/long-form/testimonial/pull-quote/nav/cta/faq/stats) MUST live only in the `validateSectionType` helper's alias map (≥8 entries verified per ADR-104 taxonomy) and MUST NOT appear in any of the 5 canonical sources. The "navbar" typo P106 fixed in PATCH_ATOM is explicitly locked out by a dedicated assertion. Adding a 19th section type now requires touching 5 files plus the test in lock-step — a concrete forcing function for the discipline ADR-100 declared.

## Acceptance Gates

1. ADR-137 exists at `docs/adr/ADR-137-adr-ledger-truth-up.md`; ≤120 LOC; Status: Accepted.
2. `docs/adr/README.md` rebuilt; ≤500 LOC; lists all 127 ADRs by ID + title + status sourced verbatim from disk; documents gaps + supersessions + stub-then-superseded duplicates.
3. `tests/p109-section-enum-drift-guard.spec.ts` exists; ≥10 cases GREEN; reads all 5 sources of section-type truth + asserts mutual consistency.
4. P109 EOP triplet at `plans/implementation/phase-109/seal/{02-post-review,session-log,retrospective}.md`.
5. CLAUDE.md sync: P109 entry; ADR-137 ledger entry; Phase Roadmap row; ADR file count advanced 124 → 128.
6. Cumulative regression GREEN: previous-anchor 224 + P109 (13) ≥ 237.
7. Both tsc strict configs clean after seal.

## Consequences

**Positive:** The README is now an accurate map. New contributors and audit teams can grep ADR titles by phase family; the 18-bucket layout matches the CLAUDE.md timeline. Documented gaps + supersessions + stub-then-superseded duplicates are explicit, eliminating the "ADR-052: which one?" footgun. The drift-guard test promotes the canonical 18 from a discipline expectation (ADR-100) to a CI-enforced invariant — adding a 19th type now fails 5+ assertions until all 5 sources align, and removing one fails symmetrically. Future ADR-100-class drifts (P106-style 3-way mismatches) cannot ship silently.

**Negative:** Adding a new section type now requires editing 5 source files plus the test in one PR — a deliberate friction that pays for itself but slows single-file experimental edits. The README, while sourced verbatim, still requires a manual rebuild whenever a new ADR lands; an automated `docs/adr/build-readme.ts` script is a Tier-2 candidate but rejected at P109 to avoid new infrastructure. The PATCH_ATOM math-symbol parser inline in the test is bespoke (not a general AISP parser library) — sufficient for this enum but would need expansion for any future AISP-format assertion.

**Mitigations:** Decision 2's 5-source lockstep is documented in the spec's leading comment block + this ADR; a future "add a 19th type" PR has both a checklist (the 5 sources) and a test forcing function (P109.7's mutual-consistency assertion). The README rebuild cadence is documented in the README header note ("Last updated: 2026-05-04 (P109 / ADR-LEDGER-TRUTH-UP)") so future closers know to truth-up at every ADR addition; the rebuild is mechanical given the consistent ADR file naming convention. The math-symbol parser rationale lives inline in the spec for any future maintainer extending AISP-format assertions.
