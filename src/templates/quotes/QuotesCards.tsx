import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
import { Card, CardContent } from '@/components/ui/card'

export function QuotesCards({ section }: { section: Section }) {
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
          const initial = author.charAt(0).toUpperCase()

          return (
            <Card key={t.id} className="bg-theme-surface/80 text-inherit rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal" style={{ animationDelay: `${idx * 100}ms`, borderColor: `color-mix(in srgb, ${section.style.color} 8%, transparent)` }}>
              <CardContent>
                <blockquote className="text-sm leading-relaxed mb-4 opacity-90">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-theme-accent/20 text-theme-accent flex items-center justify-center text-sm font-semibold shrink-0"
                    aria-hidden
                  >
                    {initial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{author}</div>
                    {role && (
                      <div className="text-xs text-theme-muted">{role}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
