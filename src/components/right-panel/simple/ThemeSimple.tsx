import { useState } from 'react'
import { Sun, Moon, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { THEME_REGISTRY } from '@/data/themes/index'

interface ThemeMeta {
  name: string
  slug: string
  description: string
  tags: string[]
  mood: string
  heroVariant: string
}

interface PaletteColors {
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  accentPrimary: string
  accentSecondary: string
}

interface ThemeJSON {
  meta: ThemeMeta
  theme: {
    preset: string
    mode: string
    palette?: PaletteColors
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

const PALETTE_KEYS: Array<{ key: keyof PaletteColors; label: string }> = [
  { key: 'bgPrimary', label: 'Bg 1' },
  { key: 'bgSecondary', label: 'Bg 2' },
  { key: 'textPrimary', label: 'Text' },
  { key: 'textSecondary', label: 'Muted' },
  { key: 'accentPrimary', label: 'Accent' },
  { key: 'accentSecondary', label: 'Accent 2' },
]

const PALETTE_PRESETS: Array<{ name: string; colors: PaletteColors }> = [
  { name: 'Midnight', colors: { bgPrimary: '#0f172a', bgSecondary: '#1e293b', textPrimary: '#f8fafc', textSecondary: '#94a3b8', accentPrimary: '#3b82f6', accentSecondary: '#60a5fa' } },
  { name: 'Forest', colors: { bgPrimary: '#064e3b', bgSecondary: '#065f46', textPrimary: '#ecfdf5', textSecondary: '#a7f3d0', accentPrimary: '#10b981', accentSecondary: '#34d399' } },
  { name: 'Sunset', colors: { bgPrimary: '#1c1917', bgSecondary: '#292524', textPrimary: '#fafaf9', textSecondary: '#d6d3d1', accentPrimary: '#f97316', accentSecondary: '#fb923c' } },
  { name: 'Ocean', colors: { bgPrimary: '#0c4a6e', bgSecondary: '#075985', textPrimary: '#f0f9ff', textSecondary: '#bae6fd', accentPrimary: '#0ea5e9', accentSecondary: '#38bdf8' } },
  { name: 'Rose', colors: { bgPrimary: '#1a1a2e', bgSecondary: '#16213e', textPrimary: '#fce7f3', textSecondary: '#f9a8d4', accentPrimary: '#ec4899', accentSecondary: '#f472b6' } },
  { name: 'Cream', colors: { bgPrimary: '#faf7f2', bgSecondary: '#ffffff', textPrimary: '#1c1917', textSecondary: '#57534e', accentPrimary: '#a16207', accentSecondary: '#ca8a04' } },
  { name: 'Lavender', colors: { bgPrimary: '#faf5ff', bgSecondary: '#ffffff', textPrimary: '#1e1b4b', textSecondary: '#6366f1', accentPrimary: '#7c3aed', accentSecondary: '#a78bfa' } },
  { name: 'Slate', colors: { bgPrimary: '#f8fafc', bgSecondary: '#ffffff', textPrimary: '#0f172a', textSecondary: '#64748b', accentPrimary: '#475569', accentSecondary: '#94a3b8' } },
  { name: 'Crimson', colors: { bgPrimary: '#1a1a1a', bgSecondary: '#2c2c2c', textPrimary: '#f3f3f1', textSecondary: '#b0b0b0', accentPrimary: '#a51c30', accentSecondary: '#c1283e' } },
  { name: 'Neon', colors: { bgPrimary: '#09090b', bgSecondary: '#18181b', textPrimary: '#fafafa', textSecondary: '#a1a1aa', accentPrimary: '#22d3ee', accentSecondary: '#67e8f9' } },
]

function palettesMatch(a: PaletteColors, b: PaletteColors): boolean {
  return PALETTE_KEYS.every(({ key }) => a[key].toLowerCase() === b[key].toLowerCase())
}

export function ThemeSimple() {
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const currentMode = useConfigStore((s) => s.config.theme.mode) || 'dark'
  const currentPalette = useConfigStore((s) => s.config.theme.palette)
  const applyVibe = useConfigStore((s) => s.applyVibe)
  const toggleMode = useConfigStore((s) => s.toggleMode)
  const setPalette = useConfigStore((s) => s.setPalette)
  const designLocked = useUIStore((s) => s.designLocked)
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
    <div className={cn('space-y-4', designLocked && 'opacity-50 pointer-events-none')}>
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

      {/* Current palette display */}
      {currentPalette && (
        <div>
          <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Your Colors</div>
          <div className="flex items-center gap-2">
            {PALETTE_KEYS.map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full border-2 border-hb-border shrink-0"
                  style={{ backgroundColor: currentPalette[key] }}
                  title={`${label}: ${currentPalette[key]}`}
                />
                <span className="text-[9px] text-hb-text-muted leading-none">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Palette presets */}
      <div>
        <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Colors</div>
        <div className="space-y-0.5 rounded-lg border border-hb-border bg-hb-surface overflow-hidden max-h-[240px] overflow-y-auto">
          {PALETTE_PRESETS.map((preset) => {
            const isSelected = currentPalette ? palettesMatch(currentPalette, preset.colors) : false
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => setPalette(preset.colors)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors',
                  isSelected
                    ? 'bg-hb-accent/10 border-l-2 border-l-hb-accent'
                    : 'hover:bg-hb-surface-hover border-l-2 border-l-transparent',
                )}
              >
                <span className="text-xs text-hb-text-primary w-16 shrink-0 truncate">{preset.name}</span>
                <div className="flex items-center gap-1">
                  {PALETTE_KEYS.map(({ key }) => (
                    <div
                      key={key}
                      className="w-3 h-3 rounded-full shrink-0 border border-hb-border/40"
                      style={{ backgroundColor: preset.colors[key] }}
                    />
                  ))}
                </div>
                {isSelected && <Check size={12} className="text-hb-accent shrink-0 ml-auto" />}
              </button>
            )
          })}
        </div>
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
        Font options available in Expert tab
      </div>
    </div>
  )
}
