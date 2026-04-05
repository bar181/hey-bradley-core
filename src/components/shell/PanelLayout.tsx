import { useEffect } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { X, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'
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
  const leftPanelVisible = useUIStore((s) => s.leftPanelVisible)
  const rightPanelVisible = useUIStore((s) => s.rightPanelVisible)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('preview') === '1') {
      useUIStore.getState().setPreviewMode(true)
    }
  }, [])

  if (isPreviewMode) {
    return (
      <div className="h-full overflow-auto relative">
        <button
          type="button"
          onClick={() => useUIStore.getState().setPreviewMode(false)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/90 transition-colors border border-white/10 shadow-lg focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Exit preview mode"
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
      {/* Left panel — fixed width, toggle via display */}
      {leftPanelVisible && (
        <aside className="w-[320px] min-w-[280px] max-w-[320px] shrink-0 bg-hb-surface h-full overflow-y-auto border-r border-hb-border relative" aria-label="Builder tools">
          <LeftPanel />
          {/* Collapse button inside left panel */}
          <button
            type="button"
            onClick={() => useUIStore.getState().setLeftPanelVisible(false)}
            className="absolute top-2 right-2 z-10 w-6 h-6 rounded-md bg-hb-surface border border-hb-border text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-hb-accent"
            title="Hide left panel"
            aria-label="Hide left panel"
          >
            <PanelLeftClose size={12} />
          </button>
        </aside>
      )}

      {/* Show left panel button when collapsed */}
      {!leftPanelVisible && (
        <button
          type="button"
          onClick={() => useUIStore.getState().setLeftPanelVisible(true)}
          className="w-8 shrink-0 bg-hb-surface border-r border-hb-border flex items-center justify-center text-hb-text-muted hover:text-hb-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent"
          title="Show left panel"
          aria-label="Show left panel"
        >
          <PanelLeftOpen size={14} />
        </button>
      )}

      {/* Center + Right — resizable split */}
      {rightPanelVisible ? (
        <PanelGroup orientation="horizontal" className="flex-1">
          <Panel defaultSize={70} minSize={40}>
            <main className="bg-hb-bg h-full overflow-hidden">
              <CenterCanvas />
            </main>
          </Panel>
          <ResizeHandle />
          <Panel defaultSize={30} minSize={15} collapsible>
            <aside className="bg-hb-surface h-full overflow-hidden border-l border-hb-border relative" aria-label="Section editor">
              <RightPanel />
              {/* Collapse button inside right panel */}
              <button
                type="button"
                onClick={() => useUIStore.getState().setRightPanelVisible(false)}
                className="absolute top-2 left-2 z-10 w-6 h-6 rounded-md bg-hb-surface border border-hb-border text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-hb-accent"
                title="Hide right panel"
                aria-label="Hide right panel"
              >
                <PanelRightClose size={12} />
              </button>
            </aside>
          </Panel>
        </PanelGroup>
      ) : (
        <div className="flex-1 flex">
          <main className="flex-1 bg-hb-bg h-full overflow-hidden">
            <CenterCanvas />
          </main>
          {/* Show right panel button when collapsed */}
          <button
            type="button"
            onClick={() => useUIStore.getState().setRightPanelVisible(true)}
            className="w-8 shrink-0 bg-hb-surface border-l border-hb-border flex items-center justify-center text-hb-text-muted hover:text-hb-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent"
            title="Show right panel"
            aria-label="Show right panel"
          >
            <PanelRightOpen size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
