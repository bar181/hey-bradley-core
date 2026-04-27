// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.4
//       plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 2 (Task 9)
//       plans/implementation/phase-18b/wave-1.md (mock provider + agent-proxy)
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
//                  docs/adr/ADR-046-multi-provider-llm-architecture.md
// Boot-time provider selection. Reads VITE_LLM_* env, falls back to simulated
// when no key is present. ClaudeAdapter and GeminiAdapter are dynamically
// imported so the simulated-only path does not pull SDKs into the bundle.

import type { LLMAdapter, LLMProviderName } from './adapter'
import { SimulatedAdapter } from './simulatedAdapter'
import { FixtureAdapter, type FixtureEntry } from './fixtureAdapter'
import { AgentProxyAdapter } from './agentProxyAdapter'
import { STEP1_FIXTURES } from '@/data/llm-fixtures/step-1'
import { STEP2_FIXTURES } from '@/data/llm-fixtures/step-2'

export interface PickResult {
  adapter: LLMAdapter
  status: 'ok' | 'no_key' | 'fallback'
  detail?: string
}

/** Merge all fixture libraries the dev path can serve. Step 4 swaps to live. */
const ALL_FIXTURES: FixtureEntry[] = [...STEP1_FIXTURES, ...STEP2_FIXTURES]

/** Probe the persistence singleton without throwing. Phase 18b uses this to
 *  prefer the DB-backed AgentProxyAdapter over the static FixtureAdapter when
 *  a usable DB is wired up; very-early-init paths still get FixtureAdapter. */
async function dbReady(): Promise<boolean> {
  try {
    const { getDB } = await import('@/contexts/persistence/db')
    getDB()
    return true
  } catch {
    return false
  }
}

export async function pickAdapter(args?: {
  provider?: string
  apiKey?: string
  model?: string
}): Promise<PickResult> {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {}
  const rawProvider = (args?.provider ?? env.VITE_LLM_PROVIDER ?? 'simulated').toLowerCase()
  const apiKey = args?.apiKey ?? env.VITE_LLM_API_KEY ?? ''
  const model = args?.model ?? env.VITE_LLM_MODEL

  // Phase 18b: explicit `mock` selection always returns the DB-backed proxy,
  // regardless of any present API key. No network, no fixture-file fallback.
  if (rawProvider === 'mock') {
    return { adapter: new AgentProxyAdapter(), status: 'ok' }
  }

  const provider = rawProvider as LLMProviderName

  if (provider === 'simulated' || !apiKey) {
    // Phase 18b precedence in DEV:
    //   1. AgentProxyAdapter (DB-backed) — preferred when DB is initialised.
    //   2. FixtureAdapter   (static TS fixtures) — fallback when DB not ready.
    //   3. SimulatedAdapter (canned passthrough) — production builds only.
    let adapter: LLMAdapter
    if (import.meta.env.DEV) {
      adapter = (await dbReady())
        ? new AgentProxyAdapter()
        : new FixtureAdapter(ALL_FIXTURES)
    } else {
      adapter = new SimulatedAdapter()
    }
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
  if (provider === 'openrouter') {
    const { OpenRouterAdapter } = await import('./openrouterAdapter')
    return { adapter: new OpenRouterAdapter(apiKey, model), status: 'ok' }
  }
  return { adapter: new SimulatedAdapter(), status: 'fallback', detail: `unknown provider: ${provider}` }
}
