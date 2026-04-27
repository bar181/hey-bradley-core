// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.4
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Boot-time provider selection. Reads VITE_LLM_* env, falls back to simulated
// when no key is present. ClaudeAdapter and GeminiAdapter are dynamically
// imported so the simulated-only path does not pull SDKs into the bundle.

import type { LLMAdapter, LLMProviderName } from './adapter';
import { SimulatedAdapter } from './simulatedAdapter';

export interface PickResult {
  adapter: LLMAdapter;
  status: 'ok' | 'no_key' | 'fallback';
  detail?: string;
}

export async function pickAdapter(args?: {
  provider?: string;
  apiKey?: string;
  model?: string;
}): Promise<PickResult> {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
  const provider = (args?.provider ?? env.VITE_LLM_PROVIDER ?? 'simulated').toLowerCase() as LLMProviderName;
  const apiKey = args?.apiKey ?? env.VITE_LLM_API_KEY ?? '';
  const model = args?.model ?? env.VITE_LLM_MODEL;

  if (provider === 'simulated' || !apiKey) {
    return {
      adapter: new SimulatedAdapter(),
      status: provider === 'simulated' ? 'ok' : 'no_key',
      detail: provider !== 'simulated' && !apiKey ? `${provider} requires a key; using simulated` : undefined,
    };
  }

  if (provider === 'claude') {
    const { ClaudeAdapter } = await import('./claudeAdapter');
    return { adapter: new ClaudeAdapter(apiKey, model), status: 'ok' };
  }
  if (provider === 'gemini') {
    const { GeminiAdapter } = await import('./geminiAdapter');
    return { adapter: new GeminiAdapter(apiKey, model), status: 'ok' };
  }
  return { adapter: new SimulatedAdapter(), status: 'fallback', detail: `unknown provider: ${provider}` };
}
