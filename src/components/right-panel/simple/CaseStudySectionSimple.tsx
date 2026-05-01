import { useCallback, useState } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { SectionHeadingEditor } from './SectionHeadingEditor'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const MIN_CARDS = 1
const MAX_CARDS = 9

// P75 / OC-7 / Agent A1 — case-study editor; mirrors BlogSectionSimple
// collapse-by-default pattern (P67 / Wave 2 / A2).
export function CaseStudySectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const section = config.sections.find((s) => s.id === sectionId)
  const isActive =
    selectedContext?.type === 'section' && selectedContext.sectionId === sectionId
  const [expanded, setExpanded] = useState<boolean>(isActive)

  if (!section) return null

  const cards = section.components
    .filter((c) => c.type === 'case-study-card')
    .sort((a, b) => a.order - b.order)

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      setSectionConfig(sectionId, {
        components: setComponentEnabled(section, componentId, checked),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const updateProp = useCallback(
    (componentId: string, key: string, value: string) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const addCard = useCallback(() => {
    if (cards.length >= MAX_CARDS) return
    const existingIds = new Set(section.components.map((c) => c.id))
    let counter = cards.length + 1
    let id = `case-${counter}`
    while (existingIds.has(id)) {
      counter++
      id = `case-${counter}`
    }
    const newComponent = {
      id,
      type: 'case-study-card',
      enabled: true,
      order: cards.length,
      props: {
        headline: 'Outcome headline',
        body: 'Short summary of the engagement and what changed.',
        outcomeMetric: '+30%',
        clientName: 'Anonymized client',
        mediaUrl: '',
      },
    }
    setSectionConfig(sectionId, {
      components: [...section.components, newComponent],
    })
  }, [sectionId, section, cards, setSectionConfig])

  const removeCard = useCallback(
    (componentId: string) => {
      if (cards.length <= MIN_CARDS) return
      const updated = section.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => (c.type === 'case-study-card' ? { ...c, order: i } : c))
      setSectionConfig(sectionId, { components: updated })
    },
    [sectionId, section, cards, setSectionConfig],
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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent',
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
          <SectionHeadingEditor sectionId={sectionId} />

          <RightAccordion id={`case-cards-${sectionId}`} label="Case Studies">
            <div className="space-y-3">
              {cards.map((item, idx) => {
                const headline = (item.props?.headline as string) ?? ''
                const body = (item.props?.body as string) ?? ''
                const outcomeMetric = (item.props?.outcomeMetric as string) ?? ''
                const clientName = (item.props?.clientName as string) ?? ''
                const mediaUrl = (item.props?.mediaUrl as string) ?? ''

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-hb-border/40 bg-hb-surface/40 p-2.5 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-hb-text-muted uppercase tracking-wide flex-1">
                        Case {idx + 1}
                      </span>
                      <Switch
                        checked={item.enabled}
                        onCheckedChange={(v) => handleToggle(item.id, v)}
                        className="scale-[0.6] shrink-0"
                      />
                      {cards.length > MIN_CARDS && (
                        <button
                          type="button"
                          onClick={() => removeCard(item.id)}
                          className="text-hb-text-muted hover:text-red-400 transition-colors p-0.5 focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] rounded"
                          title="Remove case study"
                          aria-label={`Remove case study ${idx + 1}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-2')}>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => updateProp(item.id, 'headline', e.target.value)}
                        placeholder="Outcome headline"
                        className={cn(INPUT, 'text-xs')}
                      />
                      <input
                        type="text"
                        value={body}
                        onChange={(e) => updateProp(item.id, 'body', e.target.value)}
                        placeholder="Short summary"
                        className={cn(INPUT, 'text-xs')}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={outcomeMetric}
                          onChange={(e) => updateProp(item.id, 'outcomeMetric', e.target.value)}
                          placeholder="+30%"
                          className={cn(INPUT, 'text-xs')}
                        />
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => updateProp(item.id, 'clientName', e.target.value)}
                          placeholder="Client name"
                          className={cn(INPUT, 'text-xs')}
                        />
                      </div>
                      <input
                        type="text"
                        value={mediaUrl}
                        onChange={(e) => updateProp(item.id, 'mediaUrl', e.target.value)}
                        placeholder="Media URL (optional)"
                        className={cn(INPUT, 'text-xs')}
                      />
                    </div>
                  </div>
                )
              })}

              {cards.length < MAX_CARDS && (
                <button
                  type="button"
                  onClick={addCard}
                  className={cn(
                    'flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium',
                    'border border-dashed border-hb-border text-hb-text-muted',
                    'hover:border-hb-accent/50 hover:text-hb-accent transition-colors',
                  )}
                >
                  <Plus size={14} />
                  Add Case Study
                </button>
              )}
            </div>
          </RightAccordion>
        </div>
      )}
    </div>
  )
}
