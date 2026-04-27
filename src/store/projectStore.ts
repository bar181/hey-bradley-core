import { create } from 'zustand'
import { masterConfigSchema } from '@/lib/schemas/masterConfig'
import type { MasterConfig } from '@/lib/schemas/masterConfig'
import {
  listProjects as repoList,
  getProject as repoGet,
  upsertProject as repoUpsert,
  deleteProject as repoDelete,
  type ProjectRow,
} from '@/contexts/persistence/repositories/projects'
import { kvGet, kvSet } from '@/contexts/persistence/repositories/kv'
import {
  exportProject as bundleExportProject,
  importBundle,
  downloadBundle,
} from '@/contexts/persistence/exportImport'
import { useConfigStore } from '@/store/configStore'

// ---------------------------------------------------------------------------
// Types — UI contract preserved from the previous localStorage-backed store.
// ---------------------------------------------------------------------------

export interface ProjectMeta {
  slug: string
  name: string
  savedAt: string // ISO date
  sectionCount: number
  theme: string
}

interface ProjectStore {
  projects: ProjectMeta[]
  activeProject: string | null // slug

  saveProject: (name: string, config: MasterConfig) => void
  loadProject: (slug: string) => MasterConfig | null
  deleteProject: (slug: string) => void
  listProjects: () => ProjectMeta[]
  exportProject: (slug: string) => Promise<void>
  importProject: (file: File) => Promise<void>
  refreshList: () => void
  hydrateLastProjectAfterDB: () => Promise<void>
}

const LAST_PROJECT_KEY = 'lastProjectId'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'untitled'
}

function rowToMeta(row: ProjectRow): ProjectMeta {
  // config_json holds the full MasterConfig; we extract the few fields the
  // listing UI needs without paying for a full schema parse.
  let sectionCount = 0
  let theme = 'custom'
  try {
    const parsed = JSON.parse(row.config_json) as {
      sections?: unknown[]
      theme?: { preset?: string }
    }
    sectionCount = Array.isArray(parsed.sections) ? parsed.sections.length : 0
    theme = parsed.theme?.preset || 'custom'
  } catch {
    // Tolerate malformed rows in the listing — load() will validate.
  }
  return {
    slug: row.id,
    name: row.name,
    savedAt: new Date(row.updated_at).toISOString(),
    sectionCount,
    theme,
  }
}

function readProjectList(): ProjectMeta[] {
  try {
    return repoList().map(rowToMeta)
  } catch {
    // DB not yet initialised (e.g. very early render) — empty list is safe.
    return []
  }
}

function readInitialActive(): string | null {
  try {
    return kvGet(LAST_PROJECT_KEY) ?? null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Hydration is deferred until after initDB() resolves; main.tsx invokes
  // hydrateLastProjectAfterDB() at boot. Until then, lists are empty and
  // activeProject is null — safe defaults that won't crash the UI.
  projects: [],
  activeProject: null,

  refreshList: () => {
    set({ projects: readProjectList() })
  },

  hydrateLastProjectAfterDB: async () => {
    const slug = readInitialActive()
    set({ projects: readProjectList(), activeProject: slug })
    if (!slug) return
    try {
      const row = repoGet(slug)
      if (!row) return
      const parsed = JSON.parse(row.config_json) as unknown
      const validated = masterConfigSchema.parse(parsed)
      useConfigStore.getState().loadConfig(validated)
    } catch {
      // Bad row — leave configStore at defaults.
    }
  },

  saveProject: (name, config) => {
    const slug = toSlug(name)
    repoUpsert({ id: slug, name, config })
    kvSet(LAST_PROJECT_KEY, slug)
    set({ projects: readProjectList(), activeProject: slug })
  },

  loadProject: (slug) => {
    try {
      const row = repoGet(slug)
      if (!row) return null
      const parsed = JSON.parse(row.config_json) as unknown
      const validated = masterConfigSchema.parse(parsed)
      kvSet(LAST_PROJECT_KEY, slug)
      set({ activeProject: slug })
      return validated
    } catch {
      return null
    }
  },

  deleteProject: (slug) => {
    repoDelete(slug)
    const { activeProject } = get()
    set({
      projects: readProjectList(),
      activeProject: activeProject === slug ? null : activeProject,
    })
  },

  listProjects: () => {
    return get().projects
  },

  exportProject: async (slug) => {
    const row = repoGet(slug)
    if (!row) return
    const blob = await bundleExportProject(slug)
    await downloadBundle(blob, `${slug}.heybradley`)
  },

  importProject: async (file) => {
    await importBundle(file)
    // Refresh the list and re-hydrate the active project from the freshly
    // imported DB so the UI reflects the new state.
    set({ projects: readProjectList() })
    const slug = readInitialActive()
    set({ activeProject: slug })
    if (slug) {
      try {
        const row = repoGet(slug)
        if (row) {
          const parsed = JSON.parse(row.config_json) as unknown
          const validated = masterConfigSchema.parse(parsed)
          useConfigStore.getState().loadConfig(validated)
          // Re-persist via repoUpsert is unnecessary — the imported DB
          // already contains the row.
        }
      } catch {
        // Tolerate validation failures; UI keeps current config.
      }
    }
  },
}))

// Expose store for Playwright/E2E testing in dev mode
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__projectStore = useProjectStore
}
