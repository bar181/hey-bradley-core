/**
 * P90 / AW-MODE-ARCH (A3) — Agentics Mode stub.
 *
 * Per ADR-085 multi-page MVP context + ADR-088 mode architecture +
 * ADR-110 AISP visibility standard (developer onboarding card surfaces
 * here — Agentics is where AISP is most prominent) + ADR-116 three-mode
 * product architecture. Stub ships P90; full body arrives across P92-P100
 * (PROCESS_ATOM / DDD_ATOM / AGENT_ATOM / SpecWorkbench / Export Claude
 * Code / TDD Scaffold / KISS+Review / Seal Panel / RC).
 */
import { Link } from 'react-router-dom'
import { AISPDeveloperCard } from '@/components/onboarding/AISPDeveloperCard'

export function Agentics() {
  return (
    <div data-testid="agentics-mode-stub" className="min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--hb-accent)]/10 text-[var(--hb-accent)] mb-4">
          Coming soon · P92-P100
        </div>
        <h1 className="text-3xl md:text-5xl font-medium mb-4">Agentics Mode</h1>
        <p className="text-base md:text-lg text-[var(--hb-text-secondary)] leading-relaxed mb-8">
          Multi-agent coordination with AGENT_ATOM. Building now. Three panes:
          phase/sprint/wave tree (left), agent coordination canvas (center),
          AISP spec (right).
        </p>
        <ul className="text-sm text-[var(--hb-text-muted)] space-y-2 mb-8">
          <li>P92 — PROCESS_ATOM Crystal Atom</li>
          <li>P93 — DDD_ATOM bounded-context generator</li>
          <li>P94 — AGENT_ATOM individual agent scope</li>
          <li>P95 — SpecWorkbench (AISP + human spec dual-view)</li>
          <li>P96 — Export Claude Code</li>
          <li>P97 — TDD Scaffold</li>
          <li>P98 — KISS + Review pass</li>
          <li>P99 — Seal Panel</li>
          <li>P100 — Release Candidate</li>
        </ul>
        <div className="mb-8">
          <AISPDeveloperCard />
        </div>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-[var(--hb-accent)] hover:underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 rounded"
          data-testid="agentics-back-home"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

export default Agentics
