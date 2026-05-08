import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

// P122 / W9 — Walkthrough revert to the original phase-1-15 3-pane design.
// Replaces the P118.5 6-scene scroll-snap. Owner direction (human-2.md items
// 31-34): left = prompts with red pulsing glow on active, center = animated
// mock typewriter, right = mobile-shaped site preview that updates each cycle.
// Reuses the global @keyframes orb-pulse from src/index.css (do NOT invent
// a new orb animation). KISS denylist per ADR-144 D5: no framer-motion / gsap
// / lottie-web / @react-spring / animejs.

const KEYFRAMES = `
@keyframes wt-caret { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
@keyframes wt-fade-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
.wt-caret { animation: wt-caret 0.9s step-end infinite }
.wt-fade-in { animation: wt-fade-in 0.4s ease-out }
@media (prefers-reduced-motion: reduce) {
  .wt-caret, .wt-fade-in { animation: none }
  .wt-active-glow { animation: none !important }
}
`

interface PreviewState {
  heroTitle: string
  heroSubtitle: string
  heroBg: string
  showPricing?: boolean
  showContact?: boolean
  fontStyle?: 'sans' | 'serif'
}
interface PromptStep { prompt: string; typed: string; preview: PreviewState }

const HERO_TITLE = 'The Pour Lab'
const HERO_SUB = 'Coffee, slow and on purpose.'
const BG_WARM = 'linear-gradient(135deg, #f5e8d4 0%, #e8772e 100%)'
const BG_CRIMSON = 'linear-gradient(135deg, #A51C30 0%, #6b1220 100%)'
const base = (overrides: Partial<PreviewState> = {}): PreviewState => ({
  heroTitle: HERO_TITLE, heroSubtitle: HERO_SUB, heroBg: BG_CRIMSON, fontStyle: 'sans', ...overrides,
})

const STEPS: PromptStep[] = [
  { prompt: 'Make me a coffee shop site, warm and not pretentious',
    typed: 'Building hero · warm cream palette · "Pour Lab" headline · scroll-friendly type...',
    preview: base({ heroBg: BG_WARM }) },
  { prompt: 'Make the hero crimson with a darker subhead',
    typed: 'Updating hero · crimson background · subhead deepened · contrast verified...',
    preview: base() },
  { prompt: 'Add a pricing section with 3 tiers',
    typed: 'Adding pricing · 3 tiers · single / double / shop-and-share · CTAs wired...',
    preview: base({ showPricing: true }) },
  { prompt: 'Switch to a serif heading font',
    typed: 'Updating typography · serif headings · sans body · rebalancing weights...',
    preview: base({ showPricing: true, fontStyle: 'serif' }) },
  { prompt: 'Add a contact form below the gallery',
    typed: 'Adding contact · email + message · form validation wired · submit handler...',
    preview: base({ showPricing: true, showContact: true, fontStyle: 'serif' }) },
]

const CYCLE_MS = 5200
const TYPE_MS = 28

function MobilePreview({ state }: { state: PreviewState }) {
  const headingFont = state.fontStyle === 'serif' ? 'font-serif' : 'font-sans'
  return (
    // Loop 2 / Walkthrough lift — phone-shaped device frame: thicker dark
    // bezel + status-bar mockup + home-indicator pill, so the preview reads
    // as a real phone, not a stretched rectangle.
    <div
      className="relative mx-auto rounded-[2.25rem] border-[8px] border-[#0f0f10] bg-[var(--hb-paper)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),0_15px_30px_-10px_rgba(0,0,0,0.25)] overflow-hidden wt-fade-in"
      style={{ width: 300, maxWidth: '100%' }}
      data-testid="walkthrough-mobile-frame"
      key={`${state.heroBg}-${state.showPricing}-${state.showContact}-${state.fontStyle}`}
    >
      {/* Status bar — time + signal/wifi/battery pictograms */}
      <div className="flex items-center justify-between px-4 py-1 text-[9px] font-mono bg-[var(--hb-paper-soft)] text-[var(--hb-ink-muted)] border-b border-[rgb(var(--hb-warm-rgb)/0.15)]">
        <span className="font-semibold text-[var(--hb-ink)]">9:41</span>
        <span className="flex items-center gap-1">
          <span aria-hidden="true">•••</span>
          <span aria-hidden="true">▮▮▮</span>
        </span>
      </div>
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--hb-paper-soft)] border-b border-[rgb(var(--hb-warm-rgb)/0.15)]">
        <span className="w-2 h-2 rounded-full bg-red-300" />
        <span className="w-2 h-2 rounded-full bg-yellow-300" />
        <span className="w-2 h-2 rounded-full bg-green-300" />
        <span className="ml-2 text-[10px] text-[var(--hb-ink-muted)] truncate">thepourlab.cafe</span>
      </div>
      {/* Hero */}
      <div className="px-4 py-8 text-center text-white" style={{ background: state.heroBg }}>
        <h3 className={`text-xl ${headingFont} font-bold leading-tight mb-1`}>{state.heroTitle}</h3>
        <p className="text-xs opacity-90">{state.heroSubtitle}</p>
        <div className="mt-3 inline-block px-3 py-1.5 rounded-md bg-white/20 text-[10px] font-semibold">Order now</div>
      </div>
      {/* Pricing */}
      {state.showPricing && (
        <div className="px-3 py-3 bg-[var(--hb-paper)] border-t border-[rgb(var(--hb-warm-rgb)/0.1)]">
          <div className="text-[10px] uppercase tracking-wide text-[var(--hb-ink-muted)] text-center mb-2">Pricing</div>
          <div className="grid grid-cols-3 gap-1.5">
            {['Single', 'Double', 'Share'].map((tier) => (
              <div key={tier} className="rounded bg-[var(--hb-paper-soft)] py-2 text-center">
                <div className="text-[9px] text-[var(--hb-ink-muted)]">{tier}</div>
                <div className="text-xs font-bold text-[var(--hb-ink)]">$4</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Gallery placeholder */}
      <div className="px-3 py-3 bg-[var(--hb-paper)] border-t border-[rgb(var(--hb-warm-rgb)/0.1)]">
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-square rounded bg-gradient-to-br from-[var(--hb-paper-soft)] to-[rgb(var(--hb-warm-rgb)/0.2)]" />
          ))}
        </div>
      </div>
      {/* Contact form */}
      {state.showContact && (
        <div className="px-3 py-3 bg-[var(--hb-paper-soft)] border-t border-[rgb(var(--hb-warm-rgb)/0.1)]">
          <div className="text-[10px] uppercase tracking-wide text-[var(--hb-ink-muted)] mb-2">Contact</div>
          <div className="space-y-1.5">
            <div className="h-5 rounded bg-white border border-[rgb(var(--hb-warm-rgb)/0.15)]" />
            <div className="h-10 rounded bg-white border border-[rgb(var(--hb-warm-rgb)/0.15)]" />
            <div className="h-5 rounded bg-[var(--hb-warm)]" />
          </div>
        </div>
      )}
      {/* iOS-style home-indicator pill */}
      <div className="flex justify-center py-1.5 bg-[var(--hb-paper)]" aria-hidden="true">
        <span className="block h-1 w-20 rounded-full bg-[var(--hb-ink)]/30" />
      </div>
    </div>
  )
}

export default function Walkthrough() {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [activeIdx, setActiveIdx] = useState(0)
  const [typed, setTyped] = useState(reduced ? STEPS[0].typed : '')
  // Loop 2 / Walkthrough lift — play/pause user control.
  const [paused, setPaused] = useState(false)

  // Cycle through prompts (paused under reduced-motion or when user pauses).
  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % STEPS.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused])

  // Typewriter effect for the active step.
  useEffect(() => {
    if (reduced) {
      setTyped(STEPS[activeIdx].typed)
      return
    }
    setTyped('')
    const full = STEPS[activeIdx].typed
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(full.slice(0, i))
      if (i >= full.length) window.clearInterval(id)
    }, TYPE_MS)
    return () => window.clearInterval(id)
  }, [activeIdx, reduced])

  const activeStep = STEPS[activeIdx]

  return (
    <div className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <style>{KEYFRAMES}</style>
      <MarketingNav />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Describe it. See it.</h1>
          <p className="text-base md:text-lg text-[var(--hb-ink-muted)] max-w-2xl mx-auto">
            Watch a real prompt turn into a real site. Three panes — the words, the work, the result.
          </p>
          {/* Loop 2 / Walkthrough lift — play/pause + scrub indicator
              (1 of 5). Mirrors the P123.5 ListenPreview transport bar. */}
          <div className="mt-5 inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white border border-[rgb(var(--hb-warm-rgb)/0.2)] shadow-sm">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play walkthrough' : 'Pause walkthrough'}
              data-testid="walkthrough-play-pause"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--hb-warm)] text-white hover:bg-[var(--hb-warm-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-warm)] focus-visible:ring-offset-2 transition-colors"
            >
              {paused ? <Play size={12} className="ml-0.5" /> : <Pause size={12} />}
            </button>
            <div className="flex items-center gap-1" aria-label={`Step ${activeIdx + 1} of ${STEPS.length}`}>
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  data-testid={i === activeIdx ? 'walkthrough-scrub-active' : `walkthrough-scrub-${i}`}
                  className={`block h-1.5 rounded-full transition-all ${
                    i === activeIdx
                      ? 'w-6 bg-[var(--hb-warm)]'
                      : 'w-1.5 bg-[var(--hb-ink)]/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono tabular-nums text-[var(--hb-ink-muted)]">
              {activeIdx + 1} / {STEPS.length}
            </span>
          </div>
        </header>

        {/* 3-pane grid: stacks on mobile, side-by-side at md+ */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_3fr_4fr] gap-4 md:gap-6">
          {/* LEFT — prompts */}
          <section
            data-testid="walkthrough-pane-prompts"
            aria-label="Example prompts"
            className="bg-white rounded-2xl border border-[rgb(var(--hb-warm-rgb)/0.2)] p-4 md:p-5 shadow-sm"
          >
            <h2 className="text-xs uppercase tracking-wide text-[var(--hb-ink-muted)] mb-4">Try saying</h2>
            <ul className="space-y-3">
              {STEPS.map((step, i) => {
                const isActive = i === activeIdx
                return (
                  <li
                    key={step.prompt}
                    data-testid={isActive ? 'walkthrough-active-prompt' : `walkthrough-prompt-${i}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-xl border bg-[var(--hb-paper-soft)] px-4 py-3 text-sm md:text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default ${
                      isActive
                        ? 'border-[var(--hb-warm)] opacity-100 wt-active-glow'
                        : 'border-[rgb(var(--hb-warm-rgb)/0.15)] opacity-50 hover:opacity-80'
                    }`}
                    style={
                      isActive
                        ? {
                            // Reuse the global orb-pulse keyframe from index.css —
                            // applied as a soft red boxShadow halo around the active card.
                            boxShadow:
                              '0 0 0 1px rgba(165,28,48,0.3), 0 0 18px 2px rgba(165,28,48,0.35), 0 0 36px 4px rgba(165,28,48,0.18)',
                            animation: 'orb-pulse 4s ease-in-out infinite',
                          }
                        : undefined
                    }
                  >
                    <span className="block text-[var(--hb-ink)] leading-snug">{step.prompt}</span>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* CENTER — typewriter (terminal aesthetic; dark, monospace, crimson caret). */}
          <section
            data-testid="walkthrough-pane-typewriter"
            aria-label="Live response"
            className="bg-[#0f0f10] text-[#e6e6e6] rounded-2xl border border-white/10 p-4 md:p-5 shadow-2xl ring-1 ring-black/30 min-h-[220px] md:min-h-[280px]"
          >
            <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-2 text-[11px] text-white/50">hey-bradley · response</span>
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                live
              </span>
            </div>
            <pre className="font-mono text-sm md:text-[13px] leading-relaxed whitespace-pre-wrap break-words text-emerald-50/90">
              <span className="text-[var(--hb-warm)]">$ </span>
              {typed}
              <span className="wt-caret text-[var(--hb-warm)] font-bold">▍</span>
            </pre>
          </section>

          {/* RIGHT — mobile preview */}
          <section
            data-testid="walkthrough-pane-preview"
            aria-label="Site preview"
            className="bg-[var(--hb-paper-soft)] rounded-2xl border border-[rgb(var(--hb-warm-rgb)/0.2)] p-4 md:p-5 shadow-sm flex items-center justify-center"
          >
            <MobilePreview state={activeStep.preview} />
          </section>
        </div>

        {/* Loop 2 / Walkthrough lift — closing CTA reframed: "Watched the demo
            → now try it yourself." Primary path goes to Builder, secondary
            keeps the open-core link. Adds the longer-story note below the
            buttons so the buttons read as the primary close. */}
        <div className="mt-14 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Now try it yourself.</h2>
          <p className="text-base text-[var(--hb-ink-muted)] mb-6">
            One sentence. Real site. The same thing you just watched, but with your idea.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <Link
              to="/builder"
              data-testid="walkthrough-cta-try"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] bg-[var(--hb-warm)] text-white font-semibold rounded-xl hover:bg-[var(--hb-warm-hover)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Try it yourself <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/bar181/hey-bradley-core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] border border-[rgb(var(--hb-warm-rgb)/0.3)] text-[var(--hb-ink)] font-semibold rounded-xl hover:bg-[var(--hb-paper-soft)] transition-colors"
            >
              View the open core <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-7 text-sm text-[var(--hb-ink-muted)] italic">
            Want the longer story? Read{' '}
            <Link to="/blog/describe-it-see-it" className="text-[var(--hb-warm)] not-italic font-semibold hover:underline">
              the full narrative on the blog
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
