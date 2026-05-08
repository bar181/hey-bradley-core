// P19 Fix-Pass 2 (F1): section-by-type path resolver for LLM fixtures.
//
// Spec: plans/implementation/phase-19/deep-dive/02-functionality-findings.md §4.1.
//
// The Step-2 fixtures used to hardcode `/sections/1/components/1/...` for the
// hero heading, which silently corrupted blog-standard.json (where the hero is
// at sections[0]). These helpers walk the active MasterConfig at call-time so
// fixtures resolve to the correct path regardless of which example is loaded.
//
// On miss we return null; the fixture caller surfaces a friendly empty-patch
// envelope to the user instead of writing into the wrong slot.
import type { MasterConfig } from '@/lib/schemas'

/** Find the first ENABLED section with the given type. -1 on miss. */
export function findSectionByType(config: MasterConfig, type: string): number {
  return config.sections.findIndex((s) => s.type === type && s.enabled !== false)
}

/** Find the first component with the given type inside a section. -1 on miss. */
export function findComponentByType(
  config: MasterConfig,
  sectionIdx: number,
  componentType: string,
): number {
  const section = config.sections[sectionIdx]
  if (!section || !section.components) return -1
  return section.components.findIndex((c) => c.type === componentType)
}

/** Path to the hero `heading` component's text prop, or null if absent. */
export function heroHeadingPath(config: MasterConfig): string | null {
  const s = findSectionByType(config, 'hero')
  if (s < 0) return null
  const c = findComponentByType(config, s, 'heading')
  if (c < 0) return null
  return `/sections/${s}/components/${c}/props/text`
}

/**
 * Path to the hero subheading. Heuristic: the first `text`-typed component
 * inside the hero section (skipping a possible badge/eyebrow). On miss returns
 * null. Both default-config and blog-standard use `type: "text"` for subtitle.
 */
export function heroSubheadingPath(config: MasterConfig): string | null {
  const s = findSectionByType(config, 'hero')
  if (s < 0) return null
  const c = findComponentByType(config, s, 'text')
  if (c < 0) return null
  return `/sections/${s}/components/${c}/props/text`
}

/** Path to the blog article's `field` prop (title|excerpt|author), or null. */
export function blogArticlePath(
  config: MasterConfig,
  field: 'title' | 'excerpt' | 'author',
): string | null {
  const s = findSectionByType(config, 'blog')
  if (s < 0) return null
  const c = findComponentByType(config, s, 'blog-article')
  if (c < 0) return null
  return `/sections/${s}/components/${c}/props/${field}`
}

/**
 * P20 C01 — Image MVP fixtures helper.
 *
 * Resolve a path to the hero/article/featured image. The image lives in
 * different slots depending on section + variant:
 *   - hero with heroImage: /sections/<n>/style/heroImage (allowed by IMAGE_PATH_RE)
 *   - hero with backgroundImage: /sections/<n>/style/backgroundImage
 *   - blog article featured: /sections/<n>/components/<m>/props/featuredImage
 *
 * Returns the first resolvable path or null. Strategy:
 *   target='hero' → hero/style/heroImage > hero/style/backgroundImage
 *   target='article' → blog/blog-article/props/featuredImage
 */
export function imagePath(
  config: MasterConfig,
  target: 'hero' | 'article',
): string | null {
  if (target === 'hero') {
    const s = findSectionByType(config, 'hero')
    if (s < 0) return null
    const sec = config.sections[s] as unknown as { style?: Record<string, unknown> }
    if (sec?.style && 'heroImage' in sec.style) return `/sections/${s}/style/heroImage`
    if (sec?.style && 'backgroundImage' in sec.style) return `/sections/${s}/style/backgroundImage`
    // fall back to backgroundImage even if currently absent — patch validator allows
    return `/sections/${s}/style/backgroundImage`
  }
  // article
  const s = findSectionByType(config, 'blog')
  if (s < 0) return null
  const c = findComponentByType(config, s, 'blog-article')
  if (c < 0) return null
  return `/sections/${s}/components/${c}/props/featuredImage`
}
