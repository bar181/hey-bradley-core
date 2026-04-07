import { useEffect, useState, useCallback } from 'react'
import { useUIStore } from '@/store/uiStore'

export interface Shortcut {
  key: string
  ctrl?: boolean
  label: string
  action: string
}

export const shortcuts: Shortcut[] = [
  { key: 'p', ctrl: true, action: 'togglePreview', label: 'Toggle preview mode' },
  { key: 'e', ctrl: true, action: 'toggleExpert', label: 'Toggle SIMPLE/EXPERT' },
  { key: 'Escape', action: 'closeModals', label: 'Close modals / exit preview' },
  { key: '?', action: 'showHelp', label: 'Show keyboard shortcuts' },
]

function isTyping(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  if ((el as HTMLElement).isContentEditable) return true
  return false
}

export function useKeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false)

  const closeHelp = useCallback(() => setHelpOpen(false), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Escape always works (even when typing) for closing help
      if (e.key === 'Escape' && helpOpen) {
        setHelpOpen(false)
        return
      }

      // Skip shortcuts when typing in inputs
      if (isTyping()) return

      const ctrl = e.ctrlKey || e.metaKey

      // Ctrl+P — toggle preview
      if (ctrl && e.key === 'p') {
        e.preventDefault()
        const store = useUIStore.getState()
        store.setPreviewMode(!store.isPreviewMode)
        return
      }

      // Ctrl+E — toggle SIMPLE/EXPERT
      if (ctrl && e.key === 'e') {
        e.preventDefault()
        const store = useUIStore.getState()
        store.setRightPanelTab(store.rightPanelTab === 'SIMPLE' ? 'EXPERT' : 'SIMPLE')
        return
      }

      // ? — show help
      if (e.key === '?' && !ctrl) {
        e.preventDefault()
        setHelpOpen((prev) => !prev)
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [helpOpen])

  return { helpOpen, closeHelp }
}
