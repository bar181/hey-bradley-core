import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

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

  const columns = ['col-1', 'col-2', 'col-3'] as const

  return (
    <div className="divide-y divide-hb-border/30">
      {/* ─── ELEMENTS ─── */}
      <RightAccordion id={`footer-elements-${sectionId}`} label="Elements" defaultOpen>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={getEnabled('brand')}
              onCheckedChange={(v) => handleToggle('brand', v)}
              className="scale-[0.6] shrink-0"
            />
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Company Name</span>
          </div>
          {columns.map((colId) => {
            const col = getComp(colId)
            if (!col) return null
            const heading = (col.props?.heading as string) ?? ''
            return (
              <div key={colId} className="flex items-center gap-2">
                <Switch
                  checked={col.enabled ?? true}
                  onCheckedChange={(v) => handleToggle(colId, v)}
                  className="scale-[0.6] shrink-0"
                />
                <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                  {heading || `Links Group ${colId.replace('col-', '')}`}
                </span>
              </div>
            )
          })}
          <div className="flex items-center gap-2">
            <Switch
              checked={getEnabled('copyright')}
              onCheckedChange={(v) => handleToggle('copyright', v)}
              className="scale-[0.6] shrink-0"
            />
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Copyright</span>
          </div>
        </div>
      </RightAccordion>

      {/* ─── CONTENT ─── */}
      <RightAccordion id={`footer-content-${sectionId}`} label="Content">
        <div className="space-y-3">
          {/* Brand */}
          <div className={cn(!getEnabled('brand') && 'opacity-25 pointer-events-none', 'space-y-1')}>
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Company Name</span>
            <input
              type="text"
              value={(getComp('brand')?.props?.text as string) ?? ''}
              onChange={(e) => updateProp('brand', 'text', e.target.value)}
              placeholder="e.g. Hey Bradley"
              data-testid="footer-brand-input"
              className={INPUT}
            />
          </div>

          {/* Link columns */}
          {columns.map((colId) => {
            const col = getComp(colId)
            if (!col) return null
            const heading = (col.props?.heading as string) ?? ''
            const links = (col.props?.links as string) ?? ''
            const linksAsLines = links
              .split(',')
              .map((l) => l.trim())
              .filter(Boolean)
              .join('\n')

            return (
              <div key={colId} className={cn(!(col.enabled ?? true) && 'opacity-25 pointer-events-none', 'space-y-1')}>
                <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                  {heading || `Links Group ${colId.replace('col-', '')}`}
                </span>
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
            )
          })}

          {/* Copyright */}
          <div className={cn(!getEnabled('copyright') && 'opacity-25 pointer-events-none', 'space-y-1')}>
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Copyright</span>
            <input
              type="text"
              value={(getComp('copyright')?.props?.text as string) ?? ''}
              onChange={(e) => updateProp('copyright', 'text', e.target.value)}
              placeholder="e.g. (c) 2026 Hey Bradley"
              data-testid="footer-copyright-input"
              className={INPUT}
            />
          </div>
        </div>
      </RightAccordion>
    </div>
  )
}
