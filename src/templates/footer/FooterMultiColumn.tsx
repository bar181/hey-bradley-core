import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  FooterMultiColumn — Logo + 3 link columns + copyright                 */
/* --------------------------------------------------------------------- */

export function FooterMultiColumn({ section }: { section: Section }) {
  const brand = section.components.find((c) => c.id === 'brand')
  const col1 = section.components.find((c) => c.id === 'col-1')
  const col2 = section.components.find((c) => c.id === 'col-2')
  const col3 = section.components.find((c) => c.id === 'col-3')
  const copyright = section.components.find((c) => c.id === 'copyright')

  const columns = [col1, col2, col3].filter(Boolean)

  return (
    <footer
      className="px-6 py-8 md:py-12"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        {brand?.enabled && (
          <div>
            <span className="text-lg font-bold tracking-tight">
              {(brand.props?.text as string) || 'Brand'}
            </span>
            <p className="mt-2 text-sm opacity-60 max-w-[240px]">
              Building the future, one pixel at a time.
            </p>
          </div>
        )}

        {/* Link columns */}
        {columns.map((col) => {
          if (!col || !col.enabled) return null
          const heading = (col.props?.heading as string) || ''
          const linksRaw = (col.props?.links as string) || ''
          const links = linksRaw.split(',').map((l) => l.trim()).filter(Boolean)

          return (
            <div key={col.id}>
              {heading && (
                <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-3">
                  {heading}
                </h4>
              )}
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Copyright */}
      {copyright?.enabled && (
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-current/10">
          <p className="text-xs opacity-50">
            {(copyright.props?.text as string) || ''}
          </p>
        </div>
      )}
    </footer>
  )
}
