import { useUIStore } from '@/store/uiStore'
import { ThemeSimple } from './simple/ThemeSimple'
import { SectionSimple } from './simple/SectionSimple'

export function SimpleTab() {
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
    return <ThemeSimple />
  }

  return <SectionSimple sectionId={selectedContext.sectionId} />
}
