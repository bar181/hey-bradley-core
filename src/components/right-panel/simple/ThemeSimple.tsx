import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'

interface ThemeData {
  id: string
  name: string
  tags: string
  font: string
  layout: 'centered' | 'split' | 'overlay' | 'minimal'
  dots: string[]
  bg: string
  text: string
  primary: string
}

const themes: ThemeData[] = [
  { id: 'stripe-flow', name: 'Stripe Flow', tags: 'Dark \u00b7 Gradient', font: 'Inter',
    layout: 'centered', dots: ['#5E46BF', '#1CA8FF', '#80ECFF', '#0A2540', '#ffffff'],
    bg: 'linear-gradient(135deg, #0A2540, #1a0a3e, #0A2540)', text: '#ffffff', primary: '#5E46BF' },
  { id: 'notion-warm', name: 'Notion Warm', tags: 'Light \u00b7 Warm', font: 'Georgia',
    layout: 'centered', dots: ['#e16259', '#e8772e', '#faf5ef', '#37352f', '#ffffff'],
    bg: '#faf5ef', text: '#37352f', primary: '#e16259' },
  { id: 'linear-sharp', name: 'Linear Sharp', tags: 'Dark \u00b7 Minimal', font: 'Inter',
    layout: 'minimal', dots: ['#5E6AD2', '#eeeeee', '#000000', '#1a1a1a', '#ffffff'],
    bg: '#000000', text: '#eeeeee', primary: '#5E6AD2' },
  { id: 'loom-friendly', name: 'Loom Friendly', tags: 'Light \u00b7 Split', font: 'Inter',
    layout: 'split', dots: ['#625DF5', '#ff6b4a', '#ffffff', '#1a1a1a', '#666666'],
    bg: '#ffffff', text: '#1a1a1a', primary: '#625DF5' },
  { id: 'vercel-prism', name: 'Vercel Prism', tags: 'Dark \u00b7 Dramatic', font: 'Inter',
    layout: 'centered', dots: ['#0070F3', '#7928CA', '#FF0080', '#000000', '#ffffff'],
    bg: '#000000', text: '#ffffff', primary: '#0070F3' },
  { id: 'nature-calm', name: 'Nature Calm', tags: 'Dark \u00b7 Nature', font: 'Merriweather',
    layout: 'overlay', dots: ['#22c55e', '#06b6d4', '#1a5c38', '#0a2e1a', '#ffffff'],
    bg: 'linear-gradient(135deg, #0a2e1a, #1a3a2e)', text: '#ffffff', primary: '#22c55e' },
  { id: 'studio-bold', name: 'Studio Bold', tags: 'Light \u00b7 Bold', font: 'Poppins',
    layout: 'split', dots: ['#e63946', '#1d3557', '#f5f5f0', '#1a1a1a', '#ffffff'],
    bg: '#f5f5f0', text: '#1a1a1a', primary: '#e63946' },
  { id: 'video-ambient', name: 'Video Ambient', tags: 'Dark \u00b7 Video', font: 'System UI',
    layout: 'overlay', dots: ['#8b5cf6', '#06b6d4', '#1a1a2e', '#000000', '#ffffff'],
    bg: 'linear-gradient(135deg, #0c0a1d, #1a1a2e)', text: '#ffffff', primary: '#8b5cf6' },
  { id: 'pastel-playful', name: 'Pastel Playful', tags: 'Light \u00b7 Soft', font: 'Nunito',
    layout: 'centered', dots: ['#7c3aed', '#ec4899', '#f0e6ff', '#2d1b4e', '#ffffff'],
    bg: '#f0e6ff', text: '#2d1b4e', primary: '#7c3aed' },
  { id: 'neon-terminal', name: 'Neon Terminal', tags: 'Dark \u00b7 Code', font: 'JetBrains Mono',
    layout: 'minimal', dots: ['#00ff88', '#58a6ff', '#0d1117', '#c9d1d9', '#161b22'],
    bg: '#0d1117', text: '#c9d1d9', primary: '#00ff88' },
]

function ThemePreview({ theme }: { theme: ThemeData }) {
  if (theme.layout === 'split') {
    return (
      <div className="h-32 flex items-center p-3" style={{ background: theme.bg }}>
        <div className="flex-1 space-y-1">
          <div className="text-[7px] font-bold truncate" style={{ color: theme.text }}>Build Websites by Just Talking</div>
          <div className="w-10 h-2.5 rounded-sm" style={{ backgroundColor: theme.primary }} />
        </div>
        <div className="w-16 h-20 rounded-md ml-2" style={{ backgroundColor: `${theme.text}15` }} />
      </div>
    )
  }
  if (theme.layout === 'overlay') {
    return (
      <div className="h-32 relative flex items-center justify-center p-3" style={{ background: theme.bg }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
        <div className="relative text-center space-y-1">
          <div className="text-[7px] font-bold" style={{ color: '#ffffff' }}>Build Websites by Just Talking</div>
          <div className="w-10 h-2.5 rounded-sm mx-auto" style={{ backgroundColor: theme.primary }} />
        </div>
      </div>
    )
  }
  if (theme.layout === 'minimal') {
    return (
      <div className="h-32 flex items-center justify-center p-4" style={{ background: theme.bg }}>
        <div className="text-[9px] font-bold tracking-tight text-center leading-tight" style={{ color: theme.text }}>
          Build Websites<br/>by Just Talking
        </div>
      </div>
    )
  }
  // centered (default)
  return (
    <div className="h-32 flex flex-col items-center justify-center p-3" style={{ background: theme.bg }}>
      <div className="text-[7px] font-bold text-center mb-1.5 leading-tight" style={{ color: theme.text }}>Build Websites by Just Talking</div>
      <div className="text-[5px] text-center mb-2 opacity-60" style={{ color: theme.text }}>Describe what you want...</div>
      <div className="w-12 h-2.5 rounded-sm" style={{ backgroundColor: theme.primary }} />
    </div>
  )
}

export function ThemeSimple() {
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const applyVibe = useConfigStore((s) => s.applyVibe)

  return (
    <div className="grid grid-cols-1 gap-2 p-2">
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
            <ThemePreview theme={t} />
            {/* Card footer */}
            <div className="p-2.5 bg-hb-surface">
              <div className="text-xs text-hb-text-primary font-medium">{t.name}</div>
              <div className="text-[10px] text-hb-text-muted font-mono">{t.tags}</div>
              <div className="text-[10px] text-hb-text-muted">Font: {t.font}</div>
              {/* Color palette dots */}
              <div className="flex items-center gap-1 mt-1.5">
                {t.dots.map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
