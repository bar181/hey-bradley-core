import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { StatusBar } from './StatusBar'
import { PanelLayout } from './PanelLayout'
import { ShortcutHelp } from '@/components/ui/ShortcutHelp'
import { SettingsDrawer } from '@/components/settings/SettingsDrawer'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { useAutoSave } from '@/lib/persistence'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

type AppShellMode = 'whiteboard' | 'planning' | 'agentics'

export function AppShell() {
  const { pathname } = useLocation()
  const mode: AppShellMode = pathname.startsWith('/planning')
    ? 'planning'
    : pathname.startsWith('/agentics')
      ? 'agentics'
      : 'whiteboard'

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

  if (mode === 'planning') {
    return (
      <div data-testid="appshell-mode-planning" className="min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row flex-1">
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--hb-border)] bg-[var(--hb-surface)] p-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--hb-text-muted)]">Projects</h2>
            <p className="mt-2 text-xs text-[var(--hb-text-muted)]">Project + phase list — P91 ships interactive surface</p>
          </aside>
          <main className="flex-1 p-6" />
          <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[var(--hb-border)] bg-[var(--hb-surface)] p-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--hb-text-muted)]">Spec</h2>
            <p className="mt-2 text-xs text-[var(--hb-text-muted)]">Spec panel placeholder — P95 SpecWorkbench</p>
          </aside>
        </div>
      </div>
    )
  }

  if (mode === 'agentics') {
    return (
      <div data-testid="appshell-mode-agentics" className="min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row flex-1">
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--hb-border)] bg-[var(--hb-surface)] p-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--hb-text-muted)]">Phase Tree</h2>
            <p className="mt-2 text-xs text-[var(--hb-text-muted)]">Phase / sprint / wave tree — P92+ ships nodes</p>
          </aside>
          <main className="flex-1 p-6" />
          <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[var(--hb-border)] bg-[var(--hb-surface)] p-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--hb-accent)]">AISP</h2>
            <p className="mt-2 text-xs text-[var(--hb-text-muted)]">AISP spec — prominent in Agentics per ADR-110</p>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-hb-bg">
      {!isPreviewMode && <TopBar />}
      <main className="flex-1 overflow-hidden">
        <PanelLayout />
      </main>
      {!isPreviewMode && <StatusBar />}
      <ShortcutHelp open={helpOpen} onClose={closeHelp} />
      <SettingsDrawer />
    </div>
  )
}
