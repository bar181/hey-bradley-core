// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.6
// Zustand store for LLM adapter lifecycle, BYOK state, and session usage.
// Mirrors uiStore/projectStore patterns; dynamic imports keep simulated path SDK-free.

import { create } from 'zustand'
import type { LLMAdapter, LLMError, LLMProviderName } from '@/contexts/intelligence/llm/adapter'
// FIX 7: keys.ts has no SDK dependencies and collapses into the main chunk
// anyway — static-import to silence Vite's INEFFECTIVE_DYNAMIC_IMPORT warning
// and reduce indirection. pickAdapter stays dynamic because it pulls in the
// Anthropic / Gemini SDKs which DO benefit from code-splitting.
import { readBYOK, writeBYOK, clearBYOK, hasBYOK } from '@/contexts/intelligence/llm/keys'
import { activeSession, endSession } from '@/contexts/persistence/repositories/sessions'
import { sumSessionCostUsd, sumSessionTokens } from '@/contexts/persistence/repositories/llmCalls'
import { useProjectStore } from '@/store/projectStore'

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
  /** P18 Step 3: re-entrancy guard so a second chat submit cannot race the first. */
  inFlight: boolean

  init: () => Promise<void>
  testConnection: () => Promise<boolean>
  setProviderAndKey: (provider: LLMProviderName, apiKey: string, opts: { remember: boolean }) => Promise<void>
  clearKey: () => void
  recordUsage: (tokensIn: number, tokensOut: number, cost_usd: number) => void
  resetSession: () => void
  /** Close the active project's session row + clear in-memory session counters. */
  endActiveSession: () => void
  /** Toggle the in-flight mutex around the chat pipeline. */
  setInFlight: (value: boolean) => void
}

// One-time wiring so we end the previous project's session when the active
// project changes. Initialised on first init() call (idempotent).
let projectSubscriptionInstalled = false

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
  inFlight: false,

  init: async () => {
    const { pickAdapter } = await import('@/contexts/intelligence/llm/pickAdapter')
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

    // FIX 5: Rehydrate sessionUsd/sessionTokens from the DB so the cap can't
    // be silently bypassed by a page reload mid-session.
    try {
      const activeProject = useProjectStore.getState().activeProject
      if (activeProject) {
        const sess = activeSession(activeProject)
        if (sess) {
          const tokens = sumSessionTokens(sess.id)
          set({
            sessionUsd: sumSessionCostUsd(sess.id),
            sessionTokens: tokens,
          })
        }
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[intelligence] session rehydrate skipped', e)
    }

    // FIX 4: subscribe ONCE so we end the previous session when the user
    // switches to a different project.
    if (!projectSubscriptionInstalled) {
      projectSubscriptionInstalled = true
      let prevProject = useProjectStore.getState().activeProject
      useProjectStore.subscribe((s) => {
        if (s.activeProject !== prevProject) {
          if (prevProject) {
            try {
              const sess = activeSession(prevProject)
              if (sess) endSession(sess.id)
            } catch (e) {
              if (import.meta.env.DEV) console.warn('[intelligence] endSession on switch failed', e)
            }
          }
          prevProject = s.activeProject
          // Reset in-memory counters; the new project's session will be
          // hydrated lazily on the next auditedComplete or init() call.
          set({ sessionUsd: 0, sessionTokens: { in: 0, out: 0 } })
        }
      })
    }
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
    // FIX 4: close the active session BEFORE swapping adapters so the audit
    // trail attributes calls to the right adapter context.
    get().endActiveSession()
    clearBYOK()
    set({ hasKey: false, rememberKey: false, status: 'no_key' })
    void get().init()
  },

  recordUsage: (tokensIn, tokensOut, cost_usd) => {
    set((s) => ({
      sessionUsd: s.sessionUsd + cost_usd,
      sessionTokens: { in: s.sessionTokens.in + tokensIn, out: s.sessionTokens.out + tokensOut },
    }))
  },

  resetSession: () => set({ sessionUsd: 0, sessionTokens: { in: 0, out: 0 } }),

  endActiveSession: () => {
    try {
      const activeProject = useProjectStore.getState().activeProject
      if (activeProject) {
        const sess = activeSession(activeProject)
        if (sess) endSession(sess.id)
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[intelligence] endActiveSession failed', e)
    }
    set({ sessionUsd: 0, sessionTokens: { in: 0, out: 0 } })
  },

  setInFlight: (value) => set({ inFlight: value }),
}))

// Dev-only window exposure mirrors __configStore / __projectStore patterns
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as unknown as { __intelligenceStore?: typeof useIntelligenceStore }).__intelligenceStore = useIntelligenceStore
}
