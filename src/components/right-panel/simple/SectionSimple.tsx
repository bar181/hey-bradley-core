import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Toggle } from '@/components/shared/Toggle'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { RightAccordion } from '../RightAccordion'

const sectionPresets = [
  { name: 'Modern' },
  { name: 'Minimalist' },
  { name: 'Visual' },
  { name: 'Bold' },
]

interface SectionSimpleProps {
  sectionId: string
}

export function SectionSimple({ sectionId: _sectionId }: SectionSimpleProps) {
  const [selectedPreset, setSelectedPreset] = useState('Modern')
  const [eyebrowBadge, setEyebrowBadge] = useState(true)
  const [primaryButton, setPrimaryButton] = useState(true)
  const [secondaryButton, setSecondaryButton] = useState(true)
  const [heroImage, setHeroImage] = useState(false)
  const [trustBadges, setTrustBadges] = useState(true)
  const [width, setWidth] = useState('Full')
  const [aspect, setAspect] = useState('16:9')
  const [buttonStyle, setButtonStyle] = useState('Filled')
  const [buttonSize, setButtonSize] = useState('M')

  const components = [
    { label: 'Eyebrow Badge', enabled: eyebrowBadge, onChange: setEyebrowBadge },
    { label: 'Primary Button', enabled: primaryButton, onChange: setPrimaryButton },
    { label: 'Secondary Button', enabled: secondaryButton, onChange: setSecondaryButton },
    { label: 'Hero Image', enabled: heroImage, onChange: setHeroImage },
    { label: 'Trust Badges', enabled: trustBadges, onChange: setTrustBadges },
  ]

  return (
    <div>
      <RightAccordion id="design" label="Design">
        <div className="grid grid-cols-2 gap-3">
          {sectionPresets.map((preset) => (
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
              <div className="space-y-1.5 mb-2">
                <div className="w-8 h-1 bg-hb-text-muted/30 rounded" />
                <div className="w-12 h-1 bg-hb-text-muted/30 rounded" />
                <div className="w-10 h-2 bg-hb-accent rounded" />
              </div>
              <span className="text-sm text-hb-text-primary block">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </RightAccordion>

      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-3">
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              HEADLINE
            </span>
            <textarea
              defaultValue="Ship Code at the Speed of Thought"
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-14 resize-none"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              SUBTITLE
            </span>
            <textarea
              defaultValue="Build AI-native experiences that transform how we create."
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-10 resize-none"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              CTA TEXT
            </span>
            <input
              type="text"
              defaultValue="Get Started"
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              IMAGE
            </span>
            <button
              type="button"
              className="bg-hb-surface border border-dashed border-hb-border rounded-lg px-3 py-3 w-full text-sm text-hb-text-muted text-center hover:border-hb-text-muted transition-colors"
            >
              Select image...
            </button>
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="components" label="Components">
        <div>
          {components.map((comp, i) => (
            <div
              key={comp.label}
              className={cn(
                'flex justify-between items-center py-2',
                i < components.length - 1 && 'border-b border-hb-border'
              )}
            >
              <span className="text-sm text-hb-text-primary">{comp.label}</span>
              <Toggle enabled={comp.enabled} onChange={comp.onChange} size="sm" />
            </div>
          ))}
        </div>
      </RightAccordion>

      <RightAccordion id="sectionOptions" label="Section Options">
        <div className="space-y-3">
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              WIDTH
            </span>
            <SegmentedControl
              options={['Narrow', 'Medium', 'Wide', 'Full']}
              value={width}
              onChange={setWidth}
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              ASPECT RATIO
            </span>
            <SegmentedControl
              options={['2:1', '16:9', 'Full']}
              value={aspect}
              onChange={setAspect}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              BACKGROUND
            </span>
            <div className="w-6 h-6 rounded bg-[#0a0a0f] border border-hb-border" />
            <span className="font-mono text-xs text-hb-text-muted">Dark</span>
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="componentOptions" label="Component Options">
        <div className="space-y-3">
          <p className="text-sm text-hb-text-muted italic">
            Component-level options will appear here as components are configured.
          </p>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              BUTTON STYLE
            </span>
            <SegmentedControl
              options={['Filled', 'Outline', 'Ghost']}
              value={buttonStyle}
              onChange={setButtonStyle}
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              BUTTON SIZE
            </span>
            <SegmentedControl
              options={['S', 'M', 'L']}
              value={buttonSize}
              onChange={setButtonSize}
            />
          </div>
        </div>
      </RightAccordion>
    </div>
  )
}
