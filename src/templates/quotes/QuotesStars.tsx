import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
import { Card, CardContent } from '@/components/ui/card'

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          style={{ color: 'var(--theme-accent, #f59e0b)' }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function QuotesStars({ section }: { section: Section }) {
  const testimonials = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-12 md:py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getStr(section, 'heading')}
          </h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">
              {getStr(section, 'subheading')}
            </p>
          )}
        </div>
      )}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => {
          const quote = (t.props?.quote as string) || ''
          const author = (t.props?.author as string) || 'Anonymous'
          const role = (t.props?.role as string) || ''

          return (
            <Card key={t.id} className="bg-theme-surface/80 text-inherit rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal" style={{ animationDelay: `${idx * 100}ms`, borderColor: `color-mix(in srgb, ${section.style.color} 8%, transparent)` }}>
              <CardContent>
                <StarRow />
                <blockquote className="text-sm leading-relaxed mb-4 opacity-90">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div>
                  <div className="text-sm font-semibold">{author}</div>
                  {role && (
                    <div className="text-xs text-theme-muted">{role}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
