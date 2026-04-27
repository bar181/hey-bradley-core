// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.6
// Zustand store for LLM adapter lifecycle, BYOK state, and session usage.
// Mirrors uiStore/projectStore patterns; dynamic imports keep simulated path SDK-free.

import { create } from 'zustand'
import type { LLMAdapter, LLMError, LLMProviderName } from '@/contexts/intelligence/llm/adapter'

export type AdapterStatus = 'idle' | 'no_key' | 'connected' | 'error'

interface IntelligenceState {
  adapter: LLMAdapter | null
  provider: LLMProviderName
  modelId: string | null
  status: AdapterStatus
  lastError: LLMError | null
  sessionUsd: number
  sessionTokens: { in: number; out: number }
  hasKey: boolean
  rememberKey: boolean

  init: () => Promise<void>
  testConnection: () => Promise<boolean>
  setProviderAndKey: (provider: LLMProviderName, apiKey: string, opts: { remember: boolean }) => Promise<void>
  clearKey: () => void
  recordUsage: (tokensIn: number, tokensOut: number, cost_usd: number) => void
  resetSession: () => void
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  adapter: null,
  provider: 'simulated',
  modelId: null,
  status: 'idle',
  lastError: null,
  sessionUsd: 0,
  sessionTokens: { in: 0, out: 0 },
  hasKey: false,
  rememberKey: false,

  init: async () => {
    const { pickAdapter } = await import('@/contexts/intelligence/llm/pickAdapter')
    const { readBYOK, hasBYOK } = await import('@/contexts/intelligence/llm/keys')
    const stored = readBYOK()
    const args = stored ? { provider: stored.provider, apiKey: stored.key } : undefined
    const result = await pickAdapter(args)
    set({
      adapter: result.adapter,
      provider: result.adapter.name(),
      modelId: result.adapter.model(),
      status: result.status === 'no_key' ? 'no_key' : 'connected',
      hasKey: hasBYOK(),
      rememberKey: Boolean(stored),
    })
  },

  testConnection: async () => {
    const adapter = get().adapter
    if (!adapter) return false
    const ok = await adapter.testConnection()
    set({ status: ok ? 'connected' : 'error' })
    return ok
  },

  setProviderAndKey: async (provider, apiKey, opts) => {
    const { pickAdapter } = await import('@/contexts/intelligence/llm/pickAdapter')
    const { writeBYOK } = await import('@/contexts/intelligence/llm/keys')
    writeBYOK({ key: apiKey, provider }, opts)
    const result = await pickAdapter({ provider, apiKey })
    set({
      adapter: result.adapter,
      provider: result.adapter.name(),
      modelId: result.adapter.model(),
      status: result.status === 'no_key' ? 'no_key' : 'connected',
      hasKey: Boolean(apiKey),
      rememberKey: opts.remember,
    })
  },

  clearKey: () => {
    void import('@/contexts/intelligence/llm/keys').then(({ clearBYOK }) => {
      clearBYOK()
      set({ hasKey: false, rememberKey: false, status: 'no_key' })
      void get().init()
    })
  },

  recordUsage: (tokensIn, tokensOut, cost_usd) => {
    set((s) => ({
      sessionUsd: s.sessionUsd + cost_usd,
      sessionTokens: { in: s.sessionTokens.in + tokensIn, out: s.sessionTokens.out + tokensOut },
    }))
  },

  resetSession: () => set({ sessionUsd: 0, sessionTokens: { in: 0, out: 0 } }),
}))

// Dev-only window exposure mirrors __configStore / __projectStore patterns
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as unknown as { __intelligenceStore?: typeof useIntelligenceStore }).__intelligenceStore = useIntelligenceStore
}
