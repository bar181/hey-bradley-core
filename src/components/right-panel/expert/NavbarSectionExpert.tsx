import { Toggle } from '@/components/shared/Toggle'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { setComponentEnabled } from '@/lib/componentHelpers'

interface NavbarSectionExpertProps {
  sectionId: string
}

export function NavbarSectionExpert({ sectionId }: NavbarSectionExpertProps) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const getComp = (id: string) => section.components.find((c) => c.id === id)
  const logoEnabled = getComp('logo')?.enabled ?? true
  const ctaEnabled = getComp('cta')?.enabled ?? true
  const sticky = (section.layout as Record<string, unknown>)?.sticky as boolean ?? true

  const setToggle = (componentId: string, val: boolean) => {
    setSectionConfig(sectionId, {
      components: setComponentEnabled(section, componentId, val),
    })
  }

  const setSticky = (val: boolean) => {
    const layout = (section.layout ?? {}) as Record<string, unknown>
    setSectionConfig(sectionId, { layout: { ...layout, sticky: val } })
  }

  const components = [
    { label: 'Logo Text', enabled: logoEnabled, onChange: (v: boolean) => setToggle('logo', v) },
    { label: 'Action Button', enabled: ctaEnabled, onChange: (v: boolean) => setToggle('cta', v) },
  ]

  return (
    <div>
      <RightAccordion id="navbar-components" label="Components" defaultOpen>
        <div>
          {components.map((comp, i) => (
            <div
              key={comp.label}
              className={`py-2 ${i < components.length - 1 ? 'border-b border-hb-border' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-hb-text-primary">{comp.label}</span>
                <Toggle enabled={comp.enabled} onChange={comp.onChange} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </RightAccordion>

      <RightAccordion id="navbar-layout" label="Layout">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-hb-text-muted">
              STICKY
            </span>
            <Toggle enabled={sticky} onChange={setSticky} size="sm" />
          </div>
          <div className="text-xs text-hb-text-muted">
            When enabled, the navbar stays fixed at the top while scrolling.
          </div>
        </div>
      </RightAccordion>
    </div>
  )
}
