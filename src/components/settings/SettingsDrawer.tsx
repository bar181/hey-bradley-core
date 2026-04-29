import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { del } from 'idb-keyval'
import { X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { LLMSettings } from './LLMSettings'
import { BrandContextUpload } from './BrandContextUpload'
import { CodebaseContextUpload } from './CodebaseContextUpload'
import { ReferenceManagement } from './ReferenceManagement'
import { PersonalityPicker } from './PersonalityPicker'

export function SettingsDrawer() {
  const open = useUIStore((s) => s.settingsDrawerOpen)
  const toggle = useUIStore((s) => s.toggleSettingsDrawer)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggle()
    },
    [toggle],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  const handleClearLocalData = async () => {
    const confirmed = window.confirm(
      'This deletes all local projects and chat history. Continue?',
    )
    if (!confirmed) return
    const keys = Object.keys(localStorage)
    const HB_PREFIXES = ['hb-', 'heybradley', 'selectedExampleId']
    for (const k of keys) {
      if (HB_PREFIXES.some((p) => k === p || k.startsWith(p))) localStorage.removeItem(k)
    }
    try { await del('hb-db') } catch { /* DB may not be present */ }
    location.reload()
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[9000]" role="dialog" aria-modal="true" aria-label="Settings">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={toggle}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <aside
        className="absolute top-0 right-0 h-full w-full max-w-md bg-hb-surface border-l border-hb-border shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="h-12 flex items-center justify-between px-4 border-b border-hb-border shrink-0">
          <h2 className="text-sm font-mono uppercase tracking-wider text-hb-text-primary">
            Settings
          </h2>
          <button
            type="button"
            onClick={toggle}
            className="p-1 text-hb-text-muted hover:text-hb-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Theme */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
              Theme
            </h3>
            <p className="text-sm text-hb-text-primary mb-2">Theme settings live here</p>
            <button
              type="button"
              disabled
              className="px-3 py-1.5 text-xs rounded border border-hb-border text-hb-text-muted bg-hb-bg cursor-not-allowed"
              title="Theme picker coming soon"
            >
              Pick a theme
            </button>
          </section>

          {/* Project */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
              Project
            </h3>
            <p className="text-[11px] text-hb-accent mb-2 font-mono uppercase tracking-wide">
              Functional
            </p>
            <button
              type="button"
              onClick={handleClearLocalData}
              className="px-3 py-1.5 text-xs rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Clear local data
            </button>
          </section>

          {/* AI (BYOK) */}
          <LLMSettings />

          {/* Sprint J P51 (A4) — Personality picker (first section in drawer) */}
          <section data-testid="settings-personality-section">
            <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
              Personality
            </h3>
            <PersonalityPicker />
          </section>

          {/* P46 Sprint H Wave 3 — Reference Management summary (above upload widgets) */}
          <ReferenceManagement />

          {/* P44 Sprint H Wave 1 — Brand Context upload (TXT/MD) */}
          <BrandContextUpload />

          {/* P45 Sprint H Wave 2 — Codebase Context upload (ZIP / multi-file) */}
          <CodebaseContextUpload />

          {/* Cost cap */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
              Spending limit
            </h3>
            <p className="text-sm text-hb-text-primary mb-2">
              Set a USD cap per session. Coming soon.
            </p>
            <input
              type="number"
              disabled
              placeholder="0.00"
              className="w-full px-2 py-1.5 text-sm rounded border border-hb-border bg-hb-bg text-hb-text-muted cursor-not-allowed"
              aria-label="Spending cap (disabled)"
            />
          </section>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
