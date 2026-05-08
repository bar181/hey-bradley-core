import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'
import { useUIStore } from '../../store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { TabBar } from './TabBar'
import { RealityTab } from './RealityTab'
import { DataTab } from './DataTab'
import { XAIDocsTab } from './XAIDocsTab'
import { ConversationLogTab } from './ConversationLogTab'

export function CenterCanvas() {
  const activeTab = useUIStore((s) => s.activeTab)
  const isPreviewMode = useUIStore((s) => s.isPreviewMode)
  const sectionsCount = useConfigStore((s) => s.config.sections.length)
  const initialSectionsRef = useRef<number | null>(null)

  useEffect(() => {
    if (initialSectionsRef.current === null) {
      initialSectionsRef.current = sectionsCount
      return
    }
    const ui = useUIStore.getState()
    if (ui.specPanelHasAutoOpened) {
      if (sectionsCount !== initialSectionsRef.current) ui.markSpecChanged()
      return
    }
    if (sectionsCount > initialSectionsRef.current) {
      ui.setRightPanelTab('EXPERT')
      ui.setActiveTab('XAI_DOCS')
      ui.markSpecAutoOpened()
    }
  }, [sectionsCount])

  if (isPreviewMode) {
    return (
      <div className="h-full overflow-auto">
        <RealityTab />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <TabBar />
      {/* Loop 2 / Builder lift — wrap REALITY in a subtle "preview frame"
          (rounded card + drop shadow + breathing room) so the canvas reads as
          a real site preview, not a tiny iframe. Other tabs keep their flat
          chrome since they're tool surfaces, not previews.
          Loop 4 polish — subtle dot-grid backdrop (Linear / Figma blank-canvas
          tell) + tiny "Live preview" caption with green pulse dot above the
          frame so the canvas reads as a real product surface, not dead space. */}
      <div
        className={cn(
          'flex-1 overflow-auto relative',
          activeTab === 'REALITY' ? 'bg-hb-bg p-4 pt-2' : 'p-4 bg-hb-surface-hover'
        )}
        style={
          activeTab === 'REALITY'
            ? {
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }
            : undefined
        }
      >
        {activeTab === 'REALITY' && (
          <>
            <div
              className="mx-auto mb-2 flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-hb-text-muted/70"
              aria-hidden="true"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400/80 animate-pulse" />
              Live preview
            </div>
            <div className="mx-auto rounded-lg border border-hb-border bg-hb-bg shadow-xl ring-1 ring-black/5 overflow-hidden">
              <RealityTab />
            </div>
          </>
        )}
        {activeTab === 'XAI_DOCS' && <XAIDocsTab />}
        {activeTab === 'DATA' && <DataTab />}
        {activeTab === 'CONVERSATION_LOG' && <ConversationLogTab />}
      </div>
    </div>
  )
}
