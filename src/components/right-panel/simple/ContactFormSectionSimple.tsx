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

const FIELD_TYPES = ['text', 'email', 'textarea'] as const
type FieldType = (typeof FIELD_TYPES)[number]

const MIN_FIELDS = 1
const MAX_FIELDS = 8

// P75 / OC-7 / Agent A1 — contact-form editor; mirrors BlogSectionSimple
// collapse-by-default pattern (P67 / Wave 2 / A2). Visual-only — real form
// submission is Tier-2 (server required).
export function ContactFormSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const section = config.sections.find((s) => s.id === sectionId)
  const isActive =
    selectedContext?.type === 'section' && selectedContext.sectionId === sectionId
  const [expanded, setExpanded] = useState<boolean>(isActive)

  if (!section) return null

  const fields = section.components
    .filter((c) => c.type === 'form-input')
    .sort((a, b) => a.order - b.order)

  const button = section.components.find((c) => c.type === 'form-button')

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      setSectionConfig(sectionId, {
        components: setComponentEnabled(section, componentId, checked),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const updateProp = useCallback(
    (componentId: string, key: string, value: string | boolean) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const addField = useCallback(() => {
    if (fields.length >= MAX_FIELDS) return
    const existingIds = new Set(section.components.map((c) => c.id))
    let counter = fields.length + 1
    let id = `field-${counter}`
    while (existingIds.has(id)) {
      counter++
      id = `field-${counter}`
    }
    const newComponent = {
      id,
      type: 'form-input',
      enabled: true,
      order: fields.length,
      props: {
        fieldType: 'text',
        label: 'New field',
        placeholder: '',
        required: false,
      },
    }
    setSectionConfig(sectionId, {
      components: [...section.components, newComponent],
    })
  }, [sectionId, section, fields, setSectionConfig])

  const removeField = useCallback(
    (componentId: string) => {
      if (fields.length <= MIN_FIELDS) return
      const updated = section.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => (c.type === 'form-input' ? { ...c, order: i } : c))
      setSectionConfig(sectionId, { components: updated })
    },
    [sectionId, section, fields, setSectionConfig],
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

          <RightAccordion id={`form-fields-${sectionId}`} label="Form Fields">
            <div className="space-y-3">
              {fields.map((item, idx) => {
                const fieldType = (item.props?.fieldType as FieldType) ?? 'text'
                const label = (item.props?.label as string) ?? ''
                const placeholder = (item.props?.placeholder as string) ?? ''
                const required = Boolean(item.props?.required ?? false)

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-hb-border/40 bg-hb-surface/40 p-2.5 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-hb-text-muted uppercase tracking-wide flex-1">
                        Field {idx + 1}
                      </span>
                      <Switch
                        checked={item.enabled}
                        onCheckedChange={(v) => handleToggle(item.id, v)}
                        className="scale-[0.6] shrink-0"
                      />
                      {fields.length > MIN_FIELDS && (
                        <button
                          type="button"
                          onClick={() => removeField(item.id)}
                          className="text-hb-text-muted hover:text-red-400 transition-colors p-0.5"
                          title="Remove field"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-2')}>
                      <select
                        value={fieldType}
                        onChange={(e) => updateProp(item.id, 'fieldType', e.target.value)}
                        className={cn(INPUT, 'text-xs')}
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={label}
                        onChange={(e) => updateProp(item.id, 'label', e.target.value)}
                        placeholder="Label"
                        className={cn(INPUT, 'text-xs')}
                      />
                      <input
                        type="text"
                        value={placeholder}
                        onChange={(e) => updateProp(item.id, 'placeholder', e.target.value)}
                        placeholder="Placeholder"
                        className={cn(INPUT, 'text-xs')}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Required</span>
                        <Switch
                          checked={required}
                          onCheckedChange={(v) => updateProp(item.id, 'required', v)}
                          className="scale-[0.6]"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              {fields.length < MAX_FIELDS && (
                <button
                  type="button"
                  onClick={addField}
                  className={cn(
                    'flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium',
                    'border border-dashed border-hb-border text-hb-text-muted',
                    'hover:border-hb-accent/50 hover:text-hb-accent transition-colors',
                  )}
                >
                  <Plus size={14} />
                  Add Field
                </button>
              )}
            </div>
          </RightAccordion>

          {button && (
            <RightAccordion id={`form-button-${sectionId}`} label="Submit Button">
              <div className="space-y-2">
                <input
                  type="text"
                  value={(button.props?.label as string) ?? ''}
                  onChange={(e) => updateProp(button.id, 'label', e.target.value)}
                  placeholder="Send message"
                  className={cn(INPUT, 'text-xs')}
                />
                <p className="text-[11px] text-hb-text-muted italic leading-snug">
                  Visual-only in open-core. Real submission ships with Tier-2.
                </p>
              </div>
            </RightAccordion>
          )}
        </div>
      )}
    </div>
  )
}
