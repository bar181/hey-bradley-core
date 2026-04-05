import { Palette } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { ThemeSimple } from './simple/ThemeSimple'
import { SiteContextEditor } from './simple/SiteContextEditor'
import { SectionSimple } from './simple/SectionSimple'
import { FeaturesSectionSimple } from './simple/FeaturesSectionSimple'
import { CTASectionSimple } from './simple/CTASectionSimple'
import { PricingSectionSimple } from './simple/PricingSectionSimple'
import { FooterSectionSimple } from './simple/FooterSectionSimple'
import { TestimonialsSectionSimple } from './simple/TestimonialsSectionSimple'
import { FAQSectionSimple } from './simple/FAQSectionSimple'
import { ValuePropsSectionSimple } from './simple/ValuePropsSectionSimple'
import { NavbarSectionSimple } from './simple/NavbarSectionSimple'
import { GallerySectionSimple } from './simple/GallerySectionSimple'
import { ImageSectionSimple } from './simple/ImageSectionSimple'
import { DividerSectionSimple } from './simple/DividerSectionSimple'
import { TextSectionSimple } from './simple/TextSectionSimple'
import { LogosSectionSimple } from './simple/LogosSectionSimple'
import { TeamSectionSimple } from './simple/TeamSectionSimple'
import { BlogSectionSimple } from './simple/BlogSectionSimple'

export function SimpleTab() {
  const selectedContext = useUIStore((s) => s.selectedContext)
  const config = useConfigStore((s) => s.config)

  if (!selectedContext) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-hb-accent/10 flex items-center justify-center mb-4">
          <Palette size={24} className="text-hb-accent" />
        </div>
        <h3 className="text-sm font-semibold text-hb-text-primary mb-1">Welcome to the Editor</h3>
        <p className="text-xs text-hb-text-muted max-w-[200px]">
          Click any section on the left or in the preview to start editing.
        </p>
      </div>
    )
  }

  if (selectedContext.type === 'theme') {
    return <ThemeSimple />
  }

  if (selectedContext.type === 'site-context') {
    return <SiteContextEditor />
  }

  const section = config.sections.find((s) => s.id === selectedContext.sectionId)
  if (!section) return <SectionSimple sectionId={selectedContext.sectionId} />

  switch (section.type) {
    case 'hero': return <SectionSimple sectionId={section.id} />
    case 'menu': return <NavbarSectionSimple sectionId={section.id} />
    case 'columns': return <FeaturesSectionSimple sectionId={section.id} />
    case 'action': return <CTASectionSimple sectionId={section.id} />
    case 'pricing': return <PricingSectionSimple sectionId={section.id} />
    case 'footer': return <FooterSectionSimple sectionId={section.id} />
    case 'quotes': return <TestimonialsSectionSimple sectionId={section.id} />
    case 'questions': return <FAQSectionSimple sectionId={section.id} />
    case 'numbers': return <ValuePropsSectionSimple sectionId={section.id} />
    case 'gallery': return <GallerySectionSimple sectionId={section.id} />
    case 'image': return <ImageSectionSimple sectionId={section.id} />
    case 'divider': return <DividerSectionSimple sectionId={section.id} />
    case 'text': return <TextSectionSimple sectionId={section.id} />
    case 'logos': return <LogosSectionSimple sectionId={section.id} />
    case 'team': return <TeamSectionSimple sectionId={section.id} />
    case 'blog': return <BlogSectionSimple sectionId={section.id} />
    default: return <SectionSimple sectionId={section.id} />
  }
}
