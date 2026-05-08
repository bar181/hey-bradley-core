# ADR-129 — KISS Review Architecture

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P98 / KISS-REVIEW
- **Cross-refs:** ADR-094 (Professional Grade Standard), ADR-095 (Library-Wide Polish), ADR-111 (Final Polish Standard), ADR-128 (TDD Scaffold)

## Context

P97 sealed TDD scaffold + AGENT_ATOM wire (ADR-128). Every Crystal
Atom now has ≥1 production import site; the Claude Code bundle ships
spec + tests in one drop. The open question — "what does KISS-clean
look like for a phase, executably?" — ADR-094/095/111 named the
standard but left the rubric to reviewer judgement.

P98 closes that loop with an automated KISS reviewer consuming the
spec bundle and emitting a review-checklist piped into ConversationLog.
The arc P95-P98 is design → materialization → consumer-experience →
**gate (KISS-clean enforcement)**. ADR-129 gives the open-core arc an
executable answer to "should this phase ship?".

## Decisions

### Decision 1 — Pure module emitter

`buildKissReview(phase)` returns `KissReviewOutput` from a `PhaseCard`.
No React, no fs/network, no store imports. Mirrors ADR-121 D3 +
ADR-122 + ADR-128 D1 store-agnostic emitter pattern. Mountable from
any surface (SpecWorkbench KISS-button OR Claude Code bundle emitter
OR ConversationLog inline-render). Pure transform; no async, no IO.

### Decision 2 — Six review categories

Every review item is classified into exactly one of:

1. **no-new-deps** — package.json deltas; banned animation libs;
   opaque dependencies that bypass the open-core zero-dep boundary.
2. **loc-cap** — files exceeding the per-component cap (≤300 atoms /
   ≤220 SVG / ≤180 chat-bar / ≤120 ADR / ≤80 EOP-retro).
3. **no-hardcode** — literal strings/colors/URLs that should be
   tokenized via design tokens (ADR-087) or env config.
4. **gate-conditions** — missing `if (!existsSync(...)) return` soft
   guards on cross-agent test files, missing hard-gates on owned
   surfaces.
5. **aisp-sigma** — Σ contract violations (Γ rule count, Λ
   left-hand-side, Ε invariant statements) parsed from `aispSpec`.
6. **scope-creep** — files outside the agent's owned scope; commits
   touching A4/A5 surfaces from A6 closer; ADR cross-refs to phases
   not yet sealed.

The 6-category enum is finite by design — adding a 7th requires an
ADR amendment, mirroring the bounded-fan-out discipline from PROCESS
(ADR-118 Γ R1 ≤5×4×7) and AGENT (ADR-120 Γ R1 ≤7).

### Decision 3 — Three-tier severity; PASS = zero P1

Each review item carries a severity:

- **P1 — blocking** — phase MUST NOT seal until resolved (e.g. new
  opaque dep, owned-file scope-creep, missing EOP triplet).
- **P2 — should-fix** — phase MAY seal with a carry-forward entry
  (e.g. one file 5 LOC over cap with cleanup planned next phase).
- **P3 — note** — informational; no action required (e.g. ADR
  cross-ref to a phase that's also in-flight, will resolve naturally).

`KissReviewOutput.verdict` is `'pass'` when P1 count is zero, else
`'block'`. The verdict is the executable answer to "should this phase
ship?". Severity ladder mirrors the brutal-honest review pattern from
P74 (P1/P2/P3 25-gap structure) — open-core ships the same triage
discipline as the strategic-review surface.

### Decision 4 — ConversationLog wire via existing event_type

The KISS review surfaces in ConversationLog as a `response_summary`
event with `event_data.kind: 'kiss-review'`. This avoids extending
the schema CHECK enum at P98 — `response_summary` is already allowed
per ADR-127 (which extended with `decomp_split` + `export_emit`). A
future migration adds `'review'` as a first-class event_type when
Tier-2 commercial features land. At open-core the event-data marker
suffices for ConversationLogTab drill-down per request_id (ADR-126 D3).

## Out of Scope (Tier-2)

- AI-powered review — LLM consumes the spec bundle and emits
  qualitative judgement. Tier-2 commercial; requires live AgentProxy
  + per-language style awareness. Open-core ships rules-based only.
- Cross-phase comparison view — diff KISS scores across phases to
  surface drift. Tier-2; P101+ depending on owner priority.
- Auto-fix application — reviewer emits a patch that resolves P1/P2
  items automatically. Post-RC; requires AgentProxy round-trip.

## Acceptance Gates

1. `kissReviewer` exports `buildKissReview` function +
   `KissReviewOutput` interface from
   `src/contexts/specification/reviewers/kissReviewer.ts`.
2. Module source contains all 6 category strings (`no-new-deps`,
   `loc-cap`, `no-hardcode`, `gate-conditions`, `aisp-sigma`,
   `scope-creep`).
3. `SpecWorkbench.tsx` carries `run-kiss-review` testid (A5 UI).
4. `SpecWorkbench.tsx` OR `ConversationLogTab.tsx` contains
   `kiss-review` event-data marker (A5 wire).
5. No new deps; no animation libs in P98 source.

## Consequences

**Positive:** "KISS-clean for a phase" now has an executable rubric.
The 6-category × 3-tier matrix gives reviewer + owner + downstream
consumer the same vocabulary. PASS = zero P1 means the gate is
binary and unambiguous. ConversationLog wire makes review history
queryable per request_id without schema migration.

**Negative:** Rules-based review will miss qualitative issues that
require taste (e.g. "this naming reads awkwardly"). Tier-2 AI review
is the answer; open-core ships the rules-based 80% solution.

**Mitigations:** Tier-2 AI review + cross-phase compare + auto-fix
explicitly deferred per §"Out of Scope" so the open-core scope stays
rules-based-only.
