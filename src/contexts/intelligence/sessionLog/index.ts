/**
 * P126 / F3 — Session log: chat-history persistence for Agentics observability.
 *
 * Decision record: docs/adr/ADR-154-session-chat-history-persistence.md
 * Cross-refs: ADR-043 (BYOK redaction at every persistence boundary)
 *             ADR-114 D3 (redact at write, not just read)
 *             ADR-126 (logging architecture — fire-and-forget)
 *
 * Persists chat-mode + listen-mode events (user prompts, LLM calls/responses,
 * patches applied, pipeline errors, low-confidence narrations) to localStorage
 * under the key 'hey-bradley-session-log'. FIFO-capped at 500 entries. Every
 * payload passes through `redactPayload` BEFORE write — the session log never
 * holds a usable BYOK key.
 *
 * Cross-tab / cross-component sync is delivered via:
 *  - native 'storage' event (fires for OTHER windows in the same origin), and
 *  - custom 'hey-bradley:session-log-changed' event (fires within THIS window).
 *
 * Surfaces consume via `useSessionLog()`. Writers fire-and-forget via
 * `appendSessionLog(...)`. Any storage failure (quota, JSON.parse) is swallowed
 * and DEV-warned — logging code must NEVER break the runtime that calls it.
 */
import { useEffect, useState, useCallback } from 'react'

export type SessionLogEventType =
  | 'user_prompt'
  | 'llm_call_sent'
  | 'llm_response_received'
  | 'patch_applied'
  | 'pipeline_error'
  | 'confidence_low'

export interface SessionLogEntry {
  id: string
  timestamp: number
  eventType: SessionLogEventType
  summary: string
  payload?: Record<string, unknown>
  mode?: 'chat' | 'listen'
}

const STORAGE_KEY = 'hey-bradley-session-log'
const MAX_ENTRIES = 500
const CHANGE_EVENT = 'hey-bradley:session-log-changed'

// Anthropic / OpenAI / Gemini BYOK key shapes (mirror redactKeyShapes in
// `src/contexts/persistence/repositories/comprehensiveLogs.ts` per ADR-043).
const KEY_SHAPES: readonly RegExp[] = [
  /AIza[0-9A-Za-z_-]{35}/g,
  /sk-[a-zA-Z0-9]{20,}/g,
]

function isLikelyKey(s: string): boolean {
  for (const re of KEY_SHAPES) {
    re.lastIndex = 0
    if (re.test(s)) return true
  }
  return false
}

function redactString(s: string): string {
  let out = s
  for (const re of KEY_SHAPES) out = out.replace(re, '[REDACTED]')
  return out
}

/** Shallow pass: any string value containing a key-shape → literal '[REDACTED]'. */
function redactPayload(p: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!p) return undefined
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(p)) {
    if (typeof v === 'string') {
      out[k] = isLikelyKey(v) ? '[REDACTED]' : redactString(v)
    } else {
      out[k] = v
    }
  }
  return out
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch { /* fall through */ }
  const b = [8, 4, 4, 4, 12].map((n) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  )
  return `${b[0]}-${b[1]}-4${b[2].slice(1)}-${b[3]}-${b[4]}`
}

function readRaw(): SessionLogEntry[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((e): e is SessionLogEntry =>
      !!e && typeof e === 'object'
        && typeof (e as SessionLogEntry).id === 'string'
        && typeof (e as SessionLogEntry).timestamp === 'number'
        && typeof (e as SessionLogEntry).eventType === 'string'
        && typeof (e as SessionLogEntry).summary === 'string',
    )
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[sessionLog] readRaw failed', e)
    return []
  }
}

function writeRaw(entries: SessionLogEntry[]): void {
  if (!isBrowser()) return
  try {
    const capped = entries.length > MAX_ENTRIES
      ? entries.slice(entries.length - MAX_ENTRIES)
      : entries
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capped))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[sessionLog] writeRaw failed', e)
  }
}

/** Append a new entry. Never throws. Returns the materialized entry (with id+timestamp). */
export function appendSessionLog(
  entry: Omit<SessionLogEntry, 'id' | 'timestamp'>,
): SessionLogEntry {
  const materialized: SessionLogEntry = {
    id: uuid(),
    timestamp: Date.now(),
    eventType: entry.eventType,
    summary: redactString(entry.summary ?? ''),
    ...(entry.payload !== undefined ? { payload: redactPayload(entry.payload) } : {}),
    ...(entry.mode !== undefined ? { mode: entry.mode } : {}),
  }
  try {
    const current = readRaw()
    current.push(materialized)
    writeRaw(current)
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[sessionLog] appendSessionLog failed', e)
  }
  return materialized
}

/** Read all entries, newest-first. Never throws. */
export function readSessionLog(): SessionLogEntry[] {
  const raw = readRaw()
  return raw.slice().reverse()
}

/** Wipe every entry. Never throws. */
export function clearSessionLog(): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[sessionLog] clearSessionLog failed', e)
  }
}

/** JSON-stringified dump suitable for download / copy-paste. Never throws. */
export function exportSessionLogJSON(): string {
  try {
    return JSON.stringify(readSessionLog(), null, 2)
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[sessionLog] exportSessionLogJSON failed', e)
    return '[]'
  }
}

/**
 * React subscription hook. Listens to both the native cross-tab 'storage' event
 * AND the in-window custom 'hey-bradley:session-log-changed' event so any caller
 * — even within the same tab — sees fresh entries on the next paint.
 */
export function useSessionLog(): {
  entries: SessionLogEntry[]
  clear: () => void
  exportJSON: () => string
} {
  const [entries, setEntries] = useState<SessionLogEntry[]>(() => readSessionLog())

  useEffect(() => {
    if (!isBrowser()) return
    const refresh = (): void => setEntries(readSessionLog())
    const onStorage = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY || e.key === null) refresh()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(CHANGE_EVENT, refresh as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CHANGE_EVENT, refresh as EventListener)
    }
  }, [])

  const clear = useCallback((): void => {
    clearSessionLog()
    setEntries([])
  }, [])

  const exportJSON = useCallback((): string => exportSessionLogJSON(), [])

  return { entries, clear, exportJSON }
}
