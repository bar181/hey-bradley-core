import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps } from '@/lib/componentHelpers'
import { AlignCenter, Columns2, PanelRight } from 'lucide-react'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const TEXT_LAYOUTS = [
  { v: 'single', label: 'Single', Icon: AlignCenter },
  { v: 'two-column', label: 'Two Column', Icon: Columns2 },
  { v: 'sidebar', label: 'Sidebar', Icon: PanelRight },
] as const

export function TextSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const currentVariant = section.variant || 'single'
  const comp = section.components.find((c) => c.id === 'content')
  const heading = (comp?.props?.heading as string) ?? ''
  const body = (comp?.props?.body as string) ?? ''
  const sidebar = (comp?.props?.sidebar as string) ?? ''

  const applyLayout = useCallback(
    (variant: string) => {
      setSectionConfig(sectionId, { variant })
    },
    [sectionId, setSectionConfig],
  )

  const updateProp = useCallback(
    (key: string, value: string) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, 'content', { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      <RightAccordion id={`text-layout-${sectionId}`} label="Layout" defaultOpen>
        <div className="grid grid-cols-3 gap-2">
          {TEXT_LAYOUTS.map(({ v, label, Icon }) => (
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

      <RightAccordion id={`text-content-${sectionId}`} label="Content" defaultOpen>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Heading</span>
            <input
              type="text"
              value={heading}
              onChange={(e) => updateProp('heading', e.target.value)}
              placeholder="e.g. About Us"
              className={INPUT}
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Body</span>
            <textarea
              value={body}
              onChange={(e) => updateProp('body', e.target.value)}
              rows={5}
              placeholder="Write your content here..."
              className={cn(INPUT, 'resize-none leading-snug')}
            />
          </div>
          {currentVariant === 'sidebar' && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Sidebar</span>
              <textarea
                value={sidebar}
                onChange={(e) => updateProp('sidebar', e.target.value)}
                rows={3}
                placeholder="Sidebar content..."
                className={cn(INPUT, 'resize-none leading-snug')}
              />
            </div>
          )}
        </div>
      </RightAccordion>
    </div>
  )
}
