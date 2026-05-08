// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §3.2
// Factory chooses WebSpeechAdapter when the browser supports the API,
// falling back to NullSTTAdapter otherwise.

import type { STTAdapter } from './sttAdapter'
import { WebSpeechAdapter } from './webSpeechAdapter'
import { NullSTTAdapter } from './nullSTTAdapter'

export function createSTTAdapter(): STTAdapter {
  if (typeof window === 'undefined') return new NullSTTAdapter()
  const w = window as unknown as {
    SpeechRecognition?: unknown
    webkitSpeechRecognition?: unknown
  }
  if (w.SpeechRecognition || w.webkitSpeechRecognition) {
    return new WebSpeechAdapter()
  }
  return new NullSTTAdapter()
}
