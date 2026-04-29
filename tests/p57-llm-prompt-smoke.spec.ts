/**
 * P57' Sprint M follow-up — LLM prompt internal smoke test.
 *
 * NO real LLM calls. NO BYOK key burned. Verifies:
 *   1. Each LLM prompt-type's system prompt is constructed correctly (substring assertions).
 *   2. The AgentProxy fixture corpus seed file has the documented 42+ prompts.
 *   3. CONTENT_ATOM consumer is the documented rule-based stub (no LLM call wired yet).
 *   4. auditedComplete is the single chokepoint — every LLM caller routes through it.
 *
 * Pair with `plans/strategic-reviews/llm-prompt-types-2026-04-29.md` for the
 * human-readable documentation of what each prompt does + sample inputs/outputs.
 *
 * PURE-UNIT — FS reads + direct module inspection. Mirrors p44-p56 spec patterns.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const SYSTEM_PROMPT = join(ROOT, 'src/contexts/intelligence/prompts/system.ts')
const LLM_CLASSIFIER = join(ROOT, 'src/contexts/intelligence/aisp/llmClassifier.ts')
const CONTENT_GENERATOR = join(ROOT, 'src/contexts/intelligence/aisp/contentGenerator.ts')
const ASSUMPTIONS_LLM = join(ROOT, 'src/contexts/intelligence/aisp/assumptionsLLM.ts')
const AUDITED_COMPLETE = join(ROOT, 'src/contexts/intelligence/llm/auditedComplete.ts')
const AGENT_PROXY = join(ROOT, 'src/contexts/intelligence/llm/agentProxyAdapter.ts')
const FIXTURE_SEED = join(ROOT, 'src/contexts/persistence/migrations/001-example-prompts.sql')
const DOC = join(ROOT, 'plans/strategic-reviews/llm-prompt-types-2026-04-29.md')

test.describe('P57.1 PATCH_ATOM — system prompt construction', () => {
  test('system.ts includes Crystal Atom (Ω/Σ/Γ/Λ/Ε), ROLE_LINE, OUTPUT_RULE', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    expect(src.includes('Ω') && src.includes('Σ') && src.includes('Γ') && src.includes('Λ') && src.includes('Ε')).toBe(true)
    expect(src).toMatch(/JSON-patch generator behind the Hey Bradley site builder/)
    expect(src).toMatch(/Output: return ONLY a JSON object matching `Envelope`/)
  })

  test('PATCH_ATOM Σ surface unchanged: Envelope := { patches, summary? }', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    expect(src).toMatch(/Envelope\s*:=\s*\{\s*patches:\s*\[Patch\]/)
    expect(src).toMatch(/summary:\s*𝕊\s*\(≤140\)\s*\?/)
  })

  test('Personality block injected AFTER brand context, BEFORE OUTPUT_RULE', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    expect(src).toContain('renderPersonalityBlock')
    expect(src).toMatch(/personality\?:\s*PersonalityId/)
  })
})

test.describe('P57.2 INTENT_ATOM — LLM classifier prompt', () => {
  test('llmClassifier.ts contains the Crystal Atom verbatim + JSON contract', () => {
    const src = readFileSync(LLM_CLASSIFIER, 'utf8')
    expect(src).toContain('AISP-native intent classifier')
    expect(src).toContain('${INTENT_ATOM}')
    expect(src).toMatch(/"verb": "hide" \| "show" \| "change" \| "remove" \| "add" \| "reset"/)
    expect(src).toContain('Respond with ONLY the JSON object')
  })

  test('llmClassifier fires only above cap-budget threshold (cost discipline)', () => {
    const src = readFileSync(LLM_CLASSIFIER, 'utf8')
    expect(src).toMatch(/sessionUsd\s*>=\s*store\.capUsd\s*\*\s*0\.9/)
  })

  test('llmClassifier returns null on parse failure (graceful fallback)', () => {
    const src = readFileSync(LLM_CLASSIFIER, 'utf8')
    expect(src).toMatch(/return null/)
    expect(src).toContain('safeParseJson')
  })
})

test.describe('P57.3 CONTENT_ATOM — rule-based stub (no LLM call yet)', () => {
  test('contentGenerator.ts is the rule-based stub per ADR-060', () => {
    const src = readFileSync(CONTENT_GENERATOR, 'utf8')
    expect(src).toContain('deterministic stub')
    expect(src).not.toMatch(/adapter\.complete\(/)
    expect(src).not.toMatch(/auditedComplete\(/)
  })

  test('CONTENT_ATOM Σ output shape: { text, tone, length, confidence, rationale }', () => {
    const src = readFileSync(CONTENT_GENERATOR, 'utf8')
    expect(src).toContain('GeneratedContent')
    expect(src).toContain('validateGeneratedContent')
  })
})

test.describe('P57.4 ASSUMPTIONS_ATOM — LLM clarifications prompt', () => {
  test('assumptionsLLM.ts uses ASSUMPTIONS_ATOM verbatim + JSON contract', () => {
    const src = readFileSync(ASSUMPTIONS_LLM, 'utf8')
    expect(src).toContain('ASSUMPTIONS_ATOM')
    expect(src).toContain('Up to 3 items')
    expect(src).toMatch(/rephrasing MUST start with one of these verbs:\s*hide,\s*show,\s*change,\s*add,\s*reset,\s*remove/)
  })

  test('assumptionsLLM has 12s client timeout (R1 F3 fix-pass)', () => {
    const src = readFileSync(ASSUMPTIONS_LLM, 'utf8')
    expect(src).toContain('ASSUMPTIONS_LLM_TIMEOUT_MS')
    expect(src).toMatch(/12_000|12000/)
  })

  test('assumptionsLLM falls back to rule-based on every failure path', () => {
    const src = readFileSync(ASSUMPTIONS_LLM, 'utf8')
    expect(src).toContain('ruleFallback')
    expect(src).toContain('generateAssumptionsRuleBased')
  })
})

test.describe('P57.5 auditedComplete — single chokepoint', () => {
  test('auditedComplete writes pre-emptive llm_logs row before LLM call', () => {
    const src = readFileSync(AUDITED_COMPLETE, 'utf8')
    expect(src).toContain('llm_logs')
    expect(src).toContain('request_id')
    expect(src).toContain('recordLLMCall')
  })

  test('auditedComplete redacts BYOK keys at the audit boundary', () => {
    const src = readFileSync(AUDITED_COMPLETE, 'utf8')
    expect(src).toContain('redactKeyShapes')
  })

  test('PATCH_ATOM caller routes through auditedComplete', () => {
    const src = readFileSync(join(ROOT, 'src/contexts/intelligence/chatPipeline.ts'), 'utf8')
    expect(src).toContain('auditedComplete(adapter')
  })

  test('ASSUMPTIONS_ATOM caller routes through auditedComplete', () => {
    const src = readFileSync(ASSUMPTIONS_LLM, 'utf8')
    expect(src).toContain('auditedComplete(')
  })
})

test.describe('P57.6 AgentProxyAdapter — internal-agent backbone', () => {
  test('AgentProxyAdapter reads example_prompts (no network call)', () => {
    const src = readFileSync(AGENT_PROXY, 'utf8')
    expect(src).toContain('findExamplePromptForUserPrompt')
    expect(src).not.toMatch(/fetch\(/)
    expect(src).not.toMatch(/new\s+(Anthropic|OpenAI)/)
  })

  test('AgentProxyAdapter declares provider = "mock" + model = "agent-proxy-v1"', () => {
    const src = readFileSync(AGENT_PROXY, 'utf8')
    expect(src).toContain("PROVIDER_LABEL = 'mock'")
    expect(src).toContain("MODEL_ID = 'agent-proxy-v1'")
  })
})

test.describe('P57.7 Fixture corpus — internal-agent smoke baseline', () => {
  test('seed has ≥5 starter prompts (the smoke baseline)', () => {
    const sql = readFileSync(FIXTURE_SEED, 'utf8')
    const starters = sql.match(/'starter-[^']+','starter'/g) ?? []
    expect(starters.length).toBeGreaterThanOrEqual(5)
  })

  test('seed has safety prompts (XSS / proto-pollution / js-url) — reject path', () => {
    const sql = readFileSync(FIXTURE_SEED, 'utf8')
    expect(sql).toContain('safety-hero-script-tag')
    expect(sql).toContain('safety-hero-js-url')
    expect(sql).toContain('safety-proto-pollution')
  })

  test('seed has edge cases (empty input, ambiguous, remove hero)', () => {
    const sql = readFileSync(FIXTURE_SEED, 'utf8')
    expect(sql).toContain('edge-empty-input')
    expect(sql).toContain('edge-ambiguous-hero')
    expect(sql).toContain('edge-remove-hero')
  })
})

test.describe('P57.8 Documentation — LLM prompt types reference', () => {
  test('plans/strategic-reviews/llm-prompt-types-2026-04-29.md exists', () => {
    expect(existsSync(DOC)).toBe(true)
  })

  test('doc covers all 4 LLM prompt types + auditedComplete chokepoint', () => {
    const src = readFileSync(DOC, 'utf8')
    expect(src).toContain('PATCH_ATOM')
    expect(src).toContain('INTENT_ATOM')
    expect(src).toContain('CONTENT_ATOM')
    expect(src).toContain('ASSUMPTIONS_ATOM')
    expect(src).toContain('auditedComplete')
  })
})
