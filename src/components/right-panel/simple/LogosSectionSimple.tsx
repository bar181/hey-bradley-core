import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { LayoutList, Rows3, Grid3X3, Plus, Trash2 } from 'lucide-react'
import { SectionHeadingEditor } from './SectionHeadingEditor'
import { ImagePicker } from './ImagePicker'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const LOGOS_LAYOUTS = [
  { v: 'simple', label: 'Row', Icon: LayoutList },
  { v: 'marquee', label: 'Marquee', Icon: Rows3 },
  { v: 'grid', label: 'Grid', Icon: Grid3X3 },
] as const

const MIN_LOGOS = 2
const MAX_LOGOS = 12

export function LogosSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const currentVariant = section.variant || 'simple'

  const logoItems = section.components
    .filter((c) => c.type === 'logo')
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

  const addLogo = useCallback(() => {
    if (logoItems.length >= MAX_LOGOS) return
    const existingIds = new Set(section.components.map((c) => c.id))
    let counter = logoItems.length + 1
    let id = `logo-${counter}`
    while (existingIds.has(id)) {
      counter++
      id = `logo-${counter}`
    }
    const newComponent = {
      id,
      type: 'logo',
      enabled: true,
      order: logoItems.length,
      props: {
        name: `Company ${counter}`,
        imageUrl: '',
      },
    }
    setSectionConfig(sectionId, {
      components: [...section.components, newComponent],
    })
  }, [sectionId, section, logoItems, setSectionConfig])

  const removeLogo = useCallback(
    (componentId: string) => {
      if (logoItems.length <= MIN_LOGOS) return
      const updated = section.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => (c.type === 'logo' ? { ...c, order: i } : c))
      setSectionConfig(sectionId, { components: updated })
    },
    [sectionId, section, logoItems, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      <SectionHeadingEditor sectionId={sectionId} />
      {/* LAYOUT */}
      <RightAccordion id={`logos-layout-${sectionId}`} label="Style">
        <div className="grid grid-cols-3 gap-2">
          {LOGOS_LAYOUTS.map(({ v, label, Icon }) => (
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

      {/* LOGOS */}
      <RightAccordion id={`logos-items-${sectionId}`} label="Logos">
        <div className="space-y-3">
          {logoItems.map((item, idx) => {
            const imageUrl = (item.props?.imageUrl as string) ?? ''
            const name = (item.props?.name as string) ?? ''

            return (
              <div
                key={item.id}
                className="rounded-lg border border-hb-border/40 bg-hb-surface/40 p-2.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-hb-text-muted uppercase tracking-wide flex-1">
                    Logo {idx + 1}
                  </span>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(v) => handleToggle(item.id, v)}
                    className="scale-[0.6] shrink-0"
                  />
                  {logoItems.length > MIN_LOGOS && (
                    <button
                      type="button"
                      onClick={() => removeLogo(item.id)}
                      className="text-hb-text-muted hover:text-red-400 transition-colors p-0.5"
                      title="Remove logo"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-2')}>
                  {imageUrl && (
                    <div className="w-full h-12 rounded-md overflow-hidden border border-hb-border/30 flex items-center justify-center bg-white/5">
                      <img src={imageUrl} alt={name || 'Logo'} className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Company Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateProp(item.id, 'name', e.target.value)}
                      placeholder="Company name"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Logo</span>
                    <ImagePicker
                      value={imageUrl}
                      onChange={(url) => updateProp(item.id, 'imageUrl', url)}
                      onEffectChange={(effect) => setSectionConfig(sectionId, { style: { imageEffect: effect } })}
                      currentEffect={(section.style as Record<string, unknown>)?.imageEffect as string | undefined}
                      label="Choose Logo"
                      mode="image"
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {logoItems.length < MAX_LOGOS && (
            <button
              type="button"
              onClick={addLogo}
              className={cn(
                'flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium',
                'border border-dashed border-hb-border text-hb-text-muted',
                'hover:border-hb-accent/50 hover:text-hb-accent transition-colors',
              )}
            >
              <Plus size={14} />
              Add Logo
            </button>
          )}
        </div>
      </RightAccordion>
    </div>
  )
}
