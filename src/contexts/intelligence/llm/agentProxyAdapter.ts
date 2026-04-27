// Spec: plans/implementation/phase-18b/wave-1.md
// Decision record: docs/adr/ADR-046-multi-provider-llm-architecture.md
// Strategy: DB-backed prompt corpus replaces TS-coded fixtures. Multiple
// LLMs can later record their actual responses to example_prompts via
// example_prompt_runs for cross-provider validation.

import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { estimateTokens } from './cost';
import {
  findExamplePromptForUserPrompt,
  recordExamplePromptRun,
  type ExamplePromptRow,
} from '@/contexts/persistence/repositories/examplePrompts';

const PROVIDER_LABEL = 'agent-proxy';
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
    return 'simulated';
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

    // Best-effort baseline row in example_prompt_runs so the cross-LLM
    // comparison table always has a "what we predicted" reference. Failures
    // here are non-fatal — the adapter response is the primary contract.
    try {
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
