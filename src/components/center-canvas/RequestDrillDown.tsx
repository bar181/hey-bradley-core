// P100 W2 / A8 — RequestDrillDown: per-request expandable pipeline trace.
// Source: log_events (A1). EXPERT mode overlays AISP Σ per stage (ADR-110).
// Pure presentational; ADR-091 token compliance.

import { useMemo, useState } from 'react'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'
import type { LogEventInsert, LogEventType } from '@/contexts/persistence/repositories/comprehensiveLogs'

// Σ snippets — atom name + one-line shape hint (full atoms ship in aisp/*.ts).
const AISP_TRACE_BY_STAGE: Partial<Record<LogEventType, string>> = {
  intent_classification: 'INTENT_ATOM · Σ:{verb,target,params}',
  decomposition: 'DECOMP_ATOM · Σ:{Todo[],status}',
  template_match: 'SELECTION_ATOM · Σ:{template,confidence}',
  patch_validation: 'PATCH_ATOM · Σ:{ops[],valid:𝔹}',
}

const STAGE_ORDER: LogEventType[] = [
  'input_event',
  'listen_capture',
  'intent_classification',
  'decomposition',
  'template_match',
  'patch_validation',
  'todo_execution',
  'multi_page_scope',
  'process_atom_output',
  'ddd_atom_output',
  'personality_display',
  'response_summary',
  'error_event',
]

const STAGE_LABEL: Record<LogEventType, string> = {
  input_event: 'Input',
  listen_capture: 'Listen capture',
  intent_classification: 'Intent classification',
  decomposition: 'Decomposition',
  template_match: 'Template match',
  patch_validation: 'Patch validation',
  todo_execution: 'Todo execution',
  multi_page_scope: 'Multi-page scope',
  process_atom_output: 'PROCESS atom',
  ddd_atom_output: 'DDD atom',
  personality_display: 'Personality response',
  response_summary: 'Response summary',
  error_event: 'Error',
  decomp_split: 'Decomposition split',
  export_emit: 'Export emit',
}

export interface RequestSummary {
  requestId: string
  startedAt: number
  prompt: string
  mode: 'chat' | 'listen' | '—'
  totalLatencyMs: number
  status: 'success' | 'error' | 'pending'
  events: LogEventInsert[]
}

interface DrillDownProps {
  summary: RequestSummary
  expert: boolean
}

function formatTs(ms: number): string {
  try { return new Date(ms).toISOString().replace('T', ' ').slice(0, 19) } catch { return String(ms) }
}

/** Build per-request markdown report. Single Blob; never throws. */
export function buildRequestMarkdown(s: RequestSummary): string {
  const lines: string[] = []
  lines.push(`# Request ${s.requestId}`)
  lines.push('')
  lines.push(`Time: ${formatTs(s.startedAt)}`)
  lines.push(`Mode: ${s.mode}`)
  lines.push(`Status: ${s.status}`)
  lines.push(`Total latency: ${s.totalLatencyMs}ms`)
  lines.push(`Prompt: ${redactKeyShapes(s.prompt)}`)
  lines.push('')
  lines.push('## Pipeline stages')
  lines.push('')
  s.events.forEach((ev, i) => {
    lines.push(`### ${i + 1}. ${STAGE_LABEL[ev.eventType] ?? ev.eventType}`)
    if (ev.latencyMs != null) lines.push(`- latency: ${ev.latencyMs}ms`)
    const trace = AISP_TRACE_BY_STAGE[ev.eventType]
    if (trace) lines.push(`- AISP: ${trace}`)
    let body = ''
    try { body = JSON.stringify(ev.eventData, null, 2) } catch { body = '[unstringifiable]' }
    lines.push('')
    lines.push('```json')
    lines.push(redactKeyShapes(body))
    lines.push('```')
    lines.push('')
  })
  return lines.join('\n')
}

function downloadBlob(filename: string, body: string): void {
  try {
    const blob = new Blob([body], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch { /* DEV env without Blob — silent */ }
}

export function RequestDrillDown({ summary, expert }: DrillDownProps) {
  const [open, setOpen] = useState(false)
  const sortedEvents = useMemo(() => {
    const idx = (et: LogEventType) => {
      const i = STAGE_ORDER.indexOf(et)
      return i === -1 ? STAGE_ORDER.length : i
    }
    return [...summary.events].sort((a, b) => idx(a.eventType) - idx(b.eventType))
  }, [summary.events])

  const onExportMd = () => {
    const md = buildRequestMarkdown(summary)
    const ts = new Date(summary.startedAt).toISOString().slice(0, 10)
    downloadBlob(`request-${summary.requestId.slice(0, 8)}-${ts}.md`, md)
  }

  // Cost placeholder: total latency × $0.0001/ms (per-request budget hint).
  const costEst = (summary.totalLatencyMs * 0.0001).toFixed(4)

  return (
    <article
      data-testid={`conversation-log-request-${summary.requestId}`}
      className="border border-hb-border rounded p-2 bg-hb-bg"
      style={{ borderColor: 'var(--hb-border)' }}
    >
      <header className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          data-testid={`conversation-log-expand-${summary.requestId}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="text-[10px] px-1.5 py-0.5 rounded border border-hb-border hover:border-hb-accent/50 focus-visible:ring-2 focus-visible:ring-hb-accent"
        >
          {open ? '▼' : '▶'}
        </button>
        <span className="font-mono text-hb-text-muted">{formatTs(summary.startedAt)}</span>
        <span className="px-1 rounded bg-hb-bg-elevated text-hb-text-muted text-[10px] uppercase">{summary.mode}</span>
        <span
          className="px-1 rounded text-[10px] font-medium"
          style={{ color: summary.status === 'error' ? 'var(--hb-danger, #ef4444)' : 'var(--hb-accent)' }}
        >{summary.status}</span>
        <span className="font-mono text-hb-text-muted text-[10px]">{summary.totalLatencyMs}ms</span>
        <span className="font-mono text-hb-text-muted text-[10px]" title="estimated cost">~${costEst}</span>
        <span className="text-hb-text-primary truncate max-w-[40ch]" title={redactKeyShapes(summary.prompt)}>
          {redactKeyShapes(summary.prompt)}
        </span>
        <button
          type="button"
          data-testid={`conversation-log-export-md-${summary.requestId}`}
          onClick={onExportMd}
          aria-label={`Export request ${summary.requestId} as Markdown`}
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-hb-border hover:border-hb-accent/50 focus-visible:ring-2 focus-visible:ring-hb-accent"
        >
          Export MD
        </button>
      </header>

      {open && (
        <ol className="mt-2 space-y-1 list-decimal list-inside text-xs">
          {sortedEvents.map((ev, i) => {
            const trace = AISP_TRACE_BY_STAGE[ev.eventType]
            let preview = ''
            try { preview = JSON.stringify(ev.eventData) } catch { preview = '[unstringifiable]' }
            return (
              <li key={`${ev.id}-${i}`} className="border-l border-hb-border pl-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-hb-text-secondary">{STAGE_LABEL[ev.eventType] ?? ev.eventType}</span>
                  {ev.latencyMs != null && (
                    <span className="font-mono text-hb-text-muted text-[10px]">{ev.latencyMs}ms</span>
                  )}
                  {expert && trace && (
                    <span
                      data-testid="conversation-log-aisp-trace"
                      className="text-[10px] px-1 rounded bg-hb-bg-elevated border border-hb-border text-hb-text-muted font-mono"
                    >{trace}</span>
                  )}
                </div>
                <pre className="mt-0.5 text-[10px] font-mono text-hb-text-muted whitespace-pre-wrap break-words overflow-x-auto max-h-40">
                  {redactKeyShapes(preview)}
                </pre>
              </li>
            )
          })}
        </ol>
      )}
    </article>
  )
}
