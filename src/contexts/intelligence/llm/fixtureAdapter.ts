// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 1
// Decision record: docs/adr/ADR-044-json-patch-contract.md (to be authored Step 3)
// Strategy: agent-driven / hand-authored fixtures replace real LLM during dev/test

import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter';

export interface FixtureEntry {
  // Match by exact userPrompt OR by regex on userPrompt.
  matchExact?: string;
  matchPattern?: RegExp;
  envelope: {
    patches: Array<{ op: 'add' | 'replace' | 'remove'; path: string; value?: unknown }>;
    summary?: string;
  };
  inTokens?: number; // synthetic, defaults to estimateTokens(userPrompt)
  outTokens?: number; // synthetic, defaults to estimateTokens(stringified envelope)
}

export class FixtureAdapter implements LLMAdapter {
  private readonly fixtures: FixtureEntry[];

  constructor(fixtures: FixtureEntry[]) {
    this.fixtures = fixtures;
  }

  name(): LLMProviderName {
    return 'simulated';
  }

  label(): string {
    return 'Fixture (no network)';
  }

  model(): string {
    return 'fixture-v1';
  }

  async testConnection(): Promise<boolean> {
    return true;
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    const hit = this.fixtures.find(
      (f) =>
        (f.matchExact !== undefined && f.matchExact === req.userPrompt) ||
        (f.matchPattern !== undefined && f.matchPattern.test(req.userPrompt)),
    );
    if (!hit) {
      return {
        ok: false,
        error: {
          kind: 'invalid_response',
          detail: `no fixture matched: "${req.userPrompt.slice(0, 80)}"`,
        },
      };
    }
    const inTokens = hit.inTokens ?? Math.ceil(req.userPrompt.length / 4);
    const outTokens = hit.outTokens ?? Math.ceil(JSON.stringify(hit.envelope).length / 4);
    // Cost is zero — fixtures are free.
    return {
      ok: true,
      json: hit.envelope,
      tokens: { in: inTokens, out: outTokens },
      cost_usd: 0,
    };
  }
}
