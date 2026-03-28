import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { useUIStore } from '@/store/uiStore'
import { CenterCanvas } from '@/components/center-canvas/CenterCanvas'
import { DraftPanel } from '@/components/left-panel/DraftPanel'
import { ExpertPanel } from '@/components/left-panel/ExpertPanel'
import { DraftContext } from '@/components/right-panel/DraftContext'
import { ExpertContext } from '@/components/right-panel/ExpertContext'
import { ChatInput } from './ChatInput'

function ResizeHandle() {
  return (
    <PanelResizeHandle className="w-1.5 flex items-center justify-center group">
      <div className="w-px h-full bg-hb-border group-hover:bg-hb-accent transition-colors" />
    </PanelResizeHandle>
  )
}

export function PanelLayout() {
  const complexityMode = useUIStore((s) => s.complexityMode)

  return (
    <PanelGroup orientation="horizontal">
      <Panel defaultSize={20} minSize={15} collapsible>
        <div className="bg-hb-bg h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            {complexityMode === 'DRAFT' ? <DraftPanel /> : <ExpertPanel />}
          </div>
          <ChatInput />
        </div>
      </Panel>

      <ResizeHandle />

      <Panel defaultSize={55} minSize={30}>
        <div className="bg-hb-bg h-full overflow-hidden">
          <CenterCanvas />
        </div>
      </Panel>

      <ResizeHandle />

      <Panel defaultSize={25} minSize={15} collapsible>
        <div className="bg-hb-bg h-full overflow-auto">
          {complexityMode === 'DRAFT' ? <DraftContext /> : <ExpertContext />}
        </div>
      </Panel>
    </PanelGroup>
  )
}
