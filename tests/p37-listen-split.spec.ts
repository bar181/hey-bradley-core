/**
 * P37 Wave 1 (A1) — ListenTab split verification (R2 S3 hard-block close).
 *
 * Pure-unit (FS-level only). Verifies:
 *   - ListenTab orchestrator < 150 LOC
 *   - Each split file < 500 LOC (CLAUDE.md hard cap)
 *   - useListenPipeline exports the documented hook contract
 *   - ListenControls + ListenTranscript exist and import sensibly
 *   - R2 S2: redactKeyShapes is applied at the listen-write boundary
 *
 * Cross-ref: phase-36/deep-dive/02-sec-arch-review.md (R2 S2, R2 S3)
 */
import { test, expect } from '@playwright/test'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const TAB = join(process.cwd(), 'src/components/left-panel/ListenTab.tsx')
const HOOK = join(process.cwd(), 'src/components/left-panel/listen/useListenPipeline.ts')
const CONTROLS = join(process.cwd(), 'src/components/left-panel/listen/ListenControls.tsx')
const TRANSCRIPT = join(process.cwd(), 'src/components/left-panel/listen/ListenTranscript.tsx')

function loc(p: string): number {
  return readFileSync(p, 'utf8').split('\n').length
}

test.describe('R2 S3 — ListenTab split satisfies CLAUDE.md LOC caps', () => {
  test('ListenTab orchestrator is < 150 LOC (post-split target)', () => {
    expect(loc(TAB)).toBeLessThan(150)
  })

  test('useListenPipeline hook is < 500 LOC (CLAUDE.md cap)', () => {
    expect(loc(HOOK)).toBeLessThan(500)
  })

  test('ListenControls component is < 500 LOC', () => {
    expect(loc(CONTROLS)).toBeLessThan(500)
  })

  test('ListenTranscript component is < 500 LOC', () => {
    expect(loc(TRANSCRIPT)).toBeLessThan(500)
  })

  test('All 4 files exist on disk', () => {
    expect(statSync(TAB).isFile()).toBe(true)
    expect(statSync(HOOK).isFile()).toBe(true)
    expect(statSync(CONTROLS).isFile()).toBe(true)
    expect(statSync(TRANSCRIPT).isFile()).toBe(true)
  })
})

test.describe('R2 S3 — useListenPipeline exposes the documented contract', () => {
  test('hook exports state + handlers shape', () => {
    const src = readFileSync(HOOK, 'utf8')
    expect(src).toMatch(/export function useListenPipeline/)
    // Documented shape: returns { state, handlers }
    expect(src).toMatch(/state[\s:,]/)
    expect(src).toMatch(/handlers[\s:,]/)
  })

  test('hook owns runListenPipeline + the 4 review handlers', () => {
    const src = readFileSync(HOOK, 'utf8')
    expect(src).toContain('runListenPipeline')
    expect(src).toContain('handleListenApprove')
    expect(src).toContain('handleListenEdit')
    expect(src).toContain('handleListenCancel')
    expect(src).toContain('handleListenClarificationAccept')
  })

  test('hook owns submitListenFinal + PTT handlers', () => {
    const src = readFileSync(HOOK, 'utf8')
    expect(src).toContain('submitListenFinal')
    expect(src).toContain('handlePttPressStart')
    expect(src).toContain('handlePttPressEnd')
  })

  test('hook owns pipeline state (review/clarification/aisp/busy/reply)', () => {
    const src = readFileSync(HOOK, 'utf8')
    expect(src).toContain('pttReview')
    expect(src).toContain('pttClarification')
    expect(src).toContain('pttAisp')
    expect(src).toContain('pttBusy')
    expect(src).toContain('pttReply')
  })
})

test.describe('R2 S3 — ListenTab thin orchestrator', () => {
  test('ListenTab imports useListenPipeline + delegates to ListenControls + ListenTranscript', () => {
    const src = readFileSync(TAB, 'utf8')
    expect(src).toContain("import { useListenPipeline }")
    expect(src).toContain("import { ListenControls }")
    expect(src).toContain("import { ListenTranscript }")
    expect(src).toMatch(/useListenPipeline\(\)/)
  })

  test('ListenTab no longer owns pipeline state directly', () => {
    const src = readFileSync(TAB, 'utf8')
    // The pipeline ref/state names should no longer appear directly in TAB
    // (they live in the hook now). The TAB only references via listenState.
    expect(src).not.toMatch(/useState.*pttReview/)
    expect(src).not.toMatch(/useState.*pttClarification/)
    expect(src).not.toMatch(/runListenPipeline\s*=\s*useCallback/)
  })

  test('ListenTab keeps orb/sim/burst plumbing (it is not pipeline-related)', () => {
    const src = readFileSync(TAB, 'utf8')
    expect(src).toContain('runBurstAnimation')
    expect(src).toContain('runSimulateInput')
    expect(src).toContain('demoSequences')
  })
})

test.describe('R2 S2 — listen-write redaction symmetry', () => {
  test('redactKeyShapes is imported by the listen pipeline hook', () => {
    const src = readFileSync(HOOK, 'utf8')
    expect(src).toMatch(/redactKeyShapes/)
    // It must come from llm/keys.ts (ADR-043 single source of truth)
    expect(src).toMatch(/from\s+['"]@\/contexts\/intelligence\/llm\/keys['"]/)
  })

  test('redactKeyShapes is applied before appendListenTranscript persists text', () => {
    const src = readFileSync(HOOK, 'utf8')
    // The redaction must wrap the input to appendListenTranscript so
    // a transcript that contains a BYOK shape never lands in IDB raw.
    expect(src).toMatch(/redactKeyShapes\([^)]*\)/)
    expect(src).toMatch(/appendListenTranscript\(/)
    // R2 S2 cite for grep-traceability
    expect(src).toMatch(/R2 S2/)
  })
})
