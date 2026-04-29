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
import {
  exportConversationLogJson,
  exportConversationLogMarkdown,
  loadConversationLog,
  type ConversationLogFilter,
  type ConversationTurn,
} from '@/contexts/specification/conversationLogExport'

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

export function ConversationLogTab() {
  const [filter, setFilter] = useState<ConversationLogFilter>({})

  const sessions = useMemo(() => {
    try {
      return loadConversationLog(filter)
    } catch {
      return []
    }
  }, [filter])

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
                {sess.turns.map((t: ConversationTurn, i) => (
                  <li
                    key={i}
                    data-testid="log-row"
                    data-personality={t.personality ?? ''}
                    className="py-1.5 grid grid-cols-[80px_60px_60px_80px_80px_1fr] gap-2 items-start text-xs"
                  >
                    <span className="text-hb-text-muted font-mono">{formatTs(t.created_at)}</span>
                    <span className={cn('font-medium', t.role === 'user' ? 'text-hb-accent' : 'text-hb-text-secondary')}>
                      {t.role}
                    </span>
                    <span className="text-hb-text-muted">{t.personality ?? '—'}</span>
                    <span className="text-hb-text-muted">{t.provider ?? '—'}</span>
                    <span className="font-mono text-hb-text-muted">{shortHash(t.prompt_hash)}</span>
                    <span className="text-hb-text-primary truncate" title={redactKeyShapes(t.text)}>
                      {redactKeyShapes(t.text).slice(0, 240)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
