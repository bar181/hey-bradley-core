import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { getBlogPost, renderMarkdown } from '@/lib/blogPosts'

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

export function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>()
  const post = getBlogPost(slug)

  if (!post) {
    return (
      <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
        <MarketingNav />
        <section className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">
            404
          </p>
          <h1 className="text-4xl font-bold mb-4">Post not found.</h1>
          <p className="text-[#6b5e4f] mb-8">
            We couldn&apos;t find a post at <code className="text-sm bg-[#f1ece4] px-2 py-0.5 rounded">/blog/{slug}</code>.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-[#f1ece4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
        </section>
      </main>
    )
  }

  const hasBody = post.body.trim().length > 0
  const html = hasBody ? renderMarkdown(post.body) : ''

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <article className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-[#6b5e4f] hover:text-[#e8772e] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All posts
        </Link>
        <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">
          {formatDate(post.date)}
          <span className="mx-2 text-[#e8772e]/40">·</span>
          <span className="inline-flex items-center gap-1 normal-case tracking-normal">
            <Clock className="w-3 h-3" />
            {post.readingTimeMin} min read
          </span>
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
          {post.title}
        </h1>
        <p className="text-xl text-[#6b5e4f] leading-relaxed">{post.subtitle}</p>
      </article>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 pb-24">
        {hasBody ? (
          <div
            data-testid="blog-post-body"
            className="blog-prose text-[#2d1f12] leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-12 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_p]:text-[#6b5e4f] [&_p]:mb-4 [&_a]:text-[#e8772e] [&_a]:underline [&_strong]:text-[#2d1f12] [&_code]:bg-[#f1ece4] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-[#6b5e4f] [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#e8772e]/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#6b5e4f] [&_blockquote]:my-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div
            data-testid="blog-post-body"
            className="bg-white border border-[#e8772e]/20 rounded-2xl p-8 text-center"
          >
            <p className="text-[#6b5e4f] mb-2">Coming soon.</p>
            <p className="text-sm text-[#6b5e4f]">
              This post is being written. Check back shortly.
            </p>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-[#e8772e]/20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#e8772e] hover:gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
        </div>
      </article>
    </main>
  )
}
