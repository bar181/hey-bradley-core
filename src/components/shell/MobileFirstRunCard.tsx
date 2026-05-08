/**
 * P66 / Polish Sprint / Wave 1 / A3 — MobileFirstRunCard.
 *
 * First-run mobile orientation card. Renders above the 3-tab content on
 * the first mobile launch only; persists dismissal via
 * kv['mobile_first_run_seen'] = '1'. No new deps; tokens + Tailwind only.
 */

import { useEffect, useState } from 'react'
import { Mic, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/cn'
import { tokens } from '@/styles/design-tokens'
import { kvGet, kvSet } from '@/contexts/persistence/repositories/kv'

const FIRST_RUN_KEY = 'mobile_first_run_seen'

export function shouldShowMobileFirstRun(): boolean {
  try { return kvGet(FIRST_RUN_KEY) !== '1' } catch { return false }
}
export function markMobileFirstRunSeen(): void {
  try { kvSet(FIRST_RUN_KEY, '1') } catch { /* swallow — pre-DB boot */ }
}

export interface MobileFirstRunCardProps {
  onListen: () => void
  onChat: () => void
  onSkip: () => void
}

export function MobileFirstRunCard({ onListen, onChat, onSkip }: MobileFirstRunCardProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const buttonBase = cn(
    'w-full min-h-[44px] flex items-center justify-center gap-2 rounded-md',
    'border border-hb-border bg-hb-surface text-hb-text-primary text-sm font-mono',
    'uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent focus-visible:ring-offset-2',
    'hover:bg-hb-accent/10 hover:border-hb-accent/30 hover:text-hb-accent',
  )
  return (
    <div
      data-testid="mobile-first-run-card"
      className={cn(
        'bg-hb-surface border border-hb-border transition-all duration-300 ease-out',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
      style={{
        padding: tokens.spacing['stack-gap-lg'],
        borderRadius: tokens.radius.lg,
        margin: tokens.spacing['stack-gap'],
      }}
    >
      <h2 className="text-base font-mono uppercase tracking-wider text-hb-text-primary mb-2">
        Tap Listen or Chat to start
      </h2>
      <p className="text-sm text-hb-text-muted mb-4">
        Hey Bradley listens or chats. Pick one.
      </p>
      <div className="flex flex-col gap-3">
        <button type="button" onClick={onListen} data-testid="mobile-first-run-listen" className={buttonBase}>
          <Mic size={18} aria-hidden="true" />
          <span>Listen</span>
        </button>
        <button type="button" onClick={onChat} data-testid="mobile-first-run-chat" className={buttonBase}>
          <MessageSquare size={18} aria-hidden="true" />
          <span>Chat</span>
        </button>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSkip}
          data-testid="mobile-first-run-skip"
          className="min-h-[44px] px-3 text-xs font-mono uppercase tracking-wider text-hb-text-muted hover:text-hb-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent focus-visible:ring-offset-2 rounded"
        >
          Skip →
        </button>
      </div>
    </div>
  )
}
