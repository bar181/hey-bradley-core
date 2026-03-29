import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'

const themes = [
  { id: 'stripe-flow', name: 'Stripe Flow', tags: 'Dark \u00b7 Gradient', dots: ['#5E46BF', '#1CA8FF', '#80ECFF'], bg: 'linear-gradient(135deg, #0A2540, #1a0a3e, #0A2540)', text: '#ffffff', primary: '#5E46BF' },
  { id: 'notion-warm', name: 'Notion Warm', tags: 'Light \u00b7 Warm', dots: ['#e16259', '#e8772e', '#faf5ef'], bg: '#faf5ef', text: '#37352f', primary: '#e16259' },
  { id: 'linear-sharp', name: 'Linear Sharp', tags: 'Dark \u00b7 Minimal', dots: ['#5E6AD2', '#eeeeee', '#000000'], bg: '#000000', text: '#eeeeee', primary: '#5E6AD2' },
  { id: 'loom-friendly', name: 'Loom Friendly', tags: 'Light \u00b7 Split', dots: ['#625DF5', '#ff6b4a', '#ffffff'], bg: '#ffffff', text: '#1a1a1a', primary: '#625DF5' },
  { id: 'vercel-prism', name: 'Vercel Prism', tags: 'Dark \u00b7 Dramatic', dots: ['#0070F3', '#7928CA', '#FF0080'], bg: '#000000', text: '#ffffff', primary: '#0070F3' },
  { id: 'nature-calm', name: 'Nature Calm', tags: 'Dark \u00b7 Nature', dots: ['#22c55e', '#06b6d4', '#1a5c38'], bg: 'linear-gradient(135deg, #0a2e1a, #1a3a2e)', text: '#ffffff', primary: '#22c55e' },
  { id: 'studio-bold', name: 'Studio Bold', tags: 'Light \u00b7 Bold', dots: ['#e63946', '#1d3557', '#f5f5f0'], bg: '#f5f5f0', text: '#1a1a1a', primary: '#e63946' },
  { id: 'video-ambient', name: 'Video Ambient', tags: 'Dark \u00b7 Video', dots: ['#8b5cf6', '#06b6d4', '#1a1a2e'], bg: 'linear-gradient(135deg, #0c0a1d, #1a1a2e)', text: '#ffffff', primary: '#8b5cf6' },
  { id: 'pastel-playful', name: 'Pastel Playful', tags: 'Light \u00b7 Soft', dots: ['#7c3aed', '#ec4899', '#f0e6ff'], bg: '#f0e6ff', text: '#2d1b4e', primary: '#7c3aed' },
  { id: 'neon-terminal', name: 'Neon Terminal', tags: 'Dark \u00b7 Code', dots: ['#00ff88', '#58a6ff', '#0d1117'], bg: '#0d1117', text: '#c9d1d9', primary: '#00ff88' },
]

export function ThemeSimple() {
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const applyVibe = useConfigStore((s) => s.applyVibe)

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {themes.map((t) => {
        const selected = t.id === selectedPreset
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => applyVibe(t.id)}
            className={cn(
              'rounded-xl border overflow-hidden transition-all text-left',
              selected
                ? 'border-hb-accent ring-2 ring-hb-accent/30'
                : 'border-hb-border hover:border-hb-accent/50'
            )}
          >
            {/* Mini preview */}
            <div className="h-24 p-3 flex flex-col justify-end" style={{ background: t.bg }}>
              {/* Mini headline */}
              <div
                className="text-[8px] font-bold leading-tight truncate mb-1"
                style={{ color: t.text }}
              >
                Build Websites by Just Talking
              </div>
              {/* Mini CTA */}
              <div className="w-12 h-3 rounded-sm" style={{ backgroundColor: t.primary }} />
            </div>
            {/* Card footer */}
            <div className="p-2.5 bg-hb-surface">
              <div className="flex items-center gap-1.5 mb-1">
                {t.dots.map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="text-xs text-hb-text-primary font-medium">{t.name}</div>
              <div className="text-[10px] text-hb-text-muted font-mono">{t.tags}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
