import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import fontsData from '@/data/fonts/fonts.json'

export function FontSelector() {
  const currentFont = useConfigStore((s) => s.config.theme.typography.fontFamily)
  const applyFont = useConfigStore((s) => s.applyFont)
  const designLocked = useUIStore((s) => s.designLocked)

  return (
    <div className={cn(designLocked && 'opacity-50 pointer-events-none')}>
      <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Font</div>
      <div className="grid grid-cols-2 gap-1">
        {fontsData.fonts.map((font) => (
          <button
            key={font.name}
            type="button"
            onClick={() => applyFont(font.name)}
            disabled={designLocked}
            className={cn(
              'px-2.5 py-2 rounded-md text-xs font-medium transition-all border text-left',
              currentFont === font.name
                ? 'bg-hb-accent/15 text-hb-accent border-hb-accent/40'
                : 'bg-hb-surface text-hb-text-muted border-hb-border/50 hover:border-hb-accent/30'
            )}
            style={{ fontFamily: font.name }}
          >
            {font.name}
          </button>
        ))}
      </div>
    </div>
  )
}
