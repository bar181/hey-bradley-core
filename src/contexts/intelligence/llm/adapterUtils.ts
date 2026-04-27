// P19 Fix-Pass 2 (F7): shared helpers for the three real-LLM adapters
// (claude, gemini, openrouter). The previous code triplicated `safeJson` and
// `classifyError` across each adapter file — same body, slightly different
// regex flavours. Consolidating here removes ~60 LOC across the trio and
// guarantees they evolve together.
//
// Spec: plans/implementation/phase-19/deep-dive/04-architecture-findings.md (A1)
//       plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md §2.2 (F7)
//
// Behaviour is a verbatim move of claudeAdapter.ts:71-101. `safeJson` strips
// optional code fences before JSON.parse; on parse failure it returns
// `{ __raw: text }` so the caller's tolerant parser can decide.
// `classifyError` redacts key-shaped substrings (ADR-043) and maps the message
// onto an LLMError kind.

import type { LLMResponse } from './adapter'
import { redactKeyShapes } from './keys'

/**
 * Tolerant JSON parser used by every real adapter. Strips a single leading
 * ```json fence + trailing ``` so models that ignore the "no code fences"
 * instruction still produce parseable output. On parse failure returns
 * `{ __raw: text }` (the response parser unwraps this and reports the reason).
 */
export function safeJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/, '')
    .replace(/\s*```\s*$/, '')
  try {
    return JSON.parse(trimmed)
  } catch {
    return { __raw: text }
  }
}

/**
 * Map a thrown adapter error onto an LLMResponse error envelope. Detail is
 * redacted via redactKeyShapes so leaking SDK-echoed keys into llm_calls.error_text
 * is impossible. Same kind taxonomy as auditedComplete consumes.
 */
export function classifyError(e: unknown): LLMResponse {
  const raw = e instanceof Error ? e.message : String(e)
  const detail = redactKeyShapes(raw)
  if (/rate\s*limit|429|RESOURCE_EXHAUSTED/i.test(raw)) {
    return { ok: false, error: { kind: 'rate_limit', detail } }
  }
  if (/timeout|timed out/i.test(raw)) {
    return { ok: false, error: { kind: 'timeout' } }
  }
  if (/network|fetch failed|ECONN/i.test(raw)) {
    return { ok: false, error: { kind: 'network', detail } }
  }
  return { ok: false, error: { kind: 'invalid_response', detail } }
}
