import type { Section } from '@/lib/schemas'
import { useConfigStore } from '@/store/configStore'

const sectionLabelMap: Record<string, string> = {
  hero: 'Home',
  features: 'Features',
  pricing: 'Pricing',
  cta: 'Get Started',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  value_props: 'Stats',
  footer: 'Contact',
}

export function NavbarSimple({ section }: { section: Section }) {
  const sections = useConfigStore((s) => s.config.sections)

  const logo = (section.components.find((c) => c.id === 'logo')?.props?.text as string) || 'Hey Bradley'
  const ctaComp = section.components.find((c) => c.id === 'cta')
  const ctaText = (ctaComp?.props?.text as string) || 'Get Started'
  const ctaEnabled = ctaComp?.enabled ?? true

  // Auto-generate nav links from enabled non-navbar, non-footer sections
  const navLinks = sections
    .filter((s) => s.enabled && s.type !== 'navbar' && s.type !== 'footer' && s.type !== 'hero')
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      label: sectionLabelMap[s.type] || s.type,
    }))

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: section.style.background ? `${section.style.background}ee` : 'rgba(10,10,26,0.92)',
        color: section.style.color || '#f8fafc',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'inherit' }}>
          {logo}
        </span>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: 'inherit' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA button */}
        {ctaEnabled && (
          <a
            href="#"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
