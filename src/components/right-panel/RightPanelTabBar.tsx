import { cn } from '@/lib/cn'
import { useUIStore, type RightPanelTab } from '@/store/uiStore'
import { Tooltip } from '@/components/ui/Tooltip'

const tabs: { key: RightPanelTab; tip: string }[] = [
  { key: 'SIMPLE', tip: 'Basic editing controls' },
  { key: 'EXPERT', tip: 'Advanced developer options' },
]

export function RightPanelTabBar() {
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const setRightPanelTab = useUIStore((s) => s.setRightPanelTab)

  return (
    <div className="flex border-b border-hb-border px-4">
      {tabs.map(({ key, tip }) => (
        <Tooltip key={key} content={tip} position="bottom">
          <button
            type="button"
            onClick={() => setRightPanelTab(key)}
            className={cn(
              'py-2.5 px-3 font-mono text-xs uppercase tracking-[0.06em] cursor-pointer transition-colors',
              key === rightPanelTab
                ? 'text-hb-accent border-b-2 border-hb-accent -mb-px font-medium'
                : 'text-hb-text-muted hover:text-hb-text-secondary'
            )}
          >
            {key}
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
