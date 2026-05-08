import { Link } from 'react-router-dom'
import { Briefcase, Code2, GraduationCap, Users } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { Button } from '@/components/ui/button'

export function Contact() {
  return (
    <main className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <MarketingNav />

      {/* Loop 2 / Contact lift — accent bar bumped 4px → 6px (h-1 → h-1.5) for
          stronger nav separation; matches the rhythm of the modern brand bars
          on Stripe / Linear. */}
      <div className="h-1.5 bg-[var(--hb-warm)]" aria-hidden="true" />

      {/* Hero — P122 / W8 jargon strip locked the copy ("Got a question?
          Reach out." + "Pick the channel that fits."). P123 / W4 adds
          Bradley's headshot beside the copy block — visitor-confidence lift,
          no copy change. */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-10 items-center">
            <div className="mx-auto md:mx-0">
              <img
                src="/images/bradley-headshot.jpeg"
                alt="Bradley Ross, creator of Hey Bradley"
                width="200"
                height="200"
                loading="lazy"
                className="w-40 h-40 md:w-[200px] md:h-[200px] rounded-full object-cover border-2 border-[var(--hb-warm)]/40 shadow-md"
              />
            </div>
            <div className="text-center md:text-left">
              {/* Loop 2 / Contact lift — eyebrow tag adds modern visual
                  hierarchy (Stripe/Linear pattern) so the H1 doesn't float. */}
              <span className="inline-block text-xs font-mono uppercase tracking-[0.18em] text-[var(--hb-warm)] mb-3">
                Contact
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                Got a question? Reach out.
              </h1>
              <p className="text-xl text-[var(--hb-ink-muted)] leading-relaxed">
                Pick the channel that fits. No form, no funnel — every link below goes straight to me.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four items — P122 / W8: card CTAs promoted to shadcn Button (link variant).
          P123 / W4: card border opacity 20% → 40% + shadow-sm for visual weight;
          4th card now has a CTA so the close doesn't feel passive. */}
      <section className="pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-6">
          <div className="group bg-white border border-[var(--hb-warm)]/40 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--hb-warm)]/60">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Bradley Ross</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mb-3">Direct message &mdash; fastest path.</p>
            <Button
              variant="link"
              size="sm"
              render={<a href="https://www.linkedin.com/in/bradaross" target="_blank" rel="noopener noreferrer" />}
              className="px-0 h-auto py-1 text-[var(--hb-warm)] hover:no-underline hover:text-[var(--hb-warm-hover)]"
            >
              linkedin.com/in/bradaross &rarr;
            </Button>
          </div>

          <div className="group bg-white border border-[var(--hb-warm)]/40 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--hb-warm)]/60">
            <div className="flex items-center gap-3 mb-3">
              <Code2 className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">See the code on GitHub.</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mb-3">Two repos &mdash; the builder and its spec format.</p>
            <div className="flex flex-col gap-1 mb-2 items-start">
              <Button
                variant="link"
                size="sm"
                render={<a href="https://github.com/bar181/hey-bradley-core" target="_blank" rel="noopener noreferrer" />}
                className="px-0 h-auto py-1 text-[var(--hb-warm)] hover:no-underline hover:text-[var(--hb-warm-hover)]"
              >
                hey-bradley-core &rarr;
              </Button>
              <Button
                variant="link"
                size="sm"
                render={<a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" />}
                className="px-0 h-auto py-1 text-[var(--hb-warm)] hover:no-underline hover:text-[var(--hb-warm-hover)]"
              >
                aisp-open-core &rarr;
              </Button>
            </div>
            <a href="https://github.com/bar181" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--hb-ink-muted)] hover:text-[var(--hb-ink)]">github.com/bar181 &rarr;</a>
          </div>

          <div className="group bg-white border border-[var(--hb-warm)]/40 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--hb-warm)]/60">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Capstone defense &mdash; May 2026</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mb-3">Harvard ALM Digital Media Design. Public defense scheduled.</p>
            <Button
              variant="link"
              size="sm"
              render={<Link to="/research" />}
              className="px-0 h-auto py-1 text-[var(--hb-warm)] hover:no-underline hover:text-[var(--hb-warm-hover)]"
            >
              Read the research &rarr;
            </Button>
          </div>

          <div className="group bg-white border border-[var(--hb-warm)]/40 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--hb-warm)]/60">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Agentics Foundation</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mb-3">Working group on AI-driven engineering. Beta program in flight.</p>
            <Button
              variant="link"
              size="sm"
              render={<a href="https://agenticsfoundation.org" target="_blank" rel="noopener noreferrer" />}
              className="px-0 h-auto py-1 text-[var(--hb-warm)] hover:no-underline hover:text-[var(--hb-warm-hover)]"
            >
              agenticsfoundation.org &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* Honest closing */}
      <section className="pb-12">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-[var(--hb-ink-muted)] leading-relaxed">
            No form. No tracking. No marketing emails. The fastest way to start a real
            conversation is one of the four channels above.
          </p>
        </div>
      </section>

      {/* Loop 2 / Contact lift — real footer with brand attribution + key links.
          Modern site pattern (Stripe / Linear / Vercel all anchor pages this
          way). Provides closure to the page and a non-card path back to the
          rest of the site. */}
      <footer className="border-t border-[var(--hb-warm)]/20 bg-[var(--hb-paper-soft)]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--hb-ink-muted)]">
          <p className="font-medium">
            Built with <span className="text-[var(--hb-warm)] font-semibold">AISP</span> · Harvard ALM 2026
          </p>
          <div className="flex items-center gap-5">
            <a href="https://github.com/bar181/hey-bradley-core" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--hb-warm)] transition-colors">
              GitHub
            </a>
            <Link to="/aisp" className="hover:text-[var(--hb-warm)] transition-colors">
              AISP spec
            </Link>
            <Link to="/blog" className="hover:text-[var(--hb-warm)] transition-colors">
              Blog
            </Link>
            <span aria-hidden="true">·</span>
            <span>Open source · MIT</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
