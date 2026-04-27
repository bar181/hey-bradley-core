// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.4 + §3.7,
//       plans/implementation/mvp-plan/07-prompts-and-aisp.md §6 (safety filter).
// Step 2 of Phase 18: tolerate prose / fences / BOM around an Envelope payload.

import { PatchEnvelopeSchema, type PatchEnvelope } from '@/lib/schemas/patches'

export type ParseResult =
  | { ok: true; envelope: PatchEnvelope }
  | { ok: false; reason: string }

const FENCE_RE = /^```(?:json)?\s*([\s\S]*?)\s*```$/

/** Strip BOM, surrounding whitespace, and a single ```json … ``` fence. */
function normalize(raw: string): string {
  let s = raw.replace(/^﻿/, '').trim()
  const fenced = s.match(FENCE_RE)
  if (fenced) s = fenced[1].trim()
  // If the model added prose around the JSON, slice to first `{` … last `}`.
  if (!s.startsWith('{')) {
    const start = s.indexOf('{')
    const end = s.lastIndexOf('}')
    if (start >= 0 && end > start) s = s.slice(start, end + 1)
  }
  return s
}

/**
 * Validate `json` against `PatchEnvelopeSchema`. Accepts a parsed object
 * directly OR a string that wraps the JSON in prose / fences / BOM.
 */
export function parseResponse(json: unknown): ParseResult {
  if (typeof json === 'string') {
    const cleaned = normalize(json)
    if (!cleaned || cleaned[0] !== '{') {
      return { ok: false, reason: 'response is not a JSON object' }
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(cleaned)
    } catch (e) {
      return { ok: false, reason: `JSON.parse failed: ${(e as Error).message}` }
    }
    return validateEnvelope(parsed)
  }
  return validateEnvelope(json)
}

function validateEnvelope(obj: unknown): ParseResult {
  const r = PatchEnvelopeSchema.safeParse(obj)
  if (r.success) return { ok: true, envelope: r.data }
  const first = r.error.issues[0]
  const where = first?.path?.join('.') ?? '<root>'
  return { ok: false, reason: `schema fail at ${where}: ${first?.message ?? 'unknown'}` }
}
