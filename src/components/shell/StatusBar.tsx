/**
 * P126 F2b — Enriched footer status bar.
 *
 * Surfaces 7 always-on signals so the builder shell communicates state at a
 * glance instead of looking empty:
 *
 *   ● READY  v POC 126.0  KEY: USER  ● LLM  TONE: PROFESSIONAL  SPECS ✓   $0.00  EDITS: N
 *
 * All colors use Tailwind hb-* tokens / CSS vars — zero new hex literals
 * (ARCH.2 ceiling lives at 240 in src/components/).
 */
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useLLMHealthStore } from '@/store/llmHealthStore'
import { useConfigStore } from '@/store/configStore'
import { CostPill } from './CostPill'

const VERSION_LABEL = 'POC 126.0'

function llmDotClass(status: 'idle' | 'ok' | 'error'): string {
  if (status === 'ok') return 'bg-hb-success'
  if (status === 'error') return 'bg-hb-error'
  return 'bg-hb-text-muted'
}

export function StatusBar() {
  // hasKey is a reactive flag on intelligenceStore (init + setProviderAndKey
  // + clearKey all maintain it). Cheaper + more correct than re-reading kv
  // / localStorage on every render.
  const hasKey = useIntelligenceStore((s) => s.hasKey)
  const personalityId = useIntelligenceStore((s) => s.personalityId)
  const specsFresh = useIntelligenceStore((s) => s.specsFresh)
  const llmHealth = useLLMHealthStore((s) => s.status)
  const editsCount = useConfigStore((s) => s.history.length)

  const keyLabel = hasKey ? 'USER' : 'DEFAULT'
  const toneLabel = personalityId.toUpperCase()

  return (
    <footer className="h-7 flex items-center justify-between px-4 bg-hb-surface border-t border-hb-border font-mono text-xs uppercase tracking-wide text-hb-text-muted shrink-0">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hb-success" />
          Ready
        </span>
        <span className="text-hb-text-secondary">v {VERSION_LABEL}</span>
        <span>Key: {keyLabel}</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${llmDotClass(llmHealth)}`} />
          LLM
        </span>
        <span>Tone: {toneLabel}</span>
        <span className="flex items-center gap-1.5">
          Specs
          {specsFresh ? (
            <span className="text-hb-success" aria-label="specs in sync">✓</span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-hb-warning" aria-label="specs stale" />
          )}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <CostPill />
        <span>Edits: {editsCount}</span>
      </div>
    </footer>
  )
}
