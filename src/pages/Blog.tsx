import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Share2, Check } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { listBlogPosts, listBlogTags } from '@/lib/blogPosts'
import { HEADLINE_STATS } from '@/data/progress-eval'

// Stats banner numbers are wired to HEADLINE_STATS (canonical source on the
// Progress page). Defense ~10 days out; copy here is intentionally simple.
const STATS = [
  { label: 'days', value: String(HEADLINE_STATS.codingDays) },
  { label: 'sprints', value: String(HEADLINE_STATS.sprintsSealed) },
  { label: 'ADRs', value: String(HEADLINE_STATS.adrsAccepted) },
  { label: 'tests', value: String(HEADLINE_STATS.testsGreen) },
]

function formatDate(iso: string): string {
  // YYYY-MM-DD -> "Apr 29, 2026". Render in en-US to keep deterministic
  // output across environments (the test harness runs on UTC).
  try {
    const d = new Date(iso + 'T00:00:00Z')
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    })
  } catch {
    return iso
  }
}

export function Blog() {
  // listBlogPosts() already sorts by date descending (ADR-097 cadence).
  const allPosts = listBlogPosts()
  const allTags = listBlogTags()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const posts = useMemo(
    () => activeTag ? allPosts.filter((p) => p.tags.includes(activeTag)) : allPosts,
    [allPosts, activeTag],
  )

  // Share = copy `${origin}/blog/${slug}` to clipboard. KISS — no library;
  // brief "Copied!" feedback per-post via ephemeral useState.
  const handleShare = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${origin}/blog/${slug}`
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
      }
      setCopiedSlug(slug)
      window.setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1600)
    } catch {
      /* clipboard blocked — silently no-op; cards stay clickable */
    }
  }

  return (
    <main
      className="min-h-screen bg-[#faf8f5] text-[#2d1f12]"
      data-testid="blog-index"
    >
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">
          The Hey Bradley blog
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
          Building Hey Bradley in public.
        </h1>
        <p className="text-base md:text-xl text-[#6b5e4f] leading-relaxed max-w-2xl">
          Field notes from a Harvard ALM capstone. Velocity, AISP, the spec
          layer, and the parts of the build that the rest of the AI-builder
          industry is leaving on the table.
        </p>
      </section>

      {/* Stats banner */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
        <div className="bg-white border border-[#e8772e]/20 rounded-2xl px-4 md:px-6 py-5 flex flex-wrap items-center justify-around gap-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#A51C30]">{s.value}</span>
              <span className="text-sm text-[#6b5e4f] uppercase tracking-wider">{s.label}</span>
              {i < STATS.length - 1 && <span className="hidden sm:inline text-[#e8772e]/30 ml-3">·</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-6" data-testid="blog-tag-filter">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              data-testid="blog-tag-all"
              className={
                'text-xs px-3 py-1 rounded-full border transition-colors ' +
                (activeTag === null
                  ? 'bg-[#e8772e] border-[#e8772e] text-white'
                  : 'bg-white border-[#e8772e]/30 text-[#6b5e4f] hover:border-[#e8772e]/60')
              }
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                data-testid={`blog-tag-${tag}`}
                className={
                  'text-xs px-3 py-1 rounded-full border transition-colors ' +
                  (activeTag === tag
                    ? 'bg-[#e8772e] border-[#e8772e] text-white'
                    : 'bg-white border-[#e8772e]/30 text-[#6b5e4f] hover:border-[#e8772e]/60')
                }
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Post grid */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              data-testid={`blog-post-card-${post.slug}`}
              className="bg-white border border-[#e8772e]/20 rounded-2xl p-6 hover:border-[#e8772e]/60 hover:shadow-md transition-all group flex flex-col"
            >
              <div className="flex items-center gap-3 text-xs text-[#6b5e4f] mb-3">
                <span>{formatDate(post.date)}</span>
                <span className="text-[#e8772e]/40">·</span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8772e]/10 text-[#A51C30]"
                  data-testid={`blog-post-readtime-${post.slug}`}
                >
                  <Clock className="w-3 h-3" />
                  {post.readingTimeMin} min read
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight group-hover:text-[#A51C30] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm font-medium text-[#e8772e] mb-4">{post.subtitle}</p>
              <p className="text-sm text-[#6b5e4f] leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#e8772e] group-hover:gap-2 transition-all">
                  Read post <ArrowRight className="w-4 h-4" />
                </span>
                <button
                  type="button"
                  onClick={(e) => handleShare(post.slug, e)}
                  data-testid={`blog-post-share-${post.slug}`}
                  aria-label={`Copy link to ${post.title}`}
                  className="inline-flex items-center gap-1 text-xs text-[#6b5e4f] hover:text-[#A51C30] transition-colors px-2 py-1 rounded-md hover:bg-[#e8772e]/5"
                >
                  {copiedSlug === post.slug ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </>
                  )}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#e8772e]/20 bg-[#f1ece4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#6b5e4f] mb-2">
            Harvard ALM Capstone &mdash; Digital Media Design &mdash; May 2026
          </p>
          <p className="text-sm text-[#6b5e4f]">
            Bradley Ross &mdash; Creator of AISP
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-[#6b5e4f]">
            <Link to="/" className="hover:text-[#e8772e] transition-colors">Home</Link>
            <Link to="/about" className="hover:text-[#e8772e] transition-colors">About</Link>
            <Link to="/aisp" className="hover:text-[#e8772e] transition-colors">AISP</Link>
            <a
              href="/blog/feed.xml"
              data-testid="blog-rss-link"
              className="hover:text-[#e8772e] transition-colors"
            >
              RSS
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
