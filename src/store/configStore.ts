import { create } from 'zustand'
import { deepMerge } from '@/lib/deepMerge'
import type { MasterConfig, Section, SectionType, PatchSource } from '@/lib/schemas'
import { heroContentSchema } from '@/lib/schemas'

const DEFAULT_HERO_CONTENT = heroContentSchema.parse({})

const DEFAULT_CONFIG: MasterConfig = {
  spec: 'aisp-1.2',
  page: 'index',
  version: '1.0.0-RC1',
  sections: [
    {
      type: 'hero',
      id: 'hero-01',
      variant: 'centered',
      layout: {
        display: 'flex',
        direction: 'column',
        align: 'center',
        gap: '24px',
        padding: '64px',
      },
      content: DEFAULT_HERO_CONTENT as unknown as Record<string, unknown>,
      style: {
        background: '#0a0a0f',
        color: '#f8fafc',
        fontFamily: 'Inter',
        borderRadius: '0px',
      },
      enabled: true,
    },
    {
      type: 'features',
      id: 'features-01',
      layout: {
        display: 'grid',
        columns: 3,
        gap: '32px',
        padding: '48px',
      },
      content: {
        title: 'Features',
        items: [
          { id: 'f1', icon: '⚡', title: 'Fast' },
          { id: 'f2', icon: '🎯', title: 'Precise' },
          { id: 'f3', icon: '🔒', title: 'Secure' },
        ],
      },
      style: {
        background: '#0f172a',
        color: '#f8fafc',
      },
      enabled: true,
    },
    {
      type: 'cta',
      id: 'cta-01',
      layout: {
        display: 'flex',
        direction: 'column',
        align: 'center',
        padding: '32px',
        gap: '16px',
      },
      content: {
        heading: 'Ready to start?',
        button: { text: 'Launch Now', url: '#signup' },
      },
      style: {
        background: '#3b82f6',
        color: '#ffffff',
      },
      enabled: true,
    },
  ],
}

const HISTORY_LIMIT = 100

interface ConfigStore {
  config: MasterConfig
  history: MasterConfig[]
  future: MasterConfig[]
  isDirty: boolean
  lastSavedAt: Date | null

  applyPatch: (patch: Record<string, unknown>, source: PatchSource) => void
  setSectionConfig: (sectionId: string, patch: Record<string, unknown>) => void
  addSection: (type: SectionType, afterIndex?: number) => void
  removeSection: (sectionId: string) => void
  reorderSections: (newOrder: string[]) => void
  toggleSectionEnabled: (sectionId: string) => void

  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  markSaved: () => void
  loadConfig: (config: MasterConfig) => void
  resetToDefaults: () => void
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: DEFAULT_CONFIG,
  history: [],
  future: [],
  isDirty: false,
  lastSavedAt: null,

  applyPatch: (patch, _source) => {
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const newConfig = deepMerge(config as unknown as Record<string, unknown>, patch) as unknown as MasterConfig
    set({ config: newConfig, history: newHistory, future: [], isDirty: true })
  },

  setSectionConfig: (sectionId, patch) => {
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const newSections = config.sections.map((section) => {
      if (section.id !== sectionId) return section
      return deepMerge(section as unknown as Record<string, unknown>, patch) as unknown as Section
    })
    set({
      config: { ...config, sections: newSections },
      history: newHistory,
      future: [],
      isDirty: true,
    })
  },

  addSection: (type, afterIndex) => {
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const id = `${type}-${crypto.randomUUID().slice(0, 8)}`
    const newSection: Section = {
      type,
      id,
      layout: { display: 'flex', gap: '24px', padding: '48px' },
      content: {},
      style: { background: '#0f172a', color: '#f8fafc' },
      enabled: true,
    }
    const sections = [...config.sections]
    const insertAt = afterIndex !== undefined ? afterIndex + 1 : sections.length
    sections.splice(insertAt, 0, newSection)
    set({
      config: { ...config, sections },
      history: newHistory,
      future: [],
      isDirty: true,
    })
  },

  removeSection: (sectionId) => {
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    set({
      config: { ...config, sections: config.sections.filter((s) => s.id !== sectionId) },
      history: newHistory,
      future: [],
      isDirty: true,
    })
  },

  reorderSections: (newOrder) => {
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const sectionMap = new Map(config.sections.map((s) => [s.id, s]))
    const reordered = newOrder.map((id) => sectionMap.get(id)).filter(Boolean) as Section[]
    set({
      config: { ...config, sections: reordered },
      history: newHistory,
      future: [],
      isDirty: true,
    })
  },

  toggleSectionEnabled: (sectionId) => {
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const sections = config.sections.map((s) =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    )
    set({
      config: { ...config, sections },
      history: newHistory,
      future: [],
      isDirty: true,
    })
  },

  undo: () => {
    const { config, history, future } = get()
    if (history.length === 0) return
    const previous = history[history.length - 1]
    set({
      config: previous,
      history: history.slice(0, -1),
      future: [config, ...future],
      isDirty: true,
    })
  },

  redo: () => {
    const { config, history, future } = get()
    if (future.length === 0) return
    const next = future[0]
    set({
      config: next,
      history: [...history, config],
      future: future.slice(1),
      isDirty: true,
    })
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,

  markSaved: () => set({ isDirty: false, lastSavedAt: new Date() }),

  loadConfig: (config) => set({ config, history: [], future: [], isDirty: false }),

  resetToDefaults: () => {
    const { config, history } = get()
    set({
      config: DEFAULT_CONFIG,
      history: [...history, config].slice(-HISTORY_LIMIT),
      future: [],
      isDirty: true,
    })
  },
}))
