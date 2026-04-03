import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  NumbersGradient — Stats on gradient background cards (modern)         */
/* --------------------------------------------------------------------- */

const GRADIENTS = [
  'from-violet-500/20 to-fuchsia-500/20',
  'from-cyan-500/20 to-blue-500/20',
  'from-amber-500/20 to-orange-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-rose-500/20 to-pink-500/20',
  'from-indigo-500/20 to-purple-500/20',
]

export function NumbersGradient({ section }: { section: Section }) {
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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-6`}>
        {items.map((item, i) => {
          const value = (item.props?.value as string) || '0'
          const label = (item.props?.label as string) || 'Label'
          const description = (item.props?.description as string) || ''
          const gradient = GRADIENTS[i % GRADIENTS.length]

          return (
            <div
              key={item.id}
              className={`rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-sm p-6 text-center space-y-2 border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              style={{ borderColor: `color-mix(in srgb, ${section.style.color} 10%, transparent)` }}
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
