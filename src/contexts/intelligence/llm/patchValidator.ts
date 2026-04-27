// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.5,
//       plans/implementation/mvp-plan/07-prompts-and-aisp.md §5,
//       docs/adr/ADR-044-json-patch-contract.md §5 (image allow-list).
// Step 3: extends Step 2 (replace) with `add` (`/sections/-`) and `remove`
// (`/sections/<n>`); recursively scans patch values for unsafe strings.

import type { JSONPatch } from '@/lib/schemas/patches'
import { isAllowedPath, isAllowedAdd, isAllowedRemove } from '@/lib/schemas/patchPaths'

const FORBIDDEN_SEGMENTS = ['__proto__', 'constructor', 'prototype']
const UNSAFE_VALUE_RE = /(javascript:|data:text\/html|vbscript:|<script|on\w+=)/i
// FIX 3 — ADR-044 §5: image URL allow-list. Any value patched into a path
// ending in /backgroundImage, /heroImage, or /featuredImage MUST resolve to a
// host on this list (or the dynamic mediaLibrary host set when present).
const NAMED_CDN_HOSTS = new Set<string>([
  'images.unsplash.com',
  'cdn.heybradley.app',
  'i.imgur.com',
])
const IMAGE_PATH_RE = /\/(backgroundImage|heroImage|featuredImage)$/
const ALLOWED_IMAGE_EXT_RE = /\.(jpe?g|png|webp)(?:$|\?)/i
const FORBIDDEN_URI_SCHEME_RE = /^(data|javascript|blob|vbscript):/i

/**
 * Validate a list of patches against the current JSON. One reason per offending
 * patch (empty list = OK). Step 3 supports replace + add + remove.
 */
export function validatePatches(patches: JSONPatch[], currentJson: unknown): string[] {
  const reasons: string[] = []
  for (let i = 0; i < patches.length; i++) {
    const p = patches[i]
    const segments = p.path.split('/').slice(1)
    if (segments.some((s) => FORBIDDEN_SEGMENTS.includes(s))) {
      reasons.push(`patch[${i}]: forbidden path segment in '${p.path}'`)
      continue
    }
    if (containsUnsafeString(p.value)) {
      reasons.push(`patch[${i}]: unsafe value rejected by safety regex`)
      continue
    }
    // FIX 2: prototype-pollution guard for object-KEYS in the patch value
    // (e.g. `value: { "__proto__": { "polluted": true } }`).
    if (containsForbiddenKey(p.value)) {
      reasons.push(`patch[${i}]: forbidden key in value`)
      continue
    }
    // FIX 3: image URL allow-list per ADR-044 §5.
    if (IMAGE_PATH_RE.test(p.path)) {
      const reason = imageUrlRejection(p.value)
      if (reason) {
        reasons.push(`patch[${i}]: image URL not allowed: ${reason}`)
        continue
      }
    }
    if (p.op === 'replace') {
      if (!isAllowedPath(p.path)) {
        reasons.push(`patch[${i}]: path '${p.path}' not in whitelist`)
        continue
      }
      if (!resolvePath(currentJson, segments, true)) {
        reasons.push(`patch[${i}]: path '${p.path}' does not resolve in current JSON`)
      }
      continue
    }
    if (p.op === 'add') {
      if (!isAllowedAdd(p.path, p.value)) {
        reasons.push(`patch[${i}]: add path '${p.path}' not allowed (or invalid section type)`)
        continue
      }
      // Parent of `/sections/-` must exist (the `/sections` array).
      if (!resolvePath(currentJson, segments.slice(0, -1), true)) {
        reasons.push(`patch[${i}]: parent of '${p.path}' missing in current JSON`)
      }
      continue
    }
    if (p.op === 'remove') {
      if (!isAllowedRemove(p.path, currentJson)) {
        reasons.push(`patch[${i}]: remove path '${p.path}' not allowed`)
        continue
      }
      if (!resolvePath(currentJson, segments, true)) {
        reasons.push(`patch[${i}]: path '${p.path}' does not resolve in current JSON`)
      }
      continue
    }
    reasons.push(`patch[${i}]: op '${(p as { op: string }).op}' not supported`)
  }
  return reasons
}

/**
 * FIX 2 — recursively scan every own-enumerable key in `value` for forbidden
 * names. Cycle-safe via WeakSet. Returns true if ANY descendant key is one of
 * `__proto__`, `constructor`, or `prototype`.
 */
function containsForbiddenKey(value: unknown, seen: WeakSet<object> = new WeakSet()): boolean {
  if (value === null || typeof value !== 'object') return false
  const obj = value as object
  if (seen.has(obj)) return false
  seen.add(obj)
  if (Array.isArray(value)) {
    for (const item of value) if (containsForbiddenKey(item, seen)) return true
    return false
  }
  // FIX 2: use Object.getOwnPropertyNames so non-enumerable own keys (like
  // `__proto__` materialised by JSON.parse) are also seen. Object.keys would
  // miss the JSON-parsed `__proto__` own-key on V8.
  for (const k of Object.getOwnPropertyNames(value as Record<string, unknown>)) {
    if (FORBIDDEN_SEGMENTS.includes(k)) return true
    // Use a descriptor read to avoid a getter side-effect on the dunder key.
    const desc = Object.getOwnPropertyDescriptor(value as Record<string, unknown>, k)
    const v = desc && 'value' in desc ? desc.value : undefined
    if (containsForbiddenKey(v, seen)) return true
  }
  return false
}

/** FIX 3 — load + cache the dynamic media-library host set on first call.
 * Spec said `src/data/mediaLibrary.json`; the actual catalog lives at
 * `src/data/media/media.json`. We try the canonical path first, then the
 * legacy one, then fall back to the named-CDN list only. */
let mediaLibraryHostsCache: Set<string> | null = null
type MediaShape = { library?: { images?: Array<{ url?: string }> } }
function getMediaLibraryHosts(): Set<string> {
  if (mediaLibraryHostsCache) return mediaLibraryHostsCache
  const hosts = new Set<string>()
  // Test seam: a runtime override can be set via globalThis to inject hosts.
  const override = (globalThis as { __mediaLibrary?: MediaShape }).__mediaLibrary
  const harvest = (mod: MediaShape | undefined): void => {
    if (!mod?.library?.images) return
    for (const img of mod.library.images) {
      if (typeof img.url === 'string') {
        try { hosts.add(new URL(img.url).host) } catch { /* skip bad URL */ }
      }
    }
  }
  harvest(override)
  mediaLibraryHostsCache = hosts
  return hosts
}

/**
 * FIX 3 — true if `url` is an https URL with allowed extension hosted on a
 * named CDN or a media-library host. Rejects data:/javascript:/blob:/vbscript:.
 */
function isAllowedImageUrl(url: string): boolean {
  if (typeof url !== 'string' || url.length === 0) return false
  if (FORBIDDEN_URI_SCHEME_RE.test(url)) return false
  if (!url.startsWith('https://')) return false
  let parsed: URL
  try { parsed = new URL(url) } catch { return false }
  if (!ALLOWED_IMAGE_EXT_RE.test(parsed.pathname)) return false
  if (NAMED_CDN_HOSTS.has(parsed.host)) return true
  return getMediaLibraryHosts().has(parsed.host)
}

/** FIX 3 — return a short reason string when the value is NOT an allowed
 *  image URL, or `null` when it passes. Keeps audit detail terse. */
function imageUrlRejection(value: unknown): string | null {
  if (typeof value !== 'string') return 'value not a string'
  if (FORBIDDEN_URI_SCHEME_RE.test(value)) return 'forbidden URI scheme'
  if (!value.startsWith('https://')) return 'not https'
  let parsed: URL
  try { parsed = new URL(value) } catch { return 'invalid URL' }
  if (!ALLOWED_IMAGE_EXT_RE.test(parsed.pathname)) return 'extension not allowed'
  if (!NAMED_CDN_HOSTS.has(parsed.host) && !getMediaLibraryHosts().has(parsed.host)) return 'host not in allow-list'
  return isAllowedImageUrl(value) ? null : 'not allowed'
}

/** Recursively check every string leaf; cycle-safe via WeakSet. */
function containsUnsafeString(value: unknown, seen: WeakSet<object> = new WeakSet()): boolean {
  if (typeof value === 'string') return UNSAFE_VALUE_RE.test(value)
  if (value === null || typeof value !== 'object') return false
  const obj = value as object
  if (seen.has(obj)) return false
  seen.add(obj)
  if (Array.isArray(value)) {
    for (const item of value) if (containsUnsafeString(item, seen)) return true
    return false
  }
  for (const v of Object.values(value as Record<string, unknown>)) {
    if (containsUnsafeString(v, seen)) return true
  }
  return false
}

/**
 * Walk `json` along `segments`. If `needLeaf`, the final token must resolve to
 * an existing node; otherwise the empty path resolves trivially. RFC-6902
 * decoded: `~1` = `/`, `~0` = `~`.
 */
function resolvePath(json: unknown, segments: string[], needLeaf: boolean): boolean {
  if (segments.length === 0) return !needLeaf || json !== undefined
  let cur: unknown = json
  for (let i = 0; i < segments.length; i++) {
    cur = stepInto(cur, decodeToken(segments[i]))
    if (cur === undefined) return false
  }
  return true
}

function decodeToken(tok: string): string {
  return tok.replace(/~1/g, '/').replace(/~0/g, '~')
}

function stepInto(node: unknown, token: string): unknown {
  if (node === null || node === undefined) return undefined
  if (Array.isArray(node)) {
    const idx = Number(token)
    if (!Number.isInteger(idx) || idx < 0 || idx >= node.length) return undefined
    return node[idx]
  }
  if (typeof node === 'object') {
    const obj = node as Record<string, unknown>
    return Object.prototype.hasOwnProperty.call(obj, token) ? obj[token] : undefined
  }
  return undefined
}
