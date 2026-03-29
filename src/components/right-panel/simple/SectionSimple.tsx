import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'

const CHAR_LIMITS = {
  headline: 80,
  subtitle: 200,
  cta: 30,
  badge: 40,
  trustBadges: 60,
} as const

function CharCount({ current, max }: { current: number; max: number }) {
  const ratio = current / max
  return (
    <span
      className={cn(
        'text-xs mt-0.5 block',
        ratio > 1 ? 'text-red-400' : ratio > 0.9 ? 'text-amber-400' : 'text-hb-text-muted'
      )}
    >
      {current}/{max} characters
    </span>
  )
}

const INPUT_BASE =
  'bg-hb-surface border border-hb-border rounded-lg px-3 py-2 text-sm font-ui text-hb-text-primary w-full'
const DISABLED_CLASSES = 'opacity-40 cursor-not-allowed'
const LABEL_CLASSES = 'font-mono text-[11px] uppercase text-hb-text-muted'

interface SectionSimpleProps {
  sectionId: string
}

export function SectionSimple({ sectionId }: SectionSimpleProps) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const hero = resolveHeroContent(section)

  // --- derived enabled states ---
  const eyebrowEnabled = hero.badge?.show ?? true
  const subtitleEnabled = section.components.find((c) => c.id === 'subtitle')?.enabled ?? true
  const primaryCtaEnabled =
    section.components.find((c) => c.id === 'primaryCta')?.enabled ?? true
  const secondaryCtaEnabled =
    section.components.find((c) => c.id === 'secondaryCta')?.enabled ?? true
  const heroImageEnabled =
    section.components.find((c) => c.id === 'heroImage')?.enabled ?? false
  const heroVideoEnabled =
    section.components.find((c) => c.id === 'heroVideo')?.enabled ?? false
  const trustBadgesEnabled = hero.trustBadges?.show ?? true

  // --- handlers ---
  const updateCopy = useCallback(
    (componentId: string, text: string) => {
      if (import.meta.env.DEV) console.log('[copyEdit]', componentId, text)
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { text }),
      })
    },
    [sectionId, section, setSectionConfig]
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      if (import.meta.env.DEV) console.log('[toggle]', componentId, checked)
      setSectionConfig(sectionId, {
        components: setComponentEnabled(section, componentId, checked),
      })
    },
    [sectionId, section, setSectionConfig]
  )

  const updateUrl = useCallback(
    (componentId: string, url: string) => {
      if (import.meta.env.DEV) console.log('[urlEdit]', componentId, url)
      const updatedComponents = section.components.map((c) =>
        c.id === componentId ? { ...c, props: { ...c.props, url } } : c
      )
      setSectionConfig(sectionId, { components: updatedComponents })
    },
    [sectionId, section, setSectionConfig]
  )

  return (
    <div>
      {/* ─── CONTENT ─── */}
      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-4">
          {/* Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={LABEL_CLASSES}>Badge Text</label>
              <Switch
                checked={eyebrowEnabled}
                onCheckedChange={(checked) => handleToggle('eyebrow', checked)}
                size="sm"
              />
            </div>
            <input
              type="text"
              disabled={!eyebrowEnabled}
              value={hero.badge?.text ?? ''}
              onChange={(e) => updateCopy('eyebrow', e.target.value)}
              className={cn(INPUT_BASE, !eyebrowEnabled && DISABLED_CLASSES)}
            />
            <CharCount current={(hero.badge?.text ?? '').length} max={CHAR_LIMITS.badge} />
          </div>

          {/* Headline — always on, no switch */}
          <div className="space-y-1.5">
            <label className={LABEL_CLASSES}>Headline</label>
            <textarea
              value={hero.heading?.text ?? ''}
              onChange={(e) => updateCopy('headline', e.target.value)}
              className={cn(INPUT_BASE, 'h-14 resize-none')}
            />
            <CharCount current={(hero.heading?.text ?? '').length} max={CHAR_LIMITS.headline} />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={LABEL_CLASSES}>Subtitle</label>
              <Switch
                checked={subtitleEnabled}
                onCheckedChange={(checked) => handleToggle('subtitle', checked)}
                size="sm"
              />
            </div>
            <textarea
              disabled={!subtitleEnabled}
              value={hero.subheading ?? ''}
              onChange={(e) => updateCopy('subtitle', e.target.value)}
              className={cn(INPUT_BASE, 'h-10 resize-none', !subtitleEnabled && DISABLED_CLASSES)}
            />
            <CharCount current={(hero.subheading ?? '').length} max={CHAR_LIMITS.subtitle} />
          </div>

          {/* Primary CTA */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={LABEL_CLASSES}>Primary CTA</label>
              <Switch
                checked={primaryCtaEnabled}
                onCheckedChange={(checked) => handleToggle('primaryCta', checked)}
                size="sm"
              />
            </div>
            <input
              type="text"
              disabled={!primaryCtaEnabled}
              value={hero.cta?.text ?? ''}
              onChange={(e) => updateCopy('primaryCta', e.target.value)}
              className={cn(INPUT_BASE, !primaryCtaEnabled && DISABLED_CLASSES)}
            />
            <CharCount current={(hero.cta?.text ?? '').length} max={CHAR_LIMITS.cta} />
          </div>

          {/* Secondary CTA */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={LABEL_CLASSES}>Secondary CTA</label>
              <Switch
                checked={secondaryCtaEnabled}
                onCheckedChange={(checked) => handleToggle('secondaryCta', checked)}
                size="sm"
              />
            </div>
            <input
              type="text"
              disabled={!secondaryCtaEnabled}
              value={hero.secondaryCta?.text ?? ''}
              onChange={(e) => updateCopy('secondaryCta', e.target.value)}
              className={cn(INPUT_BASE, !secondaryCtaEnabled && DISABLED_CLASSES)}
            />
            <CharCount current={(hero.secondaryCta?.text ?? '').length} max={CHAR_LIMITS.cta} />
          </div>

          {/* Hero Image */}
          {section.components.find((c) => c.id === 'heroImage') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={LABEL_CLASSES}>Hero Image</label>
                <Switch
                  checked={heroImageEnabled}
                  onCheckedChange={(checked) => handleToggle('heroImage', checked)}
                  size="sm"
                />
              </div>
              {heroImageEnabled && (
                <input
                  type="text"
                  value={
                    (section.components.find((c) => c.id === 'heroImage')?.props?.url as string) ??
                    ''
                  }
                  onChange={(e) => updateUrl('heroImage', e.target.value)}
                  placeholder="Paste an image URL..."
                  className={cn(INPUT_BASE, 'placeholder:text-hb-text-muted/50')}
                />
              )}
            </div>
          )}

          {/* Background Video */}
          {section.components.find((c) => c.id === 'heroVideo') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={LABEL_CLASSES}>Background Video</label>
                <Switch
                  checked={heroVideoEnabled}
                  onCheckedChange={(checked) => handleToggle('heroVideo', checked)}
                  size="sm"
                />
              </div>
              {heroVideoEnabled && (
                <input
                  type="text"
                  value={
                    (section.components.find((c) => c.id === 'heroVideo')?.props?.url as string) ??
                    ''
                  }
                  onChange={(e) => updateUrl('heroVideo', e.target.value)}
                  placeholder="Paste a video URL..."
                  className={cn(INPUT_BASE, 'placeholder:text-hb-text-muted/50')}
                />
              )}
            </div>
          )}

          {/* Trust Badges */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={LABEL_CLASSES}>Trust Badges</label>
              <Switch
                checked={trustBadgesEnabled}
                onCheckedChange={(checked) => handleToggle('trustBadges', checked)}
                size="sm"
              />
            </div>
            <input
              type="text"
              disabled={!trustBadgesEnabled}
              value={hero.trustBadges?.text ?? ''}
              onChange={(e) => updateCopy('trustBadges', e.target.value)}
              className={cn(INPUT_BASE, !trustBadgesEnabled && DISABLED_CLASSES)}
            />
            <CharCount
              current={(hero.trustBadges?.text ?? '').length}
              max={CHAR_LIMITS.trustBadges}
            />
          </div>
        </div>
      </RightAccordion>

      {/* ─── DESIGN ─── */}
      <RightAccordion id="design" label="Design">
        <p className="text-sm text-hb-text-muted italic">
          Theme presets are configured in the Theme panel.
        </p>
      </RightAccordion>
    </div>
  )
}
