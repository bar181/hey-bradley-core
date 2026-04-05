import { cn } from '../../lib/cn'
import { useUIStore } from '../../store/uiStore'
import { TabBar } from './TabBar'
import { RealityTab } from './RealityTab'
import { DataTab } from './DataTab'
import { XAIDocsTab } from './XAIDocsTab'
import { AISPTab } from './AISPTab'
import { WorkflowTab } from './WorkflowTab'

export function CenterCanvas() {
  const activeTab = useUIStore((s) => s.activeTab)
  const isPreviewMode = useUIStore((s) => s.isPreviewMode)

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
        {activeTab === 'AISP' && <AISPTab />}
        {activeTab === 'WORKFLOW' && <WorkflowTab />}
      </div>
    </div>
  )
}
