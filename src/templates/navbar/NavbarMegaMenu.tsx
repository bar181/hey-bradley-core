import type { Section } from '@/lib/schemas'
import { useConfigStore } from '@/store/configStore'
import { ChevronDown, Sparkles, Layers, Zap, BookOpen, Users, ChartBar } from 'lucide-react'

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

interface MegaItem {
  icon: React.ReactNode
  label: string
  description: string
  href: string
}

const DEFAULT_MEGA_ITEMS: MegaItem[] = [
  { icon: <Sparkles size={18} aria-hidden />, label: 'Overview', description: 'See what makes us different.', href: '#overview' },
  { icon: <Layers size={18} aria-hidden />, label: 'Templates', description: 'Production-ready starting points.', href: '#templates' },
  { icon: <Zap size={18} aria-hidden />, label: 'Integrations', description: 'Plug into your existing stack.', href: '#integrations' },
  { icon: <BookOpen size={18} aria-hidden />, label: 'Guides', description: 'Walkthroughs and best practices.', href: '#guides' },
  { icon: <Users size={18} aria-hidden />, label: 'Community', description: 'Join thousands of builders.', href: '#community' },
  { icon: <ChartBar size={18} aria-hidden />, label: 'Analytics', description: 'Measure what matters.', href: '#analytics' },
]

export function NavbarMegaMenu({ section }: { section: Section }) {
  const sections = useConfigStore((s) => s.config.sections)

  const logo = (section.components.find((c) => c.id === 'logo')?.props?.text as string) || 'Hey Bradley'
  const ctaComp = section.components.find((c) => c.id === 'cta')
  const ctaText = (ctaComp?.props?.text as string) || 'Get Started'
  const ctaEnabled = ctaComp?.enabled ?? true

  const megaComp = section.components.find((c) => Array.isArray((c.props as Record<string, unknown>)?.megaMenuItems))
  const rawItems = (megaComp?.props as Record<string, unknown> | undefined)?.megaMenuItems as MegaItem[] | undefined
  const megaItems: MegaItem[] = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems.slice(0, 6) : DEFAULT_MEGA_ITEMS

  const navLinks = sections
    .filter((s) => s.enabled && s.type !== 'menu' && s.type !== 'footer' && s.type !== 'hero')
    .slice(0, 4)
    .map((s) => ({ id: s.id, label: sectionLabelMap[s.type] || s.type }))

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b border-[var(--hb-border)]/30"
      style={{
        background: section.style.background ? `${section.style.background}ee` : 'var(--theme-bg)',
        color: section.style.color || 'var(--theme-text, inherit)',
      }}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
        <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'inherit' }}>
          {logo}
        </span>

        <div className="hidden md:flex items-center gap-4">
          <details className="relative group">
            <summary className="list-none cursor-pointer text-sm px-2 py-1 rounded-md opacity-80 hover:opacity-100 inline-flex items-center gap-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]">
              <span>Explore</span>
              <ChevronDown size={14} aria-hidden className="transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div
              className="absolute left-0 top-full mt-2 w-[520px] rounded-2xl border border-[var(--hb-border)]/30 bg-[var(--hb-bg)] shadow-2xl p-5 grid grid-cols-2 gap-2"
              style={{
                background: section.style.background || 'var(--hb-bg)',
                color: section.style.color || 'inherit',
              }}
              role="menu"
              aria-label="Explore menu"
            >
              {megaItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  role="menuitem"
                  className="flex items-start gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-[var(--hb-fg)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]"
                >
                  <span className="shrink-0 mt-0.5 text-[var(--hb-accent)]">{item.icon}</span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs opacity-70 mt-0.5">{item.description}</span>
                  </span>
                </a>
              ))}
            </div>
          </details>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-sm px-2 py-1 rounded-md opacity-70 hover:opacity-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]"
              style={{ color: 'inherit' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {ctaEnabled && (
          <a
            href="#"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2"
            style={{ background: 'var(--theme-accent, var(--hb-accent))', color: 'var(--hb-bg)' }}
          >
            {ctaText}
          </a>
        )}
      </div>
    </nav>
  )
}
