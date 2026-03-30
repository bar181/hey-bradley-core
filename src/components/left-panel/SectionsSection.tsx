import { useState, useRef, useEffect } from 'react'
import {
  Star,
  Grid3X3,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  DollarSign,
  MessageSquare,
  HelpCircle,
  Zap,
  Layout,
  Navigation,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'
import type { SectionType } from '@/lib/schemas/section'

const sectionIconMap: Record<string, LucideIcon> = {
  navbar: Navigation,
  hero: Star,
  features: Grid3X3,
  cta: ArrowRight,
  pricing: DollarSign,
  footer: Layout,
  testimonials: MessageSquare,
  faq: HelpCircle,
  value_props: Zap,
}

const sectionNameMap: Record<string, string> = {
  navbar: 'Navbar',
  hero: 'Hero',
  features: 'Features',
  cta: 'Call to Action',
  pricing: 'Pricing',
  footer: 'Footer',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  value_props: 'Value Props',
}

const sectionDescriptionMap: Record<string, string> = {
  navbar: 'Navigation bar with logo and links',
  hero: 'Main banner with headline and CTA',
  features: 'Showcase product features',
  pricing: 'Pricing plans and tiers',
  cta: 'Call-to-action block',
  footer: 'Page footer with links',
  testimonials: 'Customer testimonials',
  faq: 'Frequently asked questions',
  value_props: 'Key value propositions',
}

const SECTION_TYPES: SectionType[] = [
  'navbar',
  'hero',
  'features',
  'pricing',
  'cta',
  'footer',
  'testimonials',
  'faq',
  'value_props',
]

export function SectionsSection() {
  const sections = useConfigStore((s) => s.config.sections)
  const toggleSectionEnabled = useConfigStore((s) => s.toggleSectionEnabled)
  const addSection = useConfigStore((s) => s.addSection)
  const removeSection = useConfigStore((s) => s.removeSection)
  const duplicateSection = useConfigStore((s) => s.duplicateSection)
  const reorderSections = useConfigStore((s) => s.reorderSections)
  const [localOrder, setLocalOrder] = useState<string[] | null>(null)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const addMenuRef = useRef<HTMLDivElement>(null)

  // Close add menu on outside click
  useEffect(() => {
    if (!showAddMenu) return
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showAddMenu])

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
    reorderSections(next)
  }

  const handleAddSection = (type: SectionType) => {
    addSection(type)
    setShowAddMenu(false)
  }

  const handleDelete = (sectionId: string) => {
    if (confirmDeleteId === sectionId) {
      removeSection(sectionId)
      setConfirmDeleteId(null)
      // Clear local order so it re-syncs
      setLocalOrder(null)
    } else {
      setConfirmDeleteId(sectionId)
      // Auto-clear confirmation after 3 seconds
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  const handleDuplicate = (sectionId: string) => {
    duplicateSection(sectionId)
    setLocalOrder(null)
  }

  return (
    <div className="flex flex-col gap-1">
      {orderedSections.map((section, index) => {
        if (!section) return null
        const Icon = sectionIconMap[section.type] ?? Star
        const isSelected =
          selectedContext?.type === 'section' &&
          selectedContext.sectionId === section.id
        const isDisabled = !section.enabled

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
                : 'hover:bg-hb-surface-hover',
              isDisabled && 'opacity-40'
            )}
          >
            <Icon size={14} className="text-hb-text-muted shrink-0" />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm text-hb-text-primary truncate">
                {sectionNameMap[section.type] ?? section.type}
              </span>
              <span className="text-xs text-hb-text-muted truncate">
                {section.id}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                title={section.enabled ? 'Disable section' : 'Enable section'}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSectionEnabled(section.id)
                }}
                className="p-0.5 text-hb-text-muted hover:text-hb-text-secondary transition-colors"
              >
                {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button
                type="button"
                title="Move up"
                onClick={(e) => {
                  e.stopPropagation()
                  moveSection(index, 'up')
                }}
                disabled={index === 0}
                className={cn(
                  'p-0.5 text-hb-text-muted opacity-0 group-hover:opacity-100 transition-opacity',
                  index === 0 && 'cursor-not-allowed group-hover:opacity-30'
                )}
              >
                <ChevronUp size={12} />
              </button>
              <button
                type="button"
                title="Move down"
                onClick={(e) => {
                  e.stopPropagation()
                  moveSection(index, 'down')
                }}
                disabled={index === orderedSections.length - 1}
                className={cn(
                  'p-0.5 text-hb-text-muted opacity-0 group-hover:opacity-100 transition-opacity',
                  index === orderedSections.length - 1 &&
                    'cursor-not-allowed group-hover:opacity-30'
                )}
              >
                <ChevronDown size={12} />
              </button>
              <button
                type="button"
                title="Duplicate section"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDuplicate(section.id)
                }}
                className="p-0.5 text-hb-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-hb-text-secondary focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
              >
                <Copy size={12} />
              </button>
              <button
                type="button"
                aria-label={
                  confirmDeleteId === section.id
                    ? 'Click again to confirm delete'
                    : 'Delete section'
                }
                title={
                  confirmDeleteId === section.id
                    ? 'Click again to confirm delete'
                    : 'Delete section'
                }
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(section.id)
                }}
                className={cn(
                  'p-0.5 opacity-0 group-hover:opacity-100 transition-all focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-hb-accent rounded',
                  confirmDeleteId === section.id
                    ? 'text-red-400 opacity-100 animate-pulse'
                    : 'text-hb-text-muted hover:text-red-400'
                )}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        )
      })}

      {/* Add Section button */}
      <div className="relative" ref={addMenuRef}>
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center justify-center gap-1.5 w-full mt-1 px-3 py-2 rounded-md border border-dashed border-hb-text-muted/30 text-hb-text-muted hover:text-hb-accent hover:border-hb-accent/50 transition-colors text-sm"
        >
          <Plus size={14} />
          Add Section
        </button>

        {showAddMenu && (
          <div className="absolute left-0 right-0 bottom-full mb-1 z-50 bg-hb-surface border border-hb-border rounded-lg shadow-xl overflow-hidden max-h-[320px] overflow-y-auto">
            {SECTION_TYPES.map((type) => {
              const Icon = sectionIconMap[type] ?? Star
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAddSection(type)}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-left hover:bg-hb-surface-hover transition-colors"
                >
                  <Icon
                    size={14}
                    className="text-hb-text-muted shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-hb-text-primary">
                      {sectionNameMap[type]}
                    </span>
                    <span className="text-xs text-hb-text-muted">
                      {sectionDescriptionMap[type]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
