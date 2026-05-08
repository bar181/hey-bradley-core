import { Link } from 'react-router-dom'
import { Briefcase, Code2, GraduationCap, Users } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

export function Contact() {
  return (
    <main className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <MarketingNav />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Building something that connects to Hey Bradley or AISP?
          </h1>
          <p className="text-xl text-[var(--hb-ink-muted)]">Start here.</p>
        </div>
      </section>

      {/* Four items */}
      <section className="pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Bradley Ross</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mb-3">Direct message &mdash; fastest path.</p>
            <a href="https://www.linkedin.com/in/bradaross" target="_blank" rel="noopener noreferrer" className="text-[var(--hb-warm)] hover:underline text-sm font-medium">linkedin.com/in/bradaross &rarr;</a>
          </div>

          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Code2 className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Code, repos, issues.</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mb-3">Two repos &mdash; the builder and the protocol.</p>
            <div className="flex flex-col gap-1 mb-2">
              <a href="https://github.com/bar181/hey-bradley-core" target="_blank" rel="noopener noreferrer" className="text-[var(--hb-warm)] hover:underline text-sm font-medium">hey-bradley-core &rarr;</a>
              <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="text-[var(--hb-warm)] hover:underline text-sm font-medium">aisp-open-core &rarr;</a>
            </div>
            <a href="https://github.com/bar181" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--hb-ink-muted)] hover:text-[var(--hb-ink)]">github.com/bar181 &rarr;</a>
          </div>

          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Capstone defense &mdash; May 2026</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)] mb-3">Harvard ALM Digital Media Design. Public defense scheduled.</p>
            <Link to="/research" className="text-[var(--hb-warm)] hover:underline text-sm font-medium">Read the research &rarr;</Link>
          </div>

          <div className="bg-white border border-[var(--hb-warm)]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-[var(--hb-warm)]" />
              <h2 className="font-semibold">Agentics Foundation</h2>
            </div>
            <p className="text-sm text-[var(--hb-ink-muted)]">Agentic engineering community. Beta program in flight.</p>
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
