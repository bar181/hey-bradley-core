import { cn } from '../../lib/cn'
import { useUIStore, type ActiveTab } from '../../store/uiStore'

const tabs: { key: ActiveTab; label: string }[] = [
  { key: 'REALITY', label: 'REALITY' },
  { key: 'DATA', label: 'DATA' },
  { key: 'XAI_DOCS', label: 'XAI DOCS' },
  { key: 'WORKFLOW', label: 'WORKFLOW' },
]

export function TabBar() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  return (
    <div className="flex flex-row gap-0 border-b border-hb-border bg-hb-bg">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={cn(
            'px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] font-medium cursor-pointer transition-colors',
            activeTab === tab.key
              ? 'text-hb-accent border-b-2 border-hb-accent -mb-px'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
