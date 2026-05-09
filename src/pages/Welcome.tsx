import { Link } from "react-router-dom"
import { ArrowRight, Mic, MessageSquare, SlidersHorizontal, Code2, FileText } from "lucide-react"
import { MarketingNav } from "@/components/MarketingNav"
import { HeroAnimated } from "@/components/marketing/HeroAnimated"
import { CinematicDemo } from "@/components/marketing/CinematicDemo"
import { StatsSection } from "@/components/marketing/StatsSection"
import { AISPSection } from "@/components/marketing/AISPSection"
import { useReveal } from "@/hooks/useReveal"
import { Button } from "@/components/ui/button"

// P121.5 — Harvard crimson redesign. Dark hero with pulsating red orb,
// brad_pixar avatar, Apple-style scroll story.

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
  border-right: 2px solid var(--hb-accent);
  animation: hb-hero-type 1.6s steps(34, end) forwards, hb-hero-caret 0.7s step-end infinite;
}
.hb-hero-morph {
  opacity: 0;
  animation: hb-hero-morph 1.2s ease-out 1.2s forwards;
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
    <main className="dark marketing-overhaul min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]">
      <style>{HERO_KEYFRAMES}</style>
      <MarketingNav />

      {/* P125.5 / W2 — Animated hero (orb + rings + particles + waveform +
          avatar + animated typing). Replaces the static hero shipped in P125. */}
      <HeroAnimated />

      {/* P125 / W4 — cinematic demo, now in its own breathing-room section. */}
      <section className="px-6 py-16" style={{ backgroundColor: "var(--hb-deep)" }}>
        <CinematicDemo />
      </section>

      {/* P125 / W5 — Stats section (capstone v8 slide 8). */}
      <StatsSection />

      {/* Section 2 — It works the way you talk (P125 / W7 redesign) */}
      <section
        id="how-it-works"
        ref={s2.ref}
        className={`max-w-5xl mx-auto px-6 py-24 transition-all duration-700 ${
          s2.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="marketing-eyebrow mb-5">Three ways in</div>
        <h2 className="marketing-h2 mb-4 max-w-2xl">
          It works the way <em>you talk.</em>
        </h2>
        <p className="marketing-body max-w-2xl mb-12">
          Speak it. Type it. Drag it. Whatever feels right today.
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {WAYS.map((w) => (
            <Link
              key={w.title}
              to="/new-project"
              className="marketing-feature-card group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]"
            >
              <w.icon
                className="w-7 h-7 mb-5"
                style={{ color: "var(--hb-blue)" }}
              />
              <h3
                className="mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "26px",
                  lineHeight: 1.1,
                  color: "var(--hb-text-primary)",
                }}
              >
                {w.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-[var(--hb-text-secondary)]">
                {w.desc}
              </p>
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
            <span
              className="inline-block w-12 h-1 rounded-full bg-[var(--hb-accent)] mb-4"
              aria-hidden="true"
            />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Take it anywhere.
            </h2>
            <p className="text-lg text-[var(--hb-text-secondary)] leading-relaxed mb-4">
              When you&rsquo;re ready, hand the export to your developer &mdash; or to your AI
              coding assistant. They get the spec they wish every project came with.
            </p>
            <p className="text-lg text-[var(--hb-text-secondary)] leading-relaxed mb-6">
              No clarifying calls. No re-explaining what you meant. Just a website
              that does what you asked for, the first time.
            </p>
            <Link
              to="/blog/the-handoff-that-changes-everything"
              className="inline-flex items-center gap-1 text-[var(--hb-accent)] font-medium hover:gap-2 transition-all"
            >
              Read how the handoff works <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            className="relative bg-[var(--hb-surface)] rounded-2xl border border-[var(--hb-border)] p-8 shadow-sm min-h-[260px] flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative">
              <FileText className="w-20 h-20 text-[var(--hb-accent)]" strokeWidth={1.4} />
              <div className="hb-doc-1 absolute top-2 left-10 w-12 h-14 rounded-md bg-[var(--hb-bg)] border border-[var(--hb-border)] shadow-sm" />
              <div className="hb-doc-2 absolute top-6 left-12 w-10 h-12 rounded-md bg-[var(--hb-bg)] border border-[var(--hb-border)] shadow-sm" />
              <div className="hb-doc-3 absolute top-10 left-8 w-11 h-13 rounded-md bg-[var(--hb-bg)] border border-[var(--hb-border)] shadow-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* P125 / W6 — AISP marketing section (capstone v8 slides 6+7). */}
      <AISPSection />

      {/* Section 4 — Open core */}
      <section
        ref={s4.ref}
        className={`max-w-5xl mx-auto px-6 py-20 transition-all duration-700 ${
          s4.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span
              className="inline-block w-12 h-1 rounded-full bg-[var(--hb-accent)] mb-4"
              aria-hidden="true"
            />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Open core. Yours to keep.
            </h2>
            <p className="text-lg text-[var(--hb-text-secondary)] leading-relaxed mb-3">
              Built in the open. Free to try.
            </p>
            <p className="text-lg text-[var(--hb-text-secondary)] leading-relaxed mb-3">
              Bring your own API key, or don&rsquo;t bring one yet.
            </p>
            <p className="text-lg text-[var(--hb-text-secondary)] leading-relaxed mb-6">
              Take your work with you whenever you want &mdash; your site, your spec,
              your call.
            </p>
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--hb-text-muted)] hover:text-[var(--hb-accent)] transition-colors inline-flex items-center gap-1"
            >
              Read what&rsquo;s coming next <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-[var(--hb-surface)] rounded-2xl border border-[var(--hb-border)] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-7 h-7 text-[var(--hb-text-primary)]" />
              <span className="font-mono text-sm text-[var(--hb-text-muted)]">
                bar181/aisp-open-core
              </span>
            </div>
            <div className="rounded-lg bg-[var(--hb-bg)] p-4 font-mono text-xs text-[var(--hb-text-muted)] leading-relaxed">
              <div className="mb-1"><span className="text-[var(--hb-accent)]">$</span> git clone</div>
              <div className="opacity-70">&nbsp;&nbsp;the spec your AI</div>
              <div className="opacity-70">&nbsp;&nbsp;wishes every</div>
              <div className="opacity-70">&nbsp;&nbsp;project came with.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Closing CTA */}
      <section
        ref={s5.ref}
        className={`max-w-3xl mx-auto px-6 py-24 text-center transition-all duration-700 ${
          s5.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">
          From your idea to a real site, in your words.
        </h2>
        {/* P122 / W8 — closing CTA promoted to shadcn Button. */}
        <Button
          size="lg"
          render={<Link to="/new-project" />}
          className="min-h-[44px] gap-2 rounded-xl px-8 py-4 text-lg font-semibold shadow-lg bg-[var(--hb-accent)] text-white hover:bg-[var(--hb-accent-hover)]"
        >
          Start describing
          <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="text-xs text-[var(--hb-text-muted)] mt-8 tracking-wide">
          Open source &middot; MIT licensed &middot; ALM &middot; Harvard University
        </p>
      </section>

      {/* P123.5 — minimal footer (carry-forward from P122 §4-A-4).
          Links open in same tab for nav routes; GitHub opens external.
          Tokens-only; brand-locked Crimson via var(--hb-accent). */}
      <footer
        className="border-t border-[var(--hb-border)] bg-[var(--hb-surface)] mt-8"
        role="contentinfo"
      >
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--hb-text-muted)]">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Footer">
            <Link to="/blog" className="hover:text-[var(--hb-accent)] transition-colors">Blog</Link>
            <Link to="/open-core" className="hover:text-[var(--hb-accent)] transition-colors">Open Core</Link>
            <a
              href="https://github.com/bar181/hey-bradley-core"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--hb-accent)] transition-colors"
            >
              GitHub
            </a>
            <Link to="/aisp" className="hover:text-[var(--hb-accent)] transition-colors">
              Built with AISP
            </Link>
          </nav>
          <div className="text-[var(--hb-text-muted)]/80">
            Harvard ALM 2026
          </div>
        </div>
      </footer>
    </main>
  )
}
