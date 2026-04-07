import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Tooltip } from '@/components/ui/Tooltip'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import {
  Sun, Moon,
  Image as ImageIcon, PlayCircle, Monitor, LayoutDashboard,
  PanelRight, PanelLeft, MonitorPlay, ImageDown,
} from 'lucide-react'
import { ImagePicker } from './ImagePicker'
import type { LucideIcon } from 'lucide-react'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

// ── Hero Layout Presets ──
const HERO_LAYOUTS: ReadonlyArray<{
  id: string; variant: string; label: string; media: string; size: string; icon: LucideIcon
}> = [
  { id: 'bg-image', variant: 'overlay', label: 'Full Photo', media: 'backgroundImage', size: 'full', icon: ImageIcon },
  { id: 'bg-video', variant: 'centered', label: 'Full Video', media: 'heroVideo', size: 'full', icon: PlayCircle },
  { id: 'minimal-full', variant: 'minimal', label: 'Clean', media: 'none', size: 'full', icon: Monitor },
  { id: 'compact', variant: 'centered', label: 'Simple', media: 'none', size: 'fit', icon: LayoutDashboard },
  { id: 'image-right', variant: 'split-right', label: 'Photo Right', media: 'heroImage', size: 'full', icon: PanelRight },
  { id: 'image-left', variant: 'split-left', label: 'Photo Left', media: 'heroImage', size: 'fit', icon: PanelLeft },
  { id: 'video-bottom', variant: 'centered', label: 'Video Below', media: 'heroVideo', size: 'fit', icon: MonitorPlay },
  { id: 'image-bottom', variant: 'centered', label: 'Photo Below', media: 'heroImage', size: 'fit', icon: ImageDown },
]

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&q=80'
const DEFAULT_BG_IMAGE = 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&auto=format&q=80'
const DEFAULT_VIDEO = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4'

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
      {/* ─── 1. DESIGN ─── */}
      <RightAccordion id="layout" label="Design">
        <div className="grid grid-cols-2 gap-2">
          {HERO_LAYOUTS.map((layout) => {
            const LayoutIcon = layout.icon
            return (
              <Tooltip key={layout.id} content="Change section layout" position="top">
                <button
                  type="button"
                  onClick={() => applyHeroLayout(layout)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1.5 h-16 rounded-lg transition-all w-full',
                    currentLayoutId === layout.id
                      ? 'border-2 border-hb-accent bg-hb-accent/5'
                      : 'border border-hb-border/40 hover:border-hb-accent/30'
                  )}
                >
                  <LayoutIcon size={20} className={cn(
                    currentLayoutId === layout.id ? 'text-hb-accent' : 'text-hb-text-muted'
                  )} />
                  <span className="text-[11px] font-medium text-hb-text-primary">{layout.label}</span>
                </button>
              </Tooltip>
            )
          })}
        </div>
      </RightAccordion>

      {/* ─── 2. SHOW / HIDE ─── */}
      <RightAccordion id="elements" label="Show / Hide">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-hb-text-primary">Tag Line</span>
            <Switch checked={getEnabled('eyebrow')} onCheckedChange={(v) => handleToggle('eyebrow', v)} className="scale-[0.7]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-hb-text-primary">Main Button</span>
            <Switch checked={getEnabled('primaryCta')} onCheckedChange={(v) => handleToggle('primaryCta', v)} className="scale-[0.7]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-hb-text-primary">Extra Button</span>
            <Switch checked={getEnabled('secondaryCta')} onCheckedChange={(v) => handleToggle('secondaryCta', v)} className="scale-[0.7]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-hb-text-primary">Social Proof</span>
            <Switch checked={getEnabled('trustBadges')} onCheckedChange={(v) => handleToggle('trustBadges', v)} className="scale-[0.7]" />
          </div>
        </div>
      </RightAccordion>

      {/* ─── 3. MEDIA ─── */}
      <RightAccordion id="media" label="Media">
        <div className="space-y-3">
          {activeMediaId && activeMediaId !== 'heroVideo' && (
            <>
              {activeMediaUrl && (
                <div className="w-full h-20 rounded-md overflow-hidden border border-hb-border/30">
                  <img src={activeMediaUrl} alt="Current media" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <ImagePicker
                value={activeMediaUrl}
                onChange={(url) => updateUrl(activeMediaId, url)}
                onEffectChange={(effect) => setSectionConfig(sectionId, { style: { imageEffect: effect } })}
                currentEffect={(section.style as Record<string, unknown>)?.imageEffect as string | undefined}
                label="Choose a Photo"
              />
            </>
          )}
          {activeMediaId === 'heroVideo' && (
            <ImagePicker
              value={activeMediaUrl}
              onChange={(url) => updateUrl(activeMediaId, url)}
              onEffectChange={(effect) => setSectionConfig(sectionId, { style: { imageEffect: effect } })}
              currentEffect={(section.style as Record<string, unknown>)?.imageEffect as string | undefined}
              label="Choose a Video"
              mode="video"
            />
          )}
          {!activeMediaId && (
            <p className="text-xs text-hb-text-muted">Select a layout with media to configure images or video.</p>
          )}
        </div>
      </RightAccordion>

      {/* ─── 4. CONTENT ─── */}
      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Title</span>
            <textarea data-testid="hero-headline-input" value={hero.heading?.text ?? ''} onChange={(e) => updateCopy('headline', e.target.value)} rows={2} className={cn(INPUT, 'resize-none leading-snug')} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Description</span>
            <textarea data-testid="hero-subtitle-input" value={hero.subheading ?? ''} onChange={(e) => updateCopy('subtitle', e.target.value)} rows={3} className={cn(INPUT, 'resize-none leading-snug')} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Tag Line</span>
            <input data-testid="hero-badge-input" type="text" value={hero.badge?.text ?? ''} onChange={(e) => updateCopy('eyebrow', e.target.value)} placeholder="e.g. New Release" className={INPUT} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Main Button</span>
            <input data-testid="hero-primary-cta-input" type="text" value={hero.cta?.text ?? ''} onChange={(e) => updateCopy('primaryCta', e.target.value)} placeholder="e.g. Get Started" className={INPUT} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Extra Button</span>
            <input data-testid="hero-secondary-cta-input" type="text" value={hero.secondaryCta?.text ?? ''} onChange={(e) => updateCopy('secondaryCta', e.target.value)} placeholder="e.g. Learn More" className={INPUT} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Social Proof</span>
            <input data-testid="hero-trust-input" type="text" value={hero.trustBadges?.text ?? ''} onChange={(e) => updateCopy('trustBadges', e.target.value)} placeholder="e.g. Trusted by 500+ teams" className={INPUT} />
          </div>
        </div>
      </RightAccordion>

      {/* ─── 5. VISUALS ─── */}
      <RightAccordion id="visuals" label="Visuals">
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
      </RightAccordion>
    </div>
  )
}
