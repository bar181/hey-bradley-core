import { RightAccordion } from '../RightAccordion'
import { PaletteSelector } from '../simple/PaletteSelector'
import { FontSelector } from '../simple/FontSelector'
import { useConfigStore } from '@/store/configStore'
import { resolveColors } from '@/lib/resolveColors'

export function ThemeExpert() {
  const theme = useConfigStore((s) => s.config.theme)
  const colors = resolveColors(theme)

  const cssVars = [
    { name: '--theme-bg', value: colors.bgPrimary },
    { name: '--theme-surface', value: colors.bgSecondary },
    { name: '--theme-text', value: colors.textPrimary },
    { name: '--theme-muted', value: colors.textSecondary },
    { name: '--theme-accent', value: colors.accentPrimary },
    { name: '--theme-accent-2', value: colors.accentSecondary },
  ]

  return (
    <div>
      {/* Color Palette */}
      <RightAccordion id="palette" label="Color Palette" defaultOpen>
        <PaletteSelector />
      </RightAccordion>

      {/* Font */}
      <RightAccordion id="font" label="Font Family">
        <FontSelector />
      </RightAccordion>

      {/* CSS Variables (read-only view) */}
      <RightAccordion id="cssVariables" label="CSS Variables">
        <div>
          {cssVars.map((v) => (
            <div key={v.name} className="flex justify-between items-center py-1.5">
              <span className="font-mono text-[11px] text-hb-text-muted">{v.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded border border-hb-border" style={{ backgroundColor: v.value }} />
                <span className="font-mono text-[11px] text-hb-text-secondary">{v.value}</span>
              </div>
            </div>
          ))}
        </div>
      </RightAccordion>
    </div>
  )
}
