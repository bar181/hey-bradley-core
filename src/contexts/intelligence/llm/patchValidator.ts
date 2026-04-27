// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.5 (validation rules),
//       plans/implementation/mvp-plan/07-prompts-and-aisp.md §5 (path whitelist).
// Step 2 of Phase 18: replace-op only. add/remove deferred to Step 3.

import type { JSONPatch } from '@/lib/schemas/patches'
import { isAllowedPath } from '@/lib/schemas/patchPaths'

/** Prototype-pollution + JS-injection regexes. */
const FORBIDDEN_SEGMENTS = ['__proto__', 'constructor', 'prototype']
const UNSAFE_VALUE_RE = /(javascript:|data:text\/html|vbscript:|<script|on\w+=)/i

/**
 * Validate a list of patches against the current JSON. Returns a list of
 * failure reasons (empty list = OK). One reason per offending patch.
 */
export function validatePatches(patches: JSONPatch[], currentJson: unknown): string[] {
  const reasons: string[] = []
  for (let i = 0; i < patches.length; i++) {
    const p = patches[i]
    if (p.op !== 'replace') {
      reasons.push(`patch[${i}]: op '${p.op}' not allowed (Step 2 supports replace only)`)
      continue
    }
    if (!isAllowedPath(p.path)) {
      reasons.push(`patch[${i}]: path '${p.path}' not in whitelist`)
      continue
    }
    const segments = p.path.split('/').slice(1)
    if (segments.some((s) => FORBIDDEN_SEGMENTS.includes(s))) {
      reasons.push(`patch[${i}]: forbidden path segment in '${p.path}'`)
      continue
    }
    if (typeof p.value === 'string' && UNSAFE_VALUE_RE.test(p.value)) {
      reasons.push(`patch[${i}]: unsafe value rejected by safety regex`)
      continue
    }
    if (!resolvePath(currentJson, segments)) {
      reasons.push(`patch[${i}]: path '${p.path}' does not resolve in current JSON`)
      continue
    }
  }
  return reasons
}

/**
 * Walk `json` along `segments` (already split on `/`, leading `''` removed).
 * Returns true if the parent of the leaf exists — i.e. a `replace` is legal.
 * Decoded per RFC-6902: `~1` = `/`, `~0` = `~`.
 */
function resolvePath(json: unknown, segments: string[]): boolean {
  if (segments.length === 0) return false
  let cur: unknown = json
  for (let i = 0; i < segments.length - 1; i++) {
    const tok = decodeToken(segments[i])
    cur = stepInto(cur, tok)
    if (cur === undefined) return false
  }
  // For replace, the leaf itself must exist on the parent.
  const leaf = decodeToken(segments[segments.length - 1])
  return stepInto(cur, leaf) !== undefined
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
