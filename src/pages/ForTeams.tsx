import { Link } from 'react-router-dom'
import { ArrowRight, FileText, FolderTree, Users } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { useReveal } from '@/hooks/useReveal'

// P120 / A2 — /for-teams page.
// Audience: product teams transitioning from one AI coding assistant to another
// (or evaluating both). Highest-pay-likelihood segment per
// `plans/strategic-reviews/2026-05-07-audience-segment-review.md` (Segment 4).
//
// Tone rules per ADR-146 D2: no competitor names in body copy; no marketing
// stats / numbers; no jargon (Crystal Atom / AISP body-text). Honest scope —
// the page calls out what doesn't exist yet; that's the credibility move.

const VALUE_PROPS = [
  {
    icon: FileText,
    title: 'Persistent spec.',
    desc:
      'Every project starts with a contract — JSON, not vibes. Your team picks up the project and the AI picks up the spec. No re-explanation.',
  },
  {
    icon: FolderTree,
    title: 'CLAUDE.md handoff.',
    desc:
      'The export is a folder of human-readable files your AI coding assistant reads on the first run. Zero clarifying questions.',
  },
  {
    icon: Users,
    title: 'Agent scope map.',
    desc:
      'Wave-by-wave breakdown of who owns what. Your senior engineer reviews structure; your AI ships the work.',
  },
]

export function ForTeams() {
  const s2 = useReveal<HTMLElement>()
  const s3 = useReveal<HTMLElement>()
  const s4 = useReveal<HTMLElement>()

  return (
    <main className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <MarketingNav />

      {/* Section 1 — Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
          Your team re-explains the project every session.
        </h1>
        <p className="text-xl text-[var(--hb-ink-muted)] leading-relaxed mb-10 max-w-3xl">
          Hey Bradley gives you a spec your AI coding assistant reads once. The
          next session picks up where the last one ended.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/blog/the-handoff-that-changes-everything"
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-[var(--hb-warm)] text-white font-semibold hover:bg-[var(--hb-warm-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-warm)] transition-colors"
          >
            Read the handoff guide <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/open-core"
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg border border-[rgb(var(--hb-warm-rgb)/0.3)] text-[var(--hb-ink)] font-semibold hover:border-[rgb(var(--hb-warm-rgb)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-warm)] transition-colors"
          >
            View open core <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Section 2 — What your team gets */}
      <section
        ref={s2.ref}
        className={`max-w-5xl mx-auto px-6 py-20 transition-all duration-700 ${
          s2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          What your team gets.
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="block p-6 rounded-2xl bg-white border border-[rgb(var(--hb-warm-rgb)/0.15)] hover:border-[rgb(var(--hb-warm-rgb)/0.4)] hover:shadow-md transition-colors"
            >
              <v.icon className="w-7 h-7 text-[var(--hb-warm)] mb-4" />
              <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-[var(--hb-ink-muted)] leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Honest about what's shipped */}
      <section
        ref={s3.ref}
        className={`max-w-3xl mx-auto px-6 py-20 transition-all duration-700 ${
          s3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5">
          Honest about what&rsquo;s shipped.
        </h2>
        <p className="text-lg text-[var(--hb-ink-muted)] leading-relaxed">
          Today: open-core builder, the spec export, and a real handoff to
          whatever AI coding assistant your team uses. No team workspaces, no
          shared cloud projects, no SSO &mdash; those land in a future
          commercial tier when there&rsquo;s something worth charging for. The
          open core stays open.
        </p>
      </section>

      {/* Section 4 — Closing CTA */}
      <section
        ref={s4.ref}
        className={`max-w-4xl mx-auto px-6 py-24 text-center transition-all duration-700 ${
          s4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
          See it work end to end.
        </h2>
        <Link
          to="/walkthrough"
          className="inline-flex items-center gap-2 px-8 py-4 min-h-[44px] rounded-lg bg-[var(--hb-warm)] text-white font-semibold text-lg hover:bg-[var(--hb-warm-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-warm)] transition-colors"
        >
          Watch the walkthrough <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-6 text-xs text-[var(--hb-ink-muted)]">
          Open source &middot; MIT licensed &middot; Built at Harvard
        </p>
      </section>
    </main>
  )
}
