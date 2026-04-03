import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Plus, Trash2 } from 'lucide-react'

/* ── Available icons (must match FeaturesGrid iconMap) ── */
const ICON_OPTIONS = ['zap', 'target', 'shield', 'star', 'rocket', 'code', 'globe', 'lock', 'cpu'] as const

const MIN_CARDS = 2
const MAX_CARDS = 6

const GRID_OPTIONS = [
  { cols: 2, label: '2' },
  { cols: 3, label: '3' },
  { cols: 4, label: '4' },
] as const

/* ── Shared input class ── */
const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

/* ── Toggle + label row ── */
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

/* ── Main component ── */
export function FeaturesSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const featureCards = section.components
    .filter((c) => c.type === 'feature-card')
    .sort((a, b) => a.order - b.order)

  const currentCols = (section.layout as Record<string, unknown>)?.columns ?? 3

  /* ── Handlers ── */

  const setColumns = useCallback(
    (cols: number) => {
      setSectionConfig(sectionId, {
        layout: { ...section.layout, columns: cols },
        variant: `grid-${cols}col`,
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
    const newId = `f${nextIndex}`
    // Avoid id collision
    const existingIds = new Set(section.components.map((c) => c.id))
    let id = newId
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
      {/* ─── 1. LAYOUT ─── */}
      <RightAccordion id={`${sectionId}-layout`} label="Layout" defaultOpen>
        <div className="space-y-3">
          {/* Variant selector */}
          <div>
            <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Style</div>
            <div className="flex rounded-lg border border-hb-border overflow-hidden">
              {([{ v: 'grid-3col', label: 'Simple' }, { v: 'cards', label: 'Card Style' }] as const).map(({ v, label }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSectionConfig(sectionId, { variant: v })}
                  className={cn(
                    'flex-1 py-1.5 text-xs font-medium transition-colors',
                    (section.variant || 'grid-3col') === v
                      ? 'bg-hb-accent text-white'
                      : 'bg-hb-surface text-hb-text-muted hover:bg-hb-surface-hover',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">
              Columns
            </div>
            <div className="flex rounded-lg border border-hb-border overflow-hidden">
              {GRID_OPTIONS.map(({ cols, label }) => (
                <button
                  key={cols}
                  type="button"
                  onClick={() => setColumns(cols)}
                  className={cn(
                    'flex-1 py-1.5 text-xs font-medium transition-colors',
                    currentCols === cols
                      ? 'bg-hb-accent text-white'
                      : 'bg-hb-surface text-hb-text-muted hover:bg-hb-surface-hover',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </RightAccordion>

      {/* ─── 2. CONTENT ─── */}
      <RightAccordion id={`${sectionId}-content`} label="Content" defaultOpen>
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
                  <Field
                    label="Title"
                    enabled={card.enabled}
                  >
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
                  <Field
                    label="Description"
                    enabled={card.enabled}
                  >
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
