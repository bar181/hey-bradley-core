import type { Section } from '@/lib/schemas'
import { Card, CardContent } from '@/components/ui/card'
import { tokens } from '@/styles/design-tokens'

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
      <div
        className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3"
        style={{ gap: tokens.spacing['stack-gap'] }}
      >
        {testimonials.map((t) => {
          const quote = (t.props?.quote as string) || ''
          const author = (t.props?.author as string) || 'Anonymous'
          const role = (t.props?.role as string) || ''
          const avatar = (t.props?.avatar as string) || ''
          const initial = author.charAt(0).toUpperCase()

          return (
            <Card
              key={t.id}
              className="bg-theme-surface/80 text-inherit transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] cursor-default"
              style={{
                borderColor: `color-mix(in srgb, ${section.style.color} 8%, transparent)`,
                borderRadius: tokens.radius.md,
                padding: tokens.spacing['stack-gap'],
              }}
            >
              <CardContent>
                <span className="text-3xl leading-none opacity-40 block mb-1" aria-hidden>&ldquo;</span>
                <blockquote className="text-sm leading-relaxed mb-4 opacity-90">
                  {quote}
                </blockquote>
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      aria-hidden
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-current/10 flex items-center justify-center text-sm font-semibold shrink-0"
                      aria-hidden
                    >
                      {initial}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{author}</div>
                    {role && (
                      <div className="text-sm opacity-70">{role}</div>
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
