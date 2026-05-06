import { Link } from "react-router-dom"
import { ArrowRight, Mic, MessageSquare, SlidersHorizontal, Code2, FileText } from "lucide-react"
import { MarketingNav } from "@/components/MarketingNav"
import { useReveal } from "@/hooks/useReveal"

// P118 / F1 — Apple-style 5-section scroll story.
// Reframes from engineer-first ("Messy ideas → enterprise specs, instantly.")
// to user-first ("Describe it. See it."). No numbers, no competitor names,
// no jargon. Pure CSS animation, scoped class names, prefers-reduced-motion
// honored on every animated surface.

const HERO_KEYFRAMES = `
@keyframes hb-hero-type {
  0% { width: 0; }
  60% { width: 100%; }
  100% { width: 100%; }
}
@keyframes hb-hero-caret {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes hb-hero-morph {
  0%, 55% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes hb-doc-fly-1 {
  0%, 30% { opacity: 0; transform: translate(0, 0) rotate(-4deg); }
  100% { opacity: 1; transform: translate(36px, -22px) rotate(-4deg); }
}
@keyframes hb-doc-fly-2 {
  0%, 30% { opacity: 0; transform: translate(0, 0) rotate(3deg); }
  100% { opacity: 1; transform: translate(48px, 4px) rotate(3deg); }
}
@keyframes hb-doc-fly-3 {
  0%, 30% { opacity: 0; transform: translate(0, 0) rotate(-2deg); }
  100% { opacity: 1; transform: translate(28px, 28px) rotate(-2deg); }
}
.hb-hero-typing {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid var(--hb-warm);
  animation: hb-hero-type 2.4s steps(34, end) forwards, hb-hero-caret 0.7s step-end infinite;
}
.hb-hero-morph {
  opacity: 0;
  animation: hb-hero-morph 1.2s ease-out 2.2s forwards;
}
.hb-doc-1 { animation: hb-doc-fly-1 1.4s ease-out 0.4s forwards; opacity: 0; }
.hb-doc-2 { animation: hb-doc-fly-2 1.4s ease-out 0.6s forwards; opacity: 0; }
.hb-doc-3 { animation: hb-doc-fly-3 1.4s ease-out 0.8s forwards; opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .hb-hero-typing { animation: none; width: 100%; border-right: 0; }
  .hb-hero-morph { animation: none; opacity: 1; }
  .hb-doc-1, .hb-doc-2, .hb-doc-3 { animation: none; opacity: 1; }
}
`

const WAYS = [
  { icon: Mic, title: "Speak", desc: "Describe it out loud." },
  { icon: MessageSquare, title: "Type", desc: "Write a sentence or two." },
  { icon: SlidersHorizontal, title: "Adjust", desc: "Tweak what you see." },
]

export function Welcome() {
  const s2 = useReveal<HTMLElement>()
  const s3 = useReveal<HTMLElement>()
  const s4 = useReveal<HTMLElement>()
  const s5 = useReveal<HTMLElement>()

  return (
    <main className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <style>{HERO_KEYFRAMES}</style>
      <MarketingNav />

      {/* Section 1 — Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Describe it. See it.
            </h1>
            <p className="text-xl text-[var(--hb-ink-muted)] leading-relaxed mb-8">
              The website builder that finally works the way you talk.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/new-project"
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-[var(--hb-warm)] text-white font-semibold rounded-xl hover:bg-[var(--hb-warm-hover)] transition-colors shadow-lg"
              >
                Start describing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/walkthrough"
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] border border-[rgb(var(--hb-warm-rgb)/0.3)] text-[var(--hb-ink)] font-semibold rounded-xl hover:bg-[var(--hb-paper-soft)] transition-colors"
              >
                Watch the walkthrough <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Animated hero demo: typed sentence morphs into a stylized hero block */}
          <div
            className="relative bg-white rounded-2xl border border-[rgb(var(--hb-warm-rgb)/0.2)] p-6 shadow-sm overflow-hidden"
            aria-hidden="true"
          >
            <div className="text-sm text-[var(--hb-ink-muted)] mb-5 font-mono">
              <span className="hb-hero-typing">a website for our coffee shop</span>
            </div>
            <div className="hb-hero-morph">
              <div className="rounded-xl bg-[var(--hb-paper-soft)] p-5 border border-[rgb(var(--hb-warm-rgb)/0.15)]">
                <div className="h-3 w-2/3 rounded bg-[var(--hb-ink)] opacity-80 mb-3" />
                <div className="h-2 w-full rounded bg-[var(--hb-ink-muted)] opacity-40 mb-2" />
                <div className="h-2 w-5/6 rounded bg-[var(--hb-ink-muted)] opacity-40 mb-5" />
                <div className="inline-block h-8 w-28 rounded-lg bg-[var(--hb-warm)]" />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="h-16 rounded-lg bg-[var(--hb-paper-soft)] border border-[rgb(var(--hb-warm-rgb)/0.12)]" />
                <div className="h-16 rounded-lg bg-[var(--hb-paper-soft)] border border-[rgb(var(--hb-warm-rgb)/0.12)]" />
                <div className="h-16 rounded-lg bg-[var(--hb-paper-soft)] border border-[rgb(var(--hb-warm-rgb)/0.12)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — It works the way you talk */}
      <section
        id="how-it-works"
        ref={s2.ref}
        className={`max-w-5xl mx-auto px-6 py-20 transition-all duration-700 ${
          s2.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          It works the way you talk.
        </h2>
        <p className="text-lg text-[var(--hb-ink-muted)] leading-relaxed mb-10 max-w-2xl">
          Speak it. Type it. Drag it. Whatever feels right today.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {WAYS.map((w) => (
            <Link
              key={w.title}
              to="/new-project"
              className="group block p-5 min-h-[44px] rounded-2xl bg-white border border-[rgb(var(--hb-warm-rgb)/0.15)] hover:border-[rgb(var(--hb-warm-rgb)/0.5)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-warm)] transition-transform duration-200 hover:scale-[1.02]"
            >
              <w.icon className="w-7 h-7 text-[var(--hb-warm)] mb-3" />
              <h3 className="text-lg font-semibold mb-1">{w.title}</h3>
              <p className="text-sm text-[var(--hb-ink-muted)] leading-relaxed">{w.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3 — Take it anywhere */}
      <section
        ref={s3.ref}
        className={`max-w-5xl mx-auto px-6 py-20 transition-all duration-700 ${
          s3.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Take it anywhere.
            </h2>
            <p className="text-lg text-[var(--hb-ink-muted)] leading-relaxed mb-4">
              When you&rsquo;re ready, hand the export to your developer &mdash; or to your AI
              coding assistant. They get the spec they wish every project came with.
            </p>
            <p className="text-lg text-[var(--hb-ink-muted)] leading-relaxed mb-6">
              No clarifying calls. No re-explaining what you meant. Just a website
              that does what you asked for, the first time.
            </p>
            <Link
              to="/blog/the-handoff-that-changes-everything"
              className="inline-flex items-center gap-1 text-[var(--hb-warm)] font-medium hover:gap-2 transition-all"
            >
              Read how the handoff works <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Animated card: document with file-shapes flying out */}
          <div
            className="relative bg-white rounded-2xl border border-[rgb(var(--hb-warm-rgb)/0.2)] p-8 shadow-sm min-h-[260px] flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative">
              <FileText className="w-20 h-20 text-[var(--hb-warm)]" strokeWidth={1.4} />
              <div className="hb-doc-1 absolute top-2 left-10 w-12 h-14 rounded-md bg-[var(--hb-paper-soft)] border border-[rgb(var(--hb-warm-rgb)/0.25)] shadow-sm" />
              <div className="hb-doc-2 absolute top-6 left-12 w-10 h-12 rounded-md bg-[var(--hb-paper-soft)] border border-[rgb(var(--hb-warm-rgb)/0.25)] shadow-sm" />
              <div className="hb-doc-3 absolute top-10 left-8 w-11 h-13 rounded-md bg-[var(--hb-paper-soft)] border border-[rgb(var(--hb-warm-rgb)/0.25)] shadow-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Open core. Yours to keep. (Easter-egg surface) */}
      <section
        ref={s4.ref}
        className={`max-w-5xl mx-auto px-6 py-20 transition-all duration-700 ${
          s4.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Open core. Yours to keep.
            </h2>
            <p className="text-lg text-[var(--hb-ink-muted)] leading-relaxed mb-3">
              Built in the open. Free to try.
            </p>
            <p className="text-lg text-[var(--hb-ink-muted)] leading-relaxed mb-3">
              Bring your own API key, or don&rsquo;t bring one yet.
            </p>
            <p className="text-lg text-[var(--hb-ink-muted)] leading-relaxed mb-6">
              Take your work with you whenever you want &mdash; your site, your spec,
              your call.
            </p>
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--hb-ink-muted)] hover:text-[var(--hb-warm)] transition-colors inline-flex items-center gap-1"
            >
              Read what&rsquo;s coming next <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-[rgb(var(--hb-warm-rgb)/0.2)] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-7 h-7 text-[var(--hb-ink)]" />
              <span className="font-mono text-sm text-[var(--hb-ink-muted)]">
                bar181/aisp-open-core
              </span>
            </div>
            <div className="rounded-lg bg-[var(--hb-paper-soft)] p-4 font-mono text-xs text-[var(--hb-ink-muted)] leading-relaxed">
              <div className="mb-1"><span className="text-[var(--hb-warm)]">$</span> git clone</div>
              <div className="opacity-70">&nbsp;&nbsp;the spec your AI</div>
              <div className="opacity-70">&nbsp;&nbsp;wishes every</div>
              <div className="opacity-70">&nbsp;&nbsp;project came with.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Closing CTA + Trust ribbon */}
      <section
        ref={s5.ref}
        className={`max-w-3xl mx-auto px-6 py-24 text-center transition-all duration-700 ${
          s5.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">
          From your idea to a real site, in your words.
        </h2>
        <Link
          to="/new-project"
          className="inline-flex items-center gap-2 px-8 py-4 min-h-[44px] bg-[var(--hb-warm)] text-white font-semibold rounded-xl hover:bg-[var(--hb-warm-hover)] transition-colors shadow-lg text-lg"
        >
          Start describing
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-[var(--hb-ink-muted)] mt-8 tracking-wide">
          Open source &middot; MIT licensed &middot; Built at Harvard
        </p>
      </section>
    </main>
  )
}
