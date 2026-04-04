import { useEffect, useRef } from 'react'
import { useConfigStore } from '@/store/configStore'
import { masterConfigSchema } from '@/lib/schemas/masterConfig'

const STORAGE_KEY = 'hey-bradley-project'
const SAVE_DEBOUNCE_MS = 2000

/** Load saved project from localStorage on mount */
export function loadSavedProject(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return false
    const parsed = JSON.parse(saved)
    const validated = masterConfigSchema.parse(parsed)
    useConfigStore.getState().loadConfig(validated)
    return true
  } catch (e) {
    return false
  }
}

/** Save current config to localStorage */
function saveToLocalStorage() {
  try {
    const config = useConfigStore.getState().config
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    useConfigStore.getState().markSaved()
  } catch {
    // save failed — localStorage may be full
  }
}

/** Clear saved project and reset to defaults */
export function newProject() {
  localStorage.removeItem(STORAGE_KEY)
  useConfigStore.getState().resetToDefaults()
}

/** React hook: subscribe to config changes and auto-save with debounce */
export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Load on mount
    loadSavedProject()

    // Subscribe to changes
    const unsub = useConfigStore.subscribe((state, prevState) => {
      if (state.config !== prevState.config) {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(saveToLocalStorage, SAVE_DEBOUNCE_MS)
      }
    })

    return () => {
      unsub()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])
}
