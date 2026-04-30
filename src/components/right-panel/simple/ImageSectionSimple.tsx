import { useCallback, useState } from 'react'
import { cn } from '@/lib/cn'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { updateComponentProps } from '@/lib/componentHelpers'
import { Maximize2, Columns2, Layers, Mountain, ChevronDown, ChevronRight } from 'lucide-react'
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
  const isDraft = useUIStore((s) => s.rightPanelTab) === 'SIMPLE'
  const selectedContext = useUIStore((s) => s.selectedContext)
  const section = config.sections.find((s) => s.id === sectionId)
  // P67 / Wave 2 / A2 — collapse-by-default; auto-expand the active section.
  const isActive =
    selectedContext?.type === 'section' && selectedContext.sectionId === sectionId
  const [expanded, setExpanded] = useState<boolean>(isActive)

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
    <div data-section-id={sectionId} className="transition-all duration-200 ease-out">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`section-body-${sectionId}`}
        data-testid="section-editor-collapse-toggle"
        className={cn(
          'flex items-center justify-between w-full px-2 py-2 mb-1 rounded-md',
          'border border-hb-border/40 bg-hb-surface/40',
          'hover:bg-hb-surface-hover transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent'
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted font-medium">Section</span>
          <span className="text-xs font-semibold text-hb-text-primary capitalize">{section.type}</span>
          {isActive && (
            <span className="text-[9px] uppercase tracking-wider text-hb-accent font-medium">· active</span>
          )}
        </span>
        {expanded ? <ChevronDown size={14} className="text-hb-text-muted" /> : <ChevronRight size={14} className="text-hb-text-muted" />}
      </button>
      {expanded && (
      <div id={`section-body-${sectionId}`} className="divide-y divide-hb-border/30">
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
            {imageUrl && (
              <div className="w-full h-20 rounded-md overflow-hidden border border-hb-border/30">
                <img
                  src={imageUrl}
                  alt="Current"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            {!isDraft && (
              <ImagePicker
                value={imageUrl}
                onChange={(url) => updateProp('imageUrl', url)}
                onEffectChange={(effect) => setSectionConfig(sectionId, { style: { imageEffect: effect } })}
                currentEffect={(section.style as Record<string, unknown>)?.imageEffect as string | undefined}
                label="Choose Image"
                mode="both"
                pickerMode="full"
              />
            )}
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
      )}
    </div>
  )
}
