# ADR-117 — Process Map SVG Architecture

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P91 / AW-PROCESS-MAP
- **Cross-refs:** ADR-085 (Multi-Page MVP context), ADR-091 (Canonical Component Quality), ADR-102 (Performance + Accessibility), ADR-116 (Three-Mode Product Architecture)

## Context

P90 / ADR-116 sealed the three-mode product architecture with Planning + Agentics
shipping as stubs. P91 ships the centerpiece of Planning mode — process map
visualization. The owner picked **Option A (pure SVG, no new deps)** over
Option B (React Flow ~50KB minified) and Option C (Tailwind grid; too
restrictive for the gate + parallel edge shapes Planning needs). KISS discipline
holds; ADR-102 bundle gzip cap (≤800KB) protected.

The map is the single most visible Planning artifact in the v2.0 arc — it
narrates the build path the owner is reasoning over. Shipping it as a custom
~220 LOC component keeps the rendering surface ours to control without taking
on a multi-tens-of-KB graph library that we can't audit line-by-line.

## Decisions

### Decision 1 — Pure SVG (no React Flow / D3 / canvas dep)

Custom `ProcessMapSVG.tsx` (~220 LOC) owns rendering. Bezier paths are
hand-computed; rect + diamond shapes are emitted as `<rect>` + `<polygon>`.
Trade-off: pan/zoom math is ours to write later. Open-core stays read-only +
clickable; pan/zoom is a Tier-2 commercial carry-forward. No `package.json`
delta this sprint.

### Decision 2 — Read-only at open-core; click-to-select only

Click on node (or Enter/Space when focused) fires `onNodeSelect(nodeId)` and
the active node highlights via thicker stroke + accent-tinted drop-shadow
glow. **No drag-to-rearrange, no inline-edit, no real-time multi-user.**
Tier-2 commercial expands to interactive editing + minimap + multi-project
tabs.

### Decision 3 — Data shape: ProcessNode + ProcessEdge + ProcessMap

`ProcessNode` carries `id` + `label` + `phase: number` + `status` enum
(`planned | in-flight | sealed | deferred`) + caller-supplied SVG `x`/`y`
coords + optional `shape` (`rect` default, `diamond` for gate nodes).
`ProcessEdge` carries `from` + `to` + `type` enum (`sequential | parallel |
gate`). `ProcessMap` is `{ nodes, edges, activeNodeId? }`. **No auto-layout
this sprint** — caller controls positioning; sample data hand-positions the
Hey Bradley P15-P20 arc.

### Decision 4 — Status colors: tokens for planned + in-flight; literal hex for sealed + deferred

`planned` uses `var(--hb-text-muted)`; `in-flight` uses `var(--hb-accent)`.
The open-core palette has no green or amber tokens, so `sealed` uses literal
`#22c55e` and `deferred` uses literal `#f59e0b`. Both wrapped in
`color-mix(in srgb, … 12%, transparent)` for the fill so they read as tinted
backgrounds. **Tier-2 carry-forward: introduce `--hb-status-sealed` +
`--hb-status-deferred` tokens once a status palette is defined.**

## Out of scope (Tier-2 commercial)

- Pan/zoom interaction (mousewheel / pinch / drag-pan)
- Drag-to-rearrange node positions (auto-persist)
- Live data binding to a real project store (current: hardcoded sample data)
- Multi-project tabs / project switcher (current: 3-stub project list)
- Edge auto-routing for complex graphs (current: caller-supplied coords +
  simple cubic bezier between centers)
- Minimap overlay
- Animated transitions on status change (KISS — no animation libs per ADR-116)

## Acceptance gates

- ADR ≤120 LOC
- Status: **Accepted**
- 4 decisions enumerated
- Cross-refs ADR-085 + ADR-091 + ADR-102 + ADR-116
- `src/components/planning/ProcessMapSVG.tsx` exists; pure SVG (`<svg>` +
  `<path>` present); `ProcessNodeStatus` + `ProcessEdgeType` types exported
- `ProcessMapSVG` source contains `var(--hb-*)` references for status fills
  per Decision 4
- `onNodeSelect` prop wired and invoked from click + keyboard handlers
- `src/data/sample-process-map.ts` exists; exports `HEY_BRADLEY_SAMPLE_MAP`
  spanning at least P15-P20
- `src/pages/Planning.tsx` imports `ProcessMapSVG` + `HEY_BRADLEY_SAMPLE_MAP`
  and renders both with `planning-process-map` + `planning-node-detail`
  testids
- KISS — no `react-flow` / `d3` / `svg-pan-zoom` / animation libs in any P91
  source file or `package.json`

## Consequences

- **Positive:** zero dependency delta; fully owned rendering surface;
  read-only contract is small and auditable; sample data hand-positioned
  matches the Hey Bradley arc 1:1; ADR-091 token compliance holds for the
  two color states that have palette tokens; mobile readable via viewBox
  scaling at 375px.
- **Negative:** pan/zoom math becomes ours when it lands at Tier-2 (no
  library to lean on); auto-layout is deferred (caller must supply
  coordinates); status palette has 2 literal hex colors awaiting token
  upgrade.
- **Mitigations:** read-only scope keeps the surface bounded — when pan/zoom
  ships at Tier-2, the additions are isolated to one component; sample
  data factored to `src/data/sample-process-map.ts` so test/dev coordinate
  authoring is decoupled from rendering; literal hex limited to two enum
  values, both flagged in code comments + this ADR for the future
  `--hb-status-*` token introduction.
