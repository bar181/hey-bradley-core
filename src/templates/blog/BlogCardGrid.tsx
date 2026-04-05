import type { Section } from '@/lib/schemas'
import { getStr, getImageEffectClass } from '@/lib/sectionContent'

/* --------------------------------------------------------------------- */
/*  BlogCardGrid — 3-column responsive grid of article cards              */
/* --------------------------------------------------------------------- */

interface BlogArticle {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  tags: string[]
  featuredImage: string
}

function parseArticles(section: Section): BlogArticle[] {
  const items = section.components
    .filter((c) => c.type === 'blog-article' && c.enabled)
    .sort((a, b) => a.order - b.order)

  return items.map((item) => ({
    id: item.id,
    title: (item.props?.title as string) || 'Untitled',
    excerpt: (item.props?.excerpt as string) || '',
    author: (item.props?.author as string) || '',
    date: (item.props?.date as string) || '',
    tags: ((item.props?.tags as string) || '').split(',').map((t) => t.trim()).filter(Boolean),
    featuredImage: (item.props?.featuredImage as string) || '',
  }))
}

export function BlogCardGrid({ section }: { section: Section }) {
  const effectClass = getImageEffectClass(section)
  const articles = parseArticles(section)
  const showDates = section.content?.showDates !== false
  const showTags = section.content?.showTags !== false

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getStr(section, 'heading')}
          </h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">{getStr(section, 'subheading')}</p>
          )}
        </div>
      )}

      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <article
            key={article.id}
            className={`group rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal ${effectClass}`}
            style={{ animationDelay: `${idx * 100}ms`, background: section.style.background }}
          >
            {article.featuredImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-bold leading-snug line-clamp-2">{article.title}</h3>
              {article.excerpt && (
                <p className="text-sm opacity-70 line-clamp-2">{article.excerpt}</p>
              )}
              <div className="flex items-center gap-2 text-xs opacity-60">
                {article.author && <span>{article.author}</span>}
                {article.author && showDates && article.date && <span>·</span>}
                {showDates && article.date && <span>{article.date}</span>}
              </div>
              {showTags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full opacity-80"
                      style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 12%, transparent)` : 'rgba(99,102,241,0.12)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
