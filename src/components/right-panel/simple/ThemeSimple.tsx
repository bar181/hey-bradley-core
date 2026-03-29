import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'

const themes = [
  {
    id: 'midnight-modern',
    name: 'Midnight Modern',
    dots: ['#3b82f6', '#8b5cf6', '#60a5fa'],
    bg: '#0a0a1a',
    primary: '#3b82f6',
    textPreview: '#f8fafc',
  },
  {
    id: 'warm-sunrise',
    name: 'Warm Sunrise',
    dots: ['#e8772e', '#c44a3a', '#d4a12e'],
    bg: '#faf8f5',
    primary: '#e8772e',
    textPreview: '#2d1f12',
  },
  {
    id: 'electric-gradient',
    name: 'Electric Gradient',
    dots: ['#06b6d4', '#8b5cf6', '#22d3ee'],
    bg: '#0c0a1d',
    primary: '#06b6d4',
    textPreview: '#f0f0ff',
  },
]

const paletteColors = ['#3b82f6', '#8b5cf6', '#22d3ee', '#f8fafc', '#0f172a']

export function ThemeSimple() {
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const applyVibe = useConfigStore((s) => s.applyVibe)
  const [fontFamily, setFontFamily] = useState('DM Sans')
  const [headingWeight, setHeadingWeight] = useState('Bold')

  return (
    <div>
      <RightAccordion id="style" label="Style" defaultOpen>
        <div className="grid grid-cols-1 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => applyVibe(theme.id)}
              className={cn(
                'bg-hb-surface rounded-xl border p-3 cursor-pointer text-left transition-all',
                theme.id === selectedPreset
                  ? 'border-hb-accent ring-1 ring-hb-accent/30 bg-hb-accent-light'
                  : 'border-hb-border hover:border-hb-accent'
              )}
            >
              {/* Color dots */}
              <div className="flex gap-1.5 mb-2">
                {theme.dots.map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Mini preview */}
              <div
                className="h-20 rounded-lg overflow-hidden flex flex-col items-start justify-center px-4 gap-1.5"
                style={{ backgroundColor: theme.bg }}
              >
                <div className="w-16 h-1 rounded bg-white/30" />
                <div className="w-10 h-1 rounded bg-white/20" />
                <div
                  className="w-12 h-3 rounded mt-1"
                  style={{ backgroundColor: theme.primary }}
                />
              </div>

              {/* Theme name */}
              <span className="text-sm text-hb-text-primary font-medium mt-2 block">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </RightAccordion>

      <RightAccordion id="typography" label="Typography">
        <div className="space-y-3">
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              FONT FAMILY
            </span>
            <SegmentedControl
              options={['DM Sans', 'Inter', 'Poppins', 'System']}
              value={fontFamily}
              onChange={setFontFamily}
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              HEADING WEIGHT
            </span>
            <SegmentedControl
              options={['Light', 'Normal', 'Bold']}
              value={headingWeight}
              onChange={setHeadingWeight}
            />
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="colors" label="Colors">
        <div className="flex gap-2">
          {paletteColors.map((color) => (
            <div
              key={color}
              className="w-8 h-8 rounded-lg border border-hb-border cursor-pointer hover:ring-2 hover:ring-hb-accent"
              style={{ backgroundColor: color }}
            />
          ))}
          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-dashed border-hb-border flex items-center justify-center text-hb-text-muted hover:text-hb-text-secondary"
          >
            <Plus size={14} />
          </button>
        </div>
      </RightAccordion>
    </div>
  )
}
