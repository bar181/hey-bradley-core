/**
 * P91 / AW-PLANNING-MAP (A2) — Planning Mode integration.
 *
 * 3-pane layout: project list (left) · process map (center) ·
 * node-detail panel (right). Wires A1's ProcessMapSVG with sample
 * Hey Bradley arc data from src/data/sample-process-map.ts.
 *
 * Per ADR-116 three-mode product architecture + ADR-088 mode
 * architecture + ADR-091 token-derived styling. Stub testid
 * `planning-mode-stub` retained for backward-compat with P90 tests.
 *
 * Full PROCESS_ATOM / DDD_ATOM / AGENT_ATOM bodies arrive P92-P95.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProcessMapSVG } from '@/components/planning/ProcessMapSVG'
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

export function Planning(): JSX.Element {
  const [activeProjectId, setActiveProjectId] = useState<string>('hey-bradley')
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    HEY_BRADLEY_SAMPLE_MAP.activeNodeId,
  )

  // Stub: only Hey Bradley project carries data; others render empty state.
  const hasMap = activeProjectId === 'hey-bradley'

  const selectedNode = selectedNodeId
    ? HEY_BRADLEY_SAMPLE_MAP.nodes.find((n) => n.id === selectedNodeId) ?? null
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

  return (
    <div
      data-testid="planning-mode-stub"
      className="min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]"
    >
      <header className="border-b border-[var(--hb-border)] px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--hb-accent)]/10 text-[var(--hb-accent)]">
            Planning · P91
          </span>
          <span className="text-base font-medium">Process Map</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--hb-surface-hover)] text-[var(--hb-text-muted)]">
            Coming soon
          </span>
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
        {/* Left panel: project list */}
        <aside
          data-testid="planning-project-list"
          className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--hb-border)] bg-[var(--hb-surface)] p-4"
        >
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

        {/* Center: process map OR empty state */}
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          {hasMap ? (
            <div data-testid="planning-process-map">
              <ProcessMapSVG
                map={{ ...HEY_BRADLEY_SAMPLE_MAP, activeNodeId: selectedNodeId }}
                onNodeSelect={setSelectedNodeId}
              />
            </div>
          ) : (
            <div
              data-testid="planning-empty-state"
              className="flex items-center justify-center h-full min-h-[300px] text-sm text-[var(--hb-text-muted)]"
            >
              Start a project to see your process map.
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
