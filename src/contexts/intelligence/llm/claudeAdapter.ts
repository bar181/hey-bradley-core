// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.6
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Browser-mode BYOK rationale: docs/adr/ADR-043-byok-key-trust.md

import Anthropic from '@anthropic-ai/sdk';
import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { safeJson, classifyError } from './adapterUtils';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
// USD per 1M tokens (Haiku 4.5 2026 pricing per Anthropic API docs).
const COST_PER_M = { in: 1.0, out: 5.0 } as const;

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
      // P20 C20: forward AbortSignal to SDK so a timeout in auditedComplete
      // actually cancels the in-flight fetch. Anthropic SDK accepts { signal }
      // as a per-call request option.
      const r = await this.client.messages.create({
        model: this.modelId,
        max_tokens: 1024,
        system: req.systemPrompt,
        messages: [{ role: 'user', content: req.userPrompt }],
      }, req.signal ? { signal: req.signal } : undefined);
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

// P19 Fix-Pass 2 (F7): safeJson + classifyError moved to ./adapterUtils.ts
// (shared with geminiAdapter + openrouterAdapter).
