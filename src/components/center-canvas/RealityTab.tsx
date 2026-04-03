import { useRef, useState } from 'react'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import type { SectionType } from '@/lib/schemas/section'
import { useThemeVars } from '@/lib/useThemeVars'
import { HeroCentered } from '@/templates/hero/HeroCentered'
import { HeroSplit } from '@/templates/hero/HeroSplit'
import { HeroOverlay } from '@/templates/hero/HeroOverlay'
import { HeroMinimal } from '@/templates/hero/HeroMinimal'
import { NavbarSimple } from '@/templates/navbar/NavbarSimple'
import { CTASimple } from '@/templates/cta/CTASimple'
import { CTASplit } from '@/templates/cta/CTASplit'
import { FeaturesGrid } from '@/templates/features/FeaturesGrid'
import { FeaturesCards } from '@/templates/features/FeaturesCards'
import { PricingTiers } from '@/templates/pricing/PricingTiers'
import { FooterSimple } from '@/templates/footer/FooterSimple'
import { TestimonialsCards } from '@/templates/testimonials/TestimonialsCards'
import { FAQAccordion } from '@/templates/faq/FAQAccordion'
import { FAQTwoCol } from '@/templates/faq/FAQTwoCol'
import { ValuePropsGrid } from '@/templates/value-props/ValuePropsGrid'
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
  type LucideIcon,
} from 'lucide-react'

const DIVIDER_SECTION_TYPES: { type: SectionType; name: string; icon: LucideIcon }[] = [
  { type: 'navbar', name: 'Top Menu', icon: Navigation },
  { type: 'hero', name: 'Main Banner', icon: Star },
  { type: 'features', name: 'Features', icon: Grid3X3 },
  { type: 'pricing', name: 'Pricing', icon: DollarSign },
  { type: 'cta', name: 'Action Block', icon: ArrowRight },
  { type: 'footer', name: 'Footer', icon: Layout },
  { type: 'testimonials', name: 'Reviews', icon: MessageSquare },
  { type: 'faq', name: 'FAQ', icon: HelpCircle },
  { type: 'value_props', name: 'Highlights', icon: Zap },
]

const SECTION_LABELS: Record<string, string> = {
  hero: 'Main Banner',
  features: 'Features',
  cta: 'Action Block',
  pricing: 'Pricing',
  footer: 'Footer',
  testimonials: 'Reviews',
  faq: 'Questions & Answers',
  value_props: 'Key Numbers',
  navbar: 'Top Menu',
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
  const containerRef = useRef<HTMLDivElement>(null)
  useThemeVars(containerRef)

  if (import.meta.env.DEV) console.log('[preview]', previewWidth)

  const enabledSections = sections
    .map((s, i) => ({ section: s, originalIndex: i }))
    .filter(({ section }) => section.enabled)

  return (
    <div ref={containerRef} className="min-h-full">
      <div
        className="mx-auto transition-all duration-300"
        style={{ maxWidth: PREVIEW_WIDTH_MAP[previewWidth] }}
      >
        {enabledSections.map(({ section, originalIndex }, i) => {
          const rendered = renderSection(section)
          return (
            <div key={section.id}>
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
          )
        })}
      </div>
    </div>
  )
}

function renderSection(section: ReturnType<typeof useConfigStore.getState>['config']['sections'][0]) {
  if (section.type === 'navbar') {
    return <NavbarSimple section={section} />
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
  if (section.type === 'features') {
    return section.variant === 'cards'
      ? <FeaturesCards section={section} />
      : <FeaturesGrid section={section} />
  }
  if (section.type === 'pricing') {
    return <PricingTiers section={section} />
  }
  if (section.type === 'cta') {
    return section.variant === 'split'
      ? <CTASplit section={section} />
      : <CTASimple section={section} />
  }
  if (section.type === 'footer') {
    return <FooterSimple section={section} />
  }
  if (section.type === 'testimonials') {
    return <TestimonialsCards section={section} />
  }
  if (section.type === 'faq') {
    return section.variant === 'two-column'
      ? <FAQTwoCol section={section} />
      : <FAQAccordion section={section} />
  }
  if (section.type === 'value_props') {
    return <ValuePropsGrid section={section} />
  }
  return (
    <div
      className="py-16 px-8 text-center"
      style={{
        background: section.style.background,
        color: section.style.color,
      }}
    >
      <p className="font-mono text-sm uppercase tracking-wider opacity-50">
        {section.type} — {section.id}
      </p>
    </div>
  )
}
