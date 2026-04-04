import type { Section } from '@/lib/schemas'
import { useConfigStore } from '@/store/configStore'

const sectionLabelMap: Record<string, string> = {
  hero: 'Home',
  columns: 'Features',
  pricing: 'Pricing',
  action: 'Get Started',
  quotes: 'Testimonials',
  questions: 'FAQ',
  numbers: 'Stats',
  gallery: 'Gallery',
  footer: 'Contact',
}

export function NavbarCentered({ section }: { section: Section }) {
  const sections = useConfigStore((s) => s.config.sections)

  const logo = (section.components.find((c) => c.id === 'logo')?.props?.text as string) || 'Hey Bradley'
  const ctaComp = section.components.find((c) => c.id === 'cta')
  const ctaText = (ctaComp?.props?.text as string) || 'Get Started'
  const ctaEnabled = ctaComp?.enabled ?? true

  const navLinks = sections
    .filter((s) => s.enabled && s.type !== 'menu' && s.type !== 'footer' && s.type !== 'hero')
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      label: sectionLabelMap[s.type] || s.type,
    }))

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: section.style.background ? `${section.style.background}ee` : 'var(--theme-bg)',
        color: section.style.color || 'var(--theme-text, inherit)',
        borderColor: `color-mix(in srgb, ${section.style.color || 'currentColor'} 8%, transparent)`,
      }}
    >
      <div className="mx-auto max-w-6xl flex flex-col items-center px-6 py-3">
        {/* Logo — centered top */}
        <span className="font-bold text-lg tracking-tight mb-1" style={{ fontFamily: 'inherit' }}>
          {logo}
        </span>

        {/* Nav links — hidden on mobile, centered row on md+ */}
        <div className="hidden md:flex items-center gap-1 flex-wrap justify-center">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-sm px-3 py-1.5 rounded-md opacity-70 hover:opacity-100 hover:bg-white/5 transition-all"
              style={{ color: 'inherit' }}
            >
              {link.label}
            </a>
          ))}
          {ctaEnabled && (
            <a
              href="#"
              className="ml-2 inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90 hover:shadow-sm"
              style={{
                background: 'var(--theme-accent, #6366f1)',
                color: '#fff',
              }}
            >
              {ctaText}
            </a>
          )}
        </div>

        {/* Mobile: just the CTA */}
        {ctaEnabled && (
          <a
            href="#"
            className="md:hidden mt-1 inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: 'var(--theme-accent, #6366f1)',
              color: '#fff',
            }}
          >
            {ctaText}
          </a>
        )}
      </div>
    </nav>
  )
}
