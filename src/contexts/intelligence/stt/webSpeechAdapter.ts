// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §2 (pseudocode), §3.4
// Decision record: docs/adr/ADR-048-stt-web-speech-api.md
// Wraps window.SpeechRecognition / webkitSpeechRecognition into the STTAdapter
// contract. Browser type defs are spotty; minimal local interfaces below.

import type { STTAdapter, STTError } from './sttAdapter'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'

type SRAlt = { transcript: string }
type SRResult = { isFinal: boolean; 0: SRAlt; length: number }
type SRResultList = { length: number; [index: number]: SRResult }
type SREvent = { results: SRResultList }
type SRErrorEvent = { error: string; message?: string }
interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: SREvent) => void) | null
  onerror: ((e: SRErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

const ERROR_MAP: Record<string, STTError['kind']> = {
  'not-allowed': 'permission_denied',
  'service-not-allowed': 'permission_denied',
  'audio-capture': 'audio_capture',
  'network': 'network',
  'aborted': 'aborted',
  'no-speech': 'no_speech',
}

export class WebSpeechAdapter implements STTAdapter {
  public readonly supported: boolean
  private rec: SpeechRecognitionLike | null = null
  private finalText = ''
  private interimText = ''
  private recording = false
  private interimSubs = new Set<(text: string) => void>()
  private errorSubs = new Set<(e: STTError) => void>()
  private endResolvers: Array<(text: string) => void> = []
  // FIX 5: track the 800 ms grace timeout from stop() so consecutive
  // recordings don't accumulate stale timers (and so a fresh start can wipe
  // a pending settle from the previous session). DOM lib types
  // window.setTimeout as `number`; align the field type with that.
  private graceTimerRef: number | null = null

  constructor() {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor
      webkitSpeechRecognition?: SpeechRecognitionCtor
    }
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition
    this.supported = Boolean(Ctor)
    if (Ctor) this.rec = this.createRecognition(Ctor)
  }

  private createRecognition(Ctor: SpeechRecognitionCtor): SpeechRecognitionLike {
    const rec = new Ctor()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      let interim = ''
      let final = ''
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        const t = r[0]?.transcript ?? ''
        if (r.isFinal) final += t
        else interim += t
      }
      if (final) this.finalText += final
      this.interimText = interim
      this.interimSubs.forEach((cb) => cb(interim))
    }
    rec.onerror = (e) => {
      // FIX 7: redact API-key-shaped substrings from any SR error message
      // before it bleeds into the listen store / audit trail.
      const safeDetail = e.message ? redactKeyShapes(e.message) : e.message
      const err: STTError = { kind: ERROR_MAP[e.error] ?? 'unknown', detail: safeDetail }
      this.errorSubs.forEach((cb) => cb(err))
    }
    rec.onend = () => {
      this.recording = false
      const text = this.finalText.trim()
      const resolvers = this.endResolvers
      this.endResolvers = []
      resolvers.forEach((r) => r(text))
    }
    return rec
  }

  start(): void {
    // FIX 5: reset transcript state UNCONDITIONALLY before the recording-guard
    // check. Race scenario: SR may emit `onend` naturally before user release,
    // flipping `recording` to false; a subsequent stop() then short-circuits
    // and a fast re-press would otherwise inherit the previous session's
    // `finalText`. Resetting here guarantees a fresh hold-talk-release. We
    // also broadcast the empty interim so any UI bound to onInterim sees the
    // wipe (this also reads `interimText` so TS is satisfied).
    this.finalText = ''
    this.interimText = ''
    this.interimSubs.forEach((cb) => cb(this.interimText))
    if (!this.rec || this.recording) return
    this.recording = true
    try {
      this.rec.start()
    } catch {
      this.recording = false
    }
  }

  stop(): Promise<string> {
    // FIX 5: clear any in-flight grace timer from a prior stop() so timeouts
    // do not accumulate per recording across rapid hold/release cycles.
    if (this.graceTimerRef !== null) {
      clearTimeout(this.graceTimerRef)
      this.graceTimerRef = null
    }
    if (!this.rec) return Promise.resolve('')
    if (!this.recording) return Promise.resolve(this.finalText.trim())
    return new Promise<string>((resolve) => {
      let settled = false
      const settle = (text: string) => {
        if (settled) return
        settled = true
        if (this.graceTimerRef !== null) {
          clearTimeout(this.graceTimerRef)
          this.graceTimerRef = null
        }
        resolve(text)
      }
      this.endResolvers.push(settle)
      try {
        this.rec?.stop()
      } catch {
        settle(this.finalText.trim())
        return
      }
      this.graceTimerRef = window.setTimeout(() => settle(this.finalText.trim()), 800)
    })
  }

  onInterim(cb: (text: string) => void): () => void {
    this.interimSubs.add(cb)
    return () => this.interimSubs.delete(cb)
  }

  onError(cb: (e: STTError) => void): () => void {
    this.errorSubs.add(cb)
    return () => this.errorSubs.delete(cb)
  }
}
