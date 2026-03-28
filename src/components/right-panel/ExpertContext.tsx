import {
  Settings,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'

const directionButtons = [
  { icon: ArrowUp },
  { icon: ArrowDown },
  { icon: ArrowLeft },
  { icon: ArrowRight },
]

const alignButtons = [
  { icon: AlignLeft },
  { icon: AlignCenter },
  { icon: AlignRight },
]

export function ExpertContext() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-muted font-medium">
          HERO SECTION
        </span>
        <Settings size={14} className="text-hb-text-muted" />
      </div>

      {/* Layout section */}
      <div className="border-b border-hb-border pb-2">
        <div className="flex justify-between items-center px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
            DIRECTION
          </span>
          <div className="flex gap-0.5">
            {directionButtons.map(({ icon: Icon }, i) => (
              <button
                key={i}
                type="button"
                className="flex items-center justify-center w-6 h-6 border border-hb-border rounded text-hb-text-primary hover:border-hb-accent transition-colors"
              >
                <Icon size={12} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
            ALIGN
          </span>
          <div className="flex gap-0.5">
            {alignButtons.map(({ icon: Icon }, i) => (
              <button
                key={i}
                type="button"
                className="flex items-center justify-center w-6 h-6 border border-hb-border rounded text-hb-text-primary hover:border-hb-accent transition-colors"
              >
                <Icon size={12} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
            PADDING
          </span>
          <input
            type="text"
            defaultValue="64px"
            className="w-16 font-mono text-xs text-hb-text-primary bg-hb-surface border border-hb-border rounded px-1.5 py-0.5 text-right"
          />
        </div>

        <div className="flex justify-between items-center px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
            GAP
          </span>
          <input
            type="text"
            defaultValue="24px"
            className="w-16 font-mono text-xs text-hb-text-primary bg-hb-surface border border-hb-border rounded px-1.5 py-0.5 text-right"
          />
        </div>
      </div>

      {/* Content section */}
      <div className="border-b border-hb-border pb-2">
        <div className="px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted block mb-1">
            HEADLINE
          </span>
          <textarea
            defaultValue="Build with voice."
            className="w-full font-ui text-sm text-hb-text-primary bg-hb-surface border border-hb-border rounded-md px-2 py-1.5 h-16 resize-none"
          />
        </div>

        <div className="px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted block mb-1">
            SUBTITLE
          </span>
          <textarea
            defaultValue="Ship in minutes."
            className="w-full font-ui text-sm text-hb-text-primary bg-hb-surface border border-hb-border rounded-md px-2 py-1.5 h-16 resize-none"
          />
        </div>

        <div className="flex justify-between items-center px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
            SHOW SUBTITLE
          </span>
          <input
            type="checkbox"
            defaultChecked
            className="accent-hb-accent"
          />
        </div>
      </div>

      {/* Style section */}
      <div className="pb-2">
        <div className="flex justify-between items-center px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
            BACKGROUND
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#faf8f5] border border-hb-border" />
            <span className="font-mono text-xs text-hb-text-primary">
              var(--bg)
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
            TEXT COLOR
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#2d1f12] border border-hb-border" />
            <span className="font-mono text-xs text-hb-text-primary">
              var(--text)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
