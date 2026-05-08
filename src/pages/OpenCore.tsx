import { Link } from 'react-router-dom'
import { ArrowRight, Code2, ExternalLink } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { HeroOrb } from '@/components/marketing/HeroOrb'
import { useReveal } from '@/hooks/useReveal'

// Unsplash images matched to content
const IMG = {
  hero: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&auto=format&q=80', // data visualization globe
  code: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&q=80', // code on screen
  team: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&q=80', // team collaboration
  arch: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&q=80', // architecture
}

const VIDEO_BG = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4'

export function OpenCore() {
  const r1 = useReveal<HTMLElement>()
  const r2 = useReveal<HTMLElement>()
  const r3 = useReveal<HTMLElement>()
  const r4 = useReveal<HTMLElement>()
  const r5 = useReveal<HTMLElement>()

  return (
    <main className="dark min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]">
      <MarketingNav />

      {/* Hero — full-bleed with video + orb overlay */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          src={VIDEO_BG}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--hb-bg)]/60 via-transparent to-[var(--hb-bg)]" />
        <HeroOrb size={700} opacity={35} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <img
              src="/images/bradley-headshot.jpeg"
              alt="Bradley Ross"
              className="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover border-2 border-[var(--hb-accent)]/50 shadow-2xl flex-shrink-0"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--hb-accent)] font-semibold mb-3">
                Harvard ALM Capstone &middot; May 2026
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-4">
                The spec layer<br />nobody built.
              </h1>
              <p className="text-lg md:text-xl text-[var(--hb-text-secondary)] leading-relaxed max-w-xl mb-2">
                AI made coding faster.<br />
                But coding was never the bottleneck.
              </p>
              <p className="text-sm text-[var(--hb-text-muted)] mb-8">
                Bradley Ross &middot; Agentic Engineer &middot; ALM, Digital Media Design
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/new-project" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--hb-accent)] text-white font-semibold rounded-xl hover:bg-[var(--hb-accent-hover)] transition-colors shadow-lg">
                  Try the builder <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/blog/research-the-telephone-game" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                  Read the research <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data viz — the 55% problem */}
      <section ref={r1.ref} className={`py-20 md:py-28 transition-all duration-700 ${r1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-center">
            The 55% nobody talks about.
          </h2>
          <p className="text-center text-[var(--hb-text-secondary)] text-lg mb-14 max-w-2xl mx-auto">
            AI compressed coding from 35% to 15% of total effort.<br />
            The spec layer expanded to fill the gap.
          </p>

          {/* Visual bar chart */}
          <div className="max-w-3xl mx-auto space-y-6 mb-14">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Concept to Spec</span>
                <span className="text-[var(--hb-accent)] font-bold">55%</span>
              </div>
              <div className="h-4 bg-[var(--hb-surface)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--hb-accent)] to-[#C1283E] rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Writing Code</span>
                <span className="text-emerald-400 font-bold">15%</span>
              </div>
              <div className="h-4 bg-[var(--hb-surface)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Testing &amp; Deploy</span>
                <span className="text-blue-400 font-bold">30%</span>
              </div>
              <div className="h-4 bg-[var(--hb-surface)] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
          </div>

          {/* 3 stat cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-8 bg-[var(--hb-surface)] rounded-2xl border border-[var(--hb-border)]">
              <div className="text-5xl font-extrabold text-[var(--hb-accent)] mb-2">55%</div>
              <p className="text-sm text-[var(--hb-text-muted)]">of effort is pre-code</p>
            </div>
            <div className="text-center p-8 bg-[var(--hb-surface)] rounded-2xl border border-[var(--hb-border)]">
              <div className="text-5xl font-extrabold text-[var(--hb-accent)] mb-2">7.8%</div>
              <p className="text-sm text-[var(--hb-text-muted)]">intent survives 5 handoffs</p>
            </div>
            <div className="text-center p-8 bg-[var(--hb-surface)] rounded-2xl border border-[var(--hb-border)]">
              <div className="text-5xl font-extrabold text-emerald-400 mb-2">90.4%</div>
              <p className="text-sm text-[var(--hb-text-muted)]">with AISP protocol</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image break */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={IMG.code} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--hb-bg)] via-transparent to-[var(--hb-bg)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <blockquote className="text-2xl md:text-4xl font-bold text-center max-w-3xl px-6 leading-tight">
            &ldquo;The meeting <em>is</em> the sprint.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* AISP protocol */}
      <section ref={r2.ref} className={`py-20 md:py-28 transition-all duration-700 ${r2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold mb-3">The Protocol</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
                Near-zero ambiguity.<br />By design.
              </h2>
              <p className="text-[var(--hb-text-secondary)] leading-relaxed mb-4">
                AISP uses 512 mathematical symbols that AI models understand natively. No instructions needed.
              </p>
              <p className="text-[var(--hb-text-secondary)] leading-relaxed mb-6">
                Traditional specs say &ldquo;add a form.&rdquo; Crystal Atoms specify every field, validation rule, database table, API endpoint, and verification step.
              </p>
              <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--hb-accent)] font-semibold hover:gap-3 transition-all">
                Explore AISP on GitHub <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Crystal Atom code block */}
            <div className="bg-[#0d1117] border border-[var(--hb-border)] rounded-2xl p-6 font-mono text-sm leading-[2.2] overflow-x-auto shadow-2xl">
              <div className="text-[var(--hb-text-muted)] mb-1">// Crystal Atom — zero room for interpretation</div>
              <span className="text-[var(--hb-accent)] font-bold text-lg">{'⟦'}</span><br />
              {'  '}<span className="text-amber-400">&Omega;</span>{' := Patient intake form with progress bar'}<br />
              {'  '}<span className="text-amber-400">&Sigma;</span>{' := Form:{sections:[Demo, History, Meds, Confirm]}'}<br />
              {'  '}<span className="text-amber-400">&Gamma;</span>{' := R1: reuse PatientAuth from src/auth/'}<br />
              {'  '}<span className="text-amber-400">&Lambda;</span>{' := route:="/intake/new", api:=POST /api/v2/intake'}<br />
              {'  '}<span className="text-amber-400">&Epsilon;</span>{' := V1: 4 sections render, V2: progress advances'}<br />
              <span className="text-[var(--hb-accent)] font-bold text-lg">{'⟧'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image break — team */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={IMG.team} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--hb-bg)] via-transparent to-[var(--hb-bg)]" />
      </div>

      {/* How it works — 3 steps */}
      <section ref={r3.ref} className={`py-20 md:py-28 transition-all duration-700 ${r3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-center">
            Describe. See. Ship.
          </h2>
          <p className="text-center text-[var(--hb-text-secondary)] text-lg mb-14 max-w-xl mx-auto">
            Three steps. No telephone game.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Describe it', desc: 'Speak or type what you want. The builder captures your exact words.' },
              { num: '02', title: 'See it live', desc: 'Watch your site appear in real time. Change anything by talking.' },
              { num: '03', title: 'Ship the spec', desc: 'Export a spec any AI coding tool executes on the first try.' },
            ].map((step) => (
              <div key={step.num} className="relative p-8 bg-[var(--hb-surface)] border border-[var(--hb-border)] rounded-2xl">
                <div className="text-6xl font-extrabold text-[var(--hb-accent)]/10 absolute top-4 right-6">{step.num}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-[var(--hb-text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Repositories */}
      <section ref={r4.ref} className={`py-20 md:py-28 transition-all duration-700 ${r4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-center">
            Two repos. One vision.
          </h2>
          <p className="text-center text-[var(--hb-text-secondary)] mb-12">Open source. MIT licensed. Built at Harvard.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="https://github.com/bar181/hey-bradley-core" target="_blank" rel="noopener noreferrer"
              className="group p-8 bg-[var(--hb-surface)] border border-[var(--hb-border)] rounded-2xl hover:border-[var(--hb-accent)]/40 hover:shadow-[0_4px_30px_rgba(165,28,48,0.1)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="w-6 h-6 text-[var(--hb-text-muted)]" />
                <span className="font-mono text-sm text-[var(--hb-text-muted)]">bar181/hey-bradley-core</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Hey Bradley</h3>
              <p className="text-sm text-[var(--hb-text-secondary)] leading-relaxed">
                The reference implementation. Visual builder, themes, media library, spec generators. React + TypeScript + Tailwind.
              </p>
            </a>
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer"
              className="group p-8 bg-[var(--hb-surface)] border border-[var(--hb-border)] rounded-2xl hover:border-purple-500/40 hover:shadow-[0_4px_30px_rgba(147,51,234,0.1)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="w-6 h-6 text-[var(--hb-text-muted)]" />
                <span className="font-mono text-sm text-[var(--hb-text-muted)]">bar181/aisp-open-core</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AISP Protocol</h3>
              <p className="text-sm text-[var(--hb-text-secondary)] leading-relaxed">
                The specification protocol. Crystal Atom notation, 512 symbols, validation tools, and ambiguity measurement.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={r5.ref} className={`py-20 md:py-28 relative overflow-hidden transition-all duration-700 ${r5.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <HeroOrb size={500} opacity={25} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            The telephone game<br />is over.
          </h2>
          <p className="text-[var(--hb-text-secondary)] mb-10 text-lg max-w-xl mx-auto">
            Describe what you see. Watch it appear. What you approved is what ships.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/new-project" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--hb-accent)] text-white font-semibold rounded-xl hover:bg-[var(--hb-accent-hover)] transition-colors shadow-lg text-lg">
              Try the builder <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/blog" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-lg">
              Read the blog <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--hb-border)] text-center text-sm text-[var(--hb-text-muted)]">
        <p>Built in the open &mdash; MIT licensed &middot; Bradley Ross</p>
      </footer>
    </main>
  )
}
