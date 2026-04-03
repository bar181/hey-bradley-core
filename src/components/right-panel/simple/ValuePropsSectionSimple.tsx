import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Hash, Sparkles, CreditCard, Palette } from 'lucide-react'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const NUMBERS_LAYOUTS = [
  { v: 'counters', label: 'Counters', Icon: Hash },
  { v: 'icons', label: 'Icons', Icon: Sparkles },
  { v: 'cards', label: 'Cards', Icon: CreditCard },
  { v: 'gradient', label: 'Gradient', Icon: Palette },
] as const

export function ValuePropsSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const currentVariant = section.variant || 'counters'

  const valueProps = section.components
    .filter((c) => c.type === 'value-prop')
    .sort((a, b) => a.order - b.order)

  const applyLayout = useCallback(
    (variant: string) => {
      setSectionConfig(sectionId, { variant })
    },
    [sectionId, setSectionConfig],
  )

  const updateProp = useCallback(
    (componentId: string, key: string, value: string) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      setSectionConfig(sectionId, {
        components: setComponentEnabled(section, componentId, checked),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      {/* ─── LAYOUT ─── */}
      <RightAccordion id={`vp-layout-${sectionId}`} label="Layout" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          {NUMBERS_LAYOUTS.map(({ v, label, Icon }) => (
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

      {/* ─── ELEMENTS ─── */}
      <RightAccordion id={`vp-elements-${sectionId}`} label="Elements">
        <div className="space-y-2">
          {valueProps.map((item, i) => (
            <div key={item.id} className="flex items-center gap-2">
              <Switch
                checked={item.enabled}
                onCheckedChange={(v) => handleToggle(item.id, v)}
                className="scale-[0.6] shrink-0"
              />
              <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                Number {i + 1}
              </span>
            </div>
          ))}
        </div>
      </RightAccordion>

      {/* ─── CONTENT ─── */}
      <RightAccordion id={`vp-content-${sectionId}`} label="Content">
        <div className="space-y-3">
          {valueProps.map((item, i) => {
            const value = (item.props?.value as string) ?? ''
            const label = (item.props?.label as string) ?? ''
            const description = (item.props?.description as string) ?? ''

            return (
              <div key={item.id} className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-1.5')}>
                <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                  Number {i + 1}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateProp(item.id, 'value', e.target.value)}
                  placeholder="e.g. 500+"
                  data-testid={`valueprop-value-input-${i}`}
                  className={INPUT}
                />
                <input
                  type="text"
                  value={label}
                  onChange={(e) => updateProp(item.id, 'label', e.target.value)}
                  placeholder="Label, e.g. Teams"
                  data-testid={`valueprop-label-input-${i}`}
                  className={INPUT}
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => updateProp(item.id, 'description', e.target.value)}
                  placeholder="Brief description"
                  data-testid={`valueprop-description-input-${i}`}
                  className={INPUT}
                />
              </div>
            )
          })}
        </div>
      </RightAccordion>
    </div>
  )
}
