#!/usr/bin/env node
/**
 * validate-json.mjs — Validates all data JSON files against Zod schemas.
 *
 * Theme files:   validated against themeMetaSchema + themeSchema + sectionSchema[]
 * Example files:  validated against the full masterConfigSchema
 * Palettes:       basic structure check (object with theme-keyed arrays of 6-slot palettes)
 * Fonts:          basic structure check (object with fonts array)
 * Media files:    basic structure check (object with expected top-level keys)
 *
 * Usage:  node scripts/validate-json.mjs
 * Exit 0 on all pass, exit 1 on any failure.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// ---------------------------------------------------------------------------
// Inline Zod-compatible validation (mirrors src/lib/schemas)
// We cannot import .ts directly from .mjs, so we duplicate the essential
// shape checks here using a lightweight approach. For CI, we dynamically
// import Zod from node_modules and reconstruct the schemas.
// ---------------------------------------------------------------------------

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const DATA = join(ROOT, 'src', 'data')

// Dynamic import of zod from the project's node_modules
const { z } = await import('zod')

// ---------------------------------------------------------------------------
// Schema definitions (mirrors src/lib/schemas/*)
// ---------------------------------------------------------------------------

const layoutSchema = z.object({
  display: z.enum(['flex', 'grid']).default('flex'),
  direction: z.enum(['row', 'column']).optional(),
  align: z.enum(['center', 'start', 'end', 'stretch']).optional(),
  justify: z.enum(['center', 'start', 'end', 'between', 'around']).optional(),
  gap: z.string().default('24px'),
  padding: z.string().default('64px'),
  maxWidth: z.string().optional(),
  columns: z.number().optional(),
})

const styleSchema = z.object({
  background: z.string().default('#0a0a0f'),
  color: z.string().default('#f8fafc'),
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional(),
})

const sectionTypeSchema = z.enum([
  'hero', 'menu', 'columns', 'pricing', 'action', 'footer',
  'quotes', 'questions', 'numbers', 'gallery', 'logos', 'team',
  'image', 'divider', 'text',
])

const componentSchema = z.object({
  id: z.string(),
  type: z.string(),
  enabled: z.boolean().default(true),
  order: z.number().default(0),
  props: z.record(z.string(), z.unknown()).default(() => ({})),
})

const sectionSchema = z.object({
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

const paletteSchema = z.object({
  bgPrimary: z.string(),
  bgSecondary: z.string(),
  textPrimary: z.string(),
  textSecondary: z.string(),
  accentPrimary: z.string(),
  accentSecondary: z.string(),
})

const alternativePaletteSchema = paletteSchema.extend({
  name: z.string(),
})

const themeTypographySchema = z.object({
  fontFamily: z.string().default('Inter'),
  headingFamily: z.string().default('Inter'),
  headingWeight: z.number().default(700),
  baseSize: z.string().default('16px'),
  lineHeight: z.number().default(1.7),
})

const themeSpacingSchema = z.object({
  sectionPadding: z.string().default('64px'),
  containerMaxWidth: z.string().default('1280px'),
  componentGap: z.string().default('24px'),
})

const themeSchema = z.object({
  preset: z.string().default(''),
  mode: z.enum(['light', 'dark']).default('dark'),
  palette: paletteSchema.optional(),
  alternatePalette: paletteSchema.optional(),
  alternativePalettes: z.array(alternativePaletteSchema).optional(),
  typography: themeTypographySchema.default(() => ({
    fontFamily: 'Inter', headingFamily: 'Inter', headingWeight: 700,
    baseSize: '16px', lineHeight: 1.7,
  })),
  spacing: themeSpacingSchema.default(() => ({
    sectionPadding: '64px', containerMaxWidth: '1280px', componentGap: '24px',
  })),
  borderRadius: z.string().default('12px'),
})

const siteSchema = z.object({
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

const masterConfigSchema = z.object({
  site: siteSchema.default(() => ({
    title: '', description: '', author: '', email: '',
    domain: '', project: '', version: '1.0.0-RC1', spec: 'aisp-1.2',
  })),
  theme: themeSchema.default(() => ({
    preset: '', mode: 'dark',
    typography: { fontFamily: 'Inter', headingFamily: 'Inter', headingWeight: 700, baseSize: '16px', lineHeight: 1.7 },
    spacing: { sectionPadding: '64px', containerMaxWidth: '1280px', componentGap: '24px' },
    borderRadius: '12px',
  })),
  sections: z.array(sectionSchema).default(() => []),
})

const themeMetaSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  mood: z.string(),
  heroVariant: z.string(),
})

// Theme file schema: meta + theme + sections
const themeFileSchema = z.object({
  meta: themeMetaSchema,
  theme: themeSchema,
  sections: z.array(sectionSchema).default(() => []),
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read and parse a JSON file. Returns { ok, data?, error? } */
function loadJson(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8')
    return { ok: true, data: JSON.parse(raw) }
  } catch (err) {
    return { ok: false, error: `Parse error: ${err.message}` }
  }
}

/** Format Zod errors into readable lines. */
function formatZodErrors(zodError) {
  return zodError.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(root)'
    return `  [${path}] ${issue.message}`
  }).join('\n')
}

// ---------------------------------------------------------------------------
// Results accumulator
// ---------------------------------------------------------------------------

const results = []
let failures = 0

function report(file, status, errors) {
  const relPath = relative(ROOT, file)
  results.push({ file: relPath, status, errors })
  if (status === 'FAIL') failures++
}

// ---------------------------------------------------------------------------
// 1. Validate theme files
// ---------------------------------------------------------------------------

const themesDir = join(DATA, 'themes')
const themeFiles = readdirSync(themesDir).filter((f) => f.endsWith('.json'))

for (const file of themeFiles) {
  const filePath = join(themesDir, file)
  const loaded = loadJson(filePath)
  if (!loaded.ok) {
    report(filePath, 'FAIL', loaded.error)
    continue
  }

  const result = themeFileSchema.safeParse(loaded.data)
  if (result.success) {
    report(filePath, 'PASS', null)
  } else {
    report(filePath, 'FAIL', formatZodErrors(result.error))
  }
}

// ---------------------------------------------------------------------------
// 2. Validate example files (full MasterConfig)
// ---------------------------------------------------------------------------

const examplesDir = join(DATA, 'examples')
const exampleFiles = readdirSync(examplesDir).filter((f) => f.endsWith('.json'))

for (const file of exampleFiles) {
  const filePath = join(examplesDir, file)
  const loaded = loadJson(filePath)
  if (!loaded.ok) {
    report(filePath, 'FAIL', loaded.error)
    continue
  }

  const result = masterConfigSchema.safeParse(loaded.data)
  if (result.success) {
    report(filePath, 'PASS', null)
  } else {
    report(filePath, 'FAIL', formatZodErrors(result.error))
  }
}

// ---------------------------------------------------------------------------
// 3. Validate default-config.json and template-config.json
// ---------------------------------------------------------------------------

for (const name of ['default-config.json', 'template-config.json']) {
  const filePath = join(DATA, name)
  const loaded = loadJson(filePath)
  if (!loaded.ok) {
    report(filePath, 'FAIL', loaded.error)
    continue
  }

  const result = masterConfigSchema.safeParse(loaded.data)
  if (result.success) {
    report(filePath, 'PASS', null)
  } else {
    report(filePath, 'FAIL', formatZodErrors(result.error))
  }
}

// ---------------------------------------------------------------------------
// 4. Validate palettes/palettes.json (basic structure)
// ---------------------------------------------------------------------------

{
  const filePath = join(DATA, 'palettes', 'palettes.json')
  const loaded = loadJson(filePath)
  if (!loaded.ok) {
    report(filePath, 'FAIL', loaded.error)
  } else {
    const data = loaded.data
    const errors = []

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push('  Expected top-level object keyed by theme slug')
    } else {
      for (const [slug, palettes] of Object.entries(data)) {
        if (!Array.isArray(palettes)) {
          errors.push(`  [${slug}] Expected array of palette objects`)
          continue
        }
        for (let i = 0; i < palettes.length; i++) {
          const p = palettes[i]
          const required = ['name', 'bgPrimary', 'bgSecondary', 'textPrimary', 'textSecondary', 'accentPrimary', 'accentSecondary']
          const missing = required.filter((k) => typeof p[k] !== 'string')
          if (missing.length > 0) {
            errors.push(`  [${slug}][${i}] Missing: ${missing.join(', ')}`)
          }
        }
      }
    }

    report(filePath, errors.length > 0 ? 'FAIL' : 'PASS', errors.length > 0 ? errors.join('\n') : null)
  }
}

// ---------------------------------------------------------------------------
// 5. Validate fonts/fonts.json (basic structure)
// ---------------------------------------------------------------------------

{
  const filePath = join(DATA, 'fonts', 'fonts.json')
  const loaded = loadJson(filePath)
  if (!loaded.ok) {
    report(filePath, 'FAIL', loaded.error)
  } else {
    const data = loaded.data
    const errors = []

    if (!data.fonts || !Array.isArray(data.fonts)) {
      errors.push('  Expected { fonts: [...] } structure')
    } else {
      for (let i = 0; i < data.fonts.length; i++) {
        const f = data.fonts[i]
        if (!f.name || typeof f.name !== 'string') {
          errors.push(`  [fonts][${i}] Missing or invalid "name"`)
        }
        if (!f.category || typeof f.category !== 'string') {
          errors.push(`  [fonts][${i}] Missing or invalid "category"`)
        }
        if (!Array.isArray(f.weights)) {
          errors.push(`  [fonts][${i}] Missing or invalid "weights" array`)
        }
      }
    }

    report(filePath, errors.length > 0 ? 'FAIL' : 'PASS', errors.length > 0 ? errors.join('\n') : null)
  }
}

// ---------------------------------------------------------------------------
// 6. Validate media files (basic structure)
// ---------------------------------------------------------------------------

const mediaFiles = ['media.json', 'images.json', 'videos.json', 'effects.json']

for (const name of mediaFiles) {
  const filePath = join(DATA, 'media', name)
  const loaded = loadJson(filePath)
  if (!loaded.ok) {
    report(filePath, 'FAIL', loaded.error)
    continue
  }

  const data = loaded.data
  const errors = []

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    errors.push('  Expected top-level object')
  }

  // Specific checks per file
  if (name === 'videos.json' && !Array.isArray(data.videos)) {
    errors.push('  Expected "videos" array')
  }
  if (name === 'effects.json' && !Array.isArray(data.effects)) {
    errors.push('  Expected "effects" array')
  }
  if (name === 'images.json' && typeof data !== 'object') {
    errors.push('  Expected object with image categories')
  }
  if (name === 'media.json' && typeof data !== 'object') {
    errors.push('  Expected object with media entries')
  }

  report(filePath, errors.length > 0 ? 'FAIL' : 'PASS', errors.length > 0 ? errors.join('\n') : null)
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\n========================================')
console.log('  Hey Bradley — JSON Validation Report')
console.log('========================================\n')

const maxLen = Math.max(...results.map((r) => r.file.length))

for (const r of results) {
  const icon = r.status === 'PASS' ? 'PASS' : 'FAIL'
  console.log(`  [${icon}] ${r.file.padEnd(maxLen + 2)}`)
  if (r.errors) {
    console.log(r.errors)
  }
}

console.log(`\n  Total: ${results.length}  |  Pass: ${results.length - failures}  |  Fail: ${failures}\n`)

if (failures > 0) {
  console.log('  Validation FAILED. Fix errors above before committing.\n')
  process.exit(1)
} else {
  console.log('  All files valid.\n')
  process.exit(0)
}
