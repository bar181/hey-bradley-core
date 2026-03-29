import { z } from 'zod'
import { layoutSchema } from './layout'
import { styleSchema } from './style'

export const sectionTypeSchema = z.enum([
  'hero', 'features', 'pricing', 'cta', 'footer',
  'testimonials', 'faq', 'value_props',
])

export type SectionType = z.infer<typeof sectionTypeSchema>

// ---------------------------------------------------------------------------
// Component schema (ADR-016)
// ---------------------------------------------------------------------------

export const componentSchema = z.object({
  id: z.string(),
  type: z.string(),
  enabled: z.boolean().default(true),
  order: z.number().default(0),
  props: z.record(z.string(), z.unknown()).default(() => ({})),
})

export type Component = z.infer<typeof componentSchema>

// ---------------------------------------------------------------------------
// Legacy content schemas (kept for Phase 1 backward compatibility)
// ---------------------------------------------------------------------------

const HEADING_DEFAULTS = {
  text: 'Ship Code at the Speed of Thought',
  level: 1,
  size: '48px',
  weight: 700,
} as const

const CTA_DEFAULTS = {
  text: 'Get Started',
  url: '#pricing',
} as const

export const heroContentSchema = z.object({
  heading: z.object({
    text: z.string().default(HEADING_DEFAULTS.text),
    level: z.number().default(HEADING_DEFAULTS.level),
    size: z.string().default(HEADING_DEFAULTS.size),
    weight: z.number().default(HEADING_DEFAULTS.weight),
  }).default(() => ({ ...HEADING_DEFAULTS })),
  subheading: z.string().default('Build AI-native experiences that transform how we create.'),
  cta: z.object({
    text: z.string().default(CTA_DEFAULTS.text),
    url: z.string().default(CTA_DEFAULTS.url),
    show: z.boolean().default(true),
  }).default(() => ({ ...CTA_DEFAULTS, show: true })),
  secondaryCta: z.object({
    text: z.string().default('View my work'),
    url: z.string().default('#about'),
  }).optional(),
  badge: z.object({
    text: z.string().default('Hey Bradley 2.0 is Live'),
    show: z.boolean().default(true),
  }).optional(),
  image: z.object({
    url: z.string().default(''),
    alt: z.string().default(''),
    show: z.boolean().default(false),
  }).optional(),
  trustBadges: z.object({
    text: z.string().default('Trusted by 214 institutions'),
    show: z.boolean().default(true),
  }).optional(),
})

export type HeroContent = z.infer<typeof heroContentSchema>

export const featuresContentSchema = z.object({
  title: z.string().default('Features'),
  items: z.array(z.object({
    id: z.string(),
    icon: z.string().default(''),
    title: z.string(),
    description: z.string().optional(),
  })).default(() => []),
})

export const ctaContentSchema = z.object({
  heading: z.string().default('Ready to start?'),
  subheading: z.string().optional(),
  button: z.object({
    text: z.string().default('Launch Now'),
    url: z.string().default('#signup'),
  }),
})

// ---------------------------------------------------------------------------
// Section schema (supports both legacy content and new components[])
// ---------------------------------------------------------------------------

export const sectionSchema = z.object({
  type: sectionTypeSchema,
  id: z.string(),
  enabled: z.boolean().default(true),
  order: z.number().optional(),
  variant: z.string().optional(),
  layout: layoutSchema,
  content: z.record(z.string(), z.unknown()).default(() => ({})),
  style: styleSchema,
  components: z.array(componentSchema).default(() => []),
})

export type Section = z.infer<typeof sectionSchema>

// ---------------------------------------------------------------------------
// Compatibility helper: derive HeroContent from components[]
// ---------------------------------------------------------------------------

function findComponent(components: Component[], id: string): Component | undefined {
  return components.find((c) => c.id === id)
}

/**
 * Derives a legacy HeroContent object from a section's components[] array.
 * Used during Phase 1 so existing renderers (HeroCentered, SectionSimple,
 * SectionExpert) can read from the new structure without rewrite.
 */
export function componentsToHeroContent(components: Component[]): HeroContent {
  const eyebrow = findComponent(components, 'eyebrow')
  const headline = findComponent(components, 'headline')
  const subtitle = findComponent(components, 'subtitle')
  const primaryCta = findComponent(components, 'primaryCta')
  const secondaryCta = findComponent(components, 'secondaryCta')
  const heroImage = findComponent(components, 'heroImage')
  const trustBadges = findComponent(components, 'trustBadges')

  return {
    heading: {
      text: (headline?.props?.text as string) ?? HEADING_DEFAULTS.text,
      level: (headline?.props?.level as number) ?? HEADING_DEFAULTS.level,
      size: (headline?.props?.size as string) ?? HEADING_DEFAULTS.size,
      weight: (headline?.props?.weight as number) ?? HEADING_DEFAULTS.weight,
    },
    subheading: (subtitle?.props?.text as string) ?? '',
    cta: {
      text: (primaryCta?.props?.text as string) ?? CTA_DEFAULTS.text,
      url: (primaryCta?.props?.url as string) ?? CTA_DEFAULTS.url,
      show: primaryCta?.enabled ?? true,
    },
    secondaryCta: secondaryCta && secondaryCta.enabled
      ? {
          text: (secondaryCta.props?.text as string) ?? '',
          url: (secondaryCta.props?.url as string) ?? '',
        }
      : undefined,
    badge: eyebrow
      ? {
          text: (eyebrow.props?.text as string) ?? '',
          show: eyebrow.enabled,
        }
      : undefined,
    image: heroImage
      ? {
          url: (heroImage.props?.url as string) ?? '',
          alt: (heroImage.props?.alt as string) ?? '',
          show: heroImage.enabled,
        }
      : undefined,
    trustBadges: trustBadges
      ? {
          text: (trustBadges.props?.text as string) ?? '',
          show: trustBadges.enabled,
        }
      : undefined,
  }
}

/**
 * Resolves hero content from a section. Prefers components[] (new structure),
 * falls back to content (legacy structure).
 */
export function resolveHeroContent(section: Section): HeroContent {
  if (section.components.length > 0) {
    return componentsToHeroContent(section.components)
  }
  return section.content as HeroContent
}
