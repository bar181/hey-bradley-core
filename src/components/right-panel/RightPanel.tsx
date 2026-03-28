import { useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { Toggle } from '@/components/shared/Toggle'
import { RightPanelTabBar } from './RightPanelTabBar'
import { SimpleTab } from './SimpleTab'
import { ExpertTab } from './ExpertTab'

export function RightPanel() {
  const selectedContext = useUIStore((s) => s.selectedContext)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const [sectionEnabled, setSectionEnabled] = useState(true)

  const contextLabel =
    selectedContext?.type === 'theme'
      ? 'THEME CONFIGURATION'
      : selectedContext?.type === 'section'
        ? `${selectedContext.sectionId.toUpperCase()} SECTION`
        : null

  return (
    <div className="bg-hb-bg h-full flex flex-col overflow-hidden">
      {selectedContext && (
        <div className="px-4 pt-3 pb-2 flex justify-between items-center border-b border-hb-border">
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-hb-text-muted">
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
