/**
 * P69 / OC-5 / A7 — MobileSpecBottomSheet.
 *
 * Bottom-anchored spec sheet (decision 3 of ADR-090). Two states via a
 * local 'peek' | 'full' state machine; drag handle at top toggles states
 * via raw touch events (no library, browser CSS transforms only). Backdrop
 * tap and ESC close the sheet.
 *
 *   peek (40vh): AISP atom chips + Export Spec button
 *   full (85vh): AISP atom chips + human spec preview + history list +
 *                Export Spec button
 *
 * Export Spec button is wired to a console.log stub for now; the clean
 * import surface for `composeShareSpecBundle` requires a `MasterConfig`
 * which is owned by the parent (mobile shell); full wire-up is OC-9
 * export polish — see comment near onExport().
 *
 * NO new dependencies. Tailwind + lucide-react only. Tokens via design-tokens.
 * Mobile-only surface (parent gates with `md:hidden`).
 */

import { useEffect, useRef, useState } from 'react'
import { GripHorizontal, FileText } from 'lucide-react'
import { tokens } from '@/styles/design-tokens'

export interface MobileSpecBottomSheetProps {
  open: boolean
  onClose: () => void
}

type SheetState = 'peek' | 'full'

const ATOMS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'intent', label: 'INTENT_ATOM' },
  { id: 'assumptions', label: 'ASSUMPTIONS_ATOM' },
  { id: 'selection', label: 'SELECTION_ATOM' },
  { id: 'content', label: 'CONTENT_ATOM' },
  { id: 'patch', label: 'PATCH_ATOM' },
]

export function MobileSpecBottomSheet(props: MobileSpecBottomSheetProps) {
  const { open, onClose } = props
  const [mounted, setMounted] = useState(false)
  const [sheetState, setSheetState] = useState<SheetState>('peek')
  const touchStartY = useRef<number | null>(null)
  const touchDeltaY = useRef<number>(0)

  // Slide-up on open; reset state when closed.
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(id)
    }
    setMounted(false)
    setSheetState('peek')
    return undefined
  }, [open])

  // ESC closes.
  useEffect(() => {
    if (!open) return undefined
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Drag handle touch handlers — basic delta-y heuristic.
  // Up swipe (>40px) → peek → full. Down swipe (>40px) → full → peek.
  const onHandleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    touchStartY.current = e.touches[0]?.clientY ?? null
    touchDeltaY.current = 0
  }
  const onHandleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (touchStartY.current === null) return
    const y = e.touches[0]?.clientY ?? touchStartY.current
    touchDeltaY.current = y - touchStartY.current
  }
  const onHandleTouchEnd = () => {
    const delta = touchDeltaY.current
    if (delta < -40) setSheetState('full')
    else if (delta > 40) {
      if (sheetState === 'full') setSheetState('peek')
      else onClose()
    }
    touchStartY.current = null
    touchDeltaY.current = 0
  }
  const toggleSheetState = () => {
    setSheetState((s) => (s === 'peek' ? 'full' : 'peek'))
  }

  const onExport = () => {
    // Wire-up to composeShareSpecBundle deferred to OC-9 export polish.
    // The bundle composer requires a MasterConfig snapshot owned by the
    // mobile shell parent; this stub keeps the surface testable today.
    // eslint-disable-next-line no-console
    console.log('[MobileSpecBottomSheet] Export Spec clicked — OC-9 wire-up pending')
  }

  if (!open) return null

  const heightClass = sheetState === 'full' ? 'h-[85vh]' : 'h-[40vh]'

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        data-testid="mobile-spec-sheet-backdrop"
        aria-label="Close spec sheet"
        onClick={onClose}
        className={
          'fixed inset-0 z-20 bg-black/40 ' +
          'transition-opacity duration-200 ease-out ' +
          (mounted ? 'opacity-100' : 'opacity-0')
        }
      />

      {/* Sheet */}
      <div
        data-testid="mobile-spec-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Spec details"
        data-sheet-state={sheetState}
        className={
          'fixed bottom-0 left-0 right-0 z-30 bg-[#faf8f5] flex flex-col ' +
          'rounded-t-[20px] ' +
          'transition-transform duration-300 ease-out ' +
          heightClass + ' ' +
          (mounted ? 'translate-y-0' : 'translate-y-full')
        }
        style={{ boxShadow: tokens.shadow.elevated, touchAction: 'pan-y' }}
      >
        {/* Drag handle pill */}
        <button
          type="button"
          data-testid="mobile-spec-sheet-handle"
          aria-label={
            sheetState === 'peek' ? 'Expand spec sheet' : 'Collapse spec sheet'
          }
          onClick={toggleSheetState}
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
          className="w-full flex flex-col items-center pt-2 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b5e4f]"
        >
          <span
            aria-hidden="true"
            className="w-10 h-1 rounded-full bg-[#6b5e4f]/40 mx-auto mt-2"
          />
          <GripHorizontal
            aria-hidden="true"
            className="w-4 h-4 text-[#6b5e4f]/0"
          />
        </button>

        {/* Title row */}
        <div
          className="flex items-center justify-between px-5 pb-2"
          style={{ paddingLeft: tokens.spacing['container-x'], paddingRight: tokens.spacing['container-x'] }}
        >
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#2d1f12]">
            Spec
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b5e4f]">
            {sheetState === 'full' ? 'full' : 'peek'}
          </span>
        </div>

        {/* Scrollable body */}
        <div
          data-testid="mobile-spec-sheet-body"
          className="flex-1 overflow-y-auto px-5 pb-4 space-y-4"
          style={{ paddingLeft: tokens.spacing['container-x'], paddingRight: tokens.spacing['container-x'] }}
        >
          {/* AISP atom chips — always shown (peek + full). */}
          <section data-testid="mobile-spec-sheet-aisp">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6b5e4f] mb-2">
              AISP atoms
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ATOMS.map((atom) => (
                <span
                  key={atom.id}
                  data-testid={`mobile-spec-atom-${atom.id}`}
                  className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-mono uppercase tracking-wider"
                >
                  {atom.label}
                </span>
              ))}
            </div>
          </section>

          {/* Full-only sections */}
          {sheetState === 'full' && (
            <>
              <section data-testid="mobile-spec-sheet-human">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6b5e4f] mb-2">
                  Human spec
                </div>
                <div className="rounded-md border border-[#6b5e4f]/20 bg-white/40 p-3 text-sm text-[#2d1f12] leading-relaxed">
                  Your specification preview will appear here as you build.
                  Tap Export to copy the full bundle.
                </div>
              </section>
              <section data-testid="mobile-spec-sheet-history">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6b5e4f] mb-2">
                  History
                </div>
                <ul className="space-y-1 text-xs font-mono text-[#6b5e4f]">
                  <li>— No history yet</li>
                </ul>
              </section>
            </>
          )}
        </div>

        {/* Footer — Export */}
        <div
          className="border-t border-[#6b5e4f]/20 px-5 py-3 flex justify-end"
          style={{ paddingLeft: tokens.spacing['container-x'], paddingRight: tokens.spacing['container-x'] }}
        >
          <button
            type="button"
            data-testid="mobile-spec-sheet-export"
            onClick={onExport}
            className={
              'min-h-[44px] min-w-[44px] px-4 py-2 rounded-md ' +
              'bg-[#2d1f12] text-[#faf8f5] text-sm font-mono uppercase tracking-wider ' +
              'flex items-center gap-2 ' +
              'transition-colors duration-200 hover:bg-[#6b5e4f] ' +
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b5e4f]'
            }
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Export Spec</span>
          </button>
        </div>
      </div>
    </>
  )
}
