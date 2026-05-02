// Sprint J P52 (A7) — Conversation Log EXPERT-mode tab.
// Joins chat_messages + llm_logs by session/created_at via loadConversationLog
// (see ../../contexts/specification/conversationLogExport.ts). Filters by
// session, provider, personality, date. Two export buttons (MD + JSON) auto-
// download a Blob. Every rendered string passes through redactKeyShapes
// (defence-in-depth, ADR-067 / P46 fix-pass).

import { useMemo, useState } from 'react'
import { FileJson, FileText } from 'lucide-react'
import { cn } from '@/lib/cn'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'
import { extractHighlight } from '@/lib/highlightExtractor'
import {
  exportConversationLogJson,
  exportConversationLogMarkdown,
  loadConversationLog,
  type ConversationLogFilter,
  type ConversationTurn,
} from '@/contexts/specification/conversationLogExport'
import { getDB } from '@/contexts/persistence/db'
import {
  getEventsForRequest,
  type LogEventInsert,
} from '@/contexts/persistence/repositories/comprehensiveLogs'
import { useUIStore } from '@/store/uiStore'
import { RequestDrillDown, type RequestSummary } from './RequestDrillDown'

// P74/A5 — Soft shape for a per-todo decomp trace row (A1+A2+A3 wire via
// chatPipeline). Render-block is guarded by `'todoTraces' in t`.
interface TodoTraceLike {
  verb?: string; target?: string; details?: string
  confidence?: number | string; status?: string; summary?: string
}

function downloadBlob(filename: string, mime: string, body: string): void {
  try {
    const blob = new Blob([body], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch {
    /* DEV env without Blob — silent */
  }
}

function formatTs(ms: number): string {
  try {
    return new Date(ms).toISOString().replace('T', ' ').slice(0, 19)
  } catch {
    return String(ms)
  }
}

function shortHash(h: string | null): string {
  return h ? redactKeyShapes(h).slice(0, 8) : '—'
}

// P100 W2 / A8 — Pull distinct request_ids from log_events (most-recent first)
// then resolve each to a RequestSummary via getEventsForRequest. Read-only;
// fire-and-forget; never throws. Returns [] in DEV/test envs without a DB.
function loadRequestSummaries(limit = 30): RequestSummary[] {
  let db: ReturnType<typeof getDB> | null = null
  try { db = getDB() } catch { return [] }
  if (!db) return []
  const ids: string[] = []
  let stmt: ReturnType<typeof db.prepare> | null = null
  try {
    stmt = db.prepare(
      `SELECT request_id, MAX(created_at) AS ts
       FROM log_events
       GROUP BY request_id
       ORDER BY ts DESC
       LIMIT ?`,
    )
    stmt.bind([limit])
    while (stmt.step()) {
      const row = stmt.getAsObject() as { request_id?: string }
      if (row.request_id) ids.push(row.request_id)
    }
  } catch { /* table may not exist yet */ } finally {
    if (stmt) try { stmt.free() } catch { /* ignore */ }
  }
  return ids.map((rid) => buildSummary(db!, rid)).filter((s): s is RequestSummary => s !== null)
}

function buildSummary(db: ReturnType<typeof getDB>, requestId: string): RequestSummary | null {
  const events = getEventsForRequest(db, requestId)
  if (events.length === 0) return null
  const startedAt = events.reduce((m, e) => {
    const c = (e as LogEventInsert & { createdAt?: number }).createdAt
    return c != null && c < m ? c : m
  }, Date.now())
  const totalLatencyMs = events.reduce((n, e) => n + (e.latencyMs ?? 0), 0)
  const inputEvent = events.find((e) => e.eventType === 'input_event')
  const promptRaw = (inputEvent?.eventData?.['prompt'] ?? inputEvent?.eventData?.['text'] ?? '') as unknown
  const prompt = typeof promptRaw === 'string' ? promptRaw : ''
  const mode: RequestSummary['mode'] =
    inputEvent?.inputType === 'listen' ? 'listen' : inputEvent?.inputType === 'chat' ? 'chat' : '—'
  const hasError = events.some((e) => e.eventType === 'error_event')
  const hasSummary = events.some((e) => e.eventType === 'response_summary')
  const status: RequestSummary['status'] = hasError ? 'error' : hasSummary ? 'success' : 'pending'
  return { requestId, startedAt, prompt, mode, totalLatencyMs, status, events }
}

export function ConversationLogTab() {
  const [filter, setFilter] = useState<ConversationLogFilter>({})
  // Per-row "Show full" / "Show highlight" toggle. Default = full (this is the
  // log surface — highlight mode is what chat/listen render via A4).
  const [highlightRows, setHighlightRows] = useState<Record<string, boolean>>({})
  const toggleHighlight = (key: string): void =>
    setHighlightRows((prev) => ({ ...prev, [key]: !prev[key] }))
  // P100 W2 / A8 — EXPERT mode toggle drives AISP Σ trace overlay per stage.
  const expert = useUIStore((s) => s.rightPanelTab === 'EXPERT')

  const sessions = useMemo(() => {
    try {
      return loadConversationLog(filter)
    } catch {
      return []
    }
  }, [filter])

  // P100 W2 / A8 — Per-request drill-down summaries pulled from log_events.
  const requestSummaries = useMemo(() => loadRequestSummaries(30), [filter])
  const sessionTotalCost = requestSummaries.reduce(
    (n, s) => n + s.totalLatencyMs * 0.0001,
    0,
  )

  const totalTurns = sessions.reduce((n, s) => n + s.turns.length, 0)

  const onExportMd = () => {
    try {
      const md = exportConversationLogMarkdown(filter)
      downloadBlob('hey-bradley-conversation-log.md', 'text/markdown', md)
    } catch { /* silent */ }
  }
  const onExportJson = () => {
    try {
      const json = exportConversationLogJson(filter)
      downloadBlob('hey-bradley-conversation-log.json', 'application/json', json)
    } catch { /* silent */ }
  }

  return (
    <div data-testid="conversation-log-tab" className="text-sm text-hb-text-primary space-y-3">
      <header className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold">Conversation Log</h2>
        <span className="text-xs text-hb-text-muted">
          {sessions.length} session{sessions.length === 1 ? '' : 's'} · {totalTurns} turn{totalTurns === 1 ? '' : 's'}
        </span>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            data-testid="log-export-md"
            onClick={onExportMd}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-hb-border hover:border-hb-accent/50 focus-visible:ring-2 focus-visible:ring-hb-accent"
            aria-label="Export conversation log as Markdown"
          >
            <FileText size={12} /> Export MD
          </button>
          <button
            type="button"
            data-testid="log-export-json"
            onClick={onExportJson}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-hb-border hover:border-hb-accent/50 focus-visible:ring-2 focus-visible:ring-hb-accent"
            aria-label="Export conversation log as JSON"
          >
            <FileJson size={12} /> Export JSON
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 text-xs">
        <input
          data-testid="log-filter-session"
          type="text"
          placeholder="session id…"
          value={filter.sessionId ?? ''}
          onChange={(e) => setFilter((f) => ({ ...f, sessionId: e.target.value || undefined }))}
          className="px-2 py-1 rounded border border-hb-border bg-hb-bg w-40"
          aria-label="Filter by session id"
        />
        <input
          data-testid="log-filter-provider"
          type="text"
          placeholder="provider (mock, claude, …)"
          value={filter.provider ?? ''}
          onChange={(e) => setFilter((f) => ({ ...f, provider: e.target.value || undefined }))}
          className="px-2 py-1 rounded border border-hb-border bg-hb-bg w-44"
          aria-label="Filter by provider"
        />
        <input
          data-testid="log-filter-personality"
          type="text"
          placeholder="personality"
          value={filter.personality ?? ''}
          onChange={(e) => setFilter((f) => ({ ...f, personality: e.target.value || undefined }))}
          className="px-2 py-1 rounded border border-hb-border bg-hb-bg w-32"
          aria-label="Filter by personality"
        />
        {(filter.sessionId || filter.provider || filter.personality || filter.fromMs || filter.toMs) && (
          <button
            type="button"
            onClick={() => setFilter({})}
            className="text-hb-text-muted underline decoration-dotted"
          >
            clear
          </button>
        )}
      </div>

      {requestSummaries.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <h3 className="font-semibold text-hb-text-secondary">Per-request drill-down</h3>
            <span className="text-hb-text-muted">
              {requestSummaries.length} request{requestSummaries.length === 1 ? '' : 's'}
            </span>
            <span className="ml-auto font-mono text-hb-text-muted" title="session total estimated cost">
              ~${sessionTotalCost.toFixed(4)}
            </span>
          </div>
          <div className="space-y-1.5">
            {requestSummaries.map((s) => (
              <RequestDrillDown key={s.requestId} summary={s} expert={expert} />
            ))}
          </div>
        </section>
      )}

      {sessions.length === 0 ? (
        <p className="text-xs text-hb-text-muted italic">
          No conversations yet — start chatting in DRAFT or EXPERT mode.
        </p>
      ) : (
        <div className="space-y-3">
          {sessions.map((sess) => (
            <section key={sess.id} className="border border-hb-border rounded p-2 bg-hb-bg">
              <div className="text-xs text-hb-text-muted font-mono mb-1">
                {redactKeyShapes(sess.id)} · started {formatTs(sess.started_at)}
              </div>
              <ul className="divide-y divide-hb-border/40">
                {sess.turns.map((t: ConversationTurn, i) => {
                  const rowKey = `${sess.id}:${i}`
                  const isBradley = t.role !== 'user'
                  const showHighlight = isBradley && (highlightRows[rowKey] ?? false)
                  const fullText = redactKeyShapes(t.text)
                  const body = showHighlight ? extractHighlight(fullText) : fullText
                  // Soft-typed reads — A1/A2/A3 attach these via chatPipeline envelope.
                  const tAny = t as unknown as Record<string, unknown>
                  const latencyMs = typeof tAny.latency_ms === 'number' ? tAny.latency_ms : null
                  const aispAtoms = Array.isArray(tAny.aisp_atoms) ? (tAny.aisp_atoms as string[]) : []
                  const hasTodoTraces = isBradley && 'todoTraces' in t && Array.isArray(tAny.todoTraces)
                  const todoTraces: TodoTraceLike[] = hasTodoTraces ? (tAny.todoTraces as TodoTraceLike[]) : []
                  const decompStatus = typeof tAny.decompStatus === 'string' ? tAny.decompStatus : 'applied'
                  return (
                    <li key={i} data-testid="log-row" data-role={t.role} data-personality={t.personality ?? ''} className="py-2 text-xs space-y-1">
                      <div className="grid grid-cols-[80px_60px_60px_80px_80px_60px_1fr] gap-2 items-start">
                        <span className="text-hb-text-muted font-mono">{formatTs(t.created_at)}</span>
                        <span className={cn('font-medium', t.role === 'user' ? 'text-hb-accent' : 'text-hb-text-secondary')}>{t.role}</span>
                        <span className="text-hb-text-muted">{t.personality ?? '—'}</span>
                        <span className="text-hb-text-muted">{t.provider ?? '—'}</span>
                        <span className="font-mono text-hb-text-muted">{shortHash(t.prompt_hash)}</span>
                        <span className="font-mono text-hb-text-muted" title="latency · status">{latencyMs != null ? `${latencyMs}ms` : (t.status ?? '—')}</span>
                        <span className="text-hb-text-primary whitespace-pre-wrap break-words" title={fullText}>{body}</span>
                      </div>
                      {isBradley && (
                        <div className="flex flex-wrap items-center gap-2 pl-[80px]">
                          <button type="button" data-testid="log-row-toggle" onClick={() => toggleHighlight(rowKey)} aria-label={showHighlight ? 'Show full reply' : 'Show highlight'} className="text-[10px] px-1.5 py-0.5 rounded border border-hb-border hover:border-hb-accent/50 text-hb-text-muted">{showHighlight ? 'Show full' : 'Show highlight'}</button>
                          {t.model && <span className="text-[10px] text-hb-text-muted font-mono" title="model">{redactKeyShapes(t.model)}</span>}
                          {aispAtoms.length > 0 && (
                            <span className="flex flex-wrap gap-1" data-testid="log-row-aisp">
                              {aispAtoms.map((atom, ai) => <span key={ai} className="text-[10px] px-1 rounded bg-hb-bg-elevated border border-hb-border text-hb-text-muted font-mono">{redactKeyShapes(atom)}</span>)}
                            </span>
                          )}
                        </div>
                      )}
                      {hasTodoTraces && (
                        <details data-testid="log-row-decomp" className="pl-[80px]">
                          <summary className="text-[10px] text-hb-text-muted cursor-pointer select-none">Decomp trace · {todoTraces.length} todo{todoTraces.length === 1 ? '' : 's'} · status: {redactKeyShapes(decompStatus)}</summary>
                          <ul className="mt-1 space-y-0.5">
                            {todoTraces.map((td, ti) => (
                              <li key={ti} className="grid grid-cols-[60px_80px_1fr_50px_60px] gap-2 text-[10px] font-mono text-hb-text-muted">
                                <span>{redactKeyShapes(String(td.verb ?? '—'))}</span>
                                <span>{redactKeyShapes(String(td.target ?? '—'))}</span>
                                <span className="truncate" title={String(td.details ?? '')}>{redactKeyShapes(String(td.details ?? '—'))}</span>
                                <span>{td.confidence != null ? String(td.confidence) : '—'}</span>
                                <span>{redactKeyShapes(String(td.status ?? '—'))}</span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

// P74/A5 — ConversationLogTab full-detail surface confirmed:
// - Full bradley reply text (untruncated; whitespace-pre-wrap, no .slice cap)
// - User input verbatim (same untruncated render path)
// - AISP trace (5-atom chips, soft-read from tAny.aisp_atoms; hidden when absent)
// - Latency badge + breakdown (latency_ms surfaced; falls back to t.status)
// - Personality metadata (t.personality column)
// - Timestamp (formatTs ISO ms, monospace)
// - Decomp trace (collapsible <details>; rendered only when 'todoTraces' in t —
//   guarded so it stays invisible until A3's chatPipeline wire ships todoTraces
//   on the bradley reply envelope; verb · target · details · confidence · status)
// - Highlight/full toggle (per bradley row; default = full; uses extractHighlight
//   from @/lib/highlightExtractor — A4's helper)
//
// Carry-forward: A3 must extend ConversationTurn (or the chat_messages projection
// it feeds) with optional latency_ms, aisp_atoms, todoTraces, decompStatus so
// these soft-read render paths can drop their `as unknown as Record<string,unknown>`
// casts. Until then the runtime guards keep the panel a no-op for legacy turns.
