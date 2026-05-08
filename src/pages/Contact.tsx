import { Link } from 'react-router-dom'
import { Briefcase, Code2, GraduationCap, Users } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { Button } from '@/components/ui/button'

export function Contact() {
  return (
    <main className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <MarketingNav />

      {/* Hero — P122 / W8 jargon strip: drop "AISP" reference for new visitors. */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Got a question? Reach out.
          </h1>
          <p className="text-xl text-[var(--hb-ink-muted)]">Pick the channel that fits.</p>
        </div>
      </section>

      {/* Four items — P122 / W8: card CTAs promoted to shadcn Button (link variant)
          so they read as actions, not body copy. */}
      <section className="pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
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

          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
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

          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
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

          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Agentics Foundation</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)]">Working group on AI-driven engineering. Beta program in flight.</p>
          </div>
        </div>
      </section>

      {/* Honest closing */}
      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-[var(--hb-ink-muted)] leading-relaxed mb-6">
            No form. No tracking. No marketing emails. The fastest way to start a real
            conversation is one of the four channels above.
          </p>
          <p className="text-xs text-[var(--hb-ink-muted)]">Open source &middot; MIT licensed &middot; Built at Harvard</p>
        </div>
      </section>
    </main>
  )
}
