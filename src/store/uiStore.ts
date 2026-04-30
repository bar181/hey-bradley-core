import { create } from 'zustand'
import { kvGet, kvSet } from '@/contexts/persistence/repositories/kv'

export type InteractionMode = 'LISTEN' | 'BUILD'
export type RightPanelTab = 'SIMPLE' | 'EXPERT'
export type ActiveTab = 'REALITY' | 'DATA' | 'XAI_DOCS' | 'RESOURCES' | 'WORKFLOW' | 'CONVERSATION_LOG'

export type LeftPanelTab = 'builder' | 'chat' | 'listen'
export type PreviewWidth = 'full' | 'desktop' | 'tablet' | 'mobile'

export type SelectedContext =
  | { type: 'theme' }
  | { type: 'site-context' }
  | { type: 'section'; sectionId: string }
  | null

const THEME_DEFAULTS: Record<string, boolean> = { style: true }
const SECTION_DEFAULTS: Record<string, boolean> = { content: true }

/**
 * P37 Wave 1 (R2 S1) — directed-message envelope hardening.
 *
 * `pendingMessage` (added P37) is the directed-message form of the legacy
 * `pendingChatPrefill` field. The `target` discriminator makes the contract
 * explicit (currently `'chat'` only; future surfaces add their own variants).
 *
 * Inputs are clamped to MAX_PREFILL_LENGTH and rejected if they look like
 * a BYOK secret (mirrors aisp/assumptionStore.ts looksLikeSecret regexes).
 */
const MAX_PREFILL_LENGTH = 1024

/** Exposed for tests / consumers that need to know the cap. */
export const UI_STORE_LIMITS = {
  MAX_PREFILL_LENGTH,
} as const

/**
 * BYOK key shapes that MUST NOT round-trip through the prefill envelope.
 * Mirrors `aisp/assumptionStore.ts` looksLikeSecret patterns (ADR-043).
 */
const BYOK_KEY_SHAPES: readonly RegExp[] = [
  /sk-[a-zA-Z0-9_-]{20,}/, // Anthropic / OpenAI / OpenRouter
  /AIza[0-9A-Za-z_-]{35}/, // Google
  /ghp_[A-Za-z0-9]{36}/, // GitHub PAT
  /xox[abprs]-[A-Za-z0-9-]{10,}/, // Slack
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/, // JWT (3-segment)
  /Bearer\s+\S+/i, // P37 R2 L3 fix-pass — match redactKeyShapes coverage
]

function looksLikeSecret(s: string): boolean {
  return BYOK_KEY_SHAPES.some((re) => re.test(s))
}

/**
 * P37 R2 S4 — directed-message envelope. `target` makes the routing
 * intent explicit so multiple consumer surfaces (Builder composer, future
 * inline editors) can coexist without racing on a global string.
 */
export type PendingMessage = { target: 'chat'; text: string }

/**
 * P55 Sprint L (A2) — spec-panel auto-open persistence key. Once the spec
 * panel has auto-opened on a user's first patch in a project, we never
 * auto-open it again (D3: one-shot per session). Persisted across sessions
 * so reload doesn't re-pop the panel.
 */
const SPEC_PANEL_AUTO_OPENED_KEY = 'ui_spec_panel_auto_opened'

function loadSpecPanelAutoOpened(): boolean {
  try {
    return kvGet(SPEC_PANEL_AUTO_OPENED_KEY) === '1'
  } catch {
    return false
  }
}

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
   * P37 R2 S4 — directed-message envelope. Source of truth for the
   * Listen → ChatInput hand-off.
   */
  pendingMessage: PendingMessage | null
  /**
   * P36 Sprint F P1 — Pre-fill text for the chat input. Set by ListenTab's
   * "Edit" review action; consumed (and cleared) by ChatInput on mount.
   *
   * P37 R2 S4 — kept as a derived selector backed by `pendingMessage` so
   * existing subscribers (`useUIStore((s) => s.pendingChatPrefill)`) keep
   * working without consumer-side changes. Single source of truth is
   * `pendingMessage`; this field mirrors it when target === 'chat'.
   */
  pendingChatPrefill: string | null
  /**
   * P55 Sprint L (A2) — true once the spec panel has auto-opened in this
   * project. Persisted to kv['ui_spec_panel_auto_opened'] so reload doesn't
   * re-pop. One-shot per session per D3.
   */
  specPanelHasAutoOpened: boolean
  /**
   * P55 Sprint L (A2) — true when spec content changed since the user last
   * viewed the Blueprints (XAI_DOCS) tab. Cleared by markSpecSeen() when the
   * user clicks into XAI_DOCS.
   */
  specHasUnseenUpdate: boolean
  /**
   * P60.5 (post-defense quick win) — true once the AISP pipeline trace pane
   * has auto-expanded on the first bradley reply of this browser session.
   * In-memory only (no kv persistence) — a reload re-arms the one-shot.
   */
  aispTraceAutoOpened: boolean

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
  /**
   * P37 R2 S4 — directed-message setter. Clamps text + rejects BYOK shapes
   * + rejects non-string `text` defensively (sets envelope to null).
   */
  setPendingMessage: (msg: PendingMessage | null) => void
  /**
   * P36 — Push transcript to ChatInput for inline edit (ListenReviewCard "Edit").
   * P37 R2 S1 — clamps to MAX_PREFILL_LENGTH; refuses BYOK shape; refuses
   * non-string types (returns null). Thin wrapper over setPendingMessage.
   */
  setPendingChatPrefill: (text: string | null) => void
  /** P36 — Read + clear (single-shot consumer pattern). */
  consumePendingChatPrefill: () => string | null
  /** P55 Sprint L (A2) — flip the auto-opened flag (idempotent; persists). */
  markSpecAutoOpened: () => void
  /** P55 Sprint L (A2) — mark spec content as having unseen updates. */
  markSpecChanged: () => void
  /** P55 Sprint L (A2) — clear unseen-update indicator (called on tab click). */
  markSpecSeen: () => void
  /** P60.5 — flip the AISP-trace auto-opened flag (idempotent; in-memory). */
  markAispTraceAutoOpened: () => void
}

/**
 * P37 R2 S1 — sanitize pending-message text before it lands in the store.
 * Returns `null` when the input must be refused (non-string, secret-shape).
 * Otherwise clamps to MAX_PREFILL_LENGTH.
 */
function sanitizePendingText(text: unknown): string | null {
  if (typeof text !== 'string') return null
  if (looksLikeSecret(text)) return null
  return text.length > MAX_PREFILL_LENGTH ? text.slice(0, MAX_PREFILL_LENGTH) : text
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
  pendingMessage: null,
  pendingChatPrefill: null,
  // P55 Sprint L (A2) — hydrate auto-opened flag from kv on store init.
  // Falls back to false if kv unavailable (pre-DB boot).
  specPanelHasAutoOpened: loadSpecPanelAutoOpened(),
  specHasUnseenUpdate: false,
  aispTraceAutoOpened: false,
  markAispTraceAutoOpened: () => {
    if (get().aispTraceAutoOpened) return
    set({ aispTraceAutoOpened: true })
  },
  markSpecAutoOpened: () => {
    if (get().specPanelHasAutoOpened) return
    set({ specPanelHasAutoOpened: true })
    try { kvSet(SPEC_PANEL_AUTO_OPENED_KEY, '1') } catch { /* swallow */ }
  },
  markSpecChanged: () => {
    if (get().activeTab === 'XAI_DOCS') return
    set({ specHasUnseenUpdate: true })
  },
  markSpecSeen: () => {
    if (!get().specHasUnseenUpdate) return
    set({ specHasUnseenUpdate: false })
  },
  setPendingMessage: (msg) => {
    if (msg === null) {
      set({ pendingMessage: null, pendingChatPrefill: null })
      return
    }
    const safe = sanitizePendingText(msg.text)
    if (safe === null) {
      // Refused (non-string / secret shape) — clear the envelope.
      set({ pendingMessage: null, pendingChatPrefill: null })
      return
    }
    const next: PendingMessage = { target: msg.target, text: safe }
    set({
      pendingMessage: next,
      pendingChatPrefill: next.target === 'chat' ? next.text : null,
    })
  },
  setPendingChatPrefill: (text) => {
    if (text === null) {
      set({ pendingMessage: null, pendingChatPrefill: null })
      return
    }
    // Defer to setPendingMessage for sanitization + envelope wiring.
    get().setPendingMessage({ target: 'chat', text })
  },
  consumePendingChatPrefill: () => {
    const v = get().pendingChatPrefill
    if (v !== null) set({ pendingMessage: null, pendingChatPrefill: null })
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
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: tab,
      // P55 Sprint L (A2) — clicking into the spec tab clears the unseen badge.
      specHasUnseenUpdate: tab === 'XAI_DOCS' ? false : state.specHasUnseenUpdate,
    })),
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
