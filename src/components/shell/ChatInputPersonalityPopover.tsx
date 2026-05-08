/**
 * P67 / Polish Wave 2 / A1 — ChatInputPersonalityPopover
 *
 * Inline mini personality picker that lives in the ChatInput header pill row.
 * Extracted from ChatInput.tsx (was lines 610-621) and enhanced with a smooth
 * fade-in transition (transition-opacity duration-150) folded in from A4 scope
 * per preflight collision-resolution.
 *
 * The full-fidelity picker still lives in `src/components/settings/PersonalityPicker.tsx`
 * — this is a smaller chip-anchored affordance for in-flow switching.
 *
 * No new dependencies; Tailwind only; outside-click handler self-contained.
 */
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import {
  PERSONALITY_IDS,
  PERSONALITY_PROFILES,
  type PersonalityId,
} from '@/contexts/intelligence/personality/personalityEngine'

export function ChatInputPersonalityPopover() {
  const personalityId = useIntelligenceStore((s) => s.personalityId)
  const setPersonality = useIntelligenceStore((s) => s.setPersonality)
  const personalityProfile: { label: string; emoji?: string } | null =
    personalityId ? PERSONALITY_PROFILES[personalityId] : null

  const [open, setOpen] = useState(false)
  // Drives the fade-in: we render with opacity-0 on first frame, then flip to
  // opacity-100 on the next tick. Tailwind transition-opacity does the rest.
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Outside-click closes the popover (preserved from the original behaviour).
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Trigger the fade-in by toggling `visible` on the next frame after `open`
  // flips true. When closing, snap visibility off immediately so the unmount
  // doesn't leave a phantom frame.
  useEffect(() => {
    if (!open) {
      setVisible(false)
      return
    }
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [open])

  if (!personalityProfile) return null

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        data-testid="chat-active-personality-chip"
        data-personality-id={personalityId ?? undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change personality (active: ${personalityProfile.label})`}
        onClick={() => setOpen((v) => !v)}
        title={`Change personality (active: ${personalityProfile.label})`}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-hb-accent/10 text-hb-accent border border-hb-accent/30 hover:bg-hb-accent/20 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:outline-none"
      >
        <span>
          {personalityProfile.emoji ? `${personalityProfile.emoji} ` : ''}
          {personalityProfile.label.split(' ')[0]}
        </span>
        <span aria-hidden className="text-[8px] leading-none">
          ▾
        </span>
      </button>
      {open && (
        <div
          data-testid="chat-personality-popover"
          role="menu"
          className={cn(
            'absolute bottom-full left-0 mb-1 z-30 flex flex-row gap-1 p-1.5 rounded-md bg-hb-bg border border-hb-border shadow-lg whitespace-nowrap',
            'transition-opacity duration-150',
            visible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {PERSONALITY_IDS.map((id: PersonalityId) => {
            const p = PERSONALITY_PROFILES[id]
            const isActive = id === personalityId
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                data-testid={`chat-personality-popover-${id}`}
                onClick={() => {
                  setPersonality(id)
                  setOpen(false)
                }}
                className={cn(
                  'px-2 py-1 rounded text-[10px] uppercase tracking-wider border transition-colors',
                  isActive
                    ? 'border-hb-accent ring-1 ring-hb-accent/40 bg-hb-accent/10 text-hb-accent'
                    : 'border-hb-border bg-hb-surface text-hb-text-secondary hover:border-hb-accent/60 hover:text-hb-accent'
                )}
              >
                {p.emoji ? `${p.emoji} ` : ''}
                {p.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
