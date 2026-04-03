import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  NumbersCounters — Large numbers with labels, dynamic columns          */
/* --------------------------------------------------------------------- */

export function NumbersCounters({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 4
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  const gridClass =
    cols === 2 ? 'md:grid-cols-2'
    : cols === 3 ? 'md:grid-cols-3'
    : 'md:grid-cols-4'

  return (
    <section
      className="py-12 md:py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-8 text-center`}>
        {items.map((item, idx) => {
          const value = (item.props?.value as string) || '0'
          const label = (item.props?.label as string) || 'Label'
          const description = (item.props?.description as string) || ''

          return (
            <div key={item.id} className="space-y-1 opacity-0 animate-card-reveal" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="text-5xl font-extrabold tracking-tight text-theme-accent">
                {value}
              </div>
              <div className="text-sm font-semibold uppercase tracking-wide">
                {label}
              </div>
              {description && (
                <div className="text-xs text-theme-muted">{description}</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
