import { useState } from 'react'
import { cn } from '../../lib/cn'
import { useUIStore, type ActiveTab } from '../../store/uiStore'
import { Code2 } from 'lucide-react'

const SIMPLE_TABS: { key: ActiveTab; label: string }[] = [
  { key: 'REALITY', label: 'Preview' },
]

const DEV_TABS: { key: ActiveTab; label: string }[] = [
  { key: 'DATA', label: 'Data' },
  { key: 'XAI_DOCS', label: 'Specs' },
  { key: 'WORKFLOW', label: 'Pipeline' },
]

export function TabBar() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const [devMode, setDevMode] = useState(false)

  const visibleTabs = devMode ? [...SIMPLE_TABS, ...DEV_TABS] : SIMPLE_TABS

  return (
    <div className="flex flex-row gap-0 border-b border-hb-border bg-hb-bg items-center">
      {visibleTabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={cn(
            'px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors',
            activeTab === tab.key
              ? 'text-hb-accent border-b-2 border-hb-accent -mb-px'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          {tab.label}
        </button>
      ))}
      <div className="ml-auto pr-2">
        <button
          onClick={() => {
            setDevMode(!devMode)
            if (devMode) setActiveTab('REALITY')
          }}
          className={cn(
            'p-1.5 rounded transition-colors',
            devMode
              ? 'text-hb-accent bg-hb-accent/10'
              : 'text-hb-text-muted/40 hover:text-hb-text-muted'
          )}
          title={devMode ? 'Hide developer tabs' : 'Show developer tabs'}
          aria-label={devMode ? 'Hide developer tabs' : 'Show developer tabs'}
        >
          <Code2 size={13} />
        </button>
      </div>
    </div>
  )
}
