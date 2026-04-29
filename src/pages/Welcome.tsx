import { Link } from "react-router-dom"
import { ArrowRight, Mic, MessageSquare, SlidersHorizontal } from "lucide-react"
import { MarketingNav } from "@/components/MarketingNav"

const MODES = [
  {
    icon: SlidersHorizontal,
    title: "Builder",
    desc: "Drag-and-drop sections. Tune CSS. Edit JSON directly. The classic site-builder surface, with everything visible.",
    cta: "Open Builder",
    href: "/onboarding",
  },
  {
    icon: MessageSquare,
    title: "Chat",
    desc: "Type what you want. Hey Bradley updates the JSON, the preview, and the spec all at once. Five LLM providers; bring your own key.",
    cta: "Try Chat",
    href: "/onboarding",
  },
  {
    icon: Mic,
    title: "Listen",
    desc: "Push to talk. Describe a change in your own words. Web Speech API transcribes; the same chat pipeline applies it.",
    cta: "Try Listen",
    href: "/onboarding",
  },
]

export function Welcome() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">
          Harvard ALM Capstone &middot; AISP-powered
        </p>
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
          Tell Bradley what you want. Watch it appear.
        </h1>
        <p className="text-xl text-[#6b5e4f] leading-relaxed mb-8">
          A whiteboard that listens, builds what you describe in real-time, and
          writes enterprise specs in the background. Local-only. BYOK. No backend.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8772e] text-white font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg"
          >
            Try it now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/bar181/hey-bradley-core"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-[#f1ece4] transition-colors"
          >
            Open core on GitHub
          </a>
          <Link
            to="/aisp"
            className="inline-flex items-center gap-2 px-6 py-3 text-[#6b5e4f] font-semibold rounded-xl hover:bg-[#f1ece4] transition-colors"
          >
            Read the AISP spec
          </Link>
        </div>
      </section>

      {/* The Story (Don Miller blog-style) */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-4">The 55% problem</h2>
        <p className="text-[#6b5e4f] leading-relaxed mb-4">
          AI made coding three times faster. But coding was never the bottleneck.
          The real cost is everything that happens <em>before</em> the first line
          of code &mdash; the meetings, the specs, the &ldquo;that&rsquo;s not what I meant.&rdquo;
        </p>
        <p className="text-[#6b5e4f] leading-relaxed mb-4">
          Industry research finds <strong className="text-[#2d1f12]">40&ndash;65% of implementation intent</strong> is
          lost in each stakeholder-to-builder handoff. Faster AI just plays the
          telephone game at higher speed.
        </p>
        <p className="text-[#6b5e4f] leading-relaxed">
          Hey Bradley is built for that 55%. Tell it what you want. The site
          appears. The spec appears next to it &mdash; in plain English and in AISP,
          a math-first format LLMs understand natively. Hand the spec to your AI
          coding tool. Get a real product.
        </p>
      </article>

      {/* Three Modes — C11: vertical snap-list carousel on <sm (max-width: 639px,
          Tailwind's closest match to the historical <600px target from P22). */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-6">Three ways in</h2>
        <div className="grid md:grid-cols-3 gap-4 max-sm:grid-cols-1 max-sm:snap-y max-sm:snap-mandatory max-sm:overflow-y-auto max-sm:max-h-[80vh] max-sm:gap-3">
          {MODES.map((m) => (
            <Link
              key={m.title}
              to={m.href}
              className="bg-white border border-[#e8772e]/20 rounded-2xl p-6 hover:border-[#e8772e]/60 hover:shadow-md transition-all group max-sm:snap-center max-sm:min-h-[60vh] max-sm:flex max-sm:flex-col max-sm:justify-center"
            >
              <m.icon className="w-7 h-7 text-[#e8772e] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{m.title}</h3>
              <p className="text-sm text-[#6b5e4f] leading-relaxed mb-4">{m.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#e8772e] group-hover:gap-2 transition-all">
                {m.cta} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* What You Get (blog-style summary) */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-4">What you get</h2>
        <p className="text-[#6b5e4f] leading-relaxed mb-4">
          A live React preview of your site, updated as you talk or type. A
          single JSON file behind everything &mdash; portable, exportable, AI-
          readable. An AISP Crystal Atom spec with under 2% ambiguity, side-by-
          side with a human-readable version your team can review.
        </p>
        <p className="text-[#6b5e4f] leading-relaxed">
          12 themes. 17 example sites. 16 section types. 300 images. Export the
          whole project as a <code className="text-sm bg-[#f1ece4] px-2 py-0.5 rounded">.heybradley</code> zip.
          Import it later. Hand it to your AI coding system. Or paste the AISP
          spec into your prompt and let the agent build production code.
        </p>
      </article>

      {/* Open Core vs Commercial (single sentence) */}
      <article className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold mb-4">Open core vs commercial</h2>
        <p className="text-[#6b5e4f] leading-relaxed">
          What you see here is the <strong className="text-[#2d1f12]">open core</strong> &mdash; MIT-licensed,
          single-page sites, BYOK, local storage, no backend. The commercial
          version (separate repo, post-MVP) adds Supabase auth, hosted demo
          without BYOK, multi-page sites, complex apps, and the agentic support
          system. This page is the open core. <Link to="/open-core" className="text-[#e8772e] underline">Read the differences here.</Link>
        </p>
      </article>

      {/* Closing CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#e8772e] text-white font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg text-lg"
        >
          Try it now
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-[#6b5e4f] mt-4">
          No account required. No key required for Simulated mode.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#e8772e]/20 bg-[#f1ece4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#6b5e4f] mb-2">Harvard ALM Capstone &mdash; Digital Media Design &mdash; May 2026</p>
          <p className="text-sm text-[#6b5e4f]">Bradley Ross &mdash; Creator of AISP &mdash; bar181@yahoo.com</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-[#6b5e4f]">
            <a href="https://github.com/bar181/hey-bradley-core" className="hover:text-[#e8772e] transition-colors" target="_blank" rel="noopener noreferrer">Open core repo</a>
            <a href="https://github.com/bar181/aisp-open-core" className="hover:text-[#e8772e] transition-colors" target="_blank" rel="noopener noreferrer">AISP open core</a>
            <Link to="/about" className="hover:text-[#e8772e] transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
