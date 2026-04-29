# ADR-077: Speed Visible — Patch Latency Badge

**Status:** Accepted
**Date:** 2026-04-29
**Deciders:** Bradley Ross
**Phase:** P54

## Context

Sprint K Wave 1 ships moat priority #1 from the open-core moat roadmap
(`plans/strategic-reviews/open-core-moat-roadmap.md`): **make speed visible**.
Lovable doesn't surface latency on the reply. Framer doesn't. Cursor doesn't.
Hey Bradley does — every successful chat turn shows the user how fast bradley
responded, on the bradley reply itself, not buried in EXPERT logs. The user's
gut feels the speed; the screenshot proves it.

The 2026-04-29 product evaluation (`2026-04-29-product-evaluation.md` §3 + §A)
identified this as the easiest moat priority to ship — a single visible
counter that competitors don't surface. Sequencing it first builds momentum
and unblocks P55's spec-unmissable spine.

## Decision

### Latency capture in `chatPipeline.ts`

`submit()` records `startedAt` at entry and `doneAt` at envelope-return; the
delta lands as `latencyMs` on `ChatPipelineResult`. Per-stage timings
(classify / select / patch / apply) collect through `stageMarks` and surface
as `latencyBreakdown`. Both fields propagate to `ChatMessage` so the renderer
can attach the badge to the correct bubble. ≤40 LOC delta.

### `PatchLatencyBadge.tsx` (≤80 LOC; Tailwind-only)

Tiny monospace pill rendered under the bradley reply (`data-testid="patch-latency-badge"`).
Format: `Updated in 0.8s` when `latencyMs` ≤ 5000ms; falls back to `✓` above
the threshold. EXPERT mode adds an expandable secondary block with per-stage
breakdown (`data-testid="patch-latency-breakdown"`); SIMPLE mode shows only
the headline pill. Hidden entirely when `latencyMs == null || latencyMs <= 0`.

### 5s flake-ceiling rationale (D3)

Above 5s the pill shows `✓` instead of the time. Rationale: real-LLM cold
starts and tail latency surface as scary numbers ("Updated in 38.2s") that
read worse than no number at all. The `✓` keeps the success signal without
publishing a number that misrepresents typical performance.

### EXPERT-gated breakdown

`useUIStore((s) => s.rightPanelTab) === 'EXPERT'` gates the per-stage
breakdown row. SIMPLE users see speed; EXPERT users see provenance. Mirrors
ADR-073's composition-only discipline — no Σ widening, no atom mutation, just
a render-layer addition that consults pipeline metadata.

## Trade-offs

- **No Σ widening.** `latencyMs` is a runtime observability counter, not part
  of any AISP atom. PATCH_ATOM Σ stays untouched. Composition pattern from
  ADR-073 holds.
- **Latency target measured on AgentProxy / FixtureAdapter only.** $0-cost
  dev backbone, not real LLMs. Real-LLM latency varies wildly with cold
  starts; the 5s flake-ceiling absorbs that variance into the `✓` branch.
- **Badge placement on mobile.** Renders below typewriter, above personality
  block, in muted style — does not crowd the bubble at narrow widths.
- **Cost-cap discipline (ADR-049) unaffected.** Latency is a read-only
  counter, not an enforcement layer; cost-cap remains the only runtime
  cap on chat-pipeline submissions.

## Consequences

- (+) Wow-factor demo moment surfaces on every successful patch — moat #1 visible.
- (+) Tailwind-only badge adds zero new dependencies; package.json deps unchanged.
- (+) EXPERT breakdown gives capstone reviewers the per-stage audit trail.
- (+) `latencyMs` field is optional on `ChatPipelineResult` — backward-compat with all P19-P53 callers.
- (-) Two new fields on `ChatMessage` (`latencyMs`, `latencyBreakdown`) widen the message envelope; mitigated by both being optional and Σ-untouched.
- (-) Real-LLM tail latency hidden behind `✓` — by design (D3) but means the badge is most informative on AgentProxy / FixtureAdapter paths.

## Cross-references

- **ADR-049** — Cost-cap telemetry; latency badge is an observability counter, NOT a cap. Cost-cap stays the only enforcement seam.
- **ADR-073** — P50 personality composition pattern; latency follows the same composition-not-mutation discipline — no Σ widening.
- **ADR-076** — Sprint J Wave 4 mobile precedent; Tailwind-only UI rule (no JS viewport detection, no new deps) carries forward to PatchLatencyBadge.
- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe)
- `plans/implementation/phase-54/preflight/00-summary.md`

## Status as of P54 seal

- ADR-077 full Accepted
- `chatPipeline.ts` latency capture shipped (A1)
- `PatchLatencyBadge.tsx` rendered on chat + listen surfaces (A2)
- `tests/p54-speed-visible.spec.ts`: 10 PURE-UNIT cases
- No Σ widening; backward-compat with P19-P53 callers
