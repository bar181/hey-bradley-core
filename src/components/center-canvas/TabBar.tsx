import { useEffect } from 'react'
import { cn } from '../../lib/cn'
import { useUIStore, type ActiveTab } from '../../store/uiStore'
import { Tooltip } from '../ui/Tooltip'

// P121.5 — Simplified to two primary tabs: Preview + Agentics.
// EXPERT mode unlocks Data/Log as utility tabs in a secondary row.
const PRIMARY_TABS: { key: ActiveTab; label: string; tip: string }[] = [
  { key: 'REALITY', label: 'Preview', tip: 'Live site preview' },
  { key: 'XAI_DOCS', label: 'Agentics', tip: 'Specs, blueprints, and build tools' },
]

const UTILITY_TABS: { key: ActiveTab; label: string; tip: string }[] = [
  { key: 'DATA', label: 'Data', tip: 'Raw JSON configuration' },
  { key: 'CONVERSATION_LOG', label: 'Log', tip: 'Conversation log' },
]

export function TabBar() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const specHasUnseenUpdate = useUIStore((s) => s.specHasUnseenUpdate)
  const isExpert = rightPanelTab === 'EXPERT'

  // Fallback: if current tab not visible, snap to Preview
  useEffect(() => {
    const allVisible = [...PRIMARY_TABS, ...(isExpert ? UTILITY_TABS : [])]
    if (!allVisible.some((t) => t.key === activeTab)) {
      setActiveTab('REALITY')
    }
  }, [isExpert, activeTab, setActiveTab])

  return (
    <div className="border-b border-hb-border bg-hb-bg">
      <div role="tablist" aria-label="Canvas tabs" className="flex items-center">
        {/* Primary tabs — always visible */}
        {PRIMARY_TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const isAgentics = tab.key === 'XAI_DOCS'
          return (
            <Tooltip key={tab.key} content={tab.tip} position="bottom">
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-5 py-3 text-sm font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-hb-accent',
                  isActive
                    ? 'text-hb-accent border-b-2 border-hb-accent -mb-px'
                    : 'text-hb-text-muted hover:text-hb-text-secondary'
                )}
              >
                {tab.label}
                {isAgentics && !isActive && specHasUnseenUpdate && (
                  <span data-testid="spec-unseen-indicator" aria-label="Spec updated"
                    className="ml-1 inline-block w-2 h-2 rounded-full bg-hb-accent" />
                )}
              </button>
            </Tooltip>
          )
        })}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Utility tabs — EXPERT only, smaller, right-aligned */}
        {isExpert && UTILITY_TABS.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <Tooltip key={tab.key} content={tab.tip} position="bottom">
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-3 py-3 text-xs font-medium cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent',
                  isActive
                    ? 'text-hb-accent border-b-2 border-hb-accent -mb-px'
                    : 'text-hb-text-muted hover:text-hb-text-secondary'
                )}
              >
                {tab.label}
              </button>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
