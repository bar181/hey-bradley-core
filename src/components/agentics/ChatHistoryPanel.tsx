/**
 * P126 / F3 — ChatHistoryPanel. ADR-154.
 * Reverse-chronological feed of user prompts / LLM calls / LLM responses /
 * patches applied / pipeline errors / low-confidence narrations captured by the
 * chat pipeline. Subscribes to localStorage 'hey-bradley-session-log' via
 * `useSessionLog`. Read-only: Export JSON + Clear (with confirm) + per-entry
 * chevron to expand the payload. Cross-refs: ADR-043, ADR-110, ADR-126, ADR-155.
 */
import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { ChevronDown, ChevronRight, Download, Trash2, MessageSquare } from 'lucide-react'
import { useSessionLog, type SessionLogEntry, type SessionLogEventType } from '@/contexts/intelligence/sessionLog'

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2'

/** Per-event badge style. CSS vars only — no hex literals leak (ARCH.2). Both
 *  LLM events use --hb-blue per ADR-154 (no teal token; blue is conservative). */
function badgeStyle(eventType: SessionLogEventType): { bg: string; fg: string; label: string } {
  switch (eventType) {
    case 'user_prompt':
      return { bg: 'var(--hb-accent-light)', fg: 'var(--hb-accent)', label: 'PROMPT' }
    case 'llm_call_sent':
      return { bg: 'var(--hb-blue-dim)', fg: 'var(--hb-blue)', label: 'LLM →' }
    case 'llm_response_received':
      return { bg: 'var(--hb-blue-dim)', fg: 'var(--hb-blue)', label: 'LLM ←' }
    case 'patch_applied':
      return { bg: 'rgba(34, 197, 94, 0.15)', fg: 'rgb(22, 163, 74)', label: 'PATCH' }
    case 'pipeline_error':
      return { bg: 'rgba(239, 68, 68, 0.15)', fg: 'rgb(220, 38, 38)', label: 'ERROR' }
    case 'confidence_low':
      return { bg: 'rgba(245, 158, 11, 0.15)', fg: 'rgb(217, 119, 6)', label: 'LOW-CONF' }
    default:
      return { bg: 'var(--hb-surface-hover)', fg: 'var(--hb-text-muted)', label: 'EVENT' }
  }
}

function relativeTime(ts: number): string {
  const now = Date.now()
  const diffMs = now - ts
  if (diffMs < 0) return 'just now'
  const sec = Math.floor(diffMs / 1000)
  if (sec < 5) return 'just now'
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day === 1) return 'yesterday'
  if (day < 7) return `${day}d ago`
  try {
    return new Date(ts).toLocaleDateString()
  } catch {
    return `${day}d ago`
  }
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function timestampForFilename(): string {
  const d = new Date()
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}`
}

function downloadJSON(filename: string, content: string): void {
  try {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    if (typeof console !== 'undefined') console.warn('[ChatHistoryPanel] download failed', e)
  }
}

interface EntryRowProps {
  entry: SessionLogEntry
  expanded: boolean
  onToggle: () => void
}

function EntryRow({ entry, expanded, onToggle }: EntryRowProps): JSX.Element {
  const badge = badgeStyle(entry.eventType)
  const Chevron = expanded ? ChevronDown : ChevronRight
  const payloadJSON = useMemo(() => {
    if (!entry.payload) return ''
    try {
      return JSON.stringify(entry.payload, null, 2)
    } catch {
      return '[unstringifiable payload]'
    }
  }, [entry.payload])

  return (
    <li
      data-testid={`chat-history-entry-${entry.id}`}
      className="border-t border-[var(--hb-border)] first:border-t-0"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={`w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-[var(--hb-surface-hover)] transition-colors ${FOCUS}`}
      >
        <Chevron
          size={14}
          aria-hidden="true"
          className="mt-0.5 flex-shrink-0 text-[var(--hb-text-muted)]"
        />
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider flex-shrink-0"
          style={{ backgroundColor: badge.bg, color: badge.fg }}
        >
          {badge.label}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-xs text-[var(--hb-text-primary)] truncate">
            {entry.summary || <em className="text-[var(--hb-text-muted)]">(no summary)</em>}
          </span>
          <span className="block text-[10px] text-[var(--hb-text-muted)] font-mono">
            {relativeTime(entry.timestamp)}
            {entry.mode ? ` · ${entry.mode}` : ''}
          </span>
        </span>
      </button>
      {expanded && entry.payload && (
        <pre
          data-testid={`chat-history-payload-${entry.id}`}
          className="mx-3 mb-2 mt-0 px-3 py-2 rounded bg-[var(--hb-surface-hover)] text-[10px] font-mono text-[var(--hb-text-secondary)] overflow-auto max-h-[180px] whitespace-pre-wrap break-words"
        >
          {payloadJSON}
        </pre>
      )}
    </li>
  )
}

export interface ChatHistoryPanelProps {
  /** Optional test hook — bypasses confirm() so unit/playwright runs deterministic. */
  skipConfirm?: boolean
}

export function ChatHistoryPanel({ skipConfirm = false }: ChatHistoryPanelProps = {}): JSX.Element {
  const { entries, clear, exportJSON } = useSessionLog()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  const toggle = (id: string): void => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleExport = (): void => {
    downloadJSON(`hey-bradley-session-log-${timestampForFilename()}.json`, exportJSON())
  }

  const handleClear = (): void => {
    if (entries.length === 0) return
    if (skipConfirm || (typeof window !== 'undefined' && window.confirm(
      `Clear all ${entries.length} entries? This cannot be undone.`,
    ))) {
      clear()
      setExpandedIds(new Set())
    }
  }

  return (
    <section
      data-testid="chat-history-panel"
      className="rounded-md border border-[var(--hb-border)] bg-[var(--hb-surface)]"
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[var(--hb-border)]">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} aria-hidden="true" className="text-[var(--hb-accent)]" />
          <h3 className="text-sm font-semibold text-[var(--hb-text-primary)]">
            Chat History
          </h3>
          <span
            data-testid="chat-history-count"
            className="text-[10px] font-mono uppercase tracking-wider text-[var(--hb-text-muted)]"
          >
            {entries.length} entr{entries.length === 1 ? 'y' : 'ies'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleExport}
            disabled={entries.length === 0}
            data-testid="chat-history-export"
            aria-label="Export chat history as JSON"
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS} transition-colors duration-200`}
          >
            <Download size={11} aria-hidden="true" />
            Export
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={entries.length === 0}
            data-testid="chat-history-clear"
            aria-label="Clear all chat history entries"
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS} transition-colors duration-200`}
          >
            <Trash2 size={11} aria-hidden="true" />
            Clear
          </button>
        </div>
      </header>

      {entries.length === 0 ? (
        <div
          data-testid="chat-history-empty"
          className="px-3 py-6 text-xs text-[var(--hb-text-muted)] italic"
        >
          No chat events yet. Start a conversation in /builder to see live events.
        </div>
      ) : (
        <ol
          data-testid="chat-history-list"
          className="max-h-[480px] overflow-auto"
        >
          {entries.map((e) => (
            <EntryRow
              key={e.id}
              entry={e}
              expanded={expandedIds.has(e.id)}
              onToggle={() => toggle(e.id)}
            />
          ))}
        </ol>
      )}
    </section>
  )
}

export default ChatHistoryPanel
