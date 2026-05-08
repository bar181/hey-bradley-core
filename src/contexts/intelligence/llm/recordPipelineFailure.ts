// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 3 — A7.
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
//
// FIX 8: collapse the double audit row. Previously this helper INSERTED a
// second `validation_failed` row alongside the original `ok` row written by
// `auditedComplete`, producing two rows per rejected response. We now UPDATE
// the original row in-place: status `ok` → `validation_failed` and stash a
// short structured detail in error_text. Net: one row per call/decision.
//
// FIX 9: error_text MUST be a short structured marker like
// `parse@root: missing patches array` — never raw user content or rejected
// values. Audit log must not become a leak channel.

import { updateLLMCall } from '@/contexts/persistence/repositories/llmCalls'

export type PipelineFailureKind = 'parse' | 'validate' | 'apply'

const DETAIL_CAP = 120

/**
 * Update the existing audit row for `callId` to `validation_failed` with a
 * short structured detail. `detail` SHOULD already be a structured short
 * string (e.g. `parse@root: missing patches array`); we trim defensively.
 *
 * Best-effort: logs in DEV but never throws — callers are already in a
 * recovery branch and need to keep moving toward the canned fallback.
 */
export function recordPipelineFailure(
  callId: number | null,
  kind: PipelineFailureKind,
  detail: string,
): void {
  if (!Number.isInteger(callId) || (callId as number) <= 0) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[recordPipelineFailure] no callId — skipping update', { kind, detail })
    }
    return
  }
  try {
    // FIX 9: structured short marker only. Hard cap so a runaway detail can't
    // bloat the audit row.
    const safe = `${kind}: ${String(detail).slice(0, DETAIL_CAP)}`
    updateLLMCall(callId as number, { status: 'validation_failed', error_text: safe })
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[recordPipelineFailure] update skipped', e)
  }
}
