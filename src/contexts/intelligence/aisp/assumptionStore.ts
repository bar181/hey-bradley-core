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
const MAX_ORIGINAL_TEXT_LENGTH = 1024 // R3 F2 — bound persistence size

/**
 * R3 security review F2 fix-pass — BYOK key shapes that MUST NOT persist.
 * Mirrors the husky pre-commit guard patterns (ADR-043). Records that match
 * any pattern are rejected before write so a user pasting a key into chat
 * doesn't get it tucked into IDB across sessions.
 */
const BYOK_KEY_SHAPES: readonly RegExp[] = [
  /sk-[a-zA-Z0-9_-]{20,}/,           // Anthropic / OpenAI / OpenRouter
  /AIza[0-9A-Za-z_-]{35}/,           // Google
  /ghp_[A-Za-z0-9]{36}/,             // GitHub PAT
  /xox[abprs]-[A-Za-z0-9-]{10,}/,    // Slack
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/, // JWT (3-segment)
]

function looksLikeSecret(s: string): boolean {
  return BYOK_KEY_SHAPES.some((re) => re.test(s))
}

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
  // R3 F2 — refuse to persist if the original text matches any BYOK shape.
  if (looksLikeSecret(rec.originalText) || looksLikeSecret(rec.acceptedRephrasing)) {
    return
  }
  // R3 F2 — also clamp originalText length to bound IDB growth.
  const safe: AcceptedAssumptionRecord = {
    ...rec,
    originalText:
      rec.originalText.length > MAX_ORIGINAL_TEXT_LENGTH
        ? rec.originalText.slice(0, MAX_ORIGINAL_TEXT_LENGTH)
        : rec.originalText,
  }
  const existing = readAll()
  const next = [...existing.slice(-(MAX_ENTRIES - 1)), safe]
  kvSet(KV_KEY, JSON.stringify(next))
}

export function listAcceptedAssumptions(): AcceptedAssumptionRecord[] {
  return readAll()
}

export const ACCEPTED_ASSUMPTIONS_LIMITS = {
  KV_KEY,
  MAX_ENTRIES,
  MAX_ORIGINAL_TEXT_LENGTH,
  BYOK_KEY_SHAPES,
} as const
