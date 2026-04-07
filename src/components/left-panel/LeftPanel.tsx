import { Palette, LayoutList, MessageSquare, Mic, Settings } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import type { LeftPanelTab } from '@/store/uiStore'
import { SectionsSection } from './SectionsSection'
import { ChatInput } from '@/components/shell/ChatInput'
import { ListenTab } from './ListenTab'
import { Tooltip } from '@/components/ui/Tooltip'

const TABS = [
  { value: 'builder' as const, icon: LayoutList, label: 'Builder' },
  { value: 'chat' as const, icon: MessageSquare, label: 'Chat' },
  { value: 'listen' as const, icon: Mic, label: 'Listen' },
] as const

export function LeftPanel() {
  const activeTab = useUIStore((s) => s.leftPanelTab)
  const setLeftPanelTab = useUIStore((s) => s.setLeftPanelTab)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)
  const setRightPanelVisible = useUIStore((s) => s.setRightPanelVisible)

  const handleTabChange = (tab: LeftPanelTab) => {
    setLeftPanelTab(tab)
    // Hide right panel in Chat/Listen mode, show in Builder
    setRightPanelVisible(tab === 'builder')
  }

  const isThemeSelected = selectedContext?.type === 'theme'
  const isSiteContextSelected = selectedContext?.type === 'site-context'

  return (
    <div className="bg-hb-bg h-full flex flex-col">
      {/* Tab bar — 3 tabs */}
      <div role="tablist" aria-label="Left panel tabs" className="flex border-b border-hb-border">
        {TABS.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={activeTab === value}
            onClick={() => handleTabChange(value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded-t',
              activeTab === value
                ? 'text-hb-accent border-b-2 border-hb-accent'
                : 'text-hb-text-muted hover:text-hb-text-secondary'
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'builder' && (
        <div className="flex-1 overflow-auto px-3 pt-3 animate-fade-in-up" data-builder-panel>
          {/* Site Settings row */}
          <Tooltip content="Configure site purpose, audience, and tone" position="right">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedContext({ type: 'site-context' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedContext({ type: 'site-context' })
                }
              }}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors border border-transparent mb-1',
                isSiteContextSelected
                  ? 'bg-hb-accent text-white border-hb-accent'
                  : 'bg-hb-surface hover:bg-hb-surface-hover border-hb-accent/25'
              )}
            >
              <Settings size={14} className={isSiteContextSelected ? 'text-white/70' : 'text-hb-text-muted'} />
              <span className={cn('text-sm', isSiteContextSelected ? 'text-white font-medium' : 'text-hb-text-primary')}>Site Settings</span>
            </div>
          </Tooltip>

          {/* Theme row */}
          <Tooltip content="Choose visual theme and colors" position="right">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedContext({ type: 'theme' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedContext({ type: 'theme' })
                }
              }}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors border border-transparent',
                isThemeSelected
                  ? 'bg-hb-accent text-white border-hb-accent'
                  : 'bg-hb-surface hover:bg-hb-surface-hover border-hb-accent/25'
              )}
            >
              <Palette size={14} className={isThemeSelected ? 'text-white/70' : 'text-hb-text-muted'} />
              <span className={cn('text-sm', isThemeSelected ? 'text-white font-medium' : 'text-hb-text-primary')}>Theme</span>
            </div>
          </Tooltip>

          {/* Divider */}
          <div className="border-t border-hb-border my-2 mx-1" />

          {/* Section rows */}
          <SectionsSection />
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden animate-fade-in-up">
          <ChatInput />
        </div>
      )}

      {activeTab === 'listen' && <div className="animate-fade-in-up flex-1"><ListenTab /></div>}
    </div>
  )
}
