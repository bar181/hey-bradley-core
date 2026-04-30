import { useCallback, useState } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { ChevronDown, ChevronRight } from 'lucide-react'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

export function NavbarSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const section = config.sections.find((s) => s.id === sectionId)
  // P67 / Wave 2 / A2 — collapse-by-default; auto-expand the active section.
  const isActive =
    selectedContext?.type === 'section' && selectedContext.sectionId === sectionId
  const [expanded, setExpanded] = useState<boolean>(isActive)

  if (!section) return null

  const getComp = (id: string) => section.components.find((c) => c.id === id)
  const logoText = (getComp('logo')?.props?.text as string) ?? ''
  const logoEnabled = getComp('logo')?.enabled ?? true
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
      {/* ─── ELEMENTS ─── */}
      <RightAccordion id={`navbar-elements-${sectionId}`} label="Show / Hide">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={logoEnabled}
              onCheckedChange={(v) => handleToggle('logo', v)}
              className="scale-[0.6] shrink-0"
            />
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
          <div className={cn(!logoEnabled && 'opacity-25 pointer-events-none', 'space-y-1')}>
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
      )}
    </div>
  )
}
