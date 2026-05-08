/**
 * Section Library — P72 / OC-TI / A2
 *
 * Layer 2 of the 3-layer Template Intelligence (per ADR-098).
 * "What sections exist and how are they arranged?"
 *
 * This module exposes a curated catalog of section arrangement patterns
 * (e.g. SaaS landing, personal brand, podcast show) plus a deterministic
 * keyword/tag matcher. HNSW vector activation is a Tier-2 deferral — the
 * matcher here is pure-function, no external deps.
 *
 * Self-contained: NO imports from themeLibrary or contentLibrary.
 */

import type { SectionType } from '@/lib/schemas'

// ---------------------------------------------------------------------------
// Types (defined inline per A2 spec)
// ---------------------------------------------------------------------------

export interface SectionOverride {
  variant?: string
  layout?: 'centered' | 'split' | 'grid' | 'list' | 'overlay'
  headlineWeight?: 'normal' | 'bold' | 'display'
  imageWeight?: 'none' | 'light' | 'medium' | 'heavy'
}

export interface SectionTemplate {
  id: string
  name: string
  description: string
  searchTags: readonly string[]
  /** 2-3 sample user utterances that should route to this arrangement.
   *  Used by templateMatcher for keyword scoring AND as future HNSW
   *  few-shot training context (per ADR-098). */
  exampleQueries: readonly string[]
  vectorDescription: string
  /** Ordered list of section types in this arrangement. */
  sections: readonly SectionType[]
  /** Optional per-section CSS / layout hints keyed by section type. */
  sectionOverrides?: Partial<Record<SectionType, SectionOverride>>
}

// ---------------------------------------------------------------------------
// Library entries (15 arrangements)
// ---------------------------------------------------------------------------

export const SECTION_LIBRARY: readonly SectionTemplate[] = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    description:
      'Conversion-optimized arrangement for B2B SaaS product pages — feature columns, social proof, pricing tier, and a final CTA.',
    searchTags: ['saas', 'landing', 'b2b', 'product', 'launch', 'conversion'],
    exampleQueries: [
      'build me a SaaS site',
      'B2B product launch page',
      'make a landing page with pricing',
    ],
    vectorDescription:
      'A B2B SaaS landing page that walks the visitor from headline to feature columns, into pricing tiers, social proof quotes, and a final call to action.',
    sections: ['menu', 'hero', 'columns', 'pricing', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'split', headlineWeight: 'display', imageWeight: 'medium' },
      columns: { layout: 'grid', imageWeight: 'light' },
      pricing: { layout: 'grid' },
    },
  },
  {
    id: 'personal-brand',
    name: 'Personal Brand',
    description:
      'Founder / speaker / creator personal site — story-led with portfolio gallery and a single direct CTA.',
    searchTags: ['personal', 'brand', 'portfolio', 'founder', 'speaker', 'about'],
    exampleQueries: [
      'personal portfolio site',
      'I want to build my personal brand',
      'founder profile',
    ],
    vectorDescription:
      'A personal brand site that introduces the person, tells a short story, displays portfolio work in a gallery, and ends with a clear call to action.',
    sections: ['menu', 'hero', 'text', 'gallery', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'split', headlineWeight: 'bold', imageWeight: 'heavy' },
      gallery: { layout: 'grid', imageWeight: 'heavy' },
      text: { layout: 'centered' },
    },
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description:
      'High-energy launch page — narrative reveal, feature columns, headline metrics, and a strong reservation CTA.',
    searchTags: ['product', 'launch', 'startup', 'reveal', 'marketing', 'viral'],
    exampleQueries: [
      'product launch site',
      'announce a new product',
      'viral launch page',
    ],
    vectorDescription:
      'A product launch page that opens with a reveal moment, narrates the why, shows feature columns, hammers headline metrics, and drives toward reservation.',
    sections: ['menu', 'hero', 'text', 'columns', 'quotes', 'numbers', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'overlay', headlineWeight: 'display', imageWeight: 'heavy' },
      numbers: { layout: 'grid', headlineWeight: 'display' },
      columns: { layout: 'grid' },
    },
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description:
      'Agency or creative portfolio — visual-first gallery with case-study text, testimonials, and a project enquiry CTA.',
    searchTags: ['portfolio', 'agency', 'creative', 'work', 'showcase', 'case-studies'],
    exampleQueries: [
      'agency portfolio',
      'showcase my work',
      'creative case studies',
    ],
    vectorDescription:
      'A creative portfolio that leads with the gallery of work, supports it with case-study text and client testimonials, and closes with a project enquiry CTA.',
    sections: ['menu', 'hero', 'gallery', 'text', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'overlay', imageWeight: 'heavy', headlineWeight: 'display' },
      gallery: { layout: 'grid', imageWeight: 'heavy' },
    },
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit',
    description:
      'Mission-driven nonprofit page — emotional hero, impact narrative, headline metrics, testimonials, and a donate CTA.',
    searchTags: ['nonprofit', 'mission', 'impact', 'cause', 'donate', 'community'],
    exampleQueries: [
      'nonprofit cause site',
      'donation page',
      'mission-driven landing',
    ],
    vectorDescription:
      'A nonprofit page that opens with mission, narrates impact, shows quantitative outcomes, includes community testimonials, and ends with a donate call to action.',
    sections: ['menu', 'hero', 'text', 'numbers', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'overlay', imageWeight: 'heavy', headlineWeight: 'bold' },
      numbers: { layout: 'grid', headlineWeight: 'display' },
      text: { layout: 'centered' },
    },
  },
  {
    id: 'developer-tool',
    name: 'Developer Tool',
    description:
      'Open-source developer tool / CLI — feature columns, install metrics, recent blog posts, and a docs CTA. Image-light by design.',
    searchTags: ['developer', 'tool', 'cli', 'open-source', 'docs', 'api'],
    exampleQueries: [
      'dev tool homepage',
      'OSS library landing',
      'CLI marketing site',
    ],
    vectorDescription:
      'A developer tool landing page that lists features in columns, surfaces install / star metrics, lists recent blog posts, and routes to docs. Image-light, copy-dense.',
    sections: ['menu', 'hero', 'columns', 'numbers', 'blog', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'centered', imageWeight: 'none', headlineWeight: 'display' },
      columns: { layout: 'grid', imageWeight: 'none' },
      numbers: { layout: 'grid' },
      blog: { layout: 'list' },
    },
  },
  {
    id: 'blog-home',
    name: 'Blog Home',
    description:
      'Editorial blog landing — recent posts, category columns, and a newsletter signup CTA.',
    searchTags: ['blog', 'newsletter', 'content', 'editorial', 'articles', 'recent'],
    exampleQueries: [
      'blog homepage',
      'newsletter site',
      'content blog',
    ],
    vectorDescription:
      'A blog home page that surfaces recent articles, organizes content categories in columns, and pushes toward newsletter signup.',
    sections: ['menu', 'hero', 'blog', 'columns', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'centered', headlineWeight: 'bold', imageWeight: 'light' },
      blog: { layout: 'grid', imageWeight: 'medium' },
      columns: { layout: 'grid' },
    },
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description:
      'Local hospitality page — visual menu gallery, story copy, customer quotes, and a reservation CTA.',
    searchTags: ['restaurant', 'food', 'menu', 'hospitality', 'local', 'dining'],
    exampleQueries: [
      'restaurant site',
      'menu and hours',
      'local food business',
    ],
    vectorDescription:
      'A restaurant page that opens visually, shows the menu and dishes in a gallery, tells the kitchen story, includes diner quotes, and ends in a reservation CTA.',
    sections: ['menu', 'hero', 'gallery', 'text', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'overlay', imageWeight: 'heavy', headlineWeight: 'display' },
      gallery: { layout: 'grid', imageWeight: 'heavy' },
      text: { layout: 'centered' },
    },
  },
  {
    id: 'event',
    name: 'Event',
    description:
      'Conference / single-day event — headline metrics (date, location, attendees), speaker/track columns, and a register CTA.',
    searchTags: ['event', 'conference', 'speakers', 'schedule', 'tickets', 'register'],
    exampleQueries: [
      'conference page',
      'event registration',
      'speaker showcase',
    ],
    vectorDescription:
      'An event page that frames date and location as headline numbers, lays out speakers and tracks in columns, and drives registration.',
    sections: ['menu', 'hero', 'numbers', 'columns', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'overlay', headlineWeight: 'display', imageWeight: 'heavy' },
      numbers: { layout: 'grid', headlineWeight: 'display' },
      columns: { layout: 'grid' },
    },
  },
  {
    id: 'startup-minimal',
    name: 'Startup Minimal',
    description:
      'Single-page MVP / elevator pitch — hero, one paragraph of story, single CTA. Maximally minimal.',
    searchTags: ['startup', 'minimal', 'mvp', 'elevator', 'pitch', 'single-page'],
    exampleQueries: [
      'minimal MVP site',
      'quick startup landing',
      'single-page elevator',
    ],
    vectorDescription:
      'A maximally minimal startup MVP page: a hero, a single paragraph that explains the pitch, and one direct call to action.',
    sections: ['menu', 'hero', 'text', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'centered', headlineWeight: 'display', imageWeight: 'none' },
      text: { layout: 'centered' },
    },
  },
  {
    id: 'clinic-trust',
    name: 'Clinic Trust',
    description:
      'Medical / healthcare practice — services columns, patient quotes, headline trust metrics, and a booking CTA.',
    searchTags: ['clinic', 'medical', 'healthcare', 'trust', 'services', 'book'],
    exampleQueries: [
      'medical clinic',
      'healthcare practice',
      "doctor's office site",
    ],
    vectorDescription:
      'A medical clinic page that earns trust through services columns, patient testimonials, and headline numbers, then directs the visitor to book an appointment.',
    sections: ['menu', 'hero', 'columns', 'quotes', 'numbers', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'split', headlineWeight: 'bold', imageWeight: 'medium' },
      columns: { layout: 'grid', imageWeight: 'light' },
      numbers: { layout: 'grid' },
    },
  },
  {
    id: 'podcast-show',
    name: 'Podcast Show',
    description:
      'Audio show landing — episode columns, recent episode posts, host quotes, and a subscribe CTA.',
    searchTags: ['podcast', 'audio', 'show', 'episodes', 'hosts', 'subscribe'],
    exampleQueries: [
      'podcast site',
      'audio show landing',
      'episode showcase',
    ],
    vectorDescription:
      'A podcast show page that introduces the hosts, lays out featured episode columns, lists recent episodes blog-style, includes guest quotes, and pushes subscribe.',
    sections: ['menu', 'hero', 'columns', 'blog', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'split', headlineWeight: 'display', imageWeight: 'medium' },
      columns: { layout: 'grid', imageWeight: 'medium' },
      blog: { layout: 'list', imageWeight: 'light' },
    },
  },
  {
    id: 'course-landing',
    name: 'Course Landing',
    description:
      'Online course / training program — curriculum overview, student testimonials, outcome metrics, and an enroll CTA.',
    searchTags: ['course', 'education', 'curriculum', 'enroll', 'training', 'online-learning', 'edtech'],
    exampleQueries: ['online course landing', 'training course site', 'educational program page'],
    vectorDescription:
      'An online course landing page with curriculum overview, student testimonials, outcome metrics, and an enrollment call to action.',
    sections: ['menu', 'hero', 'columns', 'quotes', 'numbers', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'split', headlineWeight: 'display', imageWeight: 'medium' },
      columns: { layout: 'grid', imageWeight: 'light' },
      numbers: { layout: 'grid', headlineWeight: 'display' },
    },
  },
  {
    id: 'booking-calendar',
    name: 'Booking Calendar',
    description:
      'Booking-driven service site — services overview, social proof, and a clear booking CTA. Booking calendar UI deferred; sections list out the booking flow.',
    searchTags: ['booking', 'appointment', 'schedule', 'calendar', 'services', 'availability', 'wellness'],
    exampleQueries: ['booking site', 'appointment scheduling', 'calendar-based service site'],
    vectorDescription:
      'A booking-driven service site with available services, social proof, and a clear booking call to action.',
    sections: ['menu', 'hero', 'columns', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'split', headlineWeight: 'bold', imageWeight: 'medium' },
      columns: { layout: 'grid', imageWeight: 'light' },
    },
  },
  {
    id: 'newsroom',
    name: 'Newsroom',
    description:
      'Newsroom / editorial media site — featured story, article grid, category columns, and subscriber CTA.',
    searchTags: ['newsroom', 'media', 'press', 'articles', 'journalism', 'editorial', 'PR'],
    exampleQueries: ['newsroom layout', 'media press site', 'editorial article grid'],
    vectorDescription:
      'A newsroom-style site with featured story, article grid, category columns, and subscriber CTA.',
    sections: ['menu', 'hero', 'blog', 'columns', 'quotes', 'action', 'footer'],
    sectionOverrides: {
      hero: { layout: 'overlay', headlineWeight: 'display', imageWeight: 'heavy' },
      blog: { layout: 'grid', imageWeight: 'medium' },
      columns: { layout: 'grid' },
    },
  },
] as const

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

interface ScoredTemplate {
  template: SectionTemplate
  score: number
  index: number
}

const TAG_HIT_WEIGHT = 2
const SUBSTRING_HIT_WEIGHT = 1
const NAME_HIT_BONUS = 1.5

/**
 * Tokenize a free-form query into lowercased word tokens.
 * Splits on whitespace and common punctuation.
 */
function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s,.;:/\\()[\]{}"'`!?+-]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

/**
 * Score a single template against a tokenized query.
 *
 * Two signals:
 *   - tag overlap (token-equal or substring of any searchTag)
 *   - substring match against vectorDescription / name / description
 */
function scoreTemplate(template: SectionTemplate, tokens: readonly string[]): number {
  if (tokens.length === 0) return 0
  let score = 0
  const lowerVector = template.vectorDescription.toLowerCase()
  const lowerName = template.name.toLowerCase()
  const lowerDesc = template.description.toLowerCase()

  for (const token of tokens) {
    // Tag overlap (exact or substring against any tag).
    for (const tag of template.searchTags) {
      const lowerTag = tag.toLowerCase()
      if (lowerTag === token) {
        score += TAG_HIT_WEIGHT
      } else if (lowerTag.includes(token) || token.includes(lowerTag)) {
        score += TAG_HIT_WEIGHT * 0.5
      }
    }
    // Vector / name / description substring match.
    if (lowerVector.includes(token)) score += SUBSTRING_HIT_WEIGHT
    if (lowerName.includes(token)) score += SUBSTRING_HIT_WEIGHT * NAME_HIT_BONUS
    if (lowerDesc.includes(token)) score += SUBSTRING_HIT_WEIGHT * 0.75
  }
  return score
}

/**
 * Find section arrangements ranked by relevance to a free-form query.
 *
 * Ranking signals (deterministic, no external deps):
 *   - tag overlap against `searchTags`
 *   - substring match against `vectorDescription`, `name`, `description`
 *
 * Empty query → original library order.
 * Tied scores preserve original order (stable sort by index).
 *
 * @param query Free-form natural-language query (e.g. "developer cli tool").
 * @returns Ranked list of matching arrangements (highest score first).
 */
export function findSectionArrangements(query: string): SectionTemplate[] {
  const trimmed = query.trim()
  if (trimmed.length === 0) {
    return [...SECTION_LIBRARY]
  }
  const tokens = tokenize(trimmed)
  if (tokens.length === 0) {
    return [...SECTION_LIBRARY]
  }

  const scored: ScoredTemplate[] = SECTION_LIBRARY.map((template, index) => ({
    template,
    score: scoreTemplate(template, tokens),
    index,
  })).filter((s) => s.score > 0)

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.index - b.index
  })

  return scored.map((s) => s.template)
}
