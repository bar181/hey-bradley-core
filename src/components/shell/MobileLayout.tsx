/**
 * Sprint J P53 (A10) — MobileLayout.
 *
 * 3-tab mobile shell (Chat / Listen / View) that re-uses existing components
 * so we never duplicate. Locked decision D7 (sprint-j-locked.md): Builder is
 * hidden on mobile; advanced surfaces (settings/personality/uploads/share)
 * collapse into the hamburger menu.
 *
 * Wrapper class `md:hidden` so this layer renders ONLY <768px viewport. The
 * sibling desktop tri-pane (Builder.tsx) wears `hidden md:flex`.
 *
 * KISS: tab state is local React useState — no Zustand. Default 'chat'.
 */

import { useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { PERSONALITY_PROFILES } from '@/contexts/intelligence/personality/personalityEngine'
import { ChatInput } from '@/components/shell/ChatInput'
import { ListenTab } from '@/components/left-panel/ListenTab'
import { RealityTab } from '@/components/center-canvas/RealityTab'
import { MobileMenu } from '@/components/shell/MobileMenu'

type MobileTab = 'chat' | 'listen' | 'view'

interface TabSpec {
  id: MobileTab
  label: string
  testid: string
}

const TABS: readonly TabSpec[] = [
  { id: 'chat', label: 'Chat', testid: 'mobile-tab-chat' },
  { id: 'listen', label: 'Listen', testid: 'mobile-tab-listen' },
  { id: 'view', label: 'View', testid: 'mobile-tab-view' },
]

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<MobileTab>('chat')
  const [menuOpen, setMenuOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const personalityId = useIntelligenceStore((s) => s.personalityId)
  const personality = PERSONALITY_PROFILES[personalityId]
  const personalityEmoji = personality?.emoji ?? ''

  return (
    <div
      data-testid="mobile-layout"
      data-mobile-active-tab={activeTab}
      className="md:hidden flex flex-col h-screen bg-hb-bg text-hb-text-primary"
    >
      {/* Top bar */}
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
          {personalityEmoji || ' '}
        </span>
      </header>

      {/* Active surface */}
      <main className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-3">
              <p className="text-xs text-hb-text-muted">
                Chat with Hey Bradley below. Switch to View to preview your site.
              </p>
            </div>
            <div className="shrink-0 border-t border-hb-border bg-hb-surface p-2">
              <ChatInput />
            </div>
          </>
        )}

        {activeTab === 'listen' && (
          <div className="flex-1 flex flex-col min-h-0">
            <ListenTab />
          </div>
        )}

        {activeTab === 'view' && (
          <div className="flex-1 overflow-y-auto">
            <RealityTab />
          </div>
        )}
      </main>

      {/* Sticky bottom tab nav */}
      <nav
        role="tablist"
        aria-label="Mobile sections"
        className="shrink-0 border-t border-hb-border bg-hb-surface flex items-stretch"
      >
        {TABS.map((tab) => {
          const selected = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              data-testid={tab.testid}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-3 text-xs font-mono uppercase tracking-wider',
                'transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent',
                selected
                  ? 'text-hb-accent border-t-2 border-hb-accent bg-hb-accent/5'
                  : 'text-hb-text-muted hover:text-hb-text-primary border-t-2 border-transparent',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Hamburger menu (modal) */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={triggerRef}
      />
    </div>
  )
}
