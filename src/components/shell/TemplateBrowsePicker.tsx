/**
 * P34 Sprint E P1 (Sprint D UI closure A2) — Template Browse Picker.
 *
 * Visual grid of available templates (registry-baked + user-authored). User
 * clicks a template to fill the chat input with its first example phrase;
 * sender re-uses the existing chatPipeline path so no new patch-application
 * code paths.
 *
 * Triggered by typing `/browse` in ChatInput. Lands the R1 F3 + F4 closure
 * from the Sprint D brutal-honest review (browse-picker UI + examples
 * discovery surface).
 *
 * P66 / Polish Sprint / Wave 1 / A5 — adds three filter pills (persona /
 * industry / complexity) above the template grid. Filtering uses a small
 * keyword-match lookup against the template's display name (BrowseTemplate
 * has no persona / industry metadata of its own; OC-3-class metadata lives
 * on EXAMPLE_SITES which is a different surface). Complexity falls back to
 * 'Standard' because BrowseTemplate is a patch projection, not a MasterConfig
 * — no sections.length available at this layer. Both fallbacks are intentional
 * and documented; tightening would require widening BrowseTemplate metadata,
 * which is OC-CLEANUP territory.
 *
 * Card styling follows the canonical Feature card pattern per ADR-091:
 * token-derived padding + radius (tokens.radius.md), subtle hover-lift, focus
 * ring intact for keyboard users.
 */
import { useMemo, useState } from 'react'
import { listAllForBrowse, type BrowseTemplate } from '@/contexts/intelligence/templates/library'
import { tokens } from '@/styles/design-tokens'

export interface TemplateBrowsePickerProps {
  /** Called when user clicks a template card; receives the first example phrase. */
  onPick: (examplePhrase: string) => void
  /** Called when user dismisses the picker. */
  onClose: () => void
}

// ── Filter vocabulary (per P66 Wave-1 A5 brief; P68/OC-4 adds visual-style) ──
type PersonaFilter = 'All' | 'Founder' | 'PM/Team' | 'Senior Engineer' | 'Local Business' | 'Personal'
type IndustryFilter =
  | 'All' | 'SaaS' | 'Agency' | 'E-commerce' | 'Content' | 'Local Service' | 'Conference' | 'Podcast'
type ComplexityFilter = 'All' | 'Simple' | 'Standard' | 'Rich'
// P68 / OC-4 / A4 — Visual style filter. Same conservative semantics as
// persona/industry: keyword-match against the BrowseTemplate display name;
// no match → only "All" matches it.
type VisualStyleFilter = 'All' | 'Warm/serif' | 'Tech/dark' | 'Modern/Inter'

const PERSONA_OPTIONS: readonly PersonaFilter[] = [
  'All', 'Founder', 'PM/Team', 'Senior Engineer', 'Local Business', 'Personal',
]
const INDUSTRY_OPTIONS: readonly IndustryFilter[] = [
  'All', 'SaaS', 'Agency', 'E-commerce', 'Content', 'Local Service', 'Conference', 'Podcast',
]
const COMPLEXITY_OPTIONS: readonly ComplexityFilter[] = ['All', 'Simple', 'Standard', 'Rich']
const VISUAL_STYLE_OPTIONS: readonly VisualStyleFilter[] = [
  'All', 'Warm/serif', 'Tech/dark', 'Modern/Inter',
]

const COMPLEXITY_LABELS: Record<ComplexityFilter, string> = {
  All: 'All',
  Simple: 'Simple (≤6)',
  Standard: 'Standard (7-9)',
  Rich: 'Rich (10+)',
}

/**
 * Keyword-match table for industry derivation (case-insensitive, name-only).
 * Conservative: when nothing matches, the template is treated as industry-agnostic
 * and only "All" matches it (i.e. it falls out of any non-All filter).
 */
const INDUSTRY_KEYWORDS: ReadonlyArray<readonly [IndustryFilter, readonly string[]]> = [
  ['Conference', ['conference', 'conf']],
  ['Podcast', ['podcast', 'podcasting']],
  ['E-commerce', ['shop', 'store', 'ecommerce', 'e-commerce', 'coffee', 'roaster', 'bakery', 'florist']],
  ['Agency', ['agency', 'consulting', 'studio', 'firm']],
  ['SaaS', ['saas', 'platform', 'launchpad', 'cloud']],
  ['Local Service', ['restaurant', 'realty', 'real estate', 'local', 'fitness']],
  ['Content', ['blog', 'content', 'newsletter', 'article', 'scoop']],
]

/**
 * Persona keyword table — matches plausible signals in the template name.
 * Same conservative semantics: no match → only "All" matches.
 */
const PERSONA_KEYWORDS: ReadonlyArray<readonly [PersonaFilter, readonly string[]]> = [
  ['Founder', ['founder', 'launchpad', 'saas']],
  ['PM/Team', ['team', 'enterprise', 'agency', 'consulting']],
  ['Senior Engineer', ['engineer', 'dev portfolio', 'developer', 'capstone', 'flagship']],
  ['Local Business', ['bakery', 'florist', 'restaurant', 'local', 'realty']],
  ['Personal', ['personal', 'photography', 'portfolio', 'blog', 'indie']],
]

/**
 * Visual-style keyword table — coarse mapping from template display-name
 * signals to one of three canonical aesthetics (per OC-4 / ADR-096 §5):
 * - Warm/serif → Fraunces / Playfair Display, cream/earth palettes
 * - Tech/dark → JetBrains Mono + dark canvas (CLI / OSS / API / conf)
 * - Modern/Inter → Inter sans, lighter palettes (telehealth / SaaS / creator)
 *
 * Same conservative match: no signal in the name → only "All" passes.
 */
const VISUAL_STYLE_KEYWORDS: ReadonlyArray<readonly [VisualStyleFilter, readonly string[]]> = [
  ['Tech/dark', [
    'cli', 'oss', 'api', 'conf', 'conference', 'engineer', 'developer',
    'launchpad', 'flagship', 'enterprise', 'capstone',
  ]],
  ['Warm/serif', [
    'bakery', 'florist', 'coffee', 'roaster', 'restaurant', 'wellness', 'coach',
    'speaker', 'academic', 'researcher', 'founder', 'indie', 'realty', 'law',
    'blog', 'scoop', 'kitchen',
  ]],
  ['Modern/Inter', [
    'telehealth', 'caremeet', 'creator', 'youtuber', 'sloane', 'podcast',
    'mental health', 'therapy', 'clinic', 'saas', 'platform', 'consulting',
  ]],
]

function deriveVisualStyles(name: string): readonly VisualStyleFilter[] {
  const lower = name.toLowerCase()
  return VISUAL_STYLE_KEYWORDS.flatMap(([label, keywords]) =>
    keywords.some((kw) => lower.includes(kw)) ? [label] : []
  )
}

function deriveIndustry(name: string): readonly IndustryFilter[] {
  const lower = name.toLowerCase()
  return INDUSTRY_KEYWORDS.flatMap(([label, keywords]) =>
    keywords.some((kw) => lower.includes(kw)) ? [label] : []
  )
}

function derivePersonas(name: string): readonly PersonaFilter[] {
  const lower = name.toLowerCase()
  return PERSONA_KEYWORDS.flatMap(([label, keywords]) =>
    keywords.some((kw) => lower.includes(kw)) ? [label] : []
  )
}

/**
 * BrowseTemplate has no `sections` array (patch projection, not MasterConfig),
 * so complexity always falls back to 'Standard'. Documented in module header.
 * Future widening: thread sections.length through BrowseTemplate.
 */
function deriveComplexity(_t: BrowseTemplate): ComplexityFilter {
  return 'Standard'
}

// ── Pill style (canonical, token-derived) ──
function pillClass(active: boolean): string {
  // Token-derived radius via tokens.radius.md (12px). Keep Tailwind classes
  // tied to existing palette tokens; ADR-091 hover-lift on cards (not pills).
  const base =
    'inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8772e]'
  return active
    ? `${base} bg-[#e8772e]/15 border-[#e8772e]/60 text-[#8a4a1c]`
    : `${base} bg-white/40 border-hb-border/40 text-hb-text-muted hover:text-hb-text-primary hover:bg-white/70`
}

export function TemplateBrowsePicker({ onPick, onClose }: TemplateBrowsePickerProps) {
  // Registry-only at runtime (loadUserRows callback omitted; user_templates UI lands later).
  const templates = listAllForBrowse()

  const [persona, setPersona] = useState<PersonaFilter>('All')
  const [industry, setIndustry] = useState<IndustryFilter>('All')
  const [complexity, setComplexity] = useState<ComplexityFilter>('All')
  const [visualStyle, setVisualStyle] = useState<VisualStyleFilter>('All')

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (persona !== 'All') {
        const personas = derivePersonas(t.name)
        if (!personas.includes(persona)) return false
      }
      if (industry !== 'All') {
        const industries = deriveIndustry(t.name)
        if (!industries.includes(industry)) return false
      }
      if (complexity !== 'All') {
        if (deriveComplexity(t) !== complexity) return false
      }
      if (visualStyle !== 'All') {
        const styles = deriveVisualStyles(t.name)
        if (!styles.includes(visualStyle)) return false
      }
      return true
    })
  }, [templates, persona, industry, complexity, visualStyle])

  const byCategory = filtered.reduce<Record<string, BrowseTemplate[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})
  const categoryOrder: Array<BrowseTemplate['category']> = ['theme', 'section', 'content']

  const anyFilterActive =
    persona !== 'All' || industry !== 'All' || complexity !== 'All' || visualStyle !== 'All'
  const clearFilters = () => {
    setPersona('All')
    setIndustry('All')
    setComplexity('All')
    setVisualStyle('All')
  }

  // Token-derived radius (md = 12px). Inline via style to avoid Tailwind
  // arbitrary-value soup; consistent with ADR-087 token contract.
  const cardRadius = tokens.radius.md
  const pillRadius = tokens.radius.sm

  return (
    <div
      data-testid="template-browse-picker"
      className="border-t border-hb-border/50 bg-hb-surface/30 p-3 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-hb-text-secondary uppercase tracking-wider">
          Browse templates ({filtered.length}/{templates.length})
        </div>
        <button
          type="button"
          data-testid="template-browse-close"
          onClick={onClose}
          className="text-xs text-hb-text-muted hover:text-hb-text-primary underline decoration-dotted"
        >
          close
        </button>
      </div>

      {/* ── Filter pills (persona / industry / complexity) ── */}
      <div className="space-y-1.5" data-testid="template-browse-filters">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted shrink-0 pt-1.5 w-16">
            Persona
          </span>
          <div className="flex flex-wrap gap-1">
            {PERSONA_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                data-testid={`filter-persona-${opt}`}
                onClick={() => setPersona(opt)}
                className={pillClass(persona === opt)}
                style={{ borderRadius: pillRadius }}
                aria-pressed={persona === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted shrink-0 pt-1.5 w-16">
            Industry
          </span>
          <div className="flex flex-wrap gap-1">
            {INDUSTRY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                data-testid={`filter-industry-${opt}`}
                onClick={() => setIndustry(opt)}
                className={pillClass(industry === opt)}
                style={{ borderRadius: pillRadius }}
                aria-pressed={industry === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted shrink-0 pt-1.5 w-16">
            Complexity
          </span>
          <div className="flex flex-wrap gap-1">
            {COMPLEXITY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                data-testid={`filter-complexity-${opt}`}
                onClick={() => setComplexity(opt)}
                className={pillClass(complexity === opt)}
                style={{ borderRadius: pillRadius }}
                aria-pressed={complexity === opt}
              >
                {COMPLEXITY_LABELS[opt]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted shrink-0 pt-1.5 w-16">
            Visual style
          </span>
          <div className="flex flex-wrap gap-1">
            {VISUAL_STYLE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                data-testid={`filter-visual-style-${opt}`}
                onClick={() => setVisualStyle(opt)}
                className={pillClass(visualStyle === opt)}
                style={{ borderRadius: pillRadius }}
                aria-pressed={visualStyle === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {anyFilterActive && (
          <div className="flex justify-end">
            <button
              type="button"
              data-testid="filter-clear"
              onClick={clearFilters}
              className="text-[11px] text-hb-text-muted hover:text-hb-text-primary underline decoration-dotted"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div
          data-testid="template-browse-empty"
          className="text-xs text-hb-text-muted py-4 text-center"
        >
          No templates match these filters.{' '}
          <button
            type="button"
            onClick={clearFilters}
            className="underline decoration-dotted hover:text-hb-text-primary"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Template grid (canonical Feature card style per ADR-091) ── */}
      {categoryOrder.map((cat) => {
        const items = byCategory[cat] ?? []
        if (!items.length) return null
        return (
          <div key={cat} className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-hb-text-muted">
              {cat} ({items.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {items.map((t) => {
                const example = t.examples[0] ?? ''
                return (
                  <button
                    type="button"
                    key={t.id}
                    data-testid={`template-card-${t.id}`}
                    onClick={() => onPick(example)}
                    disabled={!example}
                    style={{ borderRadius: cardRadius }}
                    // ADR-091 canonical Feature card: token-derived radius,
                    // hover-lift via translate, transition-all for both bg + transform.
                    className="text-left p-2 border border-hb-border/40 bg-white/40 hover:bg-white/80 hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8772e]"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-hb-text-primary">{t.name}</span>
                      <span
                        className="text-[10px] uppercase px-1 py-0.5 bg-[#e8772e]/10 text-[#8a4a1c]"
                        style={{ borderRadius: tokens.radius.sm }}
                      >
                        {t.kind}
                      </span>
                      {/* R1 F2 fix-pass — "yours" tag deferred until P34+ wires
                          user_templates loadUserRows; removed dead branch. */}
                    </div>
                    {example && (
                      <div className="text-[11px] text-hb-text-muted italic">
                        try: "{example}"
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="text-[10px] text-hb-text-muted">
        Click any template to fill the input with an example. Edit and send.
      </div>
    </div>
  )
}
