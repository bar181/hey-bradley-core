import type { Section } from '@/lib/schemas'
import { Card, CardContent } from '@/components/ui/card'

/* --------------------------------------------------------------------- */
/*  TestimonialsCards — 3-column card grid with avatar circles            */
/* --------------------------------------------------------------------- */

export function TestimonialsCards({ section }: { section: Section }) {
  const testimonials = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => {
          const quote = (t.props?.quote as string) || ''
          const author = (t.props?.author as string) || 'Anonymous'
          const role = (t.props?.role as string) || ''
          const initial = author.charAt(0).toUpperCase()

          return (
            <Card key={t.id} className="bg-theme-surface/80" style={{ borderColor: `color-mix(in srgb, ${section.style.color} 8%, transparent)` }}>
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
