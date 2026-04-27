import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@/store/configStore'
import { useProjectStore } from '@/store/projectStore'
import { useUIStore } from '@/store/uiStore'
import { THEME_REGISTRY } from '@/data/themes/index'
import { EXAMPLE_SITES } from '@/data/examples'

const STORAGE_KEY = 'hey-bradley-project'

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
    <div className="group relative rounded-xl border border-[#e5e1dc] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[#A51C30]/30 hover:-translate-y-0.5">
      {/* Thumbnail strip */}
      <div className="h-20 bg-gradient-to-br from-[#faf8f5] to-[#f0ede8] flex items-center justify-center">
        <div className="text-[#A51C30]/20 font-mono text-3xl font-bold">{name.charAt(0).toUpperCase()}</div>
      </div>
      <div className="px-3.5 py-3">
        <div className="text-sm font-semibold text-[#1a1a1a] truncate">{name}</div>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#9ca3af]">
          <span>{sectionCount} sections</span>
          <span>&middot;</span>
          <span className="capitalize">{theme}</span>
        </div>
        <div className="text-[10px] text-[#9ca3af] mt-1">{ago}</div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={onOpen}
          className="px-4 py-1.5 rounded-lg bg-[#A51C30] text-white text-xs font-medium shadow-md hover:bg-[#8c1515] transition-colors"
        >
          Open
        </button>
      </div>
      {/* Delete */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 text-[#9ca3af] hover:text-[#f87171] hover:bg-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
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
      className="group rounded-xl border border-[#e5e1dc] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[#A51C30]/30 hover:-translate-y-0.5 text-left"
    >
      {/* Preview screenshot or palette fallback */}
      <div className="relative overflow-hidden bg-[#f0ede8] aspect-[16/10]">
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
        <div className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#A51C30] transition-colors truncate">{name}</div>
        <div className="text-xs text-[#6b7280] mt-0.5 line-clamp-2">{description}</div>
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Theme Card                                                         */
/* ------------------------------------------------------------------ */

function ThemeCard({ theme, onSelect }: { theme: ThemeJSON; onSelect: () => void }) {
  const meta = theme.meta
  const p = theme.theme.palette || {
    bgPrimary: '#0a0a1a',
    bgSecondary: '#111827',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    accentPrimary: '#6366f1',
    accentSecondary: '#818cf8',
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group rounded-xl border border-[#e5e1dc] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[#A51C30]/30 hover:-translate-y-0.5 text-left"
    >
      {/* Preview screenshot */}
      <div className="relative overflow-hidden bg-[#f0ede8]">
        <img
          src={`/previews/theme-${meta.slug}.png`}
          alt={`${meta.name} theme preview`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover object-top"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        {/* Palette dots overlay */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {[p.bgPrimary, p.accentPrimary, p.textPrimary].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="px-3.5 py-2.5">
        <div className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#A51C30] transition-colors">{meta.name}</div>
        <div className="text-[11px] text-[#9ca3af] mt-0.5">{meta.mood}</div>
      </div>
    </button>
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
        ? 'border-[#A51C30]/20 bg-white hover:shadow-md cursor-pointer'
        : 'border-dashed border-[#e5e1dc] bg-[#faf8f5]/50 opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${available ? 'text-[#1a1a1a]' : 'text-[#6b7280]'}`}>{title}</span>
            {!available && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#9ca3af] uppercase tracking-wider">Coming Soon</span>
            )}
          </div>
          <p className="text-xs text-[#9ca3af] mt-0.5">{description}</p>
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
        <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider group-hover:text-[#6b7280] transition-colors">
          Project Capabilities
        </h3>
        <svg
          className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <div className="flex-1 h-px bg-[#e5e1dc]" />
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
  const hasSavedProject = typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEY)
  const [activeTab, setActiveTab] = useState<'projects' | 'examples'>( projects.length > 0 ? 'projects' : 'examples')
  const [showMoreExamples, setShowMoreExamples] = useState(false)

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

  const handleThemeSelect = (slug: string) => {
    applyVibe(slug)
    // Persist to localStorage so useAutoSave doesn't overwrite on builder mount
    const config = useConfigStore.getState().config
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    navigate('/builder')
  }

  const handleExampleSelect = (example: typeof EXAMPLE_SITES[number]) => {
    loadConfig(example.config)
    // Persist to localStorage so useAutoSave doesn't overwrite on builder mount
    localStorage.setItem(STORAGE_KEY, JSON.stringify(example.config))
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
    navigate('/builder')
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#e5e1dc]">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#A51C30] flex items-center justify-center">
              <span className="text-white text-xs font-bold">HB</span>
            </div>
            <span className="font-semibold text-[#1a1a1a] text-sm tracking-tight">Hey Bradley</span>
          </div>
          <div className="flex items-center gap-3">
            {hasSavedProject && (
              <button
                onClick={handleContinue}
                className="text-xs text-[#6b7280] hover:text-[#A51C30] transition-colors font-medium"
              >
                Continue editing &rarr;
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">
            What will you build today?
          </h1>
          <p className="text-sm text-[#6b7280] mt-2 max-w-md mx-auto">
            Start from a theme, load an example, or open a saved project.
          </p>
          <button
            onClick={handleStartNew}
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#A51C30] text-white text-sm font-medium hover:bg-[#8c1515] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Start New Project
          </button>
        </div>

        {/* Getting Started 1-2-3 */}
        <div className="mb-8 bg-white rounded-2xl border border-[#e5e1dc] shadow-sm px-5 py-4">
          <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Getting Started</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#A51C30] text-sm font-bold">1</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[#1a1a1a]">Pick a theme or example</div>
                <div className="text-[11px] text-[#9ca3af] mt-0.5">Choose a visual starting point</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#A51C30] text-sm font-bold">2</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[#1a1a1a]">Customize sections</div>
                <div className="text-[11px] text-[#9ca3af] mt-0.5">Edit content, images, and colors</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#A51C30] text-sm font-bold">3</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[#1a1a1a]">Get your build plan</div>
                <div className="text-[11px] text-[#9ca3af] mt-0.5">Export professional website blueprints</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ===== LEFT PANEL: Projects & Examples ===== */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[#e5e1dc] shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-[#e5e1dc]">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'projects'
                      ? 'text-[#A51C30]'
                      : 'text-[#9ca3af] hover:text-[#6b7280]'
                  }`}
                >
                  Your Projects
                  {projects.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-[#A51C30]/10 text-[#A51C30] px-1.5 py-0.5 rounded-full font-medium">
                      {projects.length}
                    </span>
                  )}
                  {activeTab === 'projects' && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#A51C30] rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'examples'
                      ? 'text-[#A51C30]'
                      : 'text-[#9ca3af] hover:text-[#6b7280]'
                  }`}
                >
                  Examples
                  <span className="ml-1.5 text-[10px] bg-[#f3f4f6] text-[#9ca3af] px-1.5 py-0.5 rounded-full font-medium">
                    {EXAMPLE_SITES.length}
                  </span>
                  {activeTab === 'examples' && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#A51C30] rounded-full" />
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
                      <div className="w-16 h-16 rounded-2xl bg-[#faf8f5] flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-[#d1cbc3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-[#4b5563]">No saved projects yet</h3>
                      <p className="text-xs text-[#9ca3af] mt-1 max-w-[200px]">
                        Start building and save your work to see it here.
                      </p>
                      <button
                        onClick={() => setActiveTab('examples')}
                        className="mt-4 text-xs text-[#A51C30] font-medium hover:underline"
                      >
                        Browse examples instead &rarr;
                      </button>
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {EXAMPLE_SITES.map((example) => (
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
            </div>

            {/* Collapsible Project Capabilities */}
            <CollapsibleCapabilities />
          </div>

          {/* ===== RIGHT PANEL: Themes ===== */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#e5e1dc] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#e5e1dc] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#1a1a1a]">Choose a Theme</h2>
                  <p className="text-xs text-[#9ca3af] mt-0.5">Pick a visual style as your starting point</p>
                </div>
                <span className="text-[10px] font-medium text-[#9ca3af] bg-[#f3f4f6] px-2 py-1 rounded-full">
                  {(THEME_REGISTRY as unknown as ThemeJSON[]).length} themes
                </span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(THEME_REGISTRY as unknown as ThemeJSON[]).map((t) => (
                    <ThemeCard
                      key={t.meta.slug}
                      theme={t}
                      onSelect={() => handleThemeSelect(t.meta.slug)}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
