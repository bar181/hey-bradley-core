import { useCallback, useId } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { AlignCenter, Columns2, Sparkles, Mail } from 'lucide-react'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const CTA_LAYOUTS = [
  { v: 'simple' as const, label: 'Centered', Icon: AlignCenter },
  { v: 'split' as const, label: 'Side by Side', Icon: Columns2 },
  { v: 'gradient' as const, label: 'Gradient', Icon: Sparkles },
  { v: 'newsletter' as const, label: 'Newsletter', Icon: Mail },
]

export function CTASectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)
  const headingInputId = useId()
  const subInputId = useId()
  const buttonInputId = useId()
  const buttonUrlId = useId()

  if (!section) return null

  const getComp = (id: string) => section.components.find((c) => c.id === id)
  const getEnabled = (id: string, fallback = true) => getComp(id)?.enabled ?? fallback
  const getText = (id: string) => (getComp(id)?.props?.text as string) ?? ''
  const getUrl = (id: string) => (getComp(id)?.props?.url as string) ?? ''

  const updateCopy = useCallback(
    (componentId: string, text: string) => {
      setSectionConfig(sectionId, { components: updateComponentProps(section, componentId, { text }) })
    }, [sectionId, section, setSectionConfig]
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      setSectionConfig(sectionId, { components: setComponentEnabled(section, componentId, checked) })
    }, [sectionId, section, setSectionConfig]
  )

  const updateUrl = useCallback(
    (componentId: string, url: string) => {
      setSectionConfig(sectionId, {
        components: section.components.map((c) => c.id === componentId ? { ...c, props: { ...c.props, url } } : c),
      })
    }, [sectionId, section, setSectionConfig]
  )

  const currentVariant = section.variant || 'simple'

  return (
    <div className="divide-y divide-hb-border/30" data-section-id={sectionId}>
      {/* ─── LAYOUT ─── */}
      <RightAccordion id={`cta-layout-${sectionId}`} label="Style">
        <div className="grid grid-cols-2 gap-2">
          {CTA_LAYOUTS.map(({ v, label, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => setSectionConfig(sectionId, { variant: v })}
              aria-pressed={currentVariant === v}
              aria-label={`Style: ${label}`}
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
      <RightAccordion id={`cta-elements-${sectionId}`} label="Show / Hide">
        <div className="space-y-2">
          {([
            { id: 'heading', label: 'Heading' },
            { id: 'subtitle', label: 'Subtitle' },
            { id: 'button', label: 'Button' },
          ] as const).map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2">
              <Switch
                aria-label={`Toggle ${label}`}
                checked={getEnabled(id)}
                onCheckedChange={(v) => handleToggle(id, v)}
                className="scale-[0.6] shrink-0"
              />
              <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </RightAccordion>

      {/* ─── CONTENT ─── */}
      <RightAccordion id={`cta-content-${sectionId}`} label="Content">
        <div className="space-y-2.5">
          <div className={cn(!getEnabled('heading') && 'opacity-25 pointer-events-none', 'space-y-1')}>
            <label htmlFor={headingInputId} className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Heading</label>
            <input
              id={headingInputId}
              type="text"
              value={getText('heading')}
              onChange={(e) => updateCopy('heading', e.target.value)}
              placeholder="e.g. Ready to get started?"
              data-testid="cta-heading-input"
              className={INPUT}
            />
          </div>

          <div className={cn(!getEnabled('subtitle') && 'opacity-25 pointer-events-none', 'space-y-1')}>
            <label htmlFor={subInputId} className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Subtitle</label>
            <textarea
              id={subInputId}
              value={getText('subtitle')}
              onChange={(e) => updateCopy('subtitle', e.target.value)}
              rows={2}
              placeholder="e.g. Start building your next project today."
              data-testid="cta-subtitle-input"
              className={cn(INPUT, 'resize-none leading-snug')}
            />
          </div>

          <div className={cn(!getEnabled('button') && 'opacity-25 pointer-events-none', 'space-y-1')}>
            <label htmlFor={buttonInputId} className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Button</label>
            <input
              id={buttonInputId}
              type="text"
              value={getText('button')}
              onChange={(e) => updateCopy('button', e.target.value)}
              placeholder="e.g. Get Started"
              data-testid="cta-button-input"
              className={INPUT}
            />
            <input
              id={buttonUrlId}
              aria-label="Button link URL"
              type="text"
              value={getUrl('button')}
              onChange={(e) => updateUrl('button', e.target.value)}
              placeholder="Link (where button goes)"
              className={cn(INPUT, 'text-xs py-1')}
            />
          </div>
        </div>
      </RightAccordion>
    </div>
  )
}
