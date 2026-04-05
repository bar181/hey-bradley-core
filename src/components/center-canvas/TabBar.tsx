import { cn } from '../../lib/cn'
import { useUIStore, type ActiveTab } from '../../store/uiStore'
import { FileText } from 'lucide-react'

const TABS: { key: ActiveTab; label: string; expert?: boolean }[] = [
  { key: 'REALITY', label: 'Preview' },
  { key: 'XAI_DOCS', label: 'Blueprints' },
  { key: 'DATA', label: 'Data', expert: true },
  { key: 'AISP', label: 'AISP', expert: true },
  { key: 'WORKFLOW', label: 'Pipeline', expert: true },
]

export function TabBar() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const isExpert = rightPanelTab === 'EXPERT'

  return (
    <div className="flex flex-row gap-0 border-b border-hb-border bg-hb-bg items-center">
      {TABS.filter((tab) => !tab.expert || isExpert).map((tab) => {
        const isSpecs = tab.key === 'XAI_DOCS'
        const isActive = activeTab === tab.key

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5',
              isActive
                ? 'text-hb-accent border-b-2 border-hb-accent -mb-px'
                : isSpecs
                  ? 'text-hb-accent/70 hover:text-hb-accent'
                  : 'text-hb-text-muted hover:text-hb-text-secondary'
            )}
          >
            {isSpecs && <FileText size={12} />}
            {tab.label}
            {isSpecs && !isActive && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-hb-accent/60" />
            )}
          </button>
        )
      })}
    </div>
  )
}
