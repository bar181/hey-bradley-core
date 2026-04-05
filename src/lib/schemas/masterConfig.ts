import { z } from 'zod'
import { sectionSchema } from './section'

// ---------------------------------------------------------------------------
// Site schema (Level 1: global metadata, non-visual)
// ---------------------------------------------------------------------------

const SITE_DEFAULTS = {
  title: '',
  description: '',
  author: '',
  email: '',
  domain: '',
  project: '',
  version: '1.0.0-RC1',
  spec: 'aisp-1.2' as const,
  purpose: 'marketing' as const,
  audience: 'consumer' as const,
  tone: 'casual' as const,
  brandName: '',
  tagline: '',
  voiceAttributes: [] as string[],
}

export const sitePurposeSchema = z.enum(['marketing', 'portfolio', 'saas', 'blog', 'agency', 'restaurant'])
export const siteAudienceSchema = z.enum(['consumer', 'business', 'developer', 'enterprise'])
export const siteToneSchema = z.enum(['formal', 'casual', 'playful', 'technical', 'warm', 'bold'])

export type SitePurpose = z.infer<typeof sitePurposeSchema>
export type SiteAudience = z.infer<typeof siteAudienceSchema>
export type SiteTone = z.infer<typeof siteToneSchema>

export const siteSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  author: z.string().default(''),
  email: z.string().default(''),
  domain: z.string().default(''),
  project: z.string().default(''),
  version: z.string().default('1.0.0-RC1'),
  spec: z.literal('aisp-1.2').default('aisp-1.2'),
  favicon: z.string().optional(),
  ogImage: z.string().optional(),
  purpose: sitePurposeSchema.optional().default('marketing'),
  audience: siteAudienceSchema.optional().default('consumer'),
  tone: siteToneSchema.optional().default('casual'),
  brandName: z.string().optional().default(''),
  tagline: z.string().optional().default(''),
  voiceAttributes: z.array(z.string()).optional().default([]),
})

export type Site = z.infer<typeof siteSchema>

// ---------------------------------------------------------------------------
// Theme schema (Level 2: visual defaults for all sections)
// ---------------------------------------------------------------------------

const TYPOGRAPHY_DEFAULTS = {
  fontFamily: 'Inter',
  headingFamily: 'Inter',
  headingWeight: 700,
  baseSize: '16px',
  lineHeight: 1.7,
}

export const themeTypographySchema = z.object({
  fontFamily: z.string().default(TYPOGRAPHY_DEFAULTS.fontFamily),
  headingFamily: z.string().default(TYPOGRAPHY_DEFAULTS.headingFamily),
  headingWeight: z.number().default(TYPOGRAPHY_DEFAULTS.headingWeight),
  baseSize: z.string().default(TYPOGRAPHY_DEFAULTS.baseSize),
  lineHeight: z.number().default(TYPOGRAPHY_DEFAULTS.lineHeight),
})

export type ThemeTypography = z.infer<typeof themeTypographySchema>

const SPACING_DEFAULTS = {
  sectionPadding: '64px',
  containerMaxWidth: '1280px',
  componentGap: '24px',
}

export const themeSpacingSchema = z.object({
  sectionPadding: z.string().default(SPACING_DEFAULTS.sectionPadding),
  containerMaxWidth: z.string().default(SPACING_DEFAULTS.containerMaxWidth),
  componentGap: z.string().default(SPACING_DEFAULTS.componentGap),
})

export type ThemeSpacing = z.infer<typeof themeSpacingSchema>

// ---------------------------------------------------------------------------
// 6-slot palette (ADR-019)
// ---------------------------------------------------------------------------

export const paletteSchema = z.object({
  bgPrimary: z.string(),
  bgSecondary: z.string(),
  textPrimary: z.string(),
  textSecondary: z.string(),
  accentPrimary: z.string(),
  accentSecondary: z.string(),
})

export type Palette = z.infer<typeof paletteSchema>

export const alternativePaletteSchema = paletteSchema.extend({
  name: z.string(),
})

export type AlternativePalette = z.infer<typeof alternativePaletteSchema>

// ---------------------------------------------------------------------------
// Theme meta (ADR-018)
// ---------------------------------------------------------------------------

export const themeMetaSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  mood: z.string(),
  heroVariant: z.string(),
})

export type ThemeMeta = z.infer<typeof themeMetaSchema>

// ---------------------------------------------------------------------------
// Theme schema (Level 2: visual defaults for all sections)
// ---------------------------------------------------------------------------

export const themeSchema = z.object({
  preset: z.string().default(''),
  mode: z.enum(['light', 'dark']).default('dark'),
  palette: paletteSchema.optional(),
  alternatePalette: paletteSchema.optional(),
  alternativePalettes: z.array(alternativePaletteSchema).optional(),
  typography: themeTypographySchema.default(() => ({ ...TYPOGRAPHY_DEFAULTS })),
  spacing: themeSpacingSchema.default(() => ({ ...SPACING_DEFAULTS })),
  borderRadius: z.string().default('12px'),
})

export type Theme = z.infer<typeof themeSchema>

// ---------------------------------------------------------------------------
// Page schema (ADR-035: Multi-Page Architecture)
// ---------------------------------------------------------------------------

export const pageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  isHome: z.boolean().optional().default(false),
  sections: z.array(sectionSchema).default(() => []),
})

export type PageConfig = z.infer<typeof pageSchema>

// ---------------------------------------------------------------------------
// Master config (three-level hierarchy: site + theme + sections)
// ---------------------------------------------------------------------------

export const masterConfigSchema = z.object({
  site: siteSchema.default(() => ({ ...SITE_DEFAULTS })),
  theme: themeSchema.default(() => ({
    preset: '',
    mode: 'dark' as const,
    typography: { ...TYPOGRAPHY_DEFAULTS },
    spacing: { ...SPACING_DEFAULTS },
    borderRadius: '12px',
  })),
  sections: z.array(sectionSchema).default(() => []),
  pages: z.array(pageSchema).optional(),
})

export type MasterConfig = z.infer<typeof masterConfigSchema>
