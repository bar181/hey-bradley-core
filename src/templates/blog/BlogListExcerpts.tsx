import type { Section } from '@/lib/schemas'
import { getStr, getImageEffectClass } from '@/lib/sectionContent'

/* --------------------------------------------------------------------- */
/*  BlogListExcerpts — Vertical list with image left, text right          */
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
  return section.components
    .filter((c) => c.type === 'blog-article' && c.enabled)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.id,
      title: (item.props?.title as string) || 'Untitled',
      excerpt: (item.props?.excerpt as string) || '',
      author: (item.props?.author as string) || '',
      date: (item.props?.date as string) || '',
      tags: ((item.props?.tags as string) || '').split(',').map((t) => t.trim()).filter(Boolean),
      featuredImage: (item.props?.featuredImage as string) || '',
    }))
}

export function BlogListExcerpts({ section }: { section: Section }) {
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

      <div className="mx-auto max-w-4xl space-y-6">
        {articles.map((article, idx) => (
          <article
            key={article.id}
            className={`group flex flex-col sm:flex-row gap-5 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg opacity-0 animate-card-reveal ${effectClass}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {article.featuredImage && (
              <div className="sm:w-48 sm:h-32 shrink-0 rounded-xl overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold leading-snug">{article.title}</h3>
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
