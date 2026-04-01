import { useState } from 'react'
import { Palette, LayoutList, MessageSquare, Mic } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { SectionsSection } from './SectionsSection'
import { ChatInput } from '@/components/shell/ChatInput'

type LeftTab = 'builder' | 'chat' | 'listen'

const TABS = [
  { value: 'builder' as const, icon: LayoutList, label: 'Builder' },
  { value: 'chat' as const, icon: MessageSquare, label: 'Chat' },
  { value: 'listen' as const, icon: Mic, label: 'Listen' },
] as const

export function LeftPanel() {
  const [activeTab, setActiveTab] = useState<LeftTab>('builder')
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)

  const isThemeSelected = selectedContext?.type === 'theme'

  return (
    <div className="bg-hb-bg h-full flex flex-col">
      {/* Tab bar — 3 tabs */}
      <div className="flex border-b border-hb-border">
        {TABS.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
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
        <div className="flex-1 overflow-auto px-2 pt-3">
          {/* Theme row */}
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
              'flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors',
              isThemeSelected
                ? 'border-l-[3px] border-hb-accent bg-hb-accent-light'
                : 'bg-hb-surface hover:bg-hb-surface-hover'
            )}
          >
            <Palette size={14} className="text-hb-text-muted" />
            <span className="text-sm text-hb-text-primary">Theme</span>
          </div>

          {/* Divider */}
          <div className="border-t border-hb-border my-2 mx-1" />

          {/* Section rows */}
          <SectionsSection />
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInput />
        </div>
      )}

      {activeTab === 'listen' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Listen mode placeholder — will be wired in Phase 6 */}
          <div className="w-20 h-20 rounded-full bg-hb-accent/20 flex items-center justify-center mb-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-hb-accent/40 flex items-center justify-center">
              <Mic size={24} className="text-hb-accent" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-hb-text-primary mb-1">Listen Mode</h3>
          <p className="text-xs text-hb-text-muted leading-relaxed">
            Speak to Bradley and watch your website build in real-time. Coming in Phase 6.
          </p>
        </div>
      )}
    </div>
  )
}
