/**
 * P85 / Agent A3 — AISP developer onboarding card (Agentics mode).
 *
 * Dismissable card explaining the Crystal Atom (Σ) 5-component classification
 * to developers building with AISP. Surfaces in Agentics mode only.
 *
 * Standalone for now: A2 (Wave 2) does NOT mount this; that's a P94
 * carry-forward when the Agentics mode landing surface exists.
 *
 * See: ADR-091 (token-derived hover-lift), ADR-053 (Crystal Atom),
 *      ADR-082 (Open Core RC), https://github.com/bar181/aisp-open-core
 */

'use client'
import { useState } from 'react'
import { Code2, ExternalLink, X } from 'lucide-react'

const STORAGE_KEY = 'hb-aisp-card-dismissed-v1'
const AISP_REPO_URL = 'https://github.com/bar181/aisp-open-core'

export function shouldShowAISPDeveloperCard(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return localStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

export function markAISPDeveloperCardDismissed(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // localStorage unavailable — silent no-op
  }
}

export interface AISPDeveloperCardProps {
  onDismiss?: () => void
}

export function AISPDeveloperCard({ onDismiss }: AISPDeveloperCardProps) {
  const [hidden, setHidden] = useState<boolean>(!shouldShowAISPDeveloperCard())
  if (hidden) return null

  const handleDismiss = (): void => {
    markAISPDeveloperCardDismissed()
    setHidden(true)
    onDismiss?.()
  }

  return (
    <div
      data-testid="aisp-developer-card"
      className="relative rounded-lg border bg-[var(--hb-surface)] border-[var(--hb-border)] text-[var(--hb-text-primary)] p-6"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex-shrink-0 rounded-md border border-[var(--hb-border)] p-2"
        >
          <Code2 className="h-5 w-5" style={{ color: 'var(--hb-accent)' }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold mb-2">Building with AISP?</h3>

          <p className="text-sm mb-3">
            Every prompt produces a <strong>Crystal Atom</strong> — a 5-component
            classification (Σ symbol):
          </p>

          <pre
            className="font-mono text-xs rounded-md border border-[var(--hb-border)] p-3 mb-3 overflow-x-auto"
          >
            {'Σ = Intent · Assumptions · Selection · Content · Patch'}
          </pre>

          <p className="text-sm mb-4">
            Sub-2% ambiguity. Open-spec, polyglot-consumable.
          </p>

          <a
            data-testid="aisp-card-learn-link"
            href={AISP_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:underline"
            style={{ color: 'var(--hb-accent)' }}
          >
            <span>Learn more</span>
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          data-testid="aisp-card-dismiss"
          aria-label="Dismiss AISP developer card"
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-md p-2 transition-colors duration-200 hover:bg-[var(--hb-border)]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default AISPDeveloperCard
