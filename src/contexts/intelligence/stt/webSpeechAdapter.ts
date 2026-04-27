// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §2 (pseudocode), §3.4
// Wraps window.SpeechRecognition / webkitSpeechRecognition into the STTAdapter
// contract. Browser type defs are spotty; minimal local interfaces below.

import type { STTAdapter, STTError } from './sttAdapter'

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
  private recording = false
  private interimSubs = new Set<(text: string) => void>()
  private errorSubs = new Set<(e: STTError) => void>()
  private endResolvers: Array<(text: string) => void> = []

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
      this.interimSubs.forEach((cb) => cb(interim))
    }
    rec.onerror = (e) => {
      const err: STTError = { kind: ERROR_MAP[e.error] ?? 'unknown', detail: e.message }
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
    if (!this.rec || this.recording) return
    this.finalText = ''
    this.recording = true
    try {
      this.rec.start()
    } catch {
      this.recording = false
    }
  }

  stop(): Promise<string> {
    if (!this.rec) return Promise.resolve('')
    if (!this.recording) return Promise.resolve(this.finalText.trim())
    return new Promise<string>((resolve) => {
      let settled = false
      const settle = (text: string) => {
        if (settled) return
        settled = true
        resolve(text)
      }
      this.endResolvers.push(settle)
      try {
        this.rec?.stop()
      } catch {
        settle(this.finalText.trim())
        return
      }
      window.setTimeout(() => settle(this.finalText.trim()), 800)
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
