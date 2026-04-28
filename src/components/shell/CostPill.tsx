/**
 * CostPill — visible per-session USD spend vs cap.
 * P20 ADR-049 deliverable. Always-on shell footer indicator.
 *
 * Color states:
 *   green: spend < 80% of cap
 *   amber: spend ≥ 80% of cap
 *   red:   spend ≥ 100% of cap
 *
 * Hidden when sessionUsd === 0 (DEV smoke; reduces noise).
 */
import { useIntelligenceStore } from '@/store/intelligenceStore'

export function CostPill() {
  const sessionUsd = useIntelligenceStore((s) => s.sessionUsd)
  const capUsd = useIntelligenceStore((s) => s.capUsd)

  if (sessionUsd === 0) return null

  const ratio = sessionUsd / capUsd
  const overCap = ratio >= 1.0
  const nearCap = ratio >= 0.8 && !overCap

  // tw color classes by state
  const ringClass = overCap
    ? 'ring-red-500/30 bg-red-500/10 text-red-700'
    : nearCap
      ? 'ring-amber-500/30 bg-amber-500/10 text-amber-700'
      : 'ring-emerald-500/20 bg-emerald-500/5 text-emerald-700'

  const stateTestId = overCap ? 'cost-pill-red' : nearCap ? 'cost-pill-amber' : 'cost-pill-green'

  return (
    <div
      data-testid="cost-pill"
      data-state-testid={stateTestId}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 text-xs font-mono tabular-nums ${ringClass}`}
      aria-label={`Session cost ${sessionUsd.toFixed(4)} of ${capUsd.toFixed(2)} USD cap`}
      title={overCap ? 'Cost cap reached — adjust in Settings → LLM' : 'Per-session USD cap; edit in Settings → LLM'}
    >
      <span>${sessionUsd.toFixed(sessionUsd < 1 ? 4 : 2)}</span>
      <span className="opacity-60">/</span>
      <span>${capUsd.toFixed(2)}</span>
    </div>
  )
}
