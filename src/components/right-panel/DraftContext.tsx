import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const layoutOptions = [
  { icon: AlignLeft, selected: false },
  { icon: AlignCenter, selected: true },
  { icon: AlignRight, selected: false },
]

export function DraftContext() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-hb-text-primary font-semibold">
          HERO
        </span>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Headline input */}
        <div>
          <label className="font-mono text-[11px] uppercase text-hb-text-muted mb-1 block">
            Headline
          </label>
          <input
            type="text"
            defaultValue="Build with voice."
            className="w-full px-3 py-2 bg-hb-surface border border-hb-border rounded-md font-ui text-sm text-hb-text-primary"
          />
        </div>

        {/* Layout selector */}
        <div>
          <label className="font-mono text-[11px] uppercase text-hb-text-muted mb-1 block">
            Layout
          </label>
          <div className="flex gap-2">
            {layoutOptions.map(({ icon: Icon, selected }, i) => (
              <div
                key={i}
                className={cn(
                  'w-16 h-12 rounded border flex items-center justify-center cursor-pointer transition-colors',
                  selected
                    ? 'border-hb-accent bg-hb-accent-light'
                    : 'border-hb-border hover:border-hb-accent'
                )}
              >
                <Icon size={16} className="text-hb-text-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* More options link */}
        <a
          href="#"
          className="text-xs text-hb-accent hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          More options &rarr;
        </a>
      </div>
    </div>
  )
}
