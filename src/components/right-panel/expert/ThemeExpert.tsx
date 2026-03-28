import { useState } from 'react'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { RightAccordion } from '../RightAccordion'

const cssVariables = [
  { name: '--bg', color: '#0f172a', hex: '#0f172a' },
  { name: '--text', color: '#f8fafc', hex: '#f8fafc' },
  { name: '--accent', color: '#3b82f6', hex: '#3b82f6' },
  { name: '--surface', color: '#1e293b', hex: '#1e293b' },
  { name: '--border', color: '#334155', hex: '#334155' },
]

export function ThemeExpert() {
  const [headingSize, setHeadingSize] = useState('L')
  const [bodySize, setBodySize] = useState('M')
  const [fontWeight, setFontWeight] = useState('Medium')
  const [scale, setScale] = useState('1.5x')

  return (
    <div>
      <RightAccordion id="typography" label="Typography" defaultOpen>
        <div className="space-y-3">
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              HEADING SIZE
            </span>
            <SegmentedControl
              options={['S', 'M', 'L', 'XL', 'XXL']}
              value={headingSize}
              onChange={setHeadingSize}
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              BODY SIZE
            </span>
            <SegmentedControl
              options={['S', 'M', 'L']}
              value={bodySize}
              onChange={setBodySize}
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              FONT WEIGHT
            </span>
            <SegmentedControl
              options={['Light', 'Normal', 'Medium', 'Bold']}
              value={fontWeight}
              onChange={setFontWeight}
            />
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="spacing" label="Spacing">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              BASE UNIT
            </span>
            <input
              type="text"
              defaultValue="8px"
              className="bg-hb-surface border border-hb-border rounded px-2 py-1 font-mono text-xs text-hb-text-primary w-16 text-right"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              SCALE
            </span>
            <SegmentedControl
              options={['1x', '1.5x', '2x', '3x']}
              value={scale}
              onChange={setScale}
            />
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="cssVariables" label="CSS Variables">
        <div>
          {cssVariables.map((v) => (
            <div key={v.name} className="flex justify-between items-center py-1.5">
              <span className="font-mono text-[11px] text-hb-text-muted">
                {v.name}
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded border border-hb-border"
                  style={{ backgroundColor: v.color }}
                />
                <span className="font-mono text-[11px] text-hb-text-secondary">
                  {v.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </RightAccordion>
    </div>
  )
}
