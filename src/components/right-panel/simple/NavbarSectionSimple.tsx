import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

export function NavbarSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const getComp = (id: string) => section.components.find((c) => c.id === id)
  const logoText = (getComp('logo')?.props?.text as string) ?? ''
  const ctaText = (getComp('cta')?.props?.text as string) ?? ''
  const ctaEnabled = getComp('cta')?.enabled ?? true

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
      {/* ─── ELEMENTS ─── */}
      <RightAccordion id={`navbar-elements-${sectionId}`} label="Show / Hide">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch checked onCheckedChange={() => {}} className="scale-[0.6] shrink-0 opacity-50" />
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Logo Text</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={ctaEnabled}
              onCheckedChange={(v) => handleToggle('cta', v)}
              className="scale-[0.6] shrink-0"
            />
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Action Button</span>
          </div>
        </div>
      </RightAccordion>

      {/* ─── CONTENT ─── */}
      <RightAccordion id={`navbar-content-${sectionId}`} label="Content">
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Logo Text</span>
            <input
              type="text"
              value={logoText}
              onChange={(e) => updateProp('logo', 'text', e.target.value)}
              placeholder="e.g. Hey Bradley"
              data-testid="navbar-logo-input"
              className={INPUT}
            />
          </div>

          <div className={cn(!ctaEnabled && 'opacity-25 pointer-events-none', 'space-y-1')}>
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Action Button</span>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => updateProp('cta', 'text', e.target.value)}
              placeholder="e.g. Get Started"
              data-testid="navbar-cta-input"
              className={INPUT}
            />
          </div>

          <div className="text-xs text-hb-text-muted">
            Menu links are created automatically from your sections.
          </div>
        </div>
      </RightAccordion>
    </div>
  )
}
