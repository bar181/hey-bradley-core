/**
 * P30 Sprint D P2 — Template Persistence tests.
 *
 * Pure-unit (no browser; no LLM; no sql.js boot). Verifies:
 *   1) migration 003-user-templates.sql DDL shape + presence
 *   2) BrowseTemplate split-type contract via listAllForBrowse(injected)
 *   3) BASELINE_META source projection in browse merge
 *
 * ADR-059.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  listAllForBrowse,
  listTemplates,
} from '../src/contexts/intelligence/templates/library'

const MIGRATIONS_DIR = join(process.cwd(), 'src/contexts/persistence/migrations')
const REPO_FILE = join(
  process.cwd(),
  'src/contexts/persistence/repositories/userTemplates.ts',
)

test.describe('P30 — Template Persistence', () => {
  test('migration 003-user-templates.sql exists', () => {
    const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql'))
    const has003 = files.some((f) => f.startsWith('003-'))
    expect(has003).toBe(true)
  })

  test('migration 003 declares user_templates table with required columns', () => {
    const sql = readFileSync(
      join(MIGRATIONS_DIR, '003-user-templates.sql'),
      'utf8',
    )
    expect(sql).toContain('CREATE TABLE user_templates')
    expect(sql).toMatch(/id\s+TEXT\s+PRIMARY\s+KEY/i)
    expect(sql).toMatch(/name\s+TEXT\s+NOT\s+NULL/i)
    expect(sql).toMatch(/category\s+TEXT/i)
    expect(sql).toMatch(/kind\s+TEXT/i)
    expect(sql).toMatch(/examples_json\s+TEXT/i)
    expect(sql).toMatch(/payload_json\s+TEXT/i)
    expect(sql).toMatch(/created_at\s+INTEGER/i)
    expect(sql).toMatch(/updated_at\s+INTEGER/i)
  })

  test('migration 003 enforces category + kind enums via CHECK', () => {
    const sql = readFileSync(
      join(MIGRATIONS_DIR, '003-user-templates.sql'),
      'utf8',
    )
    expect(sql).toContain("CHECK (category IN ('theme','section','content'))")
    expect(sql).toContain("CHECK (kind IN ('patcher','generator'))")
  })

  test('migration 003 declares indexes on category + kind for filter queries', () => {
    const sql = readFileSync(
      join(MIGRATIONS_DIR, '003-user-templates.sql'),
      'utf8',
    )
    expect(sql).toMatch(/CREATE\s+INDEX\s+\w+\s+ON\s+user_templates\s*\(category\)/i)
    expect(sql).toMatch(/CREATE\s+INDEX\s+\w+\s+ON\s+user_templates\s*\(kind\)/i)
  })

  test('userTemplates repo exports CRUD surface', () => {
    const ts = readFileSync(REPO_FILE, 'utf8')
    expect(ts).toContain('export function createUserTemplate')
    expect(ts).toContain('export function listUserTemplates')
    expect(ts).toContain('export function getUserTemplate')
    expect(ts).toContain('export function deleteUserTemplate')
    expect(ts).toContain('export function parseUserTemplate')
  })

  test('listAllForBrowse with no user rows returns 3 registry-source items', () => {
    const browse = listAllForBrowse()
    expect(browse.length).toBeGreaterThanOrEqual(3)
    expect(browse.every((b) => b.source === 'registry')).toBe(true)
    const ids = browse.map((b) => b.id)
    expect(ids).toContain('make-it-brighter')
    expect(ids).toContain('hide-section')
    expect(ids).toContain('change-headline')
  })

  test('listAllForBrowse merges injected user rows with source="user"', () => {
    const userRows = [
      {
        id: 'my-cta',
        name: 'My CTA Block',
        category: 'section' as const,
        kind: 'patcher' as const,
        examples: ['add a CTA at the bottom'],
      },
      {
        id: 'my-headline',
        name: 'My Custom Headline',
        category: 'content' as const,
        kind: 'generator' as const,
        examples: ['rewrite headline with our brand voice'],
      },
    ]
    const browse = listAllForBrowse(() => userRows)
    expect(browse.length).toBeGreaterThanOrEqual(5) // 3 registry + 2 user
    const userItems = browse.filter((b) => b.source === 'user')
    expect(userItems.length).toBe(2)
    expect(userItems.map((b) => b.id)).toEqual(['my-cta', 'my-headline'])
    // registry items still present + correctly tagged
    expect(browse.filter((b) => b.source === 'registry').length).toBeGreaterThanOrEqual(3)
  })

  test('listAllForBrowse preserves registry order followed by user order', () => {
    const userRows = [
      { id: 'z-user', name: 'Z user', category: 'theme' as const, kind: 'patcher' as const, examples: [] },
    ]
    const browse = listAllForBrowse(() => userRows)
    const registryCount = listTemplates().length
    expect(browse.slice(registryCount).map((b) => b.id)).toEqual(['z-user'])
  })

  test('BrowseTemplate carries name + examples + source on each row', () => {
    const browse = listAllForBrowse(() => [
      { id: 'x', name: 'X label', category: 'content', kind: 'patcher', examples: ['a', 'b'] },
    ])
    const x = browse.find((b) => b.id === 'x')
    expect(x?.name).toBe('X label')
    expect(x?.examples).toEqual(['a', 'b'])
    expect(x?.source).toBe('user')
  })
})
