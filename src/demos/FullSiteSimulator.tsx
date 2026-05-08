/**
 * P74 / Track C / A6 — FullSiteSimulator
 *
 * Self-contained scripted 10-step simulation of a full Hey Bradley listen-mode
 * session: blank canvas → coffee-subscription site (hero, blog with two
 * articles, gallery, testimonials, CTA) → theme + typography refinement →
 * final 5-atom spec bundle.
 *
 * Extends ListenModeDemo (5 steps) per owner brief. Self-contained scripted
 * UX — NO real LLM, NO Web Speech API, NO useListenPipeline import. Tailwind
 * + tokens only (no Framer Motion / GSAP / Lottie / React Spring / animejs).
 *
 * Visual contract: ADR-091 canonical-component quality + ADR-087 design
 * tokens. Warm beige + brown palette, swaps to deeper earth on step 5.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mic, Pause, Play, RotateCcw } from 'lucide-react'
import { tokens } from '@/styles/design-tokens'

type PreviewChange =
  | 'idle'
  | 'hero'
  | 'blog-2'
  | 'article-1'
  | 'article-2'
  | 'theme-earth'
  | 'typography'
  | 'gallery'
  | 'testimonials'
  | 'cta'
  | 'final'

interface Interaction {
  voiceText: string
  bradleyReply: string
  previewChange: PreviewChange
  durationMs: number
}

const INTERACTIONS: readonly Interaction[] = [
  {
    voiceText: 'build a site for my coffee subscription business',
    bradleyReply: 'Got it. Starting with a hero + features.',
    previewChange: 'hero',
    durationMs: 2400,
  },
  {
    voiceText: 'add a blog with two articles',
    bradleyReply: 'Two articles added.',
    previewChange: 'blog-2',
    durationMs: 2400,
  },
  {
    voiceText: 'fill in the first article — about origin sourcing',
    bradleyReply: 'Article one drafted.',
    previewChange: 'article-1',
    durationMs: 2600,
  },
  {
    voiceText: 'second article about brewing technique',
    bradleyReply: 'Article two drafted.',
    previewChange: 'article-2',
    durationMs: 2600,
  },
  {
    voiceText: 'make it warmer — earthy tones',
    bradleyReply: 'Theme: warm earth.',
    previewChange: 'theme-earth',
    durationMs: 2200,
  },
  {
    voiceText: 'bigger headlines, more relaxed body',
    bradleyReply: 'Typography adjusted.',
    previewChange: 'typography',
    durationMs: 2200,
  },
  {
    voiceText: 'add an image gallery showcasing roasting',
    bradleyReply: 'Gallery added.',
    previewChange: 'gallery',
    durationMs: 2400,
  },
  {
    voiceText: 'include three customer testimonials',
    bradleyReply: 'Three testimonials added.',
    previewChange: 'testimonials',
    durationMs: 2400,
  },
  {
    voiceText: 'strong call-to-action for the subscription',
    bradleyReply: 'CTA wired up.',
    previewChange: 'cta',
    durationMs: 2200,
  },
  {
    voiceText: 'show me the spec',
    bradleyReply: 'Full spec ready — 5 atoms, sub-2% ambiguity.',
    previewChange: 'final',
    durationMs: 2400,
  },
]

const TYPEWRITER_MS = 30

interface PreviewState {
  showHero: boolean
  showBlog: boolean
  showArticle1Body: boolean
  showArticle2Body: boolean
  earthTheme: boolean
  bigTypography: boolean
  showGallery: boolean
  showTestimonials: boolean
  showCta: boolean
  showSpecBundle: boolean
}

const INITIAL_PREVIEW: PreviewState = {
  showHero: false,
  showBlog: false,
  showArticle1Body: false,
  showArticle2Body: false,
  earthTheme: false,
  bigTypography: false,
  showGallery: false,
  showTestimonials: false,
  showCta: false,
  showSpecBundle: false,
}

function applyPreview(prev: PreviewState, change: PreviewChange): PreviewState {
  switch (change) {
    case 'hero':
      return { ...prev, showHero: true }
    case 'blog-2':
      return { ...prev, showHero: true, showBlog: true }
    case 'article-1':
      return { ...prev, showHero: true, showBlog: true, showArticle1Body: true }
    case 'article-2':
      return {
        ...prev,
        showHero: true,
        showBlog: true,
        showArticle1Body: true,
        showArticle2Body: true,
      }
    case 'theme-earth':
      return { ...prev, earthTheme: true }
    case 'typography':
      return { ...prev, bigTypography: true }
    case 'gallery':
      return { ...prev, showGallery: true }
    case 'testimonials':
      return { ...prev, showTestimonials: true }
    case 'cta':
      return { ...prev, showCta: true }
    case 'final':
      return { ...prev, showSpecBundle: true }
    default:
      return prev
  }
}

const ARTICLE_1_TITLE = 'Why origin sourcing matters'
const ARTICLE_2_TITLE = 'Dialing in your grind'

const ARTICLE_1_BODY: readonly string[] = [
  'Coffee origins matter more than you think. We source from a 4-hectare microlot in Huila, Colombia — same farm, same hand-picking, every year.',
  'The result is a chocolate-forward cup with bright cherry on the finish. Consistency comes from relationship, not from a commodity contract.',
  'Every bag traces back to the same picker, the same washing station, the same drying patio. That is the promise behind a subscription.',
]

const ARTICLE_2_BODY: readonly string[] = [
  'The grind is the lever everyone ignores. For a V60, you want medium-coarse. For an espresso machine, fine. Same beans, dramatically different cups.',
  'Here is how we recommend dialing in: start at the recommended setting on your grinder, brew, taste. Sour means coarser. Bitter means finer.',
  'Iterate three times. Most home setups land within ten minutes. After that, the bag in your kitchen actually tastes the way the roaster intended.',
]

const TESTIMONIALS: readonly { quote: string; name: string; role: string }[] = [
  {
    quote: 'Best coffee I have had at home. Period.',
    name: 'Maya R.',
    role: 'Subscriber, 14 months',
  },
  {
    quote: 'The brewing guide alone is worth the subscription.',
    name: 'Jordan T.',
    role: 'Subscriber, 6 months',
  },
  {
    quote: 'Tastes like the cafe down the street, but it is in my kitchen.',
    name: 'Priya S.',
    role: 'Subscriber, 9 months',
  },
]

interface PaletteSet {
  pageBg: string
  surfaceBg: string
  text: string
  muted: string
  primary: string
  accent: string
  border: string
}

const PALETTE_DEFAULT: PaletteSet = {
  pageBg: '#faf8f5',
  surfaceBg: '#ffffff',
  text: '#2d1f12',
  muted: '#6b5e4f',
  primary: '#8b5a3c',
  accent: '#e8772e',
  border: '#e8772e26',
}

const PALETTE_EARTH: PaletteSet = {
  pageBg: '#f5ebd6',
  surfaceBg: '#fff8e8',
  text: '#3e2723',
  muted: '#6b4f3a',
  primary: '#3e2723',
  accent: '#a05a2c',
  border: '#a05a2c33',
}

export function FullSiteSimulator() {
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [transcript, setTranscript] = useState<string>('')
  const [reply, setReply] = useState<string>('')
  const [preview, setPreview] = useState<PreviewState>(INITIAL_PREVIEW)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [inThinkingBeat, setInThinkingBeat] = useState<boolean>(false)
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false })

  const current = INTERACTIONS[stepIndex]
  const palette = preview.earthTheme ? PALETTE_EARTH : PALETTE_DEFAULT

  useEffect(() => {
    if (isPaused || completed) return
    if (!current) return

    cancelRef.current = { cancelled: false }
    const local = cancelRef.current

    const run = async () => {
      setTranscript('')
      setReply('')
      setIsRecording(true)

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

      setInThinkingBeat(true)
      await wait(700, local)
      if (local.cancelled) return
      setInThinkingBeat(false)

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
    setInThinkingBeat(false)
  }

  const handleForceHistory = () => setShowHistory(s => !s)
  const handleForceTheme = () => {
    setPreview(prev => applyPreview({ ...prev, showHero: true }, 'theme-earth'))
  }
  const handleForceTypography = () => {
    setPreview(prev =>
      applyPreview({ ...prev, showHero: true, bigTypography: false }, 'typography')
    )
  }

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
    <main
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: palette.pageBg, color: palette.text }}
    >
      <header
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2"
        style={{
          padding: `${tokens.spacing['container-x']} ${tokens.spacing['container-x']}`,
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: palette.muted }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hey Bradley
        </Link>
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: palette.accent }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: palette.accent }}
          />
          Full-site simulator &middot; scripted
        </span>
      </header>

      <div
        className="max-w-6xl mx-auto"
        style={{ padding: tokens.spacing['container-x'], gap: tokens.spacing['stack-gap'] }}
      >
        <section
          className="grid md:grid-cols-2 gap-6 md:gap-8 py-6 md:py-10"
          style={{ borderRadius: tokens.radius.lg }}
        >
          {/* LEFT: Mic + transcript + reply + controls */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6 w-full">
              <div className="relative inline-flex items-center justify-center">
                <span
                  aria-hidden
                  className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
                  style={{
                    background: `${palette.accent}33`,
                    transform: isRecording ? 'scale(1.4)' : 'scale(1.0)',
                    transition: `transform ${tokens.motion.duration.slow} ${tokens.motion.ease['in-out']}`,
                  }}
                />
                <span
                  className="relative inline-flex items-center justify-center w-24 h-24 rounded-full text-white"
                  style={{
                    backgroundColor: palette.accent,
                    boxShadow: tokens.shadow.elevated,
                  }}
                >
                  <Mic className="w-10 h-10" />
                </span>
              </div>
            </div>

            <p
              className="text-xs uppercase tracking-[0.2em] mb-2 font-medium"
              style={{ color: palette.accent }}
            >
              {isRecording ? 'Listening…' : completed ? 'Session complete' : 'Standing by'}
            </p>
            <p
              className={`text-lg md:text-xl leading-relaxed min-h-[3.5rem] transition-opacity duration-200 ${
                inThinkingBeat ? 'opacity-70' : 'opacity-100'
              }`}
              style={{ color: palette.text, lineHeight: tokens.typography['line-height'] }}
              aria-live="polite"
            >
              {transcript || (
                <span style={{ color: `${palette.muted}99` }}>
                  Voice prompt will appear here…
                </span>
              )}
              {isRecording && transcript.length > 0 && (
                <span
                  className="inline-block w-2 h-5 align-middle ml-1 animate-pulse"
                  style={{ backgroundColor: palette.accent }}
                />
              )}
            </p>

            <div className="mt-6 min-h-[4rem] w-full">
              <p
                className="text-2xl font-semibold transition-opacity duration-300"
                style={{
                  color: palette.accent,
                  opacity: reply ? 1 : 0,
                }}
              >
                {reply || ' '}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsPaused(p => !p)}
                disabled={completed}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  border: `1px solid ${palette.border}`,
                  color: palette.text,
                  borderRadius: tokens.radius.md,
                }}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white transition-all duration-200"
                style={{
                  backgroundColor: palette.accent,
                  borderRadius: tokens.radius.md,
                  boxShadow: tokens.shadow.card,
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart
              </button>
            </div>

            <p className="mt-4 text-xs" style={{ color: palette.muted }}>
              Step {Math.min(stepIndex + 1, INTERACTIONS.length)} of {INTERACTIONS.length}
            </p>
          </div>

          {/* RIGHT: Progressive site preview */}
          <div
            className="overflow-hidden"
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.border}`,
              borderRadius: tokens.radius.lg,
              boxShadow: tokens.shadow.card,
            }}
          >
            <div
              className="flex items-center gap-1.5 px-4 py-2"
              style={{
                borderBottom: `1px solid ${palette.border}`,
                backgroundColor: `${palette.accent}10`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: `${palette.accent}99` }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: `${palette.accent}55` }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: `${palette.accent}33` }}
              />
              <span className="ml-3 text-xs" style={{ color: palette.muted }}>
                preview.beanstalk.local
              </span>
            </div>

            <div className="p-6 min-h-[420px] max-h-[640px] overflow-y-auto">
              {!preview.showHero && (
                <div
                  className="flex items-center justify-center h-72 text-sm"
                  style={{ color: `${palette.muted}99` }}
                >
                  Site will build as Bradley listens…
                </div>
              )}

              {preview.showHero && (
                <SitePreview palette={palette} preview={preview} />
              )}
            </div>
          </div>
        </section>

        {showHistory && (
          <section
            className="mb-6 p-5 transition-all duration-200"
            style={{
              backgroundColor: palette.surfaceBg,
              border: `1px solid ${palette.border}`,
              borderRadius: tokens.radius.md,
              boxShadow: tokens.shadow.card,
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.18em] font-semibold mb-3"
              style={{ color: palette.accent }}
            >
              Session history
            </p>
            <ol className="space-y-2">
              {historyEntries.map((entry, idx) => (
                <li key={entry.label} className="flex items-baseline gap-3 text-sm">
                  <span
                    className="font-mono text-xs tabular-nums"
                    style={{ color: palette.muted }}
                  >
                    {entry.label}
                  </span>
                  <span className="font-semibold" style={{ color: palette.text }}>
                    {idx + 1}.
                  </span>
                  <span style={{ color: palette.text }}>{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {completed && (
          <section
            className="mb-6 p-6 text-center transition-opacity duration-300"
            style={{
              backgroundColor: `${palette.accent}10`,
              border: `1px solid ${palette.accent}40`,
              borderRadius: tokens.radius.lg,
            }}
          >
            <p
              className="text-lg font-semibold mb-3"
              style={{ color: palette.text }}
            >
              That's a full Hey Bradley site in 10 turns.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: palette.accent,
                borderRadius: tokens.radius.md,
                boxShadow: tokens.shadow.elevated,
              }}
            >
              Try the open source version <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}
      </div>

      <nav
        className="sticky bottom-0 backdrop-blur"
        style={{
          borderTop: `1px solid ${palette.border}`,
          backgroundColor: `${palette.surfaceBg}f2`,
        }}
        aria-label="Demo actions"
      >
        <div
          className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3"
          style={{ padding: tokens.spacing['container-x'] }}
        >
          <button
            type="button"
            onClick={handleForceHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all duration-200"
            style={{
              border: `1px solid ${palette.border}`,
              color: palette.text,
              borderRadius: tokens.radius.md,
            }}
          >
            {showHistory ? 'Hide History' : 'See History'}
          </button>
          <button
            type="button"
            onClick={handleForceTheme}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all duration-200"
            style={{
              border: `1px solid ${palette.border}`,
              color: palette.text,
              borderRadius: tokens.radius.md,
            }}
          >
            Try Retro Theme
          </button>
          <button
            type="button"
            onClick={handleForceTypography}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all duration-200"
            style={{
              border: `1px solid ${palette.border}`,
              color: palette.text,
              borderRadius: tokens.radius.md,
            }}
          >
            Toggle Typography
          </button>
        </div>
      </nav>
    </main>
  )
}

interface SitePreviewProps {
  palette: PaletteSet
  preview: PreviewState
}

function SitePreview({ palette, preview }: SitePreviewProps) {
  const heroHeadlineSize = preview.bigTypography ? 'text-5xl' : 'text-3xl'
  const bodySize = preview.bigTypography
    ? 'text-base leading-loose'
    : 'text-sm leading-relaxed'
  const articleHeadlineSize = preview.bigTypography ? 'text-2xl' : 'text-lg'

  return (
    <div className="transition-all duration-500 space-y-6">
      {/* HERO */}
      <div>
        <p
          className="text-xs uppercase tracking-[0.18em] mb-2 font-medium"
          style={{ color: palette.accent }}
        >
          Beanstalk Coffee
        </p>
        <h2
          className={`font-bold tracking-tight mb-3 leading-tight ${heroHeadlineSize}`}
          style={{ color: palette.primary }}
        >
          Single-origin coffee, delivered fresh.
        </h2>
        <p className={bodySize} style={{ color: palette.muted }}>
          A monthly subscription from the same Huila microlot. Same farm, same
          roaster, every cup.
        </p>
        <div
          className="mt-5 h-32 w-full"
          style={{
            background: `linear-gradient(135deg, ${palette.accent}33 0%, ${palette.primary}66 100%)`,
            borderRadius: tokens.radius.md,
          }}
        />
      </div>

      {/* BLOG */}
      {preview.showBlog && (
        <div className="space-y-4 transition-all duration-500">
          <p
            className="text-xs uppercase tracking-[0.18em] font-semibold"
            style={{ color: palette.accent }}
          >
            From the journal
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <ArticleCard
              palette={palette}
              title={ARTICLE_1_TITLE}
              tag="Origin"
              expanded={preview.showArticle1Body}
              body={ARTICLE_1_BODY}
              headlineSize={articleHeadlineSize}
              bodySize={bodySize}
            />
            <ArticleCard
              palette={palette}
              title={ARTICLE_2_TITLE}
              tag="Brewing"
              expanded={preview.showArticle2Body}
              body={ARTICLE_2_BODY}
              headlineSize={articleHeadlineSize}
              bodySize={bodySize}
            />
          </div>
        </div>
      )}

      {/* GALLERY */}
      {preview.showGallery && (
        <div className="space-y-3 transition-all duration-500">
          <p
            className="text-xs uppercase tracking-[0.18em] font-semibold"
            style={{ color: palette.accent }}
          >
            The roastery
          </p>
          <div className="grid grid-cols-3 gap-3">
            <GalleryTile
              gradient={`linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)`}
              caption="Drum roaster"
            />
            <GalleryTile
              gradient={`linear-gradient(135deg, ${palette.accent} 0%, #c89a5a 100%)`}
              caption="First crack"
            />
            <GalleryTile
              gradient={`linear-gradient(135deg, #6b3f1f 0%, ${palette.primary} 100%)`}
              caption="Cooling tray"
            />
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {preview.showTestimonials && (
        <div className="space-y-3 transition-all duration-500">
          <p
            className="text-xs uppercase tracking-[0.18em] font-semibold"
            style={{ color: palette.accent }}
          >
            What subscribers say
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {TESTIMONIALS.map(t => (
              <div
                key={t.name}
                className="p-3"
                style={{
                  border: `1px solid ${palette.border}`,
                  borderRadius: tokens.radius.md,
                  backgroundColor: `${palette.accent}08`,
                }}
              >
                <p
                  className="text-sm leading-snug mb-2 italic"
                  style={{ color: palette.text }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: palette.primary }}
                >
                  {t.name}
                </p>
                <p className="text-[10px]" style={{ color: palette.muted }}>
                  {t.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {preview.showCta && (
        <div
          className="p-5 text-center transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)`,
            borderRadius: tokens.radius.lg,
            color: '#fff8e8',
          }}
        >
          <p className="text-xs uppercase tracking-[0.2em] mb-2 opacity-80">
            Subscribe
          </p>
          <p className="text-2xl font-bold mb-2">Subscribe — $24/mo</p>
          <p className="text-xs mb-3 opacity-90">
            Free shipping. Skip or cancel any month.
          </p>
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
            style={{
              backgroundColor: '#fff8e8',
              color: palette.primary,
              borderRadius: tokens.radius.md,
            }}
          >
            Start subscription <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      )}

      {/* SPEC BUNDLE */}
      {preview.showSpecBundle && (
        <div
          className="p-4 transition-all duration-500"
          style={{
            border: `1px solid ${palette.accent}55`,
            backgroundColor: `${palette.accent}10`,
            borderRadius: tokens.radius.md,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: palette.accent }}
            >
              Spec bundle ready
            </span>
            <span className="text-[10px]" style={{ color: palette.muted }}>
              5 atoms &middot; 1.7% ambiguity
            </span>
          </div>
          <ul className="text-xs space-y-1" style={{ color: palette.text }}>
            <li>INTENT &middot; coffee subscription site &middot; 10 turns</li>
            <li>ASSUMPTIONS &middot; warm earth theme &middot; relaxed typography</li>
            <li>SELECTION &middot; hero + blog-2 + gallery + testimonials + CTA</li>
            <li>CONTENT &middot; 2 articles &middot; 3 testimonials &middot; subscription CTA</li>
            <li>PATCH &middot; 10 patches applied &middot; bundle hash ready</li>
          </ul>
        </div>
      )}
    </div>
  )
}

interface ArticleCardProps {
  palette: PaletteSet
  title: string
  tag: string
  expanded: boolean
  body: readonly string[]
  headlineSize: string
  bodySize: string
}

function ArticleCard({
  palette,
  title,
  tag,
  expanded,
  body,
  headlineSize,
  bodySize,
}: ArticleCardProps) {
  return (
    <article
      className="p-4 transition-all duration-500"
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: tokens.radius.md,
        backgroundColor: `${palette.accent}05`,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-1"
        style={{ color: palette.accent }}
      >
        {tag}
      </p>
      <h3
        className={`font-bold leading-tight mb-2 ${headlineSize}`}
        style={{ color: palette.primary }}
      >
        {title}
      </h3>
      {!expanded && (
        <p className="text-xs italic" style={{ color: palette.muted }}>
          (body collapsed — Bradley will draft on next turn)
        </p>
      )}
      {expanded && (
        <div className="space-y-2">
          {body.map((para, i) => (
            <p
              key={i}
              className={bodySize}
              style={{ color: palette.text }}
            >
              {para}
            </p>
          ))}
        </div>
      )}
    </article>
  )
}

function GalleryTile({ gradient, caption }: { gradient: string; caption: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="h-24 w-full"
        style={{
          background: gradient,
          borderRadius: tokens.radius.md,
        }}
        aria-hidden
      />
      <p className="text-[10px] mt-1.5 text-center" style={{ color: '#6b5e4f' }}>
        {caption}
      </p>
    </div>
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

export default FullSiteSimulator
