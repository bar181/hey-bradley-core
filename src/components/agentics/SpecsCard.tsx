/**
 * P126 / F4 — SpecsCard.
 *
 * Agentics-tab top-of-page checklist of 9 spec sections: 3 live derivations
 * (always fresh) + 6 LLM-generated on-demand sections (cached + regeneratable).
 * Sits ABOVE SpecWorkbench in the Agentics `spec` tab. Master button generates
 * all 6 sequentially; per-row refresh regenerates one. Each on-demand row is
 * expandable to show last-generated timestamp + first-8-line preview.
 *
 * Tailwind tokens only — no new hex literals (ARCH.2 ceiling = 240). Status
 * pill colors mirror the F2b StatusBar pattern.
 *
 * Cross-refs: ADR-043 (BYOK), ADR-126 (logging), ADR-153 (LLM health),
 * ADR-154 (session-log), ADR-155 (low-confidence narration).
 */
import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { ChevronDown, ChevronRight, FileJson, FileText, History, Layers, RefreshCw } from 'lucide-react'
import { useConfigStore } from '@/store/configStore'
import { useSessionLog } from '@/contexts/intelligence/sessionLog'
import {
  SPEC_KINDS, SPEC_LABELS, useSpecsStore,
  type SpecEntry, type SpecKind, type SpecStatus,
} from '@/store/specsStore'
import { useLLMHealthStore } from '@/store/llmHealthStore'

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent focus-visible:ring-offset-2'

type LiveKind = 'json_spec' | 'chat_history' | 'site_structure'
interface LiveRow { kind: LiveKind; label: string; description: string; count?: string }

const PILL_BASE = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider'

function pillFor(status: SpecStatus): { className: string; label: string } {
  switch (status) {
    case 'fresh': return { className: `${PILL_BASE} bg-hb-success/15 text-hb-success`, label: 'Fresh' }
    case 'stale': return { className: `${PILL_BASE} bg-hb-warning/15 text-hb-warning`, label: 'Stale' }
    case 'generating': return { className: `${PILL_BASE} bg-[var(--hb-blue-dim)] text-[var(--hb-blue)]`, label: 'Generating…' }
    case 'error': return { className: `${PILL_BASE} bg-hb-error/15 text-hb-error`, label: 'Error' }
    case 'idle':
    default: return { className: `${PILL_BASE} bg-hb-surface-hover text-hb-text-muted`, label: 'Not yet generated' }
  }
}

function formatTs(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  } catch { return new Date(ts).toISOString() }
}

function previewLines(content: string | null, max: number): { text: string; truncated: boolean } {
  if (!content) return { text: '', truncated: false }
  const lines = content.split(/\r?\n/)
  return { text: lines.slice(0, max).join('\n'), truncated: lines.length > max }
}

function openWorkbench(e: React.MouseEvent<HTMLAnchorElement>): void {
  const target = document.querySelector('[data-testid="spec-workbench"]')
  if (target instanceof HTMLElement) {
    e.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function OnDemandRow({ entry, expanded, busy, onToggle, onRegenerate }: {
  entry: SpecEntry; expanded: boolean; busy: boolean; onToggle: () => void; onRegenerate: () => void
}): JSX.Element {
  const pill = pillFor(entry.status)
  const Chevron = expanded ? ChevronDown : ChevronRight
  const isGen = entry.status === 'generating'
  const preview = previewLines(entry.content, 8)
  return (
    <li className="border border-hb-border rounded-md bg-hb-surface overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        <button type="button" onClick={onToggle} aria-expanded={expanded}
          data-testid={`specs-card-row-${entry.kind}`}
          className={`flex-1 flex items-center gap-2 text-left text-sm text-hb-text-primary hover:text-hb-accent transition-colors ${FOCUS} rounded`}>
          <Chevron size={14} aria-hidden="true" className="text-hb-text-muted flex-shrink-0" />
          <FileText size={14} aria-hidden="true" className="text-hb-text-muted flex-shrink-0" />
          <span className="flex-1">{SPEC_LABELS[entry.kind]}</span>
        </button>
        <span className={pill.className} data-testid={`specs-card-pill-${entry.kind}`}>{pill.label}</span>
        <button type="button" onClick={onRegenerate} disabled={busy || isGen}
          aria-label={`Regenerate ${SPEC_LABELS[entry.kind]}`}
          data-testid={`specs-card-refresh-${entry.kind}`}
          className={`p-1 rounded text-hb-text-muted hover:text-hb-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${FOCUS}`}>
          <RefreshCw size={13} aria-hidden="true" className={isGen ? 'animate-spin' : undefined} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-hb-border bg-hb-bg/40 px-3 py-2 space-y-2">
          {entry.generatedAt && <div className="text-[11px] font-mono text-hb-text-muted">Generated {formatTs(entry.generatedAt)}</div>}
          {entry.errorMsg && <div className="text-[11px] text-hb-error">{entry.errorMsg}</div>}
          {entry.content ? (
            <pre className="font-mono text-[11px] text-hb-text-secondary whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
              {preview.text}{preview.truncated && '\n…'}
            </pre>
          ) : (
            <p className="text-[11px] text-hb-text-muted italic">No content yet — click the refresh icon to generate.</p>
          )}
          {entry.content && (
            <a href="#spec-workbench" onClick={openWorkbench}
              className={`inline-block text-[11px] text-hb-accent hover:underline ${FOCUS} rounded`}>
              Open in workbench →
            </a>
          )}
        </div>
      )}
    </li>
  )
}

function LiveRowView({ row }: { row: LiveRow }): JSX.Element {
  const Icon = row.kind === 'json_spec' ? FileJson : row.kind === 'chat_history' ? History : Layers
  return (
    <li className="flex items-center gap-2 px-3 py-2 border border-hb-border rounded-md bg-hb-surface"
      data-testid={`specs-card-live-${row.kind}`}>
      <Icon size={14} aria-hidden="true" className="text-hb-text-muted flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-hb-text-primary truncate">{row.label}</div>
        <div className="text-[11px] text-hb-text-muted truncate">{row.description}</div>
      </div>
      {row.count && <span className="text-[11px] font-mono text-hb-text-muted">{row.count}</span>}
      <span className={`${PILL_BASE} bg-hb-success/15 text-hb-success`} aria-label="live, always fresh">✓ Live</span>
    </li>
  )
}

type ConfirmState = 'idle' | 'awaiting' | 'running'

export function SpecsCard(): JSX.Element {
  const config = useConfigStore((s) => s.config)
  const { entries: sessionEntries } = useSessionLog()
  const specs = useSpecsStore((s) => s.specs)
  const generateOne = useSpecsStore((s) => s.generateOne)
  const generateAll = useSpecsStore((s) => s.generateAll)
  const llmStatus = useLLMHealthStore((s) => s.status)
  const [expanded, setExpanded] = useState<SpecKind | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>('idle')

  const sectionsCount = useMemo(() => {
    if (config.pages && config.pages.length > 0) return config.pages.reduce((acc, p) => acc + p.sections.length, 0)
    return config.sections.length
  }, [config])
  const pagesCount = config.pages?.length ?? 1

  const liveRows: LiveRow[] = [
    { kind: 'json_spec', label: 'JSON spec', description: 'The live MasterConfig driving the preview.', count: `${Object.keys(config).length} keys` },
    { kind: 'chat_history', label: 'Chat history', description: 'Every prompt, LLM call, patch, and error this session.', count: `${sessionEntries.length} entries` },
    { kind: 'site_structure', label: 'Site structure', description: 'Pages and sections derived from the spec.', count: `${pagesCount} pg · ${sectionsCount} sec` },
  ]

  const onDemandEntries = SPEC_KINDS.map((k) => specs[k])
  const freshCount = onDemandEntries.filter((e) => e.status === 'fresh').length
  const generatingNow = onDemandEntries.some((e) => e.status === 'generating') || confirm === 'running'
  const totalSections = liveRows.length + onDemandEntries.length
  const completeSections = liveRows.length + freshCount

  const handleMaster = async (): Promise<void> => {
    if (generatingNow) return
    if (llmStatus !== 'ok' && confirm === 'idle') {
      setConfirm('awaiting')
      window.setTimeout(() => setConfirm((c) => (c === 'awaiting' ? 'idle' : c)), 3000)
      return
    }
    setConfirm('running')
    try { await generateAll() } finally { setConfirm('idle') }
  }

  const handleRow = (kind: SpecKind): void => {
    if (generatingNow) return
    void generateOne(kind)
  }

  const masterLabel = confirm === 'running'
    ? 'Generating…'
    : confirm === 'awaiting' ? 'Click again to confirm (~$0.005)' : 'Create Specifications'

  return (
    <section data-testid="specs-card" className="mb-4 rounded-md border border-hb-border bg-hb-surface p-4">
      <header className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-[22px] leading-tight text-hb-text-primary"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>Specifications</h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-hb-surface-hover text-hb-text-secondary"
            data-testid="specs-card-progress">
            {completeSections}/{totalSections} sections fresh
          </span>
        </div>
        <button type="button" onClick={() => { void handleMaster() }} disabled={generatingNow}
          data-testid="specs-card-generate-all"
          aria-label="Generate all on-demand specifications"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-hb-accent text-white hover:bg-hb-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${FOCUS}`}>
          {generatingNow && <RefreshCw size={13} aria-hidden="true" className="animate-spin" />}
          {masterLabel}
        </button>
      </header>
      <p className="text-xs text-hb-text-secondary mb-3">
        Live sections stay current automatically. On-demand sections regenerate via LLM.
      </p>

      <div className="space-y-3">
        <section aria-labelledby="specs-card-live-heading">
          <h3 id="specs-card-live-heading" className="text-[11px] font-mono uppercase tracking-wider text-hb-text-muted mb-1.5">Live</h3>
          <ul className="space-y-1.5">{liveRows.map((row) => <LiveRowView key={row.kind} row={row} />)}</ul>
        </section>

        <section aria-labelledby="specs-card-on-demand-heading">
          <h3 id="specs-card-on-demand-heading" className="text-[11px] font-mono uppercase tracking-wider text-hb-text-muted mb-1.5">On-demand</h3>
          <ul className="space-y-1.5">
            {onDemandEntries.map((entry) => (
              <OnDemandRow key={entry.kind} entry={entry}
                expanded={expanded === entry.kind}
                busy={generatingNow}
                onToggle={() => setExpanded((cur) => (cur === entry.kind ? null : entry.kind))}
                onRegenerate={() => handleRow(entry.kind)} />
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}

export default SpecsCard
