/**
 * P112 / Wave 1 / Agent A2 — ADR README drift CI guard.
 *
 * Closes G2 from P112 preflight: ADR README drift detection was reactive
 * (P109 found 89-ADR drift after the fact). This test makes drift detection
 * proactive — fires on every CI run, diffing README declared count vs
 * disk reality. ±1 tolerance accommodates in-flight ADRs that just landed.
 *
 * Pattern follows tests/p109-section-enum-drift-guard.spec.ts (regression-
 * guard precedent). Pure read-only — no source modifications.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const ADR_DIR = path.join(ROOT, 'docs/adr')
const README_PATH = path.join(ADR_DIR, 'README.md')

test.describe('P112.1 — ADR README drift detection', () => {
  test('README.md exists at docs/adr/', () => {
    expect(existsSync(README_PATH)).toBe(true)
  })

  test('README declares ADR file count + matches disk (±1 tolerance)', () => {
    const readme = readFileSync(README_PATH, 'utf8')
    const adrFiles = readdirSync(ADR_DIR).filter((f) => /^ADR-\d+/.test(f) && f.endsWith('.md'))
    const diskCount = adrFiles.length

    const declaredMatch = readme.match(/Total files(?:\s+on\s+disk)?:\s*\*?\*?\s*(\d+)|(\d+)\s+ADRs?/i)
    expect(declaredMatch).toBeTruthy()
    const declared = parseInt(declaredMatch?.[1] ?? declaredMatch?.[2] ?? '0', 10)

    expect(Math.abs(declared - diskCount)).toBeLessThanOrEqual(1)
  })

  test('Highest-ID ADR matches README declaration', () => {
    const readme = readFileSync(README_PATH, 'utf8')
    const adrFiles = readdirSync(ADR_DIR).filter((f) => /^ADR-\d+/.test(f) && f.endsWith('.md'))
    const ids = adrFiles.map((f) => parseInt(f.match(/^ADR-(\d+)/)?.[1] ?? '0', 10)).filter((n) => n > 0)
    const maxId = Math.max(...ids)

    const readmeMaxMatch = readme.match(/Highest-ID:\s*\*?\*?\s*ADR-(\d+)/i) ?? readme.match(/ADR-(\d+)\s*\(highest/i)
    if (readmeMaxMatch) {
      const declaredMax = parseInt(readmeMaxMatch[1], 10)
      expect(Math.abs(declaredMax - maxId)).toBeLessThanOrEqual(1)
    } else {
      test.info().annotations.push({ type: 'note', description: 'README lacks Highest-ID line; consider adding' })
    }
  })

  test('All disk ADR IDs are listed in README (sample check)', () => {
    const readme = readFileSync(README_PATH, 'utf8')
    const adrFiles = readdirSync(ADR_DIR).filter((f) => /^ADR-\d+/.test(f) && f.endsWith('.md'))
    const ids = adrFiles.map((f) => f.match(/^ADR-(\d+)/)?.[1]).filter((s): s is string => !!s)

    const sample = ids.slice(0, 5).concat(ids.slice(-5))
    for (const id of sample) {
      const padded = id.padStart(3, '0')
      const matches = readme.match(new RegExp(`ADR-0?${id}\\b|ADR-${padded}\\b`))
      expect(matches, `ADR-${id} should appear in README`).toBeTruthy()
    }
  })
})
