import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { THEME_REGISTRY } from '@/data/themes/index'

interface PaletteEntry {
  name: string
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  accentPrimary: string
  accentSecondary: string
}

export function PaletteSelector() {
  const preset = useConfigStore((s) => s.config.theme.preset)
  const applyPalette = useConfigStore((s) => s.applyPalette)
  const currentBgPrimary = useConfigStore((s) => {
    const t = s.config.theme as Record<string, unknown>
    const p = t.palette as Record<string, string> | undefined
    return p?.bgPrimary || s.config.theme.colors.background
  })
  const currentAccent = useConfigStore((s) => {
    const t = s.config.theme as Record<string, unknown>
    const p = t.palette as Record<string, string> | undefined
    return p?.accentPrimary || s.config.theme.colors.primary
  })

  // Find the current theme's palettes
  const currentTheme = (THEME_REGISTRY as unknown as Array<{
    meta: { slug: string }
    theme: { palette?: PaletteEntry; alternativePalettes?: PaletteEntry[] }
  }>).find((t) => t.meta.slug === preset)

  if (!currentTheme?.theme.palette) return null

  const defaultPalette: PaletteEntry = { ...currentTheme.theme.palette, name: 'Default' }
  const alternatives = (currentTheme.theme.alternativePalettes || []) as PaletteEntry[]
  const allPalettes = [defaultPalette, ...alternatives]

  return (
    <div>
      <div className="text-[10px] font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Palette</div>
      <div className="space-y-0.5">
      {allPalettes.map((palette, index) => {
        const isActive = currentBgPrimary === palette.bgPrimary && currentAccent === palette.accentPrimary
        const colorSlots = [palette.bgPrimary, palette.bgSecondary, palette.textPrimary, palette.textSecondary, palette.accentPrimary, palette.accentSecondary]
        return (
          <button
            key={palette.name}
            type="button"
            onClick={() => applyPalette(index)}
            className={cn(
              'w-full flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all border',
              isActive
                ? 'border-hb-accent bg-hb-accent/10'
                : 'border-transparent hover:bg-hb-surface'
            )}
          >
            <div className="flex items-center gap-0.5">
              {colorSlots.map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="text-[9px] text-hb-text-muted">{palette.name}</span>
          </button>
        )
      })}
      </div>
    </div>
  )
}
