import { useUIStore } from '@/store/uiStore'

export function StatusBar() {
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)

  return (
    <footer className="h-6 flex items-center justify-between px-4 bg-hb-surface border-t border-hb-border font-mono text-xs uppercase tracking-wide text-hb-text-muted shrink-0">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hb-success" />
          Ready
        </span>
        <span>AISP Spec V1.2</span>
      </div>
      <span>Tab: {rightPanelTab} Connected</span>
    </footer>
  )
}
