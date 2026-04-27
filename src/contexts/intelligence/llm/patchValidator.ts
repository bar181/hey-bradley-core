// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.5,
//       plans/implementation/mvp-plan/07-prompts-and-aisp.md §5.
// Step 3: extends Step 2 (replace) with `add` (`/sections/-`) and `remove`
// (`/sections/<n>`); recursively scans patch values for unsafe strings.

import type { JSONPatch } from '@/lib/schemas/patches'
import { isAllowedPath, isAllowedAdd, isAllowedRemove } from '@/lib/schemas/patchPaths'

const FORBIDDEN_SEGMENTS = ['__proto__', 'constructor', 'prototype']
const UNSAFE_VALUE_RE = /(javascript:|data:text\/html|vbscript:|<script|on\w+=)/i

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
