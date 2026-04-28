/**
 * P36 Sprint F P1 — Listen Review Card.
 *
 * Renders the "Here's what I heard / Here's what I'll do" preview gate
 * BEFORE chatPipeline fires on a voice transcript. Keeps voice-mode honest
 * by giving the user a 3-button approve/edit/cancel decision before any
 * LLM call burns tokens.
 *
 * Compact card sized for the left-panel ListenTab — same width as the
 * existing pttReply / pttBusy banners.
 *
 * ADR-065.
 */
import { useEffect, useRef } from 'react'
import { Check, X, Pencil } from 'lucide-react'

export interface ListenReviewCardProps {
  /** The voice transcript captured by Web Speech. */
  transcript: string
  /** Plain-language preview of what the chat pipeline will do, computed
   *  client-side via classifyIntent (no LLM call to render this). */
  actionPreview: string
  /** Intent confidence (drives the "low confidence — review carefully" hint). */
  confidence: number
  onApprove: () => void
  onEdit: () => void
  onCancel: () => void
}

export function ListenReviewCard({
  transcript,
  actionPreview,
  confidence,
  onApprove,
  onEdit,
  onCancel,
}: ListenReviewCardProps) {
  const lowConfidence = confidence < 0.7
  // Hands-free keyboard shortcuts: Enter approves, Escape cancels.
  // The Approve button is auto-focused so screen readers + keyboard users
  // land on the primary action without an extra Tab keystroke.
  const approveBtnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    approveBtnRef.current?.focus()
  }, [])
  return (
    <div
      data-testid="listen-review-card"
      className="w-full max-w-[300px] rounded-md bg-white/8 border border-white/15 px-3 py-2.5 text-sm text-white/85 space-y-2"
      role="region"
      aria-live="polite"
      aria-label="Voice action review"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onApprove()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        }
      }}
      tabIndex={-1}
    >
      <div data-testid="listen-review-heard">
        <span className="text-[10px] uppercase tracking-wider text-white/65">heard</span>
        <div className="text-sm font-mono text-white/95">"{transcript}"</div>
      </div>
      <div data-testid="listen-review-action">
        <span className="text-[10px] uppercase tracking-wider text-white/65">
          will {lowConfidence ? '· low confidence' : ''}
        </span>
        <div className="text-sm">{actionPreview}</div>
      </div>
      <div className="flex gap-1.5 pt-1">
        <button
          type="button"
          data-testid="listen-review-approve"
          onClick={onApprove}
          className="flex-1 px-2 py-1 rounded bg-emerald-700/40 hover:bg-emerald-700/60 border border-emerald-500/40 text-xs text-emerald-100 flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <Check size={12} /> Approve
        </button>
        <button
          type="button"
          data-testid="listen-review-edit"
          onClick={onEdit}
          className="flex-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white/85 flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          type="button"
          data-testid="listen-review-cancel"
          onClick={onCancel}
          className="flex-1 px-2 py-1 rounded bg-rose-900/30 hover:bg-rose-900/50 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  )
}
