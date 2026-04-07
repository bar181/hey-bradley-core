import { X } from 'lucide-react'
import { shortcuts } from '@/hooks/useKeyboardShortcuts'

function formatKey(shortcut: typeof shortcuts[number]): string {
  const parts: string[] = []
  if (shortcut.ctrl) parts.push('Ctrl')
  parts.push(shortcut.key === 'Escape' ? 'Esc' : shortcut.key.toUpperCase())
  return parts.join('+')
}

interface ShortcutHelpProps {
  open: boolean
  onClose: () => void
}

export function ShortcutHelp({ open, onClose }: ShortcutHelpProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div className="bg-hb-surface border border-hb-border rounded-xl shadow-2xl w-80 max-w-[90vw]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-hb-border">
          <h2 className="text-sm font-semibold text-hb-text-primary">Keyboard Shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-hb-text-muted hover:text-hb-text-primary hover:bg-hb-surface-hover transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-4 py-3 space-y-2">
          {shortcuts.map((s) => (
            <div key={s.action} className="flex items-center justify-between">
              <span className="text-xs text-hb-text-secondary">{s.label}</span>
              <kbd className="px-2 py-0.5 text-[11px] font-mono bg-hb-bg border border-hb-border rounded text-hb-text-primary">
                {formatKey(s)}
              </kbd>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-xs text-hb-text-secondary">Undo</span>
            <kbd className="px-2 py-0.5 text-[11px] font-mono bg-hb-bg border border-hb-border rounded text-hb-text-primary">
              Ctrl+Z
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-hb-text-secondary">Redo</span>
            <kbd className="px-2 py-0.5 text-[11px] font-mono bg-hb-bg border border-hb-border rounded text-hb-text-primary">
              Ctrl+Shift+Z
            </kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
