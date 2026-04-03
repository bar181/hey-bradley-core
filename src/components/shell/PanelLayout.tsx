import { useEffect } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { X } from 'lucide-react'
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

  // Auto-enter preview mode when opened via a shared preview link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('preview') === '1') {
      useUIStore.getState().setPreviewMode(true)
    }
  }, [])

  if (isPreviewMode) {
    return (
      <div className="h-full overflow-auto relative">
        {/* Floating exit button */}
        <button
          type="button"
          onClick={() => useUIStore.getState().setPreviewMode(false)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/90 transition-colors border border-white/10 shadow-lg"
        >
          <X size={14} />
          Exit Preview
        </button>
        <CenterCanvas />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Left panel — fixed 320px */}
      <aside className="w-[320px] min-w-[280px] max-w-[320px] shrink-0 bg-hb-surface h-full overflow-hidden border-r border-hb-border" aria-label="Builder tools">
        <LeftPanel />
      </aside>

      {/* Center + Right — fill remaining */}
      {rightPanelVisible ? (
        <PanelGroup orientation="horizontal" className="flex-1">
          <Panel defaultSize={70} minSize={40}>
            <main className="bg-hb-bg h-full overflow-hidden">
              <CenterCanvas />
            </main>
          </Panel>
          <ResizeHandle />
          <Panel defaultSize={30} minSize={15} collapsible>
            <aside className="bg-hb-surface h-full overflow-hidden border-l border-hb-border" aria-label="Section editor">
              <RightPanel />
            </aside>
          </Panel>
        </PanelGroup>
      ) : (
        <main className="flex-1 bg-hb-bg h-full overflow-hidden">
          <CenterCanvas />
        </main>
      )}
    </div>
  )
}
