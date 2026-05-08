/**
 * P28 C04 — ListenTab helpers extracted into sibling module to reduce
 * the main ListenTab.tsx LOC. Constants + types + mapListenError live here
 * so the orchestrator file shrinks below the 500-LOC soft cap (CLAUDE.md).
 */
import type { ListenError } from '@/store/listenStore'

export const PTT_HOLD_GATE_MS = 250
export const PTT_AUTO_STOP_MS = 12_000

export const PRIVACY_ACK_KEY = 'hb-listen-privacy-acknowledged'
export const PRIVACY_TITLE =
  'Audio is sent to your browser vendor (Google/Apple) for transcription. Hey Bradley never sees the audio.'

export interface DemoSequenceConfig {
  id: string
  label: string
  exampleSlug: string
  exampleName: string
  swatchColors: string[]
  captions: { text: string; delay: number }[]
}

export const DEFAULTS = {
  pulseSpeed: 3, // seconds (3000ms)
  blurAmount: 23,
  glowOpacity: 52,
  coreOpacity: 85,
  coreBlur: 13,
  maxSize: 250,
}

export function mapListenError(err: ListenError): string {
  switch (err.kind) {
    case 'permission_denied':
      return "Microphone permission denied. Click the mic button in your browser's address bar to allow."
    case 'audio_capture':
      return "Couldn't access your microphone. Check your audio device."
    case 'no_speech':
      return "I didn't hear anything. Try again."
    case 'network':
      return "Couldn't reach the speech-recognition service. Check your internet connection."
    case 'aborted':
      return 'Voice input was interrupted. Try again.'
    case 'unknown':
      return err.detail || 'Voice input failed. Please try again.'
    default:
      return err.detail || 'Voice input failed.'
  }
}
