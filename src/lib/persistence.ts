// Thin re-export surface over the Persistence bounded context.
// Wave 3 swaps `projectStore` to the DB adapter; A9 owns the autosave debounce
// and legacy localStorage migration that will fill in the hooks below.

import { useEffect } from 'react'
import { useConfigStore } from '@/store/configStore'

// Re-exports — consumers may reach for these directly without importing from
// deep `src/contexts/persistence/...` paths.
export {
  kvGet,
  kvSet,
  kvDelete,
  kvHas,
} from '@/contexts/persistence/repositories/kv'
export {
  listProjects,
  getProject,
  upsertProject,
  deleteProject,
} from '@/contexts/persistence/repositories/projects'
export { initDB, persist, getDB } from '@/contexts/persistence/db'

/**
 * Load saved project from the DB on mount.
 * Hydration is now performed inside `projectStore` at module init, so this
 * helper is retained only for back-compat with existing callers and is a
 * no-op. A9 may rewire this when the legacy localStorage migration lands.
 */
export function loadSavedProject(): boolean {
  return false
}

/** Clear current in-memory config and reset to defaults. */
export function newProject(): void {
  useConfigStore.getState().resetToDefaults()
}

/**
 * React hook: subscribe to config changes and auto-save.
 * A9 owns the debounced DB write — this stub keeps the existing import
 * surface (`AppShell` calls `useAutoSave()`) compiling.
 */
export function useAutoSave(): void {
  useEffect(() => {
    // Intentionally empty: A9 wires the debounced upsert to the projects repo.
  }, [])
}
