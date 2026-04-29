/**
 * P50 Sprint J Wave 1 — Personality Engine + Composition (Agent A3 cumulative).
 *
 * Pure-unit (FS-level + direct module imports). Verifies A1 (personalityEngine.ts
 * + kv getter/setter + intelligenceStore.personalityId + system.ts injection
 * point) and A2 (chatPipeline `personalityMessage` + ChatInput surface).
 *
 * Mirrors the P48 / P49 source-level test pattern. NO browser bootstrap; NO DB;
 * NO LLM calls; NO aisp barrel imports. Engine module is loaded by direct path
 * for type-level + behavior assertions; everything else is FS-level regex over
 * source.
 *
 * NOTE: Some assertions are expected to FAIL until A1 + A2 land their commits;
 * the agent report explicitly flags those rows.
 *
 * ADR-073.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ENGINE = join(process.cwd(), 'src/contexts/intelligence/personality/personalityEngine.ts')
const KV = join(process.cwd(), 'src/contexts/persistence/repositories/kv.ts')
const STORE = join(process.cwd(), 'src/store/intelligenceStore.ts')
const SYSTEM = join(process.cwd(), 'src/contexts/intelligence/prompts/system.ts')
const CHAT_PIPELINE = join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts')
const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')

test.describe('P50.1 personalityEngine — file shape', () => {
  test('exists + exports closed enum + Profile record + render fn + ≤ 200 LOC', async () => {
    expect(existsSync(ENGINE)).toBe(true)
    const src = readFileSync(ENGINE, 'utf8')
    expect(src).toMatch(/export\s+(const|type)\s+PERSONALITY_IDS/)
    expect(src).toMatch(/export\s+type\s+PersonalityId/)
    expect(src).toMatch(/export\s+(const)\s+PERSONALITY_PROFILES/)
    expect(src).toMatch(/export\s+(function|const)\s+renderPersonalityMessage/)
    expect(src.split('\n').length).toBeLessThanOrEqual(200)
  })
})

test.describe('P50.2 PERSONALITY_IDS — closed 5-enum', () => {
  test('exactly 5 sorted ids: coach / fun / geek / professional / teacher', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const sorted = [...mod.PERSONALITY_IDS].sort()
    expect(sorted).toEqual(['coach', 'fun', 'geek', 'professional', 'teacher'])
  })
})

test.describe('P50.3 PERSONALITY_PROFILES — all 5 ids carry full Profile shape', () => {
  test('each id has label + description + emoji + tonePrompt + suggestionStyle + aispVisible', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const keys = ['label', 'description', 'emoji', 'tonePrompt', 'suggestionStyle', 'aispVisible']
    for (const id of mod.PERSONALITY_IDS) for (const k of keys) expect(mod.PERSONALITY_PROFILES[id]).toHaveProperty(k)
  })
})

test.describe('P50.4 renderPersonalityMessage — 5 distinct outputs from identical input', () => {
  test('all 5 outputs are unique strings', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const env = { patches: [{ op: 'add', path: '/sections/-', value: {} }], summary: 'Updated hero color' }
    const trace = { intent: { verb: 'change', target: { type: 'hero' }, confidence: 0.94 } }
    const outs = mod.PERSONALITY_IDS.map((id: string) => mod.renderPersonalityMessage(env, id, trace))
    expect(new Set(outs).size).toBe(5)
  })
})

test.describe('P50.5 geek output — AISP markers present', () => {
  test('contains Ω and Σ and a confidence number', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const out = mod.renderPersonalityMessage({ patches: [], summary: 'x' }, 'geek', { intent: { verb: 'change', target: { type: 'hero' }, confidence: 0.94 } })
    expect(out).toMatch(/Ω/)
    expect(out).toMatch(/Σ/)
    expect(out).toMatch(/0?\.\d+|\d+%/)
  })
})

test.describe('P50.6 fun output — emoji present', () => {
  test('matches at least one emoji glyph', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const out = mod.renderPersonalityMessage({ patches: [], summary: 'Updated hero color' }, 'fun', { intent: { verb: 'change', target: { type: 'hero' }, confidence: 0.9 } })
    expect(out).toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u)
  })
})

test.describe('P50.7 professional output — NO emoji', () => {
  test('contains no emoji glyph', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const out = mod.renderPersonalityMessage({ patches: [], summary: 'Updated hero color' }, 'professional', { intent: { verb: 'change', target: { type: 'hero' }, confidence: 0.9 } })
    expect(out).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u)
  })
})

test.describe('P50.8 teacher output — encouraging tone', () => {
  test('matches great|nice|wonderful|love|🌟', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const out = mod.renderPersonalityMessage({ patches: [], summary: 'Updated hero color' }, 'teacher', { intent: { verb: 'change', target: { type: 'hero' }, confidence: 0.9 } })
    expect(out).toMatch(/great|nice|wonderful|love|🌟/i)
  })
})

test.describe('P50.9 coach output — action-oriented', () => {
  test("matches done|next|move|let's|ship", async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    const out = mod.renderPersonalityMessage({ patches: [], summary: 'Updated hero color' }, 'coach', { intent: { verb: 'change', target: { type: 'hero' }, confidence: 0.9 } })
    expect(out).toMatch(/done|next|move|let's|ship/i)
  })
})

test.describe('P50.10 aispVisible flag — only geek is true', () => {
  test('geek=true, others=false', async () => {
    const mod: any = await import('../src/contexts/intelligence/personality/personalityEngine')
    expect(mod.PERSONALITY_PROFILES.geek.aispVisible).toBe(true)
    for (const id of ['professional', 'fun', 'teacher', 'coach']) expect(mod.PERSONALITY_PROFILES[id].aispVisible).toBe(false)
  })
})

test.describe('P50.11 kv repo — typed personality helpers', () => {
  test('source matches getPersonalityId AND setPersonalityId', () => {
    const src = readFileSync(KV, 'utf8')
    expect(src).toMatch(/getPersonalityId/)
    expect(src).toMatch(/setPersonalityId/)
  })
})

test.describe('P50.12 intelligenceStore — personality field + setter', () => {
  test('source matches personalityId AND setPersonality', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/personalityId/)
    expect(src).toMatch(/setPersonality/)
  })
})

test.describe('P50.13 system.ts — personality injection point', () => {
  test('source contains personality field on SystemPromptCtx + tonePrompt feed', () => {
    const src = readFileSync(SYSTEM, 'utf8')
    expect(src).toMatch(/personality/)
    expect(src).toMatch(/tonePrompt/)
  })
})

test.describe('P50.14 chatPipeline — personalityMessage on result + defensive render', () => {
  test('source matches personalityMessage AND a try block referencing personalityEngine', () => {
    const src = readFileSync(CHAT_PIPELINE, 'utf8')
    expect(src).toMatch(/personalityMessage/)
    expect(src).toMatch(/try[\s\S]{0,400}personalityEngine/)
  })
})

test.describe('P50.15 ChatInput — personalityMessage rendered with testid + data-personality-id', () => {
  test('source contains personality-message testid AND data-personality-id', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/personality-message/)
    expect(src).toMatch(/data-personality-id/)
  })
})
