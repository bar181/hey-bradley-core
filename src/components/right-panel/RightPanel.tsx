import { Lock, Shield } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { Toggle } from '@/components/shared/Toggle'
import { RightPanelTabBar } from './RightPanelTabBar'
import { SimpleTab } from './SimpleTab'
import { ExpertTab } from './ExpertTab'

const sectionTypeLabel: Record<string, string> = {
  hero: 'Hero',
  columns: 'Content Cards',
  action: 'Action Block',
  pricing: 'Pricing',
  footer: 'Footer',
  quotes: 'Quotes',
  questions: 'Questions',
  numbers: 'Numbers',
  menu: 'Navigation Bar',
  gallery: 'Gallery',
}

export function RightPanel() {
  const selectedContext = useUIStore((s) => s.selectedContext)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const designLocked = useUIStore((s) => s.designLocked)
  const brandLocked = useUIStore((s) => s.brandLocked)
  const sections = useConfigStore((s) => s.config.sections)
  const toggleSectionEnabled = useConfigStore((s) => s.toggleSectionEnabled)

  const sectionMeta = selectedContext?.type === 'section'
    ? sections.find((s) => s.id === selectedContext.sectionId)
    : null

  const contextLabel =
    selectedContext?.type === 'theme'
      ? 'THEME'
      : sectionMeta
        ? sectionTypeLabel[sectionMeta.type] ?? sectionMeta.type
        : null

  return (
    <div className="bg-hb-bg h-full flex flex-col overflow-hidden">
      {selectedContext && (
        <div className="px-4 pt-3 pb-2 flex justify-between items-center border-b border-hb-border">
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-hb-text-muted">
            {contextLabel}
          </span>
          {selectedContext.type === 'section' && sectionMeta && (
            <Toggle
              enabled={sectionMeta.enabled}
              onChange={() => toggleSectionEnabled(sectionMeta.id)}
              size="sm"
            />
          )}
        </div>
      )}

      {(designLocked || brandLocked) && (
        <div className="flex items-center gap-2 px-4 py-1.5 border-b border-hb-border bg-hb-accent/5">
          {designLocked && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-hb-accent">
              <Lock size={10} /> Design
            </span>
          )}
          {brandLocked && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-hb-accent">
              <Shield size={10} /> Brand
            </span>
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
