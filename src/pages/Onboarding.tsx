import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@/store/configStore'
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
  const hasSavedProject = typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEY)

  const handleThemeSelect = (slug: string) => {
    applyVibe(slug)
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
            Pick a theme to start building
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

        {/* Theme grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {(THEME_REGISTRY as unknown as ThemeJSON[]).map((t) => (
            <ThemeCard
              key={t.meta.slug}
              theme={t}
              onSelect={() => handleThemeSelect(t.meta.slug)}
            />
          ))}
        </div>

        {/* Try an Example */}
        <div className="mt-14 sm:mt-16">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white/80">Try an Example</h2>
            <p className="text-sm text-white/40 mt-1">Load a complete website instantly</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {EXAMPLE_SITES.map((example) => (
              <button
                key={example.name}
                type="button"
                onClick={() => { loadConfig(example.config); navigate('/builder') }}
                className="group rounded-xl border border-white/10 overflow-hidden transition-all hover:border-white/30 hover:scale-[1.02] hover:shadow-xl bg-[#131825] text-left p-4"
              >
                <div className="text-sm font-semibold text-white group-hover:text-white/90">{example.name}</div>
                <div className="text-xs text-white/40 mt-1">{example.description}</div>
                <div className="text-xs text-white/20 mt-2 uppercase tracking-wider">{example.theme} theme</div>
              </button>
            ))}
          </div>
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
