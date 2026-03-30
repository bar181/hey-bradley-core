import { cn } from '@/lib/cn'
import { useUIStore, type RightPanelTab } from '@/store/uiStore'

const tabs: RightPanelTab[] = ['SIMPLE', 'EXPERT']

export function RightPanelTabBar() {
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const setRightPanelTab = useUIStore((s) => s.setRightPanelTab)

  return (
    <div className="flex border-b border-hb-border px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setRightPanelTab(tab)}
          className={cn(
            'py-2.5 px-3 font-mono text-xs uppercase tracking-[0.06em] cursor-pointer transition-colors',
            tab === rightPanelTab
              ? 'text-hb-accent border-b-2 border-hb-accent -mb-px font-medium'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
