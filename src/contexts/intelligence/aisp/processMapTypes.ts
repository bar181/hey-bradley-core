/**
 * P106 / Agent A2 — Process Map shared types (neutral location).
 *
 * Per ADR-118 D1 and ADR-117. Atom modules MUST NOT import from
 * `src/components/`. These types are the source of truth for both the
 * PROCESS_ATOM Crystal Atom (`processAtom.ts`) and the SVG renderer
 * (`components/planning/ProcessMapSVG.tsx`).
 *
 * `ProcessMapSVG.tsx` re-exports these types so existing UI consumers
 * continue to import from the component path; atom modules import from
 * here directly to maintain pure-module discipline (no React imports).
 *
 * Cross-refs: ADR-117 Process Map SVG, ADR-118 PROCESS_ATOM,
 *             ADR-134 Atom→view dependency inversion fix.
 */

export type ProcessNodeStatus = 'planned' | 'in-flight' | 'sealed' | 'deferred'
export type ProcessEdgeType = 'sequential' | 'parallel' | 'gate'

export interface ProcessNode {
  id: string
  label: string
  phase: number
  status: ProcessNodeStatus
  x: number
  y: number
  shape?: 'rect' | 'diamond'
}

export interface ProcessEdge {
  from: string
  to: string
  type: ProcessEdgeType
}

export interface ProcessMap {
  nodes: ProcessNode[]
  edges: ProcessEdge[]
  activeNodeId?: string
}
