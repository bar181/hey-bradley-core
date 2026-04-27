// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 3 — A7.
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
//
// Approach (b) from Step 3 spec: a small helper called from ChatInput when the
// adapter reply is well-formed (auditedComplete already wrote an `ok` row) but
// a DOWNSTREAM step (parser / validator / applier) rejects the result. This
// keeps `auditedComplete` focused on the network call while still guaranteeing
// "every decision yields an audit row" — required for P18 §5 DoD.

import { useIntelligenceStore } from '@/store/intelligenceStore'
import { recordLLMCall, type LLMCallStatus } from '@/contexts/persistence/repositories/llmCalls'
import { activeSession } from '@/contexts/persistence/repositories/sessions'
import { useProjectStore } from '@/store/projectStore'

export type PipelineFailureKind = 'parse' | 'validate' | 'apply'

/**
 * Append a `validation_failed` audit row when a downstream pipeline stage
 * rejects an otherwise-successful adapter response. The original `ok` row
 * stands; this row attributes the *decision* (config not mutated) so the audit
 * trail explains why the user's chat fell through to the canned fallback.
 *
 * Best-effort: logs in DEV but never throws into the chat pipeline — callers
 * are already in a recovery branch and need to keep moving toward the canned
 * fallback so the demo never breaks.
 */
export function recordPipelineFailure(kind: PipelineFailureKind, detail: string): void {
  try {
    const projectId = useProjectStore.getState().activeProject
    if (!projectId) return
    const sess = activeSession(projectId)
    if (!sess) return
    const adapter = useIntelligenceStore.getState().adapter
    if (!adapter) return
    const status: LLMCallStatus = 'validation_failed'
    recordLLMCall({
      session_id: sess.id,
      provider: adapter.name(),
      model: adapter.model(),
      status,
      error_text: `${kind}: ${detail.slice(0, 200)}`,
    })
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[recordPipelineFailure] insert skipped', e)
  }
}
