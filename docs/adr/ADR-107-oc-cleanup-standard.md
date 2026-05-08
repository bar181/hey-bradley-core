# ADR-107 — OC-CLEANUP Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P82 / OC-CLEANUP
- **Cross-refs (primary):** ADR-090 (Mobile UX Redesign — drawer surface), ADR-097 (Blog Content Strategy — cadence floor), ADR-104 (Page-Aware Pipeline — pageIterator wire)
- **Cross-refs (secondary):** ADR-099 (DECOMP_ATOM — page-targeting verbs), ADR-103 (Multi-Page MVP Wire — activePageId)

## Context

After 80+ sealed phases of feature work, the open-core arc accumulated
P1 carry-forwards across multiple sprint retrospectives. P82 / OC-CLEANUP
is the **systematic closure phase** that lands before P83 (AISP adoption
push) and P84 (RC final). The discipline is straightforward: do not ship
the RC with carry-forward debt that a brutal-honest review would surface
as a must-fix. Close it now, document what stays deferred (Tier-2), and
verify doc accuracy against disk reality.

Three deferred P1 items from the P79 / OC-14 retrospective converge in
this phase:
- **Page-aware INTENT_ATOM** — target resolution must understand
  "page 2 hero" not just "hero".
- **DECOMP page-targeting verbs** — multi-clause utterances spanning
  pages need page-attributed Todo[] output.
- **Mobile drawer page selector** — the mobile shell (per ADR-090)
  was missing a page picker after ADR-103 added multi-page.

P81 / OC-16 (sibling sprint) already extended the prompt corpus to
500+ entries with multi-page coverage. P82 is the engine wire-up that
makes those corpus entries route correctly.

## Decision

ADR-107 names four cleanup gates that MUST hold before P83 opens.

### 1. P1 carry-forwards CLOSED or explicitly deferred-to-Tier-2

Every P1 item from prior sprint retrospectives must be either
landed in this phase OR explicitly documented as Tier-2 commercial
scope. No silent drops. The closure-or-defer matrix lives in the
P82 retrospective and links back to the originating retrospective.

### 2. Blog corpus ≥12 posts (per ADR-097)

ADR-097 codified a blog cadence; the literal floor is 12. The corpus
sat at 10 since P71. P82 / A4 lands the +2 to reach the floor.

### 3. EOP triplet on every sealed phase (or documented gap)

`02-post-review.md` + `session-log.md` + `retrospective.md` is the
end-of-phase triplet. Any gap from earlier phases must be documented
in `plans/strategic-reviews/2026-05-01-eop-audit-p15-p81.md` with a
rationale (back-fill, not back-write).

### 4. CLAUDE.md / STATE.md / README counts match disk reality

The four count claims (templates, ADRs, tests, blog posts) must match
disk reality at seal. A grep-and-count pass at every phase seal is the
mechanism. Section-types stays at 18 (per ADR-100); examples stays
at 41 (per ADR-105); blog posts bumps 10 → 12.

## Out of scope (Tier-2 / post-RC carry-forwards)

- **Live-LLM eval harness** — DEFERRED to Tier-2 / OC-12.
- **Ruvector HNSW activation** — DEFERRED to Tier-2 commercial learning runtime per `plans/implementation/phase-61/03-ruvector-state.md`.
- **Hosted share URL** — DEFERRED to Tier-2 (Vercel KV / Supabase).
- **Full build-step RSS cron** — DEFERRED to P83+ (P82 ships static refresh stub).
- **Cross-page command UX picker** — DEFERRED to P83+ (engine ready; UX surface deferred).

## Acceptance gates per decision

1. **D1:** P79 / OC-14 retrospective P1 items (page-aware INTENT, DECOMP page-targeting, mobile drawer page selector) all CLOSED in P82 source diffs OR explicitly deferred-to-Tier-2 in P82 retrospective.
2. **D2:** `src/pages/blog/posts/*.md` count ≥12.
3. **D3:** `plans/strategic-reviews/2026-05-01-eop-audit-p15-p81.md` exists; phase-82/* triplet exists.
4. **D4:** CLAUDE.md "Blog Posts: 12", "Section Types: 18", "Examples: 41", "ADRs: 107 Accepted" — all match disk.
5. **D5:** ADR-107 Accepted; cross-refs ADR-090 / ADR-097 / ADR-104.
6. **D6:** ≥15 P82 tests GREEN in `tests/p82-oc-cleanup.spec.ts`.

## Consequences

**Positive:**
- RC ships without P1 carry-forward debt — review surface is clean.
- Doc accuracy is enforced by the test spec (not hope).
- Two-phase cadence (P82 cleanup → P83 AISP push → P84 RC) gives every gate a dedicated sprint.

**Negative:**
- Cleanup phases feel low-velocity — no flashy demo. Composite scoring discipline (no compression) keeps the bar honest.
- The P1-deferred-to-Tier-2 column risks growing if owners use it as escape valve. Mitigation: P82 retrospective explicitly enumerates each deferred item with rationale.

**Mitigations:**
- `existsSync` guards on cross-agent surfaces in the test spec keep the seal-gate honest under parallel-dispatch timing.
- Doc-count drift is caught at P82 seal; P83 inherits a clean baseline.
