// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.5 (cost),
//   §4 Refinement Checkpoint E (hard-cap behavior), §5 DoD.
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Single canonical wrapper for LLM calls: pre-call cost cap, audit row write,
// session usage update. P18 will call this instead of adapter.complete().

import type { LLMAdapter, LLMRequest, LLMResponse, LLMError } from './adapter';
import { useIntelligenceStore } from '@/store/intelligenceStore';
import { recordLLMCall, type LLMCallStatus } from '@/contexts/persistence/repositories/llmCalls';
import { activeSession, startSession } from '@/contexts/persistence/repositories/sessions';
import { useProjectStore } from '@/store/projectStore';
import { redactKeyShapes } from './keys';
import { estimateTokens, estimateMaxCostForModel } from './cost';

const DEFAULT_CAP_USD = 1.0;
const MIN_CAP_USD = 0.10;
const MAX_CAP_USD = 20.0;
// Per-call wall-clock ceiling. Real adapters set their own timeouts but this
// is the last-line safety net so a hung adapter cannot wedge the chat.
const CALL_TIMEOUT_MS = 30_000;
// Conservative output-token upper bound for projected-cost math.
const PROJECTED_OUT_TOKENS_MAX = 1024;

function getCapUsd(): number {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
  const raw = env.VITE_LLM_MAX_USD;
  const parsed = raw ? Number(raw) : NaN;
  if (!Number.isFinite(parsed)) return DEFAULT_CAP_USD;
  return Math.min(MAX_CAP_USD, Math.max(MIN_CAP_USD, parsed));
}

function ensureSession(): string {
  const projectId = useProjectStore.getState().activeProject;
  if (!projectId) throw new Error('[intelligence] no active project for LLM call');
  const existing = activeSession(projectId);
  if (existing) return existing.id;
  return startSession(projectId).id;
}

export interface AuditedCallContext {
  source: 'chat' | 'listen' | 'test';
}

/**
 * FIX 8 — return shape extends LLMResponse with the inserted audit row id so
 * `recordPipelineFailure(callId, ...)` can UPDATE the same row in place
 * (one-row-per-call invariant). Only present on the success branch — error
 * branches already wrote an error row whose status is final.
 */
export type AuditedResponse =
  | { ok: true; json: unknown; tokens: { in: number; out: number }; cost_usd: number; auditCallId: number }
  | { ok: false; error: LLMError }

/**
 * Single canonical wrapper for LLM calls. Enforces cost cap, writes llm_calls
 * audit row, updates intelligenceStore session counters.
 *
 * FIX 10 — owns the global `inFlight` mutex (was per-component in ChatInput).
 * Centralising here covers Listen panel, Settings test, and any future LLM
 * call source against TOCTOU: every entry checks-then-sets atomically here.
 */
export async function auditedComplete(
  adapter: LLMAdapter,
  req: LLMRequest,
  _ctx: AuditedCallContext = { source: 'chat' },
): Promise<AuditedResponse> {
  const store = useIntelligenceStore.getState();

  // FIX 10: centralised re-entrancy guard. If another call is in flight from
  // ANY surface (chat, listen, settings test) refuse immediately.
  if (store.inFlight) {
    return { ok: false, error: { kind: 'rate_limit', detail: 'another call in flight' } };
  }
  store.setInFlight(true);

  try {
    const cap = getCapUsd();

    // Projected pre-call cost: input tokens at sysPrompt+userPrompt + a 1024
    // output-token ceiling. Unknown models => 0 (free path stays unblocked).
    const projectedInTokens = estimateTokens(req.systemPrompt + req.userPrompt);
    const projected = estimateMaxCostForModel(adapter.model(), projectedInTokens, PROJECTED_OUT_TOKENS_MAX);

    // P18 Step 2: refuse if EITHER current spend is already at/above cap, OR
    // adding this call's projected upper bound would push us over.
    const wouldExceed = store.sessionUsd + projected >= cap;
    const decision: 'allow' | 'cost_cap' = wouldExceed ? 'cost_cap' : 'allow';

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[auditedComplete]', { sessionUsd: store.sessionUsd, projected, cap, decision });
    }

    if (decision === 'cost_cap') {
      return {
        ok: false,
        error: {
          kind: 'cost_cap',
          detail: `Session spend ($${store.sessionUsd.toFixed(4)}) + projected ($${projected.toFixed(4)}) >= cap ($${cap.toFixed(2)})`,
        },
      };
    }

    let session_id: string;
    try {
      session_id = ensureSession();
    } catch (e) {
      // FIX 9: precondition_failed is the right kind for "no active project" —
      // semantically distinct from "model returned bad JSON" (invalid_response).
      return {
        ok: false,
        error: { kind: 'precondition_failed', detail: e instanceof Error ? e.message : String(e) },
      };
    }

    // P18 Step 2: race adapter.complete against a 30s wall-clock timeout. The
    // adapter's own AbortController (when present) handles the network layer;
    // this is the last-line guarantee that the chat thread cannot wedge.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<LLMResponse>((resolve) => {
      timer = setTimeout(
        () => resolve({ ok: false, error: { kind: 'timeout' } }),
        CALL_TIMEOUT_MS,
      );
    });
    const res = await Promise.race([adapter.complete(req), timeoutPromise]);
    if (timer) clearTimeout(timer);

    if (res.ok) {
      // FIX 6: audit insert is the source of truth — write it BEFORE bumping the
      // in-memory store. If the DB write throws we surface a real error and do
      // NOT update sessionUsd/sessionTokens (avoids a state-vs-DB divergence).
      let auditCallId: number;
      try {
        const row = recordLLMCall({
          session_id,
          provider: adapter.name(),
          model: adapter.model(),
          prompt_tokens: res.tokens.in,
          output_tokens: res.tokens.out,
          cost_usd: res.cost_usd,
          status: 'ok',
        });
        auditCallId = row.id;
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[auditedComplete] audit insert failed', e);
        return { ok: false, error: { kind: 'invalid_response', detail: 'audit insert failed' } };
      }
      store.recordUsage(res.tokens.in, res.tokens.out, res.cost_usd);
      return {
        ok: true,
        json: res.json,
        tokens: res.tokens,
        cost_usd: res.cost_usd,
        auditCallId,
      };
    }

    const status: LLMCallStatus =
      res.error.kind === 'timeout' ? 'timeout'
      : res.error.kind === 'invalid_response' ? 'validation_failed'
      : 'error';
    const rawDetail = res.error.kind === 'no_key'
      ? 'no_key'
      : (res.error as { detail?: string }).detail;
    // FIX 1 (P17): belt-and-suspenders — adapters already redact, but a stray
    // detail from an unexpected code path must NOT land in llm_calls.error_text.
    const safeDetail = rawDetail ? redactKeyShapes(rawDetail) : rawDetail;
    recordLLMCall({
      session_id,
      provider: adapter.name(),
      model: adapter.model(),
      status,
      error_text: safeDetail,
    });
    return res;
  } finally {
    // FIX 10: ALWAYS release the mutex, even on synchronous throw before await.
    useIntelligenceStore.getState().setInFlight(false);
  }
}
