import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'

/* --------------------------------------------------------------------- */
/*  NumbersCards — Each stat in a bordered card                            */
/* --------------------------------------------------------------------- */

export function NumbersCards({ section }: { section: Section }) {
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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-6`}>
        {items.map((item, idx) => {
          const value = (item.props?.value as string) || '0'
          const label = (item.props?.label as string) || 'Label'
          const description = (item.props?.description as string) || ''

          return (
            <div
              key={item.id}
              className="rounded-2xl border p-6 text-center space-y-2 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal"
              style={{
                animationDelay: `${idx * 100}ms`,
                background: `color-mix(in srgb, ${section.style.color} 5%, transparent)`,
                borderColor: `color-mix(in srgb, ${section.style.color} 10%, transparent)`,
              }}
            >
              <div className="text-4xl font-bold text-theme-accent">
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
