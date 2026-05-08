/**
 * P69 / OC-5 (ADR-090) — MobileLayout single chat surface.
 *
 * Supersedes the Sprint J P53 / ADR-076 3-tab nav (Builder hidden / Chat /
 * Listen / View). Mobile is now ONE surface: chat thread + input row, with
 * an inline mic button on the input and a bottom-fixed "See Specs"
 * affordance. Tapping the mic flips `listenFullscreenOpen` for A7's
 * `MobileListenFullscreen` overlay; tapping "See Specs" flips
 * `specBottomSheetOpen` for A7's `MobileSpecBottomSheet`.
 *
 * Wrapper class `md:hidden` so this layer renders ONLY <768px viewport. The
 * sibling desktop tri-pane (Builder.tsx) wears `hidden md:flex`.
 *
 * Hamburger (MobileMenu) integration is preserved unchanged.
 * First-run card (MobileFirstRunCard) is preserved; A8 owns its evolution.
 */

import { useRef, useState } from 'react'
import { ChevronUp, Menu, Mic } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useUIStore } from '@/store/uiStore'
import { PERSONALITY_PROFILES } from '@/contexts/intelligence/personality/personalityEngine'
import { ChatInput } from '@/components/shell/ChatInput'
import { MobileMenu } from '@/components/shell/MobileMenu'
import {
  MobileFirstRunCard,
  shouldShowMobileFirstRun,
  markMobileFirstRunSeen,
} from '@/components/shell/MobileFirstRunCard'

export function MobileLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  // P66 / A3 — first-run mobile orientation card. Hydrate from kv on mount;
  // if the user has already dismissed it the card never renders. A8 will
  // evolve this into the pre-filled-prompt + personality-pill UX.
  const [showFirstRun, setShowFirstRun] = useState(() => shouldShowMobileFirstRun())
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const personalityId = useIntelligenceStore((s) => s.personalityId)
  const personality = PERSONALITY_PROFILES[personalityId]
  const personalityEmoji = personality?.emoji ?? ''

  const setAppMode = useUIStore((s) => s.setAppMode)
  const setInteractionMode = useUIStore((s) => s.setInteractionMode)
  const setListenFullscreenOpen = useUIStore((s) => s.setListenFullscreenOpen)
  const setSpecBottomSheetOpen = useUIStore((s) => s.setSpecBottomSheetOpen)

  const dismissFirstRun = () => {
    markMobileFirstRunSeen()
    setShowFirstRun(false)
  }
  const handleFirstRunListen = () => {
    setAppMode('whiteboard')
    setInteractionMode('LISTEN')
    setListenFullscreenOpen(true)
    dismissFirstRun()
  }
  const handleFirstRunChat = () => {
    setAppMode('whiteboard')
    dismissFirstRun()
  }

  const handleMicTap = () => {
    setInteractionMode('LISTEN')
    setListenFullscreenOpen(true)
  }
  const handleSeeSpecsTap = () => {
    setSpecBottomSheetOpen(true)
  }

  return (
    <div
      data-testid="mobile-layout"
      className="md:hidden flex flex-col h-screen bg-hb-bg text-hb-text-primary"
    >
      {/* Top bar — hamburger + brand + personality emoji (preserved). */}
      <header className="h-12 shrink-0 flex items-center justify-between px-3 border-b border-hb-border bg-hb-surface">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          data-testid="mobile-menu-trigger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={cn(
            'p-1.5 rounded text-hb-text-primary',
            'hover:bg-hb-accent/10 hover:text-hb-accent',
            'focus-visible:ring-2 focus-visible:ring-hb-accent',
            'transition-colors',
          )}
        >
          <Menu size={18} aria-hidden="true" />
        </button>
        <h1 className="text-sm font-mono uppercase tracking-wider text-hb-text-primary">
          Hey Bradley
        </h1>
        <span
          className="text-base"
          data-testid="mobile-personality-emoji"
          aria-label={personality ? `Personality: ${personality.label}` : 'Personality'}
          aria-hidden={!personalityEmoji}
        >
          {personalityEmoji || ' '}
        </span>
      </header>

      {/* Single chat surface. ChatInput renders the chat thread + input row. */}
      <main
        className="flex-1 overflow-hidden flex flex-col min-h-0 relative"
        data-testid="mobile-chat-surface"
      >
        {showFirstRun && (
          <MobileFirstRunCard
            onListen={handleFirstRunListen}
            onChat={handleFirstRunChat}
            onSkip={dismissFirstRun}
          />
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          <ChatInput />
        </div>

        {/* Inline mic — floats bottom-right of the chat surface above the
            input. Tap → opens fullscreen listen overlay (A7). 44x44 min
            touch target per ADR-091. */}
        <button
          type="button"
          onClick={handleMicTap}
          data-testid="mobile-inline-mic"
          aria-label="Switch to listen mode"
          className={cn(
            'absolute bottom-16 right-3 z-10',
            'min-h-[44px] min-w-[44px] rounded-full',
            'bg-hb-accent text-hb-bg shadow-lg',
            'flex items-center justify-center',
            'hover:bg-hb-accent/90 active:scale-95',
            'focus-visible:ring-2 focus-visible:ring-hb-accent focus-visible:ring-offset-2',
            'transition-all',
          )}
        >
          <Mic size={20} aria-hidden="true" />
        </button>

        {/* "See Specs" affordance — bottom-fixed pill above safe-area inset.
            Tap → opens A7's MobileSpecBottomSheet. */}
        <button
          type="button"
          onClick={handleSeeSpecsTap}
          data-testid="mobile-see-specs"
          aria-label="See specs"
          className={cn(
            'absolute left-1/2 -translate-x-1/2 z-10',
            'bottom-2 pb-[env(safe-area-inset-bottom)]',
            'min-h-[36px] px-3 rounded-full',
            'bg-hb-surface border border-hb-border text-hb-text-primary',
            'flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider',
            'hover:bg-hb-accent/10 hover:text-hb-accent hover:border-hb-accent',
            'focus-visible:ring-2 focus-visible:ring-hb-accent',
            'transition-colors',
          )}
        >
          <ChevronUp size={14} aria-hidden="true" />
          <span>See Specs</span>
        </button>
      </main>

      {/* Hamburger menu (modal) — preserved. */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={triggerRef}
      />
    </div>
  )
}
