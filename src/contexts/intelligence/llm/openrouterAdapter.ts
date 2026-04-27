// Spec: plans/implementation/mvp-plan/04-phase-18b-wave-1.md (A2)
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// OpenRouter is a unified gateway exposing many models under an OpenAI-compatible
// schema. Default is the :free Mistral tier (no per-token cost). Paid model math
// is delegated to cost.ts via the model id.

import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { redactKeyShapes } from './keys';
import { safeJson, classifyError } from './adapterUtils';

const DEFAULT_MODEL = 'mistralai/mistral-7b-instruct:free';
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

function headers(apiKey: string): Record<string, string> {
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin : 'https://hey-bradley.local';
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': origin,
    'X-Title': 'Hey Bradley',
  };
}

export class OpenRouterAdapter implements LLMAdapter {
  private apiKey: string;
  private modelId: string;

  constructor(apiKey: string, model: string = DEFAULT_MODEL) {
    this.apiKey = apiKey;
    this.modelId = model;
  }

  name(): LLMProviderName { return 'openrouter'; }
  label(): string { return `OpenRouter (${this.modelId})`; }
  model(): string { return this.modelId; }

  async testConnection(): Promise<boolean> {
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: headers(this.apiKey),
        body: JSON.stringify({
          model: this.modelId,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 4,
        }),
      });
      return r.ok;
    } catch {
      return false;
    }
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: headers(this.apiKey),
        body: JSON.stringify({
          model: this.modelId,
          messages: [
            { role: 'system', content: req.systemPrompt },
            { role: 'user', content: req.userPrompt },
          ],
          max_tokens: 1024,
        }),
      });
      if (!r.ok) {
        const text = await r.text();
        return { ok: false, error: { kind: 'invalid_response', detail: redactKeyShapes(text.slice(0, 200)) } };
      }
      const json = (await r.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const text = json.choices?.[0]?.message?.content ?? '';
      const inTok = json.usage?.prompt_tokens ?? 0;
      const outTok = json.usage?.completion_tokens ?? 0;
      return {
        ok: true,
        json: safeJson(text),
        tokens: { in: inTok, out: outTok },
        cost_usd: 0, // :free tier; paid models resolved via cost.ts MODEL_COSTS
      };
    } catch (e) {
      return classifyError(e);
    }
  }
}

// P19 Fix-Pass 2 (F7): safeJson + classifyError moved to ./adapterUtils.ts.
