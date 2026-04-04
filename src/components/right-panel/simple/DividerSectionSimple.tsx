import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { Minus, Space, Sparkles } from 'lucide-react'

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
  const section = config.sections.find((s) => s.id === sectionId)

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
    <div className="divide-y divide-hb-border/30">
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
  )
}
