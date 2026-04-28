// P45 Sprint H Wave 2 — Codebase Context repository.
// Typed CRUD over `kv['codebase_context_*']` keys with chunked storage for the
// summary text extracted from a ZIP / multi-file upload. Mirrors
// `brandContext.ts` (P44) so the upload pipeline shares one mental model.
//
// Spec: Sprint H P45 — codebase reference upload feeds INTENT_ATOM with a
// project-type signal so the classifier can distinguish landing-page vs
// saas-app vs static-site asks.
//
// Key shape (kv table):
//   - codebase_context_manifest          → JSON CodebaseContextManifest (always present iff content stored)
//   - codebase_context_chunk_0..N-1      → string slice (≤ CHUNK_BYTES per chunk)
//
// Privacy: codebase_context_* keys must be in SENSITIVE_KV_KEYS in
// exportImport.ts (uploaded source content + filenames are user content).

import { kvDelete, kvGet, kvHas, kvSet } from './kv'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'

/** Threshold above which the value gets chunked. Symmetric with brandContext. */
export const CHUNK_BYTES = 10_000

/** Hard cap on the joined summary text. Codebase context is denser than brand
 * voice (config + readme + entry files), so we allow ~3-4 chunks vs the 4 KB
 * cap brand context applies at injection time. */
export const CODEBASE_CONTEXT_BYTE_CAP = 32_000

const MANIFEST_KEY = 'codebase_context_manifest'
const CHUNK_PREFIX = 'codebase_context_chunk_'

/**
 * Heuristic project-type label. INTENT_ATOM uses this string verbatim; keep
 * the closed set narrow. `unknown` is the safe default — never throw on a
 * project that doesn't match a known signal.
 */
export type ProjectType =
  | 'saas-app'
  | 'landing-page'
  | 'static-site'
  | 'portfolio'
  | 'unknown'

export interface CodebaseContextManifest {
  /** Number of `codebase_context_chunk_*` rows (joined in order). */
  count: number
  /** Total UTF-16 length of the full reconstructed summary text. */
  totalBytes: number
  /** Heuristic-derived project type — surfaced cheaply for the classifier. */
  projectType: ProjectType
  /** Number of distinct source files contributed to the summary. */
  fileCount: number
  /** Filenames that landed in the summary (display + audit). */
  sources: string[]
  /** ms since epoch; stamped at write. */
  uploadedAt: number
}

function chunkKey(i: number): string {
  return `${CHUNK_PREFIX}${i}`
}

/** True when a codebase context manifest exists. */
export function hasCodebaseContext(): boolean {
  return kvHas(MANIFEST_KEY)
}

/** Read the manifest only (no chunk join). Cheap; INTENT_ATOM reads
 * `manifest.projectType` without parsing the full text. */
export function readCodebaseContextManifest(): CodebaseContextManifest | null {
  const raw = kvGet(MANIFEST_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<CodebaseContextManifest>
    if (
      typeof parsed.count === 'number' &&
      typeof parsed.totalBytes === 'number' &&
      typeof parsed.projectType === 'string' &&
      typeof parsed.fileCount === 'number' &&
      Array.isArray(parsed.sources) &&
      typeof parsed.uploadedAt === 'number'
    ) {
      return parsed as CodebaseContextManifest
    }
  } catch {
    /* fall through */
  }
  return null
}

/**
 * Read full codebase context summary text (joined chunks). Returns null when
 * no manifest is present or when chunks are missing/corrupt.
 */
export function readCodebaseContext(): string | null {
  const manifest = readCodebaseContextManifest()
  if (!manifest) return null
  const parts: string[] = []
  for (let i = 0; i < manifest.count; i++) {
    const part = kvGet(chunkKey(i))
    if (part === undefined) return null // corrupt — refuse partial joins
    parts.push(part)
  }
  return parts.join('')
}

/**
 * Replace the codebase context atomically (delete-all-then-write). Splits text
 * into ≤ CHUNK_BYTES slices and writes a manifest. Caller is responsible for
 * pre-capping the input at CODEBASE_CONTEXT_BYTE_CAP.
 */
export function writeCodebaseContext(
  text: string,
  meta: {
    projectType: ProjectType
    fileCount: number
    sources: string[]
  },
): CodebaseContextManifest {
  // Drop any prior chunks first so a smaller new doc doesn't leave orphans.
  clearCodebaseContext()

  // P46 fix-pass (R2 L1) — redact API-key shapes BEFORE persistence. Codebase
  // archives often contain `.env` examples / config files with shaped keys;
  // redact at the persist boundary so they never reach kv or downstream LLMs.
  const safeText = redactKeyShapes(text)
  const totalBytes = safeText.length
  const count = totalBytes === 0 ? 1 : Math.ceil(totalBytes / CHUNK_BYTES)
  for (let i = 0; i < count; i++) {
    const slice = safeText.slice(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES)
    kvSet(chunkKey(i), slice)
  }
  const manifest: CodebaseContextManifest = {
    count,
    totalBytes,
    projectType: meta.projectType,
    fileCount: meta.fileCount,
    sources: meta.sources,
    uploadedAt: Date.now(),
  }
  kvSet(MANIFEST_KEY, JSON.stringify(manifest))
  return manifest
}

/**
 * Remove manifest + every codebase_context_chunk_*. Idempotent: safe when no
 * codebase context is present. Looks up the prior count from the manifest (if
 * any) so we don't have to scan the kv table.
 */
export function clearCodebaseContext(): void {
  const manifest = readCodebaseContextManifest()
  if (manifest) {
    for (let i = 0; i < manifest.count; i++) {
      kvDelete(chunkKey(i))
    }
  }
  kvDelete(MANIFEST_KEY)
}

/**
 * Pure-rule heuristic project-type detection. Inspects:
 *   - package.json `dependencies` / `devDependencies` (next, vite, react,
 *     astro, gatsby)
 *   - top-level filenames (next.config.*, astro.config.*, vite.config.*,
 *     portfolio.*, resume.*)
 *   - directory hints (`personal/`, `landing/`)
 *
 * Returns 'unknown' when no rule fires — never throws. Rules ordered most
 * specific first; first match wins.
 */
export function detectProjectType(input: {
  /** Filenames (relative paths) present in the upload. Lowercase recommended. */
  filenames: string[]
  /** Parsed package.json content (or null when missing/invalid). */
  packageJson: Record<string, unknown> | null
}): ProjectType {
  const lowerFiles = input.filenames.map((f) => f.toLowerCase())

  const deps: Record<string, unknown> = {
    ...(input.packageJson && typeof input.packageJson === 'object'
      ? ((input.packageJson as { dependencies?: Record<string, unknown> }).dependencies ?? {})
      : {}),
    ...(input.packageJson && typeof input.packageJson === 'object'
      ? ((input.packageJson as { devDependencies?: Record<string, unknown> }).devDependencies ?? {})
      : {}),
  }
  const hasDep = (name: string) => Object.prototype.hasOwnProperty.call(deps, name)

  const hasFile = (predicate: (f: string) => boolean) => lowerFiles.some(predicate)

  // 1. saas-app — Next.js (heaviest signal: framework + config)
  if (hasDep('next') || hasFile((f) => f.includes('next.config.'))) {
    return 'saas-app'
  }

  // 2. static-site — Astro / Gatsby
  if (
    hasDep('astro') ||
    hasDep('gatsby') ||
    hasFile((f) => f.includes('astro.config.') || f.includes('gatsby-config.'))
  ) {
    return 'static-site'
  }

  // 3. portfolio — explicit portfolio/resume hints in filenames or paths
  if (
    hasFile(
      (f) =>
        f.includes('portfolio.') ||
        f.includes('resume.') ||
        f.startsWith('personal/') ||
        f.includes('/personal/'),
    )
  ) {
    return 'portfolio'
  }

  // 4. landing-page — Vite + React + landing hints
  const viteReact = (hasDep('vite') || hasFile((f) => f.includes('vite.config.'))) && hasDep('react')
  if (
    viteReact &&
    hasFile((f) => f.includes('/landing/') || f.startsWith('landing/') || f.includes('landing.'))
  ) {
    return 'landing-page'
  }

  return 'unknown'
}
