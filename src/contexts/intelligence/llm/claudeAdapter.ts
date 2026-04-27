// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.6
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Browser-mode BYOK rationale: docs/adr/ADR-043-byok-key-trust.md

import Anthropic from '@anthropic-ai/sdk';
import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { redactKeyShapes } from './keys';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const COST_PER_M = { in: 0.25, out: 1.25 } as const; // USD per 1M tokens (Haiku)

export class ClaudeAdapter implements LLMAdapter {
  private client: Anthropic;
  private modelId: string;

  constructor(apiKey: string, model: string = DEFAULT_MODEL) {
    this.client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    this.modelId = model;
  }

  name(): LLMProviderName {
    return 'claude';
  }

  label(): string {
    return `Claude (${this.modelId})`;
  }

  model(): string {
    return this.modelId;
  }

  async testConnection(): Promise<boolean> {
    try {
      const r = await this.client.messages.create({
        model: this.modelId,
        max_tokens: 4,
        messages: [{ role: 'user', content: 'ping' }],
      });
      return Array.isArray(r.content);
    } catch {
      return false;
    }
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    try {
      const r = await this.client.messages.create({
        model: this.modelId,
        max_tokens: 1024,
        system: req.systemPrompt,
        messages: [{ role: 'user', content: req.userPrompt }],
      });
      const text = r.content
        .map((b) => ('text' in b ? b.text : ''))
        .join('');
      const inTok = r.usage?.input_tokens ?? 0;
      const outTok = r.usage?.output_tokens ?? 0;
      return {
        ok: true,
        json: safeJson(text),
        tokens: { in: inTok, out: outTok },
        cost_usd: (inTok * COST_PER_M.in + outTok * COST_PER_M.out) / 1_000_000,
      };
    } catch (e) {
      return classifyError(e);
    }
  }
}

function safeJson(text: string): unknown {
  // Tolerant: strip leading/trailing whitespace + code fences. Phase 18 has the
  // tolerant parser; this minimal stub just JSON.parses or returns the raw string
  // wrapped in { __raw: text } so the caller's Zod can decide.
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/, '')
    .replace(/\s*```\s*$/, '');
  try {
    return JSON.parse(trimmed);
  } catch {
    return { __raw: text };
  }
}

function classifyError(e: unknown): LLMResponse {
  const raw = e instanceof Error ? e.message : String(e);
  // SDK errors can echo back malformed Bearer tokens / sk-ant-… prefixes; redact
  // before the string is propagated to llm_calls.error_text or exports.
  const detail = redactKeyShapes(raw);
  if (/rate\s*limit|429/i.test(raw)) {
    return { ok: false, error: { kind: 'rate_limit', detail } };
  }
  if (/timeout|timed out/i.test(raw)) {
    return { ok: false, error: { kind: 'timeout' } };
  }
  if (/network|fetch failed|ECONN/i.test(raw)) {
    return { ok: false, error: { kind: 'network', detail } };
  }
  return { ok: false, error: { kind: 'invalid_response', detail } };
}
