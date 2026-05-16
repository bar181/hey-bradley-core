import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@/store/configStore'
import { useProjectStore } from '@/store/projectStore'
import { useUIStore } from '@/store/uiStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { THEME_REGISTRY } from '@/data/themes/index'
import { EXAMPLE_SITES } from '@/data/examples'
// P122 / W2 — 4-card template picker assets.
// Hey Bradley = the (rewritten) default-config; Portfolio = NEW JSON;
// Kitchen Sink + swarm-pick (Hazel & Birch wedding planner) reuse existing
// EXAMPLE_SITES. See plans/hitl/phase-122/session-log.md for swarm-pick rationale.
import heyBradleyDefault from '@/data/default-config.json'
import portfolioClean from '@/data/examples/portfolio-clean.json'
import type { MasterConfig } from '@/lib/schemas'
// Sprint J P50 (A5) — first-run personality step. Reuses A4's picker; the
// import target lands when A4 seals. If the file is missing at tsc time the
// build will surface a clear missing-module error pointing at A4 deliverable.
import { PersonalityPicker } from '@/components/settings/PersonalityPicker'
import { kvGet, kvSet, getPersonalityId } from '@/contexts/persistence/repositories/kv'
// P66 / Polish Sprint (A4) — mode-selector first-run step (per ADR-088).
// Renders ahead of personality picker for users who haven't picked a mode yet.
import { ModeSelectorCard, type ModeId } from '@/components/onboarding/ModeSelectorCard'

const STORAGE_KEY = 'hey-bradley-project'
const LLM_BANNER_DISMISSED_KEY = 'hb-onboarding-llm-banner-dismissed'
const ONBOARDING_PERSONALITY_ASKED_KEY = 'onboarding_personality_asked'
// P66 / Polish Sprint (A4) — per-session dismissal for the mode-aware
// suggested-prompt hint banner (one banner key per mode so each mode can be
// dismissed independently without nuking the others).
const MODE_HINT_DISMISSED_KEY_PREFIX = 'hb-onboarding-mode-hint-dismissed-'

/** Suggested-prompt hint copy per mode. Shown above the project picker
 *  once the user has selected a mode and lands on a fresh project state. */
const MODE_HINT_COPY: Record<ModeId, string> = {
  whiteboard: "Try: 'create a landing page for a coffee roaster'",
  planning: "Planning mode is live — open /planning to map a project.",
  agentics: "Agentics mode is live — open /agentics for the spec workbench.",
}

/** Map example names to preview screenshot filenames */
const EXAMPLE_PREVIEW_SLUGS: Record<string, string> = {
  'Sweet Spot Bakery': 'bakery',
  'LaunchPad AI': 'launchpad',
  'Sarah Chen Photography': 'photography',
  'GreenLeaf Consulting': 'consulting',
  'FitForge Fitness': 'fitforge',
  'Bloom & Petal': 'florist',
  'The Corner Table': 'restaurant',
  'CodeCraft Academy': 'education',
  'Kitchen Sink Demo': 'kitchen-sink',
  'Blank Canvas': 'blank',
  'The Daily Scoop': 'fun-blog',
  'Alex Chen — Dev Portfolio': 'dev-portfolio',
  'CloudSync Enterprise': 'enterprise-saas',
  'Summit Realty Group': 'real-estate',
  'Barrett & Associates': 'law-firm',
  'Hey Bradley — Capstone': 'capstone',
}

interface ThemeMeta {
  name: string
  slug: string
  description: string
  tags: string[]
  mood: string
  heroVariant: string
}

interface ThemeJSON {
  meta: ThemeMeta
  theme: {
    preset: string
    mode: string
    palette?: {
      bgPrimary: string
      bgSecondary: string
      textPrimary: string
      textSecondary: string
      accentPrimary: string
      accentSecondary: string
    }
    typography: { fontFamily: string }
  }
  sections: Array<{
    type: string
    variant?: string
    style?: { background?: string }
  }>
}

/* ------------------------------------------------------------------ */
/*  Saved Project Card                                                 */
/* ------------------------------------------------------------------ */

function ProjectCard({
  name,
  savedAt,
  sectionCount,
  theme,
  onOpen,
  onDelete,
}: {
  name: string
  savedAt: string
  sectionCount: number
  theme: string
  onOpen: () => void
  onDelete: () => void
}) {
  const date = new Date(savedAt)
  const ago = formatTimeAgo(date)

  return (
    <div className="group relative rounded-xl border border-[var(--hb-mkt-border)] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[rgb(var(--hb-accent-rgb)/0.3)] hover:-translate-y-0.5">
      {/* Thumbnail strip */}
      <div className="h-20 bg-gradient-to-br from-[var(--hb-paper)] to-[var(--hb-paper-tile)] flex items-center justify-center">
        <div className="text-[rgb(var(--hb-accent-rgb)/0.2)] font-mono text-3xl font-bold">{name.charAt(0).toUpperCase()}</div>
      </div>
      <div className="px-3.5 py-3">
        <div className="text-sm font-semibold text-[var(--hb-mkt-text)] truncate">{name}</div>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--hb-mkt-text-faint)]">
          <span>{sectionCount} sections</span>
          <span>&middot;</span>
          <span className="capitalize">{theme}</span>
        </div>
        <div className="text-[10px] text-[var(--hb-mkt-text-faint)] mt-1">{ago}</div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={onOpen}
          className="px-4 py-1.5 rounded-lg bg-[var(--hb-accent)] text-white text-xs font-medium shadow-md hover:bg-[var(--hb-crimson-deep)] transition-colors"
        >
          Open
        </button>
      </div>
      {/* Delete */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 text-[var(--hb-mkt-text-faint)] hover:text-[var(--hb-mkt-danger)] hover:bg-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
        title="Delete project"
      >
        &times;
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Example Card                                                       */
/* ------------------------------------------------------------------ */

function ExampleCard({
  name,
  slug,
  description,
  theme,
  palette,
  sectionCount,
  onSelect,
  referenceTag,
}: {
  name: string
  slug: string
  description: string
  theme: string
  palette: { bg: string; accent: string; text: string }
  sectionCount: number
  onSelect: () => void
  referenceTag?: boolean
}) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group rounded-xl border border-[var(--hb-mkt-border)] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[rgb(var(--hb-accent-rgb)/0.3)] hover:-translate-y-0.5 text-left"
    >
      {/* Preview screenshot or palette fallback */}
      <div className="relative overflow-hidden bg-[var(--hb-paper-tile)] aspect-[16/10]">
        {!imgFailed ? (
          <img
            src={`/previews/example-${slug}.png`}
            alt={`${name} preview`}
            loading="lazy"
            className="w-full h-full object-cover object-top"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${palette.bg} 0%, ${palette.accent}33 100%)` }}
          >
            <div className="flex gap-1.5">
              {[palette.accent, palette.text, palette.bg].map((c, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-white/40 shadow-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium opacity-70" style={{ color: palette.text }}>
              {sectionCount} sections
            </span>
          </div>
        )}
        {/* Palette dots overlay (on image) */}
        {!imgFailed && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {[palette.accent, palette.text, palette.bg].map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border border-white/30 shadow-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
        <div className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white">
          {theme}
        </div>
      </div>
      <div className="px-3.5 py-3">
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-semibold text-[var(--hb-mkt-text)] group-hover:text-[var(--hb-accent)] transition-colors truncate">{name}</div>
          {referenceTag && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--hb-mkt-chip-bg)] text-[var(--hb-mkt-text-muted)] uppercase tracking-wider flex-shrink-0">
              Reference
            </span>
          )}
        </div>
        <div className="text-xs text-[var(--hb-mkt-text-muted)] mt-0.5 line-clamp-2">{description}</div>
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Theme Card — REMOVED at P122 / W2.                                */
/*  The 12-theme grid was replaced by the 4-card TemplatePicker        */
/*  defined below. Theme browsing remains reachable via the Examples   */
/*  tab in the left panel; see plans/hitl/phase-122/preflight.md §4-B. */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Template Picker (P122 / W2)                                       */
/* ------------------------------------------------------------------ */

interface TemplateOption {
  id: string
  name: string
  description: string
  config: MasterConfig
  /** Visual mock for the card thumb — gradient + dots. No real images. */
  thumb: {
    bg: string
    accent: string
    text: string
    label: string
  }
}

/**
 * Resolves the 4 template options in display order. The "swarm-pick" slot
 * looks up Hazel & Birch (P116/B1 wedding-planner) from EXAMPLE_SITES at
 * render-time so the picker stays decoupled from import order; if the entry
 * is renamed or removed, we fall back to the next-best non-SaaS demo.
 */
function getTemplateOptions(): TemplateOption[] {
  const kitchenSink = EXAMPLE_SITES.find((e) => e.name === 'Kitchen Sink Demo')
  const swarmPick =
    EXAMPLE_SITES.find((e) => e.name === 'Hazel & Birch · Wedding Planning') ??
    EXAMPLE_SITES.find((e) => e.name === 'North Light — Wes Anderson Agency') ??
    EXAMPLE_SITES[0]

  return [
    {
      id: 'hey-bradley',
      name: 'Hey Bradley',
      description: "The builder's own site — dark theme, crimson accent, four sections.",
      config: heyBradleyDefault as unknown as MasterConfig,
      thumb: {
        bg: '#0f0f10',
        accent: '#A51C30',
        text: '#f5f5f4',
        label: 'Dark · Crimson',
      },
    },
    {
      id: 'kitchen-sink',
      name: 'Kitchen Sink',
      description: 'Every section type — use this to explore all capabilities.',
      config: (kitchenSink?.config ?? (heyBradleyDefault as unknown as MasterConfig)) as MasterConfig,
      thumb: {
        bg: '#1e293b',
        accent: '#6366f1',
        text: '#f8fafc',
        label: 'Reference',
      },
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Clean personal site for creatives, designers, and founders.',
      config: portfolioClean as unknown as MasterConfig,
      thumb: {
        bg: '#faf8f3',
        accent: '#8a6a3f',
        text: '#2d1f12',
        label: 'Light · Serif',
      },
    },
    {
      id: 'swarm-pick',
      name: swarmPick?.name ?? 'Editor Pick',
      description:
        swarmPick?.description ??
        'A polished demo from the Hey Bradley template library.',
      config: (swarmPick?.config ?? (heyBradleyDefault as unknown as MasterConfig)) as MasterConfig,
      thumb: {
        bg: '#f6f1e7',
        accent: '#7a8b6a',
        text: '#2c2a25',
        label: 'Editor pick',
      },
    },
  ]
}

function TemplateCard({
  option,
  selected,
  onSelect,
}: {
  option: TemplateOption
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      data-testid={`template-card-${option.id}`}
      className={`group rounded-xl border bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 text-left flex flex-col ${
        selected
          ? 'border-[var(--hb-accent)] ring-2 ring-[rgb(var(--hb-accent-rgb)/0.25)] shadow-md'
          : 'border-[var(--hb-mkt-border)] hover:border-[rgb(var(--hb-accent-rgb)/0.3)]'
      }`}
    >
      {/* Preview thumb — pure CSS mock, no real images required. */}
      <div
        className="relative aspect-[16/10] flex flex-col items-center justify-center gap-3"
        style={{
          background: `linear-gradient(135deg, ${option.thumb.bg} 0%, ${option.thumb.bg} 60%, ${option.thumb.accent}33 100%)`,
        }}
        aria-hidden="true"
      >
        <div
          className="w-2/3 h-2 rounded-full opacity-90"
          style={{ background: option.thumb.text }}
        />
        <div
          className="w-1/2 h-1.5 rounded-full opacity-60"
          style={{ background: option.thumb.text }}
        />
        <div className="flex gap-2 mt-1">
          <div
            className="w-12 h-3 rounded"
            style={{ background: option.thumb.accent }}
          />
          <div
            className="w-12 h-3 rounded border"
            style={{ borderColor: option.thumb.text, opacity: 0.5 }}
          />
        </div>
        {selected && (
          <span className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--hb-accent)] text-white shadow-sm">
            Selected
          </span>
        )}
        <span
          className="absolute bottom-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm"
          style={{
            background: `${option.thumb.bg}cc`,
            color: option.thumb.text,
            border: `1px solid ${option.thumb.text}33`,
          }}
        >
          {option.thumb.label}
        </span>
      </div>
      <div className="px-4 py-3 flex-1 flex flex-col">
        <div className="text-sm font-semibold text-[var(--hb-mkt-text)]">{option.name}</div>
        <div className="text-xs text-[var(--hb-mkt-text-muted)] mt-1 line-clamp-2 flex-1">
          {option.description}
        </div>
        <button
          type="button"
          onClick={onSelect}
          data-testid={`template-card-${option.id}-button`}
          className="mt-3 w-full px-3 py-2 rounded-lg bg-[var(--hb-accent)] text-white text-xs font-medium hover:bg-[var(--hb-crimson-deep)] transition-colors shadow-sm"
        >
          Use this template
        </button>
      </div>
    </div>
  )
}

function TemplatePicker({
  onSelect,
  defaultTemplateId,
}: {
  onSelect: (option: TemplateOption) => void
  defaultTemplateId: string
}) {
  const options = getTemplateOptions()
  const [selectedId, setSelectedId] = useState<string>(defaultTemplateId)

  return (
    <div
      className="bg-white rounded-2xl border border-[var(--hb-mkt-border)] shadow-sm overflow-hidden"
      data-testid="template-picker"
    >
      <div className="px-5 py-4 border-b border-[var(--hb-mkt-border)] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--hb-mkt-text)]">Pick a template</h2>
          <p className="text-xs text-[var(--hb-mkt-text-faint)] mt-0.5">
            Hey Bradley is selected by default — pick another to start somewhere else.
          </p>
        </div>
        <span className="text-[10px] font-medium text-[var(--hb-mkt-text-faint)] bg-[var(--hb-mkt-chip-bg)] px-2 py-1 rounded-full">
          4 templates
        </span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => (
            <TemplateCard
              key={opt.id}
              option={opt}
              selected={selectedId === opt.id}
              onSelect={() => {
                setSelectedId(opt.id)
                onSelect(opt)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Future Capability Card                                             */
/* ------------------------------------------------------------------ */

function FutureCapabilityCard({
  icon,
  title,
  description,
  available,
}: {
  icon: string
  title: string
  description: string
  available: boolean
}) {
  return (
    <div className={`rounded-xl border px-4 py-3.5 transition-all ${
      available
        ? 'border-[rgb(var(--hb-accent-rgb)/0.2)] bg-white hover:shadow-md cursor-pointer'
        : 'border-dashed border-[var(--hb-mkt-border)] bg-[rgb(var(--hb-paper-rgb)/0.5)] opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${available ? 'text-[var(--hb-mkt-text)]' : 'text-[var(--hb-mkt-text-muted)]'}`}>{title}</span>
            {!available && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--hb-mkt-chip-bg)] text-[var(--hb-mkt-text-faint)] uppercase tracking-wider">Coming Soon</span>
            )}
          </div>
          <p className="text-xs text-[var(--hb-mkt-text-faint)] mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Collapsible Project Capabilities                                   */
/* ------------------------------------------------------------------ */

function CollapsibleCapabilities() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-1 group"
      >
        <h3 className="text-xs font-semibold text-[var(--hb-mkt-text-faint)] uppercase tracking-wider group-hover:text-[var(--hb-mkt-text-muted)] transition-colors">
          Project Capabilities
        </h3>
        <svg
          className={`w-3.5 h-3.5 text-[var(--hb-mkt-text-faint)] transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <div className="flex-1 h-px bg-[var(--hb-mkt-border)]" />
      </button>
      {open && (
        <div className="space-y-2 mt-3">
          <FutureCapabilityCard
            icon="🎨"
            title="Brand Guidelines"
            description="Define logo, colors, typography, and voice for consistent output"
            available={true}
          />
          <FutureCapabilityCard
            icon="📐"
            title="Design Guidelines"
            description="Set spacing, layout rules, and component patterns"
            available={true}
          />
          <FutureCapabilityCard
            icon="📄"
            title="Spec Upload"
            description="Import AISP or JSON specs to generate from existing docs"
            available={false}
          />
          <FutureCapabilityCard
            icon="🔗"
            title="GitHub Connect"
            description="Link to a repo and sync generated specs with your codebase"
            available={false}
          />
          <FutureCapabilityCard
            icon="📦"
            title="Project History"
            description="Version tracking, changelogs, and rollback for saved projects"
            available={false}
          />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function getExamplePalette(config: { theme?: { palette?: { bgPrimary?: string; accentPrimary?: string; textPrimary?: string } } }) {
  const p = config.theme?.palette
  return {
    bg: p?.bgPrimary || '#0a0a1a',
    accent: p?.accentPrimary || '#6366f1',
    text: p?.textPrimary || '#f8fafc',
  }
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function Onboarding() {
  const navigate = useNavigate()
  const applyVibe = useConfigStore((s) => s.applyVibe)
  const loadConfig = useConfigStore((s) => s.loadConfig)
  const setSelectedContext = useUIStore((s) => s.setSelectedContext)
  const projects = useProjectStore((s) => s.projects)
  const loadProject = useProjectStore((s) => s.loadProject)
  const deleteProject = useProjectStore((s) => s.deleteProject)
  const saveProject = useProjectStore((s) => s.saveProject)
  const hasKey = useIntelligenceStore((s) => s.hasKey)
  const setPersonality = useIntelligenceStore((s) => s.setPersonality)

  // P66 / Polish Sprint (A4) — mode-selector first-run step. Reads the
  // persisted mode (kv['ui_app_mode']) via the store; null = first run, render
  // the 3-card selector ahead of personality. Returning users with a saved
  // mode skip this step entirely.
  const appMode = useUIStore((s) => s.appMode)
  const setAppMode = useUIStore((s) => s.setAppMode)

  // Sprint J P50 (A5) — first-run personality step. Fires only when the user
  // hasn't been asked yet (kv['onboarding_personality_asked'] !== '1') AND no
  // explicit personality has been persisted. The default 'professional' on
  // a fresh KV is treated as "not yet asked" per the brief.
  const [personalityAsked, setPersonalityAsked] = useState<boolean>(true)
  useEffect(() => {
    try {
      const asked = kvGet(ONBOARDING_PERSONALITY_ASKED_KEY) === '1'
      const persisted = getPersonalityId()
      setPersonalityAsked(asked || persisted !== null)
    } catch {
      // KV not ready (pre-init); skip the step rather than block onboarding.
      setPersonalityAsked(true)
    }
  }, [])
  const markPersonalityAsked = () => {
    try { kvSet(ONBOARDING_PERSONALITY_ASKED_KEY, '1') } catch { /* swallow */ }
    setPersonalityAsked(true)
  }
  const handleSkipPersonality = () => {
    setPersonality('professional')
    markPersonalityAsked()
  }
  const hasSavedProject = typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEY)
  const [activeTab, setActiveTab] = useState<'projects' | 'examples'>( projects.length > 0 ? 'projects' : 'examples')
  const [showMoreExamples, setShowMoreExamples] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(true)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setBannerDismissed(localStorage.getItem(LLM_BANNER_DISMISSED_KEY) === '1')
  }, [])
  const dismissBanner = () => {
    if (typeof window !== 'undefined') localStorage.setItem(LLM_BANNER_DISMISSED_KEY, '1')
    setBannerDismissed(true)
  }
  const showLLMBanner = !hasKey && !bannerDismissed

  // P66 / Polish Sprint (A4) — mode-aware suggested-prompt hint banner.
  // Shown once per mode (per-session, dismissable). Whiteboard renders a live
  // suggestion; Planning / Agentics render a "ships in v2" placeholder
  // (defensive — the ModeSelectorCard disables those buttons, but if a future
  // change exposes them we still render a coherent message rather than blank).
  const [modeHintDismissed, setModeHintDismissed] = useState<boolean>(true)
  useEffect(() => {
    if (typeof window === 'undefined' || !appMode) return
    const key = `${MODE_HINT_DISMISSED_KEY_PREFIX}${appMode}`
    setModeHintDismissed(localStorage.getItem(key) === '1')
  }, [appMode])
  const dismissModeHint = () => {
    if (typeof window !== 'undefined' && appMode) {
      localStorage.setItem(`${MODE_HINT_DISMISSED_KEY_PREFIX}${appMode}`, '1')
    }
    setModeHintDismissed(true)
  }
  const showModeHint = !!appMode && !modeHintDismissed && !hasSavedProject

  // Default 4 starter examples (Phase 15 DoD #11): blog → bakery → SaaS → kitchen-sink (reference)
  const DEFAULT_EXAMPLE_NAMES = [
    'Stories from the kitchen',     // blog-standard — canonical novice end-to-end demo
    'Sweet Spot Bakery',            // bakery
    'CloudSync Enterprise',         // enterprise-saas — cleanest SaaS in the catalog
    'Kitchen Sink Demo',            // kitchen-sink — developer-facing reference
  ] as const
  const defaultExamples = DEFAULT_EXAMPLE_NAMES
    .map((n) => EXAMPLE_SITES.find((e) => e.name === n))
    .filter((e): e is typeof EXAMPLE_SITES[number] => !!e)
  const moreExamples = EXAMPLE_SITES.filter(
    (e) => !DEFAULT_EXAMPLE_NAMES.includes(e.name as typeof DEFAULT_EXAMPLE_NAMES[number])
  )

  // P122 / W2 — handleThemeSelect REMOVED. Theme picker grid replaced by
  // TemplatePicker in the right panel. The 12-theme grid was its only caller;
  // keeping the handler would trip TS6133 (noUnusedLocals).

  // P122 / W2 — 4-card template picker handler. Mirrors handleExampleSelect:
  // load the selected MasterConfig into the store, persist a canonical project
  // row keyed on the template name, then navigate to /builder.
  const handleTemplateSelect = (option: TemplateOption) => {
    loadConfig(option.config)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(option.config))
    saveProject(option.name, option.config)
    const heroSection = option.config.sections?.find((s) => s.type === 'hero' && s.enabled)
    if (heroSection) {
      setSelectedContext({ type: 'section', sectionId: heroSection.id })
    }
    navigate('/builder')
  }

  const handleExampleSelect = (example: typeof EXAMPLE_SITES[number]) => {
    loadConfig(example.config)
    // Persist to localStorage so useAutoSave doesn't overwrite on builder mount
    localStorage.setItem(STORAGE_KEY, JSON.stringify(example.config))
    // P114 / A1 fix #1 — write canonical row keyed by example.name. Repeated
    // picks of the same example deterministically overwrite (closes G10 by
    // giving the example a stable slug instead of stomping a singleton).
    saveProject(example.name, example.config)
    const heroSection = example.config.sections.find((s) => s.type === 'hero' && s.enabled)
    if (heroSection) {
      setSelectedContext({ type: 'section', sectionId: heroSection.id })
    }
    navigate('/builder')
  }

  const handleOpenProject = (slug: string) => {
    const config = loadProject(slug)
    if (config) {
      loadConfig(config)
      navigate('/builder')
    }
  }

  const handleDeleteProject = (slug: string) => {
    deleteProject(slug)
  }

  const handleContinue = () => {
    navigate('/builder')
  }

  const handleStartNew = () => {
    applyVibe('saas')
    const config = useConfigStore.getState().config
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    // P114 / A1 fix #1 — write canonical row with a date-stamped name so
    // multiple "Start blank" picks accumulate as separate rows rather than
    // stomping a singleton. Pad month/day for stable lexicographic sort.
    const now = new Date()
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    saveProject(`Untitled ${stamp}`, config)
    navigate('/builder')
  }

  // P66 / Polish Sprint (A4) — mode-selector first-run step (per ADR-088).
  // Renders the 3-card ModeSelectorCard ahead of the personality picker on a
  // brand-new user (no appMode persisted AND no saved project). Returning
  // users with a saved project skip this entirely (they implicitly chose
  // Whiteboard pre-OC-2; the marketing site framing pre-dates ModeArch).
  if (appMode === null && !hasSavedProject) {
    return (
      <ModeSelectorCard
        hasProject={false}
        onSelectMode={(mode) => {
          // Persist mode → triggers re-render. Next render falls through to
          // either personality picker (if not asked) or the project picker.
          setAppMode(mode)
          // P90 / AW-MODE-ARCH (A3) — Planning + Agentics route to their stubs;
          // Whiteboard falls through to the existing personality / project picker
          // chain so the v1 onboarding flow is byte-equivalent for that mode.
          if (mode === 'planning') navigate('/planning')
          else if (mode === 'agentics') navigate('/agentics')
        }}
      />
    )
  }

  if (!personalityAsked) {
    return (
      <div
        className="min-h-screen bg-[var(--hb-paper)] flex items-center justify-center px-6 py-10"
        data-testid="onboarding-personality-step"
      >
        <div className="w-full max-w-xl bg-white rounded-2xl border border-[var(--hb-mkt-border)] shadow-sm px-6 py-7">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--hb-mkt-text)] tracking-tight text-center">
            How would you like me to talk to you?
          </h1>
          <p className="text-sm text-[var(--hb-mkt-text-muted)] mt-2 text-center">
            Pick a voice for Bradley. You can change this anytime in Settings.
          </p>
          <div className="mt-5">
            <PersonalityPicker />
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSkipPersonality}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--hb-mkt-text-muted)] hover:text-[var(--hb-accent)] transition-colors"
            >
              Skip — keep it professional
            </button>
            <button
              type="button"
              onClick={markPersonalityAsked}
              className="px-5 py-2 rounded-lg bg-[var(--hb-accent)] text-white text-sm font-medium hover:bg-[var(--hb-crimson-deep)] transition-colors shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--hb-paper)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[var(--hb-mkt-border)]">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--hb-accent)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">HB</span>
            </div>
            <span className="font-semibold text-[var(--hb-mkt-text)] text-sm tracking-tight">Hey Bradley</span>
          </div>
          <div className="flex items-center gap-3">
            {hasSavedProject && (
              <button
                onClick={handleContinue}
                className="text-xs text-[var(--hb-mkt-text-muted)] hover:text-[var(--hb-accent)] transition-colors font-medium"
              >
                Continue editing &rarr;
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {showLLMBanner && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[var(--hb-mkt-border)] bg-[var(--hb-paper)] px-4 py-2.5 text-xs text-[var(--hb-mkt-text-muted)]">
            <span>Using simulated responses — add an API key in Settings to enable real AI.</span>
            <button
              type="button"
              onClick={dismissBanner}
              className="text-[var(--hb-mkt-text-faint)] hover:text-[var(--hb-accent)] transition-colors px-2"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        )}
        {showModeHint && appMode && (
          <div
            className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[rgb(var(--hb-accent-rgb)/0.2)] bg-white px-4 py-2.5 text-xs text-[var(--hb-mkt-text-secondary)]"
            data-testid={`onboarding-mode-hint-${appMode}`}
          >
            <span>
              <span className="font-medium text-[var(--hb-accent)] uppercase tracking-wider text-[10px] mr-2">
                {appMode}
              </span>
              {MODE_HINT_COPY[appMode]}
            </span>
            <button
              type="button"
              onClick={dismissModeHint}
              className="text-[var(--hb-mkt-text-faint)] hover:text-[var(--hb-accent)] transition-colors px-2"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        )}
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--hb-mkt-text)] tracking-tight">
            What will you build today?
          </h1>
          <p className="text-sm text-[var(--hb-mkt-text-muted)] mt-2 max-w-md mx-auto">
            Start from a theme, load an example, or open a saved project.
          </p>
          <button
            onClick={handleStartNew}
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--hb-accent)] text-white text-sm font-medium hover:bg-[var(--hb-crimson-deep)] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Start New Project
          </button>
        </div>

        {/* Getting Started 1-2-3 */}
        <div className="mb-8 bg-white rounded-2xl border border-[var(--hb-mkt-border)] shadow-sm px-5 py-4">
          <h3 className="text-xs font-semibold text-[var(--hb-mkt-text-faint)] uppercase tracking-wider mb-3">Getting Started</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgb(var(--hb-accent-rgb)/0.1)] flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--hb-accent)] text-sm font-bold">1</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--hb-mkt-text)]">Pick a theme or example</div>
                <div className="text-[11px] text-[var(--hb-mkt-text-faint)] mt-0.5">Choose a visual starting point</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgb(var(--hb-accent-rgb)/0.1)] flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--hb-accent)] text-sm font-bold">2</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--hb-mkt-text)]">Customize sections</div>
                <div className="text-[11px] text-[var(--hb-mkt-text-faint)] mt-0.5">Edit content, images, and colors</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgb(var(--hb-accent-rgb)/0.1)] flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--hb-accent)] text-sm font-bold">3</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--hb-mkt-text)]">Get your build plan</div>
                <div className="text-[11px] text-[var(--hb-mkt-text-faint)] mt-0.5">Export professional website blueprints</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ===== LEFT PANEL: Projects & Examples ===== */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[var(--hb-mkt-border)] shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-[var(--hb-mkt-border)]">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'projects'
                      ? 'text-[var(--hb-accent)]'
                      : 'text-[var(--hb-mkt-text-faint)] hover:text-[var(--hb-mkt-text-muted)]'
                  }`}
                >
                  Your Projects
                  {projects.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-[rgb(var(--hb-accent-rgb)/0.1)] text-[var(--hb-accent)] px-1.5 py-0.5 rounded-full font-medium">
                      {projects.length}
                    </span>
                  )}
                  {activeTab === 'projects' && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--hb-accent)] rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'examples'
                      ? 'text-[var(--hb-accent)]'
                      : 'text-[var(--hb-mkt-text-faint)] hover:text-[var(--hb-mkt-text-muted)]'
                  }`}
                >
                  Examples
                  <span className="ml-1.5 text-[10px] bg-[var(--hb-mkt-chip-bg)] text-[var(--hb-mkt-text-faint)] px-1.5 py-0.5 rounded-full font-medium">
                    {EXAMPLE_SITES.length}
                  </span>
                  {activeTab === 'examples' && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--hb-accent)] rounded-full" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4" style={{ minHeight: '360px' }}>
                {activeTab === 'projects' ? (
                  projects.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {projects.map((p) => (
                        <ProjectCard
                          key={p.slug}
                          name={p.name}
                          savedAt={p.savedAt}
                          sectionCount={p.sectionCount}
                          theme={p.theme}
                          onOpen={() => handleOpenProject(p.slug)}
                          onDelete={() => handleDeleteProject(p.slug)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[var(--hb-paper)] flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-[var(--hb-mkt-thumb-icon)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-[var(--hb-mkt-text-secondary)]">No saved projects yet</h3>
                      <p className="text-xs text-[var(--hb-mkt-text-faint)] mt-1 max-w-[200px]">
                        Start building and save your work to see it here.
                      </p>
                      <button
                        onClick={() => setActiveTab('examples')}
                        className="mt-4 text-xs text-[var(--hb-accent)] font-medium hover:underline"
                      >
                        Browse examples instead &rarr;
                      </button>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {defaultExamples.map((example) => (
                        <ExampleCard
                          key={example.name}
                          name={example.name}
                          slug={EXAMPLE_PREVIEW_SLUGS[example.name] || 'blank'}
                          description={example.description}
                          theme={example.theme}
                          palette={getExamplePalette(example.config as { theme?: { palette?: { bgPrimary?: string; accentPrimary?: string; textPrimary?: string } } })}
                          sectionCount={example.config.sections?.length ?? 0}
                          onSelect={() => handleExampleSelect(example)}
                          referenceTag={example.name === 'Kitchen Sink Demo'}
                        />
                      ))}
                    </div>
                    {moreExamples.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowMoreExamples((v) => !v)}
                          className="flex items-center gap-2 w-full px-1 group"
                        >
                          <h3 className="text-xs font-semibold text-[var(--hb-mkt-text-faint)] uppercase tracking-wider group-hover:text-[var(--hb-mkt-text-muted)] transition-colors">
                            {showMoreExamples ? 'Hide' : 'More examples'}
                            <span className="ml-1.5 text-[10px] bg-[var(--hb-mkt-chip-bg)] text-[var(--hb-mkt-text-faint)] px-1.5 py-0.5 rounded-full font-medium normal-case tracking-normal">
                              {moreExamples.length}
                            </span>
                          </h3>
                          <svg
                            className={`w-3.5 h-3.5 text-[var(--hb-mkt-text-faint)] transition-transform ${showMoreExamples ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                          <div className="flex-1 h-px bg-[var(--hb-mkt-border)]" />
                        </button>
                        {showMoreExamples && (
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            {moreExamples.map((example) => (
                              <ExampleCard
                                key={example.name}
                                name={example.name}
                                slug={EXAMPLE_PREVIEW_SLUGS[example.name] || 'blank'}
                                description={example.description}
                                theme={example.theme}
                                palette={getExamplePalette(example.config as { theme?: { palette?: { bgPrimary?: string; accentPrimary?: string; textPrimary?: string } } })}
                                sectionCount={example.config.sections?.length ?? 0}
                                onSelect={() => handleExampleSelect(example)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Project Capabilities */}
            <CollapsibleCapabilities />
          </div>

          {/* ===== RIGHT PANEL: Templates (P122 / W2 — 4-card picker) ===== */}
          {/* Hey Bradley default-selected · Kitchen Sink · Portfolio · swarm-pick. */}
          {/* Replaces the prior 12-theme grid; theme browsing is reachable via */}
          {/* the Examples tab in the left panel + via Settings post-onboarding. */}
          <div className="lg:col-span-7">
            <TemplatePicker
              onSelect={handleTemplateSelect}
              defaultTemplateId="hey-bradley"
            />
            <p className="mt-3 text-[11px] text-[var(--hb-mkt-text-faint)] text-center">
              Looking for a specific aesthetic? Browse {(THEME_REGISTRY as unknown as ThemeJSON[]).length} themes
              on the <span className="font-medium">Examples</span> tab on the left.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
