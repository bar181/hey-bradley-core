import { create } from 'zustand'

export type InteractionMode = 'LISTEN' | 'BUILD'
export type RightPanelTab = 'SIMPLE' | 'EXPERT'
export type ActiveTab = 'REALITY' | 'DATA' | 'XAI_DOCS' | 'WORKFLOW'

export type SelectedContext =
  | { type: 'theme' }
  | { type: 'section'; sectionId: string }
  | null

const THEME_DEFAULTS: Record<string, boolean> = { style: true }
const SECTION_DEFAULTS: Record<string, boolean> = { content: true }

interface UIStore {
  interactionMode: InteractionMode
  activeTab: ActiveTab
  rightPanelTab: RightPanelTab
  selectedContext: SelectedContext
  rightAccordions: Record<string, boolean>

  setInteractionMode: (mode: InteractionMode) => void
  setActiveTab: (tab: ActiveTab) => void
  setRightPanelTab: (tab: RightPanelTab) => void
  setSelectedContext: (ctx: SelectedContext) => void
  toggleRightAccordion: (id: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  interactionMode: 'BUILD',
  activeTab: 'REALITY',
  rightPanelTab: 'SIMPLE',
  selectedContext: { type: 'theme' },
  rightAccordions: { ...THEME_DEFAULTS },

  setInteractionMode: (mode) => set({ interactionMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setSelectedContext: (ctx) =>
    set({
      selectedContext: ctx,
      rightAccordions: ctx?.type === 'theme' ? { ...THEME_DEFAULTS } : { ...SECTION_DEFAULTS },
    }),
  toggleRightAccordion: (id) =>
    set((state) => ({
      rightAccordions: {
        ...state.rightAccordions,
        [id]: !state.rightAccordions[id],
      },
    })),
}))
