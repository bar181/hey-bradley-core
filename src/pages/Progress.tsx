import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { HEADLINE_STATS, PROGRESS_ITEMS, type ProgressItem, type Verdict } from '@/data/progress-eval'
import { getBlogPost } from '@/lib/blogPosts'

const STAT_CARDS: Array<{ key: keyof typeof HEADLINE_STATS; label: string }> = [
  { key: 'codingDays',     label: 'Coding Days' },
  { key: 'daysToDefense',  label: 'Days to Defense' },
  { key: 'phasesSealed',   label: 'Phases Sealed' },
  { key: 'adrsAccepted',   label: 'ADRs Accepted' },
  { key: 'testsGreen',     label: 'Tests Green' },
  { key: 'sprintsSealed',  label: 'Sprints Sealed' },
]

const VERDICT_STYLE: Record<Verdict, { bar: string; chip: string; label: string }> = {
  excellent: { bar: 'bg-emerald-500', chip: 'bg-emerald-500/15 text-emerald-700', label: 'Excellent' },
  strong:    { bar: 'bg-blue-500',    chip: 'bg-blue-500/15 text-blue-700',       label: 'Strong'    },
  partial:   { bar: 'bg-amber-500',   chip: 'bg-amber-500/15 text-amber-700',     label: 'Partial'   },
  gap:       { bar: 'bg-rose-500',    chip: 'bg-rose-500/15 text-rose-700',       label: 'Gap'       },
}

const CATEGORY_ORDER: ProgressItem['category'][] = ['Architecture', 'Moat', 'UX', 'Engineering', 'Gaps']

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function groupByCategory(items: ProgressItem[]): Record<string, ProgressItem[]> {
  const out: Record<string, ProgressItem[]> = {}
  for (const item of items) {
    out[item.category] = out[item.category] ?? []
    out[item.category].push(item)
  }
  return out
}

// A1 ships getBlogPost; we still guard the import with a fallback so this page
// renders even if the blog post .md is missing or A1 hasn't merged yet.
function loadTeaser(): { title: string; excerpt: string; available: boolean } {
  try {
    const post = getBlogPost('lovable-vs-hey-bradley')
    if (post && post.body) {
      return { title: post.title, excerpt: post.excerpt, available: true }
    }
  } catch {
    // fall through to fallback
  }
  return {
    title: 'Lovable Builds the Site. Hey Bradley Designs It First.',
    excerpt:
      'Lovable, v0, and the rest of the AI site-builders all start the same way: type a sentence, get a website. They are stunning demos. They are also where the bottleneck moves — not vanishes. The thing that separated a great PM from a mediocre one was never typing speed; it was the spec layer in their head. Hey Bradley externalizes that layer. The chat does not generate code first — it generates a spec, in AISP, that the user can read and accept. The five-atom Crystal Atom architecture (CONTENT, SELECTION, INSTRUCTION, ASSUMPTIONS, and the core Atom itself) means every reply is a typed, verifiable patch — not a vibe. The latency badge proves the speed. The always-on AISP trace proves the rigor. The premium templates prove the taste. Six sprints, two days, seventy-nine ADRs in. The moat is not the codegen — every tool will catch up on codegen. The moat is the spec layer being unmissable. Read the full post for the head-to-head…',
    available: false,
  }
}

export function Progress() {
  const teaser = loadTeaser()
  const grouped = groupByCategory(PROGRESS_ITEMS)

  return (
    <main data-testid="progress-page" className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/10 via-transparent to-amber-900/10" />
        <div className="relative max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">
            Building in public
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
            Hey Bradley — built in 2 days, ready in 10.
          </h1>
          <p className="text-base md:text-xl text-[#6b5e4f] leading-relaxed mb-8 max-w-2xl">
            A build-in-public snapshot of the open-core capstone.
          </p>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
            <Link to="/onboarding" className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-6 py-3 bg-[#e8772e] text-white font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg">
              Try the open source version <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-6 py-3 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-[#f1ece4] transition-colors">
              Explore AISP <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Headline stats */}
      <section className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {STAT_CARDS.map((card) => (
              <div
                key={card.key}
                data-testid={`progress-stat-${card.key}`}
                className="bg-white border border-[#e8772e]/20 rounded-2xl p-5 text-center"
              >
                <div className="text-3xl font-bold text-[#2d1f12]">{HEADLINE_STATS[card.key]}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-[#6b5e4f] font-medium">
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="py-12 bg-[#f1ece4]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#e8772e]/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#e8772e]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">From the build journal</h2>
          </div>
          <article
            data-testid="progress-blog-teaser"
            className="bg-white border border-[#e8772e]/20 rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-3 leading-tight">{teaser.title}</h3>
            <p className="text-[#6b5e4f] leading-relaxed mb-6">{teaser.excerpt}</p>
            <Link
              to="/blog/lovable-vs-hey-bradley"
              className="inline-flex items-center gap-2 text-[#e8772e] font-semibold hover:text-[#c45f1c]"
            >
              Read full post <ArrowRight className="w-4 h-4" />
            </Link>
            {!teaser.available && (
              <p className="mt-4 text-xs text-[#6b5e4f]/70">Excerpt cached locally · live post lands with the blog.</p>
            )}
          </article>
        </div>
      </section>

      {/* Eval */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Swarm eval — honest scores</h2>
          <p className="text-[#6b5e4f] mb-10 max-w-2xl">
            Eighteen items, scored 1-10 against the Sprint J system-wide review and the 2026-04-29 product
            evaluation. Excellent / Strong / Partial / Gap — gaps are not hidden.
          </p>

          <div className="space-y-12">
            {CATEGORY_ORDER.map((cat) => {
              const items = grouped[cat]
              if (!items || items.length === 0) return null
              return (
                <div key={cat}>
                  <h3 className="text-xl font-bold mb-5 text-[#A51C30]">{cat}</h3>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const style = VERDICT_STYLE[item.verdict]
                      const slug = slugify(item.name)
                      return (
                        <div
                          key={slug}
                          data-testid={`progress-eval-item-${slug}`}
                          className="bg-white border border-[#e8772e]/20 rounded-xl p-6"
                        >
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h4 className="text-lg font-semibold flex-1 min-w-[12rem]">{item.name}</h4>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${style.chip}`}>
                              {style.label}
                            </span>
                            <span className="text-2xl font-bold text-[#2d1f12] tabular-nums">
                              {item.score.toFixed(1)}
                              <span className="text-sm text-[#6b5e4f] font-medium">/10</span>
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-[#f1ece4] overflow-hidden mb-3">
                            <div
                              className={`h-full ${style.bar}`}
                              style={{ width: `${item.score * 10}%` }}
                            />
                          </div>
                          <p className="text-sm text-[#6b5e4f] leading-relaxed">{item.evidence}</p>
                          {item.reference && (
                            <span className="inline-block mt-3 text-xs px-2 py-0.5 rounded-md bg-[#faf8f5] border border-[#e8772e]/20 text-[#6b5e4f] font-mono">
                              {item.reference}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#242424] to-[#1a1a1a] text-center text-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Want the full story?</h2>
          <p className="text-[#cab9a3] mb-8">
            The blog walks through the moat decisions, the velocity bet, and the discipline brake.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-8 py-3 bg-[#e8772e] text-[#2d1f12] font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg"
          >
            Read the build journal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-[#e8772e]/20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#6b5e4f]">Harvard ALM Capstone · Sprint M sealed · 2026-04-29</p>
        </div>
      </footer>
    </main>
  )
}
