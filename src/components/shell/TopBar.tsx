import { Monitor, Tablet, Smartphone, Clock } from 'lucide-react'
import { ModeToggle } from './ModeToggle'

export function TopBar() {
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

      {/* Right: Device toggles + Share */}
      <div className="flex items-center gap-2">
        <button className="p-1 text-hb-text-muted hover:text-hb-text-primary transition-colors">
          <Monitor size={16} />
        </button>
        <button className="p-1 text-hb-text-muted hover:text-hb-text-primary transition-colors">
          <Tablet size={16} />
        </button>
        <button className="p-1 text-hb-text-muted hover:text-hb-text-primary transition-colors">
          <Smartphone size={16} />
        </button>
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
