# P91 — Process Map Visualization (Preflight)

> **Phase:** P91 · **Sprint:** AW-PROCESS-MAP · **Date:** 2026-05-01
> **Predecessor:** P89b + P90 sealed at `3f85208` (~1102+ GREEN, 116 ADRs, three modes routed)
> **Cross-refs:** ADR-085 (Multi-Page MVP context), ADR-088 (Mode Architecture), ADR-091 (Canonical Component Quality), ADR-102 (Performance + Accessibility), ADR-110 (AISP Visibility), ADR-116 (Three-Mode Product Architecture)

## Mandate

Centerpiece of Planning mode. Read-only + clickable SVG process map (no pan/zoom — Tier-2). NO new dependencies (Option A confirmed). Pure SVG rendering, ~200 LOC component, Hey Bradley sample data demonstrating the arc.

## 3 parallel agents · disjoint scopes

### A1 — ProcessMapSVG component
**Owns:**
- `src/components/planning/ProcessMapSVG.tsx` (NEW; ≤220 LOC)

Exports + behavior:
```ts
export type ProcessNodeStatus = 'planned' | 'in-flight' | 'sealed' | 'deferred'
export type ProcessEdgeType = 'sequential' | 'parallel' | 'gate'

export interface ProcessNode {
  id: string
  label: string
  phase: number
  status: ProcessNodeStatus
  x: number  // SVG coords
  y: number
  shape?: 'rect' | 'diamond'  // diamond for gate nodes
}

export interface ProcessEdge {
  from: string  // node id
  to: string    // node id
  type: ProcessEdgeType
}

export interface ProcessMap {
  nodes: ProcessNode[]
  edges: ProcessEdge[]
  activeNodeId?: string
}

export interface ProcessMapSVGProps {
  map: ProcessMap
  onNodeSelect?: (nodeId: string) => void
  width?: number   // default 800; viewBox scales
  height?: number  // default 480
}

export function ProcessMapSVG(props: ProcessMapSVGProps) { ... }
```

Visual rules:
- Rounded rectangles for default nodes (~140×60 with 8-12px radius); diamonds for gate type
- Status colors via `var(--hb-*)` tokens (NOT hex):
  - `planned` → `var(--hb-text-muted)` border, transparent fill
  - `in-flight` → `var(--hb-accent)` border, light accent fill
  - `sealed` → green token (use `#22c55e` if no green token; document in ADR-117)
  - `deferred` → amber token (`#f59e0b`)
- Edges: SVG `<path>` cubic bezier curve for sequential; `stroke-dasharray="6,4"` for parallel; double-line for gate
- Click on node fires `onNodeSelect(node.id)`; entire node group is keyboard-accessible (`tabIndex={0}` + `onKeyDown` for Enter/Space)
- Active node: thicker border + `filter: drop-shadow(0 0 8px var(--hb-accent))` glow
- Text: truncate label at 20 chars; `<title>` element for full label on hover
- Responsive: `viewBox="0 0 800 480"` + `preserveAspectRatio="xMidYMid meet"` so it scales to container
- ARIA: root `<svg role="img" aria-label="Process map">`; each node `<g role="button" aria-label="Phase X status Y">`
- NO pan/zoom (Tier-2 carry-forward documented in ADR-117)
- NO animation libs

**Constraints:** Pure SVG; no React Flow / D3 / etc. Self-contained component with types exported. ≤220 LOC including JSDoc.

DO NOT touch: Planning.tsx (A2 owns), tests/ADR/plans/CLAUDE.md (A3 owns).

### A2 — Planning page integration
**Owns:**
- `src/pages/Planning.tsx` (EDIT — currently 42 LOC stub; cap final ≤200 LOC)
- `src/data/sample-process-map.ts` (NEW; ≤120 LOC) — Hey Bradley sample data: P15-P20 as nodes (Foundation → Persistence → LLM Provider → Chat Mode → Listen Mode → MVP Close); edges showing the arc; one gate node demonstrating diamond shape

Layout:
- Left panel: project list (stub — 3 hardcoded example projects: "Hey Bradley Build", "Coffee Roaster Site", "Portfolio Refresh"); active project styled with `var(--hb-accent)` background
- Center: `<ProcessMapSVG map={SAMPLE_MAP} onNodeSelect={setSelectedNodeId} />` with `activeNodeId` from local state
- Right panel: node-detail panel — when `selectedNodeId` is set, show: phase number, label, status pill, brief description (from sample data), ADR refs (sample: "ADR-016 sql.js" for P16, "ADR-026 LLM provider" for P17, etc.)
- Empty state: "Start a project to see your process map" — shown when no project selected (A2 can fake-default to "Hey Bradley Build" project so the map renders by default)
- Mobile: stack vertically (left panel collapses; map + detail panel stack)
- `data-testid` markers: `planning-project-list`, `planning-project-{id}`, `planning-process-map`, `planning-node-detail`, `planning-empty-state`

**Constraints:** ADR-091 token compliance; surgical (existing stub structure preserved where possible). No new deps. Sample data factored into separate `sample-process-map.ts` for testability.

DO NOT touch: ProcessMapSVG component (A1 owns), tests/ADR/plans/CLAUDE.md (A3 owns), uiStore/main.tsx/AppShell.

### A3 — ADR-117 + tests + EOP
**Owns:**
- `docs/adr/ADR-117-process-map-svg-architecture.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-085 + ADR-091 + ADR-102 + ADR-116)
  - 4 decisions: (1) pure SVG (Option A) — no React Flow / D3 / canvas dep; (2) read-only + clickable at open-core; pan/zoom Tier-2; (3) data shape: ProcessNode/ProcessEdge/ProcessMap interfaces; (4) status color tokens map to ADR-087 design tokens
- `tests/p91-process-map.spec.ts` (NEW; ≥15 cases; Playwright `test.describe`/`test`):
  - P91.1 ADR-117 file shape (4)
  - P91.2 ProcessMapSVG component shape (3): file exists; exports ProcessMapSVG + ProcessNode + ProcessEdge + ProcessMap types; pure SVG (contains `<svg` and `<path`)
  - P91.3 Status colors via tokens (1): source contains `var(--hb-` references for status fills
  - P91.4 Click handler wired (1): source contains `onNodeSelect` invocation
  - P91.5 Sample data + Planning integration (3): sample-process-map.ts exists; Planning.tsx imports ProcessMapSVG; Planning.tsx imports sample data
  - P91.6 Planning page testids (1): planning-process-map + planning-node-detail testids present
  - P91.7 KISS — no animation libs / no new deps in P91 source (1)
  - P91.8 EOP triplet (3)
- `plans/implementation/phase-91/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync — bump ADRs 116 → 117; tests +15; capabilities entry

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`. existsSync guards on A1/A2 surfaces.

## Hard rules
1. **NO new dependencies** (Option A — pure SVG; no React Flow, no D3, no canvas libs)
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. Read-only at open-core; pan/zoom is Tier-2 carry-forward
5. Token-compliant — `var(--hb-*)` for all status colors (or document hex if no token exists)
6. Mobile: viewBox scaling makes the map readable at 375px (no pan needed at this size — fits)
7. NO shell commands inside agents (except tsc + targeted playwright run)
8. TypeScript-strict; no `any`
9. KISS — no live data binding; sample data is hardcoded; project list is a 3-item stub

## Acceptance gates
- ProcessMapSVG renders sample Hey Bradley arc (P15-P20)
- Click on node fires onNodeSelect; right detail panel updates
- Active node highlighted with glow
- All 4 status colors render distinctly
- Sequential + parallel + gate edge types all render
- Mobile: map readable at 375px (viewBox-scaled, no horizontal scroll)
- ADR-117 Accepted citing ADR-085 + ADR-091 + ADR-102 + ADR-116
- ≥15 P91 tests GREEN
- Cumulative session OC chain regression ≥800
- tsc strict clean

## Carry-forwards (Tier-2)
- Pan/zoom interaction
- Drag-to-rearrange nodes
- Live data binding to a real project store
- Multi-project tabs / project switcher (more than 3 stub projects)
- Edge auto-routing for complex graphs
- Minimap
