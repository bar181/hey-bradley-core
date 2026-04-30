/**
 * P60.5 (post-defense quick win) — AISP trace pane auto-expands on first
 * reply per browser session. Mirrors the specPanelHasAutoOpened one-shot
 * pattern from P55, in-memory only.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const STORE = join(ROOT, 'src/store/uiStore.ts')
const PANE = join(ROOT, 'src/components/shell/AISPPipelineTracePane.tsx')

test.describe('P60.22 AISP trace auto-expand — uiStore exposes one-shot flag', () => {
  test('uiStore declares aispTraceAutoOpened + markAispTraceAutoOpened', () => {
    expect(existsSync(STORE)).toBe(true)
    const src = readFileSync(STORE, 'utf8')
    expect(src).toContain('aispTraceAutoOpened: boolean')
    expect(src).toContain('markAispTraceAutoOpened: () =>')
    expect(src).toContain('aispTraceAutoOpened: false,')
  })
})

test.describe('P60.23 AISP trace pane defaults to expanded when one-shot is unfired', () => {
  test('pane initializes useState from !aispTraceAutoOpened', () => {
    const src = readFileSync(PANE, 'utf8')
    expect(src).toContain('useState(!aispTraceAutoOpened)')
    expect(src).toContain('markAispTraceAutoOpened()')
  })
  test('pane mounts useEffect to fire markAispTraceAutoOpened (one-shot)', () => {
    const src = readFileSync(PANE, 'utf8')
    expect(src).toMatch(/useEffect\(\(\)\s*=>/)
    expect(src).toContain('if (!aispTraceAutoOpened && !isDraft)')
  })
})
