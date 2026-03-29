import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import fontsData from '@/data/fonts/fonts.json'

export function FontSelector() {
  const currentFont = useConfigStore((s) => s.config.theme.typography.fontFamily)
  const applyFont = useConfigStore((s) => s.applyFont)

  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-hb-text-muted mb-2 px-1">Font</div>
      <div className="flex flex-wrap gap-1.5 px-1">
        {fontsData.fonts.map((font) => (
          <button
            key={font.name}
            type="button"
            onClick={() => applyFont(font.name)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all border',
              currentFont === font.name
                ? 'bg-hb-accent text-white border-hb-accent'
                : 'bg-hb-surface text-hb-text-muted border-hb-border hover:border-hb-accent/50'
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
