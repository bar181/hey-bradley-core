// P46 Sprint H Wave 3 — Reference Management summary panel.
//
// At-a-glance overview of every active reference (Brand Voice + Codebase) the
// user has uploaded. Reads cheap manifest rows only (no chunk joins). Augments
// the existing BrandContextUpload + CodebaseContextUpload widgets — does NOT
// replace them. Renders above the upload widgets in SettingsDrawer.
//
// Per-reference row shows: name, token estimate (~bytes/4), chunk count when
// >1, and a Clear button gated by window.confirm(). Clearing forces a
// re-render via a local refresh counter; the upload widgets re-read their own
// manifests via their `useEffect` so they stay in sync on next drawer open.
//
// Privacy: storage is local-only and stripped from .heybradley exports.
// (See SENSITIVE_KV_KEYS in exportImport.ts; manifests + chunks are both in.)
//
// Manifest fields read:
//   Brand: name, totalBytes, count
//   Codebase: projectType, fileCount, totalBytes, count
// Manifest shape is owned by P44 / P45 — this component is pure consumer.

import { useCallback, useEffect, useState } from 'react'
import { FileText, FileCode2, Trash2 } from 'lucide-react'
import {
  clearBrandContext,
  readBrandContextManifest,
  type BrandContextManifest,
} from '@/contexts/persistence/repositories/brandContext'
import {
  clearCodebaseContext,
  readCodebaseContextManifest,
  type CodebaseContextManifest,
  type ProjectType,
} from '@/contexts/persistence/repositories/codebaseContext'

/** Rough heuristic mirroring BrandContextUpload's estimate (~4 chars/token). */
function estimateTokensFromBytes(byteLen: number): number {
  return Math.ceil(byteLen / 4)
}

function projectTypeLabel(t: ProjectType): string {
  switch (t) {
    case 'saas-app':
      return 'SaaS / Next.js'
    case 'landing-page':
      return 'Landing page'
    case 'static-site':
      return 'Static site'
    case 'portfolio':
      return 'Portfolio'
    default:
      return 'Unknown project'
  }
}

function readManifestsSafely(): {
  brand: BrandContextManifest | null
  codebase: CodebaseContextManifest | null
} {
  let brand: BrandContextManifest | null = null
  let codebase: CodebaseContextManifest | null = null
  try {
    brand = readBrandContextManifest()
  } catch {
    brand = null
  }
  try {
    codebase = readCodebaseContextManifest()
  } catch {
    codebase = null
  }
  return { brand, codebase }
}

export function ReferenceManagement() {
  // `refresh` is a monotonic counter we bump after a clear so the manifests
  // get re-read. The two underlying upload widgets manage their own state, so
  // they refresh on the drawer's next mount (or via their own clear paths).
  const [refresh, setRefresh] = useState(0)
  const [{ brand, codebase }, setManifests] = useState(readManifestsSafely)

  useEffect(() => {
    setManifests(readManifestsSafely())
  }, [refresh])

  const handleClearBrand = useCallback(() => {
    if (!window.confirm('Remove the uploaded brand voice document?')) return
    try {
      clearBrandContext()
    } finally {
      setRefresh((n) => n + 1)
    }
  }, [])

  const handleClearCodebase = useCallback(() => {
    if (!window.confirm('Remove the uploaded codebase context?')) return
    try {
      clearCodebaseContext()
    } finally {
      setRefresh((n) => n + 1)
    }
  }, [])

  const isEmpty = brand === null && codebase === null

  return (
    <section data-testid="reference-management">
      <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
        References
      </h3>

      {isEmpty ? (
        <p className="text-[11px] text-hb-text-muted leading-snug">
          No references uploaded yet.
        </p>
      ) : (
        <div className="space-y-2">
          {brand && (
            <div
              data-testid="reference-row-brand"
              className="flex items-start gap-3 p-2.5 rounded border border-hb-border bg-hb-bg"
            >
              <FileText size={14} className="text-hb-accent mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs text-hb-text-primary font-medium truncate"
                  title={brand.name || 'Untitled brand voice'}
                >
                  {brand.name || 'Untitled brand voice'}
                </p>
                <p className="text-[10px] text-hb-text-muted mt-0.5 font-mono">
                  Brand voice · ~{estimateTokensFromBytes(brand.totalBytes).toLocaleString()} tokens
                  {brand.count > 1 ? ` · ${brand.count} chunks` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearBrand}
                data-testid="reference-clear-brand"
                className="px-2 py-1 text-[11px] rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 inline-flex items-center gap-1 shrink-0"
                aria-label="Clear brand voice reference"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          )}

          {codebase && (
            <div
              data-testid="reference-row-codebase"
              className="flex items-start gap-3 p-2.5 rounded border border-hb-border bg-hb-bg"
            >
              <FileCode2 size={14} className="text-hb-accent mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-hb-text-primary font-medium">
                  {projectTypeLabel(codebase.projectType)}
                </p>
                <p className="text-[10px] text-hb-text-muted mt-0.5 font-mono">
                  Codebase · {codebase.fileCount} file{codebase.fileCount === 1 ? '' : 's'} ·
                  {' '}~{estimateTokensFromBytes(codebase.totalBytes).toLocaleString()} tokens
                  {codebase.count > 1 ? ` · ${codebase.count} chunks` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearCodebase}
                data-testid="reference-clear-codebase"
                className="px-2 py-1 text-[11px] rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 inline-flex items-center gap-1 shrink-0"
                aria-label="Clear codebase reference"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-hb-text-muted mt-3 leading-snug italic">
        References are stored locally only and stripped from .heybradley exports.
      </p>
    </section>
  )
}
