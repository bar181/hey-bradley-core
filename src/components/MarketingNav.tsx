import { Link, useLocation } from 'react-router-dom'

// P120 / A5 — audience routing (per ADR-149).
// Adds "For developers" → /research (engineer-track home) and "For teams" →
// /for-teams (Cursor/Claude-Code product teams audience). Position: between
// Research and Open Core, so the natural read-order (consumer → engineer →
// teams → open core → docs) flows top-down across the audience-segment ladder.
const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/research', label: 'Research' },
  { to: '/research', label: 'For developers' },
  { to: '/for-teams', label: 'For teams' },
  { to: '/open-core', label: 'Open Core' },
  { to: '/docs', label: 'Docs' },
]

export function MarketingNav() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[var(--hb-paper)]/85 backdrop-blur-md border-b border-[rgb(var(--hb-warm-rgb)/0.15)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-[var(--hb-ink)] tracking-tight hover:opacity-90 transition-opacity">
          Hey Bradley
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={`${link.to}|${link.label}`}
              to={link.to}
              className={`transition-colors ${
                location.pathname === link.to
                  ? 'text-[var(--hb-ink)]'
                  : 'text-[var(--hb-ink-muted)] hover:text-[var(--hb-ink)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/new-project"
            className="px-4 py-2 rounded-lg bg-[var(--hb-warm)] text-white font-semibold text-sm hover:bg-[var(--hb-warm-hover)] transition-colors"
          >
            Try Builder
          </Link>
        </div>
      </div>
    </nav>
  )
}
