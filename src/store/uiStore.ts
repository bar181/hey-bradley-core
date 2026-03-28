import { create } from 'zustand'

export type InteractionMode = 'LISTEN' | 'BUILD'
export type ComplexityMode = 'DRAFT' | 'EXPERT'
export type ActiveTab = 'REALITY' | 'DATA' | 'XAI_DOCS' | 'WORKFLOW'

interface UIStore {
  interactionMode: InteractionMode
  complexityMode: ComplexityMode
  activeTab: ActiveTab
  selectedSectionId: string | null

  setInteractionMode: (mode: InteractionMode) => void
  setComplexityMode: (mode: ComplexityMode) => void
  setActiveTab: (tab: ActiveTab) => void
  selectSection: (id: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  interactionMode: 'BUILD',
  complexityMode: 'DRAFT',
  activeTab: 'REALITY',
  selectedSectionId: null,

  setInteractionMode: (mode) => set({ interactionMode: mode }),
  setComplexityMode: (mode) => set({ complexityMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectSection: (id) => set({ selectedSectionId: id }),
}))
