import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { LayoutGrid, Quote, Star, AlignLeft } from 'lucide-react'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const QUOTES_LAYOUTS = [
  { v: 'cards' as const, label: 'Cards', Icon: LayoutGrid },
  { v: 'single' as const, label: 'Single', Icon: Quote },
  { v: 'stars' as const, label: 'Stars', Icon: Star },
  { v: 'minimal' as const, label: 'Minimal', Icon: AlignLeft },
]

export function TestimonialsSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const testimonials = section.components
    .filter((c) => c.type === 'testimonial')
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

  const currentVariant = section.variant || 'cards'

  return (
    <div className="divide-y divide-hb-border/30">
      {/* ─── LAYOUT ─── */}
      <RightAccordion id={`quotes-layout-${sectionId}`} label="Layout" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          {QUOTES_LAYOUTS.map(({ v, label, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => setSectionConfig(sectionId, { variant: v })}
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
      <RightAccordion id={`testimonials-elements-${sectionId}`} label="Elements" defaultOpen>
        <div className="space-y-2">
          {testimonials.map((t, i) => (
            <div key={t.id} className="flex items-center gap-2">
              <Switch
                checked={t.enabled}
                onCheckedChange={(v) => handleToggle(t.id, v)}
                className="scale-[0.6] shrink-0"
              />
              <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                Review {i + 1}
              </span>
            </div>
          ))}
        </div>
      </RightAccordion>

      {/* ─── CONTENT ─── */}
      <RightAccordion id={`testimonials-content-${sectionId}`} label="Content">
        <div className="space-y-3">
          {testimonials.map((t, i) => {
            const quote = (t.props?.quote as string) ?? ''
            const author = (t.props?.author as string) ?? ''
            const role = (t.props?.role as string) ?? ''

            return (
              <div key={t.id} className={cn(!t.enabled && 'opacity-25 pointer-events-none', 'space-y-1.5')}>
                <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                  Review {i + 1}
                </span>
                <textarea
                  value={quote}
                  onChange={(e) => updateProp(t.id, 'quote', e.target.value)}
                  rows={3}
                  placeholder="What did they say?"
                  data-testid={`testimonial-quote-input-${i}`}
                  className={cn(INPUT, 'resize-none leading-snug')}
                />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => updateProp(t.id, 'author', e.target.value)}
                  placeholder="Person's name"
                  data-testid={`testimonial-author-input-${i}`}
                  className={INPUT}
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => updateProp(t.id, 'role', e.target.value)}
                  placeholder="Their title or company"
                  data-testid={`testimonial-role-input-${i}`}
                  className={INPUT}
                />
              </div>
            )
          })}
        </div>
      </RightAccordion>
    </div>
  )
}
