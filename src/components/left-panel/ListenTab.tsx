import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Settings, Mic, X } from 'lucide-react'
import { buildDemoFromCaptions, runDemo } from '@/lib/demoSimulator'
import { EXAMPLE_SITES } from '@/data/examples'
import listenSequences from '@/data/sequences/listen-sequences.json'
import { useUIStore } from '@/store/uiStore'
import { useListenStore } from '@/store/listenStore'
import { Button } from '@/components/ui/button'
import { submit as submitChatPipeline } from '@/contexts/intelligence/chatPipeline'
import { appendListenTranscript } from '@/contexts/persistence/repositories/messages'
import { activeSession, startSession } from '@/contexts/persistence/repositories/sessions'
import { useProjectStore } from '@/store/projectStore'
import {
  generateAssumptionsLLM,
  shouldRequestAssumptions,
  recordAcceptedAssumption,
  parseCommand,
  type Assumption,
} from '@/contexts/intelligence/aisp'
import { buildActionPreview } from './listen/listenActionPreview'
import { ListenReviewCard } from './listen/ListenReviewCard'
import { ListenClarificationCard } from './listen/ListenClarificationCard'
// P28 C04 — helpers + SliderRow extracted to siblings; ListenTab orchestrates
import {
  PTT_HOLD_GATE_MS,
  PTT_AUTO_STOP_MS,
  PRIVACY_ACK_KEY,
  PRIVACY_TITLE,
  DEFAULTS,
  mapListenError,
  type DemoSequenceConfig,
} from './listen/listenHelpers'
import { SliderRow } from './listen/SliderRow'

// PTT capture path lives ABOVE the canned demo.
// Constants + helpers + SliderRow live in ./listen/ siblings (P28 C04).

export function ListenTab() {
  const [pulseSpeed, setPulseSpeed] = useState(DEFAULTS.pulseSpeed)
  const [blurAmount, setBlurAmount] = useState(DEFAULTS.blurAmount)
  const [glowOpacity, setGlowOpacity] = useState(DEFAULTS.glowOpacity)
  const [coreOpacity, setCoreOpacity] = useState(DEFAULTS.coreOpacity)
  const [coreBlur, setCoreBlur] = useState(DEFAULTS.coreBlur)
  const [maxSize, setMaxSize] = useState(DEFAULTS.maxSize)
  const [showSettings, setShowSettings] = useState(false)
  const [randomMode, setRandomMode] = useState(true)
  const [burstActive, setBurstActive] = useState(false)
  const [burstRemaining, setBurstRemaining] = useState(0)
  const burstActiveRef = useRef(false)
  const burstTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const burstCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Simulate input state
  const [simActive, setSimActive] = useState(false)
  const simActiveRef = useRef(false)
  const [simPhase, setSimPhase] = useState<'idle' | 'user' | 'ai'>('idle')
  const [simText, setSimText] = useState('')
  const simTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const demoCleanupRef = useRef<(() => void) | null>(null)

  const [showDemoDialog, setShowDemoDialog] = useState(false)

  // P19 Fix-Pass 2 (F10): subscribe to the right-panel mode so we can hide the
  // demo sliders in DRAFT (SIMPLE). Grandma doesn't need orb-pulse tuning.
  const viewMode = useUIStore((s) => s.rightPanelTab)

  // PTT (push-to-talk) — Phase 19 Step 1 wiring (UI only; pipeline in Step 2).
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
  // P19 Step 2 (A4): Bradley reply banner + busy state for the listen surface.
  const [pttReply, setPttReply] = useState<string>('')
  const [pttBusy, setPttBusy] = useState<boolean>(false)
  // P36 Sprint F P1 (A1) — AISP feedback chip in the listen reply banner.
  const [pttAisp, setPttAisp] = useState<{ verb: string; target: string | null; templateId: string | null } | null>(null)
  // P36 Sprint F P1 (A2) — Pre-pipeline review state. When set, review card
  // renders and the chat pipeline is gated on Approve. Editing returns the
  // transcript to the chat input; Cancel discards.
  const [pttReview, setPttReview] = useState<{ transcript: string; preview: string; confidence: number } | null>(null)
  // P36 Sprint F P1 (A1) — Voice clarification card. Mirrors ChatInput
  // ClarificationPanel for the Listen surface.
  const [pttClarification, setPttClarification] = useState<{ transcript: string; assumptions: Assumption[] } | null>(null)
  // P19 Step 3 (A5): hold-too-short hint shown when user releases pre-gate.
  const [pttHint, setPttHint] = useState<string>('')
  // P19 fix: mic privacy disclosure. Default open on first PTT in this browser
  // (no localStorage flag yet); subsequently collapses unless user clicks the
  // toggle. KISS: one-line subtext + inline expandable block — no banner.
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
   * P19 Step 2 (A4): drive the same chat pipeline used by ChatInput from a
   * final voice transcript. Resilient to stop()/transcript races: bails when
   * the resolved transcript is empty, persists successful turns to
   * listen_transcripts (P16 schema), and surfaces Bradley's reply in a banner.
   *
   * NOTE on resetTranscript: we deliberately do NOT clear the transcript here.
   * The P19 Step 1 capture spec asserts the final transcript stays visible
   * after stop(), and clearing immediately after submit breaks that. Instead
   * the next press (handlePttPressStart) wipes any previous transcript so the
   * "next hold-talk-release starts fresh" invariant from §3.5 still holds.
   */
  /**
   * P36 (A1) — Run the chat pipeline on the approved voice transcript.
   * Captures result.aisp + templateId + assumptions for the listen banner.
   * Surfaces a voice clarification card when the intent confidence is low.
   */
  const runListenPipeline = useCallback(async (text: string): Promise<void> => {
    setPttBusy(true)
    try {
      const result = await submitChatPipeline({ source: 'listen', text })
      // P36 (A1) — AISP feedback chip
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
      // P36 (A1) — voice clarification when low confidence + no patches applied
      if (
        !result.ok &&
        !result.appliedPatchCount &&
        result.aisp &&
        shouldRequestAssumptions(result.aisp.intent)
      ) {
        const llm = await generateAssumptionsLLM({ text, intent: result.aisp.intent })
        if (llm.assumptions.length > 0) {
          setPttClarification({ transcript: text, assumptions: llm.assumptions })
          setPttReply('') // banner cleared; clarification takes over
          return
        }
      }
      setPttReply(result.summary || '')
      // Persist ONLY successful turns — fallback hint replies (no canned match)
      // would otherwise pollute listen_transcripts with the user's garbage. We
      // ensure a session exists (mirrors auditedComplete's helper) so writes
      // attribute to the correct session row.
      if (result.ok) {
        try {
          const projectId = useProjectStore.getState().activeProject
          if (projectId) {
            const sess = activeSession(projectId) ?? startSession(projectId)
            appendListenTranscript({ session_id: sess.id, text })
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
    // Reset prior banners so the review card is the only surface visible.
    setPttReply('')
    setPttAisp(null)
    setPttClarification(null)
    // P37 Sprint F P2 (A1) — Command-trigger gate runs BEFORE the review
    // card. High-confidence slash/voice phrases (browse templates, generate
    // content, design only, etc.) bypass review and dispatch directly so
    // the user doesn't have to Approve a deterministic command. ADR-066.
    const cmd = parseCommand(text)
    if (cmd) {
      // Clear the captured transcript so the next press starts fresh
      // (mirrors the Approve path in handleListenApprove).
      useListenStore.getState().resetTranscript()
      switch (cmd.kind) {
        case 'browse': {
          // Switch to chat tab and open the template picker via prefill.
          // ChatInput consumes pendingChatPrefill on mount; the empty-then-
          // /browse round-trip would re-trigger the picker but a simpler
          // path is to prefill "/browse" directly so the existing slash
          // handler on ChatInput.handleSend opens the picker after Enter.
          // Safer: prefill the canonical phrase the user can read + send.
          useUIStore.getState().setPendingChatPrefill('/browse')
          useUIStore.getState().setLeftPanelTab('chat')
          return
        }
        case 'apply-template': {
          useUIStore.getState().setPendingChatPrefill(
            `build me a ${cmd.target ?? ''}`.trim(),
          )
          useUIStore.getState().setLeftPanelTab('chat')
          return
        }
        case 'generate': {
          useUIStore.getState().setPendingChatPrefill(
            'generate content for this page',
          )
          useUIStore.getState().setLeftPanelTab('chat')
          return
        }
        case 'design': {
          useUIStore.getState().setPendingChatPrefill('design only: ')
          useUIStore.getState().setLeftPanelTab('chat')
          return
        }
        case 'content': {
          useUIStore.getState().setPendingChatPrefill('content only: ')
          useUIStore.getState().setLeftPanelTab('chat')
          return
        }
        case 'hide':
        case 'show': {
          // Voice rarely speaks the slash form; if the user did, fall
          // through to the standard review-card path so they can confirm.
          break
        }
      }
    }
    const preview = buildActionPreview(text)
    setPttReview({
      transcript: text,
      preview: preview.text,
      confidence: preview.intent.confidence,
    })
  }, [])

  /**
   * P36 (A2) — Approve handler: clear review state, run the pipeline.
   * Pre-empt fix-pass — `approveInFlightRef` guards against double-clicks
   * before pttBusy commits (standard React state-flip race).
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

  /** P36 (A2) — Edit handler: hand transcript off to the chat input + switch tabs. */
  const handleListenEdit = useCallback(() => {
    if (!pttReview) return
    const { transcript } = pttReview
    setPttReview(null)
    useUIStore.getState().setPendingChatPrefill(transcript)
    useUIStore.getState().setLeftPanelTab('chat')
  }, [pttReview])

  /** P36 (A2) — Cancel handler: discard review without firing. */
  const handleListenCancel = useCallback(() => {
    setPttReview(null)
  }, [])

  /** P36 (A1) — Voice clarification accept: persist + re-feed pipeline. */
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
    // FIX 3: hard guard against the race where `disabled` flips AFTER React
    // commits — a fast user could begin a press before pttBusy renders true.
    if (pttBusy) return
    if (!pttSupported) return
    // P19 fix (privacy): on first PTT press in this browser session, expand
    // the disclosure block so the user sees how voice is processed BEFORE
    // recording begins. Persist the ack so subsequent presses stay collapsed.
    try {
      if (typeof window !== 'undefined' && !window.localStorage.getItem(PRIVACY_ACK_KEY)) {
        setPttPrivacyOpen(true)
        window.localStorage.setItem(PRIVACY_ACK_KEY, '1')
      }
    } catch {
      /* localStorage may be unavailable (private mode); fall through silently. */
    }
    pttMouseDownAtRef.current = Date.now()
    clearPttTimers()
    // 250 ms hold gate — only start once the user holds past the threshold.
    pttHoldGateTimerRef.current = setTimeout(() => {
      // Wipe any previous transcript + reply so this hold-talk-release starts
      // fresh (P19 Step 2 §3.5). startRecording also clears interim/final, but
      // we explicitly drop the reply banner here so the user gets a clean UI.
      setPttReply('')
      useListenStore.getState().startRecording()
      // 12 s auto-stop safety net per phase plan §3.7.
      pttAutoStopTimerRef.current = setTimeout(() => {
        // P19 Fix-Pass 2 (F18): catch chain failures so a thrown stopRecording
        // doesn't unhandled-promise-reject the page.
        void useListenStore.getState().stopRecording().then(submitListenFinal).catch((e) => {
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
    // Tap shorter than hold gate → cancel without ever starting. P19 Step 3
    // (A5): instead of dropping silently, surface a 2 s tooltip so the user
    // learns the interaction. We only nudge if the user actually pressed
    // (downAt was set) — programmatic mouseLeave with no prior down is a no-op.
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
      // P19 Fix-Pass 2 (F18): catch chain failures so a thrown stopRecording
      // doesn't unhandled-promise-reject the page.
      void useListenStore.getState().stopRecording().then(submitListenFinal).catch((e) => {
        if (import.meta.env.DEV) console.warn('[listen] stopRecording chain failed', e)
      })
    }
  }, [pttSupported, clearPttTimers, submitListenFinal])

  // Cleanup PTT timers on unmount. P19 Step 3 (A5): also kill any in-flight
  // recognition session so navigating away doesn't leak a live mic capture
  // (browsers will keep the recognizer alive until GC otherwise).
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

  const pttTranscript = pttFinal || pttInterim

  // Demo sequences from JSON
  const demoSequences = listenSequences as DemoSequenceConfig[]

  // Helper to track burst timeouts
  const burstTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    burstTimersRef.current.push(id)
    return id
  }

  // Burst animation: 10s sequence
  const runBurstAnimation = useCallback(() => {
    if (burstActiveRef.current) return
    burstActiveRef.current = true
    setBurstActive(true)
    setBurstRemaining(10)
    setRandomMode(false)

    const countdownStart = Date.now()
    burstCountdownRef.current = setInterval(() => {
      const elapsed = (Date.now() - countdownStart) / 1000
      setBurstRemaining(Math.max(0, 10 - elapsed))
    }, 1000)

    // Phase 1: Speed up + high glow (0-4s)
    setPulseSpeed(2)
    setGlowOpacity(55)
    burstTimeout(() => setPulseSpeed(1), 1000)

    // Phase 2: Drop glow (4-7s)
    burstTimeout(() => setGlowOpacity(5), 4000)

    // Phase 3: Return to defaults (7-10s)
    burstTimeout(() => {
      setPulseSpeed(DEFAULTS.pulseSpeed)
      setGlowOpacity(DEFAULTS.glowOpacity)
    }, 7000)

    // End burst
    burstTimeout(() => {
      burstActiveRef.current = false
      setBurstActive(false)
      setBurstRemaining(0)
      setRandomMode(true)
      if (burstCountdownRef.current) clearInterval(burstCountdownRef.current)
    }, 10000)
  }, [])

  // Simulate Input: burst + typewriter user text then demo simulator
  const runSimulateInput = useCallback((demoConfig: DemoSequenceConfig) => {
    if (simActiveRef.current || burstActiveRef.current) return
    simActiveRef.current = true
    setSimActive(true)
    runBurstAnimation()

    // Find the matching example site
    const example = EXAMPLE_SITES.find(e =>
      e.name === demoConfig.exampleName,
    ) ?? EXAMPLE_SITES[0]
    const userText = 'build me a ' + example.name.toLowerCase()

    // Phase 1: Typewriter user text
    setSimPhase('user')
    setSimText('')
    let charIdx = 0
    const typeUser = () => {
      if (charIdx < userText.length) {
        setSimText(userText.slice(0, charIdx + 1))
        charIdx++
        const t = setTimeout(typeUser, 40)
        simTimersRef.current.push(t)
      } else {
        // User text stays 3 seconds then start demo simulator with custom captions
        const t = setTimeout(() => {
          const sequence = buildDemoFromCaptions(
            example.config,
            example.name,
            demoConfig.captions,
          )
          demoCleanupRef.current = runDemo(
            sequence,
            (caption) => {
              setSimPhase('ai')
              setSimText(caption)
            },
            () => {
              setSimPhase('idle')
              setSimText('')
              simActiveRef.current = false
              setSimActive(false)
              demoCleanupRef.current = null
              useUIStore.getState().setLeftPanelTab('builder')
              useUIStore.getState().setRightPanelVisible(true)
            },
          )
        }, 3000)
        simTimersRef.current.push(t)
      }
    }
    typeUser()
    // P19 Fix-Pass 2 (F16): the body reads `simActiveRef` / `burstActiveRef`
    // for the early-return guards, NOT the state values — so the deps array
    // intentionally only lists `runBurstAnimation`. Listing simActive / burstActive
    // here would re-create this callback on every state flip and queue stale closures.
    // uses refs intentionally; see P19 fix-pass
  }, [runBurstAnimation])

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      burstTimersRef.current.forEach(clearTimeout)
      if (burstCountdownRef.current) clearInterval(burstCountdownRef.current)
      simTimersRef.current.forEach(clearTimeout)
      if (demoCleanupRef.current) demoCleanupRef.current()
    }
  }, [])

  // Random drift
  const randomize = useCallback(() => {
    const rng = (base: number, variance: number, min: number, max: number) =>
      Math.min(max, Math.max(min, base + (Math.random() - 0.5) * 2 * variance))

    setPulseSpeed(Math.round(rng(DEFAULTS.pulseSpeed, 1.5, 0.5, 6) * 10) / 10)
    setBlurAmount(Math.round(rng(DEFAULTS.blurAmount, 15, 5, 60)))
    setGlowOpacity(Math.round(rng(DEFAULTS.glowOpacity, 20, 15, 60)))
  }, [])

  useEffect(() => {
    if (!randomMode) return
    randomize()
    const interval = setInterval(randomize, 10000)
    return () => clearInterval(interval)
  }, [randomMode, randomize])

  useEffect(() => {
    if (!randomMode) {
      setPulseSpeed(DEFAULTS.pulseSpeed)
      setBlurAmount(DEFAULTS.blurAmount)
      setGlowOpacity(DEFAULTS.glowOpacity)
    }
  }, [randomMode])

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--hb-bg,#1a1a1a)] overflow-hidden">
      {/* A) Orb area — top section */}
      <div className="flex-1 flex items-center justify-center p-6 relative min-h-0">
        {/* Layer 4: Outer halo */}
        <div
          className="absolute rounded-full"
          style={{
            width: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 1.2}px, 95%)`,
            height: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 1.2}px, 95%)`,
            background: `radial-gradient(circle, rgba(165, 28, 48, ${glowOpacity * 0.15 / 100}) 0%, transparent 60%)`,
            filter: `blur(${blurAmount * 1.5}px)`,
            animation: `orb-pulse ${pulseSpeed * 1.5}s ease-in-out infinite`,
          }}
        />
        {/* Layer 3: Ambient glow */}
        <div
          className="absolute rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: `min(${(burstActive ? maxSize * 1.2 : maxSize)}px, 90%)`,
            height: `min(${(burstActive ? maxSize * 1.2 : maxSize)}px, 90%)`,
            maxWidth: '90%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${glowOpacity / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
        {/* Layer 2: Mid glow */}
        <div
          className="absolute rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 0.58}px, 55%)`,
            height: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 0.58}px, 55%)`,
            maxWidth: '55%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${Math.min(glowOpacity * 2.5, 80) / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount * 0.5}px)`,
            animation: `orb-breathe ${pulseSpeed * 1.2}s ease-in-out infinite`,
            animationDelay: `${pulseSpeed * 0.1}s`,
          }}
        />
        {/* Layer 1: Core */}
        <div
          className="relative rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: Math.max((burstActive ? maxSize * 1.2 : maxSize) * 0.35, 50),
            height: Math.max((burstActive ? maxSize * 1.2 : maxSize) * 0.35, 50),
            background: `radial-gradient(circle, rgba(193, 40, 62, ${coreOpacity / 100}) 0%, rgba(165, 28, 48, ${coreOpacity * 0.6 / 100}) 50%, transparent 100%)`,
            boxShadow: `0 0 ${blurAmount * 0.75}px rgba(165, 28, 48, ${coreOpacity * 0.5 / 100}), 0 0 ${blurAmount * 1.5}px rgba(165, 28, 48, ${coreOpacity * 0.3 / 100})`,
            filter: `blur(${coreBlur}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* B) Caption area — middle, grows to fill */}
      <div className="min-h-[80px] px-4 flex items-center justify-center">
        {simPhase !== 'idle' ? (
          <div className={`w-full rounded-xl px-4 py-3 backdrop-blur-md ${
            simPhase === 'user'
              ? 'bg-white/10 border border-white/20'
              : 'bg-[#A51C30]/15 border border-[#A51C30]/30'
          }`}>
            <div className={`text-xs uppercase tracking-wider mb-1 ${
              simPhase === 'user' ? 'text-white/40' : 'text-[#C1283E]/60'
            }`}>
              {simPhase === 'user' ? 'You' : 'Hey Bradley'}
            </div>
            <p className={`text-lg lg:text-xl font-medium leading-relaxed ${
              simPhase === 'user' ? 'text-white' : 'text-[#C1283E]'
            }`}>
              {simText}
              <span className="inline-block w-0.5 h-5 ml-0.5 align-middle bg-current animate-pulse" />
            </p>
          </div>
        ) : (
          <p className="text-sm text-white/25 italic">Ready to listen...</p>
        )}
      </div>

      {/* B2) PTT (push-to-talk) — Phase 19 Step 1 (Agent A2). Above canned demos. */}
      <div className="px-4 pt-2 pb-1 flex flex-col items-center gap-2">
        {pttSupported ? (
          <>
            {/* P19 Fix-Pass 2 (F9): inline privacy disclosure ABOVE the PTT
                button, not gated behind first click. The one-line summary is
                always visible; the long form stays in a details-style
                expander so the user can read more without leaving the tab. */}
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
              title={PRIVACY_TITLE}
              onMouseDown={handlePttPressStart}
              onMouseUp={handlePttPressEnd}
              onMouseLeave={handlePttPressEnd}
              onTouchStart={handlePttPressStart}
              onTouchEnd={handlePttPressEnd}
              aria-pressed={pttRecording}
              aria-label={pttRecording ? 'Listening' : pttReview ? 'Resolve review first' : 'Hold to talk'}
              disabled={pttBusy || pttReview !== null || pttClarification !== null}
              className={`w-full max-w-[300px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase border transition-colors select-none ${
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
          </>
        ) : (
          <div
            data-testid="listen-unsupported-banner"
            className="w-full max-w-[300px] rounded-md bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60"
          >
            Voice input not supported in this browser. The canned demo below still works.
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
              onClick={() => useListenStore.getState().clearError()}
              className="shrink-0 text-red-100/70 hover:text-white underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* P19 Step 2 (A4): Bradley reply for the listen surface. We're in a
            different left-panel tab than ChatInput so we cannot share the chat
            messages list — a small banner here keeps the UX local. */}
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

        {/* P36 Sprint F P1 (A2) — Pre-pipeline review card. Gates the chat
            pipeline on Approve. Edit hands the transcript to ChatInput;
            Cancel discards. Replaces the auto-fire UX from P19. */}
        {pttReview && !pttBusy && !pttClarification && (
          <ListenReviewCard
            transcript={pttReview.transcript}
            actionPreview={pttReview.preview}
            confidence={pttReview.confidence}
            onApprove={() => { void handleListenApprove() }}
            onEdit={handleListenEdit}
            onCancel={handleListenCancel}
          />
        )}

        {/* P36 Sprint F P1 (A1) — Voice clarification (low-confidence intent).
            Mirrors ChatInput ClarificationPanel. Tap an option → re-feed the
            canonical rephrasing through runListenPipeline. */}
        {pttClarification && !pttBusy && (
          <ListenClarificationCard
            originalTranscript={pttClarification.transcript}
            assumptions={pttClarification.assumptions}
            onAccept={(a) => { void handleListenClarificationAccept(a) }}
            onReject={() => setPttClarification(null)}
          />
        )}

        {pttReply && !pttBusy && !pttReview && !pttClarification && (
          <div
            data-testid="listen-reply"
            className="w-full max-w-[300px] rounded-md bg-[#A51C30]/10 border border-[#A51C30]/30 px-3 py-2 text-sm text-white/85 space-y-1"
          >
            <div>{pttReply}</div>
            {pttAisp && (
              <div data-testid="listen-aisp-chip" className="flex items-center gap-1 text-[10px] text-white/55 uppercase tracking-wider">
                <span>{pttAisp.verb}</span>
                {pttAisp.target && <span>· {pttAisp.target}</span>}
                {pttAisp.templateId && <span>· {pttAisp.templateId}</span>}
              </div>
            )}
          </div>
        )}

        {/* Divider separating new PTT path from existing canned demo controls. */}
        <div className="w-full max-w-[300px] border-t border-white/10 mt-1" />
      </div>

      {/* C) Bottom controls — pushed to bottom */}
      <div className="mt-auto px-4 pb-4 space-y-2 flex flex-col items-center">
        <div className="w-full max-w-[300px] space-y-2">
          {/* Watch a Demo button */}
          <Button
            variant="ghost"
            onClick={() => setShowDemoDialog(true)}
            disabled={simActive || burstActive}
            className="w-full flex items-center justify-center gap-2 h-auto py-2 text-xs text-white/50 hover:text-[#C1283E] hover:bg-[#A51C30]/5 transition-colors disabled:opacity-40"
            data-testid="watch-demo-btn"
          >
            <Mic size={14} />
            Watch a Demo
          </Button>

          {/* Settings toggle — EXPERT-only (F10). DRAFT users have nothing to
              tune so we hide both the button and the panel. */}
          {viewMode === 'EXPERT' && (
            <Button
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1.5 h-auto text-xs text-white/30 hover:text-white/50 transition-colors mx-auto pt-1"
            >
              <Settings size={11} />
              {showSettings ? 'Hide' : 'Show'} settings
            </Button>
          )}

          {/* P19 Fix-Pass 2 (F10): demo sliders are an EXPERT-mode-only affordance.
              In DRAFT (SIMPLE) mode they overwhelm the listen surface — Grandma
              doesn't need orb-pulse / blur tuning. The settings toggle button
              also hides because there's nothing to toggle in DRAFT. */}
          {showSettings && viewMode === 'EXPERT' && (
            <div className="space-y-2 pt-1 border-t border-white/10">
              <SliderRow label="Speed" value={pulseSpeed} min={0.5} max={15} step={0.5} suffix="s" leftHint="Fast" rightHint="Slow" onChange={setPulseSpeed} disabled={randomMode} />
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-white/40">Random drift</span>
                <button
                  type="button"
                  onClick={() => setRandomMode(!randomMode)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${randomMode ? 'bg-[#A51C30]' : 'bg-white/20'}`}
                  aria-label="Toggle random mode"
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${randomMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <SliderRow label="Blur" value={blurAmount} min={0} max={80} step={1} suffix="px" onChange={setBlurAmount} disabled={randomMode} />
              <SliderRow label="Glow" value={glowOpacity} min={5} max={60} step={1} suffix="%" onChange={setGlowOpacity} disabled={randomMode} />
              <SliderRow label="Core" value={coreOpacity} min={10} max={100} step={5} suffix="%" onChange={setCoreOpacity} />
              <SliderRow label="Soft" value={coreBlur} min={0} max={40} step={1} suffix="px" onChange={setCoreBlur} />
              <SliderRow label="Size" value={maxSize} min={100} max={400} step={10} suffix="px" onChange={setMaxSize} />
            </div>
          )}

          {/* LISTENING button — very bottom */}
          <Button
            variant="outline"
            onClick={runBurstAnimation}
            disabled={burstActive}
            className="w-full flex items-center justify-center gap-2 h-auto py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/15 transition-colors border border-white/10 disabled:opacity-60"
          >
            <Play size={16} fill="currentColor" />
            {burstActive ? `Listening ${Math.ceil(burstRemaining)}s` : 'Start Listening'}
          </Button>
        </div>
      </div>

      {/* Demo dialog */}
      {showDemoDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDemoDialog(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowDemoDialog(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="Demo options"
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Watch a Demo</h2>
              <button
                type="button"
                onClick={() => setShowDemoDialog(false)}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {demoSequences.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => {
                    setShowDemoDialog(false)
                    runSimulateInput(demo)
                  }}
                  disabled={simActive || burstActive}
                  className="w-full group flex items-center gap-3 rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-[#A51C30]/15 hover:border-[#A51C30]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex gap-0.5 shrink-0">
                    {demo.swatchColors.map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-white/70 group-hover:text-[#C1283E] transition-colors">
                    {demo.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          25% { opacity: 0.75; transform: scale(1.06); }
          50% { opacity: 1; transform: scale(1.15); }
          75% { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes orb-breathe {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.1) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

// P28 C04 — SliderRow extracted to ./listen/SliderRow.tsx
