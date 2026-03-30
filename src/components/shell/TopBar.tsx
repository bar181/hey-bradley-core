import { Monitor, Tablet, Smartphone, Clock, Undo2, Redo2, Sun, Moon } from 'lucide-react'
import { ModeToggle } from './ModeToggle'
import { useConfigStore } from '@/store/configStore'
import { useUIStore, type PreviewWidth } from '@/store/uiStore'
import { useState, useEffect } from 'react'

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

  // Site chrome dark/light mode
  const [chromeLight, setChromeLight] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('light-chrome', chromeLight)
  }, [chromeLight])

  const handleDeviceClick = (width: PreviewWidth) => {
    setPreviewWidth(previewWidth === width ? 'full' : width)
  }

  return (
    <header
      className="h-12 flex items-center justify-between px-4 border-b border-hb-border shrink-0 transition-colors"
      style={{ backgroundColor: 'var(--hb-nav-bg, #1a0a0e)' }}
    >
      {/* Left: Logo + project name */}
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-white text-lg">HB</span>
        <span className="text-sm text-white/70">Untitled Project</span>
      </div>

      {/* Center: Mode toggles + Version badge */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        <span className="bg-white/10 text-white/80 font-mono text-xs uppercase font-medium rounded-full px-2 py-0.5">
          V1.0.0-RC1
        </span>
      </div>

      {/* Right: Chrome toggle + Undo/Redo + Device toggles + Share */}
      <div className="flex items-center gap-2">
        {/* Site dark/light toggle */}
        <button
          onClick={() => setChromeLight(!chromeLight)}
          className="p-1 text-white/60 hover:text-white transition-colors"
          title={chromeLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {chromeLight ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-1 transition-colors ${canUndo ? 'text-white/60 hover:text-white' : 'opacity-30 cursor-not-allowed text-white/40'}`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-1 transition-colors ${canRedo ? 'text-white/60 hover:text-white' : 'opacity-30 cursor-not-allowed text-white/40'}`}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        {DEVICE_BUTTONS.map(({ icon: Icon, width }) => (
          <button
            key={width}
            onClick={() => handleDeviceClick(width)}
            className={`p-1 transition-colors ${
              previewWidth === width
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
            title={`Preview at ${width}`}
          >
            <Icon size={16} />
          </button>
        ))}
        <button
          className="p-1 text-white/40 transition-colors opacity-50 cursor-not-allowed"
          title="Change History (coming soon)"
        >
          <Clock size={16} />
        </button>
        <button className="ml-2 border border-white/20 text-white/80 font-mono text-xs uppercase px-3 py-1 rounded hover:bg-white/10 transition-colors">
          Share
        </button>
      </div>
    </header>
  )
}
