// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §3.2, §3.4
// Decision record: docs/adr/ADR-048-stt-web-speech-api.md
// Zustand store wrapping the STT adapter. Step 1 only owns capture state;
// pipeline submission is wired in Step 2 (no chatPipeline import here).

import { create } from 'zustand'
import type { STTAdapter, STTError } from '@/contexts/intelligence/stt/sttAdapter'
import { createSTTAdapter } from '@/contexts/intelligence/stt/factory'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'

// Backwards-compatible alias kept so the Step 1 PTT UI in ListenTab.tsx
// (which imports `ListenError` from this module) continues to compile.
export type ListenError = STTError
export type ListenErrorKind = STTError['kind']

export interface ListenState {
  supported: boolean
  recording: boolean
  interim: string
  final: string
  error: STTError | null

  init: () => void
  startRecording: () => void
  stopRecording: () => Promise<string>
  resetTranscript: () => void
  clearError: () => void
}

// Adapter + unsubscribe handles live in module scope (closure) rather than
// in store state — they are not serializable and should not trigger renders.
let adapter: STTAdapter | null = null
let unsubInterim: (() => void) | null = null
let unsubError: (() => void) | null = null

export const useListenStore = create<ListenState>((set) => ({
  supported: false,
  recording: false,
  interim: '',
  final: '',
  error: null,

  init: () => {
    if (adapter) return
    adapter = createSTTAdapter()
    unsubInterim = adapter.onInterim((text) => {
      set({ interim: text })
    })
    unsubError = adapter.onError((e) => {
      // FIX 7: redact API-key-shaped substrings from STT detail before it
      // lands in the store / audit channel (mirrors auditedComplete pattern).
      set({
        error: { kind: e.kind, detail: redactKeyShapes(e.detail || '') },
        recording: false,
      })
    })
    set({ supported: adapter.supported })
  },

  startRecording: () => {
    if (!adapter) return
    set({ interim: '', final: '', error: null, recording: true })
    adapter.start()
  },

  stopRecording: async () => {
    if (!adapter) {
      set({ recording: false })
      return ''
    }
    try {
      const text = await adapter.stop()
      set({ recording: false, final: text })
      return text
    } catch {
      set({ recording: false })
      return ''
    }
  },

  resetTranscript: () => set({ interim: '', final: '' }),

  clearError: () => set({ error: null }),
}))

// Dev-only window exposure mirrors __intelligenceStore pattern.
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as unknown as { __listenStore?: typeof useListenStore }).__listenStore = useListenStore
}

// Test/HMR helper: tear down adapter so init() can be re-run cleanly.
export function __resetListenAdapterForTests(): void {
  if (unsubInterim) unsubInterim()
  if (unsubError) unsubError()
  unsubInterim = null
  unsubError = null
  adapter = null
}
