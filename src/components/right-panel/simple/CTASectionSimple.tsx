import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

// ── Toggle + label row ──
function Field({
  label, enabled, onToggle, children,
}: {
  label: string; enabled: boolean; onToggle?: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {onToggle && (
          <Switch checked={enabled} onCheckedChange={onToggle} className="scale-[0.6] shrink-0" />
        )}
        <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide flex-1">{label}</span>
      </div>
      <div className={cn(!enabled && 'opacity-25 pointer-events-none')}>{children}</div>
    </div>
  )
}

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

export function CTASectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const getComp = (id: string) => section.components.find((c) => c.id === id)
  const getEnabled = (id: string, fallback = true) => getComp(id)?.enabled ?? fallback
  const getText = (id: string) => (getComp(id)?.props?.text as string) ?? ''
  const getUrl = (id: string) => (getComp(id)?.props?.url as string) ?? ''

  const updateCopy = useCallback(
    (componentId: string, text: string) => {
      if (import.meta.env.DEV) console.log('[cta:copyEdit]', componentId, text)
      setSectionConfig(sectionId, { components: updateComponentProps(section, componentId, { text }) })
    }, [sectionId, section, setSectionConfig]
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      if (import.meta.env.DEV) console.log('[cta:toggle]', componentId, checked)
      setSectionConfig(sectionId, { components: setComponentEnabled(section, componentId, checked) })
    }, [sectionId, section, setSectionConfig]
  )

  const updateUrl = useCallback(
    (componentId: string, url: string) => {
      if (import.meta.env.DEV) console.log('[cta:urlEdit]', componentId, url)
      setSectionConfig(sectionId, {
        components: section.components.map((c) => c.id === componentId ? { ...c, props: { ...c.props, url } } : c),
      })
    }, [sectionId, section, setSectionConfig]
  )

  return (
    <div className="divide-y divide-hb-border/30">
      {/* ─── LAYOUT ─── */}
      <RightAccordion id={`cta-layout-${sectionId}`} label="Layout" defaultOpen>
        <div>
          <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Style</div>
          <div className="flex rounded-lg border border-hb-border overflow-hidden">
            {([{ v: 'simple', label: 'Centered' }, { v: 'split', label: 'Side by Side' }] as const).map(({ v, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => setSectionConfig(sectionId, { variant: v })}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium transition-colors',
                  (section.variant || 'simple') === v
                    ? 'bg-hb-accent text-white'
                    : 'bg-hb-surface text-hb-text-muted hover:bg-hb-surface-hover',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </RightAccordion>

      {/* ─── CONTENT ─── */}
      <RightAccordion id={`cta-content-${sectionId}`} label="Content" defaultOpen>
        <div className="space-y-2.5">
          <Field
            label="Heading"
            enabled={getEnabled('heading')}
            onToggle={(v) => handleToggle('heading', v)}
          >
            <input
              type="text"
              value={getText('heading')}
              onChange={(e) => updateCopy('heading', e.target.value)}
              placeholder="e.g. Ready to get started?"
              data-testid="cta-heading-input"
              className={INPUT}
            />
          </Field>

          <Field
            label="Subtitle"
            enabled={getEnabled('subtitle')}
            onToggle={(v) => handleToggle('subtitle', v)}
          >
            <textarea
              value={getText('subtitle')}
              onChange={(e) => updateCopy('subtitle', e.target.value)}
              rows={2}
              placeholder="e.g. Start building your next project today."
              data-testid="cta-subtitle-input"
              className={cn(INPUT, 'resize-none leading-snug')}
            />
          </Field>

          <Field
            label="Button"
            enabled={getEnabled('button')}
            onToggle={(v) => handleToggle('button', v)}
          >
            <div className="space-y-1.5">
              <input
                type="text"
                value={getText('button')}
                onChange={(e) => updateCopy('button', e.target.value)}
                placeholder="e.g. Get Started"
                data-testid="cta-button-input"
                className={INPUT}
              />
              <input
                type="text"
                value={getUrl('button')}
                onChange={(e) => updateUrl('button', e.target.value)}
                placeholder="Link (where button goes)"
                className={cn(INPUT, 'text-xs py-1')}
              />
            </div>
          </Field>
        </div>
      </RightAccordion>
    </div>
  )
}
