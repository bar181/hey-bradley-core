/**
 * P122 / W6 — DBPanel (NEW; Agentics observability surface for raw DB inspection).
 *
 * Read-only viewer that lets the owner pick from a list of tables (those with a
 * `project_id` column or where `id` IS the project id) and renders rows scoped
 * to the active project as JSON. Reuses `getDB()` from `db.ts`. No edit path.
 *
 * "Copy JSON" button writes the rendered slice to the clipboard so the owner
 * can paste it into a bug report without screenshotting the panel.
 *
 * BYOK trust boundary preserved per ADR-043 + ADR-114 D3:
 * `redactKeyShapes()` runs at write time in `comprehensiveLogs.ts` +
 * `llmLogs.ts`. Read path inherits redacted strings — this panel does NOT
 * introduce a fresh code path that bypasses redaction.
 *
 * Cross-ref: ADR-043 (BYOK), ADR-091 (tokens), ADR-110 (AISP visibility),
 * ADR-126 (logging architecture).
 *
 * Tables surfaced (each project_id-scoped where the column exists):
 *   - `projects`         (id IS the project id; show single row)
 *   - `sessions`         (project_id col)
 *   - `llm_logs`         (project_id col)
 *   - `log_events`       (project_id col)
 *   - `edit_history`     (project_id col)
 *   - `chat_messages`    (no project_id — shows latest 50 rows globally)
 *   - `user_templates`   (no project_id — shows all rows globally)
 *
 * Fan-out limit 200 rows per fetch (sql.js in-memory; cheap, but bounded).
 */
import { useEffect, useState } from 'react'
import { Copy, Database, RefreshCw } from 'lucide-react'
import { getDB } from '@/contexts/persistence/db'

export interface DBPanelProps {
  /** Active project slug; if null/undefined, project-scoped queries return empty. */
  projectId?: string | null
}

interface TableSpec {
  name: string
  /** Filter shape: 'project_id' | 'id' (projects) | 'none' (global tail). */
  scope: 'project_id' | 'id' | 'none'
}

const TABLES: ReadonlyArray<TableSpec> = [
  { name: 'projects', scope: 'id' },
  { name: 'sessions', scope: 'project_id' },
  { name: 'llm_logs', scope: 'project_id' },
  { name: 'log_events', scope: 'project_id' },
  { name: 'edit_history', scope: 'project_id' },
  { name: 'chat_messages', scope: 'none' },
  { name: 'user_templates', scope: 'none' },
]

const MAX_ROWS = 200

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2'

function fetchRows(
  table: TableSpec,
  projectId: string | null | undefined,
): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = []
  let stmt: ReturnType<ReturnType<typeof getDB>['prepare']> | null = null
  try {
    const db = getDB()
    // Whitelist guard — table.name is locked to TABLES list at module load,
    // never user-interpolated, so this is safe; defence-in-depth nonetheless.
    const allowed = TABLES.some((t) => t.name === table.name)
    if (!allowed) return []

    if (table.scope === 'project_id') {
      if (!projectId) return []
      stmt = db.prepare(
        `SELECT * FROM ${table.name} WHERE project_id = ? ORDER BY rowid DESC LIMIT ?`,
      )
      stmt.bind([projectId, MAX_ROWS])
    } else if (table.scope === 'id') {
      if (!projectId) return []
      stmt = db.prepare(`SELECT * FROM ${table.name} WHERE id = ? LIMIT 1`)
      stmt.bind([projectId])
    } else {
      // 'none' — fall back to global tail (latest 50; cheap).
      stmt = db.prepare(
        `SELECT * FROM ${table.name} ORDER BY rowid DESC LIMIT ?`,
      )
      stmt.bind([Math.min(MAX_ROWS, 50)])
    }
    while (stmt.step()) {
      out.push(stmt.getAsObject() as Record<string, unknown>)
    }
  } catch (err) {
    if (typeof console !== 'undefined') {
      console.warn('[DBPanel] fetch failed', err)
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

export function DBPanel({ projectId }: DBPanelProps) {
  const [tableName, setTableName] = useState<string>(TABLES[0].name)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loaded, setLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tick, setTick] = useState(0)

  const table = TABLES.find((t) => t.name === tableName) ?? TABLES[0]

  useEffect(() => {
    try {
      setRows(fetchRows(table, projectId ?? null))
    } catch {
      setRows([])
    }
    setLoaded(true)
  }, [tableName, projectId, table, tick])

  const handleRefresh = (): void => {
    setTick((n) => n + 1)
  }

  const handleCopy = async (): Promise<void> => {
    try {
      const json = JSON.stringify(rows, null, 2)
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(json)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }
    } catch {
      /* clipboard may be denied; swallow */
    }
  }

  const json = JSON.stringify(rows, null, 2)

  return (
    <section
      data-testid="db-panel"
      className="rounded-md border border-[var(--hb-border)] bg-[var(--hb-surface)]"
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[var(--hb-border)] flex-wrap">
        <div className="flex items-center gap-2">
          <Database
            size={14}
            aria-hidden="true"
            className="text-[var(--hb-accent)]"
          />
          <h3 className="text-sm font-semibold text-[var(--hb-text-primary)]">
            Database
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="db-panel-table-select"
            className="text-[10px] font-mono uppercase tracking-wider text-[var(--hb-text-muted)]"
          >
            Table
          </label>
          <select
            id="db-panel-table-select"
            data-testid="db-panel-table-select"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className={`text-xs font-mono px-2 py-1 rounded border border-[var(--hb-border)] bg-[var(--hb-bg)] text-[var(--hb-text-primary)] ${FOCUS}`}
          >
            {TABLES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleRefresh}
            data-testid="db-panel-refresh"
            aria-label="Refresh table"
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)] ${FOCUS} transition-colors duration-200`}
          >
            <RefreshCw size={12} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleCopy}
            data-testid="db-panel-copy"
            aria-label="Copy JSON to clipboard"
            disabled={rows.length === 0}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS} transition-colors duration-200`}
          >
            <Copy size={12} aria-hidden="true" />
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </header>

      <div className="px-3 py-1.5 border-b border-[var(--hb-border)] text-[10px] font-mono uppercase tracking-wider text-[var(--hb-text-muted)] flex items-center gap-3 flex-wrap">
        <span>
          Scope: <span className="text-[var(--hb-text-secondary)]">{table.scope}</span>
        </span>
        <span>
          Project:{' '}
          <span className="text-[var(--hb-text-secondary)]">
            {projectId ?? '—'}
          </span>
        </span>
        <span data-testid="db-panel-row-count">
          Rows: <span className="text-[var(--hb-text-secondary)]">{rows.length}</span>
        </span>
      </div>

      {!loaded ? (
        <div
          data-testid="db-panel-loading"
          className="px-3 py-6 text-xs text-[var(--hb-text-muted)] italic"
        >
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div
          data-testid="db-panel-empty"
          className="px-3 py-6 text-xs text-[var(--hb-text-muted)] italic"
        >
          {table.scope === 'project_id' || table.scope === 'id'
            ? `No rows in ${table.name} for this project. Pick another table or load a project first.`
            : `No rows in ${table.name}.`}
        </div>
      ) : (
        <pre
          data-testid="db-panel-json"
          className="overflow-auto max-h-[400px] p-3 text-[11px] font-mono text-[var(--hb-text-secondary)] whitespace-pre-wrap break-all"
        >
          {json}
        </pre>
      )}
    </section>
  )
}

export default DBPanel
