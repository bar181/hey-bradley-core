// Blog post registry + tiny markdown renderer.
// Source of truth for /blog and /blog/:slug. New posts ship as .md files in
// src/pages/blog/posts/ and a metadata entry below. The .md is loaded via
// Vite's `import.meta.glob('...', { as: 'raw', eager: true })` so missing
// files at build time become an empty body (renderer shows "Coming soon").

const RAW_POSTS = import.meta.glob('/src/pages/blog/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function rawFor(slug: string): string {
  const key = `/src/pages/blog/posts/${slug}.md`
  return RAW_POSTS[key] ?? ''
}

// Strip a leading YAML frontmatter block ("---\n...\n---\n") if present.
function stripFrontmatter(md: string): string {
  if (!md.startsWith('---')) return md
  const end = md.indexOf('\n---', 3)
  if (end === -1) return md
  const after = md.indexOf('\n', end + 4)
  return after === -1 ? '' : md.slice(after + 1)
}

function excerptOf(body: string, words = 209): string {
  const stripped = body
    .replace(/^#+\s+.*$/gm, '')          // drop heading lines
    .replace(/[*_`>#\-|]/g, ' ')         // drop common md markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  const tokens = stripped.split(' ').filter(Boolean)
  if (tokens.length <= words) return tokens.join(' ')
  return tokens.slice(0, words).join(' ') + '…'
}

export interface BlogPost {
  slug: string
  title: string
  subtitle: string
  date: string
  readingTimeMin: number
  excerpt: string
  body: string
  tags: string[]
}

interface BlogPostMeta {
  slug: string
  title: string
  subtitle: string
  date: string
  readingTimeMin: number
  tags?: string[]
}

// Words-per-minute heuristic for read-time estimation. ADR-097 fixes 200wpm
// as the canonical rate; `readTimeMinutes` is `Math.ceil(words / 200)`.
const WORDS_PER_MINUTE = 200

export function countWords(body: string): number {
  if (!body) return 0
  const stripped = body
    .replace(/^---[\s\S]*?\n---\n?/, '')   // frontmatter
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')    // inline + fenced code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_>\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!stripped) return 0
  return stripped.split(' ').filter(Boolean).length
}

export function readTimeMinutes(body: string): number {
  const words = countWords(body)
  if (words === 0) return 1
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

// Hardcoded registry. A4 + A5 write the .md content; this list governs
// ordering and metadata. If the .md file is missing, body is empty +
// excerpt shows "Coming soon" so the index card still renders without
// crashing. P71 / OC-13 (ADR-097) expands 4 → 10.
const REGISTRY: BlogPostMeta[] = [
  // P58 baseline (4 posts)
  {
    slug: 'lovable-vs-hey-bradley',
    title: 'Lovable Builds the Site. Hey Bradley Designs It First.',
    subtitle: 'Why the spec layer is the real bottleneck — and the moat.',
    date: '2026-04-29',
    readingTimeMin: 6,
    tags: ['positioning', 'spec-first'],
  },
  {
    slug: 'six-sprints-two-days',
    title: 'Six Sprints in Two Days',
    subtitle: 'What sustained 50× velocity actually feels like, and why discipline is the brake.',
    date: '2026-04-29',
    readingTimeMin: 5,
    tags: ['velocity', 'process'],
  },
  {
    slug: 'aisp-made-visible',
    title: 'AISP, Made Visible',
    subtitle: 'How always-on atom traces turn the spec layer from invisible plumbing into the headline feature.',
    date: '2026-04-29',
    readingTimeMin: 4,
    tags: ['aisp', 'product'],
  },
  {
    slug: 'jira-vs-agentics',
    title: 'Why Jira Is Incompatible With Agentic Development',
    subtitle: 'The relay-race tracker meets a wave-gate workflow — and the relay race loses.',
    date: '2026-04-29',
    readingTimeMin: 5,
    tags: ['agentic-engineering', 'process'],
  },
  // P71 / OC-13 expansion (6 posts)
  {
    slug: 'pm-architect-designer-now-one-person',
    title: 'The PM, Architect, and Designer Are Now One Person',
    subtitle: 'Founders carry three lanes by force, not choice. Lane-aware capture is what makes that survivable.',
    date: '2026-05-01',
    readingTimeMin: 5,
    tags: ['founders', 'spec-first', 'agentic-engineering'],
  },
  {
    slug: 'spec-first-vs-vibe-coding',
    title: 'Spec-First vs Vibe-Coding: A Head-to-Head Comparison',
    subtitle: 'Vibe works for one prompt. Spec-first wins on the second.',
    date: '2026-05-01',
    readingTimeMin: 5,
    tags: ['spec-first', 'aisp', 'comparison'],
  },
  {
    slug: 'built-open-core-in-2-days-with-swarm',
    title: 'Built an Open-Core Product in 2 Days With a Swarm',
    subtitle: 'What 50× velocity actually looks like when the swarm holds the gate.',
    date: '2026-05-01',
    readingTimeMin: 5,
    tags: ['velocity', 'swarm', 'process'],
  },
  {
    slug: 'template-first-beats-llm-from-scratch',
    title: 'Why Template-First Beats LLM-From-Scratch Every Time',
    subtitle: 'Lovable starts at 60-70%. Templates start at 90%. The math is decided before the first prompt.',
    date: '2026-05-01',
    readingTimeMin: 5,
    tags: ['templates', 'product'],
  },
  {
    slug: 'building-hey-bradley-with-hey-bradley',
    title: 'Building Hey Bradley With Hey Bradley',
    subtitle: 'Dogfooding the spec layer to ship the spec layer.',
    date: '2026-05-01',
    readingTimeMin: 5,
    tags: ['meta', 'dogfooding', 'aisp'],
  },
  {
    slug: 'the-55-percent-problem',
    title: 'The 55% Problem',
    subtitle: 'Most AI-assisted-build effort is spent on ambiguity removal, not code. The tools optimize the wrong half.',
    date: '2026-05-01',
    readingTimeMin: 5,
    tags: ['research', 'spec-first', 'capstone'],
  },
  // P82 / OC-CLEANUP expansion (2 posts → 12 total)
  {
    slug: 'multi-page-mvp-stays-atomic',
    title: 'How Multi-Page MVPs Stay Atomic',
    subtitle: 'Page-aware patches without breaking the spec contract.',
    date: '2026-05-01',
    readingTimeMin: 6,
    tags: ['multi-page', 'architecture', 'AISP', 'open-core'],
  },
  {
    slug: 'the-open-core-boundary',
    title: "The Open-Core Boundary: What Ships Free, What's Tier-2",
    subtitle: 'How we draw the line between MVP and commercial.',
    date: '2026-05-01',
    readingTimeMin: 6,
    tags: ['open-core', 'strategy', 'tier-2', 'boundaries'],
  },
  // P118 / SIMPLE-MESSAGING-AND-POSITIONING expansion (3 posts → 15 total)
  {
    slug: 'describe-it-see-it',
    title: 'Describe It. See It. Done.',
    subtitle: 'A therapist in Portland describes her practice into a chat box. By dinner she has a homepage worth sending.',
    date: '2026-05-06',
    readingTimeMin: 6,
    tags: ['product', 'user-story', 'open-core'],
  },
  {
    slug: 'why-we-built-this-the-honest-version',
    title: 'Why We Built This: The Honest Version',
    subtitle: 'I just wanted to change a phone number. It took me forty minutes. I was the engineer.',
    date: '2026-05-06',
    readingTimeMin: 7,
    tags: ['origin', 'founders', 'product'],
  },
  {
    slug: 'the-handoff-that-changes-everything',
    title: 'The Handoff That Changes Everything',
    subtitle: 'JSON-patches, not regenerations. The architectural difference shows up in iteration, cost, and the developer hand-off.',
    date: '2026-05-06',
    readingTimeMin: 7,
    tags: ['architecture', 'agentic-engineering', 'spec-first'],
  },
  // P121.5 — content migrations (research + for-teams → blog)
  {
    slug: 'research-the-telephone-game',
    title: 'The Most Expensive Game of Telephone in History',
    subtitle: 'Harvard ALM capstone research measuring intent loss across the software development chain — and the protocol that stops it.',
    date: '2026-05-07',
    readingTimeMin: 12,
    tags: ['research', 'aisp', 'capstone', 'spec-first'],
  },
  {
    slug: 'teams-spec-handoff-for-product-teams',
    title: 'Your Team Re-Explains the Project Every Session',
    subtitle: 'A persistent spec your AI coding assistant reads once. The next session picks up where the last one ended.',
    date: '2026-05-07',
    readingTimeMin: 5,
    tags: ['teams', 'process', 'spec-first'],
  },
]

function buildPost(meta: BlogPostMeta): BlogPost {
  const raw = rawFor(meta.slug)
  const body = stripFrontmatter(raw)
  // Prefer the body-derived read time when the .md is present; fall back to
  // the registry estimate (used while a post is still being authored).
  const computed = body ? readTimeMinutes(body) : meta.readingTimeMin
  return {
    slug: meta.slug,
    title: meta.title,
    subtitle: meta.subtitle,
    date: meta.date,
    tags: meta.tags ?? [],
    readingTimeMin: computed,
    body,
    excerpt: body ? excerptOf(body, 209) : 'Coming soon — this post is being written.',
  }
}

export function listBlogPosts(): BlogPost[] {
  // Sort by date descending (most recent first); ties preserve registry order.
  return REGISTRY.map(buildPost).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

// P121.5 — display category derivation. Five categories: story, technical,
// teams, research, aisp. Classifies from tags with explicit slug overrides.
export type BlogCategory = 'story' | 'technical' | 'teams' | 'research' | 'aisp'

export const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  story: 'Story',
  technical: 'Technical',
  teams: 'Teams',
  research: 'Research',
  aisp: 'AISP',
}

const TECHNICAL_TAGS = new Set([
  'engineering', 'architecture', 'handoff', 'crystal-atom',
  'spec-first', 'agentic-engineering', 'multi-page', 'comparison',
])
const TEAMS_TAGS = new Set([
  'process', 'swarm', 'team', 'discipline', 'velocity', 'meta', 'dogfooding',
  'open-core', 'strategy', 'tier-2', 'boundaries',
])
const RESEARCH_TAGS = new Set(['research', 'capstone'])
const AISP_TAGS = new Set(['aisp', 'AISP'])

export function categoryOf(post: { slug: string; tags: string[] }): BlogCategory {
  // Explicit slug overrides
  if (post.slug === 'describe-it-see-it') return 'story'
  if (post.slug === 'why-we-built-this-the-honest-version') return 'story'
  if (post.slug === 'the-handoff-that-changes-everything') return 'technical'
  if (post.slug === 'research-the-telephone-game') return 'research'
  if (post.slug === 'teams-spec-handoff-for-product-teams') return 'teams'
  // Tag-based derivation — order matters: more specific first
  for (const t of post.tags) if (RESEARCH_TAGS.has(t)) return 'research'
  for (const t of post.tags) if (AISP_TAGS.has(t)) return 'aisp'
  for (const t of post.tags) if (TECHNICAL_TAGS.has(t)) return 'technical'
  for (const t of post.tags) if (TEAMS_TAGS.has(t)) return 'teams'
  return 'story'
}

export function listBlogTags(): string[] {
  const all = new Set<string>()
  for (const meta of REGISTRY) {
    for (const t of meta.tags ?? []) all.add(t)
  }
  return Array.from(all).sort()
}

export function getBlogPost(slug: string): BlogPost | null {
  const meta = REGISTRY.find((p) => p.slug === slug)
  return meta ? buildPost(meta) : null
}

// Tiny markdown -> HTML. Handles: # headings (1-6), paragraphs, **bold**,
// *italic*, `code`, [text](url), - lists, > blockquotes. No fenced code,
// no tables, no images. Inputs are author-controlled, no sanitization.
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  let out = escapeHtml(s)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  )
  return out
}

export function renderMarkdown(md: string): string {
  if (!md) return ''
  const lines = stripFrontmatter(md).split('\n')
  const out: string[] = []
  let para: string[] = []
  let list: string[] | null = null
  let quote: string[] | null = null

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = [] }
  }
  const flushList = () => {
    if (list) { out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`); list = null }
  }
  const flushQuote = () => {
    if (quote) { out.push(`<blockquote>${inline(quote.join(' '))}</blockquote>`); quote = null }
  }
  const flushAll = () => { flushPara(); flushList(); flushQuote() }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      flushAll()
      const lvl = heading[1].length
      out.push(`<h${lvl}>${inline(heading[2])}</h${lvl}>`)
      continue
    }
    if (/^-\s+/.test(line)) {
      flushPara(); flushQuote()
      list = list ?? []
      list.push(line.replace(/^-\s+/, ''))
      continue
    }
    if (/^>\s?/.test(line)) {
      flushPara(); flushList()
      quote = quote ?? []
      quote.push(line.replace(/^>\s?/, ''))
      continue
    }
    if (line.trim() === '') { flushAll(); continue }
    flushList(); flushQuote()
    para.push(line)
  }
  flushAll()
  return out.join('\n')
}
