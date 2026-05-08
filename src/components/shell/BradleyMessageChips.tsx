/**
 * P85 / OC-19 (A2) — Bradley message dual-view chips (extracted from ChatThread).
 *
 * Three chips surfaced under bradley replies per ADR-110 AISP visibility
 * standard:
 *   1. matcher-confidence-chip — Template Intelligence selection name + score
 *   2. decomp-todo-summary    — DECOMP_ATOM ≥2-todo list (single-clause hidden)
 *   3. error-aisp-code        — EXPERT-mode AISP error kind alongside prose
 *
 * Extracted to keep ChatThread.tsx under the P67c.5 ≤200 LOC canonical cap.
 */
import type { ChatMessage } from '@/components/shell/ChatInput'

export interface BradleyMessageChipsProps {
  msg: ChatMessage
  isExpertMode: boolean
}

export function BradleyMessageChips({ msg, isExpertMode }: BradleyMessageChipsProps) {
  if (msg.role !== 'bradley') return null
  return (
    <>
      {msg.matcherConfidence && (
        <div
          data-testid="matcher-confidence-chip"
          className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[var(--hb-text-secondary)]"
        >
          <span className="opacity-70">→</span>
          <span>
            Selected{' '}
            <span className="font-medium text-[var(--hb-text-primary)]">
              {msg.matcherConfidence.name}
            </span>{' '}
            ({msg.matcherConfidence.confidence.toFixed(2)} confidence)
          </span>
        </div>
      )}
      {msg.decompTodos && msg.decompTodos.length >= 2 && (
        <div
          data-testid="decomp-todo-summary"
          className="mt-1.5 text-xs text-[var(--hb-text-secondary)]"
        >
          <div className="opacity-80">I found {msg.decompTodos.length} things to do:</div>
          <ol className="mt-1 ml-4 list-decimal space-y-0.5">
            {msg.decompTodos.map((t, i) => (
              <li key={i} className="opacity-70">
                <span className="font-medium text-[var(--hb-text-primary)]">{t.verb}</span>
                {t.target ? ` ${t.target}` : ''}
              </li>
            ))}
          </ol>
        </div>
      )}
      {isExpertMode && msg.errorKind && (
        <span
          data-testid="error-aisp-code"
          className="ml-2 text-xs font-mono text-[var(--hb-text-secondary)]"
        >
          [ERROR · {msg.errorKind}]
        </span>
      )}
    </>
  )
}
