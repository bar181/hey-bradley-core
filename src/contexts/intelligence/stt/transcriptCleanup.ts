// Spec: P100 W2 / D1 (top-3 fixes from C1 §8 — fix 2 of 3).
// Cross-ref: docs/prompt-audit/hey-bradley-vs-sota.md §4 gap 2.
// Cross-ref: ADR-126 (P100 W2 — comprehensive log architecture; listen_capture
//            event_data slot for { raw, cleaned } previously had raw === cleaned).
//
// Pure transform: strip disfluencies + duplicated false-starts + trailing pauses
// from a raw STT transcript. Used by chatPipeline at the listen_capture write
// boundary so the cleaned variant lands in SQLite alongside the raw original.
//
// No dependencies; no I/O; no store reads. Idempotent.

const DISFLUENCY_RE = /\b(uh+|um+|er+|ah+|like|you know|i mean|actually|kinda|sorta|basically)\b/gi
const FALSE_START_RE = /\b(\w+)\s+\1\b/gi
const TRAILING_PAUSE_RE = /\.\.\.+|—+/g

export function cleanTranscript(raw: string): string {
  return raw
    .replace(DISFLUENCY_RE, '')
    .replace(FALSE_START_RE, '$1')
    .replace(TRAILING_PAUSE_RE, '')
    .replace(/\s+/g, ' ')
    .trim()
}
