import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { getBlogPost, renderMarkdown, categoryOf, BLOG_CATEGORY_LABEL } from '@/lib/blogPosts'
import { POST_IMAGES } from '@/pages/Blog'

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

// 4 featured sidebar posts (same as Blog index)
const SIDEBAR_SLUGS = ['aisp-made-visible', 'the-handoff-that-changes-everything', 'describe-it-see-it', 'the-55-percent-problem']

export function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>()
  const post = getBlogPost(slug)
  const heroImg = POST_IMAGES[slug]

  if (!post) {
    return (
      <main className="dark min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]">
        <MarketingNav />
        <section className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--hb-accent)] mb-4 font-semibold">404</p>
          <h1 className="text-4xl font-bold mb-4">Post not found.</h1>
          <p className="text-[var(--hb-text-secondary)] mb-8">
            We couldn&apos;t find a post at <code className="text-sm bg-[var(--hb-surface)] px-2 py-0.5 rounded">/blog/{slug}</code>.
          </p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--hb-border)] text-[var(--hb-text-primary)] font-semibold rounded-xl hover:bg-[var(--hb-surface)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> All posts
          </Link>
        </section>
      </main>
    )
  }

  const hasBody = post.body.trim().length > 0
  const html = hasBody ? renderMarkdown(post.body) : ''
  const sidebarPosts = SIDEBAR_SLUGS.map(getBlogPost).filter((p) => p && p.slug !== slug).slice(0, 4)

  return (
    <main className="dark min-h-screen bg-[var(--hb-bg)] text-[var(--hb-text-primary)]">
      <MarketingNav />

      {/* Hero image with gradient fade */}
      {heroImg && (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--hb-bg)]" />
        </div>
      )}

      {/* Article header + content with sidebar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <article className="lg:col-span-2">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-[var(--hb-text-muted)] hover:text-[var(--hb-accent)] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> All posts
            </Link>

            <div className="mb-4 flex items-center gap-3 text-xs text-[var(--hb-text-muted)]">
              <span className="text-[var(--hb-accent)] font-semibold uppercase tracking-wide">
                {BLOG_CATEGORY_LABEL[categoryOf(post)]}
              </span>
              <span className="text-[var(--hb-border)]">|</span>
              <span>{formatDate(post.date)}</span>
              <span className="text-[var(--hb-border)]">|</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readingTimeMin} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--hb-text-secondary)] leading-relaxed mb-10 border-l-4 border-[var(--hb-accent)] pl-5">
              {post.subtitle}
            </p>

            {/* Body */}
            {hasBody ? (
              <div
                data-testid="blog-post-body"
                className="blog-prose text-[var(--hb-text-secondary)] text-base md:text-lg leading-[1.8] [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:mt-14 [&_h1]:mb-5 [&_h1]:text-[var(--hb-text-primary)] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[var(--hb-text-primary)] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[var(--hb-text-primary)] [&_p]:mb-5 [&_a]:text-[var(--hb-accent)] [&_a]:underline [&_a]:decoration-[var(--hb-accent)]/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-[var(--hb-accent)] [&_strong]:text-[var(--hb-text-primary)] [&_strong]:font-semibold [&_code]:bg-[var(--hb-surface)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-2 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--hb-accent)]/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[var(--hb-text-muted)] [&_blockquote]:my-6"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div data-testid="blog-post-body" className="bg-[var(--hb-surface)] border border-[var(--hb-border)] rounded-2xl p-8 text-center">
                <p className="text-[var(--hb-text-secondary)] mb-2">Coming soon.</p>
                <p className="text-sm text-[var(--hb-text-muted)]">This post is being written. Check back shortly.</p>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-[var(--hb-border)]">
              <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--hb-accent)] hover:gap-2 transition-all">
                <ArrowLeft className="w-4 h-4" /> All posts
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--hb-text-muted)] font-semibold mb-5">Featured</h3>
              <div className="space-y-5">
                {sidebarPosts.map((p) => p && (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="flex gap-3 group">
                    {POST_IMAGES[p.slug] && (
                      <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={POST_IMAGES[p.slug]} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--hb-accent)] font-medium mb-0.5">{BLOG_CATEGORY_LABEL[categoryOf(p)]}</p>
                      <h4 className="text-sm font-semibold leading-snug text-[var(--hb-text-primary)] group-hover:text-[var(--hb-accent)] transition-colors line-clamp-2">{p.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Author card */}
              <div className="mt-8 p-5 bg-[var(--hb-surface)] border border-[var(--hb-border)] rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/bradley-headshot.jpeg" alt="Bradley Ross" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">Bradley Ross</p>
                    <p className="text-xs text-[var(--hb-text-muted)]">Agentic Engineer</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--hb-text-muted)] leading-relaxed">
                  ALM, Harvard University. Building Hey Bradley &mdash; a spec-first website builder powered by AISP.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
