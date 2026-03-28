import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Toggle } from '@/components/shared/Toggle'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import type { HeroContent } from '@/lib/schemas'

const sectionPresets = [
  { name: 'Modern' },
  { name: 'Minimalist' },
  { name: 'Visual' },
  { name: 'Bold' },
]

interface SectionSimpleProps {
  sectionId: string
}

export function SectionSimple({ sectionId }: SectionSimpleProps) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  const [selectedPreset, setSelectedPreset] = useState('Modern')
  const [primaryButton, setPrimaryButton] = useState(true)
  const [secondaryButton, setSecondaryButton] = useState(true)
  const [width, setWidth] = useState('Full')
  const [aspect, setAspect] = useState('16:9')
  const [buttonStyle, setButtonStyle] = useState('Filled')
  const [buttonSize, setButtonSize] = useState('M')

  if (!section) return null

  const hero = section.content as HeroContent

  const eyebrowBadge = hero.badge?.show ?? true
  const heroImage = hero.image?.show ?? false
  const trustBadges = hero.trustBadges?.show ?? true

  const setEyebrowBadge = (val: boolean) => {
    setSectionConfig(sectionId, { content: { badge: { show: val } } })
  }
  const setHeroImage = (val: boolean) => {
    setSectionConfig(sectionId, { content: { image: { show: val } } })
  }
  const setTrustBadges = (val: boolean) => {
    setSectionConfig(sectionId, { content: { trustBadges: { show: val } } })
  }

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
              value={hero.heading?.text ?? ''}
              onChange={(e) =>
                setSectionConfig(sectionId, { content: { heading: { text: e.target.value } } })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-14 resize-none"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              SUBTITLE
            </span>
            <textarea
              value={hero.subheading ?? ''}
              onChange={(e) =>
                setSectionConfig(sectionId, { content: { subheading: e.target.value } })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-10 resize-none"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              CTA TEXT
            </span>
            <input
              type="text"
              value={hero.cta?.text ?? ''}
              onChange={(e) =>
                setSectionConfig(sectionId, { content: { cta: { text: e.target.value } } })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              IMAGE
            </span>
            <div className="mt-1">
              <div className="flex items-center gap-3 p-3 bg-hb-surface rounded-lg border border-hb-border">
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={20} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-hb-text-secondary">No image selected</p>
                  <p className="text-[11px] text-hb-text-muted mt-0.5">PNG, JPG up to 5MB</p>
                </div>
                <button className="px-3 py-1.5 text-[11px] font-mono uppercase text-hb-text-secondary border border-hb-border rounded-md hover:text-hb-text-primary hover:border-hb-text-muted transition-colors">
                  Browse
                </button>
              </div>
            </div>
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
