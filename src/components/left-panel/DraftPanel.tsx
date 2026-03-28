import { ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

const vibes = [
  { name: 'Warm', dots: ['#e8772e', '#c44a3a', '#d4a12e'], selected: true },
  { name: 'Ocean', dots: ['#3b82f6', '#6366f1', '#2563eb'], selected: false },
  { name: 'Forest', dots: ['#22c55e', '#16a34a', '#4ade80'], selected: false },
]

const sections = ['Hero Section', 'Features', 'Call to Action']

export function DraftPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-muted font-medium">
          DRAFT BUILDER
        </span>
      </div>

      {/* Vibe picker */}
      <div className="px-4 pb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-muted font-medium block mb-2">
          Pick a vibe
        </span>
        <div className="flex flex-col gap-2">
          {vibes.map((vibe) => (
            <div
              key={vibe.name}
              className={cn(
                'rounded-lg border p-3 cursor-pointer transition-colors',
                vibe.selected
                  ? 'border-hb-accent bg-hb-accent-light'
                  : 'border-hb-border hover:border-hb-accent'
              )}
            >
              <div className="flex gap-1.5 mb-1.5">
                {vibe.dots.map((color, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-hb-text-primary">
                {vibe.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 pb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-muted font-medium block mb-2">
          Your Sections
        </span>
        <div className="flex flex-col">
          {sections.map((section, i) => (
            <div
              key={section}
              className="flex items-center gap-2 py-2 px-3 rounded-md text-sm text-hb-text-primary hover:bg-hb-surface-hover cursor-pointer"
            >
              <span className="flex-1">
                {i + 1}. {section}
              </span>
              <ChevronRight size={14} className="text-hb-text-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Add section */}
      <div className="px-4">
        <button
          type="button"
          className="flex items-center gap-1.5 text-hb-text-secondary text-sm hover:text-hb-accent transition-colors"
        >
          <Plus size={14} />
          Add Section
        </button>
      </div>
    </div>
  )
}
