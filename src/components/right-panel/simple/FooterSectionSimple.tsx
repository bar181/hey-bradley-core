import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

function Field({
  label,
  enabled,
  onToggle,
  children,
}: {
  label: string
  enabled: boolean
  onToggle?: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {onToggle && (
          <Switch checked={enabled} onCheckedChange={onToggle} className="scale-[0.6] shrink-0" />
        )}
        <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide flex-1">
          {label}
        </span>
      </div>
      <div className={cn(!enabled && 'opacity-25 pointer-events-none')}>{children}</div>
    </div>
  )
}

export function FooterSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const getComp = (id: string) => section.components.find((c) => c.id === id)
  const getEnabled = (id: string) => getComp(id)?.enabled ?? true

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

  const brand = getComp('brand')
  const copyright = getComp('copyright')
  const columns = ['col-1', 'col-2', 'col-3'] as const

  return (
    <div className="divide-y divide-hb-border/30">
      <RightAccordion id="footer-content" label="Content" defaultOpen>
        <div className="space-y-3">
          {/* Brand */}
          <Field label="Company Name" enabled={getEnabled('brand')} onToggle={(v) => handleToggle('brand', v)}>
            <input
              type="text"
              value={(brand?.props?.text as string) ?? ''}
              onChange={(e) => updateProp('brand', 'text', e.target.value)}
              placeholder="e.g. Hey Bradley"
              data-testid="footer-brand-input"
              className={INPUT}
            />
          </Field>

          {/* Link columns */}
          {columns.map((colId) => {
            const col = getComp(colId)
            if (!col) return null
            const heading = (col.props?.heading as string) ?? ''
            const links = (col.props?.links as string) ?? ''
            // Convert comma-separated to newlines for editing
            const linksAsLines = links
              .split(',')
              .map((l) => l.trim())
              .filter(Boolean)
              .join('\n')

            return (
              <Field
                key={colId}
                label={heading || `Links Group ${colId.replace('col-', '')}`}
                enabled={col.enabled ?? true}
                onToggle={(v) => handleToggle(colId, v)}
              >
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => updateProp(colId, 'heading', e.target.value)}
                    placeholder="Group name (e.g. Company)"
                    className={cn(INPUT, 'text-xs')}
                  />
                  <textarea
                    value={linksAsLines}
                    onChange={(e) => {
                      const csv = e.target.value
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .join(',')
                      updateProp(colId, 'links', csv)
                    }}
                    rows={4}
                    placeholder="One link per line"
                    className={cn(INPUT, 'text-xs resize-none leading-snug')}
                  />
                </div>
              </Field>
            )
          })}

          {/* Copyright */}
          <Field
            label="Copyright"
            enabled={getEnabled('copyright')}
            onToggle={(v) => handleToggle('copyright', v)}
          >
            <input
              type="text"
              value={(copyright?.props?.text as string) ?? ''}
              onChange={(e) => updateProp('copyright', 'text', e.target.value)}
              placeholder="e.g. © 2026 Hey Bradley"
              data-testid="footer-copyright-input"
              className={INPUT}
            />
          </Field>
        </div>
      </RightAccordion>
    </div>
  )
}
