// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §3.2
// Barrel for the STT adapter module.

export type { STTAdapter, STTError } from './sttAdapter'
export { WebSpeechAdapter } from './webSpeechAdapter'
export { NullSTTAdapter } from './nullSTTAdapter'
export { createSTTAdapter } from './factory'
