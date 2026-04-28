import { create } from 'zustand'

export type InteractionMode = 'LISTEN' | 'BUILD'
export type RightPanelTab = 'SIMPLE' | 'EXPERT'
export type ActiveTab = 'REALITY' | 'DATA' | 'XAI_DOCS' | 'RESOURCES' | 'WORKFLOW'

export type LeftPanelTab = 'builder' | 'chat' | 'listen'
export type PreviewWidth = 'full' | 'desktop' | 'tablet' | 'mobile'

export type SelectedContext =
  | { type: 'theme' }
  | { type: 'site-context' }
  | { type: 'section'; sectionId: string }
  | null

const THEME_DEFAULTS: Record<string, boolean> = { style: true }
const SECTION_DEFAULTS: Record<string, boolean> = { content: true }

interface UIStore {
  interactionMode: InteractionMode
  activeTab: ActiveTab
  rightPanelTab: RightPanelTab
  leftPanelTab: LeftPanelTab
  selectedContext: SelectedContext
  rightAccordions: Record<string, boolean>
  previewWidth: PreviewWidth
  isPreviewMode: boolean
  leftPanelVisible: boolean
  rightPanelVisible: boolean
  designLocked: boolean
  brandLocked: boolean
  settingsDrawerOpen: boolean
  /**
   * P36 Sprint F P1 — Pre-fill text for the chat input. Set by ListenTab's
   * "Edit" review action; consumed (and cleared) by ChatInput on mount.
   */
  pendingChatPrefill: string | null

  setInteractionMode: (mode: InteractionMode) => void
  setActiveTab: (tab: ActiveTab) => void
  setRightPanelTab: (tab: RightPanelTab) => void
  setLeftPanelTab: (tab: LeftPanelTab) => void
  setSelectedContext: (ctx: SelectedContext) => void
  toggleRightAccordion: (id: string) => void
  setPreviewWidth: (width: PreviewWidth) => void
  setPreviewMode: (active: boolean) => void
  setLeftPanelVisible: (visible: boolean) => void
  setRightPanelVisible: (visible: boolean) => void
  toggleDesignLock: () => void
  toggleBrandLock: () => void
  setDesignLocked: (locked: boolean) => void
  setBrandLocked: (locked: boolean) => void
  toggleSettingsDrawer: () => void
  /** P36 — Push transcript to ChatInput for inline edit (ListenReviewCard "Edit"). */
  setPendingChatPrefill: (text: string | null) => void
  /** P36 — Read + clear (single-shot consumer pattern). */
  consumePendingChatPrefill: () => string | null
}

export const useUIStore = create<UIStore>((set, get) => ({
  interactionMode: 'BUILD',
  activeTab: 'REALITY',
  rightPanelTab: 'SIMPLE',
  leftPanelTab: 'builder',
  selectedContext: { type: 'theme' },
  rightAccordions: { ...THEME_DEFAULTS },
  previewWidth: 'full',
  isPreviewMode: false,
  leftPanelVisible: true,
  rightPanelVisible: true,
  designLocked: false,
  brandLocked: false,
  settingsDrawerOpen: false,
  pendingChatPrefill: null,
  setPendingChatPrefill: (text) => set({ pendingChatPrefill: text }),
  consumePendingChatPrefill: () => {
    const v = get().pendingChatPrefill
    if (v !== null) set({ pendingChatPrefill: null })
    return v
  },

  setInteractionMode: (mode) => set({ interactionMode: mode }),
  setPreviewWidth: (width) => set({ previewWidth: width }),
  setPreviewMode: (active) => set({ isPreviewMode: active }),
  setLeftPanelVisible: (visible) => set({ leftPanelVisible: visible }),
  setRightPanelVisible: (visible) => set({ rightPanelVisible: visible }),
  toggleDesignLock: () => set((state) => ({ designLocked: !state.designLocked })),
  toggleBrandLock: () => set((state) => ({ brandLocked: !state.brandLocked })),
  setDesignLocked: (locked) => set({ designLocked: locked }),
  setBrandLocked: (locked) => set({ brandLocked: locked }),
  toggleSettingsDrawer: () => set((state) => ({ settingsDrawerOpen: !state.settingsDrawerOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
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
