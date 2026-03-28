import { useState } from 'react'
import { Star, Grid3X3, ArrowRight, Eye, EyeOff, ChevronUp, ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'

const sectionIconMap: Record<string, LucideIcon> = {
  hero: Star,
  features: Grid3X3,
  cta: ArrowRight,
}

const sectionNameMap: Record<string, string> = {
  hero: 'Hero',
  features: 'Features',
  cta: 'Call to Action',
  pricing: 'Pricing',
  footer: 'Footer',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  value_props: 'Value Props',
}

export function SectionsSection() {
  const sections = useConfigStore((s) => s.config.sections)
  const toggleSectionEnabled = useConfigStore((s) => s.toggleSectionEnabled)
  const [localOrder, setLocalOrder] = useState<string[] | null>(null)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)

  // Use localOrder for reordering if set, otherwise use configStore order
  const orderedSections = localOrder
    ? localOrder
        .map((id) => sections.find((s) => s.id === id))
        .filter(Boolean)
    : sections

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= orderedSections.length) return
    const currentIds = orderedSections.map((s) => s!.id)
    const next = [...currentIds]
    ;[next[index], next[target]] = [next[target], next[index]]
    setLocalOrder(next)
  }

  return (
    <div className="flex flex-col gap-1">
      {orderedSections.map((section, index) => {
        if (!section) return null
        const Icon = sectionIconMap[section.type] ?? Star
        const isSelected =
          selectedContext?.type === 'section' &&
          selectedContext.sectionId === section.id

        return (
          <div
            key={section.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              setSelectedContext({ type: 'section', sectionId: section.id })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedContext({ type: 'section', sectionId: section.id })
              }
            }}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors group',
              isSelected
                ? 'border-l-[3px] border-hb-accent bg-hb-accent-light'
                : 'hover:bg-hb-surface-hover'
            )}
          >
            <Icon size={14} className="text-hb-text-muted" />
            <span className="text-sm text-hb-text-primary flex-1">
              {sectionNameMap[section.type] ?? section.type}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleSectionEnabled(section.id)
              }}
              className="text-hb-text-muted hover:text-hb-text-secondary transition-colors"
            >
              {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                moveSection(index, 'up')
              }}
              className="text-hb-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronUp size={12} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                moveSection(index, 'down')
              }}
              className="text-hb-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronDown size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
