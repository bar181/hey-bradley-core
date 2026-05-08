/**
 * P122 / W6 — LLMLogPanel (NEW; Agentics observability surface for Gemini BYOK).
 *
 * Reads the `llm_logs` table from sql.js via `getDB()` and renders a scrollable
 * table of recent LLM calls scoped to the active project. Read-only. Reuses the
 * existing `LLMLogRow` type from `repositories/llmLogs.ts` (W1 audit confirmed
 * this is the canonical read shape per ADR-047 + ADR-126).
 *
 * BYOK trust boundary preserved per ADR-043 + ADR-114 D3:
 * `redactKeyShapes()` runs at write time in `comprehensiveLogs.ts` +
 * `llmLogs.ts`. Read path inherits redacted strings — no fresh code path
 * bypasses redaction.
 *
 * Cross-ref: ADR-043 (BYOK), ADR-047 (LLM logging), ADR-091 (tokens),
 * ADR-110 (AISP visibility), ADR-126 (logging architecture).
 *
 * Empty state: "No LLM activity yet" so the panel never crashes when
 * `.env` is missing or the user hasn't sent a prompt yet.
 */
import { useEffect, useState } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { getDB } from '@/contexts/persistence/db'
import type { LLMLogRow } from '@/contexts/persistence/repositories/llmLogs'

export interface LLMLogPanelProps {
  /** Active project slug; if null/undefined, panel queries the most-recent rows globally. */
  projectId?: string | null
  /** Max rows to show; default 100. */
  limit?: number
}

const COL =
  'px-2 py-1 text-left align-top whitespace-nowrap text-[var(--hb-text-secondary)]'
const HEAD =
  'px-2 py-1.5 text-left text-[10px] font-mono uppercase tracking-wider text-[var(--hb-text-muted)] bg-[var(--hb-surface-hover)] sticky top-0'
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2'

function fmtTime(ms: number): string {
  try {
    return new Date(ms).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return String(ms)
  }
}

function fmtCost(usd: number | null): string {
  if (usd == null) return '—'
  if (usd === 0) return '$0.00'
  return usd < 0.01 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(2)}`
}

function fmtTokens(n: number | null): string {
  return n == null ? '—' : n.toLocaleString()
}

function shortHash(s: string | null | undefined): string {
  if (!s) return '—'
  return s.length > 10 ? s.slice(0, 8) + '…' : s
}

function statusClass(status: string): string {
  if (status === 'ok') return 'text-emerald-600 dark:text-emerald-400'
  if (status === 'cost_cap' || status === 'rate_limit')
    return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function fetchRows(projectId: string | null | undefined, limit: number): LLMLogRow[] {
  const out: LLMLogRow[] = []
  let stmt: ReturnType<ReturnType<typeof getDB>['prepare']> | null = null
  try {
    const db = getDB()
    if (projectId) {
      stmt = db.prepare(
        'SELECT * FROM llm_logs WHERE project_id = ? ORDER BY id DESC LIMIT ?',
      )
      stmt.bind([projectId, limit])
    } else {
      stmt = db.prepare('SELECT * FROM llm_logs ORDER BY id DESC LIMIT ?')
      stmt.bind([limit])
    }
    while (stmt.step()) {
      out.push(stmt.getAsObject() as unknown as LLMLogRow)
    }
  } catch (err) {
    if (typeof console !== 'undefined') {
      console.warn('[LLMLogPanel] fetch failed', err)
    }
  } finally {
    if (stmt) {
      try {
        stmt.free()
      } catch {
        /* ignore */
      }
    }
  }
  return out
}

export function LLMLogPanel({ projectId, limit = 100 }: LLMLogPanelProps) {
  const [rows, setRows] = useState<LLMLogRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    try {
      setRows(fetchRows(projectId ?? null, limit))
    } catch {
      setRows([])
    }
    setLoaded(true)
  }, [projectId, limit, tick])

  const handleRefresh = (): void => {
    setTick((n) => n + 1)
  }

  return (
    <section
      data-testid="llm-log-panel"
      className="rounded-md border border-[var(--hb-border)] bg-[var(--hb-surface)]"
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[var(--hb-border)]">
        <div className="flex items-center gap-2">
          <Activity
            size={14}
            aria-hidden="true"
            className="text-[var(--hb-accent)]"
          />
          <h3 className="text-sm font-semibold text-[var(--hb-text-primary)]">
            LLM Log
          </h3>
          <span
            data-testid="llm-log-panel-count"
            className="text-[10px] font-mono uppercase tracking-wider text-[var(--hb-text-muted)]"
          >
            {rows.length} row{rows.length === 1 ? '' : 's'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          data-testid="llm-log-panel-refresh"
          aria-label="Refresh LLM log"
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)] ${FOCUS} transition-colors duration-200`}
        >
          <RefreshCw size={12} aria-hidden="true" />
          Refresh
        </button>
      </header>

      {!loaded ? (
        <div
          data-testid="llm-log-panel-loading"
          className="px-3 py-6 text-xs text-[var(--hb-text-muted)] italic"
        >
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div
          data-testid="llm-log-panel-empty"
          className="px-3 py-6 text-xs text-[var(--hb-text-muted)] italic"
        >
          No LLM calls yet. Send a prompt in chat mode with a BYOK key set in{' '}
          <code className="font-mono">.env</code> and the call appears here with
          tokens, latency, and cost.
        </div>
      ) : (
        <div className="overflow-auto max-h-[400px]">
          <table
            data-testid="llm-log-panel-table"
            className="w-full text-xs font-mono tabular-nums"
          >
            <thead>
              <tr>
                <th className={HEAD}>Time</th>
                <th className={HEAD}>Provider</th>
                <th className={HEAD}>Model</th>
                <th className={HEAD}>Hash</th>
                <th className={HEAD}>In</th>
                <th className={HEAD}>Out</th>
                <th className={HEAD}>Cost</th>
                <th className={HEAD}>Latency</th>
                <th className={HEAD}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  data-testid={`llm-log-row-${row.id}`}
                  className="border-t border-[var(--hb-border)] hover:bg-[var(--hb-surface-hover)]"
                >
                  <td className={COL}>{fmtTime(row.created_at)}</td>
                  <td className={COL}>{row.provider}</td>
                  <td className={COL}>{row.model}</td>
                  <td className={COL} title={row.prompt_hash}>
                    {shortHash(row.prompt_hash)}
                  </td>
                  <td className={COL}>{fmtTokens(row.input_tokens)}</td>
                  <td className={COL}>{fmtTokens(row.output_tokens)}</td>
                  <td className={COL}>{fmtCost(row.cost_usd)}</td>
                  <td className={COL}>
                    {row.latency_ms == null ? '—' : `${row.latency_ms}ms`}
                  </td>
                  <td className={`${COL} ${statusClass(row.status)}`}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default LLMLogPanel
