import { cn } from '../../lib/cn'
import { useUIStore, type InteractionMode, type ComplexityMode } from '../../store/uiStore'

export function ModeToggle() {
  const interactionMode = useUIStore((s) => s.interactionMode)
  const complexityMode = useUIStore((s) => s.complexityMode)
  const setInteractionMode = useUIStore((s) => s.setInteractionMode)
  const setComplexityMode = useUIStore((s) => s.setComplexityMode)

  return (
    <div className="flex items-center gap-6">
      {/* Interaction Mode: LISTEN / BUILD */}
      <div className="flex items-center rounded-full bg-hb-surface border border-hb-border p-0.5">
        {(['LISTEN', 'BUILD'] as InteractionMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setInteractionMode(mode)}
            className={cn(
              'px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors',
              interactionMode === mode
                ? 'bg-hb-accent text-white font-medium'
                : 'text-hb-text-secondary hover:text-hb-text-primary'
            )}
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

      {/* Complexity Mode: DRAFT / EXPERT */}
      <div className="flex items-center rounded-full bg-hb-surface border border-hb-border p-0.5">
        {(['DRAFT', 'EXPERT'] as ComplexityMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setComplexityMode(mode)}
            className={cn(
              'px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors',
              complexityMode === mode
                ? 'bg-hb-accent text-white font-medium'
                : 'text-hb-text-secondary hover:text-hb-text-primary'
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  )
}
