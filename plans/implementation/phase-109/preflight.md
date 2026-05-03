# P109 / ADR-LEDGER-TRUTH-UP — Preflight

> **Phase:** P109 · **Sprint:** ADR-LEDGER-TRUTH-UP · **Date:** 2026-05-04
> **Predecessor:** P108 / TEST-RUNTIME-SHIFT sealed at `b009ac5` (224/224 cumulative GREEN)

## Mandate

Close the documentation truth-up gaps surfaced by Track A. Two concerns:

1. **A3 — `docs/adr/README.md` claims 38 ADRs through ADR-048; disk has 127 files through ADR-136**. The ledger has been stale by 89 ADRs through 60+ phases. Rebuild fully.
2. **A2 already addressed in P106** — section-type 3-way reconciliation closed. Verify alignment in this sprint via re-grep + add a regression test that prevents future drift.

## Out of scope

- Carry-forwards 14 deferred items (5 owner-required + 8 Tier-2 + 1 judgment) — remain at end of master checklist
- Live-LLM smoke (CF#4) / STT (CF#5) — owner-required
- Render-time validation (browser click-through) — owner-required

## Agents · 2 waves

### Wave 1 — 2 parallel disjoint-scope agents

#### A12 — Rebuild docs/adr/README.md
**Owns:**
- `docs/adr/README.md` — full rebuild
- Current claim: 38 ADRs through ADR-048
- Reality: 127 files (ADR-001..ADR-136 with documented gaps + 3 P21 stub-then-superseded duplicates)
- Required structure (mirror existing format if any):
  - Header — date, ADR count, highest-ID
  - Numbered list of all 127 ADRs by ID with title + phase + status (Accepted / Proposed / SUPERSEDED)
  - "ADRs by Phase" table — group by phase family (P11-P22 foundation; P23-P38 sprints A-F; P44-P53 sprints H-J; P54-P57 moat K-N; P58-P60 RC+QA; P61-P83 OC arc; P84 v1.0.0; P85-P101 Agentic Workbench; P102-P109 RC1 hardening)
  - Documented ID gaps (002-004, 006-009, 034-037, 123-125)
  - Stub-then-superseded duplicates (ADR-051, 052, 053 each have a P21 stub + a later Accepted file)
  - SUPERSEDED ADRs list (ADR-076 by ADR-090; ADR-057 by ADR-134)
- Cap: ≤500 LOC

#### A13 — Section-enum drift regression guard
**Owns:**
- `tests/p109-section-enum-drift-guard.spec.ts` (NEW; ≥10 cases / ≥4 describes / ≤200 LOC)
  - Read all 5 sources of section-type truth:
    1. `src/lib/schemas/section.ts` — `sectionTypeSchema` Zod enum
    2. `src/lib/schemas/section.ts` — `VALID_SECTION_TYPES` array (P104 helper)
    3. `src/contexts/intelligence/prompts/system.ts` — PATCH_ATOM `SectionType` enum (post-P106 fix)
    4. `src/contexts/intelligence/aisp/intentAtom.ts` — `INTENT_ATOM` Γ R3 string + `ALLOWED_TARGET_TYPES` array
    5. `src/lib/schemas/intent.ts` — `intentTargetTypeSchema` Zod enum (post-P106 fix)
  - For each, parse out the type list (regex)
  - Assert all 5 sources agree on canonical 18 from sectionTypeSchema
  - Assert no source contains aliases (article/testimonial/cta/faq/etc) — those live in validateSectionType helper only
  - Assert validateSectionType has the documented 10-entry alias map
- Cap: ≤200 LOC

### Wave 2 — Closer

#### A14 — ADR-137 + EOP + CLAUDE.md sync
**Owns:**
- `docs/adr/ADR-137-adr-ledger-truth-up.md` (NEW; ≤120 LOC; Status: Accepted)
  - 2 decisions: (1) ADR README rebuilt to 127-file reality; documented gaps + supersessions + duplicates; (2) section-enum drift regression guard prevents future regression
  - Cross-refs: ADR-100, ADR-134, ADR-104
- `plans/implementation/phase-109/seal/{02-post-review,session-log,retrospective}.md`
- `CLAUDE.md` sync (P109 entry + Phase Roadmap row + ADR-137 ledger update)
- Final test count anchor

## Hard rules

1. NO new dependencies
2. ADR-137 ≤120 LOC; Status: Accepted
3. Both tsc strict configs clean after seal
4. EOP triplet at `plans/implementation/phase-109/seal/`
5. README rebuild MUST verify against disk (no fabricated ADR titles)
6. Drift guard tests MUST be hard-gate (regex enforcement, not soft-pass existsSync)

## Acceptance gates

- README.md rebuilt with 127 ADR entries
- ≥10 P109 drift-guard tests GREEN
- ADR-137 Accepted citing ADR-100 + ADR-134 + ADR-104
- Cumulative regression: 224 + ≥10 (P109 wave) ≥ 234 GREEN
- Both tsc strict configs clean
