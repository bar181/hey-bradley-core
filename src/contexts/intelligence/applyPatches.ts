// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.6.
// Step 3: atomic clone-and-apply (replace/add/remove). Aborts whole batch on
// any single-op failure (caller's input tree is never mutated).

import type { JSONPatch } from '@/lib/schemas/patches'

export class MultiPatchError extends Error {
  // Hand-declared fields for `erasableSyntaxOnly` (no param-property shorthand).
  readonly index: number
  readonly cause?: unknown
  constructor(index: number, message: string, cause?: unknown) {
    super(message); this.name = 'MultiPatchError'; this.index = index; this.cause = cause
  }
}

export function applyPatches(json: unknown, patches: JSONPatch[]): unknown {
  const cloned = structuredClone(json)
  for (let i = 0; i < patches.length; i++) {
    try { applyOne(cloned, patches[i]) }
    catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      throw new MultiPatchError(i, `applyPatches: op[${i}] failed: ${msg}`, e)
    }
  }
  return cloned
}

function applyOne(root: unknown, patch: JSONPatch): void {
  const segs = patch.path.split('/').slice(1).map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'))
  if (segs.length === 0) throw new Error('empty path')
  const leaf = segs[segs.length - 1]
  let parent: unknown = root
  for (let i = 0; i < segs.length - 1; i++) {
    parent = stepInto(parent, segs[i])
    if (parent === undefined) throw new Error(`missing path '${patch.path}'`)
  }
  const isArr = Array.isArray(parent)
  const isObj = parent !== null && typeof parent === 'object' && !isArr
  if (!isArr && !isObj) throw new Error(`cannot ${patch.op} under non-object at '${patch.path}'`)
  if (patch.op === 'add') {
    if (isArr) {
      const arr = parent as unknown[]
      if (leaf === '-') { arr.push(patch.value); return }
      const idx = Number(leaf)
      if (!Number.isInteger(idx) || idx < 0 || idx > arr.length) throw new Error(`bad index '${leaf}'`)
      arr.splice(idx, 0, patch.value); return
    }
    ;(parent as Record<string, unknown>)[leaf] = patch.value
    return
  }
  if (patch.op === 'replace' || patch.op === 'remove') {
    if (isArr) {
      const arr = parent as unknown[]
      const idx = Number(leaf)
      if (!Number.isInteger(idx) || idx < 0 || idx >= arr.length) throw new Error(`bad index '${leaf}'`)
      if (patch.op === 'replace') arr[idx] = patch.value; else arr.splice(idx, 1)
      return
    }
    const obj = parent as Record<string, unknown>
    if (!Object.prototype.hasOwnProperty.call(obj, leaf)) throw new Error(`missing key '${leaf}'`)
    if (patch.op === 'replace') obj[leaf] = patch.value; else delete obj[leaf]
    return
  }
  throw new Error(`unsupported op '${(patch as { op: string }).op}'`)
}

function stepInto(node: unknown, token: string): unknown {
  if (Array.isArray(node)) {
    const idx = Number(token)
    return Number.isInteger(idx) && idx >= 0 && idx < node.length ? node[idx] : undefined
  }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>
    return Object.prototype.hasOwnProperty.call(obj, token) ? obj[token] : undefined
  }
  return undefined
}
