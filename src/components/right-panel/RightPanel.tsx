import { useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { Toggle } from '@/components/shared/Toggle'
import { RightPanelTabBar } from './RightPanelTabBar'
import { SimpleTab } from './SimpleTab'
import { ExpertTab } from './ExpertTab'

const sectionTypeLabel: Record<string, string> = {
  hero: 'Hero',
  features: 'Features',
  cta: 'Call to Action',
  pricing: 'Pricing',
  footer: 'Footer',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  value_props: 'Value Props',
}

export function RightPanel() {
  const selectedContext = useUIStore((s) => s.selectedContext)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const sections = useConfigStore((s) => s.config.sections)
  const [sectionEnabled, setSectionEnabled] = useState(true)

  const sectionMeta = selectedContext?.type === 'section'
    ? sections.find((s) => s.id === selectedContext.sectionId)
    : null

  const contextLabel =
    selectedContext?.type === 'theme'
      ? 'THEME CONFIGURATION'
      : sectionMeta
        ? `${sectionTypeLabel[sectionMeta.type] ?? sectionMeta.type} — ${sectionMeta.id}`
        : selectedContext?.type === 'section'
          ? `${selectedContext.sectionId.toUpperCase()} SECTION`
          : null

  return (
    <div className="bg-hb-bg h-full flex flex-col overflow-hidden">
      {selectedContext && (
        <div className="px-4 pt-3 pb-2 flex justify-between items-center border-b border-hb-border">
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-hb-text-muted">
            {contextLabel}
          </span>
          {selectedContext.type === 'section' && (
            <Toggle enabled={sectionEnabled} onChange={setSectionEnabled} size="sm" />
          )}
        </div>
      )}

      <RightPanelTabBar />

      <div className="flex-1 overflow-auto px-4 py-3">
        {rightPanelTab === 'SIMPLE' && <SimpleTab />}
        {rightPanelTab === 'EXPERT' && <ExpertTab />}
      </div>
    </div>
  )
}
