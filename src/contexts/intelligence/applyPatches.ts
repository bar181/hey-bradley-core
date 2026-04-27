// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.6 (apply step).
// Step 2 of Phase 18: replace-op only, applied to a structuredClone so the
// caller's input is never mutated. Throws on any individual op failure.

import type { JSONPatch } from '@/lib/schemas/patches'

/**
 * Atomic clone-and-apply. Caller is expected to have validated the batch via
 * `validatePatches` first; this function still throws if any single op fails
 * so the chat pipeline can fall back cleanly.
 */
export function applyPatches(json: unknown, patches: JSONPatch[]): unknown {
  const cloned = structuredClone(json)
  for (const p of patches) applyOne(cloned, p)
  return cloned
}

function applyOne(root: unknown, patch: JSONPatch): void {
  if (patch.op !== 'replace') {
    throw new Error(`applyPatches: op '${patch.op}' not supported in Step 2`)
  }
  const segments = patch.path.split('/').slice(1).map(decodeToken)
  if (segments.length === 0) throw new Error(`applyPatches: empty path`)
  let parent: unknown = root
  for (let i = 0; i < segments.length - 1; i++) {
    parent = stepInto(parent, segments[i])
    if (parent === undefined) throw new Error(`applyPatches: missing path '${patch.path}'`)
  }
  const leaf = segments[segments.length - 1]
  if (Array.isArray(parent)) {
    const idx = Number(leaf)
    if (!Number.isInteger(idx) || idx < 0 || idx >= parent.length) {
      throw new Error(`applyPatches: bad array index '${leaf}'`)
    }
    parent[idx] = patch.value
    return
  }
  if (parent !== null && typeof parent === 'object') {
    const obj = parent as Record<string, unknown>
    if (!Object.prototype.hasOwnProperty.call(obj, leaf)) {
      throw new Error(`applyPatches: missing key '${leaf}'`)
    }
    obj[leaf] = patch.value
    return
  }
  throw new Error(`applyPatches: cannot replace under non-object`)
}

function decodeToken(tok: string): string {
  return tok.replace(/~1/g, '/').replace(/~0/g, '~')
}

function stepInto(node: unknown, token: string): unknown {
  if (Array.isArray(node)) {
    const idx = Number(token)
    return Number.isInteger(idx) && idx >= 0 && idx < node.length ? node[idx] : undefined
  }
  if (node !== null && typeof node === 'object') {
    const obj = node as Record<string, unknown>
    return Object.prototype.hasOwnProperty.call(obj, token) ? obj[token] : undefined
  }
  return undefined
}
