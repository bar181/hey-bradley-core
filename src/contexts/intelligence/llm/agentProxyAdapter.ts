// Spec: plans/implementation/phase-18b/wave-1.md
// Decision record: docs/adr/ADR-046-multi-provider-llm-architecture.md
// Strategy: DB-backed prompt corpus replaces TS-coded fixtures. Multiple
// LLMs can later record their actual responses to example_prompts via
// example_prompt_runs for cross-provider validation.

import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { estimateTokens } from './cost';
import {
  findExamplePromptForUserPrompt,
  listExamplePromptRuns,
  recordExamplePromptRun,
  type ExamplePromptRow,
} from '@/contexts/persistence/repositories/examplePrompts';

// FIX 2 (Phase 18b): provider label aligned to 'mock' for parity with
// adapter.name() and the picker UI. example_prompt_runs.provider now matches
// llm_logs.provider so cross-table joins ('mock' === 'mock') work directly.
const PROVIDER_LABEL = 'mock';
const MODEL_ID = 'agent-proxy-v1';

/**
 * AgentProxyAdapter — DB-backed mock LLM. Looks each `userPrompt` up in the
 * `example_prompts` table (exact match first, then regex) and returns the
 * stored `expected_envelope_json` as an ok response. Misses fall through with
 * an `invalid_response` error so the chat pipeline can hit the canned reply.
 *
 * The "agent proxy" name reflects the workflow: when a new prompt has no
 * row, an agent (e.g. Claude Code) hand-authors a realistic envelope and
 * inserts it into `example_prompts`. Real LLM responses can later be
 * recorded into `example_prompt_runs` for cross-provider validation.
 */
export class AgentProxyAdapter implements LLMAdapter {
  name(): LLMProviderName {
    return 'mock';
  }

  label(): string {
    return 'Agent Proxy (DB fixtures, no network)';
  }

  model(): string {
    return MODEL_ID;
  }

  async testConnection(): Promise<boolean> {
    return true;
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    let row: ExamplePromptRow | null;
    try {
      row = findExamplePromptForUserPrompt(req.userPrompt);
    } catch {
      // DB not initialised yet — caller should fall back to canned/static.
      return {
        ok: false,
        error: { kind: 'invalid_response', detail: 'example_prompts unavailable' },
      };
    }

    if (!row) {
      return {
        ok: false,
        error: {
          kind: 'invalid_response',
          detail: `no example_prompt matched: "${req.userPrompt.slice(0, 80)}"`,
        },
      };
    }

    let envelope: unknown;
    try {
      envelope = JSON.parse(row.expected_envelope_json);
    } catch (e) {
      const detail = e instanceof Error ? e.message : 'parse failed';
      return {
        ok: false,
        error: { kind: 'invalid_response', detail: `bad expected_envelope_json: ${detail}` },
      };
    }

    const inTokens = estimateTokens(req.systemPrompt + req.userPrompt);
    const outTokens = estimateTokens(row.expected_envelope_json);

    // FIX 4 (Phase 18b): idempotency guard. example_prompt_runs has no UNIQUE
    // constraint (already-applied migration; cannot ALTER post-hoc without a
    // follow-up migration), so we KISS-guard at write-time: only one baseline
    // row per (example_prompt_id, provider='mock', model=MODEL_ID) trio.
    // Skips if a baseline already exists; failures stay non-fatal.
    try {
      const existing = listExamplePromptRuns(row.id);
      const hasBaseline = existing.some(
        (r) => r.provider === PROVIDER_LABEL && r.model === MODEL_ID,
      );
      if (!hasBaseline) {
        recordExamplePromptRun({
          example_prompt_id: row.id,
          provider: PROVIDER_LABEL,
          model: MODEL_ID,
          actual_response_json: row.expected_envelope_json,
          matches_expected: 1,
          tokens_in: inTokens,
          tokens_out: outTokens,
          cost_usd: 0,
          latency_ms: 0,
        });
      }
    } catch {
      /* ignore — baseline write is best-effort */
    }

    return {
      ok: true,
      json: envelope,
      tokens: { in: inTokens, out: outTokens },
      cost_usd: 0,
    };
  }
}
