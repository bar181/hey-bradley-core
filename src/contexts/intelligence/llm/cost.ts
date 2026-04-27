// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.5
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Pure USD math + token estimation. KISS — no deps, no I/O.

export const MODEL_COSTS = {
  'claude-haiku-4-5-20251001': { in: 0.25, out: 1.25 },   // USD per 1M tokens
  'gemini-2.5-flash':           { in: 0.075, out: 0.30 },
  'simulated-v1':               { in: 0,    out: 0 },
} as const;

export type KnownModel = keyof typeof MODEL_COSTS;

export function isKnownModel(m: string): m is KnownModel {
  return Object.prototype.hasOwnProperty.call(MODEL_COSTS, m);
}

export function usd(model: string, inTokens: number, outTokens: number): number {
  if (!isKnownModel(model)) return 0;
  const c = MODEL_COSTS[model];
  return (inTokens * c.in + outTokens * c.out) / 1_000_000;
}

/** Estimate token count from raw text (4 chars/token heuristic, KISS). */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Conservative upper-bound projected USD for a single call. Used by
 * auditedComplete's pre-call cap check (P18 Step 2) to refuse calls that
 * would push the session over the cap. Unknown models return 0 (free).
 */
export function estimateMaxCostForModel(
  model: string,
  inTokens: number,
  outTokensMax = 1024,
): number {
  return usd(model, inTokens, outTokensMax);
}
