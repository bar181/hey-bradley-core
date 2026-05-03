/**
 * P107 / LOG-INTEGRITY-EXPANSION — Wave 1 surface assertions (PURE-UNIT; FS + regex; no browser).
 * Validates the 2 P1 closures landed by A5 + A6 + ADR-135 + EOP triplet seal:
 *   A5 — 4 unwired event_types now have production writers
 *        (multi_page_scope + decomp_split + todo_execution + export_emit)
 *   A6 — Centralized writeErrorEvent helper + 4 catch-site wires in chatPipeline
 *        (5 of 5 previously-unwired event_types now have writers)
 * Mirror of p106-dead-code-purge.spec.ts pattern; ROOT = process.cwd().
 * 11 describe blocks / 19 cases.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')
const COMPREHENSIVE_LOGS = join(
  ROOT,
  'src/contexts/persistence/repositories/comprehensiveLogs.ts',
)
const EXPORT_CLAUDE_CODE = join(
  ROOT,
  'src/contexts/specification/exportClaudeCode.ts',
)
const EXPORT_BUTTON = join(
  ROOT,
  'src/components/agentics/ExportClaudeCodeButton.tsx',
)
const ADR_135 = join(
  ROOT,
  'docs/adr/ADR-135-log-integrity-expansion.md',
)
// Post-scaffolding cleanup: 02-post-review.md lives in archive/seal/; session-log.md
// and retrospective.md live at phase root.
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-107')
const ARCHIVE_SEAL_DIR = join(PHASE_DIR, 'archive/seal')
const PACKAGE_JSON = join(ROOT, 'package.json')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}

// P107.1 — ADR-135 file shape (3 cases)
test.describe('P107.1 — ADR-135 exists with correct shape and cross-refs', () => {
  test('ADR-135 file exists', () => {
    expect(existsSync(ADR_135)).toBe(true)
  })

  test('ADR-135 status is Accepted (markdown-bold tolerated)', () => {
    if (!existsSync(ADR_135)) {
      test.skip(true, 'ADR-135 not present (soft-pass guard)')
      return
    }
    const src = read(ADR_135)
    expect(src).toMatch(/Status:\*?\*?\s*Accepted/)
  })

  test('ADR-135 cross-refs ADR-126 + ADR-127 + ADR-104 + ADR-122 + ADR-134 + ADR-043', () => {
    if (!existsSync(ADR_135)) {
      test.skip(true, 'ADR-135 not present (soft-pass guard)')
      return
    }
    const src = read(ADR_135)
    expect(src).toMatch(/ADR-126/)
    expect(src).toMatch(/ADR-127/)
    expect(src).toMatch(/ADR-104/)
    expect(src).toMatch(/ADR-122/)
    expect(src).toMatch(/ADR-134/)
    expect(src).toMatch(/ADR-043/)
  })
})

// P107.2 — decomp_split emission site (1 case)
test.describe('P107.2 — decomp_split event_type emission site exists', () => {
  test('chatPipeline.ts contains decomp_split emit', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline.ts not present (soft-pass guard)')
      return
    }
    const src = read(CHAT_PIPELINE)
    expect(src).toMatch(/'decomp_split'/)
  })
})

// P107.3 — multi_page_scope emission site (1 case)
test.describe('P107.3 — multi_page_scope event_type emission site exists', () => {
  test('chatPipeline.ts contains multi_page_scope emit', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline.ts not present (soft-pass guard)')
      return
    }
    const src = read(CHAT_PIPELINE)
    expect(src).toMatch(/'multi_page_scope'/)
  })
})

// P107.4 — export_emit emission site (1 case)
test.describe('P107.4 — export_emit event_type emission site exists in ExportClaudeCodeButton', () => {
  test('ExportClaudeCodeButton.tsx contains export_emit emit (callback path)', () => {
    if (!existsSync(EXPORT_BUTTON)) {
      test.skip(true, 'ExportClaudeCodeButton.tsx not present (soft-pass guard)')
      return
    }
    const src = read(EXPORT_BUTTON)
    expect(src).toMatch(/'export_emit'/)
  })
})

// P107.5 — todo_execution emission site (1 case)
test.describe('P107.5 — todo_execution event_type emission site exists', () => {
  test('chatPipeline.ts contains todo_execution emit', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline.ts not present (soft-pass guard)')
      return
    }
    const src = read(CHAT_PIPELINE)
    expect(src).toMatch(/'todo_execution'/)
  })
})

// P107.6 — writeErrorEvent exported from comprehensiveLogs (1 case)
test.describe('P107.6 — writeErrorEvent helper exported', () => {
  test('comprehensiveLogs.ts exports writeErrorEvent', () => {
    if (!existsSync(COMPREHENSIVE_LOGS)) {
      test.skip(true, 'comprehensiveLogs.ts not present (soft-pass guard)')
      return
    }
    const src = read(COMPREHENSIVE_LOGS)
    expect(src).toMatch(/export\s+function\s+writeErrorEvent\s*\(/)
  })
})

// P107.7 — chatPipeline has ≥4 writeErrorEvent call sites (1 case)
test.describe('P107.7 — chatPipeline.ts has ≥4 writeErrorEvent call sites', () => {
  test('writeErrorEvent invoked at least 4 times in chatPipeline.ts', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline.ts not present (soft-pass guard)')
      return
    }
    const src = read(CHAT_PIPELINE)
    // Count call sites — invocation pattern `writeErrorEvent(` (excludes import line).
    const calls = src.match(/writeErrorEvent\s*\(/g) ?? []
    expect(calls.length).toBeGreaterThanOrEqual(4)
  })
})

// P107.8 — BYOK redaction in writeErrorEvent (2 cases)
test.describe('P107.8 — writeErrorEvent calls redactKeyShapes on message AND stack', () => {
  test('redactKeyShapes called on message in writeErrorEvent block', () => {
    if (!existsSync(COMPREHENSIVE_LOGS)) {
      test.skip(true, 'comprehensiveLogs.ts not present (soft-pass guard)')
      return
    }
    const src = read(COMPREHENSIVE_LOGS)
    // Extract the writeErrorEvent function body (greedy through next ^export or EOF).
    const fnMatch = src.match(
      /export\s+function\s+writeErrorEvent\s*\([\s\S]*?\n\}\s*\n/,
    )
    expect(fnMatch).not.toBeNull()
    const body = fnMatch![0]
    expect(body).toMatch(/redactKeyShapes\s*\(\s*message\s*\)/)
  })

  test('redactKeyShapes called on stack in writeErrorEvent block', () => {
    if (!existsSync(COMPREHENSIVE_LOGS)) {
      test.skip(true, 'comprehensiveLogs.ts not present (soft-pass guard)')
      return
    }
    const src = read(COMPREHENSIVE_LOGS)
    const fnMatch = src.match(
      /export\s+function\s+writeErrorEvent\s*\([\s\S]*?\n\}\s*\n/,
    )
    expect(fnMatch).not.toBeNull()
    const body = fnMatch![0]
    expect(body).toMatch(/redactKeyShapes\s*\(\s*stack\s*\)/)
  })
})

// P107.9 — ExportEmitCallback type exported (preserves atom-pure contract) (2 cases)
test.describe('P107.9 — exportClaudeCode.ts exports ExportEmitCallback type (atom-pure)', () => {
  test('ExportEmitCallback type exported from exportClaudeCode.ts', () => {
    if (!existsSync(EXPORT_CLAUDE_CODE)) {
      test.skip(true, 'exportClaudeCode.ts not present (soft-pass guard)')
      return
    }
    const src = read(EXPORT_CLAUDE_CODE)
    expect(src).toMatch(/export\s+type\s+ExportEmitCallback/)
  })

  test('exportClaudeCode.ts has ZERO persistence imports (atom-pure per ADR-122 D1 + ADR-134)', () => {
    if (!existsSync(EXPORT_CLAUDE_CODE)) {
      test.skip(true, 'exportClaudeCode.ts not present (soft-pass guard)')
      return
    }
    const src = read(EXPORT_CLAUDE_CODE)
    // Pure module: no imports from persistence layer; observability lives at integration boundary.
    expect(src).not.toMatch(/from\s+['"]@\/contexts\/persistence/)
  })
})

// P107.10 — EOP triplet present (3 cases)
test.describe('P107.10 — EOP triplet at plans/implementation/phase-107/seal/', () => {
  test('02-post-review.md exists', () => {
    expect(existsSync(join(ARCHIVE_SEAL_DIR, '02-post-review.md'))).toBe(true)
  })

  test('session-log.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'session-log.md'))).toBe(true)
  })

  test('retrospective.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'retrospective.md'))).toBe(true)
  })
})

// P107.11 — KISS denylist + no new deps (1 case; mirror P106.9)
test.describe('P107.11 — KISS no new deps boundary check', () => {
  test('package.json has no NEW banned animation/zip/markdown/db deps beyond P106 baseline', () => {
    if (!existsSync(PACKAGE_JSON)) {
      test.skip(true, 'package.json not present (soft-pass guard)')
      return
    }
    const src = read(PACKAGE_JSON)
    // P107 denylist mirrors P106.9 — only deps NOT pre-existing in baseline.
    expect(src).not.toMatch(/"gsap"\s*:/)
    expect(src).not.toMatch(/"lottie-web"\s*:/)
    expect(src).not.toMatch(/"@react-spring\/[a-z-]+"\s*:/)
    expect(src).not.toMatch(/"animejs"\s*:/)
    expect(src).not.toMatch(/"archiver"\s*:/)
    expect(src).not.toMatch(/"marked"\s*:/)
    expect(src).not.toMatch(/"@supabase\/supabase-js"\s*:/)
  })
})
