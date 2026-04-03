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
  const rightPanelVisible = useUIStore((s) => s.rightPanelVisible)

  if (isPreviewMode) {
    return (
      <div className="h-full overflow-auto">
        <CenterCanvas />
      </div>
    )
  }

  return (
    <PanelGroup orientation="horizontal">
      <Panel defaultSize={20} minSize={15} maxSize={25} collapsible>
        <aside className="bg-hb-surface h-full overflow-hidden border-r border-hb-border max-w-[320px]" aria-label="Builder tools">
          <LeftPanel />
        </aside>
      </Panel>

      <ResizeHandle />

      <Panel defaultSize={rightPanelVisible ? 55 : 80} minSize={30}>
        <main className="bg-hb-bg h-full overflow-hidden">
          <CenterCanvas />
        </main>
      </Panel>

      {rightPanelVisible && (
        <>
          <ResizeHandle />
          <Panel defaultSize={25} minSize={15} collapsible>
            <aside className="bg-hb-surface h-full overflow-hidden border-l border-hb-border" aria-label="Section editor">
              <RightPanel />
            </aside>
          </Panel>
        </>
      )}
    </PanelGroup>
  )
}
