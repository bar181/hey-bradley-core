// Spec: plans/implementation/mvp-plan/07-prompts-and-aisp.md §5
// Single source of truth for the LLM patch path whitelist.
// Imported by BOTH the system-prompt builder AND the patch validator — no drift.
//
// Step 2 scope (replace-op only): theme + hero (sections/0) + article (sections/<idx>)
// + siteContext. add/remove ops, plus more sections, are deferred to post-MVP.

/** Literal allow-list of `replace`-able paths (theme + siteContext). */
export const STATIC_ALLOWED_PATHS: readonly string[] = [
  // Theme — fully editable
  '/theme/colors/primary',
  '/theme/colors/secondary',
  '/theme/colors/accent',
  '/theme/colors/background',
  '/theme/colors/foreground',
  '/theme/colors/muted',
  '/theme/fonts/heading',
  '/theme/fonts/body',
  '/theme/spacing/xs',
  '/theme/spacing/sm',
  '/theme/spacing/md',
  '/theme/spacing/lg',
  '/theme/spacing/xl',
  '/theme/radius',
  // Site context
  '/siteContext/purpose',
  '/siteContext/audience',
  '/siteContext/tone',
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
  // Step 2 fixture writes /sections/1/components/1/props/text; allow it.
  /^\/sections\/\d+\/components\/\d+\/props\/(text|url)$/,
  // Article — section index resolved at validate-time by id `article-01`.
  /^\/sections\/\d+\/content\/(title|body|author|heroImage)$/,
  /^\/sections\/\d+\/style\/background$/,
]

/** True if `path` is in the static allow-list OR matches a dynamic pattern. */
export function isAllowedPath(path: string): boolean {
  if (STATIC_ALLOWED_PATHS.includes(path)) return true
  return DYNAMIC_ALLOWED_PATTERNS.some((re) => re.test(path))
}

/** Compact, prompt-injectable rendering of the whitelist for the system prompt. */
export function renderAllowedPathsForPrompt(): string {
  const dyn = [
    '/sections/0/content/heading/{text,level}',
    '/sections/0/content/subheading',
    '/sections/0/content/cta/{text,url}',
    '/sections/0/style/{background,backgroundImage}',
    '/sections/0/layout/variant',
    '/sections/<n>/components/<m>/props/{text,url}',
    '/sections/<article-idx>/content/{title,body,author,heroImage}',
    '/sections/<article-idx>/style/background',
  ]
  return [...STATIC_ALLOWED_PATHS, ...dyn].join('\n')
}
