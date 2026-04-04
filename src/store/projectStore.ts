import { create } from 'zustand'
import { masterConfigSchema } from '@/lib/schemas/masterConfig'
import type { MasterConfig } from '@/lib/schemas/masterConfig'

// ---------------------------------------------------------------------------
// Types
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PROJECT_LIST_KEY = 'hb-project-list'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'untitled'
}

function projectStorageKey(slug: string): string {
  return `hb-project-${slug}`
}

function readProjectList(): ProjectMeta[] {
  try {
    const raw = localStorage.getItem(PROJECT_LIST_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ProjectMeta[]
  } catch {
    return []
  }
}

function writeProjectList(projects: ProjectMeta[]): void {
  localStorage.setItem(PROJECT_LIST_KEY, JSON.stringify(projects))
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: readProjectList(),
  activeProject: null,

  refreshList: () => {
    set({ projects: readProjectList() })
  },

  saveProject: (name, config) => {
    const slug = toSlug(name)
    const key = projectStorageKey(slug)

    // Serialize and store the config
    localStorage.setItem(key, JSON.stringify(config))

    // Build meta entry
    const meta: ProjectMeta = {
      slug,
      name,
      savedAt: new Date().toISOString(),
      sectionCount: config.sections.length,
      theme: config.theme?.preset || 'custom',
    }

    // Upsert into project list
    const existing = readProjectList()
    const idx = existing.findIndex((p) => p.slug === slug)
    if (idx >= 0) {
      existing[idx] = meta
    } else {
      existing.push(meta)
    }
    writeProjectList(existing)

    set({ projects: existing, activeProject: slug })
  },

  loadProject: (slug) => {
    try {
      const key = projectStorageKey(slug)
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      const validated = masterConfigSchema.parse(parsed)
      set({ activeProject: slug })
      return validated
    } catch {
      return null
    }
  },

  deleteProject: (slug) => {
    const key = projectStorageKey(slug)
    localStorage.removeItem(key)

    const existing = readProjectList().filter((p) => p.slug !== slug)
    writeProjectList(existing)

    const { activeProject } = get()
    set({
      projects: existing,
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
        } catch (err) {
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
