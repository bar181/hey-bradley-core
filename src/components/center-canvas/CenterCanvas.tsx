import { useUIStore } from '../../store/uiStore'
import { TabBar } from './TabBar'
import { RealityTab } from './RealityTab'
import { DataTab } from './DataTab'
import { XAIDocsTab } from './XAIDocsTab'
import { WorkflowTab } from './WorkflowTab'

export function CenterCanvas() {
  const activeTab = useUIStore((s) => s.activeTab)

  return (
    <div className="h-full flex flex-col">
      <TabBar />
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'REALITY' && <RealityTab />}
        {activeTab === 'DATA' && <DataTab />}
        {activeTab === 'XAI_DOCS' && <XAIDocsTab />}
        {activeTab === 'WORKFLOW' && <WorkflowTab />}
      </div>
    </div>
  )
}
