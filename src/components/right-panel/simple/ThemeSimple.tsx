import { useState } from 'react'
import { Sun, Moon, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { THEME_REGISTRY } from '@/data/themes/index'

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

const MODE_OPTIONS = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
] as const

export function ThemeSimple() {
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const currentMode = useConfigStore((s) => s.config.theme.mode) || 'dark'
  const applyVibe = useConfigStore((s) => s.applyVibe)
  const toggleMode = useConfigStore((s) => s.toggleMode)
  const [expanded, setExpanded] = useState(false)

  const themes = THEME_REGISTRY as unknown as ThemeJSON[]
  const currentTheme = themes.find((t) => t.meta.slug === selectedPreset)

  const handleModeChange = (mode: string) => {
    if (mode !== currentMode) {
      toggleMode()
    }
  }

  const handleSelect = (slug: string) => {
    applyVibe(slug)
    setExpanded(false)
  }

  return (
    <div className="space-y-4">
      {/* Current theme selector — dropdown style */}
      <div>
        <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Theme</div>

        {/* Selected theme display */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-hb-border bg-hb-surface hover:bg-hb-surface-hover transition-colors text-left"
        >
          {/* Color swatch */}
          {currentTheme && (
            <div
              className="w-8 h-8 rounded-md shrink-0 border border-hb-border/50"
              style={{
                background: currentTheme.theme.palette?.bgPrimary || '#0a0a1a',
                boxShadow: `inset 0 -8px 0 ${currentTheme.theme.palette?.accentPrimary || '#6366f1'}`,
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-hb-text-primary truncate">
              {currentTheme?.meta.name || selectedPreset}
            </div>
            <div className="text-xs text-hb-text-muted truncate">
              {currentTheme?.meta.mood || ''}
            </div>
          </div>
          <ChevronDown size={14} className={cn('text-hb-text-muted transition-transform', expanded && 'rotate-180')} />
        </button>

        {/* Expanded theme list */}
        {expanded && (
          <div className="mt-1.5 rounded-lg border border-hb-border bg-hb-surface overflow-hidden max-h-[320px] overflow-y-auto">
            {themes.map((t) => {
              const selected = t.meta.slug === selectedPreset
              const p = t.theme.palette || { bgPrimary: '#0a0a1a', accentPrimary: '#6366f1', textPrimary: '#f8fafc' }
              return (
                <button
                  key={t.meta.slug}
                  type="button"
                  onClick={() => handleSelect(t.meta.slug)}
                  data-theme-card={t.meta.slug}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                    selected
                      ? 'bg-hb-accent/10'
                      : 'hover:bg-hb-surface-hover'
                  )}
                >
                  {/* Color swatch */}
                  <div
                    className="w-7 h-7 rounded shrink-0 border border-hb-border/30"
                    style={{
                      background: p.bgPrimary,
                      boxShadow: `inset 0 -6px 0 ${p.accentPrimary}`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-hb-text-primary truncate">{t.meta.name}</div>
                    <div className="text-xs text-hb-text-muted truncate">{t.meta.description}</div>
                  </div>
                  {selected && <Check size={14} className="text-hb-accent shrink-0" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Mode toggle */}
      <div>
        <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Mode</div>
        <div className="flex rounded-lg border border-hb-border overflow-hidden">
          {MODE_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleModeChange(value)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                currentMode === value
                  ? 'bg-hb-accent text-white'
                  : 'bg-hb-surface text-hb-text-muted hover:bg-hb-surface-hover',
              )}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <div className="text-xs text-hb-text-muted italic">
        Color palette and font options available in Expert tab
      </div>
    </div>
  )
}
