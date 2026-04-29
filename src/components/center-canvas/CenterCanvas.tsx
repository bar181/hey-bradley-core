import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'
import { useUIStore } from '../../store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { TabBar } from './TabBar'
import { RealityTab } from './RealityTab'
import { DataTab } from './DataTab'
import { XAIDocsTab } from './XAIDocsTab'
import { WorkflowTab } from './WorkflowTab'
import { ResourcesTab } from './ResourcesTab'
import { ConversationLogTab } from './ConversationLogTab'

export function CenterCanvas() {
  const activeTab = useUIStore((s) => s.activeTab)
  const isPreviewMode = useUIStore((s) => s.isPreviewMode)
  // P55 Sprint L (A2) — first-patch auto-open of the spec panel.
  const sectionsCount = useConfigStore((s) => s.config.sections.length)
  const initialSectionsRef = useRef<number | null>(null)

  useEffect(() => {
    // Capture the initial section count on first render so we can detect a
    // strict increase (a real patch landed). Avoids treating the bootstrap
    // hydration as a "first patch".
    if (initialSectionsRef.current === null) {
      initialSectionsRef.current = sectionsCount
      return
    }
    const ui = useUIStore.getState()
    if (ui.specPanelHasAutoOpened) {
      // Subsequent patches still flag spec as having unseen updates.
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
      <div className={cn('flex-1 overflow-auto', activeTab === 'REALITY' ? 'bg-hb-bg' : 'p-4 bg-hb-surface-hover')}>
        {activeTab === 'REALITY' && <RealityTab />}
        {activeTab === 'DATA' && <DataTab />}
        {activeTab === 'XAI_DOCS' && <XAIDocsTab />}
        {activeTab === 'RESOURCES' && <ResourcesTab />}
        {activeTab === 'WORKFLOW' && <WorkflowTab />}
        {activeTab === 'CONVERSATION_LOG' && <ConversationLogTab />}
      </div>
    </div>
  )
}
