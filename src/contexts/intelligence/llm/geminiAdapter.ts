// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.6
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// SDK: @google/genai — see node_modules/@google/genai/README.md (ai.models.generateContent)

import { GoogleGenAI } from '@google/genai';
import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { safeJson, classifyError } from './adapterUtils';

const DEFAULT_MODEL = 'gemini-2.5-flash';
// USD per 1M tokens (Gemini 2.5 Flash, 2026 paid-tier pricing per
// ai.google.dev/gemini-api/docs/pricing — free tier removed 2026-04-01).
const COST_PER_M = { in: 0.30, out: 2.50 } as const;

export class GeminiAdapter implements LLMAdapter {
  private client: GoogleGenAI;
  private modelId: string;

  constructor(apiKey: string, model: string = DEFAULT_MODEL) {
    this.client = new GoogleGenAI({ apiKey });
    this.modelId = model;
  }

  name(): LLMProviderName {
    return 'gemini';
  }

  label(): string {
    return `Gemini (${this.modelId})`;
  }

  model(): string {
    return this.modelId;
  }

  async testConnection(): Promise<boolean> {
    try {
      const r = await this.client.models.generateContent({
        model: this.modelId,
        contents: 'ping',
        config: { maxOutputTokens: 4 },
      });
      return typeof r.text === 'string';
    } catch {
      return false;
    }
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    try {
      // P20 C20: Google @google/genai SDK does NOT accept a per-call signal.
      // Best-effort: race the SDK promise against the abort event so OUR side
      // resolves promptly on timeout. The SDK fetch may continue in background
      // (fire-and-forget); that's the residual leak documented in C20 GOAP.
      const sdkPromise = this.client.models.generateContent({
        model: this.modelId,
        contents: req.userPrompt,
        config: {
          systemInstruction: req.systemPrompt,
          maxOutputTokens: 1024,
        },
      });
      const r = req.signal
        ? await Promise.race([
            sdkPromise,
            new Promise<never>((_, rej) => {
              req.signal!.addEventListener('abort', () => {
                const err = new Error('aborted');
                err.name = 'AbortError';
                rej(err);
              }, { once: true });
            }),
          ])
        : await sdkPromise;
      const text = r.text ?? '';
      const inTok = r.usageMetadata?.promptTokenCount ?? 0;
      const outTok = r.usageMetadata?.candidatesTokenCount ?? 0;
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

// P19 Fix-Pass 2 (F7): safeJson + classifyError moved to ./adapterUtils.ts.
