import { useRef, useState } from 'react'
import {
  Star, ArrowRight, FileText, DollarSign, Layout, Zap, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { tokens } from '@/styles/design-tokens'
import type { SectionType } from '@/lib/schemas/section'

// P48 Sprint I A4 — One-click curated section templates with hover preview.
// KISS: 6 cards, CSS-only thumbnails (no asset deps), opt-in panel above the
// existing categorized add picker (does NOT replace it).
//
// P66 / Polish Sprint / Wave 1 / A5 — preview thumbnails per section type
// land here as a reusable <SectionThumbnail type=...> helper. Helper supports
// all 16 SectionType values so non-quick-add surfaces can reuse it later
// without a new file. Card padding + radius wired to design-tokens (ADR-087);
// hover-lift class added per ADR-091 canonical card pattern.

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

/**
 * <SectionThumbnail> — pure-CSS preview block evoking each section type.
 *
 * No asset deps; visually distinct per type so users can recognize a section
 * shape at a glance. All 16 SectionType cases are covered; falls back to a
 * neutral block for any future additions. The thumbnail renders inside a
 * fixed-height container; callers control outer width.
 */
export function SectionThumbnail({ type }: { type: SectionType }) {
  // Common atomic styles — re-used by sub-shapes below.
  const block = 'rounded-[3px] bg-hb-accent/40'
  const muted = 'rounded-[3px] bg-hb-text-muted/30'
  const button = 'rounded-[3px] bg-hb-accent/70'
  const frame =
    'h-7 rounded-sm bg-gradient-to-br from-hb-surface-hover to-hb-surface border border-hb-border/60 group-hover:border-hb-accent/60 overflow-hidden'

  switch (type) {
    case 'hero':
      // Gradient bar + headline line + 2 small buttons.
      return (
        <div aria-hidden className={frame}>
          <div className="flex flex-col gap-1 p-1">
            <div className={cn(block, 'h-1 w-1/2')} />
            <div className={cn(muted, 'h-0.5 w-2/3')} />
            <div className="flex gap-1">
              <div className={cn(button, 'h-1 w-3')} />
              <div className={cn(muted, 'h-1 w-3')} />
            </div>
          </div>
        </div>
      )
    case 'menu':
      // Top nav: logo dot + 3 link bars.
      return (
        <div aria-hidden className={frame}>
          <div className="flex items-center gap-1 p-1">
            <div className={cn(block, 'h-1.5 w-1.5 rounded-full')} />
            <div className="flex-1" />
            <div className={cn(muted, 'h-0.5 w-2')} />
            <div className={cn(muted, 'h-0.5 w-2')} />
            <div className={cn(muted, 'h-0.5 w-2')} />
          </div>
        </div>
      )
    case 'columns':
      // 3 small feature cards in a row.
      return (
        <div aria-hidden className={frame}>
          <div className="grid grid-cols-3 gap-0.5 p-1 h-full">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-0.5 bg-white/30 rounded-[2px] p-0.5">
                <div className={cn(block, 'h-0.5 w-full')} />
                <div className={cn(muted, 'h-0.5 w-2/3')} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'pricing':
      // 3 tier cards with one elevated.
      return (
        <div aria-hidden className={frame}>
          <div className="grid grid-cols-3 gap-0.5 p-1 h-full items-end">
            <div className="bg-white/30 rounded-[2px] h-3" />
            <div className="bg-hb-accent/30 rounded-[2px] h-4" />
            <div className="bg-white/30 rounded-[2px] h-3" />
          </div>
        </div>
      )
    case 'action':
      // Single rectangle with text-line + button (CTA).
      return (
        <div aria-hidden className={frame}>
          <div className="flex items-center justify-between p-1 h-full">
            <div className="flex flex-col gap-0.5">
              <div className={cn(block, 'h-1 w-6')} />
              <div className={cn(muted, 'h-0.5 w-4')} />
            </div>
            <div className={cn(button, 'h-2 w-3')} />
          </div>
        </div>
      )
    case 'footer':
      // 4 small column groups + bottom copyright bar.
      return (
        <div aria-hidden className={frame}>
          <div className="grid grid-cols-4 gap-0.5 p-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className={cn(block, 'h-0.5 w-2/3')} />
                <div className={cn(muted, 'h-0.5 w-full')} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'quotes':
      // Quote card with avatar circle + quote lines.
      return (
        <div aria-hidden className={frame}>
          <div className="flex items-center gap-1 p-1 h-full">
            <div className={cn(block, 'h-3 w-3 rounded-full shrink-0')} />
            <div className="flex flex-col gap-0.5 flex-1">
              <div className={cn(muted, 'h-0.5 w-full')} />
              <div className={cn(muted, 'h-0.5 w-3/4')} />
              <div className={cn(block, 'h-0.5 w-1/3')} />
            </div>
          </div>
        </div>
      )
    case 'questions':
      // FAQ stack: 3 collapsed rows.
      return (
        <div aria-hidden className={frame}>
          <div className="flex flex-col gap-0.5 p-1">
            <div className="flex items-center justify-between bg-white/40 rounded-[2px] px-0.5 py-0.5">
              <div className={cn(block, 'h-0.5 w-3/5')} />
              <div className={cn(muted, 'h-0.5 w-1')} />
            </div>
            <div className="flex items-center justify-between bg-white/40 rounded-[2px] px-0.5 py-0.5">
              <div className={cn(muted, 'h-0.5 w-2/3')} />
              <div className={cn(muted, 'h-0.5 w-1')} />
            </div>
            <div className="flex items-center justify-between bg-white/40 rounded-[2px] px-0.5 py-0.5">
              <div className={cn(muted, 'h-0.5 w-1/2')} />
              <div className={cn(muted, 'h-0.5 w-1')} />
            </div>
          </div>
        </div>
      )
    case 'numbers':
      // Stat row: 4 big-number columns.
      return (
        <div aria-hidden className={frame}>
          <div className="grid grid-cols-4 gap-0.5 p-1 h-full place-items-center">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className={cn(block, 'h-1.5 w-2')} />
                <div className={cn(muted, 'h-0.5 w-2')} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'gallery':
      // 2x3 image grid.
      return (
        <div aria-hidden className={frame}>
          <div className="grid grid-cols-3 gap-0.5 p-1 h-full">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white/40 rounded-[2px]" />
            ))}
          </div>
        </div>
      )
    case 'logos':
      // Logo strip: 5 small mark blocks.
      return (
        <div aria-hidden className={frame}>
          <div className="flex items-center justify-between gap-0.5 p-1 h-full">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={cn(muted, 'h-1.5 w-3 rounded-[2px]')} />
            ))}
          </div>
        </div>
      )
    case 'team':
      // 4 avatar circles in a row.
      return (
        <div aria-hidden className={frame}>
          <div className="flex items-center gap-1 p-1 h-full justify-around">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className={cn(block, 'h-2 w-2 rounded-full')} />
                <div className={cn(muted, 'h-0.5 w-2')} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'image':
      // Single image with subtle frame.
      return (
        <div aria-hidden className={frame}>
          <div className="p-1 h-full">
            <div className="bg-white/50 rounded-[2px] h-full w-full flex items-center justify-center">
              <div className={cn(muted, 'h-1.5 w-1.5 rounded-full')} />
            </div>
          </div>
        </div>
      )
    case 'divider':
      // Horizontal rule.
      return (
        <div aria-hidden className={frame}>
          <div className="flex items-center justify-center h-full px-1">
            <div className="h-px w-full bg-hb-text-muted/40" />
          </div>
        </div>
      )
    case 'text':
      // Paragraph: 4 muted lines.
      return (
        <div aria-hidden className={frame}>
          <div className="flex flex-col gap-0.5 p-1">
            <div className={cn(muted, 'h-0.5 w-full')} />
            <div className={cn(muted, 'h-0.5 w-11/12')} />
            <div className={cn(muted, 'h-0.5 w-10/12')} />
            <div className={cn(muted, 'h-0.5 w-2/3')} />
          </div>
        </div>
      )
    case 'blog':
      // 2 article cards (image + lines).
      return (
        <div aria-hidden className={frame}>
          <div className="grid grid-cols-2 gap-0.5 p-1 h-full">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-0.5 bg-white/30 rounded-[2px] p-0.5">
                <div className="bg-white/60 rounded-[1px] h-2" />
                <div className={cn(block, 'h-0.5 w-3/4')} />
                <div className={cn(muted, 'h-0.5 w-full')} />
              </div>
            ))}
          </div>
        </div>
      )
    default:
      // Future-proof neutral block for unknown SectionType additions.
      return (
        <div aria-hidden className={frame}>
          <div className="h-1 w-2/3 bg-hb-accent/40 rounded-sm m-1" />
        </div>
      )
  }
}

export function QuickAddPicker() {
  const [expanded, setExpanded] = useState(false)
  const [focusIdx, setFocusIdx] = useState(0)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  // P67 / Wave 2 / A2 — empty-state nudge when no sections exist yet.
  // Reads section count off the live config so the message appears the
  // first time the user opens an empty project, then disappears the
  // moment a section is added.
  const sectionCount = useConfigStore((s) => s.config.sections.length)

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

  // Token-derived card radius (ADR-087).
  const cardRadius = tokens.radius.md

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
      {expanded && sectionCount === 0 && (
        <p
          data-testid="quick-add-empty-state"
          className="px-3 pt-1 pb-0.5 text-[11px] text-[#6b5e4f] leading-snug"
        >
          Tap a section to start
        </p>
      )}
      {expanded && (
        <div
          id="quick-add-cards"
          role="list"
          aria-label="Quick-add section templates"
          onKeyDown={handleKeyDown}
          className="grid grid-cols-2 max-sm:grid-cols-1 gap-1.5 p-2 max-h-[260px] overflow-y-auto"
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
                style={{ borderRadius: cardRadius, padding: '8px' }}
                className={cn(
                  'group flex flex-col gap-1 text-left',
                  'border border-hb-border bg-hb-surface',
                  // ADR-091 canonical card hover-lift via translate.
                  'hover:-translate-y-1 hover:border-hb-accent hover:bg-hb-surface-hover hover:shadow-sm',
                  'focus:outline-none focus:border-hb-accent focus:ring-1 focus:ring-hb-accent',
                  'transition-all duration-150'
                )}
                data-bucket={card.bucket}
                data-testid={`quick-add-${card.type}`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon size={12} className="text-hb-accent shrink-0" />
                  <span className="text-xs font-medium text-hb-text-primary truncate">
                    {card.label}
                  </span>
                </div>
                {/* Per-type CSS thumbnail (no asset deps). */}
                <SectionThumbnail type={card.type} />
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
