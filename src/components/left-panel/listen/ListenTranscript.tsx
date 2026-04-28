/**
 * P37 Wave 1 (R2 S3) — ListenTranscript.
 *
 * Renders all "below-the-button" voice surfaces — interim / final transcript,
 * error banner, busy banner, hint, AISP chip, review card, clarification
 * card, Bradley reply. Extracted from ListenTab to keep every file under
 * the CLAUDE.md 500-LOC hard cap.
 *
 * Pure presentational: state + handlers come from useListenPipeline.
 * All P19 + P36 testids preserved (listen-transcript, listen-error-banner,
 * listen-busy, listen-hint, listen-review-*, listen-clarification-*,
 * listen-reply, listen-aisp-chip).
 */
import { mapListenError } from './listenHelpers'
import { ListenReviewCard } from './ListenReviewCard'
import { ListenClarificationCard } from './ListenClarificationCard'
import type {
  ListenPipelineHandlers,
  ListenPipelineState,
} from './useListenPipeline'

export interface ListenTranscriptProps {
  state: Pick<
    ListenPipelineState,
    | 'pttRecording'
    | 'pttInterim'
    | 'pttFinal'
    | 'pttError'
    | 'pttTranscript'
    | 'pttReply'
    | 'pttBusy'
    | 'pttAisp'
    | 'pttReview'
    | 'pttClarification'
    | 'pttHint'
  >
  handlers: Pick<
    ListenPipelineHandlers,
    | 'handleListenApprove'
    | 'handleListenEdit'
    | 'handleListenCancel'
    | 'handleListenClarificationAccept'
    | 'dismissError'
    | 'dismissClarification'
  >
}

export function ListenTranscript({ state, handlers }: ListenTranscriptProps) {
  const {
    pttRecording,
    pttInterim,
    pttFinal,
    pttError,
    pttTranscript,
    pttReply,
    pttBusy,
    pttAisp,
    pttReview,
    pttClarification,
    pttHint,
  } = state
  const {
    handleListenApprove,
    handleListenEdit,
    handleListenCancel,
    handleListenClarificationAccept,
    dismissError,
    dismissClarification,
  } = handlers

  return (
    <>
      {pttTranscript && (
        <div
          data-testid="listen-transcript"
          className="w-full max-w-[300px] rounded-md bg-black/30 border border-white/10 px-3 py-2 text-sm text-white/85"
        >
          <p className="whitespace-pre-wrap break-words">
            {pttTranscript}
            {pttRecording && pttInterim && !pttFinal && (
              <span className="text-white/40"> …</span>
            )}
          </p>
        </div>
      )}

      {pttError && (
        <div
          data-testid="listen-error-banner"
          className="w-full max-w-[300px] rounded-md bg-red-500/10 border border-red-400/30 px-3 py-2 text-xs text-red-200 flex items-start justify-between gap-2"
          role="alert"
        >
          <span>{mapListenError(pttError)}</span>
          <button
            type="button"
            onClick={dismissError}
            className="shrink-0 text-red-100/70 hover:text-white underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {pttBusy && (
        <div
          data-testid="listen-busy"
          className="w-full max-w-[300px] rounded-md bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60"
        >
          Listening to Bradley…
        </div>
      )}

      {pttHint && !pttBusy && !pttRecording && (
        <div
          data-testid="listen-hint"
          className="w-full max-w-[300px] rounded-md bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60 italic"
        >
          {pttHint}
        </div>
      )}

      {/* P36 (A2) — Pre-pipeline review card. Gates pipeline on Approve. */}
      {pttReview && !pttBusy && !pttClarification && (
        <ListenReviewCard
          transcript={pttReview.transcript}
          actionPreview={pttReview.preview}
          confidence={pttReview.confidence}
          onApprove={() => {
            void handleListenApprove()
          }}
          onEdit={handleListenEdit}
          onCancel={handleListenCancel}
        />
      )}

      {/* P36 (A1) — Voice clarification (low-confidence intent). */}
      {pttClarification && !pttBusy && (
        <ListenClarificationCard
          originalTranscript={pttClarification.transcript}
          assumptions={pttClarification.assumptions}
          onAccept={(a) => {
            void handleListenClarificationAccept(a)
          }}
          onReject={dismissClarification}
        />
      )}

      {pttReply && !pttBusy && !pttReview && !pttClarification && (
        <div
          data-testid="listen-reply"
          className="w-full max-w-[300px] rounded-md bg-[#A51C30]/10 border border-[#A51C30]/30 px-3 py-2 text-sm text-white/85 space-y-1"
        >
          <div>{pttReply}</div>
          {pttAisp && (
            <div
              data-testid="listen-aisp-chip"
              className="flex items-center gap-1 text-[10px] text-white/55 uppercase tracking-wider"
            >
              <span>{pttAisp.verb}</span>
              {pttAisp.target && <span>· {pttAisp.target}</span>}
              {pttAisp.templateId && <span>· {pttAisp.templateId}</span>}
            </div>
          )}
        </div>
      )}
    </>
  )
}
