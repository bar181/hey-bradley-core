import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Sun, Moon } from 'lucide-react'
import { ImagePicker } from './ImagePicker'

// ── Toggle + label row ──
function Field({
  label, enabled, onToggle, children,
}: {
  label: string; enabled: boolean; onToggle?: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {onToggle && <Switch checked={enabled} onCheckedChange={onToggle} className="scale-[0.6] shrink-0" />}
        <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide flex-1">{label}</span>
      </div>
      <div className={cn(!enabled && 'opacity-25 pointer-events-none')}>{children}</div>
    </div>
  )
}

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

// ── Hero Layout Presets ──
const HERO_LAYOUTS = [
  { id: 'bg-image', variant: 'overlay', label: 'Full Photo', desc: 'Full height', media: 'backgroundImage', size: 'full' },
  { id: 'bg-video', variant: 'centered', label: 'Full Video', desc: 'Full height', media: 'heroVideo', size: 'full' },
  { id: 'minimal-full', variant: 'minimal', label: 'Clean', desc: 'Full height', media: 'none', size: 'full' },
  { id: 'compact', variant: 'centered', label: 'Simple', desc: 'Fit size', media: 'none', size: 'fit' },
  { id: 'image-right', variant: 'split-right', label: 'Photo Right', desc: 'Full height', media: 'heroImage', size: 'full' },
  { id: 'image-left', variant: 'split-left', label: 'Photo Left', desc: 'Fit size', media: 'heroImage', size: 'fit' },
  { id: 'video-bottom', variant: 'centered', label: 'Video Below', desc: 'Fit size', media: 'heroVideo', size: 'fit' },
  { id: 'image-bottom', variant: 'centered', label: 'Photo Below', desc: 'Fit size', media: 'heroImage', size: 'fit' },
] as const

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&q=80'
const DEFAULT_BG_IMAGE = 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&auto=format&q=80'
const DEFAULT_VIDEO = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4'

function LayoutWireframe({ layout }: { layout: typeof HERO_LAYOUTS[number] }) {
  const m = layout.media
  const gray = 'bg-hb-text-muted/15'
  const accent = 'bg-hb-accent/60'
  const textLine = 'bg-hb-text-muted/30'

  if (m === 'backgroundImage' || (m === 'heroVideo' && layout.id === 'bg-video')) {
    return (
      <div className={cn('relative flex items-center justify-center h-full w-full', gray)}>
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
      <div className="flex items-center gap-1.5 p-2 h-full w-full">
        {imgLeft && <div className={cn('w-8 flex-shrink-0 rounded h-3/4', gray)} />}
        <div className="flex-1 space-y-0.5">
          <div className={cn('w-10 h-0.5 rounded-sm', textLine)} />
          <div className={cn('w-6 h-1.5 rounded-sm', accent)} />
        </div>
        {!imgLeft && <div className={cn('w-8 flex-shrink-0 rounded h-3/4', gray)} />}
      </div>
    )
  }
  if (m === 'heroImage' || m === 'heroVideo') {
    return (
      <div className="flex flex-col items-center justify-center gap-0.5 p-1.5 h-full w-full">
        <div className={cn('w-10 h-0.5 rounded-sm', textLine)} />
        <div className={cn('w-6 h-1.5 rounded-sm', accent)} />
        <div className={cn('w-10 h-3 rounded mt-0.5', gray)} />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center gap-1 h-full w-full">
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
          <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Banner Style</div>
          <div className="grid grid-cols-2 gap-2">
            {HERO_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                type="button"
                onClick={() => applyHeroLayout(layout)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border-2 transition-all',
                  currentLayoutId === layout.id
                    ? 'border-hb-accent bg-hb-accent/5'
                    : 'border-hb-border/30 hover:border-hb-accent/30'
                )}
              >
                <div className="w-full aspect-[4/3] rounded overflow-hidden bg-hb-bg flex items-center justify-center">
                  <LayoutWireframe layout={layout} />
                </div>
                <span className="text-xs font-medium text-hb-text-primary">{layout.label}</span>
              </button>
            ))}
          </div>
        </div>
      </RightAccordion>

      {/* ─── 2. VISUALS — single media URL + light/dark ─── */}
      <RightAccordion id="visuals" label="Visuals">
        <div className="space-y-3">
          {/* Media picker */}
          {activeMediaId && activeMediaId !== 'heroVideo' && (
            <ImagePicker
              value={activeMediaUrl}
              onChange={(url) => updateUrl(activeMediaId, url)}
              label="Choose a Photo"
            />
          )}
          {activeMediaId === 'heroVideo' && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Video Link</span>
              <input
                type="text"
                value={activeMediaUrl}
                onChange={(e) => updateUrl(activeMediaId, e.target.value)}
                placeholder="Paste video URL..."
                data-testid="hero-media-input"
                className={cn(INPUT, 'text-xs py-1')}
              />
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
          <Field label="Tag Line" enabled={getEnabled('eyebrow')} onToggle={(v) => handleToggle('eyebrow', v)}>
            <input data-testid="hero-badge-input" type="text" value={hero.badge?.text ?? ''} onChange={(e) => updateCopy('eyebrow', e.target.value)} placeholder="e.g. New Release" className={INPUT} />
          </Field>

          <Field label="Title" enabled={true}>
            <textarea data-testid="hero-headline-input" value={hero.heading?.text ?? ''} onChange={(e) => updateCopy('headline', e.target.value)} rows={2} className={cn(INPUT, 'resize-none leading-snug')} />
          </Field>

          <Field label="Description" enabled={getEnabled('subtitle')} onToggle={(v) => handleToggle('subtitle', v)}>
            <textarea data-testid="hero-subtitle-input" value={hero.subheading ?? ''} onChange={(e) => updateCopy('subtitle', e.target.value)} rows={3} className={cn(INPUT, 'resize-none leading-snug')} />
          </Field>

          <Field label="Main Button" enabled={getEnabled('primaryCta')} onToggle={(v) => handleToggle('primaryCta', v)}>
            <input data-testid="hero-primary-cta-input" type="text" value={hero.cta?.text ?? ''} onChange={(e) => updateCopy('primaryCta', e.target.value)} placeholder="e.g. Get Started" className={INPUT} />
          </Field>

          <Field label="Extra Button" enabled={getEnabled('secondaryCta')} onToggle={(v) => handleToggle('secondaryCta', v)}>
            <input data-testid="hero-secondary-cta-input" type="text" value={hero.secondaryCta?.text ?? ''} onChange={(e) => updateCopy('secondaryCta', e.target.value)} placeholder="e.g. Learn More" className={INPUT} />
          </Field>

          <Field label="Social Proof" enabled={getEnabled('trustBadges')} onToggle={(v) => handleToggle('trustBadges', v)}>
            <input data-testid="hero-trust-input" type="text" value={hero.trustBadges?.text ?? ''} onChange={(e) => updateCopy('trustBadges', e.target.value)} placeholder="e.g. Trusted by 500+ teams" className={INPUT} />
          </Field>
        </div>
      </RightAccordion>
    </div>
  )
}
