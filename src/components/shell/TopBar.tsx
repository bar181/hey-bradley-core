import { Monitor, Tablet, Smartphone, Clock, Undo2, Redo2 } from 'lucide-react'
import { ModeToggle } from './ModeToggle'
import { useConfigStore } from '@/store/configStore'
import { useUIStore, type PreviewWidth } from '@/store/uiStore'

const DEVICE_BUTTONS: { icon: typeof Monitor; width: PreviewWidth }[] = [
  { icon: Monitor, width: 'desktop' },
  { icon: Tablet, width: 'tablet' },
  { icon: Smartphone, width: 'mobile' },
]

export function TopBar() {
  const undo = useConfigStore((s) => s.undo)
  const redo = useConfigStore((s) => s.redo)
  const canUndo = useConfigStore((s) => s.canUndo())
  const canRedo = useConfigStore((s) => s.canRedo())
  const previewWidth = useUIStore((s) => s.previewWidth)
  const setPreviewWidth = useUIStore((s) => s.setPreviewWidth)

  const handleDeviceClick = (width: PreviewWidth) => {
    setPreviewWidth(previewWidth === width ? 'full' : width)
  }

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-hb-bg border-b border-hb-border shrink-0">
      {/* Left: Logo + project name */}
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-hb-accent text-lg">HB</span>
        <span className="text-sm text-hb-text-secondary">Untitled Project</span>
      </div>

      {/* Center: Mode toggles + Version badge */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        <span className="bg-hb-accent-light text-hb-accent font-mono text-[10px] uppercase font-medium rounded-full px-2 py-0.5">
          V1.0.0-RC1
        </span>
      </div>

      {/* Right: Undo/Redo + Device toggles + Share */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-1 transition-colors ${canUndo ? 'text-hb-text-muted hover:text-hb-text-primary' : 'opacity-30 cursor-not-allowed text-hb-text-muted'}`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-1 transition-colors ${canRedo ? 'text-hb-text-muted hover:text-hb-text-primary' : 'opacity-30 cursor-not-allowed text-hb-text-muted'}`}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>
        <div className="w-px h-4 bg-hb-border mx-1" />
        {DEVICE_BUTTONS.map(({ icon: Icon, width }) => (
          <button
            key={width}
            onClick={() => handleDeviceClick(width)}
            className={`p-1 transition-colors ${
              previewWidth === width
                ? 'text-hb-accent'
                : 'text-hb-text-muted hover:text-hb-text-primary'
            }`}
            title={`Preview at ${width}`}
          >
            <Icon size={16} />
          </button>
        ))}
        <button
          className="p-1 text-hb-text-muted hover:text-hb-text-primary transition-colors opacity-50 cursor-not-allowed"
          title="Change History (coming soon)"
        >
          <Clock size={16} />
        </button>
        <button className="ml-2 border border-hb-border text-hb-text-secondary font-mono text-xs uppercase px-3 py-1 rounded hover:bg-hb-surface-hover transition-colors">
          Share
        </button>
      </div>
    </header>
  )
}
