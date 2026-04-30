/**
 * P66 / Polish Sprint / Wave 1 / A2 — ChatModeDemo
 *
 * Self-contained scripted chat-mode demo. NO real LLM call, NO BYOK, NO
 * runtime imports from the live chat pipeline. Mirrors the visual rhythm
 * of ListenModeDemo (A1) but is chat-driven instead of voice-driven.
 *
 * Visual contract:
 *   - Warm cream bg (#faf8f5) + dark text (#2d1f12) per Welcome.tsx palette
 *   - 5 scripted interactions with typewriter prompt animation
 *   - AISP trace strip per reply (5 colored chips: INTENT/ASSUMPTIONS/SELECTION/CONTENT/PATCH)
 *   - First reply trace auto-expanded; subsequent replies collapsed by default (P60.5 pattern)
 *   - Latency badge per reply ("Updated in 0.NNs")
 *   - Mocked preview panel updating per step (hero → +blog → retro → typography → final)
 *   - Persistent bottom controls (Pause/Resume + Restart + 3 quick-ref buttons)
 *
 * Per ADR-091 + ADR-087 design discipline: tokens consumed via @/styles/design-tokens
 * for radius/shadow; spacing/typography via Tailwind only; no hardcoded color
 * literals outside the warm-cream Welcome palette.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pause, Play, RotateCcw, History, Palette, Undo2 } from 'lucide-react'
import { tokens } from '@/styles/design-tokens'

type PreviewKind = 'hero' | 'blog-3' | 'theme-retro' | 'typography' | 'final'

interface AispAtoms {
  intent: string
  confidence: number
  source: 'rules' | 'llm'
}

interface InteractionStep {
  userText: string
  bradleyReply: string
  aispAtoms: AispAtoms
  previewChange: PreviewKind
  durationMs: number
  templateId: string
  contentGenerated: boolean
  patchCount: number
  latencySeconds: string
}

const INTERACTIONS: readonly InteractionStep[] = [
  {
    userText: 'create a landing page for a project called Hey Bradley',
    bradleyReply: 'On it. Building a hero + feature row + footer.',
    aispAtoms: { intent: 'create:hero', confidence: 0.94, source: 'rules' },
    previewChange: 'hero',
    durationMs: 2400,
    templateId: 'hero/centered',
    contentGenerated: true,
    patchCount: 3,
    latencySeconds: '0.6',
  },
  {
    userText: 'add three blog cards: Don Miller, how-to, AISP benefits',
    bradleyReply: 'Three cards added.',
    aispAtoms: { intent: 'add:blog-3', confidence: 0.88, source: 'rules' },
    previewChange: 'blog-3',
    durationMs: 2400,
    templateId: 'blog/card-grid',
    contentGenerated: false,
    patchCount: 3,
    latencySeconds: '0.9',
  },
  {
    userText: 'switch to a retro theme',
    bradleyReply: 'Theme swapped.',
    aispAtoms: { intent: 'theme:retro', confidence: 0.92, source: 'rules' },
    previewChange: 'theme-retro',
    durationMs: 2000,
    templateId: 'theme/retro',
    contentGenerated: false,
    patchCount: 1,
    latencySeconds: '0.4',
  },
  {
    userText: 'bigger headline, more relaxed body',
    bradleyReply: 'Typography adjusted.',
    aispAtoms: { intent: 'style:typography', confidence: 0.86, source: 'llm' },
    previewChange: 'typography',
    durationMs: 2200,
    templateId: 'typography',
    contentGenerated: true,
    patchCount: 2,
    latencySeconds: '1.1',
  },
  {
    userText: 'show me the spec',
    bradleyReply: 'Spec bundle ready — five atoms, 1.4% ambiguity.',
    aispAtoms: { intent: 'export:spec', confidence: 0.99, source: 'rules' },
    previewChange: 'final',
    durationMs: 2400,
    templateId: 'export/bundle',
    contentGenerated: false,
    patchCount: 1,
    latencySeconds: '0.3',
  },
]

const TYPING_CHAR_MS = 35

interface ThreadEntry {
  kind: 'user' | 'bradley'
  stepIndex: number
  text: string
}

export function ChatModeDemo() {
  const [stepIndex, setStepIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [thread, setThread] = useState<ThreadEntry[]>([])
  const [typingBuffer, setTypingBuffer] = useState('')
  const [phase, setPhase] = useState<'typing' | 'replying' | 'settled' | 'done'>('typing')
  const [openTraceIndex, setOpenTraceIndex] = useState<number | null>(0)
  const [activeQuickRef, setActiveQuickRef] = useState<'history' | 'theme' | 'undo' | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Driver: typewriter -> send -> bradley reply -> settle -> advance
  useEffect(() => {
    if (paused || phase === 'done') return
    const step = INTERACTIONS[stepIndex]
    if (!step) {
      setPhase('done')
      return
    }
    if (phase === 'typing') {
      if (typingBuffer.length < step.userText.length) {
        timerRef.current = setTimeout(() => {
          setTypingBuffer(step.userText.slice(0, typingBuffer.length + 1))
        }, TYPING_CHAR_MS)
      } else {
        timerRef.current = setTimeout(() => {
          setThread((prev) => [...prev, { kind: 'user', stepIndex, text: step.userText }])
          setTypingBuffer('')
          setPhase('replying')
        }, 380)
      }
    } else if (phase === 'replying') {
      timerRef.current = setTimeout(() => {
        setThread((prev) => [...prev, { kind: 'bradley', stepIndex, text: step.bradleyReply }])
        // First reply: auto-open trace (P60.5); subsequent: keep current openTraceIndex unchanged
        setOpenTraceIndex((current) => (stepIndex === 0 ? 0 : current))
        setPhase('settled')
      }, 720)
    } else if (phase === 'settled') {
      timerRef.current = setTimeout(() => {
        if (stepIndex + 1 >= INTERACTIONS.length) {
          setPhase('done')
        } else {
          setStepIndex(stepIndex + 1)
          setPhase('typing')
        }
      }, step.durationMs - 720 - 380)
    }
    return clearTimer
  }, [phase, stepIndex, typingBuffer, paused])

  const handleRestart = () => {
    clearTimer()
    setStepIndex(0)
    setThread([])
    setTypingBuffer('')
    setPhase('typing')
    setOpenTraceIndex(0)
    setPaused(false)
    setActiveQuickRef(null)
  }

  const currentPreview: PreviewKind =
    phase === 'done' ? 'final' : INTERACTIONS[stepIndex]?.previewChange ?? 'hero'
  const completedThrough = phase === 'done' ? INTERACTIONS.length : stepIndex

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12] flex flex-col">
      {/* Top bar */}
      <header className="border-b border-[#e8772e]/15 bg-[#f1ece4]/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-[#6b5e4f] hover:text-[#2d1f12] transition-colors inline-flex items-center gap-1"
          >
            ← Back to Hey Bradley
          </Link>
          <span className="px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold bg-[#e8772e]/15 text-[#c45f1c]">
            Chat mode demo · scripted
          </span>
        </div>
      </header>

      {/* Main grid: chat + preview */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 grid md:grid-cols-2 gap-6">
        {/* Chat thread */}
        <section
          aria-label="Chat thread"
          className="bg-white border border-[#e8772e]/20 p-5 flex flex-col"
          style={{ borderRadius: tokens.radius.lg, boxShadow: tokens.shadow.card }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6b5e4f]">
              Chat
            </h2>
            <span className="text-[11px] text-[#6b5e4f]">
              Step {Math.min(stepIndex + 1, INTERACTIONS.length)} of {INTERACTIONS.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] pr-1">
            {thread.map((entry, i) => {
              const step = INTERACTIONS[entry.stepIndex]
              if (entry.kind === 'user') {
                return (
                  <div key={`u-${i}`} className="flex justify-end">
                    <div className="max-w-[85%] px-3.5 py-2 bg-[#e8772e] text-white text-sm rounded-2xl rounded-br-sm">
                      {entry.text}
                    </div>
                  </div>
                )
              }
              const isTraceOpen = openTraceIndex === entry.stepIndex
              return (
                <div key={`b-${i}`} className="flex flex-col items-start max-w-[92%]">
                  <div className="px-3.5 py-2 bg-[#f1ece4] text-[#2d1f12] text-sm rounded-2xl rounded-bl-sm">
                    {entry.text}
                  </div>
                  <span className="mt-1 text-xs text-[#6b5e4f]">
                    Updated in {step.latencySeconds}s
                  </span>
                  <AispTraceStrip
                    step={step}
                    open={isTraceOpen}
                    onToggle={() =>
                      setOpenTraceIndex(isTraceOpen ? null : entry.stepIndex)
                    }
                  />
                </div>
              )
            })}

            {/* Typewriter input preview */}
            {phase !== 'done' && (
              <div className="flex justify-end" aria-live="polite">
                <div className="max-w-[85%] px-3.5 py-2 border border-dashed border-[#e8772e]/40 text-[#6b5e4f] text-sm rounded-2xl rounded-br-sm bg-[#faf8f5] min-h-[2.25rem]">
                  {typingBuffer}
                  {phase === 'typing' && (
                    <span className="inline-block w-[2px] h-4 align-middle bg-[#e8772e] ml-0.5 animate-pulse" />
                  )}
                  {phase === 'replying' && (
                    <span className="text-[#6b5e4f] italic">bradley is replying…</span>
                  )}
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div className="pt-4 text-center">
                <Link
                  to="/onboarding"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e8772e] text-white text-sm font-semibold hover:bg-[#c45f1c] transition-colors"
                  style={{ borderRadius: tokens.radius.md }}
                >
                  Try the open source version
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Preview panel */}
        <section
          aria-label="Live preview"
          className="bg-white border border-[#e8772e]/20 p-5 flex flex-col"
          style={{ borderRadius: tokens.radius.lg, boxShadow: tokens.shadow.card }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6b5e4f]">
              Preview
            </h2>
            <span className="text-[11px] text-[#6b5e4f]">
              {completedThrough}/{INTERACTIONS.length} patches applied
            </span>
          </div>
          <PreviewMock kind={currentPreview} />
        </section>
      </div>

      {/* Quick-ref panel inline */}
      {activeQuickRef && (
        <div className="max-w-6xl w-full mx-auto px-6 -mt-2 mb-2">
          <div
            className="bg-white border border-[#e8772e]/20 p-4 text-sm text-[#6b5e4f]"
            style={{ borderRadius: tokens.radius.md }}
          >
            {activeQuickRef === 'history' && (
              <p>
                <strong className="text-[#2d1f12]">History:</strong> every patch is a JSON-Patch envelope; rollback any step from the EXPERT pane.
              </p>
            )}
            {activeQuickRef === 'theme' && (
              <p>
                <strong className="text-[#2d1f12]">Theme:</strong> 12 themes ship in open core (agency, retro, neon, …). Swap mid-build.
              </p>
            )}
            {activeQuickRef === 'undo' && (
              <p>
                <strong className="text-[#2d1f12]">Undo:</strong> the last patch is reversible in one click; older steps via History.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Persistent bottom bar */}
      <footer className="border-t border-[#e8772e]/15 bg-[#f1ece4]/40 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#e8772e]/30 text-[#2d1f12] hover:bg-[#f1ece4] transition-colors"
              style={{ borderRadius: tokens.radius.md }}
              aria-pressed={paused}
              disabled={phase === 'done'}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#e8772e]/30 text-[#2d1f12] hover:bg-[#f1ece4] transition-colors"
              style={{ borderRadius: tokens.radius.md }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <QuickRefButton
              icon={<History className="w-3.5 h-3.5" />}
              label="History"
              active={activeQuickRef === 'history'}
              onClick={() =>
                setActiveQuickRef(activeQuickRef === 'history' ? null : 'history')
              }
            />
            <QuickRefButton
              icon={<Palette className="w-3.5 h-3.5" />}
              label="Theme"
              active={activeQuickRef === 'theme'}
              onClick={() => setActiveQuickRef(activeQuickRef === 'theme' ? null : 'theme')}
            />
            <QuickRefButton
              icon={<Undo2 className="w-3.5 h-3.5" />}
              label="Undo"
              active={activeQuickRef === 'undo'}
              onClick={() => setActiveQuickRef(activeQuickRef === 'undo' ? null : 'undo')}
            />
          </div>
        </div>
      </footer>
    </main>
  )
}

function QuickRefButton(props: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.active}
      className={
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ' +
        (props.active
          ? 'bg-[#e8772e] text-white border border-[#e8772e]'
          : 'border border-[#e8772e]/30 text-[#2d1f12] hover:bg-[#f1ece4]')
      }
      style={{ borderRadius: tokens.radius.md }}
    >
      {props.icon}
      {props.label}
    </button>
  )
}

interface AispTraceStripProps {
  step: InteractionStep
  open: boolean
  onToggle: () => void
}

function AispTraceStrip({ step, open, onToggle }: AispTraceStripProps) {
  const verbTarget = step.aispAtoms.intent
  const conf = step.aispAtoms.confidence.toFixed(2)
  const assumptionsLabel = step.aispAtoms.confidence > 0.85 ? '—' : '1 fired'
  const contentLabel = step.contentGenerated ? 'generated' : '—'
  const patchLabel = `${step.patchCount} patch${step.patchCount === 1 ? '' : 'es'}`

  return (
    <div className="mt-1.5 w-full">
      <button
        type="button"
        onClick={onToggle}
        className="text-[10px] uppercase tracking-wider text-[#6b5e4f] hover:text-[#2d1f12] underline decoration-dotted"
      >
        {open ? '▾' : '▸'} AISP trace
      </button>
      {open && (
        <div className="mt-1 flex flex-wrap gap-1">
          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            INTENT · {verbTarget} · conf {conf}
          </span>
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            ASSUMPTIONS · {assumptionsLabel}
          </span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            SELECTION · {step.templateId}
          </span>
          <span className="bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            CONTENT · {contentLabel}
          </span>
          <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            PATCH · {patchLabel}
          </span>
          <span className="text-[10px] text-[#6b5e4f] italic px-1 py-0.5">
            source: {step.aispAtoms.source}
          </span>
        </div>
      )}
    </div>
  )
}

function PreviewMock({ kind }: { kind: PreviewKind }) {
  const isRetro = kind === 'theme-retro'
  const isFinal = kind === 'final'
  const showBlog = kind === 'blog-3' || kind === 'theme-retro' || kind === 'typography' || kind === 'final'
  const bigType = kind === 'typography' || kind === 'final'

  const surfaceBg = isRetro ? 'bg-[#2d1f12] text-[#faf8f5]' : 'bg-[#faf8f5] text-[#2d1f12]'
  const accentColor = isRetro ? 'text-[#f5b14a]' : 'text-[#e8772e]'
  const subText = isRetro ? 'text-[#d6c8b6]' : 'text-[#6b5e4f]'
  const cardBg = isRetro ? 'bg-[#3b2a1a] border-[#f5b14a]/30' : 'bg-white border-[#e8772e]/20'

  return (
    <div
      className={`flex-1 ${surfaceBg} border border-[#e8772e]/20 p-5 transition-colors duration-300`}
      style={{ borderRadius: tokens.radius.md }}
    >
      <div className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${accentColor}`}>
        Hey Bradley
      </div>
      <h3
        className={`font-bold leading-tight mb-2 ${
          bigType ? 'text-3xl' : 'text-2xl'
        }`}
      >
        Tell Bradley what you want.
      </h3>
      <p
        className={`mb-4 ${subText} ${bigType ? 'text-base leading-relaxed' : 'text-sm leading-snug'}`}
      >
        A whiteboard that listens, builds, and writes the spec in the background.
      </p>
      <div className="flex gap-2 mb-4">
        <span
          className={`px-2.5 py-1 text-[11px] font-semibold ${
            isRetro ? 'bg-[#f5b14a] text-[#2d1f12]' : 'bg-[#e8772e] text-white'
          }`}
          style={{ borderRadius: tokens.radius.sm }}
        >
          Try it
        </span>
        <span
          className={`px-2.5 py-1 text-[11px] font-semibold border ${
            isRetro ? 'border-[#f5b14a]/40 text-[#f5b14a]' : 'border-[#e8772e]/40 text-[#2d1f12]'
          }`}
          style={{ borderRadius: tokens.radius.sm }}
        >
          Read spec
        </span>
      </div>

      {showBlog && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {['Don Miller hook', 'How-to: AISP', 'Why it matters'].map((title) => (
            <div
              key={title}
              className={`p-2 border ${cardBg} text-[10px] leading-tight`}
              style={{ borderRadius: tokens.radius.sm }}
            >
              <div className={`font-semibold mb-0.5 ${isRetro ? 'text-[#f5b14a]' : 'text-[#2d1f12]'}`}>
                {title}
              </div>
              <div className={subText}>2 min read</div>
            </div>
          ))}
        </div>
      )}

      {isFinal && (
        <div
          className={`mt-3 p-2.5 border text-[11px] ${
            isRetro
              ? 'bg-[#3b2a1a] border-[#f5b14a]/40 text-[#f5b14a]'
              : 'bg-[#f1ece4] border-[#e8772e]/30 text-[#c45f1c]'
          }`}
          style={{ borderRadius: tokens.radius.sm }}
        >
          ✓ AISP spec ready · 5 atoms · 1.4% ambiguity · ready to hand to your AI coder
        </div>
      )}

      <div className={`mt-4 pt-3 border-t border-current/10 text-[10px] ${subText}`}>
        Hero · Features · {showBlog ? 'Blog · ' : ''}Footer
      </div>
    </div>
  )
}
