import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps } from '@/lib/componentHelpers'
import { Maximize2, Columns2, Layers, Mountain } from 'lucide-react'
import { ImagePicker } from './ImagePicker'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const IMAGE_LAYOUTS = [
  { v: 'full-width', label: 'Full Width', Icon: Maximize2 },
  { v: 'with-text', label: 'With Text', Icon: Columns2 },
  { v: 'overlay', label: 'Overlay', Icon: Layers },
  { v: 'parallax', label: 'Parallax', Icon: Mountain },
] as const

export function ImageSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const currentVariant = section.variant || 'full-width'
  const comp = section.components.find((c) => c.id === 'image')
  const imageUrl = (comp?.props?.imageUrl as string) ?? ''
  const heading = (comp?.props?.heading as string) ?? ''
  const description = (comp?.props?.description as string) ?? ''

  const applyLayout = useCallback(
    (variant: string) => {
      setSectionConfig(sectionId, { variant })
    },
    [sectionId, setSectionConfig],
  )

  const updateProp = useCallback(
    (key: string, value: string) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, 'image', { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      <RightAccordion id={`image-layout-${sectionId}`} label="Style">
        <div className="grid grid-cols-2 gap-2">
          {IMAGE_LAYOUTS.map(({ v, label, Icon }) => (
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

      <RightAccordion id={`image-content-${sectionId}`} label="Content" defaultOpen>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Image</span>
            <ImagePicker
              value={imageUrl}
              onChange={(url) => updateProp('imageUrl', url)}
              onEffectChange={(effect) => setSectionConfig(sectionId, { style: { imageEffect: effect } })}
              currentEffect={(section.style as Record<string, unknown>)?.imageEffect as string | undefined}
              label="Choose Image"
              mode="both"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Heading</span>
            <input
              type="text"
              value={heading}
              onChange={(e) => updateProp('heading', e.target.value)}
              placeholder="e.g. Your Story"
              className={INPUT}
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Description</span>
            <textarea
              value={description}
              onChange={(e) => updateProp('description', e.target.value)}
              rows={3}
              placeholder="Optional description or caption"
              className={cn(INPUT, 'resize-none leading-snug')}
            />
          </div>
        </div>
      </RightAccordion>
    </div>
  )
}
