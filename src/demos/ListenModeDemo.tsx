/**
 * P66 / Polish Sprint / Wave 1 / A1 — Listen Mode Demo
 *
 * Self-contained scripted simulation of a 5-interaction listen-mode session.
 * No real LLM call. No Web Speech API. No BYOK required. No external animation
 * libraries (Tailwind transitions + animate-pulse only). Pure scripted UX.
 *
 * Visual contract: ADR-091 canonical-component quality + ADR-087 design tokens
 * (warm cream + orange-brown palette to match Welcome.tsx).
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mic, Pause, Play, RotateCcw } from 'lucide-react'
import { tokens } from '@/styles/design-tokens'

type PreviewChange = 'idle' | 'hero' | 'blog-3' | 'theme-retro' | 'typography' | 'final'

interface Interaction {
  voiceText: string
  bradleyReply: string
  previewChange: PreviewChange
  durationMs: number
}

const INTERACTIONS: Interaction[] = [
  {
    voiceText: "hey we'd like to create a site about Hey Bradley",
    bradleyReply: 'Got it — building a Hey Bradley landing page now.',
    previewChange: 'hero',
    durationMs: 2400,
  },
  {
    voiceText: 'add three blog posts — Don Miller, how-to, AISP benefits',
    bradleyReply: 'Three blog cards coming up.',
    previewChange: 'blog-3',
    durationMs: 2400,
  },
  {
    voiceText: 'switch to a retro theme',
    bradleyReply: 'Switching to retro.',
    previewChange: 'theme-retro',
    durationMs: 2000,
  },
  {
    voiceText: 'make the headline bigger and the body more relaxed',
    bradleyReply: 'Typography adjusted.',
    previewChange: 'typography',
    durationMs: 2200,
  },
  {
    voiceText: 'show me the final result',
    bradleyReply: "Here's the spec bundle. Ready to ship.",
    previewChange: 'final',
    durationMs: 2400,
  },
]

const TYPEWRITER_MS = 30

interface PreviewState {
  showHero: boolean
  showBlog: boolean
  retroTheme: boolean
  bigTypography: boolean
  showSpecBundle: boolean
}

function applyPreview(prev: PreviewState, change: PreviewChange): PreviewState {
  switch (change) {
    case 'hero':
      return { ...prev, showHero: true }
    case 'blog-3':
      return { ...prev, showHero: true, showBlog: true }
    case 'theme-retro':
      return { ...prev, showHero: true, retroTheme: true }
    case 'typography':
      return { ...prev, showHero: true, bigTypography: true }
    case 'final':
      return { ...prev, showHero: true, showBlog: true, showSpecBundle: true }
    default:
      return prev
  }
}

const INITIAL_PREVIEW: PreviewState = {
  showHero: false,
  showBlog: false,
  retroTheme: false,
  bigTypography: false,
  showSpecBundle: false,
}

export function ListenModeDemo() {
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [transcript, setTranscript] = useState<string>('')
  const [reply, setReply] = useState<string>('')
  const [preview, setPreview] = useState<PreviewState>(INITIAL_PREVIEW)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false })

  const current = INTERACTIONS[stepIndex]

  // Drive the scripted sequence per step. Each step:
  // 1) recording on, typewriter transcript
  // 2) recording off, reveal reply
  // 3) apply preview, then settle
  useEffect(() => {
    if (isPaused || completed) return
    if (!current) return

    cancelRef.current = { cancelled: false }
    const local = cancelRef.current

    const run = async () => {
      setTranscript('')
      setReply('')
      setIsRecording(true)

      // typewriter the voice prompt
      for (let i = 1; i <= current.voiceText.length; i++) {
        if (local.cancelled) return
        setTranscript(current.voiceText.slice(0, i))
        await wait(TYPEWRITER_MS, local)
        if (local.cancelled) return
      }
      if (local.cancelled) return
      await wait(280, local)
      if (local.cancelled) return

      setIsRecording(false)
      setReply(current.bradleyReply)
      await wait(700, local)
      if (local.cancelled) return

      setPreview(prev => applyPreview(prev, current.previewChange))
      await wait(current.durationMs - 700, local)
      if (local.cancelled) return

      if (stepIndex < INTERACTIONS.length - 1) {
        setStepIndex(s => s + 1)
      } else {
        setCompleted(true)
      }
    }

    void run()
    return () => {
      local.cancelled = true
    }
  }, [stepIndex, isPaused, completed, current])

  const handleRestart = () => {
    cancelRef.current.cancelled = true
    setStepIndex(0)
    setTranscript('')
    setReply('')
    setPreview(INITIAL_PREVIEW)
    setCompleted(false)
    setIsPaused(false)
    setIsRecording(false)
  }

  const handleForceTheme = () => {
    setPreview(prev => applyPreview({ ...prev, showHero: true }, 'theme-retro'))
  }
  const handleForceBlog = () => {
    setPreview(prev => applyPreview({ ...prev, showHero: true }, 'blog-3'))
  }

  const themeRetro = preview.retroTheme
  const pageBg = themeRetro ? 'bg-[#fff6e0]' : 'bg-[#faf8f5]'
  const accentColor = themeRetro ? '#a05a2c' : '#e8772e'

  const historyEntries = useMemo(
    () =>
      INTERACTIONS.map((it, idx) => {
        const offset = INTERACTIONS.slice(0, idx).reduce((acc, x) => acc + x.durationMs, 0)
        const totalSec = Math.floor(offset / 1000)
        const mm = String(14).padStart(2, '0')
        const ss = String(totalSec).padStart(2, '0')
        return { label: `${mm}:${ss}`, text: it.voiceText }
      }),
    []
  )

  return (
    <main className={`min-h-screen ${pageBg} text-[#2d1f12] transition-colors duration-300`}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between border-b border-[#e8772e]/15"
        style={{ padding: `${tokens.spacing['container-x']} ${tokens.spacing['container-x']}` }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6b5e4f] hover:text-[#2d1f12] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hey Bradley
        </Link>
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: accentColor }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          Listen mode demo &middot; scripted
        </span>
      </header>

      <div
        className="max-w-6xl mx-auto"
        style={{ padding: tokens.spacing['container-x'], gap: tokens.spacing['stack-gap'] }}
      >
        {/* Mic + transcript + preview grid */}
        <section
          className="grid md:grid-cols-2 gap-8 py-10"
          style={{ borderRadius: tokens.radius.lg }}
        >
          {/* LEFT: Mic + transcript */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6 w-full">
              <div className="relative inline-flex items-center justify-center">
                <span
                  aria-hidden
                  className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
                  style={{
                    background: `${accentColor}33`,
                    transform: isRecording ? 'scale(1.4)' : 'scale(1.0)',
                    transition: `transform ${tokens.motion.duration.slow} ${tokens.motion.ease['in-out']}`,
                  }}
                />
                <span
                  className="relative inline-flex items-center justify-center w-24 h-24 rounded-full text-white shadow-xl"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: tokens.shadow.elevated,
                  }}
                >
                  <Mic className="w-10 h-10" />
                </span>
              </div>
            </div>

            <p
              className="text-xs uppercase tracking-[0.2em] mb-2 font-medium"
              style={{ color: accentColor }}
            >
              {isRecording ? 'Listening…' : completed ? 'Session complete' : 'Standing by'}
            </p>
            <p
              className="text-lg md:text-xl text-[#2d1f12] leading-relaxed min-h-[3.5rem]"
              style={{ lineHeight: tokens.typography['line-height'] }}
              aria-live="polite"
            >
              {transcript || <span className="text-[#6b5e4f]/60">Voice prompt will appear here…</span>}
              {isRecording && transcript.length > 0 && (
                <span className="inline-block w-2 h-5 align-middle ml-1 animate-pulse" style={{ backgroundColor: accentColor }} />
              )}
            </p>

            <div className="mt-6 min-h-[4rem] w-full">
              <p
                className={`text-2xl font-semibold transition-opacity duration-300`}
                style={{
                  color: accentColor,
                  opacity: reply ? 1 : 0,
                }}
              >
                {reply || ' '}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsPaused(p => !p)}
                disabled={completed}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-[#e8772e]/30 text-[#2d1f12] hover:bg-[#f1ece4] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                style={{ borderRadius: tokens.radius.md }}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white transition-all duration-200"
                style={{
                  backgroundColor: accentColor,
                  borderRadius: tokens.radius.md,
                  boxShadow: tokens.shadow.card,
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart
              </button>
            </div>

            <p className="mt-4 text-xs text-[#6b5e4f]">
              Step {Math.min(stepIndex + 1, INTERACTIONS.length)} of {INTERACTIONS.length}
            </p>
          </div>

          {/* RIGHT: Preview panel */}
          <div
            className="bg-white border border-[#e8772e]/15 overflow-hidden"
            style={{ borderRadius: tokens.radius.lg, boxShadow: tokens.shadow.card }}
          >
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#e8772e]/10 bg-[#f1ece4]/50">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8772e]/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8772e]/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8772e]/20" />
              <span className="ml-3 text-xs text-[#6b5e4f]">preview.heybradley.local</span>
            </div>
            <div className="p-6 min-h-[420px]">
              {!preview.showHero && (
                <div className="flex items-center justify-center h-72 text-sm text-[#6b5e4f]/60">
                  Preview will render as Bradley listens…
                </div>
              )}
              {preview.showHero && (
                <div className="transition-all duration-500">
                  <p
                    className="text-xs uppercase tracking-[0.18em] mb-2 font-medium"
                    style={{ color: accentColor }}
                  >
                    Hey Bradley
                  </p>
                  <h2
                    className={`font-bold tracking-tight mb-3 leading-tight text-[#2d1f12] ${
                      preview.bigTypography ? 'text-5xl' : 'text-3xl'
                    }`}
                  >
                    Tell Bradley what you want.
                  </h2>
                  <p
                    className={`text-[#6b5e4f] mb-4 ${
                      preview.bigTypography ? 'text-base leading-loose' : 'text-sm leading-relaxed'
                    }`}
                  >
                    A whiteboard that listens, builds what you describe in real-time, and writes
                    enterprise specs in the background.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold transition-all duration-200"
                    style={{ backgroundColor: accentColor, borderRadius: tokens.radius.md }}
                  >
                    Try it now <ArrowRight className="w-4 h-4" />
                  </button>
                  <div
                    className="mt-5 h-32 w-full"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}33 0%, ${accentColor}66 100%)`,
                      borderRadius: tokens.radius.md,
                    }}
                  />

                  {preview.showBlog && (
                    <div className="mt-6 grid grid-cols-3 gap-3 transition-all duration-500">
                      {[
                        { title: 'Don Miller on clarity', tag: 'Story' },
                        { title: 'How to spec a site', tag: 'How-to' },
                        { title: 'Why AISP wins', tag: 'AISP' },
                      ].map(card => (
                        <div
                          key={card.title}
                          className="p-3 border border-[#e8772e]/15"
                          style={{ borderRadius: tokens.radius.sm }}
                        >
                          <p
                            className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-1"
                            style={{ color: accentColor }}
                          >
                            {card.tag}
                          </p>
                          <p className="text-xs font-semibold text-[#2d1f12] leading-snug">
                            {card.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {preview.showSpecBundle && (
                    <div
                      className="mt-6 p-4 border transition-all duration-500"
                      style={{
                        borderColor: `${accentColor}55`,
                        backgroundColor: `${accentColor}10`,
                        borderRadius: tokens.radius.md,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em]"
                          style={{ color: accentColor }}
                        >
                          Spec bundle ready
                        </span>
                        <span className="text-[10px] text-[#6b5e4f]">5 atoms</span>
                      </div>
                      <ul className="text-xs text-[#2d1f12] space-y-1">
                        <li>NORTH_STAR &middot; landing page · single audience</li>
                        <li>SELECTION_ATOM &middot; hero-centered + blog-grid-3</li>
                        <li>CONTENT_ATOM &middot; 3 blog cards · short-form</li>
                        <li>ASSUMPTIONS_ATOM &middot; retro theme · loose typography</li>
                        <li>CRYSTAL_ATOM &middot; bundle hash · ready to ship</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* History panel (toggle) */}
        {showHistory && (
          <section
            className="mb-6 bg-white border border-[#e8772e]/15 p-5 transition-all duration-200"
            style={{ borderRadius: tokens.radius.md, boxShadow: tokens.shadow.card }}
          >
            <p
              className="text-xs uppercase tracking-[0.18em] font-semibold mb-3"
              style={{ color: accentColor }}
            >
              Session history
            </p>
            <ol className="space-y-2">
              {historyEntries.map((entry, idx) => (
                <li key={entry.label} className="flex items-baseline gap-3 text-sm">
                  <span className="font-mono text-xs text-[#6b5e4f] tabular-nums">{entry.label}</span>
                  <span className="font-semibold text-[#2d1f12]">{idx + 1}.</span>
                  <span className="text-[#2d1f12]">{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Completion CTA */}
        {completed && (
          <section
            className="mb-6 p-6 text-center transition-opacity duration-300"
            style={{
              backgroundColor: `${accentColor}10`,
              border: `1px solid ${accentColor}40`,
              borderRadius: tokens.radius.lg,
            }}
          >
            <p className="text-lg font-semibold mb-3 text-[#2d1f12]">
              That's listen mode in 5 turns.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: accentColor,
                borderRadius: tokens.radius.md,
                boxShadow: tokens.shadow.elevated,
              }}
            >
              Try the open source version <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}
      </div>

      {/* Persistent bottom bar */}
      <nav
        className="sticky bottom-0 border-t border-[#e8772e]/20 bg-white/95 backdrop-blur"
        aria-label="Demo actions"
      >
        <div
          className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3"
          style={{ padding: tokens.spacing['container-x'] }}
        >
          <button
            type="button"
            onClick={() => setShowHistory(s => !s)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-[#e8772e]/30 text-[#2d1f12] hover:bg-[#f1ece4] transition-all duration-200"
            style={{ borderRadius: tokens.radius.md }}
          >
            {showHistory ? 'Hide History' : 'See History'}
          </button>
          <button
            type="button"
            onClick={handleForceTheme}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-[#e8772e]/30 text-[#2d1f12] hover:bg-[#f1ece4] transition-all duration-200"
            style={{ borderRadius: tokens.radius.md }}
          >
            Try Retro Theme
          </button>
          <button
            type="button"
            onClick={handleForceBlog}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-[#e8772e]/30 text-[#2d1f12] hover:bg-[#f1ece4] transition-all duration-200"
            style={{ borderRadius: tokens.radius.md }}
          >
            Add Blog Section
          </button>
        </div>
      </nav>
    </main>
  )
}

/**
 * Cancellable wait — resolves after `ms`, but exits early if cancelled
 * by the cleanup hook. Avoids ghost step-advances after restart/pause.
 */
function wait(ms: number, cancel: { cancelled: boolean }): Promise<void> {
  return new Promise(resolve => {
    const start = Date.now()
    const tick = () => {
      if (cancel.cancelled) return resolve()
      if (Date.now() - start >= ms) return resolve()
      setTimeout(tick, Math.min(60, ms - (Date.now() - start)))
    }
    tick()
  })
}

export default ListenModeDemo
