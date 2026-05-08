/**
 * P30 Sprint D P2 — Typed CRUD over `user_templates`.
 *
 * Persists user-authored templates declared via `createTemplateFromConversation`.
 * The Library API (`templates/library.ts`) merges these with TEMPLATE_REGISTRY
 * to expose a unified browse surface.
 *
 * ADR-059. Migration 003-user-templates.sql.
 */
import { getDB, persist } from '../db'

export type UserTemplateCategory = 'theme' | 'section' | 'content'
export type UserTemplateKind = 'patcher' | 'generator'

export interface UserTemplateRow {
  id: string
  name: string
  category: UserTemplateCategory
  kind: UserTemplateKind
  examples_json: string
  payload_json: string
  created_at: number
  updated_at: number
}

const COLS = 'id, name, category, kind, examples_json, payload_json, created_at, updated_at'

/**
 * P33+ R3 fix-pass-3 (F2) — id allowlist + reserved-id ban.
 * Lowercase kebab-case, ≤ 64 chars. Reserved ids match registry templates so
 * a malicious bundle (or user typo) cannot shadow a built-in template. Keep
 * RESERVED_IDS in sync with TEMPLATE_REGISTRY.
 */
const ID_ALLOWLIST_RE = /^[a-z][a-z0-9-]{0,63}$/
const RESERVED_IDS = new Set([
  'make-it-brighter',
  'hide-section',
  'change-headline',
  'generate-headline',
])

/** P33+ R3 fix-pass-3 (F3) — IDB DoS guards. */
const PAYLOAD_BYTES_CAP = 64_000   // 64 KB per template
const NAME_CHAR_CAP = 200
const EXAMPLES_BYTES_CAP = 8_000
const ROW_COUNT_CAP = 1_000

export interface UserTemplateInput {
  id: string
  name: string
  category: UserTemplateCategory
  kind: UserTemplateKind
  examples: readonly string[]
  payload: Record<string, unknown>
}

export function createUserTemplate(input: UserTemplateInput): UserTemplateRow {
  if (!input.id || !input.name) throw new Error('[userTemplates] id + name required')
  // R3 F2 — allowlist + reserved-id check.
  if (!ID_ALLOWLIST_RE.test(input.id)) {
    throw new Error(
      `[userTemplates] invalid id: must match ${ID_ALLOWLIST_RE} (lowercase kebab, ≤ 64 chars)`,
    )
  }
  if (RESERVED_IDS.has(input.id)) {
    throw new Error(`[userTemplates] reserved id: ${input.id}`)
  }
  if (input.name.length > NAME_CHAR_CAP) {
    throw new Error(`[userTemplates] name exceeds ${NAME_CHAR_CAP} chars`)
  }
  // R3 F3 — payload + examples size caps.
  const examplesJson = JSON.stringify(input.examples ?? [])
  const payloadJson = JSON.stringify(input.payload)
  if (examplesJson.length > EXAMPLES_BYTES_CAP) {
    throw new Error(`[userTemplates] examples_json exceeds ${EXAMPLES_BYTES_CAP} bytes`)
  }
  if (payloadJson.length > PAYLOAD_BYTES_CAP) {
    throw new Error(`[userTemplates] payload_json exceeds ${PAYLOAD_BYTES_CAP} bytes`)
  }
  // R3 F3 — row count cap (DoS via mass insert).
  const db = getDB()
  const countStmt = db.prepare('SELECT COUNT(*) AS c FROM user_templates')
  let rowCount = 0
  try {
    if (countStmt.step()) {
      const r = countStmt.getAsObject() as { c?: number }
      rowCount = typeof r.c === 'number' ? r.c : 0
    }
  } finally {
    countStmt.free()
  }
  if (rowCount >= ROW_COUNT_CAP) {
    throw new Error(`[userTemplates] row count cap reached (${ROW_COUNT_CAP}); delete some first`)
  }

  const now = Date.now()
  const ins = db.prepare(
    `INSERT INTO user_templates (${COLS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  try {
    ins.run([
      input.id,
      input.name,
      input.category,
      input.kind,
      examplesJson,
      payloadJson,
      now,
      now,
    ])
  } finally {
    ins.free()
  }
  void persist()
  const row = getUserTemplate(input.id)
  if (!row) throw new Error('[userTemplates] insert succeeded but row not found')
  return row
}

/** R3 fix-pass-3 — exported for tests. */
export const USER_TEMPLATES_LIMITS = {
  ID_ALLOWLIST_RE,
  RESERVED_IDS,
  PAYLOAD_BYTES_CAP,
  NAME_CHAR_CAP,
  EXAMPLES_BYTES_CAP,
  ROW_COUNT_CAP,
} as const

export function listUserTemplates(filter?: {
  category?: UserTemplateCategory
  kind?: UserTemplateKind
}): UserTemplateRow[] {
  const clauses: string[] = []
  const binds: (string | number)[] = []
  if (filter?.category) {
    clauses.push('category = ?')
    binds.push(filter.category)
  }
  if (filter?.kind) {
    clauses.push('kind = ?')
    binds.push(filter.kind)
  }
  const where = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''
  // R3 fix-pass-3 (L5) — defensive LIMIT cap; pairs with ROW_COUNT_CAP at insert.
  const stmt = getDB().prepare(
    `SELECT ${COLS} FROM user_templates${where} ORDER BY id ASC LIMIT ${ROW_COUNT_CAP}`,
  )
  const rows: UserTemplateRow[] = []
  try {
    if (binds.length) stmt.bind(binds)
    while (stmt.step()) rows.push(stmt.getAsObject() as unknown as UserTemplateRow)
  } finally {
    stmt.free()
  }
  return rows
}

export function getUserTemplate(id: string): UserTemplateRow | null {
  const stmt = getDB().prepare(`SELECT ${COLS} FROM user_templates WHERE id = ?`)
  try {
    stmt.bind([id])
    return stmt.step() ? (stmt.getAsObject() as unknown as UserTemplateRow) : null
  } finally {
    stmt.free()
  }
}

export function deleteUserTemplate(id: string): boolean {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM user_templates WHERE id = ?')
  let changed = 0
  try {
    stmt.run([id])
    changed = db.getRowsModified()
  } finally {
    stmt.free()
  }
  if (changed > 0) void persist()
  return changed > 0
}

/** Parse the persisted JSON columns into typed shapes. Returns null on parse failure. */
export function parseUserTemplate(row: UserTemplateRow): {
  id: string
  name: string
  category: UserTemplateCategory
  kind: UserTemplateKind
  examples: string[]
  payload: Record<string, unknown>
} | null {
  try {
    const examples = JSON.parse(row.examples_json) as unknown
    const payload = JSON.parse(row.payload_json) as unknown
    if (!Array.isArray(examples)) return null
    if (typeof payload !== 'object' || payload === null) return null
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      kind: row.kind,
      examples: examples.filter((s): s is string => typeof s === 'string'),
      payload: payload as Record<string, unknown>,
    }
  } catch {
    return null
  }
}
