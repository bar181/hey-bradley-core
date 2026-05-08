// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §3.4
// Decision record: docs/adr/ADR-048-stt-web-speech.md (authored Step 3)
// Strategy: browser-native Web Speech API; push-to-talk; no Whisper for MVP.

export interface STTError {
  kind:
    | 'unsupported'
    | 'permission_denied'
    | 'audio_capture'
    | 'network'
    | 'aborted'
    | 'no_speech'
    | 'unknown'
  detail?: string
}

export interface STTAdapter {
  /** True if this browser supports the Web Speech API. */
  supported: boolean
  /** Begin recording. Resolves immediately; transcripts arrive via callbacks. */
  start(): void
  /**
   * Stop recording. Resolves to the final transcript text once the recognizer
   * settles (within an 800 ms grace window) or empty string on abort.
   */
  stop(): Promise<string>
  /** Subscribe to interim transcripts. Returns unsubscribe. */
  onInterim(cb: (text: string) => void): () => void
  /** Subscribe to errors. Returns unsubscribe. */
  onError(cb: (e: STTError) => void): () => void
}
