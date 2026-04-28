/**
 * P34 Sprint E P1 (Wave 2 A4) — 3-button Clarification UX.
 *
 * When INTENT_ATOM confidence is low and the assumptions engine produces
 * candidates, this panel renders 3 buttons + a free-text "something else"
 * option. Selection re-runs the chat pipeline with the confirmed assumption
 * locked.
 *
 * ADR-063.
 */
import type { Assumption } from '@/contexts/intelligence/aisp/assumptions'

export interface ClarificationPanelProps {
  /** The original user text (for "you said: X"). */
  originalText: string
  /** Up to 3 ranked assumptions. */
  assumptions: readonly Assumption[]
  /** Called when the user picks one of the 3 assumption buttons. */
  onAccept: (assumption: Assumption) => void
  /** Called when the user picks the "something else" escape hatch. */
  onReject: () => void
}

export function ClarificationPanel({
  originalText,
  assumptions,
  onAccept,
  onReject,
}: ClarificationPanelProps) {
  if (assumptions.length === 0) return null

  return (
    <div
      data-testid="clarification-panel"
      className="text-xs mt-2 p-2 rounded border border-amber-200 bg-amber-50/60 space-y-2"
    >
      <div className="text-[#6b5e4f]">
        you said:{' '}
        <span className="font-mono text-[#2d1f12]">"{originalText}"</span>
        <br />
        I'm not 100% sure — pick the one you meant:
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {assumptions.map((a) => (
          <button
            type="button"
            key={a.id}
            data-testid={`clarification-option-${a.id}`}
            onClick={() => onAccept(a)}
            className="text-left p-2 rounded border border-amber-200 bg-white hover:bg-amber-50/80 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-hb-text-primary">{a.label}</span>
              <span
                data-testid={`clarification-confidence-${a.id}`}
                className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800"
              >
                {Math.round(a.confidence * 100)}%
              </span>
            </div>
            {a.rationale && (
              <div className="text-[10px] text-hb-text-muted mt-0.5">{a.rationale}</div>
            )}
          </button>
        ))}
        <button
          type="button"
          data-testid="clarification-option-other"
          onClick={onReject}
          className="text-left p-2 rounded border border-amber-200/60 bg-white/60 hover:bg-amber-50/60 transition-colors text-sm text-hb-text-muted italic"
        >
          something else — let me rephrase
        </button>
      </div>
    </div>
  )
}
