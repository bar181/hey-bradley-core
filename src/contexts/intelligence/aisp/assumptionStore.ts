/**
 * P34 Sprint E P1 (A3) — Persisted accepted-assumption store.
 *
 * Stores accepted assumptions per session in the kv table. Lightweight by
 * design — no migration required; just a single JSON-serialized string at
 * a stable key. When the user later refers back to "the same kind of edit"
 * we have a record of what they confirmed.
 *
 * KISS: append-only ring buffer, last 50 entries; no per-project scoping
 * yet (post-MVP can split by project when projects support multi-session).
 *
 * ADR-063.
 */
import { kvGet, kvSet } from '@/contexts/persistence/repositories/kv'

const KV_KEY = 'aisp_accepted_assumptions'
const MAX_ENTRIES = 50

export interface AcceptedAssumptionRecord {
  /** Original user text that triggered the clarification. */
  originalText: string
  /** The chosen assumption rephrasing. */
  acceptedRephrasing: string
  /** Confidence at acceptance time (0..1). */
  confidence: number
  /** Unix ms timestamp. */
  acceptedAt: number
}

function readAll(): AcceptedAssumptionRecord[] {
  const raw = kvGet(KV_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r): r is AcceptedAssumptionRecord =>
        typeof r === 'object' &&
        r !== null &&
        typeof (r as AcceptedAssumptionRecord).originalText === 'string' &&
        typeof (r as AcceptedAssumptionRecord).acceptedRephrasing === 'string' &&
        typeof (r as AcceptedAssumptionRecord).confidence === 'number' &&
        typeof (r as AcceptedAssumptionRecord).acceptedAt === 'number',
    )
  } catch {
    return []
  }
}

export function recordAcceptedAssumption(rec: AcceptedAssumptionRecord): void {
  const existing = readAll()
  const next = [...existing.slice(-(MAX_ENTRIES - 1)), rec]
  kvSet(KV_KEY, JSON.stringify(next))
}

export function listAcceptedAssumptions(): AcceptedAssumptionRecord[] {
  return readAll()
}

export const ACCEPTED_ASSUMPTIONS_LIMITS = {
  KV_KEY,
  MAX_ENTRIES,
} as const
