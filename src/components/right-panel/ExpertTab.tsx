import { Code } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'
import { ThemeExpert } from './expert/ThemeExpert'
import { SectionExpert } from './expert/SectionExpert'
import { NavbarSectionExpert } from './expert/NavbarSectionExpert'

export function ExpertTab() {
  const selectedContext = useUIStore((s) => s.selectedContext)
  const sections = useConfigStore((s) => s.config.sections)

  if (!selectedContext) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-hb-accent/10 flex items-center justify-center mb-4">
          <Code size={24} className="text-hb-accent" />
        </div>
        <h3 className="text-sm font-semibold text-hb-text-primary mb-1">Expert Editor</h3>
        <p className="text-xs text-hb-text-muted max-w-[200px]">
          Click any section in the preview to edit its raw configuration.
        </p>
      </div>
    )
  }

  if (selectedContext.type === 'theme') {
    return <ThemeExpert />
  }

  if (selectedContext.type === 'site-context') {
    return <ThemeExpert />
  }

  const section = sections.find((s) => s.id === selectedContext.sectionId)
  if (section?.type === 'menu') {
    return <NavbarSectionExpert sectionId={selectedContext.sectionId} />
  }

  return <SectionExpert sectionId={selectedContext.sectionId} />
}
