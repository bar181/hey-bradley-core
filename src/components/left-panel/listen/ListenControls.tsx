/**
 * P37 Wave 1 (R2 S3) — ListenControls.
 *
 * PTT button + privacy disclosure + recording indicator. Extracted from
 * ListenTab to keep every file under the CLAUDE.md 500-LOC hard cap.
 *
 * Pure presentational: receives state + handlers from useListenPipeline.
 * All P19 + P36 testids preserved (listen-ptt, listen-privacy-summary,
 * listen-privacy-toggle, listen-privacy-details, listen-recording-indicator,
 * listen-unsupported-banner).
 */
import { Mic } from 'lucide-react'
import { PRIVACY_TITLE } from './listenHelpers'
import type {
  ListenPipelineHandlers,
  ListenPipelineState,
} from './useListenPipeline'

export interface ListenControlsProps {
  state: Pick<
    ListenPipelineState,
    | 'pttSupported'
    | 'pttRecording'
    | 'pttBusy'
    | 'pttReview'
    | 'pttClarification'
    | 'pttPrivacyOpen'
  >
  handlers: Pick<
    ListenPipelineHandlers,
    'handlePttPressStart' | 'handlePttPressEnd' | 'setPttPrivacyOpen'
  >
}

export function ListenControls({ state, handlers }: ListenControlsProps) {
  const {
    pttSupported,
    pttRecording,
    pttBusy,
    pttReview,
    pttClarification,
    pttPrivacyOpen,
  } = state
  const { handlePttPressStart, handlePttPressEnd, setPttPrivacyOpen } = handlers

  if (!pttSupported) {
    return (
      <div
        data-testid="listen-unsupported-banner"
        className="w-full max-w-[300px] rounded-md bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60"
      >
        Voice input not supported in this browser. The canned demo below still works.
      </div>
    )
  }

  return (
    <>
      <p
        data-testid="listen-privacy-summary"
        className="text-xs text-white/55 w-full max-w-[300px] text-center leading-relaxed"
      >
        Your voice goes to your browser&apos;s STT service (Apple/Google).
        Audio is not stored. Transcripts are stored locally and included
        in exports.{' '}
        <a
          href="#"
          data-testid="listen-privacy-toggle"
          onClick={(e) => {
            e.preventDefault()
            setPttPrivacyOpen((prev) => !prev)
          }}
          className="underline underline-offset-2 hover:text-white"
        >
          {pttPrivacyOpen ? 'Less' : 'More'}
        </a>
      </p>
      <button
        type="button"
        data-testid="listen-ptt"
        data-mobile-ptt={pttRecording ? 'active' : undefined}
        title={PRIVACY_TITLE}
        onMouseDown={handlePttPressStart}
        onMouseUp={handlePttPressEnd}
        onMouseLeave={handlePttPressEnd}
        onTouchStart={handlePttPressStart}
        onTouchEnd={handlePttPressEnd}
        aria-pressed={pttRecording}
        aria-label={
          pttRecording
            ? 'Listening'
            : pttReview
              ? 'Resolve review first'
              : 'Hold to talk'
        }
        disabled={pttBusy || pttReview !== null || pttClarification !== null}
        // P53 A11 — Mobile polish: larger tappable target (max-md:w-24/h-24
        // centered), touch-none to prevent scroll-jacking on press-and-hold,
        // active:scale + tinted bg for haptic-feel feedback.
        className={`w-full max-w-[300px] max-md:mx-auto max-md:w-24 max-md:h-24 max-md:rounded-full max-md:max-w-none flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase border transition-all select-none touch-none active:scale-95 active:bg-hb-accent/20 ${
          pttBusy || pttReview || pttClarification
            ? 'bg-white/5 text-white/40 border-white/10 opacity-60 cursor-not-allowed'
            : pttRecording
              ? 'bg-hb-accent text-white scale-95 border-hb-accent'
              : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
        }`}
      >
        <Mic size={16} />
        {pttBusy
          ? 'Sending…'
          : pttRecording
            ? 'Listening…'
            : pttReview
              ? 'Review first ↑'
              : pttClarification
                ? 'Clarify ↑'
                : 'Hold to talk'}
      </button>
      {pttPrivacyOpen && (
        <div
          data-testid="listen-privacy-details"
          className="w-full max-w-[300px] rounded-md bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/70 leading-relaxed"
        >
          Audio is sent to your browser vendor (Google/Apple) for
          transcription. Hey Bradley only receives the resulting text —
          never the audio. Audio is not stored. The final transcript IS
          stored locally and is included in `.heybradley` exports. Stop
          holding the button to end recording.
        </div>
      )}
      {pttRecording && (
        <div
          data-testid="listen-recording-indicator"
          className="text-[10px] uppercase tracking-wider text-hb-accent"
        >
          Recording…
        </div>
      )}
      {/* P38 Sprint F end-of-sprint R1 F1 fix-pass — voice command discovery hint.
          Surfaces only when the user is idle (not recording, not busy, no
          review/clarification cards). Lists the highest-leverage voice
          phrasings so users discover commands without reading docs. */}
      {!pttRecording && !pttBusy && !pttReview && !pttClarification && (
        <div
          data-testid="listen-command-hint"
          className="w-full max-w-[300px] text-[10px] text-white/55 leading-relaxed text-center"
        >
          voice tips: say <span className="text-white/75">"browse templates"</span> or <span className="text-white/75">"use template bakery"</span>
        </div>
      )}
    </>
  )
}
