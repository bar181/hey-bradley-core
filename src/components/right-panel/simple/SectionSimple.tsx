import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Image, Sun, Moon } from 'lucide-react'

// ── Compact char indicator ──
function CharDot({ current, max }: { current: number; max: number }) {
  const ratio = current / max
  const color = ratio > 1 ? 'bg-red-400' : ratio > 0.9 ? 'bg-amber-400' : 'bg-emerald-400'
  return (
    <span className="flex items-center gap-1 shrink-0" title={`${current}/${max}`}>
      <span className={cn('w-1.5 h-1.5 rounded-full', color)} />
      <span className="text-xs text-hb-text-muted tabular-nums">{current}</span>
    </span>
  )
}

// ── Toggle + label row ──
function Field({
  label, enabled, onToggle, charCurrent, charMax, children,
}: {
  label: string; enabled: boolean; onToggle?: (v: boolean) => void
  charCurrent?: number; charMax?: number; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {onToggle && <Switch checked={enabled} onCheckedChange={onToggle} className="scale-[0.6] shrink-0" />}
        <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide flex-1">{label}</span>
        {charCurrent !== undefined && charMax !== undefined && <CharDot current={charCurrent} max={charMax} />}
      </div>
      <div className={cn(!enabled && 'opacity-25 pointer-events-none')}>{children}</div>
    </div>
  )
}

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

// ── Hero Layout Presets ──
const HERO_LAYOUTS = [
  { id: 'bg-image', variant: 'overlay', label: 'BG Image', desc: 'Full height', media: 'backgroundImage', size: 'full' },
  { id: 'bg-video', variant: 'centered', label: 'BG Video', desc: 'Full height', media: 'heroVideo', size: 'full' },
  { id: 'minimal-full', variant: 'minimal', label: 'Minimal', desc: 'Full height', media: 'none', size: 'full' },
  { id: 'compact', variant: 'centered', label: 'Compact', desc: 'Fit size', media: 'none', size: 'fit' },
  { id: 'image-right', variant: 'split-right', label: 'Image Right', desc: 'Full height', media: 'heroImage', size: 'full' },
  { id: 'image-left', variant: 'split-left', label: 'Image Left', desc: 'Fit size', media: 'heroImage', size: 'fit' },
  { id: 'video-bottom', variant: 'centered', label: 'Video Below', desc: 'Fit size', media: 'heroVideo', size: 'fit' },
  { id: 'image-bottom', variant: 'centered', label: 'Image Below', desc: 'Fit size', media: 'heroImage', size: 'fit' },
] as const

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&q=80'
const DEFAULT_BG_IMAGE = 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&auto=format&q=80'
const DEFAULT_VIDEO = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4'

function LayoutWireframe({ layout }: { layout: typeof HERO_LAYOUTS[number] }) {
  const m = layout.media
  const isFull = layout.size === 'full'
  const gray = 'bg-hb-text-muted/15'
  const accent = 'bg-hb-accent/60'
  const textLine = 'bg-hb-text-muted/30'

  if (m === 'backgroundImage' || (m === 'heroVideo' && layout.id === 'bg-video')) {
    return (
      <div className={cn('relative flex items-center justify-center', isFull ? 'h-full' : 'h-full', gray)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative space-y-0.5 text-center">
          <div className={cn('w-10 h-0.5 rounded-sm mx-auto', textLine)} />
          <div className={cn('w-6 h-1.5 rounded-sm mx-auto', accent)} />
        </div>
      </div>
    )
  }
  if (m === 'heroImage' && (layout.variant === 'split-right' || layout.variant === 'split-left')) {
    const imgLeft = layout.variant === 'split-left'
    return (
      <div className={cn('flex items-center gap-1.5 p-2', isFull ? 'h-full' : 'h-full')}>
        {imgLeft && <div className={cn('w-8 flex-shrink-0 rounded', isFull ? 'h-14' : 'h-10', gray)} />}
        <div className="flex-1 space-y-0.5">
          <div className={cn('w-10 h-0.5 rounded-sm', textLine)} />
          <div className={cn('w-6 h-1.5 rounded-sm', accent)} />
        </div>
        {!imgLeft && <div className={cn('w-8 flex-shrink-0 rounded', isFull ? 'h-14' : 'h-10', gray)} />}
      </div>
    )
  }
  if (m === 'heroImage' || m === 'heroVideo') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-0.5 p-1.5', isFull ? 'h-full' : 'h-full')}>
        <div className={cn('w-10 h-0.5 rounded-sm', textLine)} />
        <div className={cn('w-6 h-1.5 rounded-sm', accent)} />
        <div className={cn('w-10 h-3 rounded mt-0.5', gray)} />
      </div>
    )
  }
  return (
    <div className={cn('flex flex-col items-center justify-center gap-1', isFull ? 'h-full' : 'h-full')}>
      <div className={cn('w-12 h-0.5 rounded-sm', textLine)} />
      <div className={cn('w-8 h-1.5 rounded-sm', accent)} />
    </div>
  )
}

export function SectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const hero = resolveHeroContent(section)
  const getEnabled = (id: string, fallback = true) => section.components.find((c) => c.id === id)?.enabled ?? fallback

  const updateCopy = useCallback(
    (componentId: string, text: string) => {
      setSectionConfig(sectionId, { components: updateComponentProps(section, componentId, { text }) })
    }, [sectionId, section, setSectionConfig]
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      setSectionConfig(sectionId, { components: setComponentEnabled(section, componentId, checked) })
    }, [sectionId, section, setSectionConfig]
  )

  const updateUrl = useCallback(
    (componentId: string, url: string) => {
      setSectionConfig(sectionId, {
        components: section.components.map((c) => c.id === componentId ? { ...c, props: { ...c.props, url } } : c),
      })
    }, [sectionId, section, setSectionConfig]
  )

  const applyHeroLayout = useCallback(
    (layout: typeof HERO_LAYOUTS[number]) => {
      const mediaMap: Record<string, boolean> = {
        heroImage: layout.media === 'heroImage',
        backgroundImage: layout.media === 'backgroundImage',
        heroVideo: layout.media === 'heroVideo',
      }
      const updatedComponents = section.components.map((c) => {
        if (!(c.id in mediaMap)) return c
        const shouldEnable = mediaMap[c.id]
        const currentUrl = (c.props?.url as string) || ''
        if (shouldEnable && !currentUrl) {
          const defaultUrl = c.id === 'heroImage' ? DEFAULT_IMAGE : c.id === 'backgroundImage' ? DEFAULT_BG_IMAGE : c.id === 'heroVideo' ? DEFAULT_VIDEO : ''
          return { ...c, enabled: shouldEnable, props: { ...c.props, url: defaultUrl } }
        }
        return { ...c, enabled: shouldEnable }
      })
      setSectionConfig(sectionId, { variant: layout.variant, layout: { ...section.layout, heroLayout: layout.id }, components: updatedComponents })
    }, [sectionId, section, setSectionConfig]
  )

  const currentLayoutId = (() => {
    const v = section.variant || 'centered'
    const hasImage = getEnabled('heroImage', false)
    const hasBgImage = getEnabled('backgroundImage', false)
    const hasVideo = getEnabled('heroVideo', false)
    if (hasBgImage) return 'bg-image'
    if (hasVideo && !hasImage) return (section.layout as Record<string, unknown>).heroLayout === 'video-bottom' ? 'video-bottom' : 'bg-video'
    if (v === 'minimal') return 'minimal-full'
    if (v === 'split-right' && hasImage) return 'image-right'
    if (v === 'split-left' && hasImage) return 'image-left'
    if (hasImage) return 'image-bottom'
    return 'compact'
  })()

  // Find the active media component for the single URL input
  const activeMediaId = (() => {
    if (getEnabled('backgroundImage', false)) return 'backgroundImage'
    if (getEnabled('heroVideo', false)) return 'heroVideo'
    if (getEnabled('heroImage', false)) return 'heroImage'
    return null
  })()
  const activeMediaUrl = activeMediaId
    ? (section.components.find((c) => c.id === activeMediaId)?.props?.url as string) ?? ''
    : ''

  return (
    <div className="divide-y divide-hb-border/30">
      {/* ─── 1. LAYOUT ─── */}
      <RightAccordion id="layout" label="Layout" defaultOpen>
        <div>
          <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Hero Layout</div>
          <div className="flex flex-col gap-1">
            {HERO_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                type="button"
                onClick={() => applyHeroLayout(layout)}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border transition-all text-left',
                  currentLayoutId === layout.id
                    ? 'border-hb-accent bg-hb-accent/10'
                    : 'border-hb-border/30 hover:border-hb-accent/40 hover:bg-hb-surface-hover'
                )}
                title={`${layout.label} — ${layout.desc}`}
              >
                <div className="w-12 h-8 rounded overflow-hidden bg-hb-bg shrink-0 border border-hb-border/20">
                  <LayoutWireframe layout={layout} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-hb-text-primary truncate">{layout.label}</div>
                  <div className="text-[10px] text-hb-text-muted truncate">{layout.desc}</div>
                </div>
                {currentLayoutId === layout.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-hb-accent shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </RightAccordion>

      {/* ─── 2. VISUALS — single media URL + light/dark ─── */}
      <RightAccordion id="visuals" label="Visuals">
        <div className="space-y-3">
          {/* Single media URL input */}
          {activeMediaId && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                {activeMediaId === 'heroVideo' ? 'Video URL' : 'Image URL'}
              </span>
              <div className="flex items-center gap-1.5">
                <Image size={12} className="text-hb-text-muted shrink-0" />
                <input
                  type="text"
                  value={activeMediaUrl}
                  onChange={(e) => updateUrl(activeMediaId, e.target.value)}
                  placeholder="Paste image or video URL..."
                  data-testid="hero-media-input"
                  className={cn(INPUT, 'text-xs py-1')}
                />
              </div>
            </div>
          )}

          {/* Light / Dark toggle */}
          <div>
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Mode</span>
            <div className="flex gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => { if (config.theme.mode !== 'light') useConfigStore.getState().toggleMode() }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium border transition-all',
                  config.theme.mode === 'light'
                    ? 'bg-hb-accent/15 text-hb-accent border-hb-accent/40'
                    : 'bg-hb-surface text-hb-text-muted border-hb-border/50 hover:border-hb-accent/30'
                )}
              >
                <Sun size={10} /> Light
              </button>
              <button
                type="button"
                onClick={() => { if (config.theme.mode !== 'dark') useConfigStore.getState().toggleMode() }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium border transition-all',
                  config.theme.mode === 'dark'
                    ? 'bg-hb-accent/15 text-hb-accent border-hb-accent/40'
                    : 'bg-hb-surface text-hb-text-muted border-hb-border/50 hover:border-hb-accent/30'
                )}
              >
                <Moon size={10} /> Dark
              </button>
            </div>
          </div>
        </div>
      </RightAccordion>

      {/* ─── 3. CONTENT ─── */}
      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-2.5">
          <Field label="Badge" enabled={getEnabled('eyebrow')} onToggle={(v) => handleToggle('eyebrow', v)} charCurrent={(hero.badge?.text ?? '').length} charMax={40}>
            <input data-testid="hero-badge-input" type="text" value={hero.badge?.text ?? ''} onChange={(e) => updateCopy('eyebrow', e.target.value)} placeholder="e.g. New Release" className={INPUT} />
          </Field>

          <Field label="Headline" enabled={true} charCurrent={(hero.heading?.text ?? '').length} charMax={80}>
            <textarea data-testid="hero-headline-input" value={hero.heading?.text ?? ''} onChange={(e) => updateCopy('headline', e.target.value)} rows={2} className={cn(INPUT, 'resize-none leading-snug')} />
          </Field>

          <Field label="Subtitle" enabled={getEnabled('subtitle')} onToggle={(v) => handleToggle('subtitle', v)} charCurrent={(hero.subheading ?? '').length} charMax={200}>
            <textarea data-testid="hero-subtitle-input" value={hero.subheading ?? ''} onChange={(e) => updateCopy('subtitle', e.target.value)} rows={3} className={cn(INPUT, 'resize-none leading-snug')} />
          </Field>

          <Field label="Primary Button" enabled={getEnabled('primaryCta')} onToggle={(v) => handleToggle('primaryCta', v)} charCurrent={(hero.cta?.text ?? '').length} charMax={30}>
            <input data-testid="hero-primary-cta-input" type="text" value={hero.cta?.text ?? ''} onChange={(e) => updateCopy('primaryCta', e.target.value)} placeholder="e.g. Get Started" className={INPUT} />
          </Field>

          <Field label="Secondary Button" enabled={getEnabled('secondaryCta')} onToggle={(v) => handleToggle('secondaryCta', v)} charCurrent={(hero.secondaryCta?.text ?? '').length} charMax={30}>
            <input data-testid="hero-secondary-cta-input" type="text" value={hero.secondaryCta?.text ?? ''} onChange={(e) => updateCopy('secondaryCta', e.target.value)} placeholder="e.g. Learn More" className={INPUT} />
          </Field>

          <Field label="Trust Line" enabled={getEnabled('trustBadges')} onToggle={(v) => handleToggle('trustBadges', v)} charCurrent={(hero.trustBadges?.text ?? '').length} charMax={60}>
            <input data-testid="hero-trust-input" type="text" value={hero.trustBadges?.text ?? ''} onChange={(e) => updateCopy('trustBadges', e.target.value)} placeholder="e.g. Trusted by 500+ teams" className={INPUT} />
          </Field>
        </div>
      </RightAccordion>
    </div>
  )
}
