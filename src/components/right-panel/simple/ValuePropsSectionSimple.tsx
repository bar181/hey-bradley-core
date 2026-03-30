import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

export function ValuePropsSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const valueProps = section.components
    .filter((c) => c.type === 'value-prop')
    .sort((a, b) => a.order - b.order)

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
      <RightAccordion id={`vp-content-${sectionId}`} label="Content" defaultOpen>
        <div className="space-y-3">
          {valueProps.map((item, i) => {
            const value = (item.props?.value as string) ?? ''
            const label = (item.props?.label as string) ?? ''
            const description = (item.props?.description as string) ?? ''

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(v) => handleToggle(item.id, v)}
                    className="scale-[0.6] shrink-0"
                  />
                  <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                    Stat {i + 1}
                  </span>
                </div>
                <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-1.5')}>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateProp(item.id, 'value', e.target.value)}
                    placeholder="e.g. 500+"
                    className={INPUT}
                  />
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => updateProp(item.id, 'label', e.target.value)}
                    placeholder="Label, e.g. Teams"
                    className={INPUT}
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => updateProp(item.id, 'description', e.target.value)}
                    placeholder="Brief description"
                    className={INPUT}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </RightAccordion>
    </div>
  )
}
