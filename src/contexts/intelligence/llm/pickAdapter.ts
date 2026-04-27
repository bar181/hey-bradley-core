// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.4
//       plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 2 (Task 9)
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Boot-time provider selection. Reads VITE_LLM_* env, falls back to simulated
// when no key is present. ClaudeAdapter and GeminiAdapter are dynamically
// imported so the simulated-only path does not pull SDKs into the bundle.

import type { LLMAdapter, LLMProviderName } from './adapter'
import { SimulatedAdapter } from './simulatedAdapter'
import { FixtureAdapter, type FixtureEntry } from './fixtureAdapter'
import { STEP1_FIXTURES } from '@/data/llm-fixtures/step-1'
import { STEP2_FIXTURES } from '@/data/llm-fixtures/step-2'

export interface PickResult {
  adapter: LLMAdapter
  status: 'ok' | 'no_key' | 'fallback'
  detail?: string
}

/** Merge all fixture libraries the dev path can serve. Step 4 swaps to live. */
const ALL_FIXTURES: FixtureEntry[] = [...STEP1_FIXTURES, ...STEP2_FIXTURES]

export async function pickAdapter(args?: {
  provider?: string
  apiKey?: string
  model?: string
}): Promise<PickResult> {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {}
  const provider = (args?.provider ?? env.VITE_LLM_PROVIDER ?? 'simulated').toLowerCase() as LLMProviderName
  const apiKey = args?.apiKey ?? env.VITE_LLM_API_KEY ?? ''
  const model = args?.model ?? env.VITE_LLM_MODEL

  if (provider === 'simulated' || !apiKey) {
    // Step 2 of Phase 18: in DEV the simulated path serves the fixture library
    // so the full prompt → parse → validate → apply pipeline runs end-to-end.
    // Production builds keep the lighter SimulatedAdapter (canned passthrough).
    const adapter: LLMAdapter = import.meta.env.DEV
      ? new FixtureAdapter(ALL_FIXTURES)
      : new SimulatedAdapter()
    return {
      adapter,
      status: provider === 'simulated' ? 'ok' : 'no_key',
      detail: provider !== 'simulated' && !apiKey ? `${provider} requires a key; using simulated` : undefined,
    }
  }

  if (provider === 'claude') {
    const { ClaudeAdapter } = await import('./claudeAdapter')
    return { adapter: new ClaudeAdapter(apiKey, model), status: 'ok' }
  }
  if (provider === 'gemini') {
    const { GeminiAdapter } = await import('./geminiAdapter')
    return { adapter: new GeminiAdapter(apiKey, model), status: 'ok' }
  }
  return { adapter: new SimulatedAdapter(), status: 'fallback', detail: `unknown provider: ${provider}` }
}
