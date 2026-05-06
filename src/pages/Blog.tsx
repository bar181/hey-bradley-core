import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Clock, Share2, Check } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import {
  listBlogPosts,
  categoryOf,
  BLOG_CATEGORY_LABEL,
  type BlogCategory,
} from '@/lib/blogPosts'
import { useReveal } from '@/hooks/useReveal'

const CATEGORY_TABS: Array<{ key: BlogCategory | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'story', label: 'Story' },
  { key: 'technical', label: 'Technical' },
  { key: 'for-teams', label: 'For teams' },
]

function isCategory(v: string | null): v is BlogCategory {
  return v === 'story' || v === 'technical' || v === 'for-teams'
}

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
  const [searchParams, setSearchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')
  const activeCategory: BlogCategory | 'all' = isCategory(urlCategory) ? urlCategory : 'all'
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const gridReveal = useReveal<HTMLElement>()

  const setCategory = (cat: BlogCategory | 'all') => {
    if (cat === 'all') setSearchParams({}, { replace: true })
    else setSearchParams({ category: cat }, { replace: true })
  }

  const posts = useMemo(
    () => activeCategory === 'all' ? allPosts : allPosts.filter((p) => categoryOf(p) === activeCategory),
    [allPosts, activeCategory],
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
          Field notes from the build. The spec layer, the hand-off, and the
          parts of the AI-builder story the industry is leaving on the table.
        </p>
      </section>

      {/* Category filter (P120/A4 — 3 categories: Story / Technical / For teams) */}
      <section
        className="max-w-5xl mx-auto px-4 md:px-6 pb-6"
        data-testid="blog-category-filter"
      >
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter posts by category">
          {CATEGORY_TABS.map((tab) => {
            const active = activeCategory === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(tab.key)}
                data-testid={`blog-category-${tab.key}`}
                className={
                  'text-sm px-4 min-h-[44px] rounded-full border transition-colors ' +
                  (active
                    ? 'bg-[var(--hb-warm)] border-[var(--hb-warm)] text-white'
                    : 'bg-white border-[rgb(var(--hb-warm-rgb)/0.3)] text-[var(--hb-ink-muted)] hover:text-[var(--hb-ink)] hover:border-[rgb(var(--hb-warm-rgb)/0.6)]')
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Post grid */}
      <section
        ref={gridReveal.ref}
        className={`max-w-5xl mx-auto px-4 md:px-6 pb-16 md:pb-24 transition-all duration-700 ${gridReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
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
              <p
                className="text-xs uppercase tracking-wide text-[var(--hb-warm)] mb-2 font-medium"
                data-testid={`blog-post-category-${post.slug}`}
              >
                {BLOG_CATEGORY_LABEL[categoryOf(post)]}
              </p>
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
            Built in the open &mdash; MIT licensed
          </p>
          <p className="text-sm text-[#6b5e4f]">Bradley Ross</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-[#6b5e4f]">
            <Link to="/" className="hover:text-[#e8772e] transition-colors">Home</Link>
            <Link to="/about" className="hover:text-[#e8772e] transition-colors">About</Link>
            <Link to="/research" className="hover:text-[#e8772e] transition-colors">Research</Link>
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
