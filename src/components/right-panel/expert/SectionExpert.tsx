import { useState } from 'react'
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Image as ImageIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Toggle } from '@/components/shared/Toggle'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

const sectionPresets = [
  { name: 'Modern' },
  { name: 'Minimalist' },
  { name: 'Visual' },
  { name: 'Bold' },
]

const directionButtons = [
  { icon: ArrowUp },
  { icon: ArrowDown },
  { icon: ArrowLeft },
  { icon: ArrowRight },
]

const alignButtons = [
  { icon: AlignLeft, id: 'left' },
  { icon: AlignCenter, id: 'center' },
  { icon: AlignRight, id: 'right' },
]

interface SectionExpertProps {
  sectionId: string
}

export function SectionExpert({ sectionId }: SectionExpertProps) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  const [selectedPreset, setSelectedPreset] = useState('Modern')
  const [headingLevel, setHeadingLevel] = useState('H1')
  const [primaryButton, setPrimaryButton] = useState(true)
  const [secondaryButton, setSecondaryButton] = useState(true)
  const [selectedAlign, setSelectedAlign] = useState('center')
  const [width, setWidth] = useState('Full')
  const [aspect, setAspect] = useState('16:9')
  const [buttonStyle, setButtonStyle] = useState('Filled')
  const [buttonSize, setButtonSize] = useState('M')
  const [badgePosition, setBadgePosition] = useState('Top')

  if (!section) return null

  const hero = resolveHeroContent(section)

  const headline = hero.heading?.text ?? ''
  const subtitle = hero.subheading ?? ''
  const ctaText = hero.cta?.text ?? ''
  const padding = (section.layout as Record<string, unknown>)?.padding as string ?? '64px'
  const gap = (section.layout as Record<string, unknown>)?.gap as string ?? '24px'

  const eyebrowBadge = hero.badge?.show ?? true
  const heroImage = hero.image?.show ?? false
  const trustBadges = hero.trustBadges?.show ?? true

  const setEyebrowBadge = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'eyebrow', val) })
  }
  const setHeroImage = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'heroImage', val) })
  }
  const setTrustBadges = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'trustBadges', val) })
  }

  const components = [
    {
      label: 'Eyebrow Badge',
      enabled: eyebrowBadge,
      onChange: setEyebrowBadge,
      props: null,
    },
    {
      label: 'Primary Button',
      enabled: primaryButton,
      onChange: setPrimaryButton,
      props: 'Size: M | Style: Filled | Color: accent',
    },
    {
      label: 'Secondary Button',
      enabled: secondaryButton,
      onChange: setSecondaryButton,
      props: 'Size: M | Style: Outline | Color: accent',
    },
    {
      label: 'Hero Image',
      enabled: heroImage,
      onChange: setHeroImage,
      props: 'Aspect: 16:9 | Fit: cover',
    },
    {
      label: 'Trust Badges',
      enabled: trustBadges,
      onChange: setTrustBadges,
      props: 'Layout: row | Gap: 16px',
    },
  ]

  return (
    <div>
      <RightAccordion id="design" label="Design">
        <div className="space-y-3">
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
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              Layout variant
            </span>
            <div className="bg-hb-surface rounded p-2 font-mono text-[11px] text-hb-text-muted">
              <div>display: flex</div>
              <div>direction: column</div>
              <div>align: center</div>
            </div>
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-3">
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              HEADLINE
            </span>
            <textarea
              value={headline}
              onChange={(e) =>
                setSectionConfig(sectionId, { components: updateComponentProps(section, 'headline', { text: e.target.value }) })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-14 resize-none"
            />
            <div className="text-[10px] text-hb-text-muted text-right">
              {headline.length}/100
            </div>
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              SUBTITLE
            </span>
            <textarea
              value={subtitle}
              onChange={(e) =>
                setSectionConfig(sectionId, { components: updateComponentProps(section, 'subtitle', { text: e.target.value }) })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-10 resize-none"
            />
            <div className="text-[10px] text-hb-text-muted text-right">
              {subtitle.length}/100
            </div>
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              CTA TEXT
            </span>
            <input
              type="text"
              value={ctaText}
              onChange={(e) =>
                setSectionConfig(sectionId, { components: updateComponentProps(section, 'primaryCta', { text: e.target.value }) })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full"
            />
            <div className="text-[10px] text-hb-text-muted text-right">
              {ctaText.length}/100
            </div>
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
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              HEADING LEVEL
            </span>
            <SegmentedControl
              options={['H1', 'H2', 'H3']}
              value={headingLevel}
              onChange={setHeadingLevel}
            />
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="components" label="Components">
        <div>
          {components.map((comp, i) => (
            <div
              key={comp.label}
              className={cn(
                'py-2',
                i < components.length - 1 && 'border-b border-hb-border'
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-hb-text-primary">{comp.label}</span>
                <Toggle enabled={comp.enabled} onChange={comp.onChange} size="sm" />
              </div>
              {comp.enabled && comp.props && (
                <div className="font-mono text-[10px] text-hb-text-muted mt-1">
                  {comp.props}
                </div>
              )}
            </div>
          ))}
        </div>
      </RightAccordion>

      <RightAccordion id="sectionOptions" label="Section Options">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              DIRECTION
            </span>
            <div className="flex gap-1">
              {directionButtons.map(({ icon: Icon }, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-7 h-7 rounded border border-hb-border flex items-center justify-center text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent transition-colors"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              ALIGN
            </span>
            <div className="flex gap-1">
              {alignButtons.map(({ icon: Icon, id }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedAlign(id)}
                  className={cn(
                    'w-7 h-7 rounded border flex items-center justify-center transition-colors',
                    id === selectedAlign
                      ? 'bg-hb-accent text-white border-hb-accent'
                      : 'border-hb-border text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent'
                  )}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              PADDING
            </span>
            <input
              type="text"
              value={padding}
              onChange={(e) =>
                setSectionConfig(sectionId, { layout: { padding: e.target.value } })
              }
              className="font-mono text-xs bg-hb-surface border border-hb-border rounded px-2 py-1 w-16 text-right text-hb-text-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              GAP
            </span>
            <input
              type="text"
              value={gap}
              onChange={(e) =>
                setSectionConfig(sectionId, { layout: { gap: e.target.value } })
              }
              className="font-mono text-xs bg-hb-surface border border-hb-border rounded px-2 py-1 w-16 text-right text-hb-text-primary"
            />
          </div>

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

          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              MAX-WIDTH
            </span>
            <input
              type="text"
              defaultValue="1280px"
              className="font-mono text-xs bg-hb-surface border border-hb-border rounded px-2 py-1 w-16 text-right text-hb-text-primary"
            />
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="componentOptions" label="Component Options">
        <div className="space-y-3">
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
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-hb-text-muted">
              BUTTON COLOR
            </span>
            <div className="w-4 h-4 rounded bg-hb-accent border border-hb-border" />
            <span className="font-mono text-xs text-hb-text-muted">accent</span>
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase text-hb-text-muted mb-1.5 block">
              BADGE POSITION
            </span>
            <SegmentedControl
              options={['Top', 'Center']}
              value={badgePosition}
              onChange={setBadgePosition}
            />
          </div>
        </div>
      </RightAccordion>

      {/* RAW AISP SPEC - always visible, not in accordion */}
      <div className="border-t border-hb-border my-3" />

      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] uppercase text-hb-text-muted">
          RAW AISP SPEC
        </span>
        <button
          type="button"
          className="text-hb-text-muted hover:text-hb-text-primary transition-colors"
        >
          <Copy size={14} />
        </button>
      </div>

      <div className="bg-hb-surface rounded-lg p-3 font-mono text-xs leading-relaxed overflow-auto max-h-48">
        <pre className="whitespace-pre-wrap">
          <span className="text-hb-accent">@aisp</span>
          <span className="text-hb-success"> 1.2</span>
          {'\n'}
          <span className="text-hb-accent">@page</span>
          <span className="text-hb-success"> index</span>
          {'\n'}
          <span className="text-hb-accent">@version</span>
          <span className="text-hb-success"> 1.0.0-RC1</span>
          {'\n\n'}
          <span className="text-hb-accent">@section</span>
          <span className="text-hb-success"> hero hero-01</span>
          {' {\n'}
          {'    '}
          <span className="text-hb-accent">@layout</span>
          <span className="text-hb-success"> flex column center</span>
          {'\n'}
          {'    '}
          <span className="text-hb-accent">@gap</span>
          <span className="text-hb-warning"> 24</span>
          <span className="text-hb-success">px</span>
          {'\n'}
          {'    '}
          <span className="text-hb-accent">@padding</span>
          <span className="text-hb-warning"> 64</span>
          <span className="text-hb-success">px</span>
          {'\n\n'}
          {'    '}
          <span className="text-hb-accent">@heading</span>
          <span className="text-hb-text-muted">[1]</span>
          <span className="text-hb-success"> "Ship Code at the</span>
          {'\n'}
          {'      '}
          <span className="text-hb-success">Speed of Thought"</span>
          {' {\n'}
          {'        '}
          <span className="text-hb-accent">@size</span>
          <span className="text-hb-warning"> 48</span>
          <span className="text-hb-success">px</span>
          {'\n'}
          {'        '}
          <span className="text-hb-accent">@weight</span>
          <span className="text-hb-warning"> 700</span>
          {'\n'}
          {'    }\n\n'}
          {'    '}
          <span className="text-hb-accent">@subheading</span>
          <span className="text-hb-success"> "Build AI-native..."</span>
          {'\n'}
          {'    '}
          <span className="text-hb-accent">@cta</span>
          <span className="text-hb-success"> "Get Started"</span>
          <span className="text-hb-text-muted"> → #pricing</span>
          {'\n}'}
        </pre>
      </div>
    </div>
  )
}
