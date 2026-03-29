import { create } from 'zustand'
import { deepMerge } from '@/lib/deepMerge'
import type { MasterConfig, Section, SectionType, PatchSource } from '@/lib/schemas'
import defaultConfig from '@/data/default-config.json'
import stripeFlow from '@/data/themes/stripe-flow.json'
import notionWarm from '@/data/themes/notion-warm.json'
import linearSharp from '@/data/themes/linear-sharp.json'
import loomFriendly from '@/data/themes/loom-friendly.json'
import vercelPrism from '@/data/themes/vercel-prism.json'
import naturCalm from '@/data/themes/nature-calm.json'
import studioBold from '@/data/themes/studio-bold.json'
import videoAmbient from '@/data/themes/video-ambient.json'
import pastelPlayful from '@/data/themes/pastel-playful.json'
import neonTerminal from '@/data/themes/neon-terminal.json'

const DEFAULT_CONFIG: MasterConfig = defaultConfig as unknown as MasterConfig

const THEMES: Record<string, Record<string, unknown>> = {
  'stripe-flow': stripeFlow as unknown as Record<string, unknown>,
  'notion-warm': notionWarm as unknown as Record<string, unknown>,
  'linear-sharp': linearSharp as unknown as Record<string, unknown>,
  'loom-friendly': loomFriendly as unknown as Record<string, unknown>,
  'vercel-prism': vercelPrism as unknown as Record<string, unknown>,
  'nature-calm': naturCalm as unknown as Record<string, unknown>,
  'studio-bold': studioBold as unknown as Record<string, unknown>,
  'video-ambient': videoAmbient as unknown as Record<string, unknown>,
  'pastel-playful': pastelPlayful as unknown as Record<string, unknown>,
  'neon-terminal': neonTerminal as unknown as Record<string, unknown>,
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

  applyVibe: (themeName: string) => void

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
      components: [],
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

  applyVibe: (themeName) => {
    const themeData = THEMES[themeName] as
      | { theme?: Record<string, unknown>; sections?: Array<{ type?: string; components?: Array<{ id?: string; type?: string; props?: Record<string, unknown> }> }> }
      | undefined
    if (!themeData) return
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)

    // FULL REPLACEMENT — not merge. Theme IS the new config.
    // Only preserve: site{} and text/url props from components.

    // Step 1: Extract copy (text + url props) from current config
    const copyMap: Record<string, Record<string, { text?: string; url?: string }>> = {}
    for (const section of config.sections) {
      copyMap[section.type] = {}
      for (const comp of section.components) {
        const preserved: { text?: string; url?: string } = {}
        if (typeof comp.props?.text === 'string') preserved.text = comp.props.text
        if (typeof comp.props?.url === 'string') preserved.url = comp.props.url
        if (Object.keys(preserved).length > 0) {
          copyMap[section.type][comp.id] = preserved
        }
      }
    }

    // Step 2: Build new config from theme template
    const newConfig = {
      ...config,
      theme: themeData.theme ? (themeData.theme as unknown as typeof config.theme) : config.theme,
      sections: themeData.sections
        ? (themeData.sections as unknown as Section[]).map((templateSection) => ({
            ...templateSection,
            // Inject preserved copy back into matching components
            components: (templateSection.components || []).map((comp) => {
              const sectionType = templateSection.type as string
              const compId = comp.id as string
              const savedCopy = copyMap[sectionType]?.[compId]
              if (!savedCopy) return comp
              return {
                ...comp,
                props: { ...(comp.props || {}), ...savedCopy },
              }
            }),
          }))
        : config.sections,
    }

    set({ config: newConfig as MasterConfig, history: newHistory, future: [], isDirty: true })
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
