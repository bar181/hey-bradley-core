import { useUIStore } from '../../store/uiStore'
import { TabBar } from './TabBar'
import { RealityTab } from './RealityTab'
import { DataTab } from './DataTab'
import { XAIDocsTab } from './XAIDocsTab'
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
      <div className="flex-1 overflow-auto p-4 bg-hb-surface-hover">
        {activeTab === 'REALITY' && <RealityTab />}
        {activeTab === 'DATA' && <DataTab />}
        {activeTab === 'XAI_DOCS' && <XAIDocsTab />}
        {activeTab === 'WORKFLOW' && <WorkflowTab />}
      </div>
    </div>
  )
}
