/**
 * P36 Sprint F P1 — Listen Clarification Card.
 *
 * Voice-friendly variant of ClarificationPanel (P34 / ADR-063). Same 3-button
 * + escape pattern, but compact for the left-panel ListenTab and styled
 * against the dark background.
 *
 * Triggers when chatPipeline returns a low-confidence intent on a voice
 * transcript. User taps a button OR the "say again" escape; selection
 * re-feeds the canonical rephrasing into chatPipeline.
 *
 * ADR-065. Mirrors ADR-063 ClarificationPanel.
 */
import type { Assumption } from '@/contexts/intelligence/aisp'

export interface ListenClarificationCardProps {
  originalTranscript: string
  assumptions: readonly Assumption[]
  onAccept: (assumption: Assumption) => void
  onReject: () => void
}

export function ListenClarificationCard({
  originalTranscript,
  assumptions,
  onAccept,
  onReject,
}: ListenClarificationCardProps) {
  if (assumptions.length === 0) return null
  return (
    <div
      data-testid="listen-clarification-card"
      className="w-full max-w-[300px] rounded-md bg-amber-900/20 border border-amber-500/30 px-3 py-2.5 text-sm text-white/85 space-y-2"
      role="region"
      aria-live="polite"
      aria-label="Voice clarification needed"
    >
      <div className="text-[11px] text-white/70">
        <span className="text-[10px] uppercase tracking-wider text-amber-300/80">heard</span>
        <div className="font-mono text-white/95">"{originalTranscript}"</div>
        <div className="mt-1">Pick the closest match:</div>
      </div>
      <div className="space-y-1">
        {assumptions.slice(0, 3).map((a) => (
          <button
            key={a.id}
            type="button"
            data-testid={`listen-clarification-option-${a.id}`}
            onClick={() => onAccept(a)}
            className="w-full text-left px-2 py-1.5 rounded bg-white/8 hover:bg-white/15 border border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-white/90">{a.label}</span>
              <span
                data-testid={`listen-clarification-confidence-${a.id}`}
                className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200"
              >
                {Math.round(a.confidence * 100)}% match
              </span>
            </div>
          </button>
        ))}
        <button
          type="button"
          data-testid="listen-clarification-option-other"
          onClick={onReject}
          className="w-full text-left px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 italic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          say it again — different wording
        </button>
      </div>
    </div>
  )
}
