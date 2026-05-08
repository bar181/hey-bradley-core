import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'

/**
 * P54 Sprint K Wave 1 (A2) — Patch latency badge.
 *
 * Renders a small monospace pill on the bradley reply showing how fast the
 * chat-pipeline turn completed. Mirrors the active-personality chip pattern
 * (subtle accent, not alarming). Above 5s shows "✓" instead of the time so
 * real-LLM tail latency / cold-start flake doesn't surface as a number
 * (preflight D3).
 *
 * EXPERT mode adds an expandable secondary block with per-stage breakdown.
 *
 * No Σ widening — `latencyMs` lives on `ChatPipelineResult`/`ChatMessage`,
 * never on PATCH_ATOM Σ (preflight D1).
 */
export interface PatchLatencyBadgeProps {
  latencyMs?: number | null
  breakdown?: {
    classify?: number
    select?: number
    patch?: number
    apply?: number
  } | null
}

const FLAKE_CEILING_MS = 5000

function formatStageMs(label: string, ms: number | undefined): string | null {
  if (typeof ms !== 'number' || ms < 0) return null
  return `${label} ${Math.round(ms)}ms`
}

export function PatchLatencyBadge({ latencyMs, breakdown }: PatchLatencyBadgeProps) {
  const isExpert = useUIStore((s) => s.rightPanelTab) === 'EXPERT'

  if (latencyMs == null || latencyMs <= 0) return null

  const seconds = (latencyMs / 1000).toFixed(1)
  const overFlake = latencyMs > FLAKE_CEILING_MS
  const display = overFlake ? '✓' : `Updated in ${seconds}s`
  const ariaLabel = overFlake
    ? 'Patch latency: complete'
    : `Patch latency: ${seconds} seconds`

  const stageParts = breakdown
    ? [
        formatStageMs('classify', breakdown.classify),
        formatStageMs('select', breakdown.select),
        formatStageMs('patch', breakdown.patch),
        formatStageMs('apply', breakdown.apply),
      ].filter((s): s is string => s !== null)
    : []
  const showBreakdown = isExpert && stageParts.length > 0

  return (
    <div className="mt-1 flex flex-col gap-0.5">
      <span
        data-testid="patch-latency-badge"
        aria-label={ariaLabel}
        className={cn(
          'inline-block self-start px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider',
          'bg-hb-accent/10 text-hb-accent border border-hb-accent/30'
        )}
      >
        {display}
      </span>
      {showBreakdown && (
        <span
          data-testid="patch-latency-breakdown"
          className="inline-block self-start px-1.5 py-0.5 rounded text-[10px] font-mono text-hb-text-muted border border-hb-border/40"
        >
          {stageParts.join(' · ')}
        </span>
      )}
    </div>
  )
}
