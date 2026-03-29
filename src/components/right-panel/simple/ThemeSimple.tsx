import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { THEME_REGISTRY } from '@/data/themes/index'
import { PaletteSelector } from './PaletteSelector'
import { FontSelector } from './FontSelector'

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
    colors: Record<string, string>
    typography: { fontFamily: string }
  }
  sections: Array<{
    type: string
    variant?: string
    style?: { background?: string }
  }>
}

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-hb-border/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-hb-text-muted hover:text-hb-text-primary transition-colors"
      >
        {title}
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

function ThemePreview({ theme }: { theme: ThemeJSON }) {
  const meta = theme.meta
  const p = theme.theme.palette || {
    bgPrimary: theme.theme.colors.background,
    bgSecondary: theme.theme.colors.surface,
    textPrimary: theme.theme.colors.text,
    textSecondary: theme.theme.colors.muted,
    accentPrimary: theme.theme.colors.primary,
    accentSecondary: theme.theme.colors.secondary,
  }
  const heroStyle = theme.sections[0]?.style?.background || p.bgPrimary
  const font = theme.theme.typography.fontFamily

  if (meta.heroVariant === 'split-right' || meta.heroVariant === 'split-left') {
    const isLeft = meta.heroVariant === 'split-left'
    return (
      <div className="h-24 flex items-center p-2.5 gap-2" style={{ background: heroStyle, fontFamily: font }}>
        {isLeft && <div className="w-12 h-16 rounded-md flex-shrink-0" style={{ backgroundColor: `${p.textPrimary}15` }} />}
        <div className="flex-1 space-y-1 min-w-0">
          <div className="text-[6px] font-bold truncate" style={{ color: p.textPrimary }}>{meta.name} Theme</div>
          <div className="w-8 h-2 rounded-sm" style={{ backgroundColor: p.accentPrimary }} />
        </div>
        {!isLeft && <div className="w-12 h-16 rounded-md flex-shrink-0" style={{ backgroundColor: `${p.textPrimary}15` }} />}
      </div>
    )
  }

  if (meta.heroVariant === 'overlay') {
    return (
      <div className="h-24 relative flex items-center justify-center p-2.5" style={{ background: heroStyle, fontFamily: font }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative text-center space-y-1">
          <div className="text-[6px] font-bold text-white">{meta.name} Theme</div>
          <div className="w-8 h-2 rounded-sm mx-auto" style={{ backgroundColor: p.accentPrimary }} />
        </div>
      </div>
    )
  }

  if (meta.heroVariant === 'minimal') {
    return (
      <div className="h-24 flex items-center justify-center p-3" style={{ background: heroStyle, fontFamily: font }}>
        <div className="text-[8px] font-bold tracking-tight text-center leading-tight" style={{ color: p.textPrimary }}>
          {meta.name}
        </div>
      </div>
    )
  }

  // centered (default)
  return (
    <div className="h-24 flex flex-col items-center justify-center p-2.5" style={{ background: heroStyle, fontFamily: font }}>
      <div className="text-[6px] font-bold text-center mb-1 leading-tight" style={{ color: p.textPrimary }}>{meta.name} Theme</div>
      <div className="text-[5px] text-center mb-1.5 opacity-50" style={{ color: p.textPrimary }}>Premium design</div>
      <div className="w-10 h-2 rounded-sm" style={{ backgroundColor: p.accentPrimary }} />
    </div>
  )
}

export function ThemeSimple() {
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const applyVibe = useConfigStore((s) => s.applyVibe)

  return (
    <div className="p-2 space-y-1">
      {/* Theme Presets */}
      <Accordion title="Theme Presets" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2">
          {(THEME_REGISTRY as unknown as ThemeJSON[]).map((t) => {
            const selected = t.meta.slug === selectedPreset
            return (
              <button
                key={t.meta.slug}
                type="button"
                onClick={() => applyVibe(t.meta.slug)}
                className={cn(
                  'rounded-lg border overflow-hidden transition-all text-left',
                  selected
                    ? 'border-hb-accent ring-2 ring-hb-accent/30'
                    : 'border-hb-border hover:border-hb-accent/50'
                )}
              >
                <ThemePreview theme={t} />
                <div className="p-1.5 bg-hb-surface">
                  <div className="text-[10px] text-hb-text-primary font-medium">{t.meta.name}</div>
                  <div className="text-[8px] text-hb-text-muted">{t.meta.tags.slice(0, 2).join(' · ')}</div>
                  {/* 6-slot palette dots */}
                  <div className="flex items-center gap-0.5 mt-1">
                    {t.theme.palette && Object.values(t.theme.palette).map((c, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full border border-black/10"
                        style={{ backgroundColor: c as string }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Accordion>

      {/* Color Palette */}
      <Accordion title="Color Palette" defaultOpen={false}>
        <PaletteSelector />
      </Accordion>

      {/* Font */}
      <Accordion title="Font" defaultOpen={false}>
        <FontSelector />
      </Accordion>

      {/* Mode - placeholder for future */}
      <Accordion title="Mode" defaultOpen={false}>
        <div className="px-1 text-[10px] text-hb-text-muted">
          Light/dark mode toggle — coming in Phase 1.4
        </div>
      </Accordion>
    </div>
  )
}
