/**
 * P69 / OC-5 / A7 — MobileListenFullscreen.
 *
 * Full-viewport listen overlay (decision 4 of ADR-090). Tapping the inline
 * mic in MobileLayout opens this overlay above the chat surface; tapping
 * "Done" or pressing ESC closes it. The mic button at the center toggles a
 * local recording state with a pulsing ring affordance.
 *
 * Web Speech / STT wire-up is out of scope for this sprint — the transcript
 * shows the placeholder "Listening..." text. The actual STT pipeline lives
 * in src/components/left-panel/listen/useListenPipeline.ts; consuming it
 * here is a future task (OC-CLEANUP / OC-12).
 *
 * NO new dependencies. Tailwind + lucide-react only. Tokens via design-tokens.
 * Mobile-only surface (parent gates with `md:hidden`).
 */

import { useEffect, useState } from 'react'
import { Mic } from 'lucide-react'
import { tokens } from '@/styles/design-tokens'

export interface MobileListenFullscreenProps {
  open: boolean
  onClose: () => void
}

export function MobileListenFullscreen(props: MobileListenFullscreenProps) {
  const { open, onClose } = props
  const [mounted, setMounted] = useState(false)
  const [recording, setRecording] = useState(false)

  // Entrance fade — mount → next frame → opacity-100. Reset when closed.
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(id)
    }
    setMounted(false)
    setRecording(false)
    return undefined
  }, [open])

  // ESC closes the overlay.
  useEffect(() => {
    if (!open) return undefined
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      data-testid="mobile-listen-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Listen mode"
      className={
        'fixed inset-0 z-30 bg-[#faf8f5] flex flex-col items-center justify-between ' +
        'transition-opacity duration-200 ease-out ' +
        (mounted ? 'opacity-100' : 'opacity-0')
      }
      style={{ padding: tokens.spacing['stack-gap'] }}
    >
      {/* Header spacer — keeps mic vertically centered without nudging the Done button. */}
      <div aria-hidden="true" className="h-12 w-full" />

      {/* Centered mic + transcript area. */}
      <div className="flex flex-col items-center gap-6 flex-1 justify-center w-full">
        <button
          type="button"
          data-testid="mobile-listen-mic-toggle"
          aria-label={recording ? 'Stop recording' : 'Start recording'}
          aria-pressed={recording}
          onClick={() => setRecording((r) => !r)}
          className={
            'relative flex items-center justify-center rounded-full ' +
            'w-40 h-40 min-h-[120px] min-w-[120px] ' +
            'bg-[#2d1f12] text-[#faf8f5] ' +
            'transition-transform duration-200 ease-out active:scale-95 ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b5e4f]'
          }
          style={{ boxShadow: tokens.shadow.elevated }}
        >
          {recording && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[#2d1f12]/30 animate-pulse"
            />
          )}
          <Mic className="w-32 h-32 relative" aria-hidden="true" />
        </button>

        <div
          data-testid="mobile-listen-transcript"
          aria-live="polite"
          className="text-center text-base font-mono text-[#6b5e4f] min-h-[3rem] px-4"
        >
          {recording ? 'Listening...' : 'Tap mic to start'}
        </div>
      </div>

      {/* Done button — bottom-right, 44x44 minimum. */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          data-testid="mobile-listen-done"
          onClick={onClose}
          className={
            'min-h-[44px] min-w-[44px] px-5 py-2 rounded-md ' +
            'bg-[#2d1f12] text-[#faf8f5] text-sm font-mono uppercase tracking-wider ' +
            'transition-colors duration-200 hover:bg-[#6b5e4f] ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b5e4f]'
          }
        >
          Done
        </button>
      </div>
    </div>
  )
}
