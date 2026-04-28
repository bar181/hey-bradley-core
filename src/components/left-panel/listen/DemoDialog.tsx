/**
 * P37 Wave 1 (R2 S3) — DemoDialog.
 *
 * Modal for picking one of the canned listen demos. Extracted from ListenTab
 * so the orchestrator stays under the CLAUDE.md 150-LOC target. Pure
 * presentational — host owns demo dispatch + open/close state.
 */
import { X } from 'lucide-react'
import type { DemoSequenceConfig } from './listenHelpers'

export interface DemoDialogProps {
  open: boolean
  demos: readonly DemoSequenceConfig[]
  disabled: boolean
  onClose: () => void
  onPick: (demo: DemoSequenceConfig) => void
}

export function DemoDialog({ open, demos, disabled, onClose, onPick }: DemoDialogProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Demo options"
    >
      <div
        className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Watch a Demo</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {demos.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => {
                onClose()
                onPick(demo)
              }}
              disabled={disabled}
              className="w-full group flex items-center gap-3 rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-[#A51C30]/15 hover:border-[#A51C30]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
            >
              <div className="flex gap-0.5 shrink-0">
                {demo.swatchColors.map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-white/70 group-hover:text-[#C1283E] transition-colors">
                {demo.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
