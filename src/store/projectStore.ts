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
  exportProject: (config: MasterConfig, name: string) => void
  importProject: (file: File) => Promise<MasterConfig>
  refreshList: () => void
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

function hydrateLastProject(slug: string | null): void {
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
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const initialActive = readInitialActive()
hydrateLastProject(initialActive)

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: readProjectList(),
  activeProject: initialActive,

  refreshList: () => {
    set({ projects: readProjectList() })
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

  exportProject: (config, name) => {
    const json = JSON.stringify(config, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const slug = toSlug(name)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.hey-bradley.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  importProject: async (file) => {
    return new Promise<MasterConfig>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const text = reader.result as string
          const parsed = JSON.parse(text)
          const validated = masterConfigSchema.parse(parsed)
          resolve(validated)
        } catch {
          reject(new Error('Invalid project file. The JSON could not be validated.'))
        }
      }
      reader.onerror = () => {
        reject(new Error('Failed to read the file.'))
      }
      reader.readAsText(file)
    })
  },
}))
