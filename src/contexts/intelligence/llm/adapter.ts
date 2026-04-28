// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §1, §3
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Future-facing: ADR-043 (key trust), ADR-044 (patch contract)

export type LLMProviderName = 'claude' | 'gemini' | 'openrouter' | 'simulated' | 'mock';

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  /** Optional Zod schema (any object); resolution deferred to Phase 18 to keep this module dep-free. */
  schema?: unknown;
  /**
   * P20 C20 — Optional abort signal. When present, adapters MUST forward this
   * to the underlying SDK / fetch so a timeout in `auditedComplete` actually
   * cancels the in-flight network request (closes P17/P19 carryforward).
   */
  signal?: AbortSignal;
}

export type LLMError =
  | { kind: 'no_key' }
  | { kind: 'rate_limit'; detail?: string }
  | { kind: 'network'; detail?: string }
  | { kind: 'invalid_response'; detail?: string }
  | { kind: 'timeout' }
  | { kind: 'cost_cap'; detail: string }
  | { kind: 'precondition_failed'; detail: string };

export type LLMResponse =
  | { ok: true; json: unknown; tokens: { in: number; out: number }; cost_usd: number }
  | { ok: false; error: LLMError };

export interface LLMAdapter {
  name(): LLMProviderName;
  /** Return true if the adapter can reach its provider with the current key. */
  testConnection(): Promise<boolean>;
  complete(req: LLMRequest): Promise<LLMResponse>;
  /** Human label for UI ("Claude Haiku", "Gemini Flash", "Simulated"). */
  label(): string;
  /** Model identifier in use. */
  model(): string;
}
