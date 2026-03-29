import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { ThemeSimple } from './simple/ThemeSimple'
import { SectionSimple } from './simple/SectionSimple'
import { FeaturesSectionSimple } from './simple/FeaturesSectionSimple'
import { CTASectionSimple } from './simple/CTASectionSimple'
import { PricingSectionSimple } from './simple/PricingSectionSimple'
import { FooterSectionSimple } from './simple/FooterSectionSimple'
import { TestimonialsSectionSimple } from './simple/TestimonialsSectionSimple'
import { FAQSectionSimple } from './simple/FAQSectionSimple'
import { ValuePropsSectionSimple } from './simple/ValuePropsSectionSimple'

export function SimpleTab() {
  const selectedContext = useUIStore((s) => s.selectedContext)
  const config = useConfigStore((s) => s.config)

  if (!selectedContext) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-hb-text-muted text-sm">
          Select an item
        </span>
      </div>
    )
  }

  if (selectedContext.type === 'theme') {
    return <ThemeSimple />
  }

  const section = config.sections.find((s) => s.id === selectedContext.sectionId)
  if (!section) return <SectionSimple sectionId={selectedContext.sectionId} />

  switch (section.type) {
    case 'hero': return <SectionSimple sectionId={section.id} />
    case 'features': return <FeaturesSectionSimple sectionId={section.id} />
    case 'cta': return <CTASectionSimple sectionId={section.id} />
    case 'pricing': return <PricingSectionSimple sectionId={section.id} />
    case 'footer': return <FooterSectionSimple sectionId={section.id} />
    case 'testimonials': return <TestimonialsSectionSimple sectionId={section.id} />
    case 'faq': return <FAQSectionSimple sectionId={section.id} />
    case 'value_props': return <ValuePropsSectionSimple sectionId={section.id} />
    default: return <SectionSimple sectionId={section.id} />
  }
}
