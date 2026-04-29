import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { listBlogPosts } from '@/lib/blogPosts'

// Stats banner numbers are hardcoded for now. The Progress page (Agent A2)
// is the canonical source — when it lands we can wire these to the same
// constants module. Defense ~10 days out; copy here is intentionally simple.
const STATS = [
  { label: 'days', value: '2' },
  { label: 'sprints', value: '6' },
  { label: 'ADRs', value: '79' },
  { label: 'tests', value: '244' },
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
  const posts = listBlogPosts()

  return (
    <main
      className="min-h-screen bg-[#faf8f5] text-[#2d1f12]"
      data-testid="blog-index"
    >
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">
          The Hey Bradley blog
        </p>
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
          Building Hey Bradley in public.
        </h1>
        <p className="text-xl text-[#6b5e4f] leading-relaxed max-w-2xl">
          Field notes from a Harvard ALM capstone. Velocity, AISP, the spec
          layer, and the parts of the build that the rest of the AI-builder
          industry is leaving on the table.
        </p>
      </section>

      {/* Stats banner */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white border border-[#e8772e]/20 rounded-2xl px-6 py-5 flex flex-wrap items-center justify-around gap-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#A51C30]">{s.value}</span>
              <span className="text-sm text-[#6b5e4f] uppercase tracking-wider">{s.label}</span>
              {i < STATS.length - 1 && <span className="hidden sm:inline text-[#e8772e]/30 ml-3">·</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Post grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
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
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTimeMin} min read
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 leading-tight group-hover:text-[#A51C30] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm font-medium text-[#e8772e] mb-4">{post.subtitle}</p>
              <p className="text-sm text-[#6b5e4f] leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#e8772e] group-hover:gap-2 transition-all mt-auto">
                Read post <ArrowRight className="w-4 h-4" />
              </span>
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
          </div>
        </div>
      </footer>
    </main>
  )
}
