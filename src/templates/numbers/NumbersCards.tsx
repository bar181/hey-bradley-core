import type { Section } from '@/lib/schemas'

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
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-6`}>
        {items.map((item) => {
          const value = (item.props?.value as string) || '0'
          const label = (item.props?.label as string) || 'Label'
          const description = (item.props?.description as string) || ''

          return (
            <div
              key={item.id}
              className="rounded-xl border p-6 text-center space-y-2 transition-colors"
              style={{
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
