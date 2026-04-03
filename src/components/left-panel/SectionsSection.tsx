import { useState } from 'react'
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
  ChevronRight,
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
  navbar: 'Top Menu',
  hero: 'Main Banner',
  features: 'Features',
  cta: 'Action Block',
  pricing: 'Pricing',
  footer: 'Footer',
  testimonials: 'Reviews',
  faq: 'FAQ',
  value_props: 'Highlights',
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
  const [showHidden, setShowHidden] = useState(false)

  const orderedSections = localOrder
    ? localOrder
        .map((id) => sections.find((s) => s.id === id))
        .filter(Boolean)
    : sections

  const enabledSections = orderedSections.filter((s): s is NonNullable<typeof s> => !!s?.enabled)
  const hiddenSections = orderedSections.filter((s): s is NonNullable<typeof s> => !!s && !s.enabled)

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
      setLocalOrder(null)
    } else {
      setConfirmDeleteId(sectionId)
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  const handleDuplicate = (sectionId: string) => {
    duplicateSection(sectionId)
    setLocalOrder(null)
  }

  const renderSectionRow = (section: typeof sections[0], index: number) => {
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
          'flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors group border border-transparent',
          isSelected
            ? 'bg-hb-accent text-white border-hb-accent'
            : 'bg-hb-surface hover:bg-hb-surface-hover border-hb-accent/25',
          isDisabled && 'opacity-40'
        )}
      >
        <Icon size={14} className={cn('shrink-0', isSelected ? 'text-white/70' : 'text-hb-text-muted')} />
        <span className={cn('text-sm flex-1 min-w-0 truncate', isSelected ? 'text-white font-medium' : 'text-hb-text-primary')}>
          {sectionNameMap[section.type] ?? section.type}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            title={section.enabled ? 'Hide section' : 'Show section'}
            onClick={(e) => {
              e.stopPropagation()
              toggleSectionEnabled(section.id)
            }}
            className={cn('p-0.5 transition-colors', isSelected ? 'text-white/70 hover:text-white' : 'text-hb-text-muted hover:text-hb-text-secondary')}
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
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Enabled sections */}
      {enabledSections.map((section, index) => renderSectionRow(section, index))}

      {/* Hidden sections — collapsible */}
      {hiddenSections.length > 0 && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-hb-text-muted hover:text-hb-text-secondary transition-colors"
          >
            <ChevronRight size={12} className={cn('transition-transform', showHidden && 'rotate-90')} />
            {hiddenSections.length} hidden section{hiddenSections.length > 1 ? 's' : ''}
          </button>
          {showHidden && (
            <div className="flex flex-col gap-1 mt-1">
              {hiddenSections.map((section, index) =>
                renderSectionRow(section, enabledSections.length + index)
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Section button + inline accordion */}
      <div>
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center justify-center gap-1.5 w-full mt-1 px-3 py-2 rounded-md border border-dashed border-hb-border text-hb-accent hover:bg-hb-accent/10 hover:border-hb-accent/50 transition-colors text-sm font-medium"
        >
          <Plus size={14} />
          Add Section
        </button>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: showAddMenu ? '400px' : '0' }}
        >
          <div className="mt-1 rounded-lg border border-hb-border bg-hb-surface overflow-y-auto max-h-[320px]">
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
        </div>
      </div>
    </div>
  )
}
