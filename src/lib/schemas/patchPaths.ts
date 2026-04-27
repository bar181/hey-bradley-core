// Spec: plans/implementation/mvp-plan/07-prompts-and-aisp.md §5,
//       plans/implementation/mvp-plan/00-overview.md §12.1.
// Single source of truth for the LLM patch path whitelist (replace+add+remove).

/** Literal allow-list of `replace`-able paths (theme + siteContext). */
export const STATIC_ALLOWED_PATHS: readonly string[] = [
  // Theme (narrowed schema)
  '/theme/colors/primary', '/theme/colors/secondary', '/theme/colors/accent',
  '/theme/colors/background', '/theme/colors/foreground', '/theme/colors/muted',
  '/theme/fonts/heading', '/theme/fonts/body',
  '/theme/spacing/xs', '/theme/spacing/sm', '/theme/spacing/md',
  '/theme/spacing/lg', '/theme/spacing/xl', '/theme/radius',
  // Theme (current default-config shape)
  '/theme/palette/accentPrimary', '/theme/palette/accentSecondary',
  '/theme/palette/bgPrimary', '/theme/palette/textPrimary',
  '/theme/typography/headingFamily', '/theme/typography/fontFamily',
  // Site context
  '/siteContext/purpose', '/siteContext/audience', '/siteContext/tone',
] as const

/** Regex patterns for hero (`/sections/0/...`) + article (`/sections/<n>/...`). */
const DYNAMIC_ALLOWED_PATTERNS: readonly RegExp[] = [
  // Hero — fixed at /sections/0 in starter examples
  /^\/sections\/0\/content\/heading\/(text|level)$/,
  /^\/sections\/0\/content\/subheading$/,
  /^\/sections\/0\/content\/cta\/(text|url)$/,
  /^\/sections\/0\/style\/background$/,
  /^\/sections\/0\/style\/backgroundImage$/,
  /^\/sections\/0\/layout\/variant$/,
  // Hero (current default-config shape) — components-array hero headline.
  /^\/sections\/\d+\/components\/\d+\/props\/(text|url)$/,
  // Article (Step 3): blog-section component props for the blog-write starter.
  /^\/sections\/\d+\/components\/\d+\/props\/(title|excerpt|body|author|heroImage|featuredImage)$/,
  // Article — section-level (post-MVP shape with /content/ wrapper).
  /^\/sections\/\d+\/content\/(title|body|author|heroImage)$/,
  /^\/sections\/\d+\/style\/background$/,
]

/** True if `path` is in the static allow-list OR matches a dynamic pattern. */
export function isAllowedPath(path: string): boolean {
  if (STATIC_ALLOWED_PATHS.includes(path)) return true
  return DYNAMIC_ALLOWED_PATTERNS.some((re) => re.test(path))
}

/** Section types the LLM may append via `add` or remove via `remove`. */
const EDITABLE_SECTION_TYPES = new Set(['hero', 'article', 'blog', 'footer', 'theme'])

/** Step 3: `add /sections/-` is the only allowed `add` path; value.type must be editable. */
export function isAllowedAdd(path: string, value: unknown): boolean {
  if (path !== '/sections/-') return false
  if (!value || typeof value !== 'object') return false
  const t = (value as { type?: unknown }).type
  return typeof t === 'string' && EDITABLE_SECTION_TYPES.has(t)
}

/** Step 3: `remove /sections/<n>` only, and only if the resolved section is editable. */
export function isAllowedRemove(path: string, currentJson: unknown): boolean {
  const m = /^\/sections\/(\d+)$/.exec(path)
  if (!m) return false
  const idx = Number(m[1])
  const sections = (currentJson as { sections?: unknown[] } | null)?.sections
  if (!Array.isArray(sections) || idx < 0 || idx >= sections.length) return false
  const t = (sections[idx] as { type?: unknown } | null)?.type
  return typeof t === 'string' && EDITABLE_SECTION_TYPES.has(t)
}

/** Compact, prompt-injectable rendering of the whitelist. */
export function renderAllowedPathsForPrompt(): string {
  const dyn = [
    '/sections/0/content/heading/{text,level}', '/sections/0/content/subheading',
    '/sections/0/content/cta/{text,url}', '/sections/0/style/{background,backgroundImage}',
    '/sections/0/layout/variant', '/sections/<n>/components/<m>/props/{text,url}',
    '/sections/<n>/components/<m>/props/{title,excerpt,body,author,heroImage,featuredImage}',
    '/sections/<article-idx>/content/{title,body,author,heroImage}',
    '/sections/<article-idx>/style/background',
  ]
  return [...STATIC_ALLOWED_PATHS, ...dyn].join('\n')
}
