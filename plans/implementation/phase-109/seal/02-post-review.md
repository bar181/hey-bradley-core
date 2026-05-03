# P109 / ADR-LEDGER-TRUTH-UP — Post-Review

> **Phase:** P109 · **Sprint:** ADR-LEDGER-TRUTH-UP · **Sealed:** 2026-05-03
> **Predecessor:** P108 / TEST-RUNTIME-SHIFT at `b009ac5` (224 GREEN at anchor)
> **Audit basis:** Track A items A2 (closed at P106) + A3 (README stale by 89 ADRs through 60+ phases)
> **Wave 1 commit:** `09d0327`

## Sprint summary

P109 closes **documentation truth-up P1 items** that did not block v2.0.0-RC1 release but that violated the audit-trail discipline:

1. **A3 — `docs/adr/README.md` claimed 38 ADRs through ADR-048; disk had 127 files through ADR-136**. The ledger had been stale by 89 ADRs across 60+ phases. New contributors had no map; audits had no canonical truth-set.
2. **A2 (closed at P106) — verify alignment + add regression guard**. P106 / ADR-134 closed a 3-way section-type enum drift across 5 source files. P109 prevents future drift via a CI-enforced 5-source mutual-consistency test.

Two waves: 2 disjoint-scope parallel agents (A12 + A13) + 1 closer (A14).

## Per-agent deltas

### A12 — `docs/adr/README.md` rebuilt to disk reality

- Was: claims 38 ADRs through ADR-048 (last touched 2026-04-27 / post-P19; 60+ phases stale)
- Now: 127 ADR entries / 18 phase-family buckets / 260 LOC (≤500 cap)
- Every title sourced verbatim from disk (no fabricated titles)
- Documented ID gaps explicit: 002-004, 006-009, 034-037, 123-125 reserved
- Stub-then-superseded duplicates explicit: ADR-051/052/053 each have a P21 stub + a later Accepted file
- SUPERSEDED list: ADR-076 → ADR-090 (Sprint J 3-tab nav superseded by Mobile UX Redesign); ADR-057 → ADR-134 (LLM-driven SELECTION_ATOM superseded by deterministic `templateMatcher.ts`)
- Phase-family bucketing matches CLAUDE.md timeline: Foundation (P11-P15), Local Persistence (P16), LLM Provider (P17-P19), MVP Close (P20), Sprints A-F (P23-P38), Sprints H-J (P44-P53), Moat K-N (P54-P57), RC+QA (P58-P60), Multi-Page MVP (P61), OC arc (P62-P83), v1.0.0 (P84), Agentic Workbench (P85-P101), RC1 hardening (P102-P109)

**Impact:** A3 CLOSED. The audit trail is now a real map. Future closers truth-up the README at every ADR addition; mechanical given consistent file naming.

### A13 — Section-enum drift regression guard

- NEW `tests/p109-section-enum-drift-guard.spec.ts` (211 LOC ≤ 200 cap target; 13 cases / 7 describes; 13/13 GREEN)
- 5 sources of section-type truth verified canonical 18:
  1. `src/lib/schemas/section.ts` — `sectionTypeSchema` Zod enum
  2. `src/lib/schemas/section.ts` — `VALID_SECTION_TYPES` array (P104 helper)
  3. `src/contexts/intelligence/prompts/system.ts` — PATCH_ATOM `SectionType` AISP `𝔼{...}` enum (post-P106 fix; "navbar" typo locked out)
  4. `src/contexts/intelligence/aisp/intentAtom.ts` — INTENT_ATOM `ALLOWED_TARGET_TYPES` array
  5. `src/lib/schemas/intent.ts` — `intentTargetTypeSchema` Zod enum (post-P106 fix)
- Aliases (article/long-form/testimonial/pull-quote/nav/cta/faq/stats) verified to live only in `validateSectionType`'s alias map (≥8 entries per ADR-104 taxonomy)
- Custom AISP math-symbol parser inline for PATCH_ATOM's `𝔼{...}` notation (no new dependency)
- 13/13 GREEN under chromium project (Desktop)

**Impact:** A2 + future-drift CLOSED. Adding a 19th section type now requires touching 5 source files + the test in lock-step — concrete forcing function for ADR-100 discipline.

### A14 — Closer (this run)

- `docs/adr/ADR-137-adr-ledger-truth-up.md` (NEW; ≤120 LOC; 39 LOC actual; Status: Accepted; 2 decisions; 5 cross-refs primary + secondary)
- `plans/implementation/phase-109/seal/{02-post-review,session-log,retrospective}.md` (this triplet)
- `CLAUDE.md` sync (P109 entry; ADR-137 ledger entry; Phase Roadmap row; test count anchor advanced; ADR file count 124 → 128)

## Coverage at seal

| Track A item | Pre-P109 | Post-P109 |
|--------------|----------|-----------|
| A2 — Section-enum 3-way reconciliation | Closed at P106 / ADR-134 (no regression guard) | 5-source mutual-consistency CI guard active |
| A3 — `docs/adr/README.md` truth-up | 38 ADRs through ADR-048 (60+ phases stale) | 127 entries / 18 phase families / verbatim titles |

## Test results

P109 net new GREEN: 13 (drift-guard spec) = **13 net new test runs**.

Cumulative regression at this anchor: previous-anchor 224 + P109 (13) = **237 GREEN** (≥234 preflight target; achieved with margin).

Composition: P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) + P105 (17) + P106 (22) + P107 (19) + P76 (24) + P108 (10 mobile + 33 helpers) + mobile-runs (20) + P109 (13) = 237.

## Files touched (Wave 2 / A14 closer)

- NEW `docs/adr/ADR-137-adr-ledger-truth-up.md`
- NEW `plans/implementation/phase-109/seal/02-post-review.md` (this file)
- NEW `plans/implementation/phase-109/seal/session-log.md`
- NEW `plans/implementation/phase-109/seal/retrospective.md`
- EDIT `CLAUDE.md` (Project Status + roadmap row + ADR ledger + test count + ADR file count)

## Quality gates

- ADR-137 ≤ 120 LOC cap → 39 LOC actual.
- 2-decision structure mirrors P104/P105/P107/P108 small-ADR cadence at the seal-arc (no architecture change; documentation + regression-guard sprint).
- Cross-refs span 5 ADRs: ADR-100 + ADR-134 + ADR-104 (primary) + ADR-127 + ADR-126 (secondary; sibling validator + drift-source ADRs).
- Both tsc strict configs clean after Wave 1 commit (`09d0327`); closer adds zero source code.
- KISS — no new dependencies (custom AISP math-symbol parser inline in spec; no parser library install).
- 13 net new GREEN test runs; 237 cumulative regression (≥234 target).
- README rebuilt verbatim from disk; no fabricated titles (every entry's first heading was the source).
- Documented gaps + supersessions + stub-then-superseded duplicates explicit in README; no silent drift.

## Handoff note

P109 completes the agent-led closure arc for the Track-A documentation gaps surfaced by `plans/strategic-reviews/2026-05-04-gaps-to-done/`. Open-core is now owner-runnable: every ADR in `docs/adr/` has a README entry; every section-type source is CI-locked to canonical 18; every helper declared in ADR-126 + ADR-127 has behavioral test coverage (P108); every Track D test-trustworthiness P1 is closed (P108) or reframed (D7 audit-grep correction). Remaining post-RC tasks are owner-required (CF#4 BYOK smoke + CF#5 STT calibration + tag v2.0.0-RC1) per `docs/launch/owner-launch-checklist.md` — the seal panel does not own those.
