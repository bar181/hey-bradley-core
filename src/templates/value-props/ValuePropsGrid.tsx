import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  ValuePropsGrid — 4-column grid of stats / big numbers                 */
/* --------------------------------------------------------------------- */

export function ValuePropsGrid({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((item) => {
          const value = (item.props?.value as string) || '0'
          const label = (item.props?.label as string) || 'Label'
          const description = (item.props?.description as string) || ''

          return (
            <div key={item.id} className="space-y-1">
              <div className="text-4xl font-bold text-theme-accent">{value}</div>
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
