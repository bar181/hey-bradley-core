import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { CenterCanvas } from '@/components/center-canvas/CenterCanvas'
import { LeftPanel } from '@/components/left-panel/LeftPanel'
import { RightPanel } from '@/components/right-panel/RightPanel'
import { useUIStore } from '@/store/uiStore'

function ResizeHandle() {
  return (
    <PanelResizeHandle className="w-1 flex items-center justify-center group cursor-col-resize">
      <div className="w-px h-full bg-hb-border group-hover:bg-hb-accent transition-colors" />
    </PanelResizeHandle>
  )
}

export function PanelLayout() {
  const isPreviewMode = useUIStore((s) => s.isPreviewMode)

  if (isPreviewMode) {
    return (
      <div className="h-full overflow-auto">
        <CenterCanvas />
      </div>
    )
  }

  return (
    <PanelGroup orientation="horizontal">
      <Panel defaultSize={20} minSize={15} collapsible>
        <div className="bg-hb-surface h-full overflow-hidden border-r border-hb-border">
          <LeftPanel />
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
        <div className="bg-hb-surface h-full overflow-hidden border-l border-hb-border">
          <RightPanel />
        </div>
      </Panel>
    </PanelGroup>
  )
}
