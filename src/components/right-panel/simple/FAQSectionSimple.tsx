import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

export function FAQSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const faqItems = section.components
    .filter((c) => c.type === 'faq-item')
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

  return (
    <div className="divide-y divide-hb-border/30">
      <RightAccordion id={`faq-content-${sectionId}`} label="Content" defaultOpen>
        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const question = (item.props?.question as string) ?? ''
            const answer = (item.props?.answer as string) ?? ''

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(v) => handleToggle(item.id, v)}
                    className="scale-[0.6] shrink-0"
                  />
                  <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                    Q&A {i + 1}
                  </span>
                </div>
                <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-1.5')}>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => updateProp(item.id, 'question', e.target.value)}
                    placeholder="Question..."
                    className={INPUT}
                  />
                  <textarea
                    value={answer}
                    onChange={(e) => updateProp(item.id, 'answer', e.target.value)}
                    rows={3}
                    placeholder="Answer..."
                    className={cn(INPUT, 'resize-none leading-snug')}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </RightAccordion>
    </div>
  )
}
