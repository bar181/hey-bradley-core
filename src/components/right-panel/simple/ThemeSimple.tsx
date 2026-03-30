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
    colors?: Record<string, string>
    typography: { fontFamily: string }
  }
  sections: Array<{
    type: string
    variant?: string
    style?: { background?: string }
  }>
}

function ThemePreview({ theme }: { theme: ThemeJSON }) {
  const meta = theme.meta
  const p = theme.theme.palette || {
    bgPrimary: '#0a0a1a',
    textPrimary: '#f8fafc',
    accentPrimary: '#6366f1',
  }
  const heroStyle = theme.sections[0]?.style?.background || p.bgPrimary
  const font = theme.theme.typography.fontFamily

  if (meta.heroVariant === 'split-right' || meta.heroVariant === 'split-left') {
    const isLeft = meta.heroVariant === 'split-left'
    return (
      <div className="h-16 flex items-center p-2 gap-1.5" style={{ background: heroStyle, fontFamily: font }}>
        {isLeft && <div className="w-8 h-10 rounded flex-shrink-0" style={{ backgroundColor: `${p.textPrimary}15` }} />}
        <div className="flex-1 min-w-0">
          <div className="text-[5px] font-bold truncate" style={{ color: p.textPrimary }}>{meta.name}</div>
          <div className="w-6 h-1.5 rounded-sm mt-0.5" style={{ backgroundColor: p.accentPrimary }} />
        </div>
        {!isLeft && <div className="w-8 h-10 rounded flex-shrink-0" style={{ backgroundColor: `${p.textPrimary}15` }} />}
      </div>
    )
  }
  if (meta.heroVariant === 'overlay') {
    return (
      <div className="h-16 relative flex items-center justify-center p-2" style={{ background: heroStyle, fontFamily: font }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative text-center">
          <div className="text-[5px] font-bold text-white">{meta.name}</div>
          <div className="w-6 h-1.5 rounded-sm mx-auto mt-0.5" style={{ backgroundColor: p.accentPrimary }} />
        </div>
      </div>
    )
  }
  if (meta.heroVariant === 'minimal') {
    return (
      <div className="h-16 flex items-center justify-center" style={{ background: heroStyle, fontFamily: font }}>
        <div className="text-[7px] font-bold" style={{ color: p.textPrimary }}>{meta.name}</div>
      </div>
    )
  }
  return (
    <div className="h-16 flex flex-col items-center justify-center p-2" style={{ background: heroStyle, fontFamily: font }}>
      <div className="text-[5px] font-bold text-center" style={{ color: p.textPrimary }}>{meta.name}</div>
      <div className="w-7 h-1.5 rounded-sm mt-0.5" style={{ backgroundColor: p.accentPrimary }} />
    </div>
  )
}

export function ThemeSimple() {
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const applyVibe = useConfigStore((s) => s.applyVibe)

  return (
    <div className="space-y-3">
      {/* Theme grid — 2 columns, compact */}
      <div className="grid grid-cols-2 gap-1.5">
        {(THEME_REGISTRY as unknown as ThemeJSON[]).map((t) => {
          const selected = t.meta.slug === selectedPreset
          return (
            <button
              key={t.meta.slug}
              type="button"
              onClick={() => applyVibe(t.meta.slug)}
              className={cn(
                'rounded-md border overflow-hidden transition-all text-left',
                selected
                  ? 'border-hb-accent ring-1 ring-hb-accent/30'
                  : 'border-hb-border/50 hover:border-hb-accent/40'
              )}
            >
              <ThemePreview theme={t} />
              <div className="px-1.5 py-1 bg-hb-surface">
                <div className="text-[9px] text-hb-text-primary font-medium leading-none">{t.meta.name}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Palette + Font → moved to EXPERT tab */}
      <div className="text-[9px] text-hb-text-muted italic pt-2">
        Color palette and font options available in Expert tab
      </div>
    </div>
  )
}
