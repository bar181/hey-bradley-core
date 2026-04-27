// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.6
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// SDK: @google/genai — see node_modules/@google/genai/README.md (ai.models.generateContent)

import { GoogleGenAI } from '@google/genai';
import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';
import { safeJson, classifyError } from './adapterUtils';

const DEFAULT_MODEL = 'gemini-2.5-flash';
const COST_PER_M = { in: 0.075, out: 0.30 } as const; // USD per 1M tokens (Flash)

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
      const r = await this.client.models.generateContent({
        model: this.modelId,
        contents: req.userPrompt,
        config: {
          systemInstruction: req.systemPrompt,
          maxOutputTokens: 1024,
        },
      });
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
