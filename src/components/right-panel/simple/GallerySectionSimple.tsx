import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Grid3X3, LayoutDashboard, GalleryHorizontalEnd, Maximize2, Plus, Trash2 } from 'lucide-react'
import { SectionHeadingEditor } from './SectionHeadingEditor'
import { ImagePicker } from './ImagePicker'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const GALLERY_LAYOUTS = [
  { v: 'grid', label: 'Grid', Icon: Grid3X3 },
  { v: 'masonry', label: 'Masonry', Icon: LayoutDashboard },
  { v: 'carousel', label: 'Carousel', Icon: GalleryHorizontalEnd },
  { v: 'full-width', label: 'Full Width', Icon: Maximize2 },
] as const

const MIN_IMAGES = 2
const MAX_IMAGES = 12

export function GallerySectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const currentVariant = section.variant || 'grid'

  const galleryItems = section.components
    .filter((c) => c.type === 'gallery-image' || c.type === 'gallery-item')
    .sort((a, b) => a.order - b.order)

  const applyLayout = useCallback(
    (variant: string) => {
      setSectionConfig(sectionId, { variant })
    },
    [sectionId, setSectionConfig],
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      setSectionConfig(sectionId, {
        components: setComponentEnabled(section, componentId, checked),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const updateProp = useCallback(
    (componentId: string, key: string, value: string) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const addImage = useCallback(() => {
    if (galleryItems.length >= MAX_IMAGES) return
    const existingIds = new Set(section.components.map((c) => c.id))
    let counter = galleryItems.length + 1
    let id = `img-${counter}`
    while (existingIds.has(id)) {
      counter++
      id = `img-${counter}`
    }
    const newComponent = {
      id,
      type: 'gallery-image',
      enabled: true,
      order: galleryItems.length,
      props: {
        imageUrl: '',
        caption: '',
      },
    }
    setSectionConfig(sectionId, {
      components: [...section.components, newComponent],
    })
  }, [sectionId, section, galleryItems, setSectionConfig])

  const removeImage = useCallback(
    (componentId: string) => {
      if (galleryItems.length <= MIN_IMAGES) return
      const updated = section.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => (c.type === 'gallery-image' ? { ...c, order: i } : c))
      setSectionConfig(sectionId, { components: updated })
    },
    [sectionId, section, galleryItems, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      <SectionHeadingEditor sectionId={sectionId} />
      {/* ─── LAYOUT ─── */}
      <RightAccordion id={`gallery-layout-${sectionId}`} label="Style">
        <div className="grid grid-cols-2 gap-2">
          {GALLERY_LAYOUTS.map(({ v, label, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => applyLayout(v)}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 h-16 rounded-lg transition-all',
                currentVariant === v
                  ? 'border-2 border-hb-accent bg-hb-accent/5'
                  : 'border border-hb-border/40 hover:border-hb-accent/30',
              )}
            >
              <Icon size={18} className={currentVariant === v ? 'text-hb-accent' : 'text-hb-text-muted'} />
              <span className={cn('text-xs font-medium', currentVariant === v ? 'text-hb-accent' : 'text-hb-text-primary')}>{label}</span>
            </button>
          ))}
        </div>
      </RightAccordion>

      {/* ─── IMAGES ─── */}
      <RightAccordion id={`gallery-images-${sectionId}`} label="Images">
        <div className="space-y-3">
          {galleryItems.map((item, idx) => {
            const imageUrl = (item.props?.imageUrl as string) ?? ''
            const caption = (item.props?.caption as string) ?? ''

            return (
              <div
                key={item.id}
                className="rounded-lg border border-hb-border/40 bg-hb-surface/40 p-2.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-hb-text-muted uppercase tracking-wide flex-1">
                    Image {idx + 1}
                  </span>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(v) => handleToggle(item.id, v)}
                    className="scale-[0.6] shrink-0"
                  />
                  {galleryItems.length > MIN_IMAGES && (
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      className="text-hb-text-muted hover:text-red-400 transition-colors p-0.5"
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-2')}>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Image</span>
                    <ImagePicker
                      value={imageUrl}
                      onChange={(url) => updateProp(item.id, 'imageUrl', url)}
                      onEffectChange={(effect) => setSectionConfig(sectionId, { style: { imageEffect: effect } })}
                      currentEffect={(section.style as Record<string, unknown>)?.imageEffect as string | undefined}
                      label="Choose Image"
                      mode="both"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Caption</span>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => updateProp(item.id, 'caption', e.target.value)}
                      placeholder="Optional caption"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {galleryItems.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={addImage}
              className={cn(
                'flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium',
                'border border-dashed border-hb-border text-hb-text-muted',
                'hover:border-hb-accent/50 hover:text-hb-accent transition-colors',
              )}
            >
              <Plus size={14} />
              Add Image
            </button>
          )}
        </div>
      </RightAccordion>
    </div>
  )
}
