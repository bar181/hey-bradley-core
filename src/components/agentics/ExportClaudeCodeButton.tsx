/**
 * P96 / Agent A2 — ExportClaudeCodeButton (NEW; ≤80 LOC).
 * Triggers a Blob download of the markdown spec bundle built by A1's
 * `buildClaudeCodeBundle(phase)`. Stand-alone; takes `phase: PhaseCard | null`.
 * Tokens via `var(--hb-*)` per ADR-091. No animation libs (KISS).
 * See: ADR-122 (P96), ADR-121 (P95 SpecWorkbench), ADR-091.
 */
import { useState } from 'react'
import { Download } from 'lucide-react'
import {
  buildClaudeCodeBundle,
  type ExportClaudeCodeBundle,
} from '@/contexts/specification/exportClaudeCode'
import type { PhaseCard } from '@/components/agentics/SpecWorkbench'

export interface ExportClaudeCodeButtonProps {
  phase: PhaseCard | null
  projectSlug?: string
}

export function ExportClaudeCodeButton({ phase, projectSlug }: ExportClaudeCodeButtonProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleExport = (): void => {
    if (!phase) return
    const bundle: ExportClaudeCodeBundle = buildClaudeCodeBundle(phase, projectSlug)
    const blob = new Blob([bundle.markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = bundle.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setConfirmed(true)
    window.setTimeout(() => setConfirmed(false), 2000)
  }

  const disabled = phase === null

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled}
      data-testid="export-claude-code-button"
      aria-label="Export Claude Code spec bundle"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider bg-[var(--hb-accent)] text-[var(--hb-bg)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download size={14} aria-hidden="true" />
      {confirmed ? 'Exported ✓' : 'Export Claude Code'}
    </button>
  )
}
