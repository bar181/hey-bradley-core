/**
 * Sprint J Wave 2 (P51 / A4) — PersonalityPicker.
 *
 * 5-card grid surfacing the active personality + a deterministic live-preview
 * computed via `renderPersonalityMessage`. Pure UI: reads + writes the
 * intelligence-store personality slice; never touches the engine, the chat
 * pipeline, or any Σ. ADR-073 composition pattern stays intact (composition,
 * never widening).
 *
 * - 2-col grid (sm: 1-col fallback).
 * - role="radiogroup" + role="radio" with aria-checked for SR support.
 * - Arrow-key nav mirrors the P48 QuickAddPicker grid pattern: ←/→ ±1, ↑/↓ ±2.
 * - Live preview computed off a synthetic envelope + intent trace; truncated
 *   to ≈120 chars so the cards stay tight in the drawer.
 *
 * NO new deps. KISS — the engine owns rendering; this component is dumb.
 */

import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import {
  PERSONALITY_IDS,
  PERSONALITY_PROFILES,
  renderPersonalityMessage,
  type PersonalityId,
} from '@/contexts/intelligence/personality/personalityEngine'
import type { ClassifiedIntent } from '@/contexts/intelligence/aisp/intentAtom'

const PREVIEW_MAX = 120

const SAMPLE_ENVELOPE = {
  patches: [{ op: 'replace', path: '/theme/accent', value: '#ff6b35' }],
  summary: 'Updated theme accent',
} as const

const SAMPLE_INTENT: { intent: ClassifiedIntent } = {
  intent: {
    verb: 'change',
    target: { type: 'theme', index: null },
    confidence: 0.92,
    rationale: 'sample preview intent',
  },
}

function previewFor(id: PersonalityId): string {
  const raw = renderPersonalityMessage(SAMPLE_ENVELOPE, id, SAMPLE_INTENT)
  if (raw.length <= PREVIEW_MAX) return raw
  return raw.slice(0, PREVIEW_MAX - 1).trimEnd() + '…'
}

export function PersonalityPicker() {
  const active = useIntelligenceStore((s) => s.personalityId)
  const setPersonality = useIntelligenceStore((s) => s.setPersonality)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const initialFocus = Math.max(
    0,
    PERSONALITY_IDS.findIndex((id) => id === active),
  )
  const [focusIdx, setFocusIdx] = useState(initialFocus)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (PERSONALITY_IDS.length === 0) return
    let next = focusIdx
    if (e.key === 'ArrowRight') next = Math.min(focusIdx + 1, PERSONALITY_IDS.length - 1)
    else if (e.key === 'ArrowLeft') next = Math.max(focusIdx - 1, 0)
    else if (e.key === 'ArrowDown') next = Math.min(focusIdx + 2, PERSONALITY_IDS.length - 1)
    else if (e.key === 'ArrowUp') next = Math.max(focusIdx - 2, 0)
    else return
    e.preventDefault()
    setFocusIdx(next)
    cardRefs.current[next]?.focus()
  }

  return (
    <div
      data-testid="personality-picker"
      role="radiogroup"
      aria-label="Personality"
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 max-sm:grid-cols-1 gap-2"
    >
      {PERSONALITY_IDS.map((id, idx) => {
        const profile = PERSONALITY_PROFILES[id]
        const isActive = id === active
        const preview = previewFor(id)
        return (
          <button
            key={id}
            ref={(el) => { cardRefs.current[idx] = el }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-pressed={isActive}
            aria-label={`${profile.label} personality`}
            tabIndex={isActive || (active == null && idx === 0) ? 0 : -1}
            onFocus={() => setFocusIdx(idx)}
            onClick={() => setPersonality(id)}
            data-testid={`personality-card-${id}`}
            data-personality-id={id}
            className={cn(
              'flex flex-col gap-1 p-2.5 rounded-md text-left',
              'border bg-hb-surface transition-all duration-150',
              'focus:outline-none focus:ring-1 focus:ring-hb-accent',
              isActive
                ? 'border-hb-accent ring-1 ring-hb-accent/40 bg-hb-accent/5'
                : 'border-hb-border hover:border-hb-accent/60 hover:bg-hb-surface-hover',
            )}
          >
            <div className="flex items-center gap-1.5">
              {profile.emoji && (
                <span aria-hidden className="text-sm leading-none">{profile.emoji}</span>
              )}
              <span className="text-xs font-medium uppercase tracking-wider text-hb-text-primary">
                {profile.label}
              </span>
            </div>
            <span className="text-[11px] leading-tight text-hb-text-muted line-clamp-2">
              {profile.description}
            </span>
            <div
              aria-hidden
              className="mt-1 px-1.5 py-1 rounded-sm border border-hb-border/60 bg-hb-bg/40 text-[10px] leading-tight text-hb-text-secondary italic line-clamp-3"
            >
              <span className="not-italic text-hb-text-muted">If you said: </span>
              <span className="not-italic text-hb-text-secondary">"make it brighter"</span>
              <span className="not-italic text-hb-text-muted"> I'd reply: </span>
              <span>"{preview}"</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
