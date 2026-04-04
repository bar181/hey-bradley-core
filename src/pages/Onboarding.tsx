import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { THEME_REGISTRY } from '@/data/themes/index'
import { EXAMPLE_SITES } from '@/data/examples'

const STORAGE_KEY = 'hey-bradley-project'

interface ThemeMeta {
  name: string
  slug: string
  description: string
  tags: string[]
  mood: string
  heroVariant: string
}

interface ThemeJSON {
  meta: ThemeMeta
  theme: {
    preset: string
    mode: string
    palette?: {
      bgPrimary: string
      bgSecondary: string
      textPrimary: string
      textSecondary: string
      accentPrimary: string
      accentSecondary: string
    }
    typography: { fontFamily: string }
  }
  sections: Array<{
    type: string
    variant?: string
    style?: { background?: string }
  }>
}

function ThemeCard({ theme, onSelect }: { theme: ThemeJSON; onSelect: () => void }) {
  const meta = theme.meta
  const p = theme.theme.palette || {
    bgPrimary: '#0a0a1a',
    textPrimary: '#f8fafc',
    accentPrimary: '#6366f1',
  }
  const heroStyle = theme.sections.find(s => s.type === 'hero')?.style?.background || p.bgPrimary
  const font = theme.theme.typography.fontFamily
  const isDark = theme.theme.mode === 'dark'

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group rounded-xl border border-white/10 overflow-hidden transition-all hover:border-white/30 hover:scale-[1.02] hover:shadow-xl bg-[#131825] text-left"
    >
      {/* Preview area */}
      <div
        className="h-32 sm:h-36 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: heroStyle, fontFamily: font }}
      >
        {meta.heroVariant === 'overlay' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        )}
        <div className="relative text-center">
          <div
            className="text-lg sm:text-xl font-bold tracking-tight"
            style={{ color: isDark ? '#f8fafc' : p.textPrimary }}
          >
            {meta.name}
          </div>
          <div
            className="w-12 h-1.5 rounded-full mx-auto mt-2"
            style={{ backgroundColor: p.accentPrimary }}
          />
          <div
            className="text-xs mt-2 opacity-60"
            style={{ color: isDark ? '#f8fafc' : p.textPrimary }}
          >
            {meta.mood}
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="px-3 py-2.5 bg-[#0b0f1a]">
        <div className="text-sm text-white font-medium">{meta.name}</div>
        <div className="text-xs text-white/40 mt-0.5">{meta.description}</div>
      </div>
    </button>
  )
}

export function Onboarding() {
  const navigate = useNavigate()
  const applyVibe = useConfigStore((s) => s.applyVibe)
  const loadConfig = useConfigStore((s) => s.loadConfig)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)
  const hasSavedProject = typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEY)
  const [searchQuery, setSearchQuery] = useState('')
  const [themesExpanded, setThemesExpanded] = useState(false)

  const filteredExamples = useMemo(() => {
    if (!searchQuery.trim()) return EXAMPLE_SITES
    const q = searchQuery.toLowerCase()
    return EXAMPLE_SITES.filter((ex) =>
      ex.name.toLowerCase().includes(q) ||
      ex.description.toLowerCase().includes(q) ||
      ex.theme.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleThemeSelect = (slug: string) => {
    applyVibe(slug)
    navigate('/builder')
  }

  const handleExampleSelect = (example: typeof EXAMPLE_SITES[number]) => {
    loadConfig(example.config)
    // Auto-select hero section so user lands with something editable
    const heroSection = example.config.sections.find((s) => s.type === 'hero' && s.enabled)
    if (heroSection) {
      setSelectedContext({ type: 'section', sectionId: heroSection.id })
    }
    navigate('/builder')
  }

  const handleContinue = () => {
    navigate('/builder')
  }

  const handleScratch = () => {
    applyVibe('saas')
    navigate('/builder')
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-mono font-bold text-2xl sm:text-3xl tracking-tight">
              Hey Bradley
            </span>
          </div>
          <p className="text-lg sm:text-xl text-white/50 max-w-md mx-auto">
            Pick a starting point
          </p>
        </div>

        {/* Continue editing (if saved project exists) */}
        {hasSavedProject && (
          <div className="text-center mb-10">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/15 transition-colors border border-white/10"
            >
              Continue editing your project
              <span className="text-white/40">&rarr;</span>
            </button>
          </div>
        )}

        {/* One-Question Kickstart search */}
        <div className="max-w-lg mx-auto mb-10">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What kind of website do you want? (bakery, fitness studio, photography...)"
            className="w-full px-4 py-3 rounded-xl bg-[#131825] border border-white/10 text-white placeholder-white/30 text-sm focus:border-white/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Example site cards — primary action */}
        <div className="mb-14 sm:mb-16">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white/80">Start with an Example</h2>
            <p className="text-sm text-white/40 mt-1">Load a complete website instantly</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredExamples.map((example) => (
              <button
                key={example.name}
                type="button"
                onClick={() => handleExampleSelect(example)}
                className="group rounded-xl border border-white/10 overflow-hidden transition-all hover:border-white/30 hover:scale-[1.02] hover:shadow-xl bg-[#131825] text-left p-4"
              >
                <div className="text-sm font-semibold text-white group-hover:text-white/90">{example.name}</div>
                <div className="text-xs text-white/40 mt-1">{example.description}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-white/20 uppercase tracking-wider">{example.theme}</span>
                  <span className="text-[10px] text-white/20">&middot;</span>
                  <span className="text-xs text-white/20">{example.config.sections.filter(s => s.enabled).length} sections</span>
                </div>
              </button>
            ))}
            {filteredExamples.length === 0 && (
              <div className="col-span-full text-center py-8 text-white/30 text-sm">
                No examples match your search. Try a different keyword or pick a theme below.
              </div>
            )}
          </div>
        </div>

        {/* Theme grid — collapsed section */}
        <div>
          <button
            type="button"
            onClick={() => setThemesExpanded(!themesExpanded)}
            className="flex items-center justify-center gap-2 mx-auto mb-6 text-white/50 hover:text-white/70 transition-colors"
          >
            <span className="text-sm font-medium">Or choose a theme</span>
            <svg
              className={`w-4 h-4 transition-transform ${themesExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {themesExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {(THEME_REGISTRY as unknown as ThemeJSON[]).map((t) => (
                <ThemeCard
                  key={t.meta.slug}
                  theme={t}
                  onSelect={() => handleThemeSelect(t.meta.slug)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Start from scratch */}
        <div className="text-center mt-10">
          <button
            onClick={handleScratch}
            className="text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            or start from scratch &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
