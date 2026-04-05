import { useCallback } from 'react'
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

// Preset maps to section.variant
const sectionPresets = [
  { name: 'Modern' },
  { name: 'Minimalist' },
  { name: 'Visual' },
  { name: 'Bold' },
]

const directionButtons = [
  { icon: ArrowUp, direction: 'column' as const },
  { icon: ArrowDown, direction: 'column' as const },
  { icon: ArrowLeft, direction: 'row' as const },
  { icon: ArrowRight, direction: 'row' as const },
]

const alignButtons = [
  { icon: AlignLeft, id: 'start' as const },
  { icon: AlignCenter, id: 'center' as const },
  { icon: AlignRight, id: 'end' as const },
]

const WIDTH_MAP: Record<string, string> = {
  Narrow: '768px',
  Medium: '1024px',
  Wide: '1280px',
  Full: '100%',
}

const WIDTH_REVERSE: Record<string, string> = {
  '768px': 'Narrow',
  '1024px': 'Medium',
  '1280px': 'Wide',
  '100%': 'Full',
}

interface SectionExpertProps {
  sectionId: string
}

export function SectionExpert({ sectionId }: SectionExpertProps) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const hero = resolveHeroContent(section)

  // --- Read from config store (not local state) ---
  const headline = hero.heading?.text ?? ''
  const subtitle = hero.subheading ?? ''
  const ctaText = hero.cta?.text ?? ''
  const layout = section.layout as Record<string, unknown>
  const padding = (layout?.padding as string) ?? '64px'
  const gap = (layout?.gap as string) ?? '24px'
  const maxWidth = (layout?.maxWidth as string) ?? '1280px'
  const direction = (layout?.direction as string) ?? 'column'
  const align = (layout?.align as string) ?? 'center'

  // Derive width label from maxWidth
  const widthLabel = WIDTH_REVERSE[maxWidth] ?? 'Wide'

  // Variant / preset from section
  const selectedPreset = (section.variant ?? 'modern')

  // Heading level from headline component
  const headlineComp = section.components.find((c) => c.id === 'headline')
  const headingLevel = `H${(headlineComp?.props?.level as number) ?? 1}`

  // Component toggles
  const eyebrowBadge = hero.badge?.show ?? true
  const primaryButton = hero.cta?.show ?? true
  const secondaryButtonComp = section.components.find((c) => c.id === 'secondaryCta')
  const secondaryButton = secondaryButtonComp?.enabled ?? true
  const heroImage = hero.image?.show ?? false
  const trustBadges = hero.trustBadges?.show ?? true

  // Button props from components
  const primaryCtaComp = section.components.find((c) => c.id === 'primaryCta')
  const buttonStyle = (primaryCtaComp?.props?.style as string) ?? 'Filled'
  const buttonSize = (primaryCtaComp?.props?.size as string) ?? 'M'

  // Badge position from eyebrow component
  const eyebrowComp = section.components.find((c) => c.id === 'eyebrow')
  const badgePosition = (eyebrowComp?.props?.position as string) ?? 'Top'

  // --- Store update handlers ---
  const setPreset = (name: string) => {
    setSectionConfig(sectionId, { variant: name.toLowerCase() })
  }

  const setHeadingLevel = (level: string) => {
    const numLevel = parseInt(level.replace('H', ''), 10)
    setSectionConfig(sectionId, {
      components: updateComponentProps(section, 'headline', { level: numLevel }),
    })
  }

  const setDirection = (dir: string) => {
    setSectionConfig(sectionId, { layout: { ...layout, direction: dir } })
  }

  const setAlign = (id: string) => {
    setSectionConfig(sectionId, { layout: { ...layout, align: id } })
  }

  const setWidth = (label: string) => {
    const value = WIDTH_MAP[label] ?? '1280px'
    setSectionConfig(sectionId, { layout: { ...layout, maxWidth: value } })
  }

  const setMaxWidth = (value: string) => {
    setSectionConfig(sectionId, { layout: { ...layout, maxWidth: value } })
  }

  const setButtonStyle = (style: string) => {
    setSectionConfig(sectionId, {
      components: updateComponentProps(section, 'primaryCta', { style }),
    })
  }

  const setButtonSize = (size: string) => {
    setSectionConfig(sectionId, {
      components: updateComponentProps(section, 'primaryCta', { size }),
    })
  }

  const setBadgePosition = (position: string) => {
    setSectionConfig(sectionId, {
      components: updateComponentProps(section, 'eyebrow', { position }),
    })
  }

  const setEyebrowBadge = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'eyebrow', val) })
  }
  const setPrimaryButton = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'primaryCta', val) })
  }
  const setSecondaryButton = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'secondaryCta', val) })
  }
  const setHeroImage = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'heroImage', val) })
  }
  const setTrustBadges = (val: boolean) => {
    setSectionConfig(sectionId, { components: setComponentEnabled(section, 'trustBadges', val) })
  }

  // Build AISP-like summary from real config
  const aispSummary = buildAISPSummary(section, hero)

  const handleCopyAISP = useCallback(() => {
    navigator.clipboard.writeText(aispSummary).catch(() => {
      /* clipboard may be unavailable */
    })
  }, [aispSummary])

  const components = [
    {
      label: 'Eyebrow Badge',
      enabled: eyebrowBadge,
      onChange: setEyebrowBadge,
      props: eyebrowBadge ? `Position: ${badgePosition}` : null,
    },
    {
      label: 'Primary Button',
      enabled: primaryButton,
      onChange: setPrimaryButton,
      props: primaryButton ? `Size: ${buttonSize} | Style: ${buttonStyle}` : null,
    },
    {
      label: 'Secondary Button',
      enabled: secondaryButton,
      onChange: setSecondaryButton,
      props: secondaryButton ? 'Style: Outline' : null,
    },
    {
      label: 'Hero Image',
      enabled: heroImage,
      onChange: setHeroImage,
      props: heroImage ? 'Fit: cover' : null,
    },
    {
      label: 'Trust Badges',
      enabled: trustBadges,
      onChange: setTrustBadges,
      props: trustBadges ? `Layout: ${direction} | Gap: ${gap}` : null,
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
                onClick={() => setPreset(preset.name)}
                className={cn(
                  'bg-hb-surface rounded-lg border p-3 cursor-pointer text-left transition-colors',
                  preset.name.toLowerCase() === selectedPreset
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
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
              Layout variant
            </span>
            <div className="bg-hb-surface rounded p-2 font-mono text-xs text-hb-text-muted">
              <div>display: {String(layout?.display ?? 'flex')}</div>
              <div>direction: {direction}</div>
              <div>align: {align}</div>
            </div>
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-3">
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
              HEADLINE
            </span>
            <textarea
              value={headline}
              onChange={(e) =>
                setSectionConfig(sectionId, { components: updateComponentProps(section, 'headline', { text: e.target.value }) })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-14 resize-none"
            />
            <div className="text-xs text-hb-text-muted text-right">
              {headline.length}/100
            </div>
          </div>
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
              SUBTITLE
            </span>
            <textarea
              value={subtitle}
              onChange={(e) =>
                setSectionConfig(sectionId, { components: updateComponentProps(section, 'subtitle', { text: e.target.value }) })
              }
              className="bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full h-10 resize-none"
            />
            <div className="text-xs text-hb-text-muted text-right">
              {subtitle.length}/100
            </div>
          </div>
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
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
            <div className="text-xs text-hb-text-muted text-right">
              {ctaText.length}/100
            </div>
          </div>
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
              IMAGE
            </span>
            <div className="mt-1">
              <div className="flex items-center gap-3 p-3 bg-hb-surface rounded-lg border border-hb-border">
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={20} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-hb-text-secondary">No image selected</p>
                  <p className="text-xs text-hb-text-muted mt-0.5">PNG, JPG up to 5MB</p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-mono uppercase text-hb-text-secondary border border-hb-border rounded-md hover:text-hb-text-primary hover:border-hb-text-muted transition-colors opacity-50 cursor-not-allowed"
                  title="Image picker coming soon"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
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
                <div className="font-mono text-xs text-hb-text-muted mt-1">
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
            <span className="font-mono text-xs uppercase text-hb-text-muted">
              DIRECTION
            </span>
            <div className="flex gap-1">
              {directionButtons.map(({ icon: Icon, direction: dir }, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDirection(dir)}
                  className={cn(
                    'w-7 h-7 rounded border flex items-center justify-center transition-colors',
                    direction === dir && (i < 2 ? direction === 'column' : direction === 'row')
                      ? 'bg-hb-accent/20 text-hb-accent border-hb-accent'
                      : 'border-hb-border text-hb-text-muted hover:text-hb-text-primary hover:border-hb-accent'
                  )}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-hb-text-muted">
              ALIGN
            </span>
            <div className="flex gap-1">
              {alignButtons.map(({ icon: Icon, id }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAlign(id)}
                  className={cn(
                    'w-7 h-7 rounded border flex items-center justify-center transition-colors',
                    id === align
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
            <span className="font-mono text-xs uppercase text-hb-text-muted">
              PADDING
            </span>
            <input
              type="text"
              value={padding}
              onChange={(e) =>
                setSectionConfig(sectionId, { layout: { ...layout, padding: e.target.value } })
              }
              className="font-mono text-xs bg-hb-surface border border-hb-border rounded px-2 py-1 w-16 text-right text-hb-text-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-hb-text-muted">
              GAP
            </span>
            <input
              type="text"
              value={gap}
              onChange={(e) =>
                setSectionConfig(sectionId, { layout: { ...layout, gap: e.target.value } })
              }
              className="font-mono text-xs bg-hb-surface border border-hb-border rounded px-2 py-1 w-16 text-right text-hb-text-primary"
            />
          </div>

          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
              WIDTH
            </span>
            <SegmentedControl
              options={['Narrow', 'Medium', 'Wide', 'Full']}
              value={widthLabel}
              onChange={setWidth}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-hb-text-muted">
              MAX-WIDTH
            </span>
            <input
              type="text"
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
              className="font-mono text-xs bg-hb-surface border border-hb-border rounded px-2 py-1 w-16 text-right text-hb-text-primary"
            />
          </div>
        </div>
      </RightAccordion>

      <RightAccordion id="componentOptions" label="Component Options">
        <div className="space-y-3">
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
              BUTTON STYLE
            </span>
            <SegmentedControl
              options={['Filled', 'Outline', 'Ghost']}
              value={buttonStyle}
              onChange={setButtonStyle}
            />
          </div>
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
              BUTTON SIZE
            </span>
            <SegmentedControl
              options={['S', 'M', 'L']}
              value={buttonSize}
              onChange={setButtonSize}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase text-hb-text-muted">
              BUTTON COLOR
            </span>
            <div className="w-4 h-4 rounded bg-hb-accent border border-hb-border" />
            <span className="font-mono text-xs text-hb-text-muted">accent</span>
          </div>
          <div>
            <span className="font-mono text-xs uppercase text-hb-text-muted mb-1.5 block">
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
        <span className="font-mono text-xs uppercase text-hb-text-muted">
          RAW AISP SPEC
        </span>
        <button
          type="button"
          onClick={handleCopyAISP}
          className="text-hb-text-muted hover:text-hb-text-primary transition-colors"
          title="Copy AISP to clipboard"
        >
          <Copy size={14} />
        </button>
      </div>

      <div className="bg-hb-surface rounded-lg p-3 font-mono text-xs leading-relaxed overflow-auto max-h-48">
        <pre className="whitespace-pre-wrap text-hb-text-secondary">
          {aispSummary}
        </pre>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Build a text AISP summary from real section config
// ---------------------------------------------------------------------------

function buildAISPSummary(
  section: { type: string; id: string; variant?: string; layout: Record<string, unknown>; style: Record<string, unknown>; components: Array<{ id: string; type: string; enabled: boolean; props: Record<string, unknown> }> },
  _hero: { heading?: { text?: string; level?: number; size?: string; weight?: number }; subheading?: string; cta?: { text?: string; url?: string } }
): string {
  const lines: string[] = []
  lines.push(`@aisp 2.0`)
  lines.push(`@section ${section.type} ${section.id}`)
  if (section.variant) {
    lines.push(`  @variant ${section.variant}`)
  }
  const lay = section.layout
  lines.push(`  @layout ${lay.display ?? 'flex'} ${lay.direction ?? 'column'} ${lay.align ?? 'center'}`)
  if (lay.gap) lines.push(`  @gap ${lay.gap}`)
  if (lay.padding) lines.push(`  @padding ${lay.padding}`)
  if (lay.maxWidth) lines.push(`  @maxWidth ${lay.maxWidth}`)

  // Components summary
  for (const comp of section.components) {
    if (!comp.enabled) continue
    const text = (comp.props?.text as string) ?? ''
    if (text) {
      lines.push(`  @${comp.id} "${text.length > 40 ? text.slice(0, 40) + '...' : text}"`)
    }
  }

  // Style
  const style = section.style
  if (style?.background) lines.push(`  @bg ${style.background}`)
  if (style?.color) lines.push(`  @color ${style.color}`)

  return lines.join('\n')
}
