/**
 * P91 / AW-PLANNING-MAP (A2) — Planning Mode integration.
 * P92 / AW-PROCESS-ATOM (A3) — PlanningChatBar wired above project list.
 * P93 / AW-DDD-ATOM (A6) — view toggle + DomainModelSVG wired.
 *
 * 3-pane layout: project list (left) · process map / domain model (center) ·
 * node-detail panel (right). Wires A1's ProcessMapSVG with sample
 * Hey Bradley arc data from src/data/sample-process-map.ts and the
 * P93 DomainModelSVG with live DDD_ATOM output.
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
 * backward-compat with P90.
 *
 * Full AGENT_ATOM body arrives P94+.
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
import {
  HEY_BRADLEY_SAMPLE_MAP,
  SAMPLE_NODE_DETAILS,
} from '@/data/sample-process-map'

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

  // Stub: only Hey Bradley project carries data; others render empty state.
  const hasMap = activeProjectId === 'hey-bradley'
  const activeMap: ProcessMap = liveMap ?? HEY_BRADLEY_SAMPLE_MAP

  const selectedNode = selectedNodeId
    ? activeMap.nodes.find((n) => n.id === selectedNodeId) ?? null
    : null
  const selectedDetail = selectedNodeId
    ? SAMPLE_NODE_DETAILS[selectedNodeId] ?? null
    : null

  const handleProjectClick = (projectId: string): void => {
    setActiveProjectId(projectId)
    setSelectedNodeId(
      projectId === 'hey-bradley' ? HEY_BRADLEY_SAMPLE_MAP.activeNodeId : undefined,
    )
  }

  const handleProcessMapChange = (map: ProcessMap): void => {
    setLiveMap(map)
    // Auto-select first node so the right-pane detail surfaces immediately.
    setSelectedNodeId(map.activeNodeId ?? map.nodes[0]?.id)
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
                onNodeSelect={setSelectedNodeId}
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

        {/* Right panel: node detail */}
        <aside
          data-testid="planning-node-detail"
          className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[var(--hb-border)] bg-[var(--hb-surface)] p-4"
        >
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-3">
            Node Detail
          </h2>
          {selectedNode && selectedDetail ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs font-mono text-[var(--hb-text-muted)]">
                  Phase {selectedNode.phase}
                </div>
                <div className="text-base font-medium text-[var(--hb-text-primary)]">
                  {selectedNode.label}
                </div>
              </div>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--hb-accent)]/10 text-[var(--hb-accent)]">
                {selectedNode.status}
              </div>
              <p className="text-sm text-[var(--hb-text-secondary)] leading-relaxed">
                {selectedDetail.description}
              </p>
              {selectedDetail.adrs.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-1">
                    ADRs
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedDetail.adrs.map((adr) => (
                      <span
                        key={adr}
                        className="px-2 py-0.5 rounded text-xs font-mono bg-[var(--hb-surface-hover)] text-[var(--hb-text-secondary)]"
                      >
                        {adr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-[var(--hb-text-muted)]">
              Click a node on the map to see its detail.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Planning
