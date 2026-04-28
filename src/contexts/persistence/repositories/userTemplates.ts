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
  const db = getDB()
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
      JSON.stringify(input.examples ?? []),
      JSON.stringify(input.payload),
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
  const stmt = getDB().prepare(`SELECT ${COLS} FROM user_templates${where} ORDER BY id ASC`)
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
