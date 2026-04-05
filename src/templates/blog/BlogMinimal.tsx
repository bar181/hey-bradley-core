import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'

/* --------------------------------------------------------------------- */
/*  BlogMinimal — Text-only, typography-focused layout                    */
/* --------------------------------------------------------------------- */

interface BlogArticle {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  tags: string[]
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
    }))
}

export function BlogMinimal({ section }: { section: Section }) {
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

      <div className="mx-auto max-w-3xl divide-y" style={{ borderColor: section.style.color ? `color-mix(in srgb, ${section.style.color} 15%, transparent)` : 'rgba(255,255,255,0.1)' }}>
        {articles.map((article, idx) => (
          <article
            key={article.id}
            className="py-8 first:pt-0 last:pb-0 opacity-0 animate-card-reveal"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <h3 className="text-xl md:text-2xl font-bold leading-snug mb-2">{article.title}</h3>
            <div className="flex items-center gap-2 text-xs opacity-50 mb-3">
              {article.author && <span>{article.author}</span>}
              {article.author && showDates && article.date && <span>·</span>}
              {showDates && article.date && <span>{article.date}</span>}
            </div>
            {article.excerpt && (
              <p className="text-base opacity-70 leading-relaxed">{article.excerpt}</p>
            )}
            {showTags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full opacity-60"
                    style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 10%, transparent)` : 'rgba(99,102,241,0.1)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
