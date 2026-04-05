import { useState, useMemo } from 'react'
import { cn } from '../../lib/cn'
import { BookOpen, Code, Image, FileText, ChevronDown, ChevronRight, Search, ExternalLink } from 'lucide-react'
import { THEME_REGISTRY } from '@/data/themes'
import { EXAMPLE_SITES } from '@/data/examples'
import imagesData from '@/data/media/images.json'
import videosData from '@/data/media/videos.json'

// ---------------------------------------------------------------------------
// Sub-tab definitions
// ---------------------------------------------------------------------------

const SUB_TABS = [
  { id: 'templates', label: 'Templates & JSON', icon: Code },
  { id: 'aisp', label: 'AISP Guide', icon: BookOpen },
  { id: 'media', label: 'Media Library', icon: Image },
  { id: 'wiki', label: 'Wiki', icon: FileText },
] as const

type SubTabId = typeof SUB_TABS[number]['id']

// ---------------------------------------------------------------------------
// Section types from schema
// ---------------------------------------------------------------------------

const SECTION_TYPES = [
  { type: 'hero', description: 'Full-width hero banner with headline, subheading, and CTA' },
  { type: 'menu', description: 'Navigation menu or service/product listing' },
  { type: 'columns', description: 'Multi-column feature or content layout' },
  { type: 'pricing', description: 'Pricing tiers with feature comparison' },
  { type: 'action', description: 'Call-to-action block with button or form' },
  { type: 'footer', description: 'Site footer with links, social, and copyright' },
  { type: 'quotes', description: 'Testimonials or customer quotes carousel' },
  { type: 'questions', description: 'FAQ accordion with expandable answers' },
  { type: 'numbers', description: 'Statistics or metrics display with counters' },
  { type: 'gallery', description: 'Image or media gallery grid' },
  { type: 'logos', description: 'Partner or client logo strip' },
  { type: 'team', description: 'Team member cards with photos and roles' },
  { type: 'image', description: 'Full-width or contained image section' },
  { type: 'divider', description: 'Visual separator between sections' },
  { type: 'text', description: 'Rich text or markdown content block' },
]

// ---------------------------------------------------------------------------
// Expandable JSON viewer
// ---------------------------------------------------------------------------

function JsonViewer({ data, label }: { data: unknown; label: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-hb-accent hover:text-hb-accent/80 transition-colors cursor-pointer"
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {label}
      </button>
      {expanded && (
        <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-hb-bg p-3 text-xs text-hb-text-secondary border border-hb-border">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-tab: Templates & JSON
// ---------------------------------------------------------------------------

function TemplatesSubTab() {
  return (
    <div className="space-y-6">
      {/* Themes */}
      <div>
        <h3 className="text-sm font-semibold text-hb-text-primary mb-3">
          Themes ({THEME_REGISTRY.length})
        </h3>
        <div className="grid gap-2">
          {THEME_REGISTRY.map((theme) => (
            <div
              key={theme.meta.slug}
              className="rounded-lg border border-hb-border bg-hb-bg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-hb-text-primary">
                  {theme.meta.name}
                </span>
                <span className="text-xs text-hb-text-muted">
                  {theme.meta.slug}
                </span>
              </div>
              <p className="text-xs text-hb-text-muted mb-2">
                {theme.meta.description}
              </p>
              <div className="flex items-center gap-1 mb-2">
                {theme.meta.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-hb-surface px-2 py-0.5 text-[10px] text-hb-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <JsonViewer data={theme} label="View JSON" />
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div>
        <h3 className="text-sm font-semibold text-hb-text-primary mb-3">
          Example Sites ({EXAMPLE_SITES.length})
        </h3>
        <div className="grid gap-2">
          {EXAMPLE_SITES.map((example) => (
            <div
              key={example.name}
              className="rounded-lg border border-hb-border bg-hb-bg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-hb-text-primary">
                  {example.name}
                </span>
                <span className="text-xs text-hb-text-muted">
                  {example.theme}
                </span>
              </div>
              <p className="text-xs text-hb-text-muted mb-2">
                {example.description}
              </p>
              <JsonViewer data={example.config} label="View JSON" />
            </div>
          ))}
        </div>
      </div>

      {/* Section Types */}
      <div>
        <h3 className="text-sm font-semibold text-hb-text-primary mb-3">
          Section Types ({SECTION_TYPES.length})
        </h3>
        <div className="grid gap-2">
          {SECTION_TYPES.map((s) => (
            <div
              key={s.type}
              className="rounded-lg border border-hb-border bg-hb-bg p-3 flex items-start gap-3"
            >
              <code className="rounded bg-hb-surface px-2 py-0.5 text-xs font-mono text-hb-accent whitespace-nowrap">
                {s.type}
              </code>
              <span className="text-xs text-hb-text-muted">{s.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-tab: AISP Guide
// ---------------------------------------------------------------------------

function AISPGuideSubTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-hb-text-primary mb-1">
          AISP 5.1 Crystal Atom &mdash; Conversion Guide
        </h3>
        <p className="text-xs text-hb-text-muted mb-4">
          AI Symbolic Protocol: a math-first neural symbolic language with 512 symbols
          that all AI and LLMs understand natively without any instructions.
        </p>
      </div>

      {/* 5 Components */}
      <div>
        <h4 className="text-xs font-semibold text-hb-text-secondary mb-2 uppercase tracking-wider">
          The 5 Crystal Atom Components
        </h4>
        <div className="grid gap-2">
          {[
            { symbol: '\u03A9', name: 'Omega', color: 'text-purple-400', label: 'Objective', desc: 'What the site does, its purpose and goals' },
            { symbol: '\u03A3', name: 'Sigma', color: 'text-blue-400', label: 'Type System', desc: 'Data types, schemas, configurations, and structural definitions' },
            { symbol: '\u0393', name: 'Gamma', color: 'text-green-400', label: 'Rules', desc: 'Validation rules, constraints, business logic, and invariants' },
            { symbol: '\u039B', name: 'Lambda', color: 'text-orange-400', label: 'Bindings', desc: 'Concrete values, assignments, configurations, and parameters' },
            { symbol: '\u0395', name: 'Epsilon', color: 'text-red-400', label: 'Evidence', desc: 'Verification proofs, test assertions, and acceptance criteria' },
          ].map((c) => (
            <div key={c.symbol} className="rounded-lg border border-hb-border bg-hb-bg p-3 flex items-start gap-3">
              <span className={cn('text-lg font-bold', c.color)}>{c.symbol}</span>
              <div>
                <div className="text-sm font-medium text-hb-text-primary">
                  {c.name} &mdash; {c.label}
                </div>
                <p className="text-xs text-hb-text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Example */}
      <div>
        <h4 className="text-xs font-semibold text-hb-text-secondary mb-2 uppercase tracking-wider">
          Step-by-Step Conversion Example
        </h4>
        <div className="rounded-lg border border-hb-border bg-hb-bg p-4 space-y-3">
          <div>
            <span className="text-xs font-medium text-hb-text-secondary">1. Prose Input:</span>
            <p className="text-xs text-hb-text-muted mt-1 italic">
              &ldquo;Build a bakery website with a hero section showing fresh bread,
              a menu with prices, and a contact form. Use warm colors.&rdquo;
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-hb-text-secondary">2. Crystal Atom Output:</span>
            <pre className="mt-1 rounded-md bg-hb-surface-hover p-3 text-xs text-hb-text-secondary overflow-x-auto">
{`\u27E6 CrystalAtom v5.1 \u27E7
\u03A9 := bakery_website \u2227 warm_inviting_design
\u03A3 := {
  Site : \uD835\uDD4B := { title: \uD835\uDD4A, sections: [\uD835\uDD4B] },
  Section : \uD835\uDD4B := { type: hero | menu | action, ... }
}
\u0393 := {
  \u2200 section \u2208 sections : type \u2208 {hero, menu, action},
  hero.variant := "split",
  palette.mode := "light"
}
\u039B := {
  title := "Sweet Spot Bakery",
  hero.heading := "Freshly Baked, Daily",
  palette.bgPrimary := "#faf8f5"
}
\u0395 := {
  |sections| \u2265 3,
  \u2203 section : type = "hero",
  \u2203 section : type = "menu"
}
\u27E6 /CrystalAtom \u27E7`}
            </pre>
          </div>
        </div>
      </div>

      {/* Sigma 512 Reference */}
      <div>
        <h4 className="text-xs font-semibold text-hb-text-secondary mb-2 uppercase tracking-wider">
          {'\u03A3'}_512 Symbol Reference
        </h4>
        <p className="text-xs text-hb-text-muted mb-2">
          512 symbols across 8 categories, understood natively by all AI systems:
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { cat: '\u03A9:Transmuters', desc: 'Objective and transformation operators' },
            { cat: '\u0393:Topologics', desc: 'Structural and relational rules' },
            { cat: '\u2200:Quantifiers', desc: 'Universal and existential quantifiers' },
            { cat: '\u0394:Contractors', desc: 'Constraint and contraction operators' },
            { cat: '\uD835\uDD3B:Domaines', desc: 'Domain and type constructors' },
            { cat: '\u03A8:Intents', desc: 'Intent and purpose markers' },
            { cat: '\u27E6\u27E7:Delimiters', desc: 'Scope and boundary markers' },
            { cat: '\u2205:Reserved', desc: 'Reserved and null operators' },
          ].map((item) => (
            <div key={item.cat} className="rounded border border-hb-border bg-hb-bg px-2.5 py-1.5">
              <span className="text-xs font-mono font-medium text-hb-accent">{item.cat}</span>
              <p className="text-[10px] text-hb-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Link */}
      <div className="rounded-lg border border-hb-border bg-hb-bg p-3">
        <a
          href="https://github.com/bar181/aisp-open-core"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-hb-accent hover:text-hb-accent/80 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          github.com/bar181/aisp-open-core
        </a>
        <p className="text-xs text-hb-text-muted mt-1">
          Full AISP specification, examples, and tooling.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-tab: Media Library
// ---------------------------------------------------------------------------

function MediaLibrarySubTab() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const allCategories = useMemo(() => {
    const imgCats = (imagesData.categories ?? []) as string[]
    const vidCats = (videosData.categories ?? []) as string[]
    return [...new Set([...imgCats, ...vidCats])].sort()
  }, [])

  const filteredImages = useMemo(() => {
    const images = imagesData.images as Array<{
      id: string; thumbnail: string; category: string;
      tags: string[]; mood: string; description: string
    }>
    return images.filter((img) => {
      if (categoryFilter && img.category !== categoryFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        img.id.toLowerCase().includes(q) ||
        img.description?.toLowerCase().includes(q) ||
        img.tags?.some((t) => t.toLowerCase().includes(q)) ||
        img.mood?.toLowerCase().includes(q)
      )
    })
  }, [search, categoryFilter])

  const filteredVideos = useMemo(() => {
    const videos = videosData.videos as Array<{
      id: string; thumbnail: string; category: string;
      tags: string[]; mood: string; description: string
    }>
    return videos.filter((vid) => {
      if (categoryFilter && vid.category !== categoryFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        vid.id.toLowerCase().includes(q) ||
        vid.description?.toLowerCase().includes(q) ||
        vid.tags?.some((t) => t.toLowerCase().includes(q)) ||
        vid.mood?.toLowerCase().includes(q)
      )
    })
  }, [search, categoryFilter])

  return (
    <div className="space-y-4">
      {/* Counts */}
      <p className="text-xs text-hb-text-muted">
        {imagesData.total} images &bull; {videosData.total}+ videos
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-hb-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, tag, or mood..."
          className="w-full rounded-md border border-hb-border bg-hb-bg pl-8 pr-3 py-1.5 text-xs text-hb-text-primary placeholder:text-hb-text-muted focus:outline-none focus:ring-1 focus:ring-hb-accent"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setCategoryFilter(null)}
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors cursor-pointer',
            !categoryFilter
              ? 'bg-hb-accent text-white'
              : 'bg-hb-surface text-hb-text-muted hover:text-hb-text-secondary',
          )}
        >
          All
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors cursor-pointer capitalize',
              categoryFilter === cat
                ? 'bg-hb-accent text-white'
                : 'bg-hb-surface text-hb-text-muted hover:text-hb-text-secondary',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image grid */}
      {filteredImages.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-hb-text-secondary mb-2">
            Images ({filteredImages.length})
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {filteredImages.slice(0, 60).map((img) => (
              <div
                key={img.id}
                className="rounded-lg border border-hb-border bg-hb-bg overflow-hidden group"
              >
                <div className="aspect-video bg-hb-surface-hover relative">
                  <img
                    src={img.thumbnail}
                    alt={img.description}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-hb-text-muted truncate">{img.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="rounded-full bg-hb-surface px-1.5 py-0.5 text-[9px] text-hb-text-muted capitalize">
                      {img.category}
                    </span>
                    {img.mood && (
                      <span className="rounded-full bg-hb-surface px-1.5 py-0.5 text-[9px] text-hb-text-muted">
                        {img.mood}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredImages.length > 60 && (
            <p className="text-xs text-hb-text-muted text-center mt-2">
              Showing 60 of {filteredImages.length} images
            </p>
          )}
        </div>
      )}

      {/* Video grid */}
      {filteredVideos.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-hb-text-secondary mb-2">
            Videos ({filteredVideos.length})
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {filteredVideos.slice(0, 30).map((vid) => (
              <div
                key={vid.id}
                className="rounded-lg border border-hb-border bg-hb-bg overflow-hidden"
              >
                <div className="aspect-video bg-hb-surface-hover relative">
                  <img
                    src={vid.thumbnail}
                    alt={vid.description}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black/50 p-1.5">
                      <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-hb-text-muted truncate">{vid.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="rounded-full bg-hb-surface px-1.5 py-0.5 text-[9px] text-hb-text-muted capitalize">
                      {vid.category}
                    </span>
                    {vid.mood && (
                      <span className="rounded-full bg-hb-surface px-1.5 py-0.5 text-[9px] text-hb-text-muted">
                        {vid.mood}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredImages.length === 0 && filteredVideos.length === 0 && (
        <p className="text-xs text-hb-text-muted text-center py-8">
          No media found matching your search.
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-tab: Wiki
// ---------------------------------------------------------------------------

function WikiSubTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-hb-border bg-hb-bg p-6 text-center">
        <FileText className="h-8 w-8 text-hb-text-muted mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-hb-text-primary mb-1">
          Documentation wiki coming soon.
        </h3>
        <p className="text-xs text-hb-text-muted mb-3">
          For now, see the <code className="rounded bg-hb-surface px-1.5 py-0.5 text-[10px]">wiki/</code> folder in the repository.
        </p>
        <a
          href="https://github.com/bar181/hey-bradley-core"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-hb-accent hover:text-hb-accent/80 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View on GitHub
        </a>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main ResourcesTab
// ---------------------------------------------------------------------------

export function ResourcesTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('templates')

  return (
    <div className="space-y-3">
      {/* Sub-tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeSubTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                isActive
                  ? 'bg-hb-accent text-white'
                  : 'text-hb-text-muted hover:text-hb-text-secondary hover:bg-hb-surface',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeSubTab === 'templates' && <TemplatesSubTab />}
      {activeSubTab === 'aisp' && <AISPGuideSubTab />}
      {activeSubTab === 'media' && <MediaLibrarySubTab />}
      {activeSubTab === 'wiki' && <WikiSubTab />}
    </div>
  )
}
