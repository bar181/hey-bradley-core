import { useUIStore } from '@/store/uiStore'
import { ThemeExpert } from './expert/ThemeExpert'
import { SectionExpert } from './expert/SectionExpert'

export function ExpertTab() {
  const selectedContext = useUIStore((s) => s.selectedContext)

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
    return <ThemeExpert />
  }

  return <SectionExpert sectionId={selectedContext.sectionId} />
}
