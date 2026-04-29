/**
 * Sprint J P53 (A10) — MobileMenu (hamburger drawer).
 *
 * Modal slide-in surface that re-uses existing settings widgets so the mobile
 * layer never duplicates UI. Hidden by default — the parent MobileLayout owns
 * the `md:hidden` wrapper, so this component just renders unconditionally and
 * trusts the breakpoint guard.
 *
 * KISS: Tailwind-only, no portal, no new deps. Escape closes + restores focus
 * to the trigger button (a11y).
 */

import { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { PersonalityPicker } from '@/components/settings/PersonalityPicker'
import { ReferenceManagement } from '@/components/settings/ReferenceManagement'
import { BrandContextUpload } from '@/components/settings/BrandContextUpload'
import { CodebaseContextUpload } from '@/components/settings/CodebaseContextUpload'
import { LLMSettings } from '@/components/settings/LLMSettings'
import { ShareSpecButton } from '@/components/shell/ShareSpecButton'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  /** Ref to the trigger so we can return focus on close (a11y). */
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const isExpert = rightPanelTab === 'EXPERT'

  // Escape closes; close also returns focus to trigger.
  const handleClose = useCallback(() => {
    onClose()
    // Defer focus until React unmounts the dialog.
    requestAnimationFrame(() => {
      triggerRef.current?.focus()
    })
  }, [onClose, triggerRef])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, handleClose])

  // Move focus into the dialog on open so screen readers + keyboard nav land
  // somewhere sensible.
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [open])

  if (!open) return null

  const openConversationLog = () => {
    setActiveTab('CONVERSATION_LOG')
    handleClose()
  }

  return (
    <div
      data-testid="mobile-menu"
      className="fixed inset-0 z-[9100]"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-in panel (left edge → 85% width, capped) */}
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        tabIndex={-1}
        className={cn(
          'absolute top-0 left-0 h-full w-[85%] max-w-sm',
          'bg-hb-surface border-r border-hb-border shadow-2xl',
          'flex flex-col outline-none',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="h-12 flex items-center justify-between px-4 border-b border-hb-border shrink-0">
          <h2 className="text-sm font-mono uppercase tracking-wider text-hb-text-primary">
            Menu
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-hb-text-muted hover:text-hb-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Share Spec — viral primary action up top */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
              Share
            </h3>
            <ShareSpecButton />
          </section>

          {/* Personality */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
              Personality
            </h3>
            <PersonalityPicker />
          </section>

          {/* References */}
          <ReferenceManagement />

          {/* Brand context */}
          <BrandContextUpload />

          {/* Codebase context */}
          <CodebaseContextUpload />

          {/* BYOK / LLM Settings (re-uses existing widget) */}
          <LLMSettings />

          {/* Conversation Log (EXPERT-only link) */}
          {isExpert && (
            <section>
              <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
                Conversation Log
              </h3>
              <button
                type="button"
                onClick={openConversationLog}
                data-testid="mobile-menu-conversation-log"
                className={cn(
                  'px-3 py-1.5 text-xs rounded border border-hb-border',
                  'text-hb-text-primary hover:bg-hb-accent/10 hover:border-hb-accent/30',
                  'transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent',
                )}
              >
                Open conversation log
              </button>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}
