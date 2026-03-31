import { Palette } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { Toggle } from '@/components/shared/Toggle'
import { SectionsSection } from './SectionsSection'
import { ChatInput } from '@/components/shell/ChatInput'

export function LeftPanel() {
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)
  const interactionMode = useUIStore((s) => s.interactionMode)
  const setInteractionMode = useUIStore((s) => s.setInteractionMode)

  const isThemeSelected = selectedContext?.type === 'theme'

  return (
    <div className="bg-hb-bg h-full flex flex-col">
      {/* Top: Navigation list */}
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
              : 'hover:bg-hb-surface-hover'
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

      {/* Bottom: Chat + Listen (pinned, always visible) */}
      <div className="border-t border-hb-border">
        <ChatInput />
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                interactionMode === 'LISTEN'
                  ? 'bg-hb-listen-orb'
                  : 'bg-hb-text-muted'
              )}
            />
            <span className="text-xs text-hb-text-muted">Listen</span>
          </div>
          <Toggle
            size="sm"
            enabled={interactionMode === 'LISTEN'}
            onChange={(enabled) =>
              setInteractionMode(enabled ? 'LISTEN' : 'BUILD')
            }
          />
        </div>
      </div>
    </div>
  )
}
