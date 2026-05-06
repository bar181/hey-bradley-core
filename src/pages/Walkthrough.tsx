import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { useReveal } from '@/hooks/useReveal'

// P118.5 / WALKTHROUGH — section-like story page at /walkthrough.
// Mounts inside MarketingNav layout. <main> is the scroll-snap container;
// 6 sequential <section min-h-screen scroll-snap-align-start> elements.
// Visitor-paced (no auto-advance). Don Miller voice — brand invisible until
// Scene 6. CSS animation only; no new deps. KISS denylist per ADR-144 D5.

const KEYFRAMES = `
@keyframes wt-caret { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
@keyframes wt-fade-up { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
@keyframes wt-slide-in { from { opacity: 0; transform: translateX(-16px) } to { opacity: 1; transform: translateX(0) } }
@keyframes wt-pulse { 0%,100% { opacity: 0.4; transform: translateY(0) } 50% { opacity: 1; transform: translateY(4px) } }
.wt-caret { animation: wt-caret 0.9s step-end infinite }
.wt-fade-up { opacity: 0; animation: wt-fade-up 0.7s ease-out forwards }
.wt-slide-in { opacity: 0; animation: wt-slide-in 0.5s ease-out forwards }
.wt-pulse { animation: wt-pulse 1.6s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) {
  .wt-caret, .wt-pulse { animation: none }
  .wt-fade-up, .wt-slide-in { animation: none; opacity: 1 }
}
`

const CHANGELOG = [
  'Changed the headline. Felt more honest.',
  'Swapped the photo. The window light was better.',
  'Added our hours. We close on Mondays now.',
  'Moved the menu up. People kept missing it.',
]

const FILES = [
  'the spec your developer reads',
  'your site, page by page',
  'every decision, in writing',
  'tests, ready to run',
]

const TYPED_LINES = [
  'make me a site for my coffee shop in asheville',
  '',
  'warm. not pretentious. just a menu and our story.',
]

function Typewriter({ active }: { active: boolean }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  const full = TYPED_LINES.join('\n')
  const [shown, setShown] = useState(reduced ? full : '')
  useEffect(() => {
    if (!active || reduced) return
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setShown(full.slice(0, i))
      if (i >= full.length) window.clearInterval(id)
    }, 38)
    return () => window.clearInterval(id)
  }, [active, full, reduced])
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed">
      {shown}<span className="wt-caret text-[var(--hb-warm)]">|</span>
    </pre>
  )
}

const SCENE = 'snap-start min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16'
const CARD = 'bg-white rounded-2xl border border-[rgb(var(--hb-warm-rgb)/0.2)] shadow-sm'
const CTA_GHOST = 'inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] border border-[rgb(var(--hb-warm-rgb)/0.3)] text-[var(--hb-ink)] font-semibold rounded-xl hover:bg-[var(--hb-paper-soft)] transition-colors'

export default function Walkthrough() {
  const s2 = useReveal<HTMLElement>()
  const s3 = useReveal<HTMLElement>()
  const s4 = useReveal<HTMLElement>()
  const s5 = useReveal<HTMLElement>()
  const s6 = useReveal<HTMLElement>()

  return (
    <div className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <style>{KEYFRAMES}</style>
      <MarketingNav />
      <main className="snap-y snap-mandatory overflow-y-auto h-[calc(100vh-4rem)]" aria-label="Walkthrough story">

        {/* Scene 1 — The moment */}
        <section className={SCENE}>
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              I needed a website. <span className="italic font-serif text-[var(--hb-warm)]">By Tuesday.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--hb-ink-muted)] mb-12">
              I&rsquo;d tried the others. They didn&rsquo;t get me there.
            </p>
            <div className={`mx-auto overflow-hidden max-w-md ${CARD}`} aria-hidden="true">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[rgb(var(--hb-warm-rgb)/0.15)] bg-[var(--hb-paper-soft)]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
              </div>
              <div className="p-12 text-left min-h-[160px] flex items-center">
                <span className="wt-caret text-2xl text-[var(--hb-ink-muted)]">|</span>
              </div>
            </div>
            <div className="mt-12 text-[var(--hb-ink-muted)] flex flex-col items-center gap-1">
              <span className="text-xs tracking-wide">scroll</span>
              <ChevronDown className="w-4 h-4 wt-pulse" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Scene 2 — Describe it */}
        <section ref={s2.ref} className={SCENE}>
          <div className={`max-w-2xl w-full text-center transition-opacity duration-700 ${s2.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">So I just described it.</h2>
            <div className={`${CARD} p-6 md:p-8 text-left min-h-[180px]`}>
              <Typewriter active={s2.isVisible} />
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mt-6">Speak it. Type it. Either works.</p>
          </div>
        </section>

        {/* Scene 3 — See it */}
        <section ref={s3.ref} className={SCENE}>
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">It just appeared.</h2>
            <div className={`${CARD} p-6 space-y-3`} aria-hidden="true">
              <div className={`rounded-lg bg-[var(--hb-paper-soft)] p-5 ${s3.isVisible ? 'wt-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                <div className="h-3 w-2/3 mx-auto rounded bg-[var(--hb-ink)] opacity-80 mb-3" />
                <div className="h-2 w-1/2 mx-auto rounded bg-[var(--hb-ink-muted)] opacity-40" />
              </div>
              <div className={`grid grid-cols-3 gap-2 ${s3.isVisible ? 'wt-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.45s' }}>
                <div className="h-12 rounded bg-[var(--hb-paper-soft)]" />
                <div className="h-12 rounded bg-[var(--hb-paper-soft)]" />
                <div className="h-12 rounded bg-[var(--hb-paper-soft)]" />
              </div>
              <div className={`grid grid-cols-2 gap-2 ${s3.isVisible ? 'wt-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                <div className="h-16 rounded bg-[var(--hb-paper-soft)]" />
                <div className="h-16 rounded bg-[var(--hb-paper-soft)]" />
              </div>
            </div>
            <p className="text-base text-[var(--hb-ink-muted)] mt-8">Then I changed my mind, and it changed too.</p>
          </div>
        </section>

        {/* Scene 4 — Iterate (friend voice) */}
        <section ref={s4.ref} className={SCENE}>
          <div className="max-w-2xl w-full">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 text-center">I kept talking. It kept listening.</h2>
            <ul className="space-y-3">
              {CHANGELOG.map((line, i) => (
                <li key={line} className={`bg-white rounded-xl border border-[rgb(var(--hb-warm-rgb)/0.15)] px-5 py-4 text-base md:text-lg ${s4.isVisible ? 'wt-slide-in' : 'opacity-0'}`} style={{ animationDelay: `${0.15 + i * 0.18}s` }}>
                  <span className="text-[var(--hb-warm)] mr-3">·</span>{line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Scene 5 — Take it anywhere */}
        <section ref={s5.ref} className={SCENE}>
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Then it was ready to ship.</h2>
            <p className="text-lg md:text-xl text-[var(--hb-ink-muted)] leading-relaxed mb-10">
              I sent the export to my nephew. He opened it in his AI coding assistant.
              He didn&rsquo;t ask me a single clarifying question.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto" aria-hidden="true">
              {FILES.map((label, i) => (
                <div key={label} className={`bg-white rounded-lg border border-[rgb(var(--hb-warm-rgb)/0.2)] p-4 text-left text-sm text-[var(--hb-ink-muted)] ${s5.isVisible ? 'wt-fade-up' : 'opacity-0'}`} style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                  {label}
                </div>
              ))}
            </div>
            <Link to="/blog/the-handoff-that-changes-everything" className="inline-flex items-center gap-1 mt-10 text-sm italic text-[var(--hb-warm)] hover:gap-2 transition-all">
              Read how the handoff works <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Scene 6 — Close (brand enters) */}
        <section ref={s6.ref} className={SCENE}>
          <div className={`max-w-2xl w-full text-center transition-opacity duration-700 ${s6.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              From your idea to a real site, in your words.
            </h2>
            <p className="text-base md:text-lg text-[var(--hb-ink-muted)] mb-10">
              Open source. MIT licensed. Free to try.
            </p>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-4">
              <Link to="/new-project" className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-[var(--hb-warm)] text-white font-semibold rounded-xl hover:bg-[var(--hb-warm-hover)] transition-colors shadow-lg">
                Start describing <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://github.com/bar181/hey-bradley-core" target="_blank" rel="noopener noreferrer" className={CTA_GHOST}>
                View the open core <ArrowRight className="w-4 h-4" />
              </a>
              <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className={CTA_GHOST}>
                Read what&rsquo;s coming next <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-[var(--hb-ink-muted)] mt-10 tracking-wide">
              Open source &middot; MIT licensed &middot; Built at Harvard
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
