import { useState } from 'react'
import { Star, Grid3X3, ArrowRight, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'

const initialSections = [
  { id: 'hero-01', name: 'Hero', icon: Star, visible: true },
  { id: 'features-01', name: 'Features', icon: Grid3X3, visible: true },
  { id: 'cta-01', name: 'Call to Action', icon: ArrowRight, visible: true },
]

export function SectionsSection() {
  const [sections, setSections] = useState(initialSections)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)

  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    )
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= sections.length) return
    setSections((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return (
    <div className="flex flex-col gap-1">
      {sections.map((section, index) => {
        const Icon = section.icon
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
              {section.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleVisibility(section.id)
              }}
              className="text-hb-text-muted hover:text-hb-text-secondary transition-colors"
            >
              {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
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
