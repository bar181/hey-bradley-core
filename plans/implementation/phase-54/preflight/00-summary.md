# P54 Preflight — Sprint K Wave 1: Make The Speed Visible

> **Phase title:** Sprint K P1 — Latency Capture + UI Badge + Benchmark Mode
> **Status:** PLANNED
> **Successor of:** P53 (Sprint J seal `644200a`) + system-wide review `ef9a421`
> **Canonical roadmap:** `plans/strategic-reviews/open-core-moat-roadmap.md`

## North Star

> **Every successful patch shows the user how fast bradley responded.**
> Latency ≤1.2s P50 on the AgentProxy path. Badge surfaces on the bradley reply itself, not buried in EXPERT logs. The user feels the speed; the screenshot proves it.

This is moat priority #1 (speed visible) from the open-core moat roadmap.

## Moat metric (the gate)

| Dimension | Target |
|---|---|
| P50 chat-pipeline latency on AgentProxy | ≤1.2s |
| Latency badge presence on successful patches | 100% |
| Badge `data-testid` | `latency-badge` |
| Display behavior | show "Updated in 0.8s" when ≤5s; show "✓" when >5s (avoid surfacing flake) |

## Scope IN — 3 parallel agents

### A1 — Latency capture in chatPipeline
- `src/contexts/intelligence/chatPipeline.ts` — record `startedAt` at submit; record `completedAt` at envelope-return; compute `latencyMs`
- Extend `ChatPipelineResult` with `latencyMs?: number` (optional field — backward-compat)
- No Σ widening; latency is observability, not envelope shape
- ≤40 LOC delta; reuses existing `recordPipelineFailure` timing seam

### A2 — Latency badge UI
- `src/components/shell/ChatInput.tsx` — render badge under bradley reply when `result.latencyMs` present
- Mirror placement on Listen surface: `src/components/left-panel/ListenTab.tsx` reply rendering
- Badge component: tiny pill with `data-testid="latency-badge"`; format `Updated in {seconds}s`
- ≤30 LOC delta total across both surfaces

### A3 — ADR-077 + tests + EOP
- NEW `docs/adr/ADR-077-latency-visibility.md` (≤120 LOC; full Accepted; cross-refs ADR-049 cost-cap discipline — latency is a read-only counter, not a cap)
- NEW `tests/p54-latency-badge.spec.ts` (~10 PURE-UNIT cases): timing field present on success; absent on error envelope; ≤5s shows pill; >5s falls back to ✓
- NEW internal benchmark spec stub: `tests/p54-latency-benchmark.spec.ts` (skipped by default; gated on `VITE_BENCHMARK=1`) — side-by-side compare vs simulated baseline
- EOP: session-log + retrospective + P55 preflight scaffold

## Carryforward fold-in (system-wide review §6 items 1, 2, 5)

- Top-10 #1 (split ChatInput.tsx + Onboarding.tsx LOC violations) — opportunistically picked up during A2 (ChatInput is already touched). Onboarding split deferred to P55 if A2 grows.
- Top-10 #2 (Playwright runtime suite ≤10 cases) — A3 satisfies via `p54-latency-badge.spec.ts`.
- Top-10 #5 (DEV-warn on ConversationLogTab silent fail) — small ≤5 LOC fix folded into A1.

## Locked decisions

- **D1 — No Σ widening.** `latencyMs` lives on `ChatPipelineResult`, not on PATCH_ATOM Σ. Composition discipline preserved (ADR-073 pattern).
- **D2 — AgentProxyAdapter / FixtureAdapter only.** $0 cost; latency target measured on the dev backbone, not real LLMs.
- **D3 — Badge gates at ≤5s.** Above 5s, show ✓ — prevents surfacing real-LLM tail latency or cold-start flake.
- **D4 — Benchmark mode is opt-in.** Hidden behind `VITE_BENCHMARK=1` env flag so default builds don't ship it.

## Scope OUT (deferred to P55-P58)

- AISP trace chip on every reply → P55 (Sprint L spine)
- Atom light-up animation → P55
- Spec primary-tab promotion → P55
- Premium templates → P56
- Hosted share URL → P57
- Public RC → P58

## DoD

- [ ] A1 latency capture landed; `ChatPipelineResult.latencyMs` present
- [ ] A2 badge renders on chat + listen reply surfaces
- [ ] A3 ADR-077 full Accepted + ~10 PURE-UNIT tests GREEN + benchmark stub
- [ ] tsc clean; cumulative regression GREEN (target 418+/418+)
- [ ] STATE.md row + CLAUDE.md roadmap updated; P55 preflight scaffolded
- [ ] No Σ widening; backward-compat with P50-P53 personality + composition layer

## Risks

- **R1 — Latency surfaces flakiness on real LLMs.** Mitigation: ≤5s display gate (D3).
- **R2 — Badge clutters bradley replies on mobile.** Mitigation: A2 renders below typewriter, in muted style; manual mobile screenshot at end of phase.
- **R3 — Onboarding.tsx LOC split is bigger than P54 scope.** Mitigation: defer to P55 if A2 grows past ≤30 LOC delta.

## Cross-references

- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe)
- `2026-04-29-sprint-j-system-wide/04-performance-and-forward.md` §6 (top-10 recs source)
- ADR-049 (cost-cap discipline — latency is observability, not enforcement)
- ADR-073 (composition pattern — no Σ widening)

P54 is Sprint K Wave 1. Speed visible is the easiest moat priority to ship. Sequencing it first builds momentum and unblocks P55's spec-unmissable spine.
