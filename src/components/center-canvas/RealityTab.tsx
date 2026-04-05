import { useRef, useState, useEffect } from 'react'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import type { SectionType } from '@/lib/schemas/section'
import { useThemeVars } from '@/lib/useThemeVars'
import { useScrollReveal } from '@/lib/useScrollReveal'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { HeroCentered } from '@/templates/hero/HeroCentered'
import { HeroSplit } from '@/templates/hero/HeroSplit'
import { HeroOverlay } from '@/templates/hero/HeroOverlay'
import { HeroMinimal } from '@/templates/hero/HeroMinimal'
import { NavbarSimple } from '@/templates/navbar/NavbarSimple'
import { NavbarCentered } from '@/templates/navbar/NavbarCentered'
import { ActionCentered } from '@/templates/action/ActionCentered'
import { ActionSplit } from '@/templates/action/ActionSplit'
import { ActionGradient } from '@/templates/action/ActionGradient'
import { ActionNewsletter } from '@/templates/action/ActionNewsletter'
import { ColumnsCards } from '@/templates/columns/ColumnsCards'
import { ColumnsImageCards } from '@/templates/columns/ColumnsImageCards'
import { ColumnsIconText } from '@/templates/columns/ColumnsIconText'
import { ColumnsMinimal } from '@/templates/columns/ColumnsMinimal'
import { ColumnsNumbered } from '@/templates/columns/ColumnsNumbered'
import { ColumnsHorizontal } from '@/templates/columns/ColumnsHorizontal'
import { ColumnsGradient } from '@/templates/columns/ColumnsGradient'
import { ColumnsGlass } from '@/templates/columns/ColumnsGlass'
import { PricingTiers } from '@/templates/pricing/PricingTiers'
import { PricingToggle } from '@/templates/pricing/PricingToggle'
import { PricingComparison } from '@/templates/pricing/PricingComparison'
import { FooterSimple } from '@/templates/footer/FooterSimple'
import { QuotesCards } from '@/templates/quotes/QuotesCards'
import { QuotesSingle } from '@/templates/quotes/QuotesSingle'
import { QuotesStars } from '@/templates/quotes/QuotesStars'
import { QuotesMinimal } from '@/templates/quotes/QuotesMinimal'
import { QuestionsAccordion } from '@/templates/questions/QuestionsAccordion'
import { QuestionsTwoCol } from '@/templates/questions/QuestionsTwoCol'
import { QuestionsCards } from '@/templates/questions/QuestionsCards'
import { QuestionsNumbered } from '@/templates/questions/QuestionsNumbered'
import { NumbersCounters } from '@/templates/numbers/NumbersCounters'
import { NumbersIcons } from '@/templates/numbers/NumbersIcons'
import { NumbersCards } from '@/templates/numbers/NumbersCards'
import { NumbersGradient } from '@/templates/numbers/NumbersGradient'
import { FooterMultiColumn } from '@/templates/footer/FooterMultiColumn'
import { FooterSimpleBar } from '@/templates/footer/FooterSimpleBar'
import { FooterMinimal } from '@/templates/footer/FooterMinimal'
import { GalleryGrid } from '@/templates/gallery/GalleryGrid'
import { GalleryMasonry } from '@/templates/gallery/GalleryMasonry'
import { GalleryCarousel } from '@/templates/gallery/GalleryCarousel'
import { GalleryFullWidth } from '@/templates/gallery/GalleryFullWidth'
import { ImageFullWidth } from '@/templates/image/ImageFullWidth'
import { ImageWithText } from '@/templates/image/ImageWithText'
import { ImageOverlay } from '@/templates/image/ImageOverlay'
import { ImageParallax } from '@/templates/image/ImageParallax'
import { DividerLine } from '@/templates/divider/DividerLine'
import { DividerSpace } from '@/templates/divider/DividerSpace'
import { DividerDecorative } from '@/templates/divider/DividerDecorative'
import { TextSingle } from '@/templates/text/TextSingle'
import { TextTwoColumn } from '@/templates/text/TextTwoColumn'
import { TextWithSidebar } from '@/templates/text/TextWithSidebar'
import { LogosSimple } from '@/templates/logos/LogosSimple'
import { LogosMarquee } from '@/templates/logos/LogosMarquee'
import { LogosGrid } from '@/templates/logos/LogosGrid'
import { TeamCards } from '@/templates/team/TeamCards'
import { TeamGrid } from '@/templates/team/TeamGrid'
import { TeamMinimal } from '@/templates/team/TeamMinimal'
import { BlogCardGrid } from '@/templates/blog/BlogCardGrid'
import { BlogListExcerpts } from '@/templates/blog/BlogListExcerpts'
import { BlogFeaturedGrid } from '@/templates/blog/BlogFeaturedGrid'
import { BlogMinimal } from '@/templates/blog/BlogMinimal'
import {
  Star,
  Grid3X3,
  ArrowRight,
  DollarSign,
  MessageSquare,
  HelpCircle,
  Zap,
  Layout,
  Navigation,
  ChevronUp,
  ChevronDown,
  Trash2,
  ImageIcon,
  Minus,
  FileText,
  Award,
  Users,
  type LucideIcon,
} from 'lucide-react'

const DIVIDER_SECTION_TYPES: { type: SectionType; name: string; icon: LucideIcon }[] = [
  { type: 'menu', name: 'Top Menu', icon: Navigation },
  { type: 'hero', name: 'Main Banner', icon: Star },
  { type: 'columns', name: 'Columns', icon: Grid3X3 },
  { type: 'pricing', name: 'Pricing', icon: DollarSign },
  { type: 'action', name: 'Action Block', icon: ArrowRight },
  { type: 'footer', name: 'Footer', icon: Layout },
  { type: 'quotes', name: 'Quotes', icon: MessageSquare },
  { type: 'questions', name: 'Questions', icon: HelpCircle },
  { type: 'numbers', name: 'Numbers', icon: Zap },
  { type: 'gallery', name: 'Gallery', icon: Grid3X3 },
  { type: 'image', name: 'Image', icon: ImageIcon },
  { type: 'divider', name: 'Spacer', icon: Minus },
  { type: 'text', name: 'Text', icon: FileText },
  { type: 'logos', name: 'Logo Cloud', icon: Award },
  { type: 'team', name: 'Team', icon: Users },
  { type: 'blog', name: 'Blog', icon: FileText },
]

const SECTION_LABELS: Record<string, string> = {
  hero: 'Main Banner',
  columns: 'Columns',
  action: 'Action Block',
  pricing: 'Pricing',
  footer: 'Footer',
  quotes: 'Quotes',
  questions: 'Questions',
  numbers: 'Numbers',
  menu: 'Top Menu',
  gallery: 'Gallery',
  image: 'Image',
  divider: 'Spacer',
  text: 'Text',
  logos: 'Logo Cloud',
  team: 'Team',
  blog: 'Blog',
}

function AddSectionDivider({ afterIndex }: { afterIndex: number }) {
  const [showPicker, setShowPicker] = useState(false)
  const addSection = useConfigStore((s) => s.addSection)

  const handleAdd = (type: SectionType) => {
    addSection(type, afterIndex)
    setShowPicker(false)
  }

  return (
    <div className="group relative py-1">
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-transparent group-hover:border-hb-border/40 transition-colors" />
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-hb-surface border border-hb-border rounded-full px-3 py-1 text-xs text-hb-text-muted hover:text-hb-accent hover:border-hb-accent/50 shadow-sm z-10"
      >
        + Add Section
      </button>
      {showPicker && (
        <div className="relative z-20 mx-auto mt-4 max-w-xs rounded-lg border border-hb-border bg-hb-surface shadow-xl overflow-hidden">
          {DIVIDER_SECTION_TYPES.map(({ type, name, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAdd(type)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-hb-surface-hover transition-colors"
            >
              <Icon size={14} className="text-hb-text-muted shrink-0" />
              <span className="text-sm text-hb-text-primary">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionWrapper({
  section,
  index,
  totalEnabled,
  children,
}: {
  section: { id: string; type: string }
  index: number
  totalEnabled: number
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const scrollRef = useScrollReveal<HTMLDivElement>()
  const reorderSections = useConfigStore((s) => s.reorderSections)
  const removeSection = useConfigStore((s) => s.removeSection)
  const sections = useConfigStore((s) => s.config.sections)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)
  const setRightPanelVisible = useUIStore((s) => s.setRightPanelVisible)

  const handleMove = (dir: 'up' | 'down') => {
    const enabledIds = sections.filter((s) => s.enabled).map((s) => s.id)
    const idx = enabledIds.indexOf(section.id)
    const target = dir === 'up' ? idx - 1 : idx + 1
    if (target < 0 || target >= enabledIds.length) return
    const next = [...enabledIds]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    const disabledIds = sections.filter((s) => !s.enabled).map((s) => s.id)
    reorderSections([...next, ...disabledIds])
  }

  return (
    <div
      ref={scrollRef}
      data-section-id={section.id}
      className="relative group/section"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setSelectedContext({ type: 'section', sectionId: section.id })
        setRightPanelVisible(true)
      }}
    >
      {/* Section label badge */}
      {hovered && (
        <div className="absolute top-2 left-3 z-20 bg-hb-accent text-white text-xs font-medium px-2 py-0.5 rounded shadow-md">
          {SECTION_LABELS[section.type] || section.type}
        </div>
      )}

      {/* Floating toolbar */}
      {hovered && (
        <div className="absolute top-2 right-3 z-20 flex items-center gap-1 bg-hb-surface border border-hb-border rounded-lg shadow-lg p-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMove('up')
            }}
            disabled={index === 0}
            className="p-1.5 rounded hover:bg-hb-surface-hover text-hb-text-muted disabled:opacity-30"
            title="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMove('down')
            }}
            disabled={index === totalEnabled - 1}
            className="p-1.5 rounded hover:bg-hb-surface-hover text-hb-text-muted disabled:opacity-30"
            title="Move down"
          >
            <ChevronDown size={14} />
          </button>
          <div className="w-px h-4 bg-hb-border mx-0.5" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeSection(section.id)
            }}
            className="p-1.5 rounded hover:bg-red-500/10 text-hb-text-muted hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Hover border */}
      <div
        className={`transition-all ${hovered ? 'ring-2 ring-hb-accent/30 ring-inset rounded-sm' : ''}`}
      >
        {children}
      </div>
    </div>
  )
}

const PREVIEW_WIDTH_MAP = {
  full: '100%',
  desktop: '1280px',
  tablet: '768px',
  mobile: '375px',
} as const

export function RealityTab() {
  const sections = useConfigStore((s) => s.config.sections)
  const previewWidth = useUIStore((s) => s.previewWidth)
  const selectedContext = useUIStore((s) => s.selectedContext)
  const containerRef = useRef<HTMLDivElement>(null)
  useThemeVars(containerRef)

  // Auto-scroll to selected section
  useEffect(() => {
    if (selectedContext?.type !== 'section') return
    const sectionId = selectedContext.sectionId
    const el = containerRef.current?.querySelector(`[data-section-id="${sectionId}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedContext])

  const isPreviewMode = useUIStore((s) => s.isPreviewMode)

  const enabledSections = sections
    .map((s, i) => ({ section: s, originalIndex: i }))
    .filter(({ section }) => section.enabled)

  if (enabledSections.length === 0) {
    return (
      <div ref={containerRef} className="min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-hb-accent/10 flex items-center justify-center mx-auto mb-4">
            <Layout size={28} className="text-hb-accent" />
          </div>
          <p className="text-lg text-hb-text-muted font-medium">No sections yet</p>
          <p className="text-sm text-hb-text-muted/60 mt-2">Add a section from the left panel to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-full">
      <div
        className="mx-auto transition-all duration-300"
        style={{ maxWidth: isPreviewMode ? '100%' : PREVIEW_WIDTH_MAP[previewWidth] }}
      >
        {enabledSections.map(({ section, originalIndex }, i) => {
          const rendered = renderSection(section)

          if (isPreviewMode) {
            return (
              <ErrorBoundary key={section.id}>
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {rendered}
                </div>
              </ErrorBoundary>
            )
          }

          return (
            <ErrorBoundary key={section.id}>
              <div>
                <SectionWrapper
                  section={section}
                  index={i}
                  totalEnabled={enabledSections.length}
                >
                  {rendered}
                </SectionWrapper>
                {i < enabledSections.length - 1 && (
                  <AddSectionDivider afterIndex={originalIndex} />
                )}
              </div>
            </ErrorBoundary>
          )
        })}
      </div>
    </div>
  )
}

function renderSection(section: ReturnType<typeof useConfigStore.getState>['config']['sections'][0]) {
  if (section.type === 'menu') {
    switch (section.variant) {
      case 'centered':
        return <NavbarCentered section={section} />
      case 'simple':
      default:
        return <NavbarSimple section={section} />
    }
  }
  if (section.type === 'hero') {
    switch (section.variant) {
      case 'split-right':
      case 'split-left':
        return <HeroSplit section={section} />
      case 'overlay':
        return <HeroOverlay section={section} />
      case 'minimal':
        return <HeroMinimal section={section} />
      default:
        return <HeroCentered section={section} />
    }
  }
  if (section.type === 'columns') {
    switch (section.variant) {
      case 'cards':
        return <ColumnsCards section={section} />
      case 'image-cards':
        return <ColumnsImageCards section={section} />
      case 'icon-text':
        return <ColumnsIconText section={section} />
      case 'minimal':
        return <ColumnsMinimal section={section} />
      case 'numbered':
        return <ColumnsNumbered section={section} />
      case 'horizontal':
        return <ColumnsHorizontal section={section} />
      case 'gradient':
        return <ColumnsGradient section={section} />
      case 'glass':
        return <ColumnsGlass section={section} />
      default:
        return <ColumnsCards section={section} />
    }
  }
  if (section.type === 'pricing') {
    switch (section.variant) {
      case 'toggle':
        return <PricingToggle section={section} />
      case 'comparison':
        return <PricingComparison section={section} />
      default:
        return <PricingTiers section={section} />
    }
  }
  if (section.type === 'action') {
    switch (section.variant) {
      case 'split':
        return <ActionSplit section={section} />
      case 'gradient':
        return <ActionGradient section={section} />
      case 'newsletter':
        return <ActionNewsletter section={section} />
      default:
        return <ActionCentered section={section} />
    }
  }
  if (section.type === 'footer') {
    switch (section.variant) {
      case 'multi-column':
        return <FooterMultiColumn section={section} />
      case 'simple-bar':
        return <FooterSimpleBar section={section} />
      case 'minimal':
        return <FooterMinimal section={section} />
      default:
        return <FooterSimple section={section} />
    }
  }
  if (section.type === 'quotes') {
    switch (section.variant) {
      case 'single':
        return <QuotesSingle section={section} />
      case 'stars':
        return <QuotesStars section={section} />
      case 'minimal':
        return <QuotesMinimal section={section} />
      default:
        return <QuotesCards section={section} />
    }
  }
  if (section.type === 'questions') {
    switch (section.variant) {
      case 'two-column':
        return <QuestionsTwoCol section={section} />
      case 'cards':
        return <QuestionsCards section={section} />
      case 'numbered':
        return <QuestionsNumbered section={section} />
      default:
        return <QuestionsAccordion section={section} />
    }
  }
  if (section.type === 'numbers') {
    switch (section.variant) {
      case 'counters':
        return <NumbersCounters section={section} />
      case 'icons':
        return <NumbersIcons section={section} />
      case 'cards':
        return <NumbersCards section={section} />
      case 'gradient':
        return <NumbersGradient section={section} />
      default:
        return <NumbersCounters section={section} />
    }
  }
  if (section.type === 'gallery') {
    switch (section.variant) {
      case 'masonry':
        return <GalleryMasonry section={section} />
      case 'carousel':
        return <GalleryCarousel section={section} />
      case 'full-width':
        return <GalleryFullWidth section={section} />
      default:
        return <GalleryGrid section={section} />
    }
  }
  if (section.type === 'image') {
    switch (section.variant) {
      case 'with-text':
        return <ImageWithText section={section} />
      case 'overlay':
        return <ImageOverlay section={section} />
      case 'parallax':
        return <ImageParallax section={section} />
      default:
        return <ImageFullWidth section={section} />
    }
  }
  if (section.type === 'divider') {
    switch (section.variant) {
      case 'space':
        return <DividerSpace section={section} />
      case 'decorative':
        return <DividerDecorative section={section} />
      default:
        return <DividerLine section={section} />
    }
  }
  if (section.type === 'text') {
    switch (section.variant) {
      case 'two-column':
        return <TextTwoColumn section={section} />
      case 'sidebar':
        return <TextWithSidebar section={section} />
      default:
        return <TextSingle section={section} />
    }
  }
  if (section.type === 'logos') {
    switch (section.variant) {
      case 'marquee':
        return <LogosMarquee section={section} />
      case 'grid':
        return <LogosGrid section={section} />
      default:
        return <LogosSimple section={section} />
    }
  }
  if (section.type === 'team') {
    switch (section.variant) {
      case 'grid':
        return <TeamGrid section={section} />
      case 'minimal':
        return <TeamMinimal section={section} />
      default:
        return <TeamCards section={section} />
    }
  }
  if (section.type === 'blog') {
    switch (section.variant) {
      case 'list-excerpts':
        return <BlogListExcerpts section={section} />
      case 'featured-grid':
        return <BlogFeaturedGrid section={section} />
      case 'minimal':
        return <BlogMinimal section={section} />
      default:
        return <BlogCardGrid section={section} />
    }
  }
  return (
    <div
      className="py-16 px-8"
      style={{
        background: section.style.background,
        color: section.style.color,
      }}
    />
  )
}
