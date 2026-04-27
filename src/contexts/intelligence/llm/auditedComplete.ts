// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.5 (cost),
//   §4 Refinement Checkpoint E (hard-cap behavior), §5 DoD.
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Single canonical wrapper for LLM calls: pre-call cost cap, audit row write,
// session usage update. P18 will call this instead of adapter.complete().

import type { LLMAdapter, LLMRequest, LLMResponse } from './adapter';
import { useIntelligenceStore } from '@/store/intelligenceStore';
import { recordLLMCall, type LLMCallStatus } from '@/contexts/persistence/repositories/llmCalls';
import { activeSession, startSession } from '@/contexts/persistence/repositories/sessions';
import { useProjectStore } from '@/store/projectStore';

const DEFAULT_CAP_USD = 1.0;
const MIN_CAP_USD = 0.10;
const MAX_CAP_USD = 20.0;

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
 * Single canonical wrapper for LLM calls. Enforces cost cap, writes llm_calls
 * audit row, updates intelligenceStore session counters.
 */
export async function auditedComplete(
  adapter: LLMAdapter,
  req: LLMRequest,
  _ctx: AuditedCallContext = { source: 'chat' },
): Promise<LLMResponse> {
  const store = useIntelligenceStore.getState();
  const cap = getCapUsd();

  // Pre-call cap check: if current session spend already at/above cap, refuse.
  if (store.sessionUsd >= cap) {
    return {
      ok: false,
      error: {
        kind: 'cost_cap',
        detail: `Session spend ($${store.sessionUsd.toFixed(4)}) at cap ($${cap.toFixed(2)})`,
      },
    };
  }

  let session_id: string;
  try {
    session_id = ensureSession();
  } catch (e) {
    return { ok: false, error: { kind: 'invalid_response', detail: e instanceof Error ? e.message : String(e) } };
  }

  const res = await adapter.complete(req);

  if (res.ok) {
    store.recordUsage(res.tokens.in, res.tokens.out, res.cost_usd);
    recordLLMCall({
      session_id,
      provider: adapter.name(),
      model: adapter.model(),
      prompt_tokens: res.tokens.in,
      output_tokens: res.tokens.out,
      cost_usd: res.cost_usd,
      status: 'ok',
    });
  } else {
    const status: LLMCallStatus =
      res.error.kind === 'timeout' ? 'timeout'
      : res.error.kind === 'invalid_response' ? 'validation_failed'
      : 'error';
    const detail = res.error.kind === 'no_key'
      ? 'no_key'
      : (res.error as { detail?: string }).detail;
    recordLLMCall({
      session_id,
      provider: adapter.name(),
      model: adapter.model(),
      status,
      error_text: detail,
    });
  }

  return res;
}
