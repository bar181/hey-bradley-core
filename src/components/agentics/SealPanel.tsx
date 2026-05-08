/**
 * P99 / Agent A7 — SealPanel (NEW; ≤350 LOC).
 * Renders EOP triplet (post-review / session-log / retrospective) as 3 markdown
 * cards stacked vertically (or side-by-side at desktop). "Seal Phase" button
 * fires `onSeal?.()` callback. "Export bundle" emits a single concatenated .md
 * blob via Blob + URL.createObjectURL anchor pattern. Pure component — accepts
 * props; no store coupling beyond consuming `PhaseCard` type from SpecWorkbench.
 * Tokens via `var(--hb-*)` per ADR-091. No animation libs (KISS). No new deps.
 * See: ADR-130 (P99), ADR-121 (P95 SpecWorkbench), ADR-091, ADR-122.
 */
import { Download, ListChecks, Lock, NotebookText, ScrollText } from 'lucide-react'
import type { PhaseCard } from '@/components/agentics/SpecWorkbench'

export interface EOPTriplet {
  postReview: string
  sessionLog: string
  retrospective: string
}

export interface SealPanelProps {
  phase: PhaseCard | null
  eop: EOPTriplet | null
  onSeal?: () => void
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2'

const CARD =
  'p-4 md:p-5 rounded-md border border-[var(--hb-border)] bg-[var(--hb-surface)] overflow-x-auto'

/**
 * Tiny markdown→JSX renderer. KISS — covers the EOP triplet shapes only:
 *   `# Heading`   → <h2>
 *   `## Subheading` → <h3>
 *   `- item`      → grouped <ul><li>
 *   `**bold**`    → <strong>
 *   blank line    → paragraph break
 *   plain text    → <p>
 * Not a full markdown parser. Inline-only emphasis is `**…**`.
 */
function renderInline(text: string, key: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={`${key}-b-${i}`} className="text-[var(--hb-text-primary)]">
          {p.slice(2, -2)}
        </strong>
      )
    }
    return <span key={`${key}-t-${i}`}>{p}</span>
  })
}

function renderMarkdown(md: string, idPrefix: string): React.ReactNode[] {
  const lines = md.split('\n')
  const out: React.ReactNode[] = []
  let listBuf: string[] = []
  let paraBuf: string[] = []
  const flushList = (): void => {
    if (listBuf.length === 0) return
    const items = listBuf.slice()
    out.push(
      <ul key={`${idPrefix}-ul-${out.length}`} className="list-disc ml-5 my-2 space-y-1 text-sm text-[var(--hb-text-secondary)]">
        {items.map((it, i) => (
          <li key={`${idPrefix}-li-${out.length}-${i}`}>{renderInline(it, `${idPrefix}-li-${out.length}-${i}`)}</li>
        ))}
      </ul>,
    )
    listBuf = []
  }
  const flushPara = (): void => {
    if (paraBuf.length === 0) return
    const text = paraBuf.join(' ')
    out.push(
      <p key={`${idPrefix}-p-${out.length}`} className="my-2 text-sm text-[var(--hb-text-secondary)]">
        {renderInline(text, `${idPrefix}-p-${out.length}`)}
      </p>,
    )
    paraBuf = []
  }
  const flushAll = (): void => {
    flushList()
    flushPara()
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('## ')) {
      flushAll()
      out.push(
        <h3
          key={`${idPrefix}-h3-${out.length}`}
          className="mt-3 mb-1 text-sm font-semibold text-[var(--hb-text-primary)]"
        >
          {renderInline(line.slice(3), `${idPrefix}-h3-${out.length}`)}
        </h3>,
      )
      continue
    }
    if (line.startsWith('# ')) {
      flushAll()
      out.push(
        <h2
          key={`${idPrefix}-h2-${out.length}`}
          className="mt-3 mb-2 text-base font-semibold text-[var(--hb-text-primary)]"
        >
          {renderInline(line.slice(2), `${idPrefix}-h2-${out.length}`)}
        </h2>,
      )
      continue
    }
    if (line.startsWith('- ')) {
      flushPara()
      listBuf.push(line.slice(2))
      continue
    }
    if (line.trim() === '') {
      flushAll()
      continue
    }
    flushList()
    paraBuf.push(line)
  }
  flushAll()
  return out
}

function slugForBundle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'phase'
}

function extractScores(md: string): { p1: number; p2: number; p3: number } | null {
  // Greppable summary line shape: "X P1 / Y P2 / Z P3" or similar.
  const m = md.match(/(\d+)\s*P1\s*\/\s*(\d+)\s*P2\s*\/\s*(\d+)\s*P3/i)
  if (!m) return null
  return { p1: Number(m[1]), p2: Number(m[2]), p3: Number(m[3]) }
}

interface CardProps {
  testId: string
  icon: React.ReactNode
  header: string
  body: string
  highlight?: { p1: number; p2: number; p3: number } | null
  idPrefix: string
}

function MdCard({ testId, icon, header, body, highlight, idPrefix }: CardProps) {
  return (
    <article data-testid={testId} className={CARD}>
      <header className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--hb-border)]">
        <span className="text-[var(--hb-accent)]">{icon}</span>
        <h3 className="text-sm font-semibold text-[var(--hb-text-primary)]">{header}</h3>
      </header>
      {highlight && (
        <div
          data-testid={`${testId}-highlight`}
          className="mb-3 p-2 rounded border border-[var(--hb-border)] bg-[var(--hb-bg)] text-[11px] font-mono text-[var(--hb-text-secondary)]"
        >
          KISS Review: <strong className="text-[var(--hb-text-primary)]">{highlight.p1} P1</strong> ·{' '}
          {highlight.p2} P2 · {highlight.p3} P3 — {highlight.p1 === 0 ? 'PASS' : 'FAIL'}
        </div>
      )}
      <div className="prose-none">{renderMarkdown(body, idPrefix)}</div>
    </article>
  )
}

export function SealPanel({ phase, eop, onSeal }: SealPanelProps) {
  if (phase === null || eop === null) {
    return (
      <div
        data-testid="seal-panel-empty"
        className="flex items-center justify-center min-h-[200px] p-8 rounded-md border border-dashed border-[var(--hb-border)] bg-[var(--hb-surface)]"
      >
        <p className="text-sm text-[var(--hb-text-muted)] italic">
          Run a phase to see the seal triplet
        </p>
      </div>
    )
  }

  const scores = extractScores(eop.postReview)

  const handleSeal = (): void => {
    onSeal?.()
  }

  const handleExportBundle = (): void => {
    const slug = slugForBundle(phase.id)
    const md =
      `# Post-review · ${phase.name}\n\n${eop.postReview}\n\n` +
      `# Session log · ${phase.name}\n\n${eop.sessionLog}\n\n` +
      `# Retrospective · ${phase.name}\n\n${eop.retrospective}\n`
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}-eop-bundle.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sealDisabled = eop === null

  return (
    <div data-testid="seal-panel" className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)]">
            Phase {phase.phase}
          </span>
          <h2 className="text-lg font-semibold text-[var(--hb-text-primary)]">
            Seal · {phase.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeal}
            disabled={sealDisabled}
            data-testid="seal-phase-button"
            aria-label="Seal phase"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider bg-[var(--hb-accent)] text-[var(--hb-bg)] hover:opacity-90 ${FOCUS} transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Lock size={14} aria-hidden="true" />
            Seal Phase
          </button>
          <button
            type="button"
            onClick={handleExportBundle}
            data-testid="seal-export-bundle-button"
            aria-label="Export EOP bundle markdown"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-primary)] ${FOCUS} transition-colors duration-200`}
          >
            <Download size={14} aria-hidden="true" />
            Export Bundle
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <MdCard
          testId="seal-card-post-review"
          icon={<ListChecks size={14} aria-hidden="true" />}
          header={`Post-review · ${phase.name}`}
          body={eop.postReview}
          highlight={scores}
          idPrefix="post"
        />
        <MdCard
          testId="seal-card-session-log"
          icon={<ScrollText size={14} aria-hidden="true" />}
          header="Session log"
          body={eop.sessionLog}
          idPrefix="log"
        />
        <MdCard
          testId="seal-card-retrospective"
          icon={<NotebookText size={14} aria-hidden="true" />}
          header="Retrospective"
          body={eop.retrospective}
          idPrefix="retro"
        />
      </div>
    </div>
  )
}
