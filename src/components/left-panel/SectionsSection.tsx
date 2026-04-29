import { useEffect, useRef, useState } from 'react'
import {
  Star, Grid3X3, ArrowRight, Eye, EyeOff, ChevronUp, ChevronDown, Copy, Trash2,
  DollarSign, MessageSquare, HelpCircle, Zap, Layout, Navigation, ChevronRight,
  GripVertical, ImageIcon, Minus, FileText, Award, Users, Plus, X, Files,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Tooltip } from '@/components/ui/Tooltip'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { applyDraftLabel } from '@/lib/draftRename'
import type { SectionType } from '@/lib/schemas/section'

// DRAFT-mode narrowed surface: hero + blog (article-as-blog-minimal) + footer.
// See plans/implementation/mvp-plan/01-phase-15-polish-kitchen-sink.md §1.1.
const DRAFT_ALLOWED_SECTION_TYPES: ReadonlySet<SectionType> = new Set<SectionType>(['hero', 'blog', 'footer'])

const sectionIconMap: Record<string, LucideIcon> = {
  menu: Navigation, hero: Star, columns: Grid3X3, action: ArrowRight, pricing: DollarSign,
  footer: Layout, quotes: MessageSquare, questions: HelpCircle, numbers: Zap, gallery: Grid3X3,
  image: ImageIcon, divider: Minus, text: FileText, logos: Award, team: Users, blog: FileText,
}

const sectionNameMap: Record<string, string> = {
  menu: 'Navigation Bar', hero: 'Hero', columns: 'Content Cards', action: 'Action Block',
  pricing: 'Pricing', footer: 'Footer', quotes: 'Quotes', questions: 'Questions',
  numbers: 'Numbers', gallery: 'Gallery', image: 'Image', divider: 'Spacer',
  text: 'Text', logos: 'Logo Cloud', team: 'Team', blog: 'Blog',
}

const sectionDescriptionMap: Record<string, string> = {
  menu: 'Navigation bar with logo and links',
  hero: 'Main banner with headline and button',
  columns: 'Cards with images, icons, and text',
  pricing: 'Pricing plans and tiers',
  action: 'Section with button and message',
  footer: 'Page footer with links',
  quotes: 'Customer testimonials and quotes',
  questions: 'Frequently asked questions',
  numbers: 'Key value propositions and stats',
  gallery: 'Image gallery',
  image: 'A big photo with optional text on top',
  divider: 'A line or space between sections',
  text: 'A block of text for articles or stories',
  logos: 'Show partner or sponsor logos in a row',
  team: 'Team member cards with photos and roles',
  blog: 'Blog articles with cards, lists, or featured layout',
}

const SECTION_TYPES: SectionType[] = [
  'menu', 'hero', 'columns', 'pricing', 'action', 'footer', 'quotes', 'questions',
  'numbers', 'gallery', 'image', 'divider', 'text', 'logos', 'team', 'blog',
]

// Add-section category buckets (P47 Sprint I A1). Only existing SectionTypes.
type AddCategory = 'All' | 'Hero & CTA' | 'Content' | 'Social Proof + Media'
const ADD_CATEGORY_MAP: Record<Exclude<AddCategory, 'All'>, SectionType[]> = {
  'Hero & CTA': ['hero', 'action'],
  'Content': ['text', 'blog', 'pricing'],
  'Social Proof + Media': [
    'quotes', 'logos', 'gallery', 'image', 'team',
    'numbers', 'columns', 'questions', 'divider', 'footer', 'menu',
  ],
}
const ADD_CATEGORIES: AddCategory[] = ['All', 'Hero & CTA', 'Content', 'Social Proof + Media']

export function SectionsSection() {
  const sections = useConfigStore((s) => {
    const activePage = s.activePage
    if (activePage && s.config.pages && s.config.pages.length > 0) {
      const page = s.config.pages.find((p) => p.id === activePage)
      if (page) return page.sections
    }
    return s.config.sections
  })
  const toggleSectionEnabled = useConfigStore((s) => s.toggleSectionEnabled)
  const addSection = useConfigStore((s) => s.addSection)
  const removeSection = useConfigStore((s) => s.removeSection)
  const duplicateSection = useConfigStore((s) => s.duplicateSection)
  const reorderSections = useConfigStore((s) => s.reorderSections)
  const pages = useConfigStore((s) => s.config.pages)
  const activePage = useConfigStore((s) => s.activePage)
  const setActivePage = useConfigStore((s) => s.setActivePage)
  const addPage = useConfigStore((s) => s.addPage)
  const removePage = useConfigStore((s) => s.removePage)
  const isMultiPage = useConfigStore((s) => s.isMultiPage())
  const [localOrder, setLocalOrder] = useState<string[] | null>(null)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)
  const rightPanelTab = useUIStore((s) => s.rightPanelTab)
  const isDraft = rightPanelTab === 'SIMPLE'
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [showHidden, setShowHidden] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const [showAddPage, setShowAddPage] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [confirmDeletePageId, setConfirmDeletePageId] = useState<string | null>(null)
  // Per-row collapse state (P47 A1). KISS — local Set, NOT persisted.
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set())
  const collapseInitRef = useRef(false)
  const [focusedRowIdx, setFocusedRowIdx] = useState<number>(0)
  const rowRefs = useRef<Array<HTMLDivElement | null>>([])
  const [addCategory, setAddCategory] = useState<AddCategory>('All')

  // Initialize collapsed state once: first section expanded, rest collapsed.
  useEffect(() => {
    if (collapseInitRef.current) return
    if (sections.length === 0) return
    collapseInitRef.current = true
    setCollapsedIds(new Set(sections.slice(1).map((s) => s.id)))
  }, [sections])

  const toggleCollapsed = (sectionId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  const orderedSectionsRaw = localOrder
    ? localOrder
        .map((id) => sections.find((s) => s.id === id))
        .filter(Boolean)
    : sections

  // In DRAFT mode, hide section types outside the narrowed surface (hero/blog/footer).
  // Underlying config is untouched — these are simply not rendered in the DRAFT panel.
  const orderedSections = isDraft
    ? orderedSectionsRaw.filter((s) => !!s && DRAFT_ALLOWED_SECTION_TYPES.has(s.type as SectionType))
    : orderedSectionsRaw

  const enabledSections = orderedSections.filter((s): s is NonNullable<typeof s> => !!s?.enabled)
  const hiddenSections = orderedSections.filter((s): s is NonNullable<typeof s> => !!s && !s.enabled)

  const visibleAddSectionTypes = isDraft
    ? SECTION_TYPES.filter((t) => DRAFT_ALLOWED_SECTION_TYPES.has(t))
    : SECTION_TYPES

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

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('sectionId')
    if (!sourceId) return
    const currentIds = orderedSections.map((s) => s!.id)
    const sourceIndex = currentIds.indexOf(sourceId)
    if (sourceIndex === -1 || sourceIndex === targetIndex) {
      setDropTarget(null)
      return
    }
    const next = [...currentIds]
    const [removed] = next.splice(sourceIndex, 1)
    next.splice(targetIndex, 0, removed)
    setLocalOrder(next)
    reorderSections(next)
    setDropTarget(null)
    setDragId(null)
  }

  const renderSectionRow = (section: typeof sections[0], index: number) => {
    if (!section) return null
    const Icon = sectionIconMap[section.type] ?? Star
    const rawName = sectionNameMap[section.type] ?? section.type
    const name = isDraft ? applyDraftLabel(rawName) : rawName
    const isSelected =
      selectedContext?.type === 'section' &&
      selectedContext.sectionId === section.id
    const isDisabled = !section.enabled
    const isCollapsed = collapsedIds.has(section.id)

    return (
      <div key={section.id}>
        {/* Drop indicator line */}
        {dropTarget === index && dragId !== section.id && (
          <div className="h-0.5 bg-hb-accent rounded-full mx-2" />
        )}

        {/* Section row */}
        <div
          ref={(el) => { rowRefs.current[index] = el }}
          role="option"
          aria-selected={isSelected}
          tabIndex={focusedRowIdx === index ? 0 : -1}
          onClick={() =>
            setSelectedContext({ type: 'section', sectionId: section.id })
          }
          onFocus={() => setFocusedRowIdx(index)}
          onDragOver={(e) => {
            e.preventDefault()
            setDropTarget(index)
          }}
          onDrop={(e) => handleDrop(e, index)}
          className={cn(
            'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-all',
            isSelected
              ? 'bg-hb-accent/10 border-2 border-hb-accent'
              : 'border border-transparent hover:bg-hb-surface-hover',
            isDisabled && 'opacity-40'
          )}
          title="Click to edit this section."
        >
          {/* Collapse/expand chevron */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleCollapsed(section.id)
            }}
            className="p-0.5 text-hb-text-muted/60 hover:text-hb-text-secondary shrink-0"
            title={isCollapsed ? 'Expand this section row.' : 'Collapse this section row.'}
          >
            <ChevronRight size={12} className={cn('transition-transform', !isCollapsed && 'rotate-90')} />
          </button>

          {/* Drag handle (hidden when collapsed) */}
          {!isCollapsed && (
            <Tooltip content="Drag to reorder" position="right">
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('sectionId', section.id)
                  setDragId(section.id)
                }}
                onDragEnd={() => {
                  setDragId(null)
                  setDropTarget(null)
                }}
                className="cursor-grab active:cursor-grabbing p-0.5 text-hb-text-muted/40 hover:text-hb-text-muted"
                title="Drag to move this section up or down."
              >
                <GripVertical size={14} />
              </div>
            </Tooltip>
          )}

          <Icon size={14} className="text-hb-text-muted shrink-0" />
          <span className="text-sm flex-1 truncate text-hb-text-primary">
            {name}
          </span>

          {/* Eye toggle (hidden when collapsed) */}
          {!isCollapsed && (
            <Tooltip content="Toggle section visibility" position="left">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSectionEnabled(section.id)
                }}
                className="p-0.5 text-hb-text-muted hover:text-hb-text-secondary"
                title="Show or hide this section on your page."
              >
                {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            </Tooltip>
          )}
        </div>

        {/* Action bar — only for selected & expanded section */}
        {isSelected && !isCollapsed && (
          <div className="flex items-center justify-center gap-1 py-1 px-2 ml-6">
            <button
              type="button"
              title="Move this section up one spot."
              onClick={() => moveSection(index, 'up')}
              disabled={index === 0}
              className="p-1 rounded text-hb-text-muted hover:bg-hb-surface-hover disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              title="Move this section down one spot."
              onClick={() => moveSection(index, 'down')}
              disabled={index === orderedSections.length - 1}
              className="p-1 rounded text-hb-text-muted hover:bg-hb-surface-hover disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              title="Make a copy of this section."
              onClick={() => handleDuplicate(section.id)}
              className="p-1 rounded text-hb-text-muted hover:bg-hb-surface-hover"
            >
              <Copy size={14} />
            </button>
            <button
              type="button"
              title="Delete this section. Click twice to confirm."
              aria-label={
                confirmDeleteId === section.id
                  ? 'Click again to confirm delete'
                  : 'Delete section'
              }
              onClick={() => handleDelete(section.id)}
              className={cn(
                'p-1 rounded hover:bg-hb-surface-hover',
                confirmDeleteId === section.id
                  ? 'text-red-400 animate-pulse'
                  : 'text-hb-text-muted hover:text-red-400'
              )}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    )
  }

  const handleAddPage = () => {
    if (!newPageTitle.trim()) return
    addPage(newPageTitle.trim())
    setNewPageTitle('')
    setShowAddPage(false)
    setLocalOrder(null)
  }

  const handleDeletePage = (pageId: string) => {
    if (confirmDeletePageId === pageId) {
      removePage(pageId)
      setConfirmDeletePageId(null)
    } else {
      setConfirmDeletePageId(pageId)
      setTimeout(() => setConfirmDeletePageId(null), 3000)
    }
  }

  // Total focusable rows = enabled + (hidden when shown). Used by keyboard nav.
  const focusableRowCount =
    enabledSections.length + (showHidden ? hiddenSections.length : 0)

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (focusableRowCount === 0) return
    const orderedIds = [
      ...enabledSections.map((s) => s.id),
      ...(showHidden ? hiddenSections.map((s) => s.id) : []),
    ]
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(focusedRowIdx + 1, focusableRowCount - 1)
      setFocusedRowIdx(next)
      rowRefs.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.max(focusedRowIdx - 1, 0)
      setFocusedRowIdx(next)
      rowRefs.current[next]?.focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      const sectionId = orderedIds[focusedRowIdx]
      if (sectionId) {
        e.preventDefault()
        toggleCollapsed(sectionId)
      }
    }
  }

  // Filter add-section types by selected category (P47 A1).
  const categoryFilteredAddTypes =
    addCategory === 'All'
      ? visibleAddSectionTypes
      : visibleAddSectionTypes.filter((t) =>
          ADD_CATEGORY_MAP[addCategory].includes(t)
        )

  return (
    <div className="flex flex-col gap-1">
      {/* Page selector (multi-page mode) */}
      {isMultiPage && pages && (
        <div className="mb-2 rounded-lg border border-hb-border bg-hb-surface/50 p-1.5">
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <Files size={12} className="text-hb-text-muted" />
            <span className="text-xs text-hb-text-muted font-medium uppercase tracking-wider flex-1">Pages</span>
            <button
              type="button"
              onClick={() => setShowAddPage(!showAddPage)}
              className="p-0.5 rounded text-hb-text-muted hover:text-hb-accent hover:bg-hb-surface-hover"
              title="Add a new page to your site."
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => { setActivePage(page.id); setLocalOrder(null) }}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md transition-all',
                    activePage === page.id
                      ? 'bg-hb-accent text-white font-medium'
                      : 'text-hb-text-secondary hover:bg-hb-surface-hover'
                  )}
                  title={`Switch to the ${page.title} page.`}
                >
                  {page.title}
                </button>
                {!page.isHome && activePage === page.id && (
                  <button
                    type="button"
                    onClick={() => handleDeletePage(page.id)}
                    className={cn(
                      'p-0.5 rounded ml-0.5',
                      confirmDeletePageId === page.id
                        ? 'text-red-400 animate-pulse'
                        : 'text-hb-text-muted/40 hover:text-red-400'
                    )}
                    title={confirmDeletePageId === page.id ? 'Click again to confirm deleting this page.' : 'Delete this page.'}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {showAddPage && (
            <div className="flex items-center gap-1 mt-1.5">
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddPage(); if (e.key === 'Escape') setShowAddPage(false) }}
                placeholder="Page name..."
                className="flex-1 px-2 py-1 text-xs rounded bg-hb-surface border border-hb-border text-hb-text-primary placeholder:text-hb-text-muted/50 focus:outline-none focus:border-hb-accent"
                autoFocus
              />
              <button type="button" onClick={handleAddPage} className="px-2 py-1 text-xs rounded bg-hb-accent text-white hover:bg-hb-accent/80" title="Save the new page.">
                Add
              </button>
            </div>
          )}
        </div>
      )}

      {/* Enable multi-page button (single-page mode) */}
      {!isMultiPage && !isDraft && (
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 w-full px-3 py-1.5 mb-1 text-xs text-hb-text-muted opacity-50 cursor-not-allowed rounded-md"
          title="Multiple pages will be available in a future update."
        >
          <Files size={12} />
          Multi-Page (Coming Soon)
        </button>
      )}

      {/* Enabled sections */}
      {enabledSections.length === 0 && (
        <div className="rounded-lg border border-hb-border bg-hb-surface/50 p-4 text-center">
          <p className="text-sm text-hb-text-muted font-medium">No sections yet</p>
          <p className="text-xs text-hb-text-muted/60 mt-1.5 leading-relaxed">
            Click &quot;More Sections&quot; below to add your first section.
            <br />
            Or try loading an example from the Examples tab.
          </p>
        </div>
      )}
      <div
        role="listbox"
        tabIndex={0}
        onKeyDown={handleListKeyDown}
        aria-orientation="vertical"
        className="flex flex-col gap-1 outline-none"
      >
        {enabledSections.map((section, index) => renderSectionRow(section, index))}
      </div>

      {/* More Sections — hidden sections + add new */}
      <div
        className="mt-1"
        role="listbox"
        aria-orientation="vertical"
        onKeyDown={handleListKeyDown}
      >
        <Tooltip content="Add a new section" position="right">
          <button
            type="button"
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-hb-text-muted hover:text-hb-text-secondary transition-colors"
            title="Show more section types you can add to your page."
          >
            <ChevronRight size={12} className={cn('transition-transform', showHidden && 'rotate-90')} />
            More Sections
          </button>
        </Tooltip>
        {showHidden && (
          <div className="flex flex-col gap-1 mt-1">
            {hiddenSections.map((section, index) =>
              renderSectionRow(section, enabledSections.length + index)
            )}

            {/* Add section types list */}
            <div className="mt-1 rounded-lg border border-hb-border bg-hb-surface">
              <div className="px-3 py-1.5 text-xs text-hb-text-muted font-medium uppercase tracking-wider border-b border-hb-border">
                Add New Section
              </div>
              {/* Category filter pills (P47 A1). Pure visual filter. */}
              <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-hb-border">
                {ADD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAddCategory(cat)}
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full transition-colors',
                      addCategory === cat
                        ? 'bg-hb-accent text-white'
                        : 'bg-hb-surface-hover text-hb-text-muted hover:text-hb-text-secondary'
                    )}
                    title={`Show only ${cat} section types.`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {categoryFilteredAddTypes.map((type) => {
                const Icon = sectionIconMap[type] ?? Star
                const rawAddName = sectionNameMap[type] ?? type
                const addName = isDraft ? applyDraftLabel(rawAddName) : rawAddName
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAddSection(type)}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-left hover:bg-hb-surface-hover transition-colors"
                    title={`Add a new ${(sectionNameMap[type] ?? type).toLowerCase()} section to your page.`}
                  >
                    <Icon
                      size={14}
                      className="text-hb-text-muted shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm text-hb-text-primary">
                        {addName}
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
        )}
      </div>
    </div>
  )
}
