/**
 * P51 Sprint J Wave 2 — Personality Picker UI + first-run Onboarding step.
 *
 * Pure-unit (FS-level regex over source). Verifies A4 (PersonalityPicker +
 * SettingsDrawer mount + active-personality chip), A5 (Onboarding personality
 * step + 5 distinct chat-bubble styles), and A6 (ADR-074 + KISS dep guard).
 *
 * Mirrors the P50 source-level test pattern. NO browser bootstrap; NO DB;
 * NO LLM calls; NO aisp barrel imports. Each test body ≤6 lines.
 *
 * NOTE: A5 chat-bubble-style assertions (P51.11 + per-id markers) are expected
 * to FAIL until A5's `bubbleStyleClass` switch + `data-bubble-style` attribute
 * land. A6 dispatch occurred while A5 was partial — the picker + chip + step
 * shipped, the bubble-style switch did not. P51 fix-pass closes that gap.
 *
 * ADR-074.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const PICKER = join(process.cwd(), 'src/components/settings/PersonalityPicker.tsx')
const DRAWER = join(process.cwd(), 'src/components/settings/SettingsDrawer.tsx')
const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const ONBOARDING = join(process.cwd(), 'src/pages/Onboarding.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-074-personality-picker-and-onboarding.md')
const PKG = join(process.cwd(), 'package.json')

test.describe('P51.1 PersonalityPicker — file shape', () => {
  test('exists + exports PersonalityPicker + ≤ 220 LOC', () => {
    expect(existsSync(PICKER)).toBe(true)
    const src = readFileSync(PICKER, 'utf8')
    expect(src).toMatch(/export\s+(function|const)\s+PersonalityPicker/)
    expect(src.split('\n').length).toBeLessThanOrEqual(220)
  })
})

test.describe('P51.2 PersonalityPicker — 5 cards rendered with testids', () => {
  test('source contains all 5 personality-card-{id} testids', () => {
    const src = readFileSync(PICKER, 'utf8')
    for (const id of ['professional', 'fun', 'geek', 'teacher', 'coach']) {
      expect(src).toMatch(new RegExp(`personality-card-\\$\\{[^}]+\\}|personality-card-${id}`))
    }
  })
})

test.describe('P51.3 PersonalityPicker — a11y radiogroup pattern', () => {
  test('source contains role="radiogroup" AND role="radio" or aria-checked', () => {
    const src = readFileSync(PICKER, 'utf8')
    expect(src).toMatch(/role=["']radiogroup["']/)
    expect(src).toMatch(/role=["']radio["']|aria-checked/)
  })
})

test.describe('P51.4 PersonalityPicker — keyboard arrow nav', () => {
  test('source contains onKeyDown AND Arrow handlers', () => {
    const src = readFileSync(PICKER, 'utf8')
    expect(src).toMatch(/onKeyDown/)
    expect(src).toMatch(/Arrow(Left|Right|Up|Down)/)
  })
})

test.describe('P51.5 PersonalityPicker — live preview via renderPersonalityMessage', () => {
  test('source matches renderPersonalityMessage usage', () => {
    const src = readFileSync(PICKER, 'utf8')
    expect(src).toMatch(/renderPersonalityMessage/)
  })
})

test.describe('P51.6 SettingsDrawer mounts PersonalityPicker FIRST', () => {
  test('PersonalityPicker JSX appears before ReferenceManagement JSX in source', () => {
    const src = readFileSync(DRAWER, 'utf8')
    const picker = src.indexOf('<PersonalityPicker')
    const ref = src.indexOf('<ReferenceManagement')
    expect(picker).toBeGreaterThan(-1)
    expect(ref).toBeGreaterThan(-1)
    expect(picker).toBeLessThan(ref)
  })
})

test.describe('P51.7 ChatInput active-personality chip', () => {
  test('source contains chat-active-personality-chip testid AND personalityId reference', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/chat-active-personality-chip/)
    expect(src).toMatch(/personalityId/)
  })
})

test.describe('P51.8 Onboarding new personality step', () => {
  test('source contains onboarding-personality-step testid AND prompt text', () => {
    const src = readFileSync(ONBOARDING, 'utf8')
    expect(src).toMatch(/onboarding-personality-step/)
    expect(src).toMatch(/How would you like me to talk to you/i)
  })
})

test.describe('P51.9 Onboarding asked-flag in kv', () => {
  test('source matches onboarding_personality_asked', () => {
    const src = readFileSync(ONBOARDING, 'utf8')
    expect(src).toMatch(/onboarding_personality_asked/)
  })
})

test.describe('P51.10 Onboarding Skip CTA defaults to professional', () => {
  test('source matches Skip AND a setPersonality(\'professional\') call', () => {
    const src = readFileSync(ONBOARDING, 'utf8')
    expect(src).toMatch(/Skip/)
    expect(src).toMatch(/setPersonality\(\s*['"]professional['"]/)
  })
})

test.describe('P51.11 ChatInput 5 bubble styles — switch + data attribute', () => {
  test('source contains bubbleStyleClass AND data-bubble-style', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/bubbleStyleClass/)
    expect(src).toMatch(/data-bubble-style/)
  })
})

test.describe('P51.12 ChatInput per-personality visual markers — fun + geek', () => {
  test('fun => border-l accent; geek => font-mono', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/border-l/)
    expect(src).toMatch(/font-mono/)
  })
})

test.describe('P51.13 ChatInput per-personality visual markers — teacher + coach', () => {
  test('teacher => bg- tint; coach => font-semibold', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/bg-hb-accent\/5|bg-/)
    expect(src).toMatch(/font-semibold/)
  })
})

test.describe('P51.14 ADR-074 — file shape + cross-refs', () => {
  test('exists, Status: Accepted, references ADR-073 + ADR-070, ≤120 LOC, mentions picker + onboarding', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/Status:\*\*\s*Accepted/)
    expect(src).toMatch(/ADR-073/)
    expect(src).toMatch(/ADR-070/)
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.toLowerCase()).toMatch(/picker/)
    expect(src.toLowerCase()).toMatch(/onboarding/)
  })
})

test.describe('P51.15 KISS dep guard — no radix-ui, no @dnd-kit', () => {
  test('package.json dependencies omit radix-ui and @dnd-kit/*', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const deps = Object.keys({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) })
    expect(deps.some((d) => d.includes('radix-ui'))).toBe(false)
    expect(deps.some((d) => d.startsWith('@dnd-kit/'))).toBe(false)
  })
})
