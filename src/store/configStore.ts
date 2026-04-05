import { create } from 'zustand'
import { deepMerge } from '@/lib/deepMerge'
import type { MasterConfig, Section, SectionType, PatchSource } from '@/lib/schemas'
import { useUIStore } from '@/store/uiStore'
import defaultConfig from '@/data/default-config.json'
import saas from '@/data/themes/saas.json'
import agency from '@/data/themes/agency.json'
import portfolio from '@/data/themes/portfolio.json'
import startup from '@/data/themes/startup.json'
import personal from '@/data/themes/personal.json'
import professional from '@/data/themes/professional.json'
import wellness from '@/data/themes/wellness.json'
import minimalist from '@/data/themes/minimalist.json'
import creative from '@/data/themes/creative.json'
import blog from '@/data/themes/blog.json'
import elegant from '@/data/themes/elegant.json'
import neon from '@/data/themes/neon.json'

const DEFAULT_CONFIG: MasterConfig = defaultConfig as unknown as MasterConfig

const THEMES: Record<string, Record<string, unknown>> = {
  saas: saas as unknown as Record<string, unknown>,
  agency: agency as unknown as Record<string, unknown>,
  portfolio: portfolio as unknown as Record<string, unknown>,
  startup: startup as unknown as Record<string, unknown>,
  personal: personal as unknown as Record<string, unknown>,
  professional: professional as unknown as Record<string, unknown>,
  wellness: wellness as unknown as Record<string, unknown>,
  minimalist: minimalist as unknown as Record<string, unknown>,
  creative: creative as unknown as Record<string, unknown>,
  blog: blog as unknown as Record<string, unknown>,
  elegant: elegant as unknown as Record<string, unknown>,
  neon: neon as unknown as Record<string, unknown>,
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
  duplicateSection: (sectionId: string) => void
  toggleSectionEnabled: (sectionId: string) => void

  applyVibe: (themeName: string) => void
  applyPalette: (paletteIndex: number) => void
  setPalette: (palette: { bgPrimary: string; bgSecondary: string; textPrimary: string; textSecondary: string; accentPrimary: string; accentSecondary: string }) => void
  applyFont: (fontFamily: string) => void
  toggleMode: () => void

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

    // Try to pull a template from the current theme's sections
    const themeName = config.theme?.preset ?? 'saas'
    const themeData = THEMES[themeName] as { sections?: Array<Record<string, unknown>> } | undefined
    const templateSection = (themeData?.sections as unknown as Section[] | undefined)
      ?.find((s) => s.type === type)

    // Fall back to SaaS theme if current theme doesn't have this section type
    const fallbackSection = templateSection
      ? undefined
      : ((THEMES.saas as { sections?: Array<Record<string, unknown>> })?.sections as unknown as Section[] | undefined)
          ?.find((s) => s.type === type)

    const source = templateSection ?? fallbackSection

    // Default gallery items with Unsplash images
    const defaultGalleryComponents = [
      { id: 'g1', type: 'image', enabled: true, order: 0, props: { imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&q=80', caption: 'Mountain Vista' } },
      { id: 'g2', type: 'image', enabled: true, order: 1, props: { imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&q=80', caption: 'Golden Sunrise' } },
      { id: 'g3', type: 'image', enabled: true, order: 2, props: { imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&q=80', caption: 'Forest Path' } },
      { id: 'g4', type: 'image', enabled: true, order: 3, props: { imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&auto=format&q=80', caption: 'Waterfall' } },
      { id: 'g5', type: 'image', enabled: true, order: 4, props: { imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&q=80', caption: 'Misty Valley' } },
      { id: 'g6', type: 'image', enabled: true, order: 5, props: { imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&q=80', caption: 'Sunlit Forest' } },
    ]

    // Default components for new section types
    const defaultImageComponents = [
      { id: 'image', type: 'image', enabled: true, order: 0, props: { imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&q=80', heading: 'Your Story', description: 'Tell your audience what makes you unique.' } },
    ]

    const defaultTextComponents = [
      { id: 'content', type: 'text-content', enabled: true, order: 0, props: { heading: 'About Us', body: 'Share your story here. This is a text block perfect for long-form content, blog posts, or about pages.', sidebar: 'Quick Facts\n\nFounded: 2024\nTeam: 12 people' } },
    ]

    const defaultLogosComponents = [
      { id: 'logo-1', type: 'logo', enabled: true, order: 0, props: { name: 'Acme Corp', imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=120&h=60&auto=format&q=80' } },
      { id: 'logo-2', type: 'logo', enabled: true, order: 1, props: { name: 'Globex Inc', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=120&h=60&auto=format&q=80' } },
      { id: 'logo-3', type: 'logo', enabled: true, order: 2, props: { name: 'Initech', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=120&h=60&auto=format&q=80' } },
      { id: 'logo-4', type: 'logo', enabled: true, order: 3, props: { name: 'Umbrella Co', imageUrl: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=120&h=60&auto=format&q=80' } },
      { id: 'logo-5', type: 'logo', enabled: true, order: 4, props: { name: 'Stark Industries', imageUrl: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=120&h=60&auto=format&q=80' } },
      { id: 'logo-6', type: 'logo', enabled: true, order: 5, props: { name: 'Wayne Enterprises', imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=120&h=60&auto=format&q=80' } },
    ]

    const defaultTeamComponents = [
      { id: 'member-1', type: 'team-member', enabled: true, order: 0, props: { name: 'Sarah Chen', role: 'CEO & Co-founder', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&q=80', description: 'Former VP of Engineering at Scale AI.' } },
      { id: 'member-2', type: 'team-member', enabled: true, order: 1, props: { name: 'Marcus Rivera', role: 'CTO', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&q=80', description: 'Ex-Google Staff Engineer.' } },
      { id: 'member-3', type: 'team-member', enabled: true, order: 2, props: { name: 'Aisha Patel', role: 'Head of Design', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&q=80', description: 'Previously led design at Figma.' } },
    ]

    const getDefaultComponents = () => {
      if (type === 'gallery') return defaultGalleryComponents
      if (type === 'image') return defaultImageComponents
      if (type === 'text') return defaultTextComponents
      if (type === 'logos') return defaultLogosComponents
      if (type === 'team') return defaultTeamComponents
      return []
    }

    const newSection: Section = source
      ? {
          ...JSON.parse(JSON.stringify(source)),
          id,
          enabled: true,
        }
      : {
          type,
          id,
          layout: { display: 'flex', gap: '24px', padding: '48px', columns: (type === 'gallery' || type === 'logos' || type === 'team') ? 3 : undefined },
          content: {},
          style: { background: config.theme.palette?.bgPrimary ?? '#1E1E1E', color: config.theme.palette?.textPrimary ?? '#F3F3F1' },
          enabled: true,
          components: getDefaultComponents(),
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

  duplicateSection: (sectionId) => {
    const { config, history } = get()
    const section = config.sections.find((s) => s.id === sectionId)
    if (!section) return
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const newId = `${section.type}-${crypto.randomUUID().slice(0, 8)}`
    const duplicated = { ...JSON.parse(JSON.stringify(section)), id: newId }
    const index = config.sections.findIndex((s) => s.id === sectionId)
    const sections = [...config.sections]
    sections.splice(index + 1, 0, duplicated)
    set({ config: { ...config, sections }, history: newHistory, future: [], isDirty: true })
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
    if (useUIStore.getState().designLocked) return
    const themeData = THEMES[themeName] as
      | { theme?: Record<string, unknown>; sections?: Array<{ type?: string; components?: Array<{ id?: string; type?: string; props?: Record<string, unknown> }> }> }
      | undefined
    if (!themeData) return
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)

    // FULL REPLACEMENT — not merge. Theme IS the new config.
    // Only preserve: site{} and text/url props from components.

    // Step 1: Extract user copy AND enabled state (text props from all, url only from buttons)
    // Image/video URLs are part of theme identity — NOT preserved on switch.
    const BUTTON_TYPES = new Set(['button'])
    const copyMap: Record<string, Record<string, { text?: string; url?: string }>> = {}
    const enabledMap: Record<string, boolean> = {}
    for (const section of config.sections) {
      enabledMap[section.type] = section.enabled
      copyMap[section.type] = {}
      for (const comp of section.components) {
        const preserved: { text?: string; url?: string } = {}
        if (typeof comp.props?.text === 'string') preserved.text = comp.props.text
        if (typeof comp.props?.url === 'string' && BUTTON_TYPES.has(comp.type)) preserved.url = comp.props.url
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
            // Preserve user's show/hide (enabled) state for matching section types
            enabled: templateSection.type in enabledMap ? enabledMap[templateSection.type] : templateSection.enabled,
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

  applyPalette: (paletteIndex: number) => {
    if (useUIStore.getState().designLocked) return
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const theme = config.theme as unknown as Record<string, unknown>
    const alts = (theme.alternativePalettes as Array<Record<string, unknown>>) || []
    const palette = paletteIndex === 0 ? theme.palette : alts[paletteIndex - 1]
    if (!palette) return
    const p = palette as Record<string, string>
    const newTheme = {
      ...config.theme,
      palette: { bgPrimary: p.bgPrimary, bgSecondary: p.bgSecondary, textPrimary: p.textPrimary, textSecondary: p.textSecondary, accentPrimary: p.accentPrimary, accentSecondary: p.accentSecondary },
    }
    const newSections = config.sections.map((s) => ({
      ...s,
      style: { ...s.style, background: s.style?.background?.includes('gradient') ? s.style.background : p.bgPrimary, color: p.textPrimary },
    }))
    set({ config: { ...config, theme: newTheme as typeof config.theme, sections: newSections } as MasterConfig, history: newHistory, future: [], isDirty: true })
  },

  setPalette: (palette) => {
    if (useUIStore.getState().designLocked) return
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const p = palette
    const newTheme = {
      ...config.theme,
      palette: { bgPrimary: p.bgPrimary, bgSecondary: p.bgSecondary, textPrimary: p.textPrimary, textSecondary: p.textSecondary, accentPrimary: p.accentPrimary, accentSecondary: p.accentSecondary },
    }
    const newSections = config.sections.map((s) => ({
      ...s,
      style: { ...s.style, background: s.style?.background?.includes('gradient') ? s.style.background : p.bgPrimary, color: p.textPrimary },
    }))
    set({ config: { ...config, theme: newTheme as typeof config.theme, sections: newSections } as MasterConfig, history: newHistory, future: [], isDirty: true })
  },

  applyFont: (fontFamily: string) => {
    if (useUIStore.getState().designLocked) return
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const newTheme = {
      ...config.theme,
      typography: { ...config.theme.typography, fontFamily, headingFamily: fontFamily },
    }
    const newSections = config.sections.map((s) => ({
      ...s,
      style: { ...s.style, fontFamily },
    }))
    set({ config: { ...config, theme: newTheme, sections: newSections } as MasterConfig, history: newHistory, future: [], isDirty: true })
  },

  toggleMode: () => {
    if (useUIStore.getState().designLocked) return
    const { config, history } = get()
    const newHistory = [...history, config].slice(-HISTORY_LIMIT)
    const newMode = config.theme.mode === 'dark' ? 'light' : 'dark'
    const theme = config.theme as Record<string, unknown>

    // Get the alternate palette
    const altPalette = theme.alternatePalette as Record<string, string> | undefined

    if (altPalette) {
      // Swap: current palette becomes alternatePalette, alt becomes palette
      const currentPalette = config.theme.palette
      const updates: Record<string, unknown> = {
        mode: newMode,
        palette: altPalette,
        alternatePalette: currentPalette,
      }

      // Update section styles to match new palette
      const newSections = config.sections.map((s) => ({
        ...s,
        style: {
          ...s.style,
          background: s.style?.background?.includes('gradient') ? s.style.background : altPalette.bgPrimary,
          color: altPalette.textPrimary,
        },
      }))

      set({
        config: {
          ...config,
          theme: { ...config.theme, ...updates } as typeof config.theme,
          sections: newSections,
        } as MasterConfig,
        history: newHistory,
        future: [],
        isDirty: true,
      })
    } else {
      // No alternate palette — just flip the mode flag
      set({
        config: { ...config, theme: { ...config.theme, mode: newMode } } as MasterConfig,
        history: newHistory,
        future: [],
        isDirty: true,
      })
    }

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
