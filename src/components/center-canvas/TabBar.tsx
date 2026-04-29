import { useEffect } from 'react'
import { cn } from '../../lib/cn'
import { useUIStore, type ActiveTab } from '../../store/uiStore'
import { FileText } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'

// DRAFT mode shows only Reality + Data (read-only). EXPERT shows all.
// See plans/implementation/mvp-plan/01-phase-15-polish-kitchen-sink.md §1.1.
const TABS: { key: ActiveTab; label: string; expert?: boolean; tip: string; title: string }[] = [
  { key: 'REALITY', label: 'Preview', tip: 'Live site preview', title: 'See your live page.' },
  { key: 'XAI_DOCS', label: 'Blueprints', expert: true, tip: 'Generated specifications', title: 'View the generated specs and plans for your site.' },
  { key: 'RESOURCES', label: 'Resources', expert: true, tip: 'Templates, AISP guide, media library', title: 'Browse templates, images, and helper guides.' },
  { key: 'DATA', label: 'Data', tip: 'Raw JSON configuration', title: 'View the JSON behind your page.' },
  { key: 'WORKFLOW', label: 'Pipeline', expert: true, tip: 'Build workflow visualization', title: 'Watch the build steps for your site.' },
  { key: 'CONVERSATION_LOG', label: 'Log', expert: true, tip: 'Conversation log (chat + LLM audit)', title: 'See every prompt + reply with provider + personality.' },
]

export function TabBar() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const isExpert = rightPanelTab === 'EXPERT'

  const visibleTabs = TABS.filter((tab) => !tab.expert || isExpert)

  // Active-tab fallback: if the current tab is hidden in DRAFT, snap to Reality.
  useEffect(() => {
    if (!visibleTabs.some((t) => t.key === activeTab)) {
      setActiveTab('REALITY')
    }
  }, [isExpert, activeTab, setActiveTab, visibleTabs])

  return (
    <div role="tablist" aria-label="Canvas tabs" className="flex flex-row gap-0 border-b border-hb-border bg-hb-bg items-center">
      {visibleTabs.map((tab) => {
        const isSpecs = tab.key === 'XAI_DOCS'
        const isActive = activeTab === tab.key

        return (
          <Tooltip key={tab.key} content={tab.tip} position="bottom">
            <button
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-hb-accent rounded-t',
                isActive
                  ? 'text-hb-accent border-b-2 border-hb-accent -mb-px'
                  : isSpecs
                    ? 'text-hb-accent/70 hover:text-hb-accent'
                    : 'text-hb-text-muted hover:text-hb-text-secondary'
              )}
              title={tab.title}
            >
              {isSpecs && <FileText size={12} />}
              {tab.label}
              {isSpecs && !isActive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-hb-accent/60" />
              )}
            </button>
          </Tooltip>
        )
      })}
    </div>
  )
}
