// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.5 (cost),
//   §4 Refinement Checkpoint E (hard-cap behavior), §5 DoD.
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Single canonical wrapper for LLM calls: pre-call cost cap, audit row write,
// session usage update. P18 will call this instead of adapter.complete().

import type { LLMAdapter, LLMRequest, LLMResponse, LLMError } from './adapter';
import { useIntelligenceStore } from '@/store/intelligenceStore';
import { recordLLMCall, type LLMCallStatus } from '@/contexts/persistence/repositories/llmCalls';
import { recordLLMLog, updateLLMLog, type LLMLogStatus } from '@/contexts/persistence/repositories/llmLogs';
import { activeSession, startSession } from '@/contexts/persistence/repositories/sessions';
import { useProjectStore } from '@/store/projectStore';
import { redactKeyShapes, hashPrompt } from './keys';
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
  // P20 ADR-049: store-cap (kv-persisted, user-editable) takes precedence over
  // build-time env. Pre-init fallback chain: store value → env → default.
  const storeCap = useIntelligenceStore.getState().capUsd;
  if (Number.isFinite(storeCap) && storeCap > 0) {
    return Math.min(MAX_CAP_USD, Math.max(MIN_CAP_USD, storeCap));
  }
  const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
  const raw = env.VITE_LLM_MAX_USD;
  const parsed = raw ? Number(raw) : NaN;
  if (!Number.isFinite(parsed)) return DEFAULT_CAP_USD;
  return Math.min(MAX_CAP_USD, Math.max(MIN_CAP_USD, parsed));
}

/**
 * FIX 9 (Phase 18b): higher-entropy request_id fallback for environments where
 * `crypto.randomUUID` is unavailable (older WebViews, some sql.js test rigs).
 * Builds a UUID-v4-shaped string from 16 bytes of crypto-random; the previous
 * `Date.now()-Math.random()` form risked unique-constraint collisions on the
 * `llm_logs.request_id` column under burst load.
 */
function fallbackRequestId(): string {
  const cryptoLike = (globalThis.crypto as Crypto | undefined);
  const bytes = new Uint8Array(16);
  if (cryptoLike?.getRandomValues) {
    cryptoLike.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  // Per RFC 4122 §4.4: set version (0100) and variant (10) bits.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) hex.push(bytes[i].toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

function ensureSession(): string {
  const projectId = useProjectStore.getState().activeProject;
  if (!projectId) throw new Error('[intelligence] no active project for LLM call');
  const existing = activeSession(projectId);
  if (existing) return existing.id;
  return startSession(projectId).id;
}

/**
 * 18b A4: map LLMError.kind onto the llm_logs.status enum. Note llm_logs status
 * has additional members ('cost_cap', 'rate_limit') vs llm_calls; both are
 * pre-handled before adapter invocation so they don't reach this mapping in
 * the adapter-result branch.
 */
function logStatusFromError(kind: LLMError['kind']): LLMLogStatus {
  if (kind === 'timeout') return 'timeout';
  if (kind === 'invalid_response') return 'validation_failed';
  if (kind === 'rate_limit') return 'rate_limit';
  return 'error';
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

    // FIX 5 (Phase 18b): we MUST own a session_id before writing llm_logs. If
    // ensureSession() throws there is no session to attribute the call to,
    // which is a true precondition failure (no log row, no audit row).
    let session_id: string;
    let project_id: string;
    try {
      session_id = ensureSession();
      // ensureSession() already validated activeProject is non-null.
      project_id = useProjectStore.getState().activeProject as string;
    } catch (e) {
      // precondition_failed is the right kind for "no active project" —
      // semantically distinct from "model returned bad JSON" (invalid_response).
      return {
        ok: false,
        error: { kind: 'precondition_failed', detail: e instanceof Error ? e.message : String(e) },
      };
    }

    // FIX 5 (Phase 18b): pre-emptively insert ONE llm_logs row covering every
    // adapter-call decision (ok/error/timeout/validation_failed/cost_cap/
    // rate_limit). Status starts as 'cost_cap' or 'ok'; downstream branches
    // updateLLMLog() to the final status. Net invariant: exactly one row per
    // adapter-call decision. Failures here are non-fatal — the log row is
    // forensic, not load-bearing for cap math (llm_calls handles that).
    let logId: number | null = null;
    const startedAt = Date.now();
    // FIX 9: prefer crypto.randomUUID; fall back to a high-entropy v4-shaped UUID
    // (collision-safe under burst load, llm_logs.request_id is UNIQUE).
    const requestId = (globalThis.crypto as Crypto | undefined)?.randomUUID?.() ?? fallbackRequestId();
    const initialStatus: LLMLogStatus = decision === 'cost_cap' ? 'cost_cap' : 'ok';
    try {
      const promptHash = await hashPrompt(req.systemPrompt, req.userPrompt);
      const row = recordLLMLog({
        request_id: requestId,
        parent_request_id: null,
        session_id, project_id,
        provider: adapter.name(), model: adapter.model(),
        prompt_hash: promptHash,
        system_prompt: req.systemPrompt,
        user_prompt: req.userPrompt,
        response_raw: null,
        patch_count: 0,
        input_tokens: null, output_tokens: null,
        cost_usd: null, latency_ms: null,
        status: initialStatus,
        error_kind: decision === 'cost_cap' ? 'cost_cap' : null,
        started_at: startedAt,
      });
      logId = row.id;
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[auditedComplete] llm_logs insert failed', e);
    }

    // FIX 5: cost-cap rejection now happens AFTER llm_logs row is written so
    // observability covers the rejected call.
    if (decision === 'cost_cap') {
      return {
        ok: false,
        error: {
          kind: 'cost_cap',
          detail: `Session spend ($${store.sessionUsd.toFixed(4)}) + projected ($${projected.toFixed(4)}) >= cap ($${cap.toFixed(2)})`,
        },
      };
    }

    // P20 C20 — AbortController plumb-through. Replaces the prior Promise.race
    // pattern that left the underlying SDK request leaking. The signal is
    // propagated into the adapter, which forwards to the SDK / fetch. At
    // CALL_TIMEOUT_MS the controller aborts; the adapter is expected to
    // classify AbortError → kind: 'timeout'. Adapters that ignore the signal
    // still get caught by this wrapper's catch.
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), CALL_TIMEOUT_MS);
    let res: LLMResponse;
    try {
      res = await adapter.complete({ ...req, signal: ac.signal });
    } catch (e) {
      if ((e as Error)?.name === 'AbortError' || ac.signal.aborted) {
        res = { ok: false, error: { kind: 'timeout' } };
      } else {
        clearTimeout(timer);
        throw e;
      }
    } finally {
      clearTimeout(timer);
    }

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
      // 18b A4: finalize llm_logs row with response + tokens + latency.
      // FIX 6 (Phase 18b): if the success-path UPDATE throws, the row is left
      // at status='ok' which would lie about a failure. Wrap the UPDATE in
      // try/catch and on catch attempt one fallback UPDATE flipping the row to
      // status='error', error_kind='audit_update_failed'. If even that throws,
      // swallow with a DEV warn — log is forensic, not load-bearing.
      if (logId !== null) {
        try {
          updateLLMLog(logId, {
            response_raw: JSON.stringify(res.json),
            output_tokens: res.tokens.out,
            cost_usd: res.cost_usd,
            latency_ms: Date.now() - startedAt,
          });
        } catch (e) {
          if (import.meta.env.DEV) console.warn('[auditedComplete] llm_logs update failed', e);
          try {
            updateLLMLog(logId, { status: 'error', error_kind: 'audit_update_failed' });
          } catch (e2) {
            if (import.meta.env.DEV) console.warn('[auditedComplete] llm_logs fallback update failed', e2);
          }
        }
      }
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
    // 18b A4: finalize llm_logs row with status + error_kind (slug only, no
    // raw detail — that lives on llm_calls.error_text already redacted).
    if (logId !== null) {
      try {
        updateLLMLog(logId, {
          status: logStatusFromError(res.error.kind),
          error_kind: res.error.kind,
          latency_ms: Date.now() - startedAt,
        });
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[auditedComplete] llm_logs error-update failed', e);
      }
    }
    return res;
  } finally {
    // FIX 10: ALWAYS release the mutex, even on synchronous throw before await.
    useIntelligenceStore.getState().setInFlight(false);
  }
}
