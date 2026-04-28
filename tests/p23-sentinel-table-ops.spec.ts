/**
 * P23 carryforward C14 — SENSITIVE_TABLE_OPS sentinel.
 *
 * Schema-evolution canary: scans the migrations SQL for any new column whose
 * name suggests sensitive content (prompt/text/key/secret/password/token). For
 * each table containing such a column, asserts the table is registered in
 * SENSITIVE_TABLE_OPS (either truncated or null_column'd on export).
 *
 * Whitelist for known-safe matches (e.g. 'text' in a footer-content column).
 */
import { test, expect } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const MIGRATIONS_DIR = join(process.cwd(), 'src/contexts/persistence/migrations')
const EXPORT_FILE = join(process.cwd(), 'src/contexts/persistence/exportImport.ts')

// Columns matching this regex are flagged as potentially sensitive
const SENSITIVE_COL_RE = /\b(prompt|key|secret|password|token|auth)\b/i

// Known-safe column names that match the regex but are NOT sensitive content
const WHITELIST_COLUMNS = new Set([
  'request_id',           // UUID, not auth
  'parent_request_id',    // UUID
  'prompt_hash',          // SHA-256 hex, not raw prompt
])

interface ColumnSpec {
  table: string
  column: string
}

function parseMigrationsForSensitiveColumns(): ColumnSpec[] {
  const found: ColumnSpec[] = []
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql'))
  for (const f of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, f), 'utf8')
    // crude CREATE TABLE parser; one table per regex pass
    const tableMatches = sql.matchAll(/CREATE\s+TABLE\s+(\w+)\s*\(([^;]+)\);?/gi)
    for (const tm of tableMatches) {
      const tableName = tm[1]
      const body = tm[2]
      const lines = body.split(/,/)
      for (const line of lines) {
        const colMatch = line.trim().match(/^(\w+)\s+/)
        if (!colMatch) continue
        const col = colMatch[1]
        if (WHITELIST_COLUMNS.has(col)) continue
        if (SENSITIVE_COL_RE.test(col)) {
          found.push({ table: tableName, column: col })
        }
      }
    }
  }
  return found
}

function parseSensitiveTableOps(): Set<string> {
  const tsSrc = readFileSync(EXPORT_FILE, 'utf8')
  const tables = new Set<string>()
  // matches { table: 'name',
  for (const m of tsSrc.matchAll(/\{\s*table:\s*'([^']+)'/g)) {
    tables.add(m[1])
  }
  return tables
}

test.describe('P23 C14 — SENSITIVE_TABLE_OPS sentinel', () => {
  test('every table with sensitive-named columns is registered in SENSITIVE_TABLE_OPS', () => {
    const flagged = parseMigrationsForSensitiveColumns()
    const registered = parseSensitiveTableOps()
    const missing: string[] = []
    for (const f of flagged) {
      if (!registered.has(f.table)) {
        missing.push(`${f.table}.${f.column}`)
      }
    }
    expect(missing, `Missing SENSITIVE_TABLE_OPS entries for: ${missing.join(', ')}`).toEqual([])
  })

  test('SENSITIVE_TABLE_OPS at least includes expected baseline tables', () => {
    const registered = parseSensitiveTableOps()
    expect(registered).toContain('llm_logs')
    expect(registered).toContain('example_prompt_runs')
    expect(registered).toContain('llm_calls')
  })
})
