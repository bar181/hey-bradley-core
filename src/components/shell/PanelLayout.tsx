import { useEffect } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
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
    <div className="flex h-full relative">
      {/* Left panel — fixed width, toggle via display */}
      {leftPanelVisible && (
        <aside className="w-[320px] min-w-[280px] max-w-[320px] shrink-0 bg-hb-surface h-full overflow-y-auto border-r border-hb-border" aria-label="Builder tools">
          <LeftPanel />
        </aside>
      )}

      {/* Left panel toggle — at border between left panel and canvas */}
      <button
        type="button"
        onClick={() => {
          const store = useUIStore.getState()
          leftPanelVisible ? store.setLeftPanelVisible(false) : store.setLeftPanelVisible(true)
        }}
        className="hidden md:flex absolute top-2 z-20 w-5 h-8 items-center justify-center rounded-r bg-hb-surface border border-l-0 border-hb-border text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent transition-all focus-visible:ring-2 focus-visible:ring-hb-accent"
        style={{ left: leftPanelVisible ? '320px' : '0px' }}
        title={leftPanelVisible ? 'Hide left panel' : 'Show left panel'}
        aria-label={leftPanelVisible ? 'Hide left panel' : 'Show left panel'}
      >
        {leftPanelVisible ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Center + Right — resizable split */}
      <div className="flex-1 flex min-w-0">
        {rightPanelVisible ? (
          <PanelGroup orientation="horizontal" className="flex-1">
            <Panel defaultSize={70} minSize={40}>
              <main className="bg-hb-bg h-full overflow-hidden pl-3">
                <CenterCanvas />
              </main>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={30} minSize={15} collapsible>
              <aside className="bg-hb-surface h-full overflow-hidden border-l border-hb-border min-w-[200px]" aria-label="Section editor">
                <RightPanel />
              </aside>
            </Panel>
          </PanelGroup>
        ) : (
          <main className="flex-1 bg-hb-bg h-full overflow-hidden pl-3">
            <CenterCanvas />
          </main>
        )}

        {/* Right panel toggle — at right edge of canvas area */}
        <button
          type="button"
          onClick={() => {
            const store = useUIStore.getState()
            rightPanelVisible ? store.setRightPanelVisible(false) : store.setRightPanelVisible(true)
          }}
          className="hidden md:flex absolute top-2 right-0 z-20 w-5 h-8 items-center justify-center rounded-l bg-hb-surface border border-r-0 border-hb-border text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent transition-all focus-visible:ring-2 focus-visible:ring-hb-accent"
          style={{ right: rightPanelVisible ? undefined : '0px' }}
          title={rightPanelVisible ? 'Hide right panel' : 'Show right panel'}
          aria-label={rightPanelVisible ? 'Hide right panel' : 'Show right panel'}
        >
          {rightPanelVisible ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>
    </div>
  )
}
