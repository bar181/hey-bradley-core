// P44 Sprint H Wave 1 — Brand Context upload widget for the Settings drawer.
//
// Accepts TXT / MD natively (read as text). Accepts .pdf and .docx by
// extension/MIME but gracefully rejects them with a "shipping next phase"
// hint UNTIL pdfjs-dist / mammoth are added to deps. KISS: no new heavyweight
// deps in P44.
//
// Persistence is delegated to brandContext repo (chunked over kv table).
// System prompt injection happens automatically inside buildSystemPrompt
// (which falls back to readBrandContext()).

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, FileText, Loader2, Trash2, Upload } from 'lucide-react'
import {
  clearBrandContext,
  hasBrandContext,
  readBrandContextManifest,
  writeBrandContext,
  type BrandContextManifest,
} from '@/contexts/persistence/repositories/brandContext'

const ACCEPT_ATTR = '.txt,.md,.markdown,.pdf,.docx,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB cap on the source file
const PDF_REJECT_MSG = 'PDF support shipping next phase. Convert to .txt or .md for now.'
const DOCX_REJECT_MSG = 'DOCX support shipping next phase. Convert to .txt or .md for now.'

type Status =
  | { kind: 'idle' }
  | { kind: 'reading'; name: string }
  | { kind: 'error'; message: string }

function detectKind(file: File): 'text' | 'pdf' | 'docx' | 'unknown' {
  const name = file.name.toLowerCase()
  if (file.type === 'text/plain' || file.type === 'text/markdown') return 'text'
  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.markdown')) return 'text'
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    return 'docx'
  }
  return 'unknown'
}

/** Rough heuristic from cost.ts — ~4 chars per token. */
function estimateTokensFromBytes(byteLen: number): number {
  return Math.ceil(byteLen / 4)
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export function BrandContextUpload() {
  const [manifest, setManifest] = useState<BrandContextManifest | null>(() => {
    try {
      return readBrandContextManifest()
    } catch {
      return null
    }
  })
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Re-read manifest when the drawer remounts after a clear-local-data flow.
  useEffect(() => {
    try {
      setManifest(readBrandContextManifest())
    } catch {
      setManifest(null)
    }
  }, [])

  const refreshManifest = useCallback(() => {
    try {
      setManifest(readBrandContextManifest())
    } catch {
      setManifest(null)
    }
  }, [])

  const processFile = useCallback(
    (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        setStatus({ kind: 'error', message: 'File must be under 2 MB.' })
        return
      }
      const kind = detectKind(file)
      if (kind === 'pdf') {
        setStatus({ kind: 'error', message: PDF_REJECT_MSG })
        return
      }
      if (kind === 'docx') {
        setStatus({ kind: 'error', message: DOCX_REJECT_MSG })
        return
      }
      if (kind === 'unknown') {
        setStatus({ kind: 'error', message: 'Use a .txt or .md file (PDF/DOCX coming soon).' })
        return
      }
      setStatus({ kind: 'reading', name: file.name })
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const text = String(reader.result ?? '').trim()
          if (text.length === 0) {
            setStatus({ kind: 'error', message: 'File is empty.' })
            return
          }
          const written = writeBrandContext(text, {
            mimeType: file.type || 'text/plain',
            name: file.name,
          })
          setManifest(written)
          setStatus({ kind: 'idle' })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to save brand context.'
          setStatus({ kind: 'error', message })
        }
      }
      reader.onerror = () => {
        setStatus({ kind: 'error', message: 'Failed to read file.' })
      }
      reader.readAsText(file)
    },
    [],
  )

  const handlePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
      e.target.value = ''
    },
    [processFile],
  )

  const handleClear = useCallback(() => {
    if (!hasBrandContext()) return
    if (!window.confirm('Remove the uploaded brand context document?')) return
    try {
      clearBrandContext()
    } finally {
      refreshManifest()
      setStatus({ kind: 'idle' })
    }
  }, [refreshManifest])

  const tokenEstimate = manifest ? estimateTokensFromBytes(manifest.totalBytes) : 0

  return (
    <section>
      <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
        Brand Context
      </h3>
      <p className="text-[11px] text-hb-text-muted mb-3 leading-snug">
        Upload a brand voice doc (.txt or .md). The first 4&nbsp;KB is injected into
        the system prompt to steer tone &amp; voice. Stays on this device; stripped
        from .heybradley exports.
      </p>

      {manifest ? (
        <div className="flex items-start gap-3 p-3 rounded border border-hb-border bg-hb-bg">
          <FileText size={16} className="text-hb-accent mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm text-hb-text-primary font-medium truncate"
              title={manifest.name}
            >
              {manifest.name}
            </p>
            <p className="text-[11px] text-hb-text-muted mt-0.5 font-mono">
              {formatBytes(manifest.totalBytes)} · ~{tokenEstimate.toLocaleString()} tokens
              {manifest.count > 1 ? ` · ${manifest.count} chunks` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Remove brand context"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={status.kind === 'reading'}
          className="w-full px-3 py-2 text-xs rounded border border-dashed border-hb-border text-hb-text-primary bg-hb-bg hover:bg-hb-surface transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status.kind === 'reading' ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Reading {status.name}…
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload .txt or .md
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        onChange={handlePick}
        className="sr-only"
        aria-label="Brand context file"
      />

      {status.kind === 'error' && (
        <p className="mt-2 text-[11px] text-yellow-400 flex items-start gap-1">
          <AlertCircle size={12} className="mt-0.5 shrink-0" />
          {status.message}
        </p>
      )}
    </section>
  )
}
