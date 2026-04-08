import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/aisp', label: 'AISP' },
  { to: '/research', label: 'Research' },
  { to: '/open-core', label: 'Open Core' },
  { to: '/docs', label: 'Docs' },
]

export function MarketingNav() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white tracking-tight hover:text-white/90 transition-colors">
          Hey Bradley
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors ${
                location.pathname === link.to
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/new-project"
            className="px-4 py-2 rounded-lg bg-white text-neutral-900 font-semibold text-sm hover:bg-neutral-100 transition-colors"
          >
            Try Builder
          </Link>
        </div>
      </div>
    </nav>
  )
}
