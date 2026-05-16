/**
 * P126 / F4 — Specifications store. Single source of truth for the 6 on-demand
 * spec sections surfaced in the Agentics SpecsCard (North Star / AISP Spec /
 * Build Plan / Architecture / Features / Full Spec Bundle).
 *
 * Decision record: docs/adr/ADR-155-low-confidence-llm-response.md (sibling F4
 * card; ADR for SpecsCard itself folded into F4 retro).
 *
 * Live sections (JSON spec / Chat history / Site structure) are not tracked
 * here — they're always-fresh derivations the card reads directly from
 * `useConfigStore` + `useSessionLog`. Only the LLM-generated 6 carry state.
 *
 * Generation calls go through the live LLM adapter via `auditedComplete` so
 * every call lands in the audit ledger (llm_calls / llm_logs) AND flips the
 * F2b StatusBar SPECS ✓ flag. Each prompt asks for plain Markdown so the
 * response comes back as `{__raw: text}` per adapterUtils.safeJson; we
 * unwrap that into `entry.content`.
 *
 * Cross-refs:
 *   ADR-043 (BYOK trust boundary — no key in localStorage payload)
 *   ADR-126 (logging — auditedComplete owns the row)
 *   ADR-153 (F2b LLM health pill)
 *   ADR-154 (session log feed)
 */
import { create } from 'zustand'
import { useConfigStore } from '@/store/configStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useLLMHealthStore } from '@/store/llmHealthStore'
import { auditedComplete } from '@/contexts/intelligence/llm/auditedComplete'
import { appendSessionLog } from '@/contexts/intelligence/sessionLog'
import type { MasterConfig } from '@/lib/schemas'

export type SpecKind =
  | 'north_star'
  | 'aisp_spec'
  | 'build_plan'
  | 'architecture'
  | 'features'
  | 'full_spec_bundle'

export type SpecStatus = 'idle' | 'generating' | 'fresh' | 'stale' | 'error'

export interface SpecEntry {
  kind: SpecKind
  status: SpecStatus
  content: string | null
  generatedAt: number | null
  errorMsg?: string
}

export const SPEC_KINDS: readonly SpecKind[] = [
  'north_star',
  'aisp_spec',
  'build_plan',
  'architecture',
  'features',
  'full_spec_bundle',
] as const

export const SPEC_LABELS: Record<SpecKind, string> = {
  north_star: 'North Star',
  aisp_spec: 'AISP Spec',
  build_plan: 'Build Plan',
  architecture: 'Architecture',
  features: 'Features',
  full_spec_bundle: 'Full Spec Bundle',
}

const STORAGE_KEY = 'hey-bradley-specs-cache'
const STORAGE_VERSION = 1

interface SpecsState {
  specs: Record<SpecKind, SpecEntry>
  generateOne: (kind: SpecKind) => Promise<void>
  generateAll: () => Promise<void>
  markAllStale: () => void
}

function defaultEntry(kind: SpecKind): SpecEntry {
  return { kind, status: 'idle', content: null, generatedAt: null }
}

function defaultSpecs(): Record<SpecKind, SpecEntry> {
  return SPEC_KINDS.reduce(
    (acc, k) => ({ ...acc, [k]: defaultEntry(k) }),
    {} as Record<SpecKind, SpecEntry>,
  )
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function hydrateFromStorage(): Record<SpecKind, SpecEntry> {
  const base = defaultSpecs()
  if (!isBrowser()) return base
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as { version?: number; specs?: Partial<Record<SpecKind, SpecEntry>> }
    if (!parsed || parsed.version !== STORAGE_VERSION) return base
    const saved = parsed.specs ?? {}
    const merged = { ...base }
    for (const k of SPEC_KINDS) {
      const s = saved[k]
      if (
        s
        && typeof s === 'object'
        && (s.status === 'fresh' || s.status === 'stale' || s.status === 'error' || s.status === 'idle')
        && (typeof s.content === 'string' || s.content === null)
      ) {
        merged[k] = {
          kind: k,
          // 'generating' is never persisted (we hydrate from disk pre-init).
          status: s.status,
          content: s.content ?? null,
          generatedAt: typeof s.generatedAt === 'number' ? s.generatedAt : null,
          ...(typeof s.errorMsg === 'string' ? { errorMsg: s.errorMsg } : {}),
        }
      }
    }
    return merged
  } catch {
    return base
  }
}

function persistToStorage(specs: Record<SpecKind, SpecEntry>): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, specs }),
    )
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[specsStore] persist failed', e)
  }
}

function safeLog(summary: string, payload?: Record<string, unknown>): void {
  try {
    const entry: Parameters<typeof appendSessionLog>[0] = { eventType: 'llm_call_sent', summary }
    if (payload !== undefined) entry.payload = payload
    appendSessionLog(entry)
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[specsStore] log failed', e)
  }
}

function safeLogResponse(summary: string, payload?: Record<string, unknown>): void {
  try {
    const entry: Parameters<typeof appendSessionLog>[0] = { eventType: 'llm_response_received', summary }
    if (payload !== undefined) entry.payload = payload
    appendSessionLog(entry)
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[specsStore] log failed', e)
  }
}

/** Truncate config to a manageable size for the LLM prompt. */
function compactConfig(config: MasterConfig): string {
  const summary = {
    site: config.site,
    theme: {
      preset: config.theme?.preset,
      mode: config.theme?.mode,
      palette: config.theme?.palette,
      typography: config.theme?.typography,
    },
    pages: config.pages?.map((p) => ({ id: p.id, title: p.title, slug: p.slug, sectionCount: p.sections.length })),
    sections: config.sections.map((s) => ({ type: s.type, id: s.id, enabled: s.enabled, componentCount: s.components?.length ?? 0 })),
  }
  return JSON.stringify(summary, null, 2)
}

function buildPrompt(kind: SpecKind, config: MasterConfig): { system: string; user: string } {
  const system =
    'You are a senior product engineer writing concise, handoff-ready specifications. Reply with plain Markdown only. No JSON, no code fences around the whole response. Be specific to the provided site spec — never invent unrelated features.'
  const compact = compactConfig(config)
  const pagesCount = config.pages?.length ?? 0
  const sectionsCount = (config.sections ?? []).length
  switch (kind) {
    case 'north_star':
      return {
        system,
        user: `Summarize this site's North Star in 3 short paragraphs covering audience, promise, and the single most important outcome. Under 200 words total.\n\nSite spec:\n\`\`\`\n${compact}\n\`\`\``,
      }
    case 'aisp_spec':
      return {
        system,
        user: `Generate an AISP-shaped spec for this site. Use the five Crystal atoms (Ω intent, Σ state, Γ transitions, Λ context, Ε evidence) as section headers. Keep each atom under 40 words. Reference concrete fields from the spec (theme, sections, pages).\n\nSite spec (theme + structure):\n\`\`\`\n${compact}\n\`\`\``,
      }
    case 'build_plan':
      return {
        system,
        user: `Outline a 5-step build plan for this site. Each step: phase name, owner archetype, key deliverable, and definition-of-done bullet. Site has ${pagesCount} page(s) and ${sectionsCount} top-level section(s). Under 250 words.\n\nSite spec:\n\`\`\`\n${compact}\n\`\`\``,
      }
    case 'architecture':
      return {
        system,
        user: `Describe the technical architecture this site implies: hosting model, data flow, key components, persistence boundaries, security considerations. Under 250 words. Bullet headers welcome.\n\nSite spec:\n\`\`\`\n${compact}\n\`\`\``,
      }
    case 'features':
      return {
        system,
        user: `List the user-facing features this site delivers. Group by audience (visitor / owner / admin). One line per feature; concise verb phrases. Cap at 20 features.\n\nSite spec:\n\`\`\`\n${compact}\n\`\`\``,
      }
    case 'full_spec_bundle':
      return {
        system,
        user: `Produce a one-page handoff-ready spec bundle. Sections (## headings): North Star, AISP Atoms, Build Plan, Architecture, Features. Each section 3-6 lines. Total under 500 words.\n\nSite spec:\n\`\`\`\n${compact}\n\`\`\``,
      }
  }
}

/** Pull plain text out of `safeJson`'s `{__raw: text}` envelope OR a JSON-shaped envelope. */
function extractText(json: unknown): string {
  if (json && typeof json === 'object' && '__raw' in json) {
    const raw = (json as { __raw: unknown }).__raw
    if (typeof raw === 'string') return raw.trim()
  }
  if (typeof json === 'string') return json.trim()
  try {
    return JSON.stringify(json, null, 2)
  } catch {
    return String(json)
  }
}

type SpecsStoreApi = {
  getState: () => SpecsState
  setState: (partial: Partial<SpecsState>) => void
}
let storeRef: SpecsStoreApi | null = null
let configSubscribed = false

export const useSpecsStore = create<SpecsState>((set, get) => {
  const initial = hydrateFromStorage()
  // First-render side effects: subscribe to configStore once, recompute the
  // intelligenceStore aggregate freshness flag.
  if (!configSubscribed && typeof window !== 'undefined') {
    configSubscribed = true
    let prevConfig = useConfigStore.getState().config
    useConfigStore.subscribe((s) => {
      if (s.config !== prevConfig) {
        prevConfig = s.config
        try {
          storeRef?.getState().markAllStale()
        } catch (e) {
          if (import.meta.env.DEV) console.warn('[specsStore] markAllStale on config change failed', e)
        }
      }
    })
    // Hydrated entries determine the initial aggregate flag.
    queueMicrotask(() => {
      try {
        const anyOnDemand = SPEC_KINDS.some((k) => initial[k].status === 'fresh')
        const allFresh = SPEC_KINDS.every((k) => initial[k].status === 'fresh')
        useIntelligenceStore.getState().setSpecsFresh(!anyOnDemand || allFresh)
      } catch { /* boot-time only */ }
    })
  }

  return {
    specs: initial,

    generateOne: async (kind) => {
      const adapter = useIntelligenceStore.getState().adapter
      if (!adapter) {
        set((s) => ({
          specs: {
            ...s.specs,
            [kind]: { ...s.specs[kind], status: 'error', errorMsg: 'No LLM adapter — connect a BYOK key first.' },
          },
        }))
        return
      }
      set((s) => ({
        specs: {
          ...s.specs,
          [kind]: { ...s.specs[kind], status: 'generating', errorMsg: undefined },
        },
      }))
      const config = useConfigStore.getState().config
      const { system, user } = buildPrompt(kind, config)
      safeLog(`Spec generation: ${SPEC_LABELS[kind]}`, { kind, promptChars: user.length })
      try {
        const res = await auditedComplete(adapter, { systemPrompt: system, userPrompt: user }, { source: 'test' })
        if (!res.ok) {
          useLLMHealthStore.getState().setLLMHealth('error')
          const msg = res.error.kind === 'cost_cap'
            ? 'Cost cap reached'
            : res.error.kind === 'rate_limit'
              ? 'Rate limited'
              : res.error.kind === 'timeout'
                ? 'Timed out'
                : res.error.kind === 'no_key'
                  ? 'No LLM key'
                  : res.error.kind
          set((s) => ({
            specs: {
              ...s.specs,
              [kind]: { ...s.specs[kind], status: 'error', errorMsg: msg },
            },
          }))
          safeLogResponse(`Spec generation failed: ${SPEC_LABELS[kind]}`, { kind, errorKind: res.error.kind })
          persistToStorage(get().specs)
          recomputeAggregateFreshness(get().specs)
          return
        }
        const text = extractText(res.json)
        useLLMHealthStore.getState().setLLMHealth('ok')
        set((s) => ({
          specs: {
            ...s.specs,
            [kind]: { kind, status: 'fresh', content: text, generatedAt: Date.now() },
          },
        }))
        safeLogResponse(`Spec generated: ${SPEC_LABELS[kind]}`, { kind, chars: text.length })
        persistToStorage(get().specs)
        recomputeAggregateFreshness(get().specs)
      } catch (e) {
        useLLMHealthStore.getState().setLLMHealth('error')
        const msg = e instanceof Error ? e.message : String(e)
        set((s) => ({
          specs: {
            ...s.specs,
            [kind]: { ...s.specs[kind], status: 'error', errorMsg: msg },
          },
        }))
        safeLogResponse(`Spec generation threw: ${SPEC_LABELS[kind]}`, { kind, error: msg })
        persistToStorage(get().specs)
        recomputeAggregateFreshness(get().specs)
      }
    },

    generateAll: async () => {
      // Sequential — cost predictability. The UI updates between calls via zustand subscription.
      for (const k of SPEC_KINDS) {
        await get().generateOne(k)
      }
    },

    markAllStale: () => {
      set((s) => {
        const next = { ...s.specs }
        let changed = false
        for (const k of SPEC_KINDS) {
          if (next[k].status === 'fresh') {
            next[k] = { ...next[k], status: 'stale' }
            changed = true
          }
        }
        if (!changed) return s
        persistToStorage(next)
        try {
          useIntelligenceStore.getState().setSpecsFresh(false)
        } catch { /* defensive */ }
        return { specs: next }
      })
    },
  }
})

storeRef = {
  getState: () => useSpecsStore.getState(),
  setState: (partial) => useSpecsStore.setState(partial),
}

/** Set the aggregate F2b flag based on the current on-demand entries. */
function recomputeAggregateFreshness(specs: Record<SpecKind, SpecEntry>): void {
  const anyTouched = SPEC_KINDS.some((k) => specs[k].status !== 'idle')
  const allFresh = SPEC_KINDS.every((k) => specs[k].status === 'fresh')
  try {
    // Idle (untouched) tree = "in sync" (nothing to be stale yet). After any
    // generate attempt, only `all fresh` counts as fresh.
    useIntelligenceStore.getState().setSpecsFresh(!anyTouched || allFresh)
  } catch { /* defensive */ }
}

// Dev-only window exposure for Playwright/E2E
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as unknown as { __specsStore?: typeof useSpecsStore }).__specsStore = useSpecsStore
}
