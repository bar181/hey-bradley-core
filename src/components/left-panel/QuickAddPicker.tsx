import { useRef, useState } from 'react'
import {
  Star, ArrowRight, FileText, DollarSign, Layout, Zap, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import type { SectionType } from '@/lib/schemas/section'

// P48 Sprint I A4 — One-click curated section templates with hover preview.
// KISS: 6 cards, CSS-only thumbnails (no asset deps), opt-in panel above the
// existing categorized add picker (does NOT replace it).

type QuickKind = Extract<SectionType, 'hero' | 'action' | 'text' | 'blog' | 'pricing' | 'footer'>

type QuickCard = {
  type: QuickKind
  label: string
  desc: string
  icon: LucideIcon
  bucket: 'Hero & CTA' | 'Content' | 'Social Proof + Media'
}

// Mirror SectionsSection bucketing: hero/action → Hero & CTA;
// text/blog/pricing → Content; footer → Social Proof + Media.
const QUICK_CARDS: QuickCard[] = [
  { type: 'hero', label: 'Hero', icon: Star, bucket: 'Hero & CTA',
    desc: 'Big intro at the top of your site' },
  { type: 'action', label: 'Action Block', icon: ArrowRight, bucket: 'Hero & CTA',
    desc: 'Buy / signup callout' },
  { type: 'text', label: 'Text', icon: FileText, bucket: 'Content',
    desc: 'A block of text for articles or stories' },
  { type: 'blog', label: 'Blog', icon: FileText, bucket: 'Content',
    desc: 'Article cards, list, or featured layout' },
  { type: 'pricing', label: 'Pricing', icon: DollarSign, bucket: 'Content',
    desc: 'Pricing plans and tiers' },
  { type: 'footer', label: 'Footer', icon: Layout, bucket: 'Social Proof + Media',
    desc: 'Page footer with links' },
]

const BUCKETS: QuickCard['bucket'][] = ['Hero & CTA', 'Content', 'Social Proof + Media']

export function QuickAddPicker() {
  const [expanded, setExpanded] = useState(false)
  const [focusIdx, setFocusIdx] = useState(0)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleAdd = (type: QuickKind) => {
    useConfigStore.getState().addSection(type)
    setExpanded(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (QUICK_CARDS.length === 0) return
    // 2-column grid: Left/Right ±1, Up/Down ±2.
    let next = focusIdx
    if (e.key === 'ArrowRight') next = Math.min(focusIdx + 1, QUICK_CARDS.length - 1)
    else if (e.key === 'ArrowLeft') next = Math.max(focusIdx - 1, 0)
    else if (e.key === 'ArrowDown') next = Math.min(focusIdx + 2, QUICK_CARDS.length - 1)
    else if (e.key === 'ArrowUp') next = Math.max(focusIdx - 2, 0)
    else return
    e.preventDefault()
    setFocusIdx(next)
    cardRefs.current[next]?.focus()
  }

  return (
    <div className="rounded-lg border border-hb-border bg-hb-surface/50">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="quick-add-cards"
        className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-hb-text-muted hover:text-hb-text-secondary transition-colors"
        title="Quick-add curated section templates."
      >
        <ChevronRight size={12} className={cn('transition-transform', expanded && 'rotate-90')} />
        <Zap size={12} className="text-hb-accent" />
        <span className="font-medium uppercase tracking-wider">Quick add</span>
      </button>
      {expanded && (
        <div
          id="quick-add-cards"
          role="list"
          aria-label="Quick-add section templates"
          onKeyDown={handleKeyDown}
          className="grid grid-cols-2 max-sm:grid-cols-1 gap-1.5 p-2 max-h-[180px] overflow-y-auto"
        >
          {QUICK_CARDS.map((card, idx) => {
            const Icon = card.icon
            return (
              <button
                key={card.type}
                ref={(el) => { cardRefs.current[idx] = el }}
                type="button"
                role="listitem"
                aria-label={`Quick add ${card.type}`}
                tabIndex={focusIdx === idx ? 0 : -1}
                onFocus={() => setFocusIdx(idx)}
                onClick={() => handleAdd(card.type)}
                title={`Add a ${card.label} section. ${card.desc}.`}
                className={cn(
                  'group flex flex-col gap-1 p-2 rounded-md text-left',
                  'border border-hb-border bg-hb-surface',
                  'hover:scale-[1.03] hover:border-hb-accent hover:bg-hb-surface-hover',
                  'focus:outline-none focus:border-hb-accent focus:ring-1 focus:ring-hb-accent',
                  'transition-all duration-150'
                )}
                data-bucket={card.bucket}
              >
                {/* CSS-only thumbnail (no asset deps): faux block layout per type. */}
                <div className="flex items-center gap-1.5">
                  <Icon size={12} className="text-hb-accent shrink-0" />
                  <span className="text-xs font-medium text-hb-text-primary truncate">
                    {card.label}
                  </span>
                </div>
                <div
                  aria-hidden
                  className="h-5 rounded-sm bg-gradient-to-br from-hb-surface-hover to-hb-surface border border-hb-border/60 group-hover:border-hb-accent/60"
                >
                  <div className="h-1 w-2/3 bg-hb-accent/40 rounded-sm m-1" />
                </div>
                <span className="text-[10px] leading-tight text-hb-text-muted line-clamp-2">
                  {card.desc}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Exported for testing / introspection.
export const QUICK_ADD_BUCKETS = BUCKETS
