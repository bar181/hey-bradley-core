/**
 * P126 F2b — Lightweight LLM call-health store.
 *
 * Tracks the *outcome of the most recent live LLM call* (not BYOK connection
 * state — that lives in intelligenceStore.status). Surfaced in the footer
 * StatusBar dot:
 *   - 'idle'  → gray  (no call attempted this session)
 *   - 'ok'    → green (last call returned 200)
 *   - 'error' → red   (last call threw / non-2xx)
 *
 * Resets on reload by design — no kv persistence. Downstream LLM client
 * code (Gemini / Anthropic / OpenAI adapter completions) will call
 * `setLLMHealth('ok' | 'error')` after each request in a follow-up patch.
 */

import { create } from 'zustand'

export type LLMHealthStatus = 'idle' | 'ok' | 'error'

interface LLMHealthState {
  status: LLMHealthStatus
  lastCheckedAt: number | null
  setLLMHealth: (status: LLMHealthStatus) => void
}

export const useLLMHealthStore = create<LLMHealthState>((set) => ({
  status: 'idle',
  lastCheckedAt: null,
  setLLMHealth: (status) => set({ status, lastCheckedAt: Date.now() }),
}))
