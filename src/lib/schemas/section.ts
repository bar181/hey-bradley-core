import { z } from 'zod'
import { layoutSchema } from './layout'
import { styleSchema } from './style'

export const sectionTypeSchema = z.enum([
  'hero', 'features', 'pricing', 'cta', 'footer',
  'testimonials', 'faq', 'value_props',
])

export type SectionType = z.infer<typeof sectionTypeSchema>

export const heroContentSchema = z.object({
  heading: z.object({
    text: z.string().default('Ship Code at the Speed of Thought'),
    level: z.number().default(1),
    size: z.string().default('48px'),
    weight: z.number().default(700),
  }).default({}),
  subheading: z.string().default('Build AI-native experiences that transform how we create.'),
  cta: z.object({
    text: z.string().default('Get Started'),
    url: z.string().default('#pricing'),
  }).default({}),
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
  })).default([]),
})

export const ctaContentSchema = z.object({
  heading: z.string().default('Ready to start?'),
  subheading: z.string().optional(),
  button: z.object({
    text: z.string().default('Launch Now'),
    url: z.string().default('#signup'),
  }),
})

export const sectionSchema = z.object({
  type: sectionTypeSchema,
  id: z.string(),
  variant: z.string().optional(),
  layout: layoutSchema,
  content: z.record(z.unknown()).default({}),
  style: styleSchema,
  enabled: z.boolean().default(true),
})

export type Section = z.infer<typeof sectionSchema>
