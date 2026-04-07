import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { StatusBar } from './StatusBar'
import { PanelLayout } from './PanelLayout'
import { ShortcutHelp } from '@/components/ui/ShortcutHelp'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { useAutoSave } from '@/lib/persistence'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export function AppShell() {
  useAutoSave()
  const { helpOpen, closeHelp } = useKeyboardShortcuts()

  // Auto-select hero section so right panel isn't empty on load
  useEffect(() => {
    const { selectedContext, setSelectedContext } = useUIStore.getState()
    if (!selectedContext || selectedContext.type === 'theme') {
      const sections = useConfigStore.getState().config.sections
      const hero = sections.find((s) => s.type === 'hero' && s.enabled)
      if (hero) {
        setSelectedContext({ type: 'section', sectionId: hero.id })
      }
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const { isPreviewMode, setPreviewMode } = useUIStore.getState()
        if (isPreviewMode) {
          setPreviewMode(false)
          return
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          useConfigStore.getState().redo()
        } else {
          useConfigStore.getState().undo()
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isPreviewMode = useUIStore((s) => s.isPreviewMode)

  return (
    <div className="h-screen flex flex-col bg-hb-bg">
      {!isPreviewMode && <TopBar />}
      <main className="flex-1 overflow-hidden">
        <PanelLayout />
      </main>
      {!isPreviewMode && <StatusBar />}
      <ShortcutHelp open={helpOpen} onClose={closeHelp} />
    </div>
  )
}
