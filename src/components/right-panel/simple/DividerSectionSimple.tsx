import { useCallback, useState } from 'react'
import { cn } from '@/lib/cn'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { Minus, Space, Sparkles, ChevronDown, ChevronRight } from 'lucide-react'

const DIVIDER_LAYOUTS = [
  { v: 'line', label: 'Line', Icon: Minus },
  { v: 'space', label: 'Space', Icon: Space },
  { v: 'decorative', label: 'Decorative', Icon: Sparkles },
] as const

const SIZE_OPTIONS = [
  { v: 'sm', label: 'Small' },
  { v: 'md', label: 'Medium' },
  { v: 'lg', label: 'Large' },
  { v: 'xl', label: 'Extra Large' },
]

export function DividerSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const section = config.sections.find((s) => s.id === sectionId)
  // P67 / Wave 2 / A2 — collapse-by-default; auto-expand the active section.
  const isActive =
    selectedContext?.type === 'section' && selectedContext.sectionId === sectionId
  const [expanded, setExpanded] = useState<boolean>(isActive)

  if (!section) return null

  const currentVariant = section.variant || 'line'
  const currentSize = (section.layout as Record<string, unknown>).size as string || 'md'

  const applyLayout = useCallback(
    (variant: string) => {
      setSectionConfig(sectionId, { variant })
    },
    [sectionId, setSectionConfig],
  )

  const applySize = useCallback(
    (size: string) => {
      setSectionConfig(sectionId, { layout: { ...section.layout, size } })
    },
    [sectionId, section, setSectionConfig],
  )

  return (
    <div data-section-id={sectionId} className="transition-all duration-200 ease-out">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`section-body-${sectionId}`}
        data-testid="section-editor-collapse-toggle"
        className={cn(
          'flex items-center justify-between w-full px-2 py-2 mb-1 rounded-md',
          'border border-hb-border/40 bg-hb-surface/40',
          'hover:bg-hb-surface-hover transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent'
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted font-medium">Section</span>
          <span className="text-xs font-semibold text-hb-text-primary capitalize">{section.type}</span>
          {isActive && (
            <span className="text-[9px] uppercase tracking-wider text-hb-accent font-medium">· active</span>
          )}
        </span>
        {expanded ? <ChevronDown size={14} className="text-hb-text-muted" /> : <ChevronRight size={14} className="text-hb-text-muted" />}
      </button>
      {expanded && (
      <div id={`section-body-${sectionId}`} className="divide-y divide-hb-border/30">
      <RightAccordion id={`divider-layout-${sectionId}`} label="Style">
        <div className="grid grid-cols-3 gap-2">
          {DIVIDER_LAYOUTS.map(({ v, label, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => applyLayout(v)}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 h-16 rounded-lg transition-all',
                currentVariant === v
                  ? 'border-2 border-hb-accent bg-hb-accent/5'
                  : 'border border-hb-border/40 hover:border-hb-accent/30',
              )}
            >
              <Icon size={18} className={currentVariant === v ? 'text-hb-accent' : 'text-hb-text-muted'} />
              <span className={cn('text-xs font-medium', currentVariant === v ? 'text-hb-accent' : 'text-hb-text-primary')}>{label}</span>
            </button>
          ))}
        </div>
      </RightAccordion>

      {currentVariant === 'space' && (
        <RightAccordion id={`divider-size-${sectionId}`} label="Size" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            {SIZE_OPTIONS.map(({ v, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => applySize(v)}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  currentSize === v
                    ? 'border-2 border-hb-accent bg-hb-accent/5 text-hb-accent'
                    : 'border border-hb-border/40 hover:border-hb-accent/30 text-hb-text-primary',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </RightAccordion>
      )}
      </div>
      )}
    </div>
  )
}
