import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'

const NAV_LINKS = [
  { to: '/capstone', label: 'Capstone' },
  { to: '/blog', label: 'Blog' },
  { to: '/docs', label: 'Docs' },
]

export function MarketingNav() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('hb-theme') !== 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('hb-light', !isDark)
    localStorage.setItem('hb-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <nav className="sticky top-0 z-50 bg-[var(--hb-nav-bg)] backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity">
          Hey Bradley
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={location.pathname === link.to ? 'page' : undefined}
              className={`transition-colors pb-0.5 ${
                location.pathname === link.to || (link.to === '/blog' && location.pathname.startsWith('/blog'))
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/new-project"
            className="px-5 py-2 rounded-lg bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-colors"
          >
            Try Builder
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg text-white/50 hover:text-white"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[var(--hb-nav-bg)] px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.to ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/new-project"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-2 rounded-lg bg-white/15 text-white font-semibold text-sm text-center hover:bg-white/25 transition-colors"
          >
            Try Builder
          </Link>
        </div>
      )}
    </nav>
  )
}
