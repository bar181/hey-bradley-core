import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { RightAccordion } from '../RightAccordion'

const presets = [
  { name: 'Modern', dots: ['#3b82f6', '#8b5cf6', '#22d3ee'] },
  { name: 'SaaS', dots: ['#22c55e', '#3b82f6', '#f8fafc'] },
  { name: 'Portfolio', dots: ['#f59e0b', '#ef4444', '#8b5cf6'] },
  { name: 'Personal', dots: ['#ec4899', '#8b5cf6', '#3b82f6'] },
]

const paletteColors = ['#3b82f6', '#8b5cf6', '#22d3ee', '#f8fafc', '#0f172a']

export function ThemeSimple() {
  const [selectedPreset, setSelectedPreset] = useState('Modern')
  const [fontFamily, setFontFamily] = useState('DM Sans')
  const [headingWeight, setHeadingWeight] = useState('Bold')

  return (
    <div>
      <RightAccordion id="style" label="Style" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setSelectedPreset(preset.name)}
              className={cn(
                'bg-hb-surface rounded-lg border p-3 cursor-pointer text-left transition-colors',
                preset.name === selectedPreset
                  ? 'border-hb-accent bg-hb-accent-light'
                  : 'border-hb-border hover:border-hb-accent'
              )}
            >
              <div className="flex gap-1.5">
                {preset.dots.map((color, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm text-hb-text-primary mt-2 block">
                {preset.name}
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
