/**
 * P54 Sprint K Wave 1 — Make The Speed Visible.
 *
 * Pure-unit (FS-level reads). Mirrors P50/P51/P52/P53 spec docstring style.
 * NO browser bootstrap. NO aisp barrel imports. Each assertion body ≤6 lines.
 *
 * ADR-077.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const BADGE = join(process.cwd(), 'src/components/shell/PatchLatencyBadge.tsx')
const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const PIPELINE = join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts')
const ADR = join(process.cwd(), 'docs/adr/ADR-077-speed-visible.md')

test.describe('P54.1 PatchLatencyBadge — file shape', () => {
  test('exists + exports PatchLatencyBadge + ≤80 LOC', () => {
    expect(existsSync(BADGE)).toBe(true)
    const src = readFileSync(BADGE, 'utf8')
    expect(src).toMatch(/export function PatchLatencyBadge/)
    expect(src.split('\n').length).toBeLessThanOrEqual(80)
  })
})

test.describe('P54.2 PatchLatencyBadge — render gate on latencyMs > 0', () => {
  test('source contains the null/<=0 guard', () => {
    const src = readFileSync(BADGE, 'utf8')
    expect(src).toMatch(/latencyMs\s*==\s*null\s*\|\|\s*latencyMs\s*<=\s*0/)
    expect(src).toMatch(/return null/)
  })
})

test.describe('P54.3 PatchLatencyBadge — testids present', () => {
  test('source contains both badge + breakdown testids', () => {
    const src = readFileSync(BADGE, 'utf8')
    expect(src).toContain('patch-latency-badge')
    expect(src).toContain('patch-latency-breakdown')
  })
})

test.describe('P54.4 PatchLatencyBadge — 5s threshold logic', () => {
  test('source contains 5000 threshold AND ✓ fallback', () => {
    const src = readFileSync(BADGE, 'utf8')
    expect(src).toMatch(/5000/)
    expect(src).toContain('✓')
  })
})

test.describe('P54.5 PatchLatencyBadge — EXPERT-mode breakdown gate', () => {
  test('source consults useUIStore AND gates on EXPERT', () => {
    const src = readFileSync(BADGE, 'utf8')
    expect(src).toContain('useUIStore')
    expect(src).toContain('EXPERT')
  })
})

test.describe('P54.6 chatPipeline — ChatPipelineResult.latencyMs field', () => {
  test('source declares latencyMs on the result envelope', () => {
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toMatch(/interface ChatPipelineResult\b/)
    expect(src).toMatch(/latencyMs\??:\s*number/)
  })
})

test.describe('P54.7 chatPipeline — latencyBreakdown shape', () => {
  test('source declares all four pipeline-stage keys', () => {
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toMatch(/latencyBreakdown/)
    expect(/classify\?:\s*number/.test(src) && /select\?:\s*number/.test(src)).toBe(true)
    expect(/patch\?:\s*number/.test(src) && /apply\?:\s*number/.test(src)).toBe(true)
  })
})

test.describe('P54.8 ChatInput — renders PatchLatencyBadge', () => {
  test('source contains <PatchLatencyBadge JSX use', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain('<PatchLatencyBadge')
  })
})

test.describe('P54.9 ChatMessage — interface has latencyMs + latencyBreakdown', () => {
  test('source declares both fields on the message envelope', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/latencyMs\??:\s*number/)
    expect(src).toMatch(/latencyBreakdown\??:/)
  })
})

test.describe('P54.10 ADR-077 — file shape + cross-refs', () => {
  test('exists, Status: Accepted, ≤120 LOC, refs ADR-049 + ADR-073 + ADR-076', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.includes('ADR-049') && src.includes('ADR-073') && src.includes('ADR-076')).toBe(true)
  })
})
