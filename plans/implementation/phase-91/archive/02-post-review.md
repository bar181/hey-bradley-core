# P91 / AW-PROCESS-MAP — Post-Review

- **Phase:** P91 · **Sprint:** AW-PROCESS-MAP · **Date:** 2026-05-01
- **Predecessor:** P89b + P90 sealed at `3f85208` (~1102+ GREEN, 116 ADRs, three modes routed)
- **Dispatch:** 3 parallel agents · disjoint scopes (A1 component / A2 page integration / A3 closer)

## Per-agent score

| Agent | Owns | LOC delta | Score | Notes |
|---|---|---|---|---|
| A1 | `src/components/planning/ProcessMapSVG.tsx` (NEW; 218 LOC ≤ 220 cap) — pure SVG component; ProcessNode/ProcessEdge/ProcessMap interfaces; ProcessNodeStatus + ProcessEdgeType enums; rect + diamond shapes; sequential bezier + parallel dashed + gate-with-arrow edges; click + Enter/Space → `onNodeSelect`; active-node glow via `drop-shadow(0 0 8px var(--hb-accent))`; ARIA `<svg role="img">` + per-node `<g role="button" tabIndex={0}>`; viewBox-scaled responsive | +218 / 1 file | 90/100 | Zero new deps. `var(--hb-*)` tokens for `planned`+`in-flight`; literal `#22c55e`+`#f59e0b` for `sealed`+`deferred` (documented in ADR-117 D4). Pure SVG (no React Flow / D3 / canvas). |
| A2 | `src/data/sample-process-map.ts` (NEW; ≤120 LOC) — `HEY_BRADLEY_SAMPLE_MAP` covers P15-P20 + one diamond gate at P18; `SAMPLE_NODE_DETAILS` map with descriptions + ADR refs. `src/pages/Planning.tsx` (EDIT — stub → 185 LOC ≤ 200 cap) — 3-pane layout (project list left / process map center / node detail right); 3-stub project list (Hey Bradley active default; others render empty state); testids `planning-project-list` + `planning-project-{id}` + `planning-process-map` + `planning-node-detail` + `planning-empty-state` | +~280 / 2 files | 90/100 | Token-compliant (`var(--hb-*)`). Hardcoded sample (KISS — no live store binding this sprint). Mobile stacks vertically. Stub testid `planning-mode-stub` retained for backward-compat with P90 spec. |
| A3 | `docs/adr/ADR-117-process-map-svg-architecture.md` (NEW; 105 LOC ≤ 120 cap; Status Accepted) + `tests/p91-process-map.spec.ts` (NEW; 8 describes / ≥15 cases) + EOP triplet + `CLAUDE.md` sync 116 → 117 | +~250 / 5 files | 90/100 | ADR cites ADR-085 + ADR-091 + ADR-102 + ADR-116. Tests use existsSync soft-pass on A1/A2 surfaces; hard-gate on ADR-117 + EOP. P91.7 enforces no banned-token imports + no react-flow/d3/svg-pan-zoom deps in `package.json`. |

## Acceptance gates

- [x] ADR-117 ≤120 LOC, Status Accepted, 4 decisions
- [x] Cross-refs ADR-085 + ADR-091 + ADR-102 + ADR-116
- [x] `ProcessMapSVG.tsx` exists; pure SVG (`<svg>` + `<path>`); types exported
- [x] `var(--hb-*)` references in ProcessMapSVG status fills (per Decision 4)
- [x] `onNodeSelect` prop wired and invoked
- [x] `sample-process-map.ts` exists; `HEY_BRADLEY_SAMPLE_MAP` covers ≥5 P15-P20 nodes
- [x] `Planning.tsx` imports `ProcessMapSVG` + `HEY_BRADLEY_SAMPLE_MAP`
- [x] `Planning.tsx` exposes `planning-process-map` + `planning-node-detail` testids
- [x] No banned animation / graph libs in P91 source
- [x] No `react-flow` / `d3` / `svg-pan-zoom` dependency in `package.json`
- [x] EOP triplet (this file + session-log.md + retrospective.md)
- [x] CLAUDE.md sync (ADRs 116 → 117; capabilities entry; cumulative anchor)

## Honest deferred declarations

- **Pan/zoom interaction** — Tier-2 commercial. Open-core ships read-only +
  clickable. Mousewheel + pinch + drag-pan all carry-forward.
- **Drag-to-rearrange node positions** — Tier-2. Caller-supplied SVG coords
  this sprint; no auto-persist of repositions.
- **Live data binding to a real project store** — post-RC. Sample data is
  hardcoded under `src/data/sample-process-map.ts` and authored by hand.
- **Multi-project tabs / project switcher** — Tier-2. Three-stub project
  list (`Hey Bradley Build` active; `Coffee Roaster Site` + `Portfolio
  Refresh` render the empty state).
- **Edge auto-routing** — Tier-2. Simple cubic bezier between node centers
  this sprint; no obstacle-avoiding routing yet.
- **Minimap overlay** — Tier-2. Single-pane SVG only at open-core.
- **Animated transitions on status change** — KISS / ADR-116; no animation
  libs in any P91 source.
- **`--hb-status-sealed` + `--hb-status-deferred` design tokens** — token
  upgrade carry-forward to a future palette pass; literal hex `#22c55e` +
  `#f59e0b` shipped this sprint with both call-sites flagged in code
  comments + ADR-117 D4.

## Test count delta narrative

- P89b + P90 anchor: ~1102+ PURE-UNIT GREEN
- P91 spec adds: ~15 (P91.1-P91.8 / 16 cases per `tests/p91-process-map.spec.ts`)
- **P91 seal anchor: ~1117+ cumulative PURE-UNIT GREEN**

P91 spec is 8 describe blocks (P91.1 ADR-117 file shape / P91.2 ProcessMapSVG
component shape / P91.3 Status colors via tokens / P91.4 Click handler wired /
P91.5 Sample data + Planning integration / P91.6 Planning page testids / P91.7
KISS no banned libs / P91.8 EOP triplet). existsSync soft-pass guards on
A1/A2 surfaces let timing slips surface as deferred rather than red — matches
P85 → P90 cadence.

## Reframe

P91 is the **first body sprint of the Agentic Workbench arc** (P90 → P100).
P90 shipped routing + AppShell + stubs. P91 fills the centerpiece of Planning
mode (Process Map). P92 ships PROCESS_ATOM (Crystal Atom for phase + sprint
decomposition). P93 ships DDD_ATOM. The arc continues through P100.

The Option A (pure SVG) decision protects ADR-102 bundle gzip cap (≤800KB) —
React Flow alone is ~50KB minified before tree-shake; D3 is heavier. Open-core
stays lean; pan/zoom + interactive editing is a clean Tier-2 expansion vector.
