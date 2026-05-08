// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.5
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Pure USD math + token estimation. KISS — no deps, no I/O.
//
// P114 / ADR-142 D2 — MODEL_COSTS synced with adapter COST_PER_M constants
// (claudeAdapter / geminiAdapter / openaiAdapter). Closes the 4-8× cap-math
// undercounting + the gpt-5-nano "uncapped" gap surfaced by P114/A3 audit.

export const MODEL_COSTS = {
  'claude-haiku-4-5-20251001':       { in: 1.0,   out: 5.0 },    // USD per 1M tokens (matches claudeAdapter COST_PER_M)
  'gemini-2.5-flash':                 { in: 0.30,  out: 2.50 },   // matches geminiAdapter COST_PER_M
  'gemini-2.0-flash':                 { in: 0,     out: 0 },     // free tier
  'gpt-5-nano':                       { in: 0.05,  out: 0.40 },   // matches openaiAdapter COST_PER_M
  'mistralai/mistral-7b-instruct:free': { in: 0,   out: 0 },     // OpenRouter :free tier
  'simulated-v1':                     { in: 0,     out: 0 },
} as const;

// Conservative upper-bound rates for unknown / future models so they cannot
// silently bypass the projected-cost cap. $1in / $5out per 1M tokens mirrors
// the most expensive currently-shipped paid model (Claude Haiku at adapter
// rates). New models added to the adapter set should append explicit entries
// above; this fallback is the safety net.
export const UNKNOWN_MODEL_FALLBACK = { in: 1.0, out: 5.0 } as const;

export type KnownModel = keyof typeof MODEL_COSTS;

export function isKnownModel(m: string): m is KnownModel {
  return Object.prototype.hasOwnProperty.call(MODEL_COSTS, m);
}

export function usd(model: string, inTokens: number, outTokens: number): number {
  const c = isKnownModel(model) ? MODEL_COSTS[model] : UNKNOWN_MODEL_FALLBACK;
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
