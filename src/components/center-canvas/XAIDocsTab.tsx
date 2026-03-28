import { useState } from 'react'
import { cn } from '../../lib/cn'

type DocsMode = 'HUMAN' | 'AISP'

export function XAIDocsTab() {
  const [mode, setMode] = useState<DocsMode>('HUMAN')

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-sm font-medium uppercase text-hb-text-secondary">
        XAI DOCS
      </h2>

      <div className="flex gap-4">
        <button
          onClick={() => setMode('HUMAN')}
          className={cn(
            'font-mono text-xs uppercase cursor-pointer pb-0.5',
            mode === 'HUMAN'
              ? 'text-hb-accent border-b border-hb-accent'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          HUMAN
        </button>
        <button
          onClick={() => setMode('AISP')}
          className={cn(
            'font-mono text-xs uppercase cursor-pointer pb-0.5',
            mode === 'AISP'
              ? 'text-hb-accent border-b border-hb-accent'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          AISP
        </button>
      </div>

      <div className="font-mono text-xs text-hb-text-muted leading-relaxed">
        {mode === 'HUMAN' ? (
          <p>
            This page defines the primary landing experience. It includes a hero
            section, feature grid, and call-to-action. All layout tokens follow
            the AISP spatial model with 8px base unit.
          </p>
        ) : (
          <p>
            AISP v1.2 — Section: index.hero — Type: layout.stack — Gap: 2u —
            Padding: 4u — Breakpoint: md:6col lg:12col — Render: priority:1
            cache:edge ttl:3600
          </p>
        )}
      </div>
    </div>
  )
}
