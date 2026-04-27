// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §3.4
// Fallback adapter for browsers without Web Speech support. Surfaces a single
// `unsupported` error to the UI so the banner + canned demo path can engage.

import type { STTAdapter, STTError } from './sttAdapter'

export class NullSTTAdapter implements STTAdapter {
  public readonly supported = false

  start(): void {
    /* no-op */
  }

  stop(): Promise<string> {
    return Promise.resolve('')
  }

  onInterim(_cb: (text: string) => void): () => void {
    return () => {}
  }

  onError(cb: (e: STTError) => void): () => void {
    // Notify once so the UI can render the unsupported banner.
    queueMicrotask(() => cb({ kind: 'unsupported' }))
    return () => {}
  }
}
