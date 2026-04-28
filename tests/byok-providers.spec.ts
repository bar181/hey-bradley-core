/**
 * BYOK provider matrix tests (P35 prelude).
 *
 * Pure-unit (no live LLM calls; no browser). Asserts:
 *   - Provider matrix surface: claude / gemini / openai / openrouter / simulated / mock
 *   - Each real adapter exists with the documented default model
 *   - Cost-per-million-token constants match 2026 pricing
 *   - Key shape validators reject cross-provider keys
 *   - LLMSettings <select> exposes all 6 providers
 *
 * Cross-ref: P35 BYOK audit (this commit). Live-call human review planned at
 * end of phase per owner mandate.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Inline copies of key validators — keys.ts transitively imports kv repo
// which pulls Vite-only `import.meta.glob`. Mirror the regexes verbatim.
function looksLikeAnthropicKey(k: string): boolean {
  return /^sk-ant-/i.test(k.trim())
}
function looksLikeGoogleKey(k: string): boolean {
  return /^AIza/.test(k.trim())
}
function looksLikeOpenAIKey(k: string): boolean {
  const t = k.trim()
  if (/^sk-ant-/i.test(t)) return false
  return /^sk-(?:proj-)?[A-Za-z0-9_-]{20,}$/.test(t)
}
function redactKeyShapes(s: string): string {
  if (!s) return s
  return s
    .replace(/sk-ant-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/sk-proj-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/AIza[0-9A-Za-z_-]{35}/g, '[REDACTED]')
    .replace(/Bearer\s+\S+/g, '[REDACTED]')
}

const ADAPTER_DIR = join(process.cwd(), 'src/contexts/intelligence/llm')
const SETTINGS = join(process.cwd(), 'src/components/settings/LLMSettings.tsx')
const PICK = join(ADAPTER_DIR, 'pickAdapter.ts')
const ADAPTER_TYPES = join(ADAPTER_DIR, 'adapter.ts')

test.describe('BYOK matrix — provider surface', () => {
  test('LLMProviderName union enumerates all 6 providers', () => {
    const src = readFileSync(ADAPTER_TYPES, 'utf8')
    expect(src).toContain("'claude'")
    expect(src).toContain("'gemini'")
    expect(src).toContain("'openai'")
    expect(src).toContain("'openrouter'")
    expect(src).toContain("'simulated'")
    expect(src).toContain("'mock'")
  })

  test('pickAdapter dispatches all 4 real providers', () => {
    const src = readFileSync(PICK, 'utf8')
    expect(src).toMatch(/provider === 'claude'/)
    expect(src).toMatch(/provider === 'gemini'/)
    expect(src).toMatch(/provider === 'openai'/)
    expect(src).toMatch(/provider === 'openrouter'/)
  })

  test('LLMSettings <select> exposes all 6 provider options', () => {
    const src = readFileSync(SETTINGS, 'utf8')
    for (const p of ['simulated', 'mock', 'gemini', 'openai', 'openrouter', 'claude']) {
      expect(src).toContain(`value="${p}"`)
    }
  })
})

test.describe('BYOK matrix — default models (cheap + fast per provider)', () => {
  test('Claude default is claude-haiku-4-5-20251001', () => {
    const src = readFileSync(join(ADAPTER_DIR, 'claudeAdapter.ts'), 'utf8')
    expect(src).toMatch(/DEFAULT_MODEL\s*=\s*'claude-haiku-4-5-20251001'/)
  })

  test('Gemini default is gemini-2.5-flash', () => {
    const src = readFileSync(join(ADAPTER_DIR, 'geminiAdapter.ts'), 'utf8')
    expect(src).toMatch(/DEFAULT_MODEL\s*=\s*'gemini-2.5-flash'/)
  })

  test('OpenAI default is gpt-5-nano (cheap + fast per OpenAI 2026 docs)', () => {
    const src = readFileSync(join(ADAPTER_DIR, 'openaiAdapter.ts'), 'utf8')
    expect(src).toMatch(/DEFAULT_MODEL\s*=\s*'gpt-5-nano'/)
  })

  test('OpenRouter default is mistral-7b-instruct:free', () => {
    const src = readFileSync(join(ADAPTER_DIR, 'openrouterAdapter.ts'), 'utf8')
    expect(src).toMatch(/DEFAULT_MODEL\s*=\s*'mistralai\/mistral-7b-instruct:free'/)
  })
})

test.describe('BYOK matrix — 2026 cost-per-million updated', () => {
  test('Claude Haiku 4.5 cost = $1/$5', () => {
    const src = readFileSync(join(ADAPTER_DIR, 'claudeAdapter.ts'), 'utf8')
    expect(src).toMatch(/in:\s*1\.0,\s*out:\s*5\.0/)
  })

  test('Gemini 2.5 Flash cost = $0.30/$2.50', () => {
    const src = readFileSync(join(ADAPTER_DIR, 'geminiAdapter.ts'), 'utf8')
    expect(src).toMatch(/in:\s*0\.30,\s*out:\s*2\.50/)
  })

  test('OpenAI gpt-5-nano cost = $0.05/$0.40', () => {
    const src = readFileSync(join(ADAPTER_DIR, 'openaiAdapter.ts'), 'utf8')
    expect(src).toMatch(/in:\s*0\.05,\s*out:\s*0\.40/)
  })
})

test.describe('BYOK matrix — key shape validators', () => {
  test('Anthropic key shape (sk-ant-…)', () => {
    expect(looksLikeAnthropicKey('sk-ant-api03-abcdefg1234567890ABCDEF')).toBe(true)
    expect(looksLikeAnthropicKey('AIzaSyD-abcdefg')).toBe(false)
    expect(looksLikeAnthropicKey('sk-proj-abc')).toBe(false)
  })

  test('Google key shape (AIza…)', () => {
    expect(looksLikeGoogleKey('AIzaSyD-12345678901234567890123456789012345')).toBe(true)
    expect(looksLikeGoogleKey('sk-ant-api03-abc')).toBe(false)
  })

  test('OpenAI key shape accepts sk- and sk-proj- but rejects sk-ant-', () => {
    expect(looksLikeOpenAIKey('sk-' + 'a'.repeat(48))).toBe(true)
    expect(looksLikeOpenAIKey('sk-proj-' + 'a'.repeat(48))).toBe(true)
    expect(looksLikeOpenAIKey('sk-ant-api03-abc1234567890')).toBe(false) // Anthropic pre-empts
    expect(looksLikeOpenAIKey('AIza' + 'a'.repeat(35))).toBe(false)
  })
})

test.describe('BYOK matrix — error redaction handles all key shapes', () => {
  test('redactKeyShapes redacts all 3 paid-provider key formats', () => {
    expect(redactKeyShapes('error: sk-ant-api03-' + 'x'.repeat(40))).toContain('[REDACTED]')
    expect(redactKeyShapes('error: sk-proj-' + 'x'.repeat(40))).toContain('[REDACTED]')
    expect(redactKeyShapes('error: AIza' + 'x'.repeat(35))).toContain('[REDACTED]')
    expect(redactKeyShapes('Bearer sk-or-' + 'x'.repeat(40))).toContain('[REDACTED]')
  })

  test('redactKeyShapes leaves clean text untouched', () => {
    expect(redactKeyShapes('hello world')).toBe('hello world')
    expect(redactKeyShapes('rate limit hit')).toBe('rate limit hit')
  })
})

test.describe('BYOK matrix — adapter contract uniformity', () => {
  test('All 4 real adapters implement LLMAdapter (name/label/model/testConnection/complete)', () => {
    const adapters = ['claudeAdapter.ts', 'geminiAdapter.ts', 'openaiAdapter.ts', 'openrouterAdapter.ts']
    for (const f of adapters) {
      const src = readFileSync(join(ADAPTER_DIR, f), 'utf8')
      expect(src, `${f} declares name()`).toMatch(/name\(\):\s*LLMProviderName/)
      expect(src, `${f} declares label()`).toMatch(/label\(\):\s*string/)
      expect(src, `${f} declares model()`).toMatch(/model\(\):\s*string/)
      expect(src, `${f} declares testConnection()`).toMatch(/testConnection\(\):\s*Promise<boolean>/)
      expect(src, `${f} declares complete()`).toMatch(/complete\(.*?LLMRequest.*?\):\s*Promise<LLMResponse>/)
    }
  })

  test('All 4 real adapters use shared adapterUtils (safeJson + classifyError)', () => {
    const adapters = ['claudeAdapter.ts', 'geminiAdapter.ts', 'openaiAdapter.ts', 'openrouterAdapter.ts']
    for (const f of adapters) {
      const src = readFileSync(join(ADAPTER_DIR, f), 'utf8')
      expect(src, `${f} imports safeJson + classifyError`).toMatch(/from '\.\/adapterUtils'/)
    }
  })

  test('All 4 real adapters honor AbortSignal (req.signal)', () => {
    const adapters = ['claudeAdapter.ts', 'geminiAdapter.ts', 'openaiAdapter.ts', 'openrouterAdapter.ts']
    for (const f of adapters) {
      const src = readFileSync(join(ADAPTER_DIR, f), 'utf8')
      expect(src, `${f} forwards req.signal`).toContain('req.signal')
    }
  })
})

test.describe('BYOK matrix — folder scaffolding sanity', () => {
  test('Adapters live under src/contexts/intelligence/llm/ (DDD bounded context)', () => {
    const expected = ['adapter.ts', 'adapterUtils.ts', 'pickAdapter.ts', 'keys.ts']
    for (const f of expected) {
      const src = readFileSync(join(ADAPTER_DIR, f), 'utf8')
      expect(src.length).toBeGreaterThan(0)
    }
  })

  test('No adapter file lives outside intelligence/llm/ or stt/', async () => {
    const { execSync } = await import('node:child_process')
    const out = execSync('find src -name "*Adapter.ts" -type f', { encoding: 'utf8' })
    const files = out.split('\n').filter((l) => l.trim().length > 0)
    for (const f of files) {
      expect(f).toMatch(/intelligence\/(llm|stt)\//)
    }
  })
})
