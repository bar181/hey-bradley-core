/**
 * ProcessMapSVG — Pure SVG read-only + clickable process map for Planning mode.
 * Renders nodes (rect/diamond) + edges (sequential bezier / parallel dashed /
 * gate with arrow). Click + Enter/Space emit `onNodeSelect`. Tokens via
 * `var(--hb-*)`; sealed/deferred use literal hex (documented in ADR-117).
 * Read-only + click at open-core; pan/zoom is Tier-2 carry-forward.
 */
import type { JSX, KeyboardEvent } from 'react'

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

export interface ProcessMapSVGProps {
  map: ProcessMap
  onNodeSelect?: (nodeId: string) => void
  width?: number
  height?: number
}

const RECT_W = 140
const RECT_H = 60
const DIAMOND_W = 100
const DIAMOND_H = 60
const LABEL_MAX = 20

interface StatusStyle {
  fill: string
  stroke: string
}

function statusStyle(status: ProcessNodeStatus): StatusStyle {
  switch (status) {
    case 'in-flight':
      return {
        fill: 'color-mix(in srgb, var(--hb-accent) 12%, transparent)',
        stroke: 'var(--hb-accent)',
      }
    case 'sealed':
      // #22c55e literal — no green token in palette (ADR-117)
      return {
        fill: 'color-mix(in srgb, #22c55e 12%, transparent)',
        stroke: '#22c55e',
      }
    case 'deferred':
      // #f59e0b literal — no amber token in palette (ADR-117)
      return {
        fill: 'color-mix(in srgb, #f59e0b 12%, transparent)',
        stroke: '#f59e0b',
      }
    case 'planned':
    default:
      return { fill: 'transparent', stroke: 'var(--hb-text-muted)' }
  }
}

function truncate(label: string): string {
  return label.length > LABEL_MAX ? `${label.slice(0, LABEL_MAX)}…` : label
}

function renderNode(
  node: ProcessNode,
  isActive: boolean,
  onSelect?: (id: string) => void,
): JSX.Element {
  const style = statusStyle(node.status)
  const strokeWidth = isActive ? 3 : 2
  const filter = isActive ? 'drop-shadow(0 0 8px var(--hb-accent))' : undefined
  const handleKey = (e: KeyboardEvent<SVGGElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(node.id)
    }
  }
  const isDiamond = node.shape === 'diamond'
  const w = isDiamond ? DIAMOND_W : RECT_W
  const h = isDiamond ? DIAMOND_H : RECT_H
  const shape = isDiamond ? (
    <polygon
      points={`${node.x},${node.y - h / 2} ${node.x + w / 2},${node.y} ${node.x},${node.y + h / 2} ${node.x - w / 2},${node.y}`}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={strokeWidth}
    />
  ) : (
    <rect
      x={node.x - w / 2}
      y={node.y - h / 2}
      width={w}
      height={h}
      rx={10}
      ry={10}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={strokeWidth}
    />
  )
  return (
    <g
      key={node.id}
      role="button"
      tabIndex={0}
      aria-label={`Phase ${node.phase}: ${node.label} status ${node.status}`}
      aria-current={isActive ? 'true' : undefined}
      onClick={() => onSelect?.(node.id)}
      onKeyDown={handleKey}
      style={{ cursor: 'pointer', filter }}
    >
      <title>{node.label}</title>
      {shape}
      <text
        x={node.x - w / 2 + 6}
        y={node.y - h / 2 + 14}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={10}
        fill="var(--hb-text-muted)"
      >
        {`P${node.phase}`}
      </text>
      <text
        x={node.x}
        y={node.y + 4}
        textAnchor="middle"
        fontSize={13}
        fill="var(--hb-text)"
      >
        {truncate(node.label)}
      </text>
    </g>
  )
}

function renderEdge(
  edge: ProcessEdge,
  nodes: ProcessNode[],
  key: string,
): JSX.Element | null {
  const src = nodes.find((n) => n.id === edge.from)
  const tgt = nodes.find((n) => n.id === edge.to)
  if (!src || !tgt) return null
  const dx = tgt.x - src.x
  const cp1x = src.x + dx * 0.4
  const cp2x = tgt.x - dx * 0.4
  const path = `M ${src.x},${src.y} C ${cp1x},${src.y} ${cp2x},${tgt.y} ${tgt.x},${tgt.y}`
  const dashArray = edge.type === 'parallel' ? '6,4' : undefined
  const stroke = 'var(--hb-text-muted)'
  if (edge.type === 'gate') {
    // Solid line + small arrowhead polyline at target
    const ax = tgt.x - 8
    const ay1 = tgt.y - 5
    const ay2 = tgt.y + 5
    return (
      <g key={key} opacity={0.6}>
        <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} />
        <polyline
          points={`${ax},${ay1} ${tgt.x},${tgt.y} ${ax},${ay2}`}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
        />
      </g>
    )
  }
  return (
    <path
      key={key}
      d={path}
      fill="none"
      stroke={stroke}
      strokeWidth={1.5}
      strokeDasharray={dashArray}
      opacity={0.6}
    />
  )
}

export function ProcessMapSVG(props: ProcessMapSVGProps): JSX.Element {
  const { map, onNodeSelect, width = 800, height = 480 } = props
  return (
    <svg
      role="img"
      aria-label="Process map"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto max-w-full"
      data-testid="process-map-svg"
    >
      {map.edges.map((edge, i) =>
        renderEdge(edge, map.nodes, `edge-${edge.from}-${edge.to}-${i}`),
      )}
      {map.nodes.map((node) =>
        renderNode(node, map.activeNodeId === node.id, onNodeSelect),
      )}
    </svg>
  )
}
