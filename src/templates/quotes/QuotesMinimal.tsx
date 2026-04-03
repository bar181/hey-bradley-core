import type { Section } from '@/lib/schemas'

export function QuotesMinimal({ section }: { section: Section }) {
  const testimonials = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {testimonials.map((t) => {
          const quote = (t.props?.quote as string) || ''
          const author = (t.props?.author as string) || 'Anonymous'
          const role = (t.props?.role as string) || ''

          return (
            <div key={t.id} className="space-y-3">
              <blockquote className="text-base italic leading-relaxed opacity-80">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-px"
                  style={{ background: 'var(--theme-accent, #6366f1)', opacity: 0.4 }}
                />
                <span className="text-xs font-medium opacity-60">
                  {author}{role ? `, ${role}` : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
