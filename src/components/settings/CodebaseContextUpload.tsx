// P45 Sprint H Wave 2 — Codebase Context upload widget for the Settings drawer.
//
// Accepts either a single ZIP archive (extracted via JSZip — already a dep) or
// a multi-file selection. Pulls the high-signal files (README, package.json,
// next.config.*, astro.config.*, vite.config.*, top-level entry .ts/.tsx) and
// concatenates them into a capped summary stored chunked in
// `kv['codebase_context_*']`.
//
// Project-type detection runs at upload time so the manifest exposes a cheap
// `projectType` field that INTENT_ATOM can read without parsing the body.
//
// Persistence is delegated to codebaseContext repo (chunked over kv table).
// Privacy-symmetric with brand context: codebase_context_* is in
// SENSITIVE_KV_KEYS / runtime DELETE sweep — stripped from .heybradley exports.

import { useCallback, useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'
import { AlertCircle, FileCode2, Loader2, Trash2, Upload } from 'lucide-react'
import {
  CODEBASE_CONTEXT_BYTE_CAP,
  clearCodebaseContext,
  detectProjectType,
  hasCodebaseContext,
  readCodebaseContextManifest,
  writeCodebaseContext,
  type CodebaseContextManifest,
  type ProjectType,
} from '@/contexts/persistence/repositories/codebaseContext'

/** 5 MB cap on the input ZIP (KISS — codebases at this stage are summary-sized). */
const MAX_ZIP_BYTES = 5 * 1024 * 1024

/** 2 MB cap per individual non-zip file (mirrors brand context's per-file ceiling). */
const MAX_FILE_BYTES = 2 * 1024 * 1024

const ACCEPT_ATTR =
  '.zip,.md,.markdown,.json,.ts,.tsx,.js,.jsx,.mjs,.cjs,application/zip,application/x-zip-compressed,text/plain,text/markdown,application/json'

/** Files that materially identify a project. Order matters for header
 * formatting; package.json first so detectProjectType has guaranteed input. */
const FILES_OF_INTEREST_PATTERNS: Array<RegExp> = [
  /^package\.json$/i,
  /^readme(\.md|\.markdown|\.txt)?$/i,
  /^next\.config\.(js|cjs|mjs|ts)$/i,
  /^astro\.config\.(js|cjs|mjs|ts)$/i,
  /^vite\.config\.(js|cjs|mjs|ts)$/i,
  /^gatsby-config\.(js|cjs|mjs|ts)$/i,
  /^tsconfig\.json$/i,
  /^(src\/)?(index|app|main)\.(ts|tsx|js|jsx)$/i,
]

type Status =
  | { kind: 'idle' }
  | { kind: 'reading'; label: string }
  | { kind: 'error'; message: string }

interface ExtractedFile {
  /** Path relative to ZIP root or just the filename for multi-file mode. */
  name: string
  /** UTF-8 text body. */
  text: string
}

function isInteresting(relPath: string): boolean {
  // Strip leading directory of the form `repo-name/` that GitHub-style ZIPs
  // wrap files in. We test the basename and a couple top-level paths.
  const trimmed = relPath.replace(/^[^/]+\//, '')
  return FILES_OF_INTEREST_PATTERNS.some((re) => re.test(trimmed) || re.test(relPath))
}

function relativeName(name: string): string {
  // For a ZIP that wraps everything in `repo-name/`, drop the wrapper for
  // display. For multi-file uploads, name is already the basename.
  const parts = name.split('/')
  if (parts.length > 1 && parts[0] && !parts[0].includes('.')) {
    return parts.slice(1).join('/') || name
  }
  return name
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
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
      return 'Unknown'
  }
}

async function extractZip(file: File): Promise<ExtractedFile[]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const out: ExtractedFile[] = []
  const entries = Object.values(zip.files).filter((entry) => !entry.dir)
  for (const entry of entries) {
    if (!isInteresting(entry.name)) continue
    try {
      const text = await entry.async('string')
      out.push({ name: relativeName(entry.name), text })
    } catch {
      // Binary or unreadable entry — skip silently; we only want text files.
    }
  }
  return out
}

async function extractFiles(files: File[]): Promise<ExtractedFile[]> {
  const out: ExtractedFile[] = []
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) continue
    if (!isInteresting(file.name)) continue
    try {
      const text = await file.text()
      out.push({ name: file.name, text })
    } catch {
      // Skip unreadable files.
    }
  }
  return out
}

interface BuiltSummary {
  text: string
  packageJson: Record<string, unknown> | null
  filenames: string[]
  fileCount: number
}

function buildSummary(extracted: ExtractedFile[]): BuiltSummary {
  // Order extracted files so package.json + README come first (they carry
  // the strongest project-type signal and the human-readable overview).
  const ordered = [...extracted].sort((a, b) => {
    const score = (n: string): number => {
      const lower = n.toLowerCase()
      if (lower.endsWith('package.json')) return 0
      if (/readme(\.md|\.markdown|\.txt)?$/i.test(lower)) return 1
      if (/\.config\.(js|cjs|mjs|ts)$/.test(lower)) return 2
      return 3
    }
    return score(a.name) - score(b.name)
  })

  let packageJson: Record<string, unknown> | null = null
  for (const file of ordered) {
    if (/package\.json$/i.test(file.name)) {
      try {
        const parsed = JSON.parse(file.text)
        if (parsed && typeof parsed === 'object') {
          packageJson = parsed as Record<string, unknown>
        }
      } catch {
        /* leave null; detectProjectType handles null safely */
      }
      break
    }
  }

  const sections: string[] = []
  let used = 0
  for (const file of ordered) {
    const header = `\n=== ${file.name} ===\n`
    const remaining = CODEBASE_CONTEXT_BYTE_CAP - used - header.length
    if (remaining <= 0) break
    const body = file.text.length > remaining ? file.text.slice(0, remaining) : file.text
    sections.push(header + body)
    used += header.length + body.length
    if (used >= CODEBASE_CONTEXT_BYTE_CAP) break
  }

  return {
    text: sections.join('').slice(0, CODEBASE_CONTEXT_BYTE_CAP),
    packageJson,
    filenames: ordered.map((f) => f.name),
    fileCount: ordered.length,
  }
}

export function CodebaseContextUpload() {
  const [manifest, setManifest] = useState<CodebaseContextManifest | null>(() => {
    try {
      return readCodebaseContextManifest()
    } catch {
      return null
    }
  })
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      setManifest(readCodebaseContextManifest())
    } catch {
      setManifest(null)
    }
  }, [])

  const refreshManifest = useCallback(() => {
    try {
      setManifest(readCodebaseContextManifest())
    } catch {
      setManifest(null)
    }
  }, [])

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    // Single-file ZIP path: extract entries, then build summary.
    const single = files.length === 1 ? files[0] : null
    const isZip =
      single !== null &&
      (single.type === 'application/zip' ||
        single.type === 'application/x-zip-compressed' ||
        /\.zip$/i.test(single.name))

    if (isZip) {
      if (single.size > MAX_ZIP_BYTES) {
        setStatus({ kind: 'error', message: 'ZIP must be under 5 MB.' })
        return
      }
      setStatus({ kind: 'reading', label: single.name })
      try {
        const extracted = await extractZip(single)
        if (extracted.length === 0) {
          setStatus({
            kind: 'error',
            message: 'No README, package.json, or config files found in ZIP.',
          })
          return
        }
        const summary = buildSummary(extracted)
        if (summary.text.length === 0) {
          setStatus({ kind: 'error', message: 'Extracted files were empty.' })
          return
        }
        const projectType = detectProjectType({
          filenames: summary.filenames,
          packageJson: summary.packageJson,
        })
        const written = writeCodebaseContext(summary.text, {
          projectType,
          fileCount: summary.fileCount,
          sources: summary.filenames,
        })
        setManifest(written)
        setStatus({ kind: 'idle' })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to extract codebase ZIP.'
        setStatus({ kind: 'error', message })
      }
      return
    }

    // Multi-file path: filter to interesting files, build summary.
    setStatus({ kind: 'reading', label: `${files.length} file${files.length === 1 ? '' : 's'}` })
    try {
      const extracted = await extractFiles(files)
      if (extracted.length === 0) {
        setStatus({
          kind: 'error',
          message: 'Pick a ZIP, README, package.json, or config files.',
        })
        return
      }
      const summary = buildSummary(extracted)
      if (summary.text.length === 0) {
        setStatus({ kind: 'error', message: 'Selected files were empty.' })
        return
      }
      const projectType = detectProjectType({
        filenames: summary.filenames,
        packageJson: summary.packageJson,
      })
      const written = writeCodebaseContext(summary.text, {
        projectType,
        fileCount: summary.fileCount,
        sources: summary.filenames,
      })
      setManifest(written)
      setStatus({ kind: 'idle' })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to read selected files.'
      setStatus({ kind: 'error', message })
    }
  }, [])

  const handlePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files
      if (list && list.length > 0) {
        const arr: File[] = []
        for (let i = 0; i < list.length; i++) arr.push(list[i])
        void processFiles(arr)
      }
      e.target.value = ''
    },
    [processFiles],
  )

  const handleClear = useCallback(() => {
    if (!hasCodebaseContext()) return
    if (!window.confirm('Remove the uploaded codebase context?')) return
    try {
      clearCodebaseContext()
    } finally {
      refreshManifest()
      setStatus({ kind: 'idle' })
    }
  }, [refreshManifest])

  return (
    <section>
      <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
        Codebase Context
      </h3>
      <p className="text-[11px] text-hb-text-muted mb-3 leading-snug">
        Upload a ZIP of your project (or pick README + package.json + config files).
        We summarize key files to detect project type and steer suggestions. Stays
        on this device; stripped from .heybradley exports.
      </p>

      {manifest ? (
        <div className="flex items-start gap-3 p-3 rounded border border-hb-border bg-hb-bg">
          <FileCode2 size={16} className="text-hb-accent mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-hb-text-primary font-medium">
              {projectTypeLabel(manifest.projectType)}
            </p>
            <p className="text-[11px] text-hb-text-muted mt-0.5 font-mono">
              {manifest.fileCount} file{manifest.fileCount === 1 ? '' : 's'} ·{' '}
              {formatBytes(manifest.totalBytes)}
              {manifest.count > 1 ? ` · ${manifest.count} chunks` : ''}
            </p>
            {manifest.sources.length > 0 && (
              <p
                className="text-[10px] text-hb-text-muted mt-1 truncate"
                title={manifest.sources.join(', ')}
              >
                {manifest.sources.slice(0, 3).join(', ')}
                {manifest.sources.length > 3 ? ` +${manifest.sources.length - 3}` : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Remove codebase context"
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
              Reading {status.label}…
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload ZIP or files
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        onChange={handlePick}
        className="sr-only"
        aria-label="Codebase context upload"
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
