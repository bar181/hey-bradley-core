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
}

interface BlogPostMeta {
  slug: string
  title: string
  subtitle: string
  date: string
  readingTimeMin: number
}

// Hardcoded registry. A4 writes the .md content; this list governs ordering
// and metadata. If the .md file is missing, body is empty + excerpt shows
// "Coming soon" so the index card still renders without crashing.
const REGISTRY: BlogPostMeta[] = [
  {
    slug: 'lovable-vs-hey-bradley',
    title: 'Lovable Builds the Site. Hey Bradley Designs It First.',
    subtitle: 'Why the spec layer is the real bottleneck — and the moat.',
    date: '2026-04-29',
    readingTimeMin: 6,
  },
  {
    slug: 'six-sprints-two-days',
    title: 'Six Sprints in Two Days',
    subtitle: 'What sustained 50× velocity actually feels like, and why discipline is the brake.',
    date: '2026-04-29',
    readingTimeMin: 5,
  },
  {
    slug: 'aisp-made-visible',
    title: 'AISP, Made Visible',
    subtitle: 'How always-on atom traces turn the spec layer from invisible plumbing into the headline feature.',
    date: '2026-04-29',
    readingTimeMin: 4,
  },
]

function buildPost(meta: BlogPostMeta): BlogPost {
  const raw = rawFor(meta.slug)
  const body = stripFrontmatter(raw)
  return {
    ...meta,
    body,
    excerpt: body ? excerptOf(body, 209) : 'Coming soon — this post is being written.',
  }
}

export function listBlogPosts(): BlogPost[] {
  return REGISTRY.map(buildPost)
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
