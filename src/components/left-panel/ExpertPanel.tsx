import { Settings, ChevronDown, ChevronRight } from 'lucide-react'

const layoutProperties = [
  { label: 'DISPLAY', value: 'flex' },
  { label: 'DIRECTION', value: 'column' },
  { label: 'ALIGN', value: 'center' },
  { label: 'GAP', value: '24px' },
  { label: 'PADDING', value: '64px' },
]

const collapsedSections = ['CONTENT', 'STYLE', 'SECTIONS']

export function ExpertPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-muted font-medium">
          EXPERT EDITOR
        </span>
        <Settings size={14} className="text-hb-text-muted" />
      </div>

      {/* LAYOUT section (expanded) */}
      <div className="border-b border-hb-border">
        <div className="flex items-center gap-1.5 py-2 px-4 border-b border-hb-border cursor-pointer">
          <ChevronDown size={12} className="text-hb-text-secondary" />
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-secondary font-medium">
            LAYOUT
          </span>
        </div>
        <div className="flex flex-col gap-1 py-1">
          {layoutProperties.map((prop) => (
            <div
              key={prop.label}
              className="flex justify-between items-center px-4 py-1"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-hb-text-muted">
                {prop.label}
              </span>
              <span className="font-mono text-[12px] text-hb-text-primary text-right font-medium">
                {prop.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsed sections */}
      {collapsedSections.map((section) => (
        <div
          key={section}
          className="flex items-center gap-1.5 py-2 px-4 border-b border-hb-border cursor-pointer"
        >
          <ChevronRight size={12} className="text-hb-text-secondary" />
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-secondary font-medium">
            {section}
          </span>
        </div>
      ))}
    </div>
  )
}
