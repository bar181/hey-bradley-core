/**
 * P69 / OC-5 / A8 — MobilePreFilledPrompt. ADR-090 decision 2.
 * 5-personality pill row + "Try:" hint above the mobile chat input.
 * kv['mobile_prefilled_prompt_dismissed'] mirrors the P66/A3 pattern.
 */

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { kvGet, kvSet } from '@/contexts/persistence/repositories/kv'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import type { PersonalityId } from '@/contexts/intelligence/personality/personalityEngine'

const DISMISS_KEY = 'mobile_prefilled_prompt_dismissed'

export function shouldShowMobilePreFilledPrompt(): boolean {
  try { return kvGet(DISMISS_KEY) !== '1' } catch { return false }
}
export function markMobilePreFilledPromptDismissed(): void {
  try { kvSet(DISMISS_KEY, '1') } catch { /* swallow — pre-DB boot */ }
}

const CHIPS: readonly { id: PersonalityId; emoji: string; label: string }[] = [
  { id: 'professional', emoji: '🎩',    label: 'Professional' },
  { id: 'fun',          emoji: '🎉',    label: 'Fun' },
  { id: 'geek',         emoji: '🔬',    label: 'Geek' },
  { id: 'teacher',      emoji: '👩‍🏫', label: 'Teacher' },
  { id: 'coach',        emoji: '💪',    label: 'Coach' },
] as const

export interface MobilePreFilledPromptProps {
  visible: boolean
  onDismiss: () => void
}

export function MobilePreFilledPrompt({ visible, onDismiss }: MobilePreFilledPromptProps) {
  const setPersonality = useIntelligenceStore((s) => s.setPersonality)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { if (visible) setMounted(true) }, [visible])
  if (!visible) return null

  const dismiss = () => { markMobilePreFilledPromptDismissed(); onDismiss() }
  const pick = (id: PersonalityId) => { setPersonality(id); dismiss() }

  return (
    <div
      data-testid="mobile-prefilled-prompt"
      role="region"
      aria-label="First-run pre-filled prompt"
      className={cn(
        'relative mx-3 my-2 px-3 py-3 rounded-md border border-hb-border bg-hb-surface',
        'transition-all duration-300 ease-out',
        mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
      )}
    >
      <button
        type="button" onClick={dismiss}
        data-testid="mobile-prefilled-prompt-dismiss"
        aria-label="Dismiss pre-filled prompt"
        className="absolute top-1 right-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-hb-text-muted hover:text-hb-accent transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
      >
        <X size={16} aria-hidden="true" />
      </button>
      <div className="flex flex-wrap gap-2 mb-2 pr-8" data-testid="mobile-prefilled-personality-chips">
        {CHIPS.map((c) => (
          <button
            key={c.id} type="button" onClick={() => pick(c.id)}
            data-testid={`mobile-prefilled-chip-${c.id}`}
            aria-label={`Set personality to ${c.label}`}
            className="min-h-[44px] min-w-[44px] px-2 rounded-md border border-hb-border bg-hb-surface text-base hover:bg-hb-accent/10 hover:border-hb-accent/30 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent"
          ><span aria-hidden="true">{c.emoji}</span></button>
        ))}
      </div>
      <p className="text-xs text-hb-text-muted font-mono" data-testid="mobile-prefilled-hint">
        Try: make me a site about...
      </p>
    </div>
  )
}
