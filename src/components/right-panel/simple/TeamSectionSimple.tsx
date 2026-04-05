import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { Users, Grid3X3, List, Plus, Trash2 } from 'lucide-react'
import { SectionHeadingEditor } from './SectionHeadingEditor'
import { ImagePicker } from './ImagePicker'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const TEAM_LAYOUTS = [
  { v: 'cards', label: 'Cards', Icon: Users },
  { v: 'grid', label: 'Photo Grid', Icon: Grid3X3 },
  { v: 'minimal', label: 'Minimal', Icon: List },
] as const

const MIN_MEMBERS = 1
const MAX_MEMBERS = 12

export function TeamSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const currentVariant = section.variant || 'cards'

  const memberItems = section.components
    .filter((c) => c.type === 'team-member')
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

  const addMember = useCallback(() => {
    if (memberItems.length >= MAX_MEMBERS) return
    const existingIds = new Set(section.components.map((c) => c.id))
    let counter = memberItems.length + 1
    let id = `member-${counter}`
    while (existingIds.has(id)) {
      counter++
      id = `member-${counter}`
    }
    const newComponent = {
      id,
      type: 'team-member',
      enabled: true,
      order: memberItems.length,
      props: {
        name: 'New Member',
        role: 'Role',
        imageUrl: '',
        description: '',
      },
    }
    setSectionConfig(sectionId, {
      components: [...section.components, newComponent],
    })
  }, [sectionId, section, memberItems, setSectionConfig])

  const removeMember = useCallback(
    (componentId: string) => {
      if (memberItems.length <= MIN_MEMBERS) return
      const updated = section.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => (c.type === 'team-member' ? { ...c, order: i } : c))
      setSectionConfig(sectionId, { components: updated })
    },
    [sectionId, section, memberItems, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      <SectionHeadingEditor sectionId={sectionId} />
      {/* LAYOUT */}
      <RightAccordion id={`team-layout-${sectionId}`} label="Style">
        <div className="grid grid-cols-3 gap-2">
          {TEAM_LAYOUTS.map(({ v, label, Icon }) => (
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

      {/* MEMBERS */}
      <RightAccordion id={`team-members-${sectionId}`} label="Team Members">
        <div className="space-y-3">
          {memberItems.map((item, idx) => {
            const name = (item.props?.name as string) ?? ''
            const role = (item.props?.role as string) ?? ''
            const imageUrl = (item.props?.imageUrl as string) ?? ''
            const description = (item.props?.description as string) ?? ''

            return (
              <div
                key={item.id}
                className="rounded-lg border border-hb-border/40 bg-hb-surface/40 p-2.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-hb-text-muted uppercase tracking-wide flex-1">
                    Member {idx + 1}
                  </span>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(v) => handleToggle(item.id, v)}
                    className="scale-[0.6] shrink-0"
                  />
                  {memberItems.length > MIN_MEMBERS && (
                    <button
                      type="button"
                      onClick={() => removeMember(item.id)}
                      className="text-hb-text-muted hover:text-red-400 transition-colors p-0.5"
                      title="Remove member"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-2')}>
                  {imageUrl && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-hb-border/30 mx-auto">
                      <img src={imageUrl} alt={name || 'Photo'} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateProp(item.id, 'name', e.target.value)}
                      placeholder="Full name"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Role</span>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => updateProp(item.id, 'role', e.target.value)}
                      placeholder="Job title"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Photo</span>
                    <ImagePicker
                      value={imageUrl}
                      onChange={(url) => updateProp(item.id, 'imageUrl', url)}
                      onEffectChange={(effect) => setSectionConfig(sectionId, { style: { imageEffect: effect } })}
                      currentEffect={(section.style as Record<string, unknown>)?.imageEffect as string | undefined}
                      label="Choose Photo"
                      mode="image"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Description</span>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => updateProp(item.id, 'description', e.target.value)}
                      placeholder="Short bio (optional)"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {memberItems.length < MAX_MEMBERS && (
            <button
              type="button"
              onClick={addMember}
              className={cn(
                'flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium',
                'border border-dashed border-hb-border text-hb-text-muted',
                'hover:border-hb-accent/50 hover:text-hb-accent transition-colors',
              )}
            >
              <Plus size={14} />
              Add Member
            </button>
          )}
        </div>
      </RightAccordion>
    </div>
  )
}
