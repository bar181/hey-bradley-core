import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import {
  Plus, Trash2, LayoutGrid, ImageIcon, Sparkles,
  AlignLeft, Hash, Rows3, Palette, GlassWater,
} from 'lucide-react'
import { SectionHeadingEditor } from './SectionHeadingEditor'

/* ── Available icons (must match FeaturesGrid iconMap) ── */
const ICON_OPTIONS = ['zap', 'target', 'shield', 'star', 'rocket', 'code', 'globe', 'lock', 'cpu'] as const

const MIN_CARDS = 2
const MAX_CARDS = 6

/* ── Shared input class ── */
const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

/* ── Layout cards ── */
const FEATURES_LAYOUTS = [
  { v: 'cards', cols: 3, label: 'Cards', Icon: LayoutGrid },
  { v: 'image-cards', cols: 3, label: 'Image Cards', Icon: ImageIcon },
  { v: 'icon-text', cols: 3, label: 'Icon + Text', Icon: Sparkles },
  { v: 'minimal', cols: 3, label: 'Minimal', Icon: AlignLeft },
  { v: 'numbered', cols: 3, label: 'Numbered', Icon: Hash },
  { v: 'horizontal', cols: 3, label: 'Horizontal', Icon: Rows3 },
  { v: 'gradient', cols: 3, label: 'Gradient', Icon: Palette },
  { v: 'glass', cols: 3, label: 'Glass', Icon: GlassWater },
] as const

/* ── Toggle + label row ── */
function Field({
  label,
  enabled,
  children,
}: {
  label: string
  enabled: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
        {label}
      </span>
      <div className={cn(!enabled && 'opacity-25 pointer-events-none')}>{children}</div>
    </div>
  )
}

/* ── Main component ── */
export function FeaturesSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const featureCards = section.components
    .filter((c) => c.type === 'feature-card')
    .sort((a, b) => a.order - b.order)

  const currentVariant = section.variant || 'cards'

  /* ── Handlers ── */

  const applyLayout = useCallback(
    (layout: typeof FEATURES_LAYOUTS[number]) => {
      setSectionConfig(sectionId, {
        layout: { ...section.layout, columns: layout.cols },
        variant: layout.v,
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

  const updateProp = useCallback(
    (componentId: string, prop: string, value: string) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { [prop]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const addFeature = useCallback(() => {
    if (featureCards.length >= MAX_CARDS) return
    const nextIndex = featureCards.length + 1
    const existingIds = new Set(section.components.map((c) => c.id))
    let id = `f${nextIndex}`
    let counter = nextIndex
    while (existingIds.has(id)) {
      counter++
      id = `f${counter}`
    }
    const newComponent = {
      id,
      type: 'feature-card',
      enabled: true,
      order: featureCards.length,
      props: {
        icon: 'star',
        title: 'New Feature',
        description: 'Describe this feature.',
      },
    }
    setSectionConfig(sectionId, {
      components: [...section.components, newComponent],
    })
  }, [sectionId, section, featureCards, setSectionConfig])

  const removeFeature = useCallback(
    (componentId: string) => {
      if (featureCards.length <= MIN_CARDS) return
      const updated = section.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => (c.type === 'feature-card' ? { ...c, order: i } : c))
      setSectionConfig(sectionId, { components: updated })
    },
    [sectionId, section, featureCards, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      <SectionHeadingEditor sectionId={sectionId} />
      {/* ─── 1. LAYOUT ─── */}
      <RightAccordion id={`${sectionId}-layout`} label="Layout" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          {FEATURES_LAYOUTS.map(({ v, label, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => applyLayout(FEATURES_LAYOUTS.find((l) => l.v === v)!)}
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

      {/* ─── 2. CONTENT ─── */}
      <RightAccordion id={`${sectionId}-content`} label="Content">
        <div className="space-y-3">
          {featureCards.map((card, idx) => {
            const icon = (card.props?.icon as string) ?? ''
            const title = (card.props?.title as string) ?? ''
            const description = (card.props?.description as string) ?? ''

            return (
              <div
                key={card.id}
                className="rounded-lg border border-hb-border/40 bg-hb-surface/40 p-2.5 space-y-2"
              >
                {/* Card header: number + toggle + remove */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-hb-text-muted uppercase tracking-wide flex-1">
                    Card {idx + 1}
                  </span>
                  <Switch
                    checked={card.enabled}
                    onCheckedChange={(v) => handleToggle(card.id, v)}
                    className="scale-[0.6] shrink-0"
                  />
                  {featureCards.length > MIN_CARDS && (
                    <button
                      type="button"
                      onClick={() => removeFeature(card.id)}
                      className="text-hb-text-muted hover:text-red-400 transition-colors p-0.5"
                      title="Remove card"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className={cn(!card.enabled && 'opacity-25 pointer-events-none', 'space-y-2')}>
                  {/* Icon select */}
                  <Field label="Icon" enabled={card.enabled}>
                    <select
                      value={icon}
                      onChange={(e) => updateProp(card.id, 'icon', e.target.value)}
                      className={cn(INPUT, 'text-xs py-1')}
                    >
                      <option value="">None</option>
                      {ICON_OPTIONS.map((slug) => (
                        <option key={slug} value={slug}>
                          {slug === 'zap' ? 'Lightning' : slug === 'target' ? 'Bullseye' : slug === 'cpu' ? 'Chip' : slug.charAt(0).toUpperCase() + slug.slice(1)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Title */}
                  <Field label="Title" enabled={card.enabled}>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => updateProp(card.id, 'title', e.target.value)}
                      placeholder="Feature title"
                      data-testid={`features-title-input-${idx}`}
                      className={INPUT}
                    />
                  </Field>

                  {/* Description */}
                  <Field label="Description" enabled={card.enabled}>
                    <textarea
                      value={description}
                      onChange={(e) => updateProp(card.id, 'description', e.target.value)}
                      placeholder="Feature description"
                      data-testid={`features-description-input-${idx}`}
                      rows={2}
                      className={cn(INPUT, 'resize-none leading-snug')}
                    />
                  </Field>
                </div>
              </div>
            )
          })}

          {/* Add Feature button */}
          {featureCards.length < MAX_CARDS && (
            <button
              type="button"
              onClick={addFeature}
              className={cn(
                'flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium',
                'border border-dashed border-hb-border text-hb-text-muted',
                'hover:border-hb-accent/50 hover:text-hb-accent transition-colors',
              )}
            >
              <Plus size={14} />
              Add Another
            </button>
          )}
        </div>
      </RightAccordion>
    </div>
  )
}
