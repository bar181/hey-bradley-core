import { cn } from '@/lib/cn'
import { useUIStore, type InteractionMode } from '@/store/uiStore'

export function ModeToggle() {
  const interactionMode = useUIStore((s) => s.interactionMode)
  const setInteractionMode = useUIStore((s) => s.setInteractionMode)

  return (
    <div className="flex items-center rounded-full bg-hb-surface border border-hb-border p-0.5">
      {(['LISTEN', 'BUILD'] as InteractionMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => setInteractionMode(mode)}
          className={cn(
            'px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider transition-colors',
            interactionMode === mode
              ? 'bg-hb-accent text-white font-medium'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
          title={mode === 'LISTEN' ? 'Watch a guided demo of how the editor works.' : 'Build your own site by hand.'}
        >
          <span className="flex items-center gap-1.5">
            {mode === 'LISTEN' && interactionMode === 'LISTEN' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-hb-listen-orb" />
            )}
            {mode}
          </span>
        </button>
      ))}
    </div>
  )
}
