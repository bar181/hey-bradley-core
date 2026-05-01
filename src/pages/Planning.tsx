/**
 * P90 / AW-MODE-ARCH (A3) — Planning Mode stub.
 *
 * Per ADR-085 multi-page MVP context + ADR-088 mode architecture +
 * ADR-116 three-mode product architecture. Stub ships P90; full body
 * arrives across P91-P95 (Process Map / PROCESS_ATOM / DDD_ATOM /
 * SpecWorkbench / Export Claude Code).
 */
import { Link } from 'react-router-dom'

export function Planning() {
  return (
    <div data-testid="planning-mode-stub" className="min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--hb-accent)]/10 text-[var(--hb-accent)] mb-4">
          Coming soon · P91-P95
        </div>
        <h1 className="text-3xl md:text-5xl font-medium mb-4">Planning Mode</h1>
        <p className="text-base md:text-lg text-[var(--hb-text-secondary)] leading-relaxed mb-8">
          Phase + sprint decomposition with PROCESS_ATOM. Building now. Three panes:
          project + phase list (left), interactive process map (center), spec panel (right).
        </p>
        <ul className="text-sm text-[var(--hb-text-muted)] space-y-2 mb-8">
          <li>P91 — Process Map Visualization</li>
          <li>P92 — PROCESS_ATOM Crystal Atom</li>
          <li>P93 — DDD_ATOM bounded-context generator</li>
          <li>P94 — AGENT_ATOM individual agent scope</li>
          <li>P95 — SpecWorkbench (AISP + human spec dual-view)</li>
        </ul>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-[var(--hb-accent)] hover:underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 rounded"
          data-testid="planning-back-home"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

export default Planning
