/**
 * P33+ fix-pass-3 — addresses R3 Security must-fix items.
 *
 * Pure-unit (no browser; no sql.js boot — source-level reads + regex assertions).
 * The runtime userTemplates repo can't be imported here because it transitively
 * pulls Vite's import.meta.glob via migrations/index.ts; same FS-level pattern
 * used by p30-template-persistence.spec.ts and p23-sentinel-table-ops.spec.ts.
 *
 * - R3 F1: importBundle truncates user_templates after migration
 * - R3 F2: createUserTemplate id allowlist + RESERVED_IDS guard
 * - R3 F3: payload + examples size caps + row count cap
 * - R3 L4: resolveTargetPath sectionType allowlist
 * - R3 L5: listUserTemplates LIMIT cap
 *
 * Cross-ref: phase-33/deep-dive/03-security-review.md
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const REPO_FILE = join(
  process.cwd(),
  'src/contexts/persistence/repositories/userTemplates.ts',
)
const EXPORT_FILE = join(
  process.cwd(),
  'src/contexts/persistence/exportImport.ts',
)
const PIPELINE_FILE = join(
  process.cwd(),
  'src/contexts/intelligence/aisp/twoStepPipeline.ts',
)

test.describe('R3 F1 — importBundle user_templates truncate', () => {
  test('exportImport.ts truncates user_templates after runMigrations', () => {
    const src = readFileSync(EXPORT_FILE, 'utf8')
    expect(src).toMatch(/DELETE FROM user_templates/)
  })

  test('truncate runs AFTER example_prompts re-seed (symmetric pattern)', () => {
    const src = readFileSync(EXPORT_FILE, 'utf8')
    const examplePromptsIdx = src.indexOf('DELETE FROM example_prompts')
    const userTemplatesIdx = src.indexOf('DELETE FROM user_templates')
    expect(examplePromptsIdx).toBeGreaterThan(0)
    expect(userTemplatesIdx).toBeGreaterThan(examplePromptsIdx)
  })
})

test.describe('R3 F2 — id allowlist + RESERVED_IDS', () => {
  test('userTemplates.ts declares ID_ALLOWLIST_RE', () => {
    const src = readFileSync(REPO_FILE, 'utf8')
    expect(src).toMatch(/const ID_ALLOWLIST_RE\s*=\s*\/\^/)
  })

  test('userTemplates.ts declares RESERVED_IDS for all 4 registry templates', () => {
    const src = readFileSync(REPO_FILE, 'utf8')
    expect(src).toContain('make-it-brighter')
    expect(src).toContain('hide-section')
    expect(src).toContain('change-headline')
    expect(src).toContain('generate-headline')
    expect(src).toContain('RESERVED_IDS')
  })

  test('createUserTemplate enforces ID_ALLOWLIST_RE + RESERVED_IDS in body', () => {
    const src = readFileSync(REPO_FILE, 'utf8')
    expect(src).toMatch(/ID_ALLOWLIST_RE\.test\(input\.id\)/)
    expect(src).toMatch(/RESERVED_IDS\.has\(input\.id\)/)
  })
})

test.describe('R3 F3 — size + row count caps', () => {
  test('userTemplates.ts declares all 4 caps', () => {
    const src = readFileSync(REPO_FILE, 'utf8')
    expect(src).toMatch(/PAYLOAD_BYTES_CAP\s*=\s*64_?000/)
    expect(src).toMatch(/NAME_CHAR_CAP\s*=\s*200/)
    expect(src).toMatch(/EXAMPLES_BYTES_CAP\s*=\s*8_?000/)
    expect(src).toMatch(/ROW_COUNT_CAP\s*=\s*1_?000/)
  })

  test('createUserTemplate enforces caps on each input', () => {
    const src = readFileSync(REPO_FILE, 'utf8')
    expect(src).toContain('PAYLOAD_BYTES_CAP')
    expect(src).toContain('EXAMPLES_BYTES_CAP')
    expect(src).toContain('NAME_CHAR_CAP')
    expect(src).toContain('ROW_COUNT_CAP')
  })

  test('row count cap is checked BEFORE INSERT (DoS guard)', () => {
    const src = readFileSync(REPO_FILE, 'utf8')
    const insertIdx = src.indexOf('INSERT INTO user_templates')
    const rowCapIdx = src.indexOf('ROW_COUNT_CAP')
    expect(rowCapIdx).toBeGreaterThan(0)
    expect(insertIdx).toBeGreaterThan(rowCapIdx)
  })
})

test.describe('R3 L4 — resolveTargetPath sectionType validation', () => {
  test('SECTION_TYPE_RE allowlist guards path resolution', () => {
    const src = readFileSync(PIPELINE_FILE, 'utf8')
    expect(src).toContain('SECTION_TYPE_RE')
    expect(src).toMatch(/SECTION_TYPE_RE\.test\(sectionType\)/)
  })

  test('resolveTargetPath body returns null when sectionType fails allowlist', () => {
    const src = readFileSync(PIPELINE_FILE, 'utf8')
    expect(src).toMatch(/if\s*\(\s*!SECTION_TYPE_RE\.test\(sectionType\)\s*\)\s*return\s+null/)
  })
})

test.describe('R3 L5 — listUserTemplates LIMIT cap', () => {
  test('listUserTemplates query carries a LIMIT clause referencing the cap', () => {
    const src = readFileSync(REPO_FILE, 'utf8')
    expect(src).toMatch(/LIMIT\s+\$\{ROW_COUNT_CAP\}/)
  })
})
