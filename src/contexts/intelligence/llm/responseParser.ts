// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.4 + §3.7,
//       plans/implementation/mvp-plan/07-prompts-and-aisp.md §6 (safety filter).
// Decision record: docs/adr/ADR-155-llm-confidence-best-guess.md
// Step 2 of Phase 18: tolerate prose / fences / BOM around an Envelope payload.
//
// P126 / F5 — Confidence detection. After a valid PatchEnvelope is recovered,
// classify the response confidence so the pipeline can append a casual
// "I had to guess on that one" note when the model hedged or under-shot.
// See ADR-155 for the detection rules + best-guess fallback policy.

import type { JSONPatch } from '@/lib/schemas/patches'
import { PatchEnvelopeSchema, type PatchEnvelope } from '@/lib/schemas/patches'

/** P126 / F5 — confidence band attached to every parsed envelope. */
export type ResponseConfidence = 'high' | 'low'

export type ParseResult =
  | { ok: true; envelope: PatchEnvelope; confidence: ResponseConfidence; reason?: string }
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

/** Hedge words/phrases that signal LLM uncertainty in the narration. */
const HEDGE_RE = /\b(i think|i guess|maybe|might|unsure|probably|perhaps|not sure|i'?m not entirely|possibly|seems like)\b/i

/**
 * P126 / F5 — Multi-target user intent heuristic.
 *
 * Returns true when the user text appears to ask for changes across >1 target
 * (e.g. "make the site brighter and add a pricing section"). Cheap rule-based
 * detector — no model call. Used by classifyConfidence to flag the case where
 * the LLM returned only a single patch but the user asked for multiple things.
 */
export function isMultiTargetUserText(userText: string | undefined): boolean {
  if (!userText) return false
  const t = userText.trim().toLowerCase()
  // Connector words that introduce a second clause; require whitespace flanks
  // so we don't trip on words like "bandwidth" or "branding".
  if (/\b(and|also|plus|then|after that)\b/.test(t)) {
    // Require at least one verb-shaped token after the connector so
    // "white and bright" (style modifier) doesn't count as multi-target.
    if (/\b(add|change|make|set|update|swap|hide|show|remove|brighten|darken|turn|toggle)\b/.test(t)) {
      return true
    }
  }
  // Comma-separated clauses with ≥2 verbs.
  const verbs = t.match(/\b(add|change|make|set|update|swap|hide|show|remove|brighten|darken)\b/g)
  if (verbs && verbs.length >= 2) return true
  return false
}

/**
 * P126 / F5 — Confidence classifier.
 *
 * Rules (ADR-155):
 *   1. Empty patches array → 'low' (caller may also synthesize a best-guess).
 *   2. Single patch when user text was multi-target → 'low'.
 *   3. summary contains hedge words (HEDGE_RE) → 'low'.
 *   4. Otherwise → 'high'.
 */
export function classifyConfidence(
  patches: readonly JSONPatch[],
  summary: string | undefined,
  userText: string | undefined,
): { confidence: ResponseConfidence; reason?: string } {
  if (patches.length === 0) return { confidence: 'low', reason: 'empty-patches' }
  if (patches.length === 1 && isMultiTargetUserText(userText)) {
    return { confidence: 'low', reason: 'single-patch-multi-target' }
  }
  if (summary && HEDGE_RE.test(summary)) {
    return { confidence: 'low', reason: 'hedge-words' }
  }
  return { confidence: 'high' }
}

/**
 * Validate `json` against `PatchEnvelopeSchema`. Accepts a parsed object
 * directly OR a string that wraps the JSON in prose / fences / BOM.
 *
 * P126 / F5 — `userText` is optional context used by the confidence
 * classifier; omitting it preserves the original parser contract
 * (empty patches still fail the schema's min(1) gate; single-patch-vs-
 * multi-target heuristic decays to a no-op).
 */
export function parseResponse(json: unknown, userText?: string): ParseResult {
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
    return validateEnvelope(parsed, userText)
  }
  return validateEnvelope(json, userText)
}

function validateEnvelope(obj: unknown, userText?: string): ParseResult {
  const r = PatchEnvelopeSchema.safeParse(obj)
  if (r.success) {
    const { confidence, reason } = classifyConfidence(r.data.patches, r.data.summary, userText)
    return reason !== undefined
      ? { ok: true, envelope: r.data, confidence, reason }
      : { ok: true, envelope: r.data, confidence }
  }
  const first = r.error.issues[0]
  const where = first?.path?.join('.') ?? '<root>'
  return { ok: false, reason: `schema fail at ${where}: ${first?.message ?? 'unknown'}` }
}
