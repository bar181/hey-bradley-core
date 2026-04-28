// P44 Sprint H Wave 1 — Brand Context repository.
// Typed CRUD over `kv['brand_context_*']` keys with chunked storage for >10KB
// blobs. Manifest at `brand_context_manifest`; chunks at `brand_context_chunk_N`.
//
// Spec: Sprint H P44 (file upload pipeline) — extracted text from PDF/DOCX/TXT/MD
// uploaded via Settings drawer becomes durable brand context for system prompt
// injection. Chunking lives here so callers see a single read/write API.
//
// Key shape (kv table):
//   - brand_context_manifest          → JSON BrandContextManifest (always present iff content stored)
//   - brand_context_chunk_0..N-1      → string slice (≤ CHUNK_BYTES per chunk)
//
// Privacy: brand_context_* keys must be added to SENSITIVE_KV_KEYS in
// exportImport.ts (uploaded brand voice docs are user content).

import { kvDelete, kvGet, kvHas, kvSet } from './kv'

/** Threshold above which the value gets chunked. Below this we still chunk
 * (count=1) to keep the read/write code path symmetric. */
export const CHUNK_BYTES = 10_000

const MANIFEST_KEY = 'brand_context_manifest'
const CHUNK_PREFIX = 'brand_context_chunk_'

export interface BrandContextManifest {
  /** Number of `brand_context_chunk_*` rows (joined in order to reconstruct text). */
  count: number
  /** Total UTF-16 length of the full reconstructed text. */
  totalBytes: number
  /** Original file mime type or extension hint (e.g. `text/markdown`, `application/pdf`). */
  mimeType: string
  /** Original filename for display. */
  name: string
  /** ms since epoch; stamped at write. */
  uploadedAt: number
}

function chunkKey(i: number): string {
  return `${CHUNK_PREFIX}${i}`
}

/** True when a brand context manifest exists. */
export function hasBrandContext(): boolean {
  return kvHas(MANIFEST_KEY)
}

/** Read the manifest only (no chunk join). Cheap; useful for status pills. */
export function readBrandContextManifest(): BrandContextManifest | null {
  const raw = kvGet(MANIFEST_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<BrandContextManifest>
    if (
      typeof parsed.count === 'number' &&
      typeof parsed.totalBytes === 'number' &&
      typeof parsed.mimeType === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.uploadedAt === 'number'
    ) {
      return parsed as BrandContextManifest
    }
  } catch {
    /* fall through */
  }
  return null
}

/**
 * Read full brand context text (joined chunks). Returns null when no manifest
 * is present or when chunks are missing/corrupt.
 */
export function readBrandContext(): string | null {
  const manifest = readBrandContextManifest()
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
 * Replace the brand context atomically (delete-all-then-write). Splits text
 * into ≤ CHUNK_BYTES slices and writes a manifest. `count` is always ≥ 1 even
 * for empty text — but empty text is rejected upstream; here we just store
 * what we are given.
 */
export function writeBrandContext(
  text: string,
  meta: { mimeType: string; name: string },
): BrandContextManifest {
  // Drop any prior chunks first so a smaller new doc doesn't leave orphans.
  clearBrandContext()

  const totalBytes = text.length
  const count = totalBytes === 0 ? 1 : Math.ceil(totalBytes / CHUNK_BYTES)
  for (let i = 0; i < count; i++) {
    const slice = text.slice(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES)
    kvSet(chunkKey(i), slice)
  }
  const manifest: BrandContextManifest = {
    count,
    totalBytes,
    mimeType: meta.mimeType,
    name: meta.name,
    uploadedAt: Date.now(),
  }
  kvSet(MANIFEST_KEY, JSON.stringify(manifest))
  return manifest
}

/**
 * Remove manifest + every brand_context_chunk_*. Idempotent: safe when no
 * brand context is present. Looks up the prior count from the manifest (if
 * any) so we don't have to scan the kv table.
 */
export function clearBrandContext(): void {
  const manifest = readBrandContextManifest()
  if (manifest) {
    for (let i = 0; i < manifest.count; i++) {
      kvDelete(chunkKey(i))
    }
  }
  kvDelete(MANIFEST_KEY)
}
