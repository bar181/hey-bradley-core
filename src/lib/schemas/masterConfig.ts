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
}

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
})

export type Site = z.infer<typeof siteSchema>

// ---------------------------------------------------------------------------
// Theme schema (Level 2: visual defaults for all sections)
// ---------------------------------------------------------------------------

const COLORS_DEFAULTS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#22d3ee',
  background: '#0a0a0f',
  surface: '#1e293b',
  text: '#f8fafc',
  muted: '#94a3b8',
  border: '#334155',
}

export const themeColorsSchema = z.object({
  primary: z.string().default(COLORS_DEFAULTS.primary),
  secondary: z.string().default(COLORS_DEFAULTS.secondary),
  accent: z.string().default(COLORS_DEFAULTS.accent),
  background: z.string().default(COLORS_DEFAULTS.background),
  surface: z.string().default(COLORS_DEFAULTS.surface),
  text: z.string().default(COLORS_DEFAULTS.text),
  muted: z.string().default(COLORS_DEFAULTS.muted),
  border: z.string().default(COLORS_DEFAULTS.border),
  success: z.string().optional(),
  warning: z.string().optional(),
  error: z.string().optional(),
})

export type ThemeColors = z.infer<typeof themeColorsSchema>

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
  colors: themeColorsSchema.optional(),
  alternativePalettes: z.array(alternativePaletteSchema).optional(),
  typography: themeTypographySchema.default(() => ({ ...TYPOGRAPHY_DEFAULTS })),
  spacing: themeSpacingSchema.default(() => ({ ...SPACING_DEFAULTS })),
  borderRadius: z.string().default('12px'),
})

export type Theme = z.infer<typeof themeSchema>

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
})

export type MasterConfig = z.infer<typeof masterConfigSchema>
