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

function PanelToggle({ side, visible, onClick }: { side: 'left' | 'right'; visible: boolean; onClick: () => void }) {
  const Icon = side === 'left'
    ? (visible ? PanelLeftClose : PanelLeftOpen)
    : (visible ? PanelRightClose : PanelRightOpen)

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed z-40 flex items-center justify-center w-7 h-7 rounded-md bg-hb-surface/90 backdrop-blur-sm border border-hb-border text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent transition-all shadow-sm"
      style={side === 'left' ? { left: visible ? 4 : 4, top: 52 } : { right: visible ? 4 : 4, top: 52 }}
      title={`${visible ? 'Hide' : 'Show'} ${side} panel`}
    >
      <Icon size={14} />
    </button>
  )
}

export function PanelLayout() {
  const isPreviewMode = useUIStore((s) => s.isPreviewMode)
  const leftPanelVisible = useUIStore((s) => s.leftPanelVisible)
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
    <div className="flex h-full relative">
      {/* Panel toggle buttons */}
      <PanelToggle
        side="left"
        visible={leftPanelVisible}
        onClick={() => useUIStore.getState().setLeftPanelVisible(!leftPanelVisible)}
      />
      <PanelToggle
        side="right"
        visible={rightPanelVisible}
        onClick={() => useUIStore.getState().setRightPanelVisible(!rightPanelVisible)}
      />

      <PanelGroup orientation="horizontal" className="flex-1">
        {/* Left panel — resizable, collapsible */}
        {leftPanelVisible && (
          <>
            <Panel defaultSize={20} minSize={15} maxSize={35} collapsible>
              <aside className="bg-hb-surface h-full overflow-hidden border-r border-hb-border" aria-label="Builder tools">
                <LeftPanel />
              </aside>
            </Panel>
            <ResizeHandle />
          </>
        )}

        {/* Center canvas — fills remaining space */}
        <Panel defaultSize={leftPanelVisible && rightPanelVisible ? 55 : leftPanelVisible || rightPanelVisible ? 70 : 100} minSize={30}>
          <main className="bg-hb-bg h-full overflow-hidden">
            <CenterCanvas />
          </main>
        </Panel>

        {/* Right panel — resizable, collapsible */}
        {rightPanelVisible && (
          <>
            <ResizeHandle />
            <Panel defaultSize={25} minSize={15} maxSize={40} collapsible>
              <aside className="bg-hb-surface h-full overflow-hidden border-l border-hb-border" aria-label="Section editor">
                <RightPanel />
              </aside>
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  )
}
