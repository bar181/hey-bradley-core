import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  FooterMinimal — Just copyright text, centered                         */
/* --------------------------------------------------------------------- */

export function FooterMinimal({ section }: { section: Section }) {
  const copyright = section.components.find((c) => c.id === 'copyright')
  const copyrightText = (copyright?.props?.text as string) || ''

  return (
    <footer
      className="px-6 py-8"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs opacity-50">
          {copyrightText || '\u00A9 2026 Company. All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}
