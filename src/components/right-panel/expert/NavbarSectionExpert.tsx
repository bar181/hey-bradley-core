import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Toggle } from '@/components/shared/Toggle'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { setComponentEnabled } from '@/lib/componentHelpers'
import { tokens } from '@/styles/design-tokens'

interface NavbarSectionExpertProps {
  sectionId: string
}

export function NavbarSectionExpert({ sectionId }: NavbarSectionExpertProps) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const section = config.sections.find((s) => s.id === sectionId)

  // P67c / A2 — collapse-by-default pattern (parity with SectionSimple).
  const isActive =
    selectedContext?.type === 'section' && selectedContext.sectionId === sectionId
  const [expanded, setExpanded] = useState<boolean>(() => isActive)

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
    <div
      data-section-id={sectionId}
      className="transition-all duration-200 ease-out"
      style={{ transitionDuration: tokens.motion.duration.base }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`navbar-expert-body-${sectionId}`}
        data-testid="section-editor-collapse-toggle"
        className={cn(
          'flex items-center justify-between w-full px-2 py-2 mb-1 rounded-md',
          'border border-hb-border/40 bg-hb-surface/40',
          'hover:bg-hb-surface-hover transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent'
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted font-medium">
            Section
          </span>
          <span className="text-xs font-semibold text-hb-text-primary capitalize">
            {section.type}
          </span>
        </span>
        {expanded ? (
          <ChevronDown size={14} className="text-hb-text-muted" />
        ) : (
          <ChevronRight size={14} className="text-hb-text-muted" />
        )}
      </button>
      {expanded && (
      <div id={`navbar-expert-body-${sectionId}`}>
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
      )}
    </div>
  )
}
