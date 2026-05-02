/**
 * P91 / AW-PLANNING-MAP (A2) — Planning Mode integration.
 * P92 / AW-PROCESS-ATOM (A3) — PlanningChatBar wired above project list.
 * P93 / AW-DDD-ATOM (A6) — view toggle + DomainModelSVG wired.
 * P95 / AW-SPEC-WORKBENCH (A2) — SpecWorkbench replaces simple node detail.
 *
 * 3-pane layout: project list (left) · process map / domain model (center) ·
 * SpecWorkbench (right). Wires A1's ProcessMapSVG with sample
 * Hey Bradley arc data from src/data/sample-process-map.ts and the
 * P93 DomainModelSVG with live DDD_ATOM output. Right pane now hosts
 * SpecWorkbench seeded with HEY_BRADLEY_SAMPLE_PHASES; map node clicks
 * map to phase via NODE_TO_PHASE_ID.
 *
 * P92: PlanningChatBar (text → PROCESS_ATOM → liveMap) sits above the
 * project list in the left panel. When liveMap is non-null, the center
 * pane renders it instead of the hardcoded HEY_BRADLEY_SAMPLE_MAP.
 * P93: same chat bar relays raw text via `onRawText` to DDD_ATOM
 * `classifyContexts(...)`; resulting `liveDomainModel` powers the
 * DomainModelSVG view when the toggle is set to `domain-model`.
 *
 * Per ADR-116 three-mode product architecture + ADR-088 mode
 * architecture + ADR-091 token-derived styling + ADR-118 PROCESS_ATOM
 * + ADR-119 DDD_ATOM. Stub testid `planning-mode-stub` retained for
 * backward-compat with P90; existing testids preserved for P91-P94.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProcessMapSVG } from '@/components/planning/ProcessMapSVG'
import type { ProcessMap } from '@/components/planning/ProcessMapSVG'
import { PlanningChatBar } from '@/components/planning/PlanningChatBar'
import { DomainModelSVG } from '@/components/planning/DomainModelSVG'
import {
  PlanningViewToggle,
  type PlanningView,
} from '@/components/planning/PlanningViewToggle'
import {
  classifyContexts,
  toDomainModel,
  type DomainModel,
} from '@/contexts/intelligence/aisp/dddAtom'
import { SpecWorkbench } from '@/components/agentics/SpecWorkbench'
import { HEY_BRADLEY_SAMPLE_MAP } from '@/data/sample-process-map'
import {
  HEY_BRADLEY_SAMPLE_PHASES,
  NODE_TO_PHASE_ID,
} from '@/data/sample-spec-workbench'

interface PlanningProject {
  id: string
  label: string
}

const PROJECTS: readonly PlanningProject[] = [
  { id: 'hey-bradley', label: 'Hey Bradley Build' },
  { id: 'coffee-roaster', label: 'Coffee Roaster Site' },
  { id: 'portfolio', label: 'Portfolio Refresh' },
]

export function Planning() {
  const [activeProjectId, setActiveProjectId] = useState<string>('hey-bradley')
  // P92 / A3: live process map produced from PlanningChatBar (PROCESS_ATOM).
  // null → fall back to the hardcoded HEY_BRADLEY_SAMPLE_MAP.
  const [liveMap, setLiveMap] = useState<ProcessMap | null>(null)
  // P93 / A6: live domain model from DDD_ATOM (sibling atom to PROCESS_ATOM).
  const [liveDomainModel, setLiveDomainModel] = useState<DomainModel | null>(null)
  // P93 / A6: view toggle between process-map ↔ domain-model.
  const [view, setView] = useState<PlanningView>('process-map')
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    HEY_BRADLEY_SAMPLE_MAP.activeNodeId,
  )
  // P95 / A2: SpecWorkbench selection — phase + sprint derived from node.
  const initialPhaseId =
    (HEY_BRADLEY_SAMPLE_MAP.activeNodeId &&
      NODE_TO_PHASE_ID[HEY_BRADLEY_SAMPLE_MAP.activeNodeId]) ||
    HEY_BRADLEY_SAMPLE_PHASES[0]?.id ||
    ''
  const [activePhaseId, setActivePhaseId] = useState<string>(initialPhaseId)
  const [activeSprintId, setActiveSprintId] = useState<string | undefined>(
    HEY_BRADLEY_SAMPLE_PHASES.find((p) => p.id === initialPhaseId)?.sprints[0]?.id,
  )

  // Stub: only Hey Bradley project carries data; others render empty state.
  const hasMap = activeProjectId === 'hey-bradley'
  const activeMap: ProcessMap = liveMap ?? HEY_BRADLEY_SAMPLE_MAP

  const selectPhaseFromNode = (nodeId: string | undefined): void => {
    if (!nodeId) return
    const phaseId = NODE_TO_PHASE_ID[nodeId]
    if (!phaseId) return
    setActivePhaseId(phaseId)
    const phase = HEY_BRADLEY_SAMPLE_PHASES.find((p) => p.id === phaseId)
    setActiveSprintId(phase?.sprints[0]?.id)
  }

  const handleNodeSelect = (nodeId: string): void => {
    setSelectedNodeId(nodeId)
    selectPhaseFromNode(nodeId)
  }

  const handleProjectClick = (projectId: string): void => {
    setActiveProjectId(projectId)
    const nextNodeId =
      projectId === 'hey-bradley' ? HEY_BRADLEY_SAMPLE_MAP.activeNodeId : undefined
    setSelectedNodeId(nextNodeId)
    selectPhaseFromNode(nextNodeId)
  }

  const handleProcessMapChange = (map: ProcessMap): void => {
    setLiveMap(map)
    // Auto-select first node so the right-pane SpecWorkbench surfaces immediately.
    const next = map.activeNodeId ?? map.nodes[0]?.id
    setSelectedNodeId(next)
    selectPhaseFromNode(next)
  }

  // P93 / A6: relay raw chat text into DDD_ATOM in parallel with PROCESS_ATOM.
  const handleRawText = (raw: string): void => {
    const dddOutput = classifyContexts(raw)
    setLiveDomainModel(toDomainModel(dddOutput))
  }

  return (
    <div
      data-testid="planning-mode-stub"
      className="min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]"
    >
      <header className="border-b border-[var(--hb-border)] px-4 md:px-8 py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--hb-accent)]/10 text-[var(--hb-accent)]">
            Planning · P93
          </span>
          <PlanningViewToggle value={view} onChange={setView} />
        </div>
        <Link
          to="/"
          className="text-sm text-[var(--hb-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 rounded transition-colors duration-200"
          data-testid="planning-back-home"
        >
          ← Back to home
        </Link>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Left panel: chat bar + project list */}
        <aside
          data-testid="planning-project-list"
          className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--hb-border)] bg-[var(--hb-surface)] p-4 flex flex-col gap-4"
        >
          <PlanningChatBar
            onProcessMapChange={handleProcessMapChange}
            onRawText={handleRawText}
          />
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-3">
            Projects
          </h2>
          <ul className="space-y-1">
            {PROJECTS.map((p) => {
              const isActive = activeProjectId === p.id
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    data-testid={`planning-project-${p.id}`}
                    onClick={() => handleProjectClick(p.id)}
                    aria-pressed={isActive}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 ${
                      isActive
                        ? 'bg-[var(--hb-accent)]/15 text-[var(--hb-accent)]'
                        : 'hover:bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)]'
                    }`}
                  >
                    {p.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Center: process map OR domain model OR empty state */}
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          {!hasMap ? (
            <div
              data-testid="planning-empty-state"
              className="flex items-center justify-center h-full min-h-[300px] text-sm text-[var(--hb-text-muted)]"
            >
              Start a project to see your process map.
            </div>
          ) : view === 'process-map' ? (
            <div data-testid="planning-process-map">
              <ProcessMapSVG
                map={{ ...activeMap, activeNodeId: selectedNodeId }}
                onNodeSelect={handleNodeSelect}
              />
            </div>
          ) : liveDomainModel ? (
            <div data-testid="planning-domain-model">
              <DomainModelSVG model={liveDomainModel} />
            </div>
          ) : (
            <div
              data-testid="planning-domain-model-empty"
              className="flex items-center justify-center h-full min-h-[300px] text-sm text-[var(--hb-text-muted)]"
            >
              Type a project description to see its domain model.
            </div>
          )}
        </main>

        {/* Right panel: SpecWorkbench (P95) — was simple node detail (P91). */}
        <aside
          data-testid="planning-node-detail"
          className="w-full md:w-96 border-t md:border-t-0 md:border-l border-[var(--hb-border)] bg-[var(--hb-surface)] p-4 overflow-y-auto"
        >
          {hasMap ? (
            <div data-testid="planning-spec-workbench">
              <SpecWorkbench
                phases={HEY_BRADLEY_SAMPLE_PHASES}
                activePhaseId={activePhaseId}
                activeSprintId={activeSprintId}
              />
            </div>
          ) : (
            <div className="text-sm text-[var(--hb-text-muted)]">
              Select a project to see its spec.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Planning
