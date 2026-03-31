import { useState } from 'react'
import { Palette, LayoutList, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { SectionsSection } from './SectionsSection'
import { ChatInput } from '@/components/shell/ChatInput'

type LeftTab = 'builder' | 'chat'

export function LeftPanel() {
  const [activeTab, setActiveTab] = useState<LeftTab>('builder')
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)

  const isThemeSelected = selectedContext?.type === 'theme'

  return (
    <div className="bg-hb-bg h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-hb-border">
        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
            activeTab === 'builder'
              ? 'text-hb-accent border-b-2 border-hb-accent'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          <LayoutList size={13} />
          Builder
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
            activeTab === 'chat'
              ? 'text-hb-accent border-b-2 border-hb-accent'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          <MessageSquare size={13} />
          Chat
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'builder' ? (
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
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInput />
        </div>
      )}
    </div>
  )
}
