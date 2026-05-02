/**
 * DomainModelSVG — Pure SVG read-only + clickable domain model for Planning mode.
 * Renders bounded contexts (rounded rect) + relationships (4 kinds: partnership /
 * customer-supplier / conformist / anti-corruption-layer). Click + Enter/Space
 * emit `onContextSelect`. Tokens via `var(--hb-*)`. Mirrors ProcessMapSVG patterns.
 * Read-only + click at open-core; pan/zoom is Tier-2 carry-forward.
 */
import type { JSX, KeyboardEvent } from 'react'
import type {
  DomainModel,
  BoundedContext,
  ContextRelationship,
} from '@/contexts/intelligence/aisp/dddAtom'

export interface DomainModelSVGProps {
  model: DomainModel
  onContextSelect?: (contextId: string) => void
  width?: number
  height?: number
  activeContextId?: string
}

const BOX_W = 160
const BOX_H = 80
const NAME_MAX = 20
const RESP_MAX = 30

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

function renderContext(
  ctx: BoundedContext,
  isActive: boolean,
  onSelect?: (id: string) => void,
): JSX.Element {
  const strokeWidth = isActive ? 3 : 2
  const filter = isActive ? 'drop-shadow(0 0 8px var(--hb-accent))' : undefined
  const handleKey = (e: KeyboardEvent<SVGGElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(ctx.id)
    }
  }
  const responsibility = ctx.responsibility ?? ''
  return (
    <g
      key={ctx.id}
      role="button"
      tabIndex={0}
      aria-label={`Context ${ctx.name}: ${responsibility}`}
      aria-current={isActive ? 'true' : undefined}
      data-testid={`domain-context-${ctx.id}`}
      onClick={() => onSelect?.(ctx.id)}
      onKeyDown={handleKey}
      style={{ cursor: 'pointer', filter }}
    >
      <title>{`${ctx.name}${responsibility ? ` — ${responsibility}` : ''}`}</title>
      <rect
        x={ctx.x - BOX_W / 2}
        y={ctx.y - BOX_H / 2}
        width={BOX_W}
        height={BOX_H}
        rx={12}
        ry={12}
        fill="color-mix(in srgb, var(--hb-accent) 8%, transparent)"
        stroke="var(--hb-accent)"
        strokeWidth={strokeWidth}
      />
      <text
        x={ctx.x}
        y={ctx.y - 6}
        textAnchor="middle"
        fontSize={14}
        fontWeight={600}
        fill="var(--hb-text)"
      >
        {truncate(ctx.name, NAME_MAX)}
      </text>
      {responsibility ? (
        <text
          x={ctx.x}
          y={ctx.y + 14}
          textAnchor="middle"
          fontSize={11}
          fill="var(--hb-text-muted)"
        >
          {truncate(responsibility, RESP_MAX)}
        </text>
      ) : null}
    </g>
  )
}

interface EdgeEndpoints {
  src: BoundedContext
  tgt: BoundedContext
}

function findEndpoints(
  rel: ContextRelationship,
  contexts: BoundedContext[],
): EdgeEndpoints | null {
  const src = contexts.find((c) => c.id === rel.from)
  const tgt = contexts.find((c) => c.id === rel.to)
  if (!src || !tgt) return null
  return { src, tgt }
}

function renderRelationship(
  rel: ContextRelationship,
  contexts: BoundedContext[],
  key: string,
): JSX.Element | null {
  const endpoints = findEndpoints(rel, contexts)
  if (!endpoints) return null
  const { src, tgt } = endpoints
  const stroke = 'var(--hb-text-muted)'
  const opacity = 0.7

  if (rel.kind === 'anti-corruption-layer') {
    // Double-line: two parallel paths offset by 3px perpendicular
    const dx = tgt.x - src.x
    const dy = tgt.y - src.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const ox = (-dy / len) * 3
    const oy = (dx / len) * 3
    return (
      <g key={key} opacity={opacity}>
        <line
          x1={src.x + ox}
          y1={src.y + oy}
          x2={tgt.x + ox}
          y2={tgt.y + oy}
          stroke={stroke}
          strokeWidth={1.5}
        />
        <line
          x1={src.x - ox}
          y1={src.y - oy}
          x2={tgt.x - ox}
          y2={tgt.y - oy}
          stroke={stroke}
          strokeWidth={1.5}
        />
      </g>
    )
  }

  const dashArray = rel.kind === 'conformist' ? '6,4' : undefined

  if (rel.kind === 'customer-supplier') {
    const dx = tgt.x - src.x
    const dy = tgt.y - src.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const ux = dx / len
    const uy = dy / len
    const ax = tgt.x - ux * 8
    const ay = tgt.y - uy * 8
    const px = -uy * 5
    const py = ux * 5
    return (
      <g key={key} opacity={opacity}>
        <line
          x1={src.x}
          y1={src.y}
          x2={tgt.x}
          y2={tgt.y}
          stroke={stroke}
          strokeWidth={1.5}
        />
        <polyline
          points={`${ax + px},${ay + py} ${tgt.x},${tgt.y} ${ax - px},${ay - py}`}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
        />
      </g>
    )
  }

  // partnership (solid no arrow) + conformist (dashed no arrow)
  return (
    <line
      key={key}
      x1={src.x}
      y1={src.y}
      x2={tgt.x}
      y2={tgt.y}
      stroke={stroke}
      strokeWidth={1.5}
      strokeDasharray={dashArray}
      opacity={opacity}
    />
  )
}

export function DomainModelSVG(props: DomainModelSVGProps): JSX.Element {
  const { model, onContextSelect, width = 800, height = 400, activeContextId } = props
  return (
    <svg
      role="img"
      aria-label="Domain model"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto max-w-full"
      data-testid="domain-model-svg"
    >
      {model.relationships.map((rel, i) =>
        renderRelationship(rel, model.contexts, `rel-${rel.from}-${rel.to}-${i}`),
      )}
      {model.contexts.map((ctx) =>
        renderContext(ctx, activeContextId === ctx.id, onContextSelect),
      )}
    </svg>
  )
}
