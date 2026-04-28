// Spec: P35 Sprint E P2 — BYOK matrix completion (OpenAI provider).
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Browser-mode BYOK rationale: docs/adr/ADR-043-byok-key-trust.md
//
// Default model is gpt-5-nano per OpenAI 2026 guidance: cheapest + fastest
// in the GPT-5 family, optimized for high-volume classification + summarization
// tasks ($0.05 / $0.40 per 1M tokens). User does not select a model; the
// adapter picks the cheap-and-fast default unless an explicit model is passed.

import OpenAI from 'openai';
import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { safeJson, classifyError } from './adapterUtils';

const DEFAULT_MODEL = 'gpt-5-nano';
const COST_PER_M = { in: 0.05, out: 0.40 } as const; // USD per 1M tokens (gpt-5-nano)

export class OpenAIAdapter implements LLMAdapter {
  private client: OpenAI;
  private modelId: string;

  constructor(apiKey: string, model: string = DEFAULT_MODEL) {
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    this.modelId = model;
  }

  name(): LLMProviderName {
    return 'openai';
  }

  label(): string {
    return `OpenAI (${this.modelId})`;
  }

  model(): string {
    return this.modelId;
  }

  async testConnection(): Promise<boolean> {
    try {
      const r = await this.client.chat.completions.create({
        model: this.modelId,
        max_completion_tokens: 4,
        messages: [{ role: 'user', content: 'ping' }],
      });
      return Array.isArray(r.choices) && r.choices.length > 0;
    } catch {
      return false;
    }
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    try {
      // OpenAI SDK accepts { signal } as a per-call request option (matches
      // Anthropic SDK pattern). When the signal fires, the in-flight fetch
      // is cancelled (P20 C20).
      const r = await this.client.chat.completions.create(
        {
          model: this.modelId,
          max_completion_tokens: 1024,
          messages: [
            { role: 'system', content: req.systemPrompt },
            { role: 'user', content: req.userPrompt },
          ],
        },
        req.signal ? { signal: req.signal } : undefined,
      );
      const text = r.choices?.[0]?.message?.content ?? '';
      const inTok = r.usage?.prompt_tokens ?? 0;
      const outTok = r.usage?.completion_tokens ?? 0;
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
