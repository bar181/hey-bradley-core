import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { StatusBar } from './StatusBar'
import { PanelLayout } from './PanelLayout'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { useAutoSave } from '@/lib/persistence'

export function AppShell() {
  useAutoSave()

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
          if (import.meta.env.DEV) console.log('[undo/redo] redo')
        } else {
          useConfigStore.getState().undo()
          if (import.meta.env.DEV) console.log('[undo/redo] undo')
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (import.meta.env.DEV) console.log('[save] prevented browser save')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isPreviewMode = useUIStore((s) => s.isPreviewMode)

  return (
    <div className="h-screen flex flex-col bg-hb-bg">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <PanelLayout />
      </main>
      {!isPreviewMode && <StatusBar />}
    </div>
  )
}
