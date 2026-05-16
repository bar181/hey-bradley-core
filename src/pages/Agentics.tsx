/**
 * P90 / AW-MODE-ARCH (A3) — Agentics Mode stub.
 * P95 / AW-SPEC-WORKBENCH (A2) — 3-pane layout: phase tree · process map · SpecWorkbench.
 *
 * Per ADR-085 multi-page MVP context + ADR-088 mode architecture +
 * ADR-110 AISP visibility standard (developer onboarding card surfaces
 * here — Agentics is where AISP is most prominent) + ADR-116 three-mode
 * product architecture. Stub testid `agentics-mode-stub` retained for
 * backward-compat with P90.
 *
 * P95: replaces the 53-LOC stub layout with three panes. Left =
 * phase/sprint tree (click-to-expand). Center = ProcessMapSVG seeded
 * with the Hey Bradley sample arc. Right = SpecWorkbench seeded with
 * three PhaseCards (foundation / intelligence / polish). Clicking a
 * map node selects the phase via NODE_TO_PHASE_ID.
 */
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FileText, Activity, Database, MessageSquare } from 'lucide-react'
import { AISPDeveloperCard } from '@/components/onboarding/AISPDeveloperCard'
import { ProcessMapSVG, type ProcessMap } from '@/components/planning/ProcessMapSVG'
import { SpecWorkbench } from '@/components/agentics/SpecWorkbench'
import { SealPanel } from '@/components/agentics/SealPanel'
// P126 / F4 — Specifications card (live + on-demand spec sections).
import { SpecsCard } from '@/components/agentics/SpecsCard'
// P122 / W6 — Agentics observability surfaces (LLM log + DB inspector).
// Cross-ref: ADR-043 (BYOK), ADR-126 (logging), ADR-110 (AISP visibility).
import { LLMLogPanel } from '@/components/agentics/LLMLogPanel'
import { DBPanel } from '@/components/agentics/DBPanel'
// P126 / F3 — chat-history feed surfaced as the 4th observability tab. ADR-154.
import { ChatHistoryPanel } from '@/components/agentics/ChatHistoryPanel'
// P122 / W6 — surface CostPill in Agentics header so the owner can watch
// live BYOK cap consumption without switching modes (preflight §4-G-25).
import { CostPill } from '@/components/shell/CostPill'
import { useProjectStore } from '@/store/projectStore'
import { HEY_BRADLEY_SAMPLE_MAP } from '@/data/sample-process-map'
import {
  HEY_BRADLEY_SAMPLE_PHASES,
  NODE_TO_PHASE_ID,
} from '@/data/sample-spec-workbench'
import { writeLogEvent, newRequestId } from '@/contexts/persistence/repositories/comprehensiveLogs'
import { getDB } from '@/contexts/persistence/db'
import {
  toProcessMap,
  type ProcessAtomOutput,
} from '@/contexts/intelligence/aisp/processAtom'

export function Agentics() {
  const phases = HEY_BRADLEY_SAMPLE_PHASES
  // P122 / W6 — read activeProject for project-scoped LLM log + DB views.
  const activeProjectId = useProjectStore((s) => s.activeProject)
  const [activePhaseId, setActivePhaseId] = useState<string>('foundation')
  const [activeSprintId, setActiveSprintId] = useState<string | undefined>(
    phases[0]?.sprints[0]?.id,
  )
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    HEY_BRADLEY_SAMPLE_MAP.activeNodeId,
  )
  const [expandedPhaseIds, setExpandedPhaseIds] = useState<readonly string[]>([
    'foundation',
  ])
  // Loop 2 / Agentics lift — tabbed observability. "spec" is the spec workbench
  // (default landing), "log" is the LLM call ledger, "db" is the raw DB inspector.
  // P126 / F3 — "history" added as the 4th tab (chat-history feed; ADR-154).
  // Tabs replace stacked panels so the visitor sees one observability surface
  // at a time instead of the previous "stacked widgets" feel.
  // P126 / F3 — read `?tab=history` (and any of the 3 legacy slugs) from the
  // URL so external links / ADR-155 deep-link narrations can land directly on
  // the right tab. Falls back to 'spec' when the param is missing/invalid.
  const [searchParams] = useSearchParams()
  const initialObsTab: 'spec' | 'log' | 'db' | 'history' = (() => {
    const t = searchParams.get('tab')
    if (t === 'history' || t === 'log' || t === 'db' || t === 'spec') return t
    return 'spec'
  })()
  const [obsTab, setObsTab] = useState<'spec' | 'log' | 'db' | 'history'>(initialObsTab)

  // P102 / A2 (CF#8 closure) — surface most-recent PROCESS_ATOM output from
  // log_events into the Agentics center map. Fire-and-forget per ADR-126; on
  // miss → fall back to HEY_BRADLEY_SAMPLE_MAP (page never blank-states).
  const [liveMap, setLiveMap] = useState<ProcessMap | null>(null)
  useEffect(() => {
    let stmt: ReturnType<ReturnType<typeof getDB>['prepare']> | null = null
    try {
      stmt = getDB().prepare(
        `SELECT event_data FROM log_events WHERE event_type = 'process_atom_output' ORDER BY created_at DESC LIMIT 1`,
      )
      if (stmt.step()) {
        const row = stmt.getAsObject() as { event_data?: string }
        if (row.event_data) {
          const p = JSON.parse(row.event_data) as Partial<ProcessAtomOutput>
          if (p.phases && p.sprints && p.waves) {
            setLiveMap(toProcessMap({
              phases: p.phases, sprints: p.sprints, waves: p.waves,
              agents: p.agents ?? [], rationale: p.rationale ?? '',
            }))
          }
        }
      }
    } catch (e) {
      if (typeof console !== 'undefined') console.warn('[Agentics] live map load failed', e)
    } finally {
      if (stmt) try { stmt.free() } catch { /* ignore */ }
    }
  }, [])

  const activeMap = liveMap ?? HEY_BRADLEY_SAMPLE_MAP

  const activePhase = useMemo(
    () => phases.find((p) => p.id === activePhaseId) ?? null,
    [phases, activePhaseId],
  )

  const handlePhaseClick = (phaseId: string): void => {
    setActivePhaseId(phaseId)
    const next = phases.find((p) => p.id === phaseId)
    setActiveSprintId(next?.sprints[0]?.id)
    setExpandedPhaseIds((prev) =>
      prev.includes(phaseId) ? prev : [...prev, phaseId],
    )
  }

  const handleSprintClick = (phaseId: string, sprintId: string): void => {
    setActivePhaseId(phaseId)
    setActiveSprintId(sprintId)
  }

  const handleNodeSelect = (nodeId: string): void => {
    setSelectedNodeId(nodeId)
    const phaseId = NODE_TO_PHASE_ID[nodeId]
    if (phaseId) {
      setActivePhaseId(phaseId)
      const next = phases.find((p) => p.id === phaseId)
      setActiveSprintId(next?.sprints[0]?.id)
      setExpandedPhaseIds((prev) =>
        prev.includes(phaseId) ? prev : [...prev, phaseId],
      )
    }
  }

  return (
    <div
      data-testid="agentics-mode-stub"
      className="min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]"
    >
      {/* Loop 2 / Agentics lift — hero header replaces the thin metadata strip.
          Plain-English headline + subtitle gives the page identity; CostPill
          surfaces large + always-visible at top right; back-home link demoted
          but still focusable. */}
      <header className="border-b border-[var(--hb-border)] bg-[var(--hb-surface)]/40">
        <div className="px-4 md:px-8 py-2 flex items-center justify-between gap-3 border-b border-[var(--hb-border)]/60">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--hb-accent)]/10 text-[var(--hb-accent)]">
            Agentics · P95
          </span>
          <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
            <CostPill />
            <Link
              to="/"
              className="text-xs text-[var(--hb-text-muted)] hover:text-[var(--hb-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 rounded transition-colors duration-200"
              data-testid="agentics-back-home"
            >
              ← Back to home
            </Link>
          </div>
        </div>
        <div className="px-4 md:px-8 py-5 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--hb-text-primary)]">
            Agentics — see how your site was built.
          </h1>
          <p className="mt-1.5 text-sm md:text-base text-[var(--hb-text-secondary)] max-w-2xl">
            Every prompt, every patch, every spec. Live evidence that the assistant did the work.
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Left: phase / sprint tree */}
        <aside
          data-testid="agentics-phase-tree"
          className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--hb-border)] bg-[var(--hb-surface)] p-4 flex flex-col gap-3"
        >
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)]">
            Phases
          </h2>
          <ul className="space-y-1">
            {phases.map((phase) => {
              const isActive = activePhaseId === phase.id
              const isExpanded = expandedPhaseIds.includes(phase.id)
              return (
                <li key={phase.id}>
                  <button
                    type="button"
                    data-testid={`agentics-phase-${phase.id}`}
                    onClick={() => handlePhaseClick(phase.id)}
                    aria-pressed={isActive}
                    aria-expanded={isExpanded}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 ${
                      isActive
                        ? 'bg-[var(--hb-accent)]/15 text-[var(--hb-accent)]'
                        : 'hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)]'
                    }`}
                  >
                    <span className="font-mono text-xs text-[var(--hb-text-muted)] mr-2">
                      P{phase.phase}
                    </span>
                    {phase.name}
                  </button>
                  {isExpanded && phase.sprints.length > 0 && (
                    <ul className="mt-1 ml-4 space-y-0.5 border-l border-[var(--hb-border)] pl-3">
                      {phase.sprints.map((sprint) => {
                        const isSprintActive =
                          isActive && activeSprintId === sprint.id
                        return (
                          <li key={sprint.id}>
                            <button
                              type="button"
                              data-testid={`agentics-sprint-${sprint.id}`}
                              onClick={() => handleSprintClick(phase.id, sprint.id)}
                              aria-pressed={isSprintActive}
                              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 ${
                                isSprintActive
                                  ? 'text-[var(--hb-accent)]'
                                  : 'text-[var(--hb-text-muted)] hover:text-[var(--hb-text-secondary)]'
                              }`}
                            >
                              {sprint.name}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
          <div className="mt-auto pt-4">
            <AISPDeveloperCard />
          </div>
        </aside>

        {/* Center: ProcessMapSVG */}
        <main
          data-testid="agentics-process-map"
          className="flex-1 p-4 md:p-6 overflow-x-auto"
        >
          <ProcessMapSVG
            map={{ ...activeMap, activeNodeId: selectedNodeId }}
            onNodeSelect={handleNodeSelect}
          />
        </main>

        {/* Right: SpecWorkbench */}
        <aside
          data-testid="agentics-spec-workbench"
          className="w-full md:w-96 border-t md:border-t-0 md:border-l border-[var(--hb-border)] bg-[var(--hb-surface)] p-4 overflow-y-auto"
        >
          {activePhase ? (
            <>
              {/* Loop 2 / Agentics lift — tabbed observability. The 3 surfaces
                  (Spec / LLM Log / Database) used to stack vertically and feel
                  like 3 unrelated widgets. Tabs make them ONE observability
                  workbench with a single visible focus at a time. */}
              <div
                role="tablist"
                aria-label="Observability views"
                data-testid="agentics-obs-tablist"
                className="flex border-b border-[var(--hb-border)] mb-4"
              >
                {([
                  { id: 'spec', label: 'Spec', icon: FileText },
                  { id: 'log', label: 'LLM Log', icon: Activity },
                  { id: 'db', label: 'Database', icon: Database },
                  { id: 'history', label: 'Chat History', icon: MessageSquare },
                ] as const).map(({ id, label, icon: Icon }) => {
                  const isActive = obsTab === id
                  return (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={isActive}
                      data-testid={`agentics-obs-tab-${id}`}
                      type="button"
                      onClick={() => setObsTab(id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 ${
                        isActive
                          ? 'text-[var(--hb-accent)] border-b-2 border-[var(--hb-accent)] -mb-px'
                          : 'text-[var(--hb-text-muted)] hover:text-[var(--hb-text-secondary)]'
                      }`}
                    >
                      <Icon size={13} aria-hidden="true" />
                      {label}
                    </button>
                  )
                })}
              </div>

              {obsTab === 'spec' && (
                <div role="tabpanel" data-testid="agentics-obs-panel-spec">
                  {/* P126 / F4 — higher-level checklist sits ABOVE the workbench. */}
                  <SpecsCard />
                  <SpecWorkbench
                    phases={phases}
                    activePhaseId={activePhaseId}
                    activeSprintId={activeSprintId}
                  />
                  <div className="mt-4">
                    <SealPanel
                      phase={activePhase}
                      eop={null}
                      onSeal={() => {
                        try {
                          writeLogEvent(getDB(), {
                            id: newRequestId(),
                            sessionId: 'agentics',
                            requestId: newRequestId(),
                            eventType: 'response_summary',
                            eventData: { kind: 'seal-event', phaseId: activePhase.id },
                            latencyMs: 0,
                          })
                        } catch { /* fire-and-forget per ADR-126 */ }
                      }}
                    />
                  </div>
                </div>
              )}

              {obsTab === 'log' && (
                <div role="tabpanel" data-testid="agentics-obs-panel-log">
                  <p className="mb-3 text-xs text-[var(--hb-text-muted)]">
                    Recent LLM calls — BYOK · redacted.
                  </p>
                  <LLMLogPanel projectId={activeProjectId} />
                </div>
              )}

              {obsTab === 'db' && (
                <div role="tabpanel" data-testid="agentics-obs-panel-db">
                  <p className="mb-3 text-xs text-[var(--hb-text-muted)]">
                    Raw project data — every patch, every event.
                  </p>
                  <DBPanel projectId={activeProjectId} />
                </div>
              )}

              {obsTab === 'history' && (
                <div role="tabpanel" data-testid="agentics-obs-panel-history">
                  <p className="mb-3 text-xs text-[var(--hb-text-muted)]">
                    Every prompt, LLM call, patch, and error — redacted, in-browser.
                  </p>
                  <ChatHistoryPanel />
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-[var(--hb-text-muted)]">
              Pick a phase from the map to see how it was built.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Agentics
