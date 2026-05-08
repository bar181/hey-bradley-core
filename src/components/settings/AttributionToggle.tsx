/**
 * Sprint N P57 Wave 2 (Agent N3) — AttributionToggle.
 *
 * Settings-drawer section that controls the "Built with Hey Bradley"
 * attribution line on shareable specs and static HTML exports. Defaults ON;
 * Pro users can opt out (commercial-tier hint, but open core honors the
 * local preference verbatim).
 *
 * Pure UI: reads + writes via `attribution.ts` helpers; no store wiring,
 * no schema additions, no Σ widening.
 */

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import {
  getAttributionEnabled,
  setAttributionEnabled,
} from '@/contexts/specification/attribution'

export function AttributionToggle() {
  const [enabled, setEnabled] = useState<boolean>(() => getAttributionEnabled())

  const handleChange = (next: boolean) => {
    setEnabled(next)
    setAttributionEnabled(next)
  }

  return (
    <section data-testid="settings-attribution-section">
      <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
        Attribution
      </h3>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-hb-text-primary leading-snug">
          Add &ldquo;Built with Hey Bradley&rdquo; to shared specs and static
          HTML exports. Defaults on. Pro users can hide.
        </p>
        <Switch
          data-testid="attribution-toggle"
          aria-label="Toggle Built with Hey Bradley attribution"
          checked={enabled}
          onCheckedChange={handleChange}
        />
      </div>
      {!enabled && (
        <p className="mt-2 text-[11px] text-hb-text-muted leading-snug italic">
          Pro feature in commercial tier — open core honors local preference.
        </p>
      )}
    </section>
  )
}
