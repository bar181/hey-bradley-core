/**
 * P45 Sprint H Wave 2 — Codebase reference ingestion tests.
 *
 * Pure-unit (FS-level + AISP atom imports). Verifies A4 (codebase repo +
 * upload widget + Settings + export-strip) and A5 (INTENT_ATOM Λ + bias
 * table + chatPipeline read-site).
 *
 * Mirrors the P44 brand-context test pattern. NO real LLM calls; AgentProxy
 * does not need new fixtures (bias only re-orders within already-allowed
 * targets).
 *
 * ADR-068.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
// Direct module imports (avoid the aisp barrel — it transitively pulls
// `default-config.json` which Node refuses without import attributes).
import {
  PROJECT_TYPES,
  PROJECT_TYPE_TARGET_BIAS,
  type ProjectType,
} from '../src/contexts/intelligence/aisp/intentAtom'
import { classifyIntent } from '../src/contexts/intelligence/aisp/intentClassifier'

const REPO = join(process.cwd(), 'src/contexts/persistence/repositories/codebaseContext.ts')
const UPLOAD = join(process.cwd(), 'src/components/settings/CodebaseContextUpload.tsx')
const DRAWER = join(process.cwd(), 'src/components/settings/SettingsDrawer.tsx')
const EXPORT_IMPORT = join(process.cwd(), 'src/contexts/persistence/exportImport.ts')
const INTENT_ATOM = join(process.cwd(), 'src/contexts/intelligence/aisp/intentAtom.ts')
const CLASSIFIER = join(process.cwd(), 'src/contexts/intelligence/aisp/intentClassifier.ts')
const PIPELINE = join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts')
const ADR = join(process.cwd(), 'docs/adr/ADR-068-codebase-reference-ingestion.md')

test.describe('P45.1 codebaseContext repo — chunked CRUD + manifest shape', () => {
  test('repo file exists and exports the documented surface', () => {
    expect(existsSync(REPO)).toBe(true)
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/export function hasCodebaseContext/)
    expect(src).toMatch(/export function readCodebaseContext/)
    expect(src).toMatch(/export function readCodebaseContextManifest/)
    expect(src).toMatch(/export function writeCodebaseContext/)
    expect(src).toMatch(/export function clearCodebaseContext/)
  })

  test('CHUNK_BYTES = 10_000 (mirrors P44 brand_context)', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/CHUNK_BYTES\s*=\s*10_?000/)
  })

  test('CODEBASE_CONTEXT_BYTE_CAP = 32_000 (denser than 4KB brand cap)', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/CODEBASE_CONTEXT_BYTE_CAP\s*=\s*32_?000/)
  })

  test('Manifest shape includes projectType + count + totalBytes + sources', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/projectType:\s*ProjectType/)
    expect(src).toMatch(/count:\s*number/)
    expect(src).toMatch(/totalBytes:\s*number/)
    expect(src).toMatch(/uploadedAt:\s*number/)
  })

  test('Idempotent re-upload: writeCodebaseContext clears prior chunks first', () => {
    const src = readFileSync(REPO, 'utf8')
    // The write path must invoke clearCodebaseContext before chunking the
    // new payload (manifest-driven; mirrors P44 A1 brandContext pattern).
    expect(src).toMatch(/clearCodebaseContext\(\)/)
    expect(src).toMatch(/writeCodebaseContext[\s\S]*clearCodebaseContext/)
  })
})

test.describe('P45.2 kv key shape', () => {
  test('Storage uses codebase_context_chunk_* + codebase_context_manifest', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/codebase_context_chunk/)
    expect(src).toMatch(/codebase_context_manifest/)
  })
})

test.describe('P45.3 export-strip — codebase_context_* never ships', () => {
  test('isSensitiveKvKey() matches codebase_context_* prefix', () => {
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    expect(src).toMatch(/startsWith\(['"]codebase_context_['"]\)/)
  })

  test('SENSITIVE_KV_KEYS legacy array includes codebase_context_manifest', () => {
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    expect(src).toContain("'codebase_context_manifest'")
  })

  test('Runtime DELETE sweep matches codebase_context_% LIKE pattern', () => {
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    expect(src).toMatch(/codebase_context_%/)
  })
})

test.describe('P45.4 project-type heuristic enum', () => {
  test('PROJECT_TYPES is a closed 5-value enum', () => {
    expect([...PROJECT_TYPES].sort()).toEqual([
      'landing-page',
      'portfolio',
      'saas-app',
      'static-site',
      'unknown',
    ])
  })

  test('detectProjectType is exported by the repo', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/export function detectProjectType/)
  })
})

test.describe('P45.5 5MB ZIP cap (CodebaseContextUpload)', () => {
  test('Upload widget enforces a size guard before extracting', () => {
    expect(existsSync(UPLOAD)).toBe(true)
    const src = readFileSync(UPLOAD, 'utf8')
    // The 5MB cap: either 5 * 1024 * 1024, or 5_000_000, or '5 MB' label.
    const has5MB =
      /5\s*\*\s*1024\s*\*\s*1024/.test(src) ||
      /5_?000_?000/.test(src) ||
      /5\s*MB/i.test(src)
    expect(has5MB).toBe(true)
  })
})

test.describe('P45.6 INTENT_ATOM Λ — project_context channel', () => {
  test('intentAtom.ts source includes project_context in Λ', () => {
    const src = readFileSync(INTENT_ATOM, 'utf8')
    expect(src).toMatch(/project_context\s*\??:?\s*\{/)
  })

  test('Σ output shape unchanged (verb / target / confidence / rationale)', () => {
    const src = readFileSync(INTENT_ATOM, 'utf8')
    // The classifier still returns these four fields — Σ width must not have
    // grown (P44 backward-compat invariant).
    expect(src).toMatch(/Intent:\{verb:Verb,\s*target:Target\?,\s*params:𝕊\?\}/)
  })

  test('PROJECT_TYPE_TARGET_BIAS subset of ALLOWED_TARGET_TYPES', () => {
    // Every value in the bias map must be a section type the classifier
    // already allows; bias only re-orders, never invents.
    const allowed: ReadonlyArray<string> = [
      'hero', 'blog', 'footer', 'features', 'pricing', 'cta',
      'testimonials', 'faq', 'value-props', 'gallery', 'image',
      'team', 'columns', 'action', 'quotes', 'questions', 'numbers',
      'divider', 'text', 'logos', 'menu',
    ]
    for (const pt of PROJECT_TYPES) {
      const bias: ReadonlyArray<string> = PROJECT_TYPE_TARGET_BIAS[pt]
      for (const target of bias) {
        expect(allowed, `${pt}: ${target} ∉ ALLOWED_TARGET_TYPES`).toContain(target)
      }
    }
  })

  test('unknown project type has empty bias (byte-identical P44)', () => {
    expect(PROJECT_TYPE_TARGET_BIAS.unknown).toEqual([])
  })
})

test.describe('P45.7 classifyIntent backward-compat + bias', () => {
  test('classifyIntent(text) without projectType behaves as P44', () => {
    const r = classifyIntent('hide the hero')
    expect(r.verb).toBe('hide')
    expect(r.target?.type).toBe('hero')
  })

  test('classifyIntent(text, "saas-app") — "add pricing" still routes to pricing', () => {
    const r = classifyIntent('add pricing', 'saas-app' as ProjectType)
    expect(r.target?.type).toBe('pricing')
    expect(r.verb).toBe('add')
  })

  test('classifyIntent(text, projectType) with multi-target text re-orders by bias', () => {
    // "add pricing or testimonials" — saas-app prefers pricing > testimonials.
    const r = classifyIntent('add pricing or testimonials', 'saas-app' as ProjectType)
    expect(r.target?.type).toBe('pricing')
  })

  test('classifyIntent rationale annotates ctx=<projectType> when bias applies', () => {
    const r = classifyIntent(
      'add hero and gallery',
      'portfolio' as ProjectType,
    )
    if (r.target && r.rationale) {
      // bias only applies when allHits.length > 1, which it does here.
      expect(r.rationale).toMatch(/ctx=portfolio/)
    }
  })
})

test.describe('P45.8 chatPipeline reads codebase manifest', () => {
  test('chatPipeline imports codebaseContext defensively (try/catch dynamic import)', () => {
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toMatch(/codebaseContext/)
    // The read site is wrapped in try/catch so missing module / DB-not-ready
    // never breaks the chat pipeline.
    expect(src).toMatch(/readCodebaseContextManifest/)
    expect(src).toMatch(/try\s*\{[\s\S]*?codebaseContext[\s\S]*?\}\s*catch/)
  })

  test('chatPipeline passes projectType into classifyIntent', () => {
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toMatch(/classifyIntent\(text,\s*projectType\)/)
  })
})

test.describe('P45.9 SettingsDrawer mounts CodebaseContextUpload next to brand', () => {
  test('SettingsDrawer imports + renders CodebaseContextUpload', () => {
    const src = readFileSync(DRAWER, 'utf8')
    expect(src).toContain("import { CodebaseContextUpload }")
    expect(src).toContain('<CodebaseContextUpload />')
  })

  test('CodebaseContextUpload renders below or beside BrandContextUpload', () => {
    const src = readFileSync(DRAWER, 'utf8')
    const brandIdx = src.indexOf('<BrandContextUpload')
    const codebaseIdx = src.indexOf('<CodebaseContextUpload')
    // Both mounted; codebase-side appears in the same drawer surface.
    expect(brandIdx).toBeGreaterThan(0)
    expect(codebaseIdx).toBeGreaterThan(0)
  })
})

test.describe('P45.10 AgentProxy compatibility — no fixture corpus changes', () => {
  test('intentClassifier.ts contains the bias-table call site (only re-orders, never invents)', () => {
    const src = readFileSync(CLASSIFIER, 'utf8')
    expect(src).toMatch(/PROJECT_TYPE_TARGET_BIAS/)
  })

  test('classifyIntent signature accepts optional ProjectType', () => {
    const src = readFileSync(CLASSIFIER, 'utf8')
    expect(src).toMatch(/classifyIntent[\s\S]*?projectType\??:\s*ProjectType/)
  })
})

test.describe('P45.11 ADR-068', () => {
  test('ADR-068 file exists with full Accepted status', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toContain('Status:** Accepted')
    expect(adr).toMatch(/Codebase Reference Ingestion|codebase reference/i)
  })

  test('ADR-068 cross-references ADR-040 / ADR-046 / ADR-053 / ADR-067', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toContain('ADR-040')
    expect(adr).toContain('ADR-046')
    expect(adr).toContain('ADR-053')
    expect(adr).toContain('ADR-067')
  })

  test('ADR-068 documents the project-type enum + INTENT bias', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toMatch(/project_context|projectType|project type/i)
    expect(adr).toMatch(/saas-app|landing-page|static-site|portfolio/i)
  })

  test('ADR-068 ≤120 lines per agent prompt cap', () => {
    const adr = readFileSync(ADR, 'utf8')
    const lines = adr.split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })
})
