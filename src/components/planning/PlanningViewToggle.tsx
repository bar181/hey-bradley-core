/**
 * PlanningViewToggle — 2-tab toggle for Planning mode (Process Map / Domain Model).
 * Token-driven; ARIA tablist; keyboard + focus-visible per ADR-091.
 */
import type { JSX } from 'react'

export type PlanningView = 'process-map' | 'domain-model'

export interface PlanningViewToggleProps {
  value: PlanningView
  onChange: (view: PlanningView) => void
}

const TAB_BASE =
  'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2'
const TAB_ACTIVE = 'bg-[var(--hb-accent)] text-[var(--hb-bg)]'
const TAB_INACTIVE = 'text-[var(--hb-text-secondary)] hover:bg-[var(--hb-surface-hover)]'

export function PlanningViewToggle({
  value,
  onChange,
}: PlanningViewToggleProps): JSX.Element {
  const processActive = value === 'process-map'
  const domainActive = value === 'domain-model'
  return (
    <div
      role="tablist"
      data-testid="planning-view-toggle"
      className="inline-flex gap-1 p-1 bg-[var(--hb-surface)] border border-[var(--hb-border)] rounded-md"
    >
      <button
        type="button"
        role="tab"
        aria-selected={processActive}
        data-testid="view-toggle-process-map"
        onClick={() => onChange('process-map')}
        className={`${TAB_BASE} ${processActive ? TAB_ACTIVE : TAB_INACTIVE}`}
      >
        Process Map
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={domainActive}
        data-testid="view-toggle-domain-model"
        onClick={() => onChange('domain-model')}
        className={`${TAB_BASE} ${domainActive ? TAB_ACTIVE : TAB_INACTIVE}`}
      >
        Domain Model
      </button>
    </div>
  )
}
