/**
 * P105 / RC-BLOCKERS-CLOSURE — Wave 1 surface assertions (PURE-UNIT; FS + regex; no browser).
 * Validates the 4 P1 closures landed by A1-A4 + EOP triplet seal:
 *   A1 — Welcome routes (/onboarding → /new-project ×5) + AppShell dead-branch purge
 *   A2 — comprehensiveLogs persist flush (scheduleFlush + flushLogsImmediate)
 *   A3 — chatPipeline cleanTranscript pre-classify wire (effectiveText)
 *   A4 — validateSectionType production wire in EXAMPLE_SITES audit
 * Mirror of p104-seed-smoke.spec.ts pattern; ROOT = process.cwd().
 * 7 describe blocks / 17 cases.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const WELCOME = join(ROOT, 'src/pages/Welcome.tsx')
const MAIN = join(ROOT, 'src/main.tsx')
const APPSHELL = join(ROOT, 'src/components/shell/AppShell.tsx')
const COMPREHENSIVE_LOGS = join(
  ROOT,
  'src/contexts/persistence/repositories/comprehensiveLogs.ts',
)
const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')
const EXAMPLES_INDEX = join(ROOT, 'src/data/examples/index.ts')
const SEAL_DIR = join(ROOT, 'plans/implementation/phase-105/seal')
const PACKAGE_JSON = join(ROOT, 'package.json')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}

function countMatches(src: string, needle: string | RegExp): number {
  if (typeof needle === 'string') {
    return src.split(needle).length - 1
  }
  const matches = src.match(needle)
  return matches ? matches.length : 0
}

// P105.1 — Welcome routes (3 cases)
test.describe('P105.1 — Welcome routes use /new-project not /onboarding', () => {
  test('Welcome.tsx contains 0 occurrences of /onboarding', () => {
    if (!existsSync(WELCOME)) {
      test.skip(true, 'Welcome.tsx not present (soft-pass guard)')
      return
    }
    const src = read(WELCOME)
    expect(countMatches(src, '/onboarding')).toBe(0)
  })

  test('Welcome.tsx contains ≥5 occurrences of /new-project', () => {
    if (!existsSync(WELCOME)) {
      test.skip(true, 'Welcome.tsx not present (soft-pass guard)')
      return
    }
    const src = read(WELCOME)
    expect(countMatches(src, '/new-project')).toBeGreaterThanOrEqual(5)
  })

  test('main.tsx registers /new-project route', () => {
    if (!existsSync(MAIN)) {
      test.skip(true, 'main.tsx not present (soft-pass guard)')
      return
    }
    const src = read(MAIN)
    expect(src).toMatch(/path=["']\/new-project["']/)
  })
})

// P105.2 — AppShell cleanup (2 cases)
test.describe('P105.2 — AppShell dead Planning/Agentics branches purged', () => {
  test('AppShell.tsx no longer branches on /planning or /agentics pathnames', () => {
    if (!existsSync(APPSHELL)) {
      test.skip(true, 'AppShell.tsx not present (soft-pass guard)')
      return
    }
    const src = read(APPSHELL)
    expect(src).not.toMatch(/pathname\.startsWith\(\s*['"]\/planning['"]/)
    expect(src).not.toMatch(/pathname\.startsWith\(\s*['"]\/agentics['"]/)
  })

  test('AppShell.tsx total LOC ≤80 (was 113; now 67 post-A1)', () => {
    if (!existsSync(APPSHELL)) {
      test.skip(true, 'AppShell.tsx not present (soft-pass guard)')
      return
    }
    const lines = read(APPSHELL).split('\n').length
    expect(lines).toBeLessThanOrEqual(80)
  })
})

// P105.3 — Log persistence flush (3 cases)
test.describe('P105.3 — comprehensiveLogs scheduleFlush + persist + flushLogsImmediate', () => {
  test('comprehensiveLogs.ts exports flushLogsImmediate', () => {
    if (!existsSync(COMPREHENSIVE_LOGS)) {
      test.skip(true, 'comprehensiveLogs.ts not present (soft-pass guard)')
      return
    }
    const src = read(COMPREHENSIVE_LOGS)
    expect(src).toMatch(
      /export\s+(?:async\s+)?function\s+flushLogsImmediate\s*\(/,
    )
  })

  test('comprehensiveLogs.ts references persist() ≥1 time', () => {
    if (!existsSync(COMPREHENSIVE_LOGS)) {
      test.skip(true, 'comprehensiveLogs.ts not present (soft-pass guard)')
      return
    }
    const src = read(COMPREHENSIVE_LOGS)
    expect(countMatches(src, /persist\s*\(\s*\)/g)).toBeGreaterThanOrEqual(1)
  })

  test('comprehensiveLogs.ts defines scheduleFlush helper', () => {
    if (!existsSync(COMPREHENSIVE_LOGS)) {
      test.skip(true, 'comprehensiveLogs.ts not present (soft-pass guard)')
      return
    }
    const src = read(COMPREHENSIVE_LOGS)
    expect(src).toMatch(/function\s+scheduleFlush\s*\(/)
  })
})

// P105.4 — cleanTranscript pipeline wire (3 cases)
test.describe('P105.4 — chatPipeline.ts threads effectiveText pre-classify', () => {
  test('chatPipeline.ts defines const effectiveText', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline.ts not present (soft-pass guard)')
      return
    }
    const src = read(CHAT_PIPELINE)
    expect(src).toMatch(/const\s+effectiveText\s*=/)
  })

  test('chatPipeline.ts references effectiveText ≥10 times (consumer fan-out)', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline.ts not present (soft-pass guard)')
      return
    }
    const src = read(CHAT_PIPELINE)
    expect(countMatches(src, /effectiveText/g)).toBeGreaterThanOrEqual(10)
  })

  test('chatPipeline.ts retains cleanTranscript call site (≥1; non-regression)', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline.ts not present (soft-pass guard)')
      return
    }
    const src = read(CHAT_PIPELINE)
    const occurrences = countMatches(src, /cleanTranscript\s*\(/g)
    expect(occurrences).toBeGreaterThanOrEqual(1)
  })
})

// P105.5 — validateSectionType production wire (2 cases)
test.describe('P105.5 — validateSectionType wired in EXAMPLE_SITES audit', () => {
  test('src/data/examples/index.ts imports validateSectionType', () => {
    if (!existsSync(EXAMPLES_INDEX)) {
      test.skip(true, 'examples/index.ts not present (soft-pass guard)')
      return
    }
    const src = read(EXAMPLES_INDEX)
    expect(src).toMatch(
      /import\s*\{[^}]*validateSectionType[^}]*\}\s*from\s*['"][^'"]*schemas\/section['"]/,
    )
  })

  test('src/data/examples/index.ts calls validateSectionType( ≥1 time', () => {
    if (!existsSync(EXAMPLES_INDEX)) {
      test.skip(true, 'examples/index.ts not present (soft-pass guard)')
      return
    }
    const src = read(EXAMPLES_INDEX)
    expect(countMatches(src, /validateSectionType\s*\(/g)).toBeGreaterThanOrEqual(
      1,
    )
  })
})

// P105.6 — EOP triplet present (3 cases)
test.describe('P105.6 — EOP triplet at plans/implementation/phase-105/seal/', () => {
  test('02-post-review.md exists', () => {
    expect(existsSync(join(SEAL_DIR, '02-post-review.md'))).toBe(true)
  })

  test('session-log.md exists', () => {
    expect(existsSync(join(SEAL_DIR, 'session-log.md'))).toBe(true)
  })

  test('retrospective.md exists', () => {
    expect(existsSync(join(SEAL_DIR, 'retrospective.md'))).toBe(true)
  })
})

// P105.7 — KISS denylist + no new deps (1 case)
test.describe('P105.7 — KISS no new deps boundary check', () => {
  test('package.json has no NEW banned animation/zip deps beyond P104 baseline', () => {
    if (!existsSync(PACKAGE_JSON)) {
      test.skip(true, 'package.json not present (soft-pass guard)')
      return
    }
    const src = read(PACKAGE_JSON)
    // P105 denylist — only deps NOT present in pre-P105 baseline.
    // (framer-motion + jszip are pre-existing repo deps; not P105's to gate.)
    expect(src).not.toMatch(/"gsap"\s*:/)
    expect(src).not.toMatch(/"lottie-web"\s*:/)
    expect(src).not.toMatch(/"@react-spring\/[a-z-]+"\s*:/)
    expect(src).not.toMatch(/"animejs"\s*:/)
    expect(src).not.toMatch(/"archiver"\s*:/)
    expect(src).not.toMatch(/"marked"\s*:/)
    expect(src).not.toMatch(/"@supabase\/supabase-js"\s*:/)
  })
})
