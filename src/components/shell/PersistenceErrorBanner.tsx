// P19 Fix-Pass 2 (F14): persistent dismissable banner shown when initDB() throws.
// Spec: plans/implementation/phase-19/deep-dive/04-architecture-findings.md (A2)
//
// We don't crash the app on persistence init failure — the rest of the surface
// is still usable in a stateless mode. The banner makes the state visible so
// the user understands their work won't be saved.

import { useState } from 'react'

export function PersistenceErrorBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div
      role="alert"
      data-testid="persistence-error-banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#7f1d1d',
        color: '#fff',
        padding: '8px 16px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <span>
        Persistence unavailable — your work won&apos;t be saved. Refresh to retry.
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        style={{
          background: 'transparent',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '4px',
          padding: '2px 8px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Dismiss
      </button>
    </div>
  )
}
