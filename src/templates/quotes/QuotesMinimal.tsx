import type { Section } from '@/lib/schemas'

export function QuotesMinimal({ section }: { section: Section }) {
  const testimonials = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-12 md:py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--theme-accent, currentColor)', opacity: 0.6 }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {(section.content as any).heading}
          </h2>
          {(section.content as any)?.subheading && (
            <p className="text-lg mt-3 opacity-70">
              {(section.content as any).subheading}
            </p>
          )}
        </div>
      )}
      <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {testimonials.map((t, idx) => {
          const quote = (t.props?.quote as string) || ''
          const author = (t.props?.author as string) || 'Anonymous'
          const role = (t.props?.role as string) || ''

          return (
            <div key={t.id} className="space-y-3 opacity-0 animate-card-reveal" style={{ animationDelay: `${idx * 100}ms` }}>
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
