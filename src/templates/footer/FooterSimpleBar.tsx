import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  FooterSimpleBar — Copyright + horizontal links in one line            */
/* --------------------------------------------------------------------- */

export function FooterSimpleBar({ section }: { section: Section }) {
  const copyright = section.components.find((c) => c.id === 'copyright')
  const columns = [
    section.components.find((c) => c.id === 'col-1'),
    section.components.find((c) => c.id === 'col-2'),
    section.components.find((c) => c.id === 'col-3'),
  ].filter(Boolean)

  // Flatten all links from all columns
  const allLinks = columns
    .filter((col) => col && col.enabled)
    .flatMap((col) => {
      const linksRaw = (col!.props?.links as string) || ''
      return linksRaw.split(',').map((l) => l.trim()).filter(Boolean)
    })

  return (
    <footer
      className="px-6 py-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {copyright?.enabled && (
          <p className="text-xs opacity-50">
            {(copyright.props?.text as string) || ''}
          </p>
        )}
        {allLinks.length > 0 && (
          <nav className="flex flex-wrap items-center gap-4">
            {allLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs opacity-60 hover:opacity-100 transition-opacity"
              >
                {link}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}
