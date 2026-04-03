import type { Section } from '@/lib/schemas'

export function QuotesSingle({ section }: { section: Section }) {
  const first = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)[0]

  const quote = (first?.props?.quote as string) || 'This product changed everything for us.'
  const author = (first?.props?.author as string) || ''
  const role = (first?.props?.role as string) || ''

  return (
    <section
      className="py-12 md:py-20 px-6 text-center"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
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
      <div className="max-w-3xl mx-auto opacity-0 animate-card-reveal" style={{ animationDelay: '100ms' }}>
        {/* Large quotation mark */}
        <div
          className="text-7xl md:text-8xl font-serif leading-none mb-4 select-none"
          style={{ color: 'var(--theme-accent, #6366f1)', opacity: 0.3 }}
          aria-hidden
        >
          &ldquo;
        </div>

        <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed tracking-tight">
          {quote}
        </blockquote>

        {(author || role) && (
          <div className="mt-8 flex flex-col items-center gap-1">
            {author && (
              <span className="text-sm font-semibold tracking-wide uppercase">
                {author}
              </span>
            )}
            {role && (
              <span className="text-xs opacity-50">{role}</span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
