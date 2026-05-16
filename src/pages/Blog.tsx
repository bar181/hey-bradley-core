import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Clock, Share2, Check } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { Button } from '@/components/ui/button'
import {
  listBlogPosts,
  categoryOf,
  getBlogPost,
  BLOG_CATEGORY_LABEL,
  type BlogCategory,
  type BlogPost as BlogPostType,
} from '@/lib/blogPosts'
import { useReveal } from '@/hooks/useReveal'

const CATEGORY_TABS: Array<{ key: BlogCategory | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'story', label: 'Story' },
  { key: 'technical', label: 'Technical' },
  { key: 'teams', label: 'Teams' },
  { key: 'research', label: 'Research' },
  { key: 'aisp', label: 'AISP' },
]

function isCategory(v: string | null): v is BlogCategory {
  return v === 'story' || v === 'technical' || v === 'teams' || v === 'research' || v === 'aisp'
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso + 'T00:00:00Z')
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    })
  } catch {
    return iso
  }
}

// Unsplash images for every blog post — full-width, high quality
const POST_IMAGES: Record<string, string> = {
  'research-the-telephone-game': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&q=80',
  'describe-it-see-it': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&q=80',
  'the-handoff-that-changes-everything': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&q=80',
  'lovable-vs-hey-bradley': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&q=80',
  'building-hey-bradley-with-hey-bradley': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&q=80',
  'teams-spec-handoff-for-product-teams': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&q=80',
  'six-sprints-two-days': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&q=80',
  'aisp-made-visible': 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&auto=format&q=80',
  'jira-vs-agentics': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&q=80',
  'pm-architect-designer-now-one-person': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&q=80',
  'spec-first-vs-vibe-coding': 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&q=80',
  'built-open-core-in-2-days-with-swarm': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&auto=format&q=80',
  'template-first-beats-llm-from-scratch': 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1200&auto=format&q=80',
  'the-55-percent-problem': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&q=80',
  'multi-page-mvp-stays-atomic': 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&auto=format&q=80',
  'the-open-core-boundary': 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=1200&auto=format&q=80',
  'why-we-built-this-the-honest-version': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&q=80',
}

// Export for BlogPost.tsx to reuse
export { POST_IMAGES }

const FEATURED_SLUG = 'research-the-telephone-game'

// 4 featured posts for the sidebar
const FEATURED_SLUGS = [
  'aisp-made-visible',
  'the-handoff-that-changes-everything',
  'describe-it-see-it',
  'the-55-percent-problem',
]

function FeaturedCard({ post }: { post: BlogPostType }) {
  const img = POST_IMAGES[post.slug]
  return (
    <Link
      to={`/blog/${post.slug}`}
      data-testid="blog-featured-card"
      className="block rounded-2xl overflow-hidden hover:shadow-[0_0_40px_rgba(165,28,48,0.15)] transition-all group mb-10"
    >
      {img && (
        <div className="w-full h-64 md:h-80 overflow-hidden relative">
          <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="text-xs uppercase tracking-wide text-[var(--hb-accent)] mb-2 font-semibold">
              Featured Research
            </p>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-white/70 mb-3 max-w-2xl">{post.subtitle}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--hb-accent)] group-hover:gap-2 transition-all">
              Read the research <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      )}
    </Link>
  )
}

function SidebarCard({ post }: { post: BlogPostType }) {
  const img = POST_IMAGES[post.slug]
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="flex gap-3 group"
    >
      {img && (
        <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img src={img} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--hb-accent)] font-medium mb-0.5">
          {BLOG_CATEGORY_LABEL[categoryOf(post)]}
        </p>
        <h4 className="text-sm font-semibold leading-snug text-[var(--hb-text-primary)] group-hover:text-[var(--hb-accent)] transition-colors line-clamp-2">
          {post.title}
        </h4>
      </div>
    </Link>
  )
}

export function Blog() {
  const allPosts = listBlogPosts()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')
  const activeCategory: BlogCategory | 'all' = isCategory(urlCategory) ? urlCategory : 'all'
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const gridReveal = useReveal<HTMLElement>()

  const featuredPost = getBlogPost(FEATURED_SLUG)
  const sidebarPosts = FEATURED_SLUGS.map(getBlogPost).filter(Boolean) as BlogPostType[]

  const setCategory = (cat: BlogCategory | 'all') => {
    if (cat === 'all') setSearchParams({}, { replace: true })
    else setSearchParams({ category: cat }, { replace: true })
  }

  const posts = useMemo(() => {
    const filtered = activeCategory === 'all' ? allPosts : allPosts.filter((p) => categoryOf(p) === activeCategory)
    if (activeCategory === 'all') return filtered.filter((p) => p.slug !== FEATURED_SLUG)
    return filtered
  }, [allPosts, activeCategory])

  const handleShare = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/blog/${slug}`
    try {
      await navigator.clipboard?.writeText(url)
      setCopiedSlug(slug)
      window.setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1600)
    } catch { /* clipboard blocked */ }
  }

  return (
    <main className="dark min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]" data-testid="blog-index">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--hb-accent)] mb-4 font-semibold letter-spacing-widest">
          The Hey Bradley Blog
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.05]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Building in public.
        </h1>
        <p className="text-lg md:text-xl text-[var(--hb-text-secondary)] leading-relaxed max-w-2xl">
          Field notes from the build. The spec layer, the hand-off, and the
          parts of the AI-builder story the industry is leaving on the table.
        </p>
      </section>

      {/* Featured + Sidebar layout */}
      {activeCategory === 'all' && featuredPost && (
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured hero card */}
            <div className="lg:col-span-2">
              <FeaturedCard post={featuredPost} />
            </div>
            {/* Sidebar — 4 featured picks */}
            <div className="space-y-5">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--hb-text-muted)] font-semibold mb-3">Featured</h3>
              {sidebarPosts.map((post) => (
                <SidebarCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category filter — P122 / W8: pills upgraded to shadcn Button so the
          active/inactive state matches the rest of the site's button language.
          Brand color stays var(--hb-accent) via className override. */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-6" data-testid="blog-category-filter">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter posts by category">
          {CATEGORY_TABS.map((tab) => {
            const active = activeCategory === tab.key
            return (
              <Button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(tab.key)}
                data-testid={`blog-category-${tab.key}`}
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={
                  'rounded-full px-5 h-9 text-sm font-medium ' +
                  (active
                    ? 'bg-[var(--hb-accent)] border-[var(--hb-accent)] text-white shadow-lg shadow-[var(--hb-accent)]/20 hover:bg-[var(--hb-accent-hover)]'
                    : 'bg-[var(--hb-surface)] border-[var(--hb-border)] text-[var(--hb-text-muted)] hover:text-[var(--hb-text-primary)] hover:bg-[var(--hb-surface)] hover:border-[var(--hb-accent)]/40')
                }
              >
                {tab.label}
              </Button>
            )
          })}
        </div>
      </section>

      {/* Post grid */}
      <section
        ref={gridReveal.ref}
        className={`max-w-6xl mx-auto px-4 md:px-6 pb-16 md:pb-24 transition-all duration-700 ${gridReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const img = POST_IMAGES[post.slug]
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                data-testid={`blog-post-card-${post.slug}`}
                className="bg-[var(--hb-surface)] border border-[var(--hb-border)] rounded-2xl overflow-hidden hover:border-[var(--hb-accent)]/40 hover:shadow-[0_4px_30px_rgba(165,28,48,0.1)] transition-all group flex flex-col"
              >
                {img && (
                  <div className="w-full h-48 overflow-hidden">
                    <img src={img} alt="" loading="lazy" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--hb-text-muted)] mb-2">
                    <span className="text-[var(--hb-accent)] font-semibold uppercase tracking-wide"
                      data-testid={`blog-post-category-${post.slug}`}>
                      {BLOG_CATEGORY_LABEL[categoryOf(post)]}
                    </span>
                    <span className="text-[var(--hb-border)]">|</span>
                    <span>{formatDate(post.date)}</span>
                    <span className="text-[var(--hb-border)]">|</span>
                    <span className="inline-flex items-center gap-0.5" data-testid={`blog-post-readtime-${post.slug}`}>
                      <Clock className="w-3 h-3" /> {post.readingTimeMin}m
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mb-1.5 leading-snug text-[var(--hb-text-primary)] group-hover:text-[var(--hb-accent)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--hb-text-secondary)] leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.subtitle}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--hb-border)]/50">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--hb-accent)] group-hover:gap-1.5 transition-all">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleShare(post.slug, e)}
                      data-testid={`blog-post-share-${post.slug}`}
                      aria-label={`Copy link to ${post.title}`}
                      className="inline-flex items-center gap-1 text-xs text-[var(--hb-text-muted)] hover:text-[var(--hb-accent)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--hb-accent)]/5"
                    >
                      {copiedSlug === post.slug ? <><Check className="w-3 h-3" /> Copied!</> : <><Share2 className="w-3 h-3" /> Share</>}
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--hb-border)] bg-[var(--hb-bg)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[var(--hb-text-muted)] mb-2">Built in the open &mdash; MIT licensed</p>
          <p className="text-sm text-[var(--hb-text-muted)]">Bradley Ross</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-[var(--hb-text-muted)]">
            <Link to="/" className="hover:text-[var(--hb-accent)] transition-colors">Home</Link>
            <Link to="/capstone" className="hover:text-[var(--hb-accent)] transition-colors">Capstone</Link>
            <Link to="/open-core" className="hover:text-[var(--hb-accent)] transition-colors">Open Core</Link>
            <a href="/blog/feed.xml" data-testid="blog-rss-link" className="hover:text-[var(--hb-accent)] transition-colors">RSS</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
