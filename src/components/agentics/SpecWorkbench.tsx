/**
 * P95 / Agent A1 — SpecWorkbench (NEW; tabbed sprint-card layout for Agentics).
 * Phase → sprint hierarchy + 3-tab strip (Human / AISP / ADR). Sprint cards
 * expand inline (agent scopes + DoD + verbatim AISP Σ). Clipboard primary;
 * ZIP deferred to P96. Pure component; tokens via `var(--hb-*)` per ADR-091.
 * Sealed/deferred status uses literal hex per ADR-117.
 * See: ADR-121, ADR-110, ADR-116, ADR-120, ADR-091, ADR-090.
 */
import { useEffect, useState } from 'react'
import { BookOpen, ChevronRight, Code2, Copy, FileText, FlaskConical, ShieldCheck } from 'lucide-react'
import { ExportClaudeCodeButton } from '@/components/agentics/ExportClaudeCodeButton'
import { buildTDDScaffold } from '@/contexts/specification/exporters/tddScaffoldGenerator'
import { buildKissReview } from '@/contexts/specification/reviewers/kissReviewer'
import { writeLogEvent, newRequestId } from '@/contexts/persistence/repositories/comprehensiveLogs'
import { getDB } from '@/contexts/persistence/db'

export type SpecTab = 'human' | 'aisp' | 'adr'
type Status = 'planned' | 'in-flight' | 'sealed' | 'deferred'

export interface SprintSummary {
  readonly id: string
  readonly name: string
  readonly status: Status
  readonly agentCount: number
  readonly keyDeliverable: string
  readonly agentScopes?: ReadonlyArray<{
    readonly id: string
    readonly role: string
    readonly ownedFiles: ReadonlyArray<string>
  }>
  readonly dod?: ReadonlyArray<string>
  readonly aispSpec?: string
}

export interface PhaseCard {
  readonly id: string
  readonly phase: number
  readonly name: string
  readonly status: Status
  readonly sprints: ReadonlyArray<SprintSummary>
  readonly humanSpec: {
    readonly northStar: string
    readonly sadd: string
    readonly implementationPlan: string
  }
  readonly aispSpec: string
  readonly adrRefs: ReadonlyArray<{
    readonly id: string
    readonly title: string
    readonly href?: string
  }>
}

export interface SpecWorkbenchProps {
  phases: ReadonlyArray<PhaseCard>
  activePhaseId?: string
  activeSprintId?: string
  onSprintExpand?: (sprintId: string) => void
}

const PILL =
  'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider'
const TAB =
  'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 border-b-2'
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]'

function StatusPill({ status }: { status: Status }) {
  if (status === 'sealed')
    return <span className={PILL} style={{ backgroundColor: '#22c55e22', color: '#22c55e' }}>{status}</span>
  if (status === 'deferred')
    return <span className={PILL} style={{ backgroundColor: '#f59e0b22', color: '#f59e0b' }}>{status}</span>
  const cls = status === 'in-flight'
    ? `${PILL} bg-[var(--hb-accent)] text-[var(--hb-bg)]`
    : `${PILL} bg-[var(--hb-surface-hover)] text-[var(--hb-text-muted)]`
  return <span className={cls}>{status}</span>
}

function SprintChip({ sprint, active, expanded, onClick }: {
  sprint: SprintSummary; active: boolean; expanded: boolean; onClick: () => void
}) {
  const border = active ? 'border-[var(--hb-accent)]' : 'border-[var(--hb-border)]'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      data-testid={`spec-sprint-${sprint.id}`}
      className={`flex-shrink-0 min-w-[200px] text-left p-3 rounded-md border ${border} bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] hover:-translate-y-0.5 transform ${FOCUS} transition-all duration-200`}
      style={{ filter: active ? 'drop-shadow(0 0 8px var(--hb-accent))' : undefined }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-[var(--hb-text-primary)] truncate">{sprint.name}</span>
        <StatusPill status={sprint.status} />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-1">
        {sprint.agentCount} agent{sprint.agentCount === 1 ? '' : 's'}
      </div>
      <div className="text-xs text-[var(--hb-text-secondary)] line-clamp-1">{sprint.keyDeliverable}</div>
    </button>
  )
}

function ExpandPanel({ sprint }: { sprint: SprintSummary }) {
  return (
    <div
      data-testid={`spec-sprint-expanded-${sprint.id}`}
      className="mt-3 p-4 rounded-md border border-[var(--hb-border)] bg-[var(--hb-surface)] space-y-3"
    >
      {sprint.agentScopes && sprint.agentScopes.length > 0 && (
        <section>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-2">Agent Scopes</h4>
          <ul className="space-y-1.5">
            {sprint.agentScopes.map((a) => (
              <li key={a.id} className="text-xs">
                <span className="font-semibold text-[var(--hb-text-primary)]">{a.id}</span>
                <span className="text-[var(--hb-text-secondary)]"> · {a.role}</span>
                {a.ownedFiles.length > 0 && (
                  <span className="block font-mono text-[10px] text-[var(--hb-text-muted)] mt-0.5">
                    {a.ownedFiles.join(' · ')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      {sprint.dod && sprint.dod.length > 0 && (
        <section>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-2">Definition of Done</h4>
          <ul className="space-y-1">
            {sprint.dod.map((item, i) => (
              <li key={i} className="text-xs text-[var(--hb-text-secondary)] flex items-start gap-1.5">
                <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {sprint.aispSpec && (
        <section>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-2">AISP Σ</h4>
          <pre className="font-mono text-[11px] p-3 rounded border border-[var(--hb-border)] bg-[var(--hb-bg)] text-[var(--hb-text-primary)] overflow-x-auto whitespace-pre-wrap">
            {sprint.aispSpec}
          </pre>
        </section>
      )}
    </div>
  )
}

function AispTab({ spec }: { spec: string }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(t)
  }, [copied])
  const handleCopy = async (): Promise<void> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(spec)
        setCopied(true)
      }
    } catch {
      /* swallow */
    }
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        data-testid="spec-aisp-copy"
        aria-label="Copy AISP spec to clipboard"
        className={`absolute top-2 right-2 inline-flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-xs text-[var(--hb-text-secondary)] ${FOCUS}`}
      >
        <Copy className="h-3 w-3" aria-hidden="true" />
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="font-mono text-xs p-4 pr-20 rounded-md border border-[var(--hb-border)] bg-[var(--hb-bg)] text-[var(--hb-text-primary)] overflow-x-auto whitespace-pre-wrap">
        {spec}
      </pre>
    </div>
  )
}

function HumanTab({ spec }: { spec: PhaseCard['humanSpec'] }) {
  const Item = ({ h, b }: { h: string; b: string }) => (
    <section>
      <h3 className="text-sm font-semibold text-[var(--hb-text-primary)] mb-1">{h}</h3>
      <p className="text-sm text-[var(--hb-text-secondary)]">{b}</p>
    </section>
  )
  return (
    <div className="space-y-4">
      <Item h="North Star" b={spec.northStar} />
      <Item h="SADD" b={spec.sadd} />
      <Item h="Implementation Plan" b={spec.implementationPlan} />
    </div>
  )
}

function AdrTab({ refs }: { refs: PhaseCard['adrRefs'] }) {
  if (refs.length === 0)
    return <p className="text-sm text-[var(--hb-text-muted)] italic">No ADRs yet for this phase</p>
  return (
    <ul className="space-y-2">
      {refs.map((adr) => (
        <li key={adr.id}>
          <a
            href={adr.href ?? `/docs/adr/${adr.id}`}
            className={`flex items-center gap-3 p-2 rounded border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] ${FOCUS} transition-colors duration-200`}
          >
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)] flex-shrink-0">
              {adr.id}
            </span>
            <span className="text-sm text-[var(--hb-text-primary)]">{adr.title}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function slugForTestSpec(s: string): string {
  return (s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')) || 'phase'
}

function RunKissReviewButton({ phase }: { phase: PhaseCard }) {
  const [s, setS] = useState<{ p1: number; p2: number; p3: number } | null>(null)
  const handleClick = (): void => {
    const out = buildKissReview(phase)
    const f = (out.findings ?? []) as ReadonlyArray<{ severity?: string }>
    const p1 = f.filter((x) => x.severity === 'P1').length, p2 = f.filter((x) => x.severity === 'P2').length, p3 = f.filter((x) => x.severity === 'P3').length
    setS({ p1, p2, p3 })
    try { writeLogEvent(getDB(), { id: newRequestId(), sessionId: 'kiss-review', requestId: newRequestId(), eventType: 'response_summary', eventData: { kind: 'kiss-review', phaseId: phase.id, findings: out.findings, summary: { p1, p2, p3 } }, latencyMs: 0 }) } catch { /* fire-and-forget per ADR-126 */ }
  }
  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button type="button" onClick={handleClick} data-testid="run-kiss-review-button" aria-label="Run KISS review on active phase" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-primary)] ${FOCUS} transition-colors duration-200`}>
        <ShieldCheck size={14} aria-hidden="true" /> Run KISS Review
      </button>
      {s && <span data-testid="kiss-review-summary" className="text-[10px] font-mono text-[var(--hb-text-muted)]">KISS Review: {s.p1} P1 / {s.p2} P2 / {s.p3} P3 — {s.p1 === 0 ? 'PASS' : 'FAIL'}</span>}
    </div>
  )
}
function GenerateTestSpecButton({ phase }: { phase: PhaseCard }) {
  const handleClick = (): void => {
    const out = buildTDDScaffold(phase)
    const blob = new Blob([out.markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slugForTestSpec(phase.id)}-test-spec.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      data-testid="generate-test-spec-button"
      aria-label="Generate TDD test spec markdown"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider border border-[var(--hb-border)] bg-[var(--hb-surface)] hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-primary)] ${FOCUS} transition-colors duration-200`}
    >
      <FlaskConical size={14} aria-hidden="true" />
      Generate Test Spec
    </button>
  )
}

export function SpecWorkbench({ phases, activePhaseId, activeSprintId, onSprintExpand }: SpecWorkbenchProps) {
  const [tab, setTab] = useState<SpecTab>('human')
  const [expanded, setExpanded] = useState<string | undefined>(activeSprintId)

  if (phases.length === 0) {
    return (
      <div
        data-testid="spec-workbench-empty"
        className="flex items-center justify-center min-h-[200px] p-8 rounded-md border border-dashed border-[var(--hb-border)] bg-[var(--hb-surface)]"
      >
        <p className="text-sm text-[var(--hb-text-muted)] italic">Select a phase to see its spec</p>
      </div>
    )
  }

  const phase = phases.find((p) => p.id === activePhaseId) ?? phases[0]
  const handleSprintClick = (id: string): void => {
    const next = expanded === id ? undefined : id
    setExpanded(next)
    if (next !== undefined) onSprintExpand?.(next)
  }

  const tabBtn = (key: SpecTab, testId: string, icon: React.ReactNode, label: string) => {
    const active = tab === key
    const cls = active
      ? `${TAB} border-[var(--hb-accent)] text-[var(--hb-accent)]`
      : `${TAB} border-transparent text-[var(--hb-text-muted)] hover:text-[var(--hb-text-primary)]`
    return (
      <button key={key} type="button" role="tab" aria-selected={active} data-testid={testId} onClick={() => setTab(key)} className={cls}>
        {icon}
        {label}
      </button>
    )
  }

  return (
    <div data-testid="spec-workbench" className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)]">
            Phase {phase.phase}
          </span>
          <h2 className="text-lg font-semibold text-[var(--hb-text-primary)]">{phase.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={phase.status} />
          <RunKissReviewButton phase={phase} />
          <GenerateTestSpecButton phase={phase} />
          <ExportClaudeCodeButton phase={phase} />
        </div>
      </header>

      <section
        data-testid="spec-sprint-collection"
        className="flex flex-row gap-3 overflow-x-auto md:flex-wrap md:overflow-visible pb-2"
      >
        {phase.sprints.map((s) => (
          <SprintChip
            key={s.id}
            sprint={s}
            active={s.id === activeSprintId}
            expanded={s.id === expanded}
            onClick={() => handleSprintClick(s.id)}
          />
        ))}
      </section>

      {expanded &&
        phase.sprints.filter((s) => s.id === expanded).map((s) => <ExpandPanel key={s.id} sprint={s} />)}

      <div role="tablist" aria-label="Spec views" className="flex flex-row border-b border-[var(--hb-border)]">
        {tabBtn('human', 'spec-tab-human', <FileText className="h-3.5 w-3.5" aria-hidden="true" />, 'Human')}
        {tabBtn('aisp', 'spec-tab-aisp', <Code2 className="h-3.5 w-3.5" aria-hidden="true" />, 'AISP')}
        {tabBtn('adr', 'spec-tab-adr', <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />, 'ADR')}
      </div>

      <div role="tabpanel" className="min-h-[120px]">
        {tab === 'human' && <HumanTab spec={phase.humanSpec} />}
        {tab === 'aisp' && <AispTab spec={phase.aispSpec} />}
        {tab === 'adr' && <AdrTab refs={phase.adrRefs} />}
      </div>
    </div>
  )
}
