/**
 * P37 Wave 1 (R2 S3) — useListenPipeline.
 *
 * Custom hook owning the entire push-to-talk + chat-pipeline lifecycle that
 * previously lived inline in ListenTab.tsx. Splits 947 LOC into a 4-file
 * structure (hook + 2 sub-components + thin orchestrator) so every file
 * stays under the CLAUDE.md 500-LOC hard cap.
 *
 * Contract:
 *   const { state, handlers } = useListenPipeline()
 *
 * No behaviour change vs. P36 — same review-card → approve → pipeline flow,
 * same clarification handling, same P37 (A1) command-trigger short-circuits,
 * same unmount cleanup. Only difference: persist boundary now applies
 * `redactKeyShapes` (R2 S2) symmetric with assumptionStore.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useListenStore } from '@/store/listenStore'
import { useProjectStore } from '@/store/projectStore'
import { submit as submitChatPipeline } from '@/contexts/intelligence/chatPipeline'
import { appendListenTranscript } from '@/contexts/persistence/repositories/messages'
import { activeSession, startSession } from '@/contexts/persistence/repositories/sessions'
import { dispatchCommand } from '@/contexts/intelligence/commands/dispatchCommand'
import {
  generateAssumptionsLLM,
  shouldRequestAssumptions,
  recordAcceptedAssumption,
  parseCommand,
  type Assumption,
} from '@/contexts/intelligence/aisp'
// R2 S2 — listen-write redaction symmetry: BYOK leak guard at persist boundary.
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'
import { buildActionPreview } from './listenActionPreview'
import { PTT_HOLD_GATE_MS, PTT_AUTO_STOP_MS, PRIVACY_ACK_KEY } from './listenHelpers'

export interface ListenAispChip {
  verb: string
  target: string | null
  templateId: string | null
}

export interface ListenReviewState {
  transcript: string
  preview: string
  confidence: number
}

export interface ListenClarificationState {
  transcript: string
  assumptions: Assumption[]
}

export interface ListenPipelineState {
  // Web-Speech derived
  pttSupported: boolean
  pttRecording: boolean
  pttInterim: string
  pttFinal: string
  pttError: ReturnType<typeof useListenStore.getState>['error']
  pttTranscript: string
  // Pipeline-driven
  pttReply: string
  pttBusy: boolean
  pttAisp: ListenAispChip | null
  pttReview: ListenReviewState | null
  pttClarification: ListenClarificationState | null
  pttHint: string
  pttPrivacyOpen: boolean
}

export interface ListenPipelineHandlers {
  handlePttPressStart: () => void
  handlePttPressEnd: () => void
  handleListenApprove: () => Promise<void>
  handleListenEdit: () => void
  handleListenCancel: () => void
  handleListenClarificationAccept: (a: Assumption) => Promise<void>
  setPttPrivacyOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  dismissError: () => void
  dismissClarification: () => void
}

export interface UseListenPipelineReturn {
  state: ListenPipelineState
  handlers: ListenPipelineHandlers
}

export function useListenPipeline(): UseListenPipelineReturn {
  const pttSupported = useListenStore((s) => s.supported)
  const pttRecording = useListenStore((s) => s.recording)
  const pttInterim = useListenStore((s) => s.interim)
  const pttFinal = useListenStore((s) => s.final)
  const pttError = useListenStore((s) => s.error)

  const pttMouseDownAtRef = useRef<number | null>(null)
  const pttHoldGateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pttAutoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pttNoSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pttHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pttRecordingRef = useRef(false)
  pttRecordingRef.current = pttRecording

  const [pttReply, setPttReply] = useState<string>('')
  const [pttBusy, setPttBusy] = useState<boolean>(false)
  const [pttAisp, setPttAisp] = useState<ListenAispChip | null>(null)
  const [pttReview, setPttReview] = useState<ListenReviewState | null>(null)
  const [pttClarification, setPttClarification] = useState<ListenClarificationState | null>(null)
  const [pttHint, setPttHint] = useState<string>('')
  const [pttPrivacyOpen, setPttPrivacyOpen] = useState<boolean>(false)

  const clearPttTimers = useCallback(() => {
    if (pttHoldGateTimerRef.current) {
      clearTimeout(pttHoldGateTimerRef.current)
      pttHoldGateTimerRef.current = null
    }
    if (pttAutoStopTimerRef.current) {
      clearTimeout(pttAutoStopTimerRef.current)
      pttAutoStopTimerRef.current = null
    }
  }, [])

  /**
   * P36 (A1) — Run the chat pipeline on the approved voice transcript.
   * Captures result.aisp + templateId + assumptions for the listen banner.
   * Surfaces a voice clarification card when the intent confidence is low.
   */
  const runListenPipeline = useCallback(async (text: string): Promise<void> => {
    setPttBusy(true)
    try {
      const result = await submitChatPipeline({ source: 'listen', text })
      setPttAisp(
        result.aisp?.intent
          ? {
              verb: result.aisp.intent.verb,
              target: result.aisp.intent.target
                ? `${result.aisp.intent.target.type}${result.aisp.intent.target.index !== null ? `-${result.aisp.intent.target.index}` : ''}`
                : null,
              templateId: result.templateId ?? null,
            }
          : null,
      )
      if (
        !result.ok &&
        !result.appliedPatchCount &&
        result.aisp &&
        shouldRequestAssumptions(result.aisp.intent)
      ) {
        const llm = await generateAssumptionsLLM({ text, intent: result.aisp.intent })
        if (llm.assumptions.length > 0) {
          setPttClarification({ transcript: text, assumptions: llm.assumptions })
          setPttReply('')
          return
        }
      }
      setPttReply(result.summary || '')
      // Persist ONLY successful turns. R2 S2: apply redactKeyShapes at the
      // listen-write boundary BEFORE persistence so leaked BYOK fragments
      // never reach listen_transcripts (symmetric with assumptionStore).
      if (result.ok) {
        try {
          const projectId = useProjectStore.getState().activeProject
          if (projectId) {
            const sess = activeSession(projectId) ?? startSession(projectId)
            appendListenTranscript({ session_id: sess.id, text: redactKeyShapes(text) })
          }
        } catch (e) {
          if (import.meta.env.DEV) console.warn('[listen] persist transcript failed', e)
        }
      }
    } finally {
      setPttBusy(false)
    }
  }, [])

  /**
   * P36 (A2) — Build the pre-pipeline review card for the final transcript.
   * Empty input → no_speech banner. Non-empty → review state populated; the
   * chat pipeline is NOT called yet. Approve fires `runListenPipeline`.
   */
  const submitListenFinal = useCallback(async (final: string): Promise<void> => {
    const text = final.trim()
    if (!text) {
      useListenStore.setState({ error: { kind: 'no_speech', detail: undefined } })
      if (pttNoSpeechTimerRef.current) clearTimeout(pttNoSpeechTimerRef.current)
      pttNoSpeechTimerRef.current = setTimeout(() => {
        useListenStore.getState().clearError()
      }, 3000)
      return
    }
    setPttReply('')
    setPttAisp(null)
    setPttClarification(null)
    // P37 Sprint F P2 (A1) — Command-trigger gate runs BEFORE the review
    // card. High-confidence slash/voice phrases bypass review. ADR-066.
    // P38 Sprint F end-of-sprint R4 F1 fix-pass — switch consolidated into
    // shared dispatchCommand so chat + voice never drift again. R2 F2 fix:
    // template-help now handled on voice (was unhandled silent dead-end).
    const cmd = parseCommand(text)
    if (cmd) {
      const directive = dispatchCommand(cmd)
      if (directive.kind !== 'fallthrough') {
        useListenStore.getState().resetTranscript()
        switch (directive.kind) {
          case 'open-browse-picker': {
            useUIStore.getState().setPendingChatPrefill('/browse')
            useUIStore.getState().setLeftPanelTab('chat')
            return
          }
          case 'prefill-and-focus': {
            useUIStore.getState().setPendingChatPrefill(directive.text)
            useUIStore.getState().setLeftPanelTab('chat')
            return
          }
          case 'help-reply': {
            // R2 F2 fix: voice users typing /template (no name) now hand off
            // the help reply to chat surface where it can render in the
            // typewriter. Same UX path as text-mode.
            useUIStore.getState().setPendingChatPrefill('/template')
            useUIStore.getState().setLeftPanelTab('chat')
            return
          }
        }
      }
      // 'fallthrough' (hide/show passthroughs) — let review card render.
    }
    const preview = buildActionPreview(text)
    setPttReview({
      transcript: text,
      preview: preview.text,
      confidence: preview.intent.confidence,
    })
  }, [])

  /**
   * P36 (A2) — Approve handler. `approveInFlightRef` guards against
   * double-clicks before pttBusy commits (standard React state-flip race).
   */
  const approveInFlightRef = useRef(false)
  const handleListenApprove = useCallback(async () => {
    if (!pttReview || approveInFlightRef.current) return
    approveInFlightRef.current = true
    try {
      const { transcript } = pttReview
      setPttReview(null)
      await runListenPipeline(transcript)
    } finally {
      approveInFlightRef.current = false
    }
  }, [pttReview, runListenPipeline])

  const handleListenEdit = useCallback(() => {
    if (!pttReview) return
    const { transcript } = pttReview
    setPttReview(null)
    useUIStore.getState().setPendingChatPrefill(transcript)
    useUIStore.getState().setLeftPanelTab('chat')
  }, [pttReview])

  const handleListenCancel = useCallback(() => {
    setPttReview(null)
  }, [])

  const handleListenClarificationAccept = useCallback(
    async (a: Assumption) => {
      if (!pttClarification) return
      const { transcript } = pttClarification
      try {
        recordAcceptedAssumption({
          originalText: transcript,
          acceptedRephrasing: a.rephrasing,
          confidence: a.confidence,
          acceptedAt: Date.now(),
        })
      } catch {
        /* persistence is best-effort */
      }
      setPttClarification(null)
      await runListenPipeline(a.rephrasing)
    },
    [pttClarification, runListenPipeline],
  )

  const handlePttPressStart = useCallback(() => {
    if (pttBusy) return
    if (!pttSupported) return
    try {
      if (typeof window !== 'undefined' && !window.localStorage.getItem(PRIVACY_ACK_KEY)) {
        setPttPrivacyOpen(true)
        window.localStorage.setItem(PRIVACY_ACK_KEY, '1')
      }
    } catch {
      /* localStorage may be unavailable; fall through silently. */
    }
    pttMouseDownAtRef.current = Date.now()
    clearPttTimers()
    pttHoldGateTimerRef.current = setTimeout(() => {
      setPttReply('')
      useListenStore.getState().startRecording()
      pttAutoStopTimerRef.current = setTimeout(() => {
        void useListenStore
          .getState()
          .stopRecording()
          .then(submitListenFinal)
          .catch((e) => {
            if (import.meta.env.DEV) console.warn('[listen] stopRecording chain failed', e)
          })
      }, PTT_AUTO_STOP_MS)
    }, PTT_HOLD_GATE_MS)
  }, [pttSupported, pttBusy, clearPttTimers, submitListenFinal])

  const handlePttPressEnd = useCallback(() => {
    if (!pttSupported) return
    const downAt = pttMouseDownAtRef.current
    pttMouseDownAtRef.current = null
    const heldFor = downAt ? Date.now() - downAt : 0
    if (heldFor < PTT_HOLD_GATE_MS) {
      if (pttHoldGateTimerRef.current) {
        clearTimeout(pttHoldGateTimerRef.current)
        pttHoldGateTimerRef.current = null
      }
      if (downAt) {
        setPttHint('Hold the button to talk.')
        if (pttHintTimerRef.current) clearTimeout(pttHintTimerRef.current)
        pttHintTimerRef.current = setTimeout(() => setPttHint(''), 2000)
      }
      return
    }
    clearPttTimers()
    if (pttRecordingRef.current) {
      void useListenStore
        .getState()
        .stopRecording()
        .then(submitListenFinal)
        .catch((e) => {
          if (import.meta.env.DEV) console.warn('[listen] stopRecording chain failed', e)
        })
    }
  }, [pttSupported, clearPttTimers, submitListenFinal])

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      clearPttTimers()
      if (pttNoSpeechTimerRef.current) {
        clearTimeout(pttNoSpeechTimerRef.current)
        pttNoSpeechTimerRef.current = null
      }
      if (pttHintTimerRef.current) {
        clearTimeout(pttHintTimerRef.current)
        pttHintTimerRef.current = null
      }
      if (useListenStore.getState().recording) {
        void useListenStore.getState().stopRecording()
      }
    }
  }, [clearPttTimers])

  const dismissError = useCallback(() => {
    useListenStore.getState().clearError()
  }, [])

  const dismissClarification = useCallback(() => {
    setPttClarification(null)
  }, [])

  const pttTranscript = pttFinal || pttInterim

  return {
    state: {
      pttSupported,
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
      pttPrivacyOpen,
    },
    handlers: {
      handlePttPressStart,
      handlePttPressEnd,
      handleListenApprove,
      handleListenEdit,
      handleListenCancel,
      handleListenClarificationAccept,
      setPttPrivacyOpen,
      dismissError,
      dismissClarification,
    },
  }
}
