import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Image, Film, Palette } from 'lucide-react'
import { ThemeSimple } from './ThemeSimple'

// ── Compact char indicator: just a colored dot + count on hover ──
function CharIndicator({ current, max }: { current: number; max: number }) {
  const ratio = current / max
  const color = ratio > 1 ? 'bg-red-400' : ratio > 0.9 ? 'bg-amber-400' : 'bg-emerald-400'
  return (
    <span className="flex items-center gap-1 shrink-0" title={`${current}/${max} characters`}>
      <span className={cn('w-1.5 h-1.5 rounded-full', color)} />
      <span className="text-[10px] text-hb-text-muted tabular-nums">{current}</span>
    </span>
  )
}

// ── Toggle row: label + char indicator + switch ──
function FieldRow({
  label,
  enabled,
  onToggle,
  charCurrent,
  charMax,
  children,
}: {
  label: string
  enabled: boolean
  onToggle?: (v: boolean) => void
  charCurrent?: number
  charMax?: number
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {onToggle && (
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            className="scale-[0.65] shrink-0"
          />
        )}
        <span className="text-[11px] font-medium text-hb-text-muted uppercase tracking-wide flex-1">
          {label}
        </span>
        {charCurrent !== undefined && charMax !== undefined && (
          <CharIndicator current={charCurrent} max={charMax} />
        )}
      </div>
      <div className={cn(!enabled && 'opacity-30 pointer-events-none')}>{children}</div>
    </div>
  )
}

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

interface SectionSimpleProps {
  sectionId: string
}

export function SectionSimple({ sectionId }: SectionSimpleProps) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const hero = resolveHeroContent(section)

  // Derived enabled states
  const getEnabled = (id: string, fallback = true) =>
    section.components.find((c) => c.id === id)?.enabled ?? fallback
  const hasComp = (id: string) => section.components.some((c) => c.id === id)

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
      setSectionConfig(sectionId, {
        components: section.components.map((c) =>
          c.id === componentId ? { ...c, props: { ...c.props, url } } : c
        ),
      })
    },
    [sectionId, section, setSectionConfig]
  )

  return (
    <div className="divide-y divide-hb-border/30">
      {/* ─── 1. HERO THEME ─── */}
      <RightAccordion id="hero-theme" label="Hero Theme" defaultOpen>
        <ThemeSimple />
      </RightAccordion>

      {/* ─── 2. LAYOUT ─── */}
      <RightAccordion id="layout" label="Layout">
        <div className="space-y-3">
          {/* Image */}
          {hasComp('heroImage') && (
            <FieldRow
              label="Hero Image"
              enabled={getEnabled('heroImage', false)}
              onToggle={(v) => handleToggle('heroImage', v)}
            >
              <div className="flex items-center gap-2">
                <Image size={14} className="text-hb-text-muted shrink-0" />
                <input
                  type="text"
                  value={(section.components.find((c) => c.id === 'heroImage')?.props?.url as string) ?? ''}
                  onChange={(e) => updateUrl('heroImage', e.target.value)}
                  placeholder="Paste image URL..."
                  className={cn(INPUT, 'text-xs')}
                />
              </div>
            </FieldRow>
          )}

          {/* Background Image */}
          {hasComp('backgroundImage') && (
            <FieldRow
              label="Background Image"
              enabled={getEnabled('backgroundImage', false)}
              onToggle={(v) => handleToggle('backgroundImage', v)}
            >
              <div className="flex items-center gap-2">
                <Image size={14} className="text-hb-text-muted shrink-0" />
                <input
                  type="text"
                  value={(section.components.find((c) => c.id === 'backgroundImage')?.props?.url as string) ?? ''}
                  onChange={(e) => updateUrl('backgroundImage', e.target.value)}
                  placeholder="Paste background image URL..."
                  className={cn(INPUT, 'text-xs')}
                />
              </div>
            </FieldRow>
          )}

          {/* Video */}
          {hasComp('heroVideo') && (
            <FieldRow
              label="Background Video"
              enabled={getEnabled('heroVideo', false)}
              onToggle={(v) => handleToggle('heroVideo', v)}
            >
              <div className="flex items-center gap-2">
                <Film size={14} className="text-hb-text-muted shrink-0" />
                <input
                  type="text"
                  value={(section.components.find((c) => c.id === 'heroVideo')?.props?.url as string) ?? ''}
                  onChange={(e) => updateUrl('heroVideo', e.target.value)}
                  placeholder="Paste video URL..."
                  className={cn(INPUT, 'text-xs')}
                />
              </div>
            </FieldRow>
          )}

          {/* Background color hint */}
          <div className="flex items-center gap-2 py-1">
            <Palette size={14} className="text-hb-text-muted" />
            <span className="text-[10px] text-hb-text-muted">Background set by theme palette</span>
          </div>
        </div>
      </RightAccordion>

      {/* ─── 3. CONTENT ─── */}
      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-3">
          {/* Badge */}
          <FieldRow
            label="Badge"
            enabled={getEnabled('eyebrow')}
            onToggle={(v) => handleToggle('eyebrow', v)}
            charCurrent={(hero.badge?.text ?? '').length}
            charMax={40}
          >
            <input
              type="text"
              value={hero.badge?.text ?? ''}
              onChange={(e) => updateCopy('eyebrow', e.target.value)}
              placeholder="e.g. New Release"
              className={INPUT}
            />
          </FieldRow>

          {/* Headline — always on */}
          <FieldRow
            label="Headline"
            enabled={true}
            charCurrent={(hero.heading?.text ?? '').length}
            charMax={80}
          >
            <textarea
              value={hero.heading?.text ?? ''}
              onChange={(e) => updateCopy('headline', e.target.value)}
              rows={2}
              className={cn(INPUT, 'resize-none leading-snug')}
            />
          </FieldRow>

          {/* Subtitle */}
          <FieldRow
            label="Subtitle"
            enabled={getEnabled('subtitle')}
            onToggle={(v) => handleToggle('subtitle', v)}
            charCurrent={(hero.subheading ?? '').length}
            charMax={200}
          >
            <textarea
              value={hero.subheading ?? ''}
              onChange={(e) => updateCopy('subtitle', e.target.value)}
              rows={3}
              className={cn(INPUT, 'resize-none leading-snug')}
            />
          </FieldRow>

          {/* Primary CTA */}
          <FieldRow
            label="Primary Button"
            enabled={getEnabled('primaryCta')}
            onToggle={(v) => handleToggle('primaryCta', v)}
            charCurrent={(hero.cta?.text ?? '').length}
            charMax={30}
          >
            <input
              type="text"
              value={hero.cta?.text ?? ''}
              onChange={(e) => updateCopy('primaryCta', e.target.value)}
              placeholder="e.g. Get Started"
              className={INPUT}
            />
          </FieldRow>

          {/* Secondary CTA */}
          <FieldRow
            label="Secondary Button"
            enabled={getEnabled('secondaryCta')}
            onToggle={(v) => handleToggle('secondaryCta', v)}
            charCurrent={(hero.secondaryCta?.text ?? '').length}
            charMax={30}
          >
            <input
              type="text"
              value={hero.secondaryCta?.text ?? ''}
              onChange={(e) => updateCopy('secondaryCta', e.target.value)}
              placeholder="e.g. Learn More"
              className={INPUT}
            />
          </FieldRow>

          {/* Trust Badges */}
          <FieldRow
            label="Trust Line"
            enabled={getEnabled('trustBadges')}
            onToggle={(v) => handleToggle('trustBadges', v)}
            charCurrent={(hero.trustBadges?.text ?? '').length}
            charMax={60}
          >
            <input
              type="text"
              value={hero.trustBadges?.text ?? ''}
              onChange={(e) => updateCopy('trustBadges', e.target.value)}
              placeholder="e.g. Trusted by 500+ teams"
              className={INPUT}
            />
          </FieldRow>
        </div>
      </RightAccordion>
    </div>
  )
}
