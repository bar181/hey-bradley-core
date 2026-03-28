import { useUIStore } from '../../store/uiStore'

export function StatusBar() {
  const complexityMode = useUIStore((s) => s.complexityMode)

  return (
    <footer className="h-6 flex items-center justify-between px-4 bg-hb-surface border-t border-hb-border font-mono text-[11px] uppercase tracking-wide text-hb-text-muted shrink-0">
      {/* Left: Status + spec version */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hb-success" />
          Ready
        </span>
        <span>AISP Spec V1.2</span>
      </div>

      {/* Right: Mode info */}
      <span>Mode: {complexityMode} Connected</span>
    </footer>
  )
}
