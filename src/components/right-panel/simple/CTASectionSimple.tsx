import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

// ── Compact char indicator ──
function CharDot({ current, max }: { current: number; max: number }) {
  const ratio = current / max
  const color = ratio > 1 ? 'bg-red-400' : ratio > 0.9 ? 'bg-amber-400' : 'bg-emerald-400'
  return (
    <span className="flex items-center gap-1 shrink-0" title={`${current}/${max}`}>
      <span className={cn('w-1.5 h-1.5 rounded-full', color)} />
      <span className="text-xs text-hb-text-muted tabular-nums">{current}</span>
    </span>
  )
}

// ── Toggle + label + optional char count row ──
function Field({
  label, enabled, onToggle, charCurrent, charMax, children,
}: {
  label: string; enabled: boolean; onToggle?: (v: boolean) => void
  charCurrent?: number; charMax?: number; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {onToggle && (
          <Switch checked={enabled} onCheckedChange={onToggle} className="scale-[0.6] shrink-0" />
        )}
        <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide flex-1">{label}</span>
        {charCurrent !== undefined && charMax !== undefined && <CharDot current={charCurrent} max={charMax} />}
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
      {/* ─── CONTENT ─── */}
      <RightAccordion id={`cta-content-${sectionId}`} label="Content" defaultOpen>
        <div className="space-y-2.5">
          <Field
            label="Heading"
            enabled={getEnabled('heading')}
            onToggle={(v) => handleToggle('heading', v)}
            charCurrent={getText('heading').length}
            charMax={60}
          >
            <input
              type="text"
              value={getText('heading')}
              onChange={(e) => updateCopy('heading', e.target.value)}
              placeholder="e.g. Ready to get started?"
              className={INPUT}
            />
          </Field>

          <Field
            label="Subtitle"
            enabled={getEnabled('subtitle')}
            onToggle={(v) => handleToggle('subtitle', v)}
            charCurrent={getText('subtitle').length}
            charMax={120}
          >
            <textarea
              value={getText('subtitle')}
              onChange={(e) => updateCopy('subtitle', e.target.value)}
              rows={2}
              placeholder="e.g. Start building your next project today."
              className={cn(INPUT, 'resize-none leading-snug')}
            />
          </Field>

          <Field
            label="Button"
            enabled={getEnabled('button')}
            onToggle={(v) => handleToggle('button', v)}
            charCurrent={getText('button').length}
            charMax={30}
          >
            <div className="space-y-1.5">
              <input
                type="text"
                value={getText('button')}
                onChange={(e) => updateCopy('button', e.target.value)}
                placeholder="e.g. Get Started"
                className={INPUT}
              />
              <input
                type="text"
                value={getUrl('button')}
                onChange={(e) => updateUrl('button', e.target.value)}
                placeholder="Button URL, e.g. #signup"
                className={cn(INPUT, 'text-xs py-1')}
              />
            </div>
          </Field>
        </div>
      </RightAccordion>
    </div>
  )
}
