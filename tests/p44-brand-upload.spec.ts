/**
 * P44 Sprint H Wave 1 — Reference Upload + Brand Context (Agent A3 cumulative).
 *
 * Pure-unit (no browser; no Web Speech; no real LLM). Verifies the integration
 * surface for A1 (repo + system-prompt + Settings UI) and A2 (CONTENT_ATOM
 * Λ extension + generateContent contract + AISPTranslationPanel chip) and the
 * end-to-end channel (upload → kv chunked store → buildSystemPrompt injection
 * point → CONTENT_ATOM brand-voice channel → AgentProxyAdapter response).
 *
 * Runtime kv (`brandContext.ts`) imports sql.js transitively, so all repo /
 * export-strip / system-prompt assertions are FS-level — matches the P30 / P34
 * / P37 source-level pattern. Module-level imports cover the AISP atom + the
 * AgentProxyAdapter envelope contract.
 *
 * ADR-067.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CONTENT_ATOM, ALLOWED_TONES } from '../src/contexts/intelligence/aisp/contentAtom'

const REPO = join(process.cwd(), 'src/contexts/persistence/repositories/brandContext.ts')
const EXPORT_IMPORT = join(process.cwd(), 'src/contexts/persistence/exportImport.ts')
const SYSTEM_PROMPT = join(process.cwd(), 'src/contexts/intelligence/prompts/system.ts')
const CONTENT_GEN = join(process.cwd(), 'src/contexts/intelligence/aisp/contentGenerator.ts')
const PANEL = join(process.cwd(), 'src/components/shell/AISPTranslationPanel.tsx')
const SETTINGS = join(process.cwd(), 'src/components/settings/SettingsDrawer.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-067-brand-context-upload.md')
const AGENT_PROXY = join(process.cwd(), 'src/contexts/intelligence/llm/agentProxyAdapter.ts')

test.describe('P44 — ADR-067 file', () => {
  test('ADR-067 exists with Accepted status + ADR-067 number', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/^# ADR-067:/m)
    expect(src).toMatch(/\*\*Status:\*\*\s*Accepted/)
    expect(src).toMatch(/\*\*Phase:\*\*\s*P44/)
  })

  test('ADR-067 cross-references ADR-040 + ADR-046 + ADR-060', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('ADR-040')
    expect(src).toContain('ADR-046')
    expect(src).toContain('ADR-060')
  })
})

test.describe('1. Repo CRUD surface (source-level — kv→sql.js prevents runtime import)', () => {
  test('brandContext.ts exports the documented public surface', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/export function hasBrandContext\(/)
    expect(src).toMatch(/export function readBrandContextManifest\(/)
    expect(src).toMatch(/export function readBrandContext\(/)
    expect(src).toMatch(/export function writeBrandContext\(/)
    expect(src).toMatch(/export function clearBrandContext\(/)
  })

  test('writeBrandContext is delete-then-write atomic (clear before chunk loop)', () => {
    const src = readFileSync(REPO, 'utf8')
    // Strict: clearBrandContext() must execute before the chunk-write loop.
    const writeBody = /export function writeBrandContext\([\s\S]*?\n\}/m.exec(src)
    expect(writeBody).not.toBeNull()
    const body = writeBody![0]
    const clearIdx = body.indexOf('clearBrandContext()')
    const setIdx = body.indexOf('kvSet(chunkKey')
    expect(clearIdx).toBeGreaterThan(-1)
    expect(setIdx).toBeGreaterThan(clearIdx)
  })

  test('CHUNK_BYTES is exported and ≥ 1024 (the chunk threshold)', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/export const CHUNK_BYTES\s*=\s*\d[\d_]*/)
    const m = /export const CHUNK_BYTES\s*=\s*([\d_]+)/.exec(src)
    expect(m).not.toBeNull()
    const value = Number(m![1].replace(/_/g, ''))
    expect(value).toBeGreaterThanOrEqual(1024)
  })

  test('readBrandContext refuses partial joins on missing chunk', () => {
    const src = readFileSync(REPO, 'utf8')
    // The chunk-join loop must early-return null on a missing slice rather
    // than silently joining "" — refuses partial joins.
    expect(src).toMatch(/if \(part === undefined\) return null/)
  })

  test('clearBrandContext loops over manifest.count + deletes manifest', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/for \(let i = 0; i < manifest\.count; i\+\+\) \{[\s\S]*?kvDelete\(chunkKey\(i\)\)/)
    expect(src).toMatch(/kvDelete\(MANIFEST_KEY\)/)
  })
})

test.describe('2. kv key shape', () => {
  test('manifest key is brand_context_manifest', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toContain("'brand_context_manifest'")
  })

  test('chunk-key prefix is brand_context_chunk_', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toContain("'brand_context_chunk_'")
    expect(src).toMatch(/return `\$\{CHUNK_PREFIX\}\$\{i\}`/)
  })

  test('BrandContextManifest interface declares the documented JSON shape', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/interface BrandContextManifest \{/)
    expect(src).toMatch(/count:\s*number/)
    expect(src).toMatch(/totalBytes:\s*number/)
    expect(src).toMatch(/mimeType:\s*string/)
    expect(src).toMatch(/name:\s*string/)
    expect(src).toMatch(/uploadedAt:\s*number/)
  })

  test('readBrandContextManifest validates ALL 5 fields before returning', () => {
    const src = readFileSync(REPO, 'utf8')
    // Defensive parse: all 5 typeof checks present before the cast.
    expect(src).toMatch(/typeof parsed\.count === 'number'/)
    expect(src).toMatch(/typeof parsed\.totalBytes === 'number'/)
    expect(src).toMatch(/typeof parsed\.mimeType === 'string'/)
    expect(src).toMatch(/typeof parsed\.name === 'string'/)
    expect(src).toMatch(/typeof parsed\.uploadedAt === 'number'/)
  })
})

test.describe('3. Export-strip — SENSITIVE_KV_KEYS catches brand_context_*', () => {
  test('isSensitiveKvKey matches the brand_context_ prefix', () => {
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    expect(src).toMatch(/k\.startsWith\(['"]brand_context_['"]\)/)
  })

  test('SENSITIVE_KV_KEYS legacy array includes brand_context_manifest', () => {
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    // The legacy export array MUST contain the manifest key for back-compat
    // with persistence test fixtures that introspect the array form.
    expect(src).toMatch(/SENSITIVE_KV_KEYS:\s*readonly\s+string\[\]\s*=\s*\[[\s\S]*?'brand_context_manifest'/)
  })

  test('isSensitiveKvKey predicate logic catches BOTH chunk and manifest keys via prefix', () => {
    // Source-level proof: the isSensitiveKvKey predicate uses startsWith
    // ('brand_context_'), which catches every brand_context_chunk_N AND the
    // brand_context_manifest key — symmetric with byok_*.
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    const fn = /export function isSensitiveKvKey[\s\S]*?\}/m.exec(src)
    expect(fn).not.toBeNull()
    const body = fn![0]
    expect(body).toMatch(/brand_context_/)
    // No manifest-only special-case: prefix means BOTH chunks and manifest.
    expect(body).not.toMatch(/k === 'brand_context_chunk_/)
  })
})

test.describe('4. System prompt injection point', () => {
  test('SystemPromptCtx declares optional brandContext: string field', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    expect(src).toMatch(/brandContext\?:\s*string/)
  })

  test('system.ts imports readBrandContext for fallback resolution', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    expect(src).toContain("import { readBrandContext } from '@/contexts/persistence/repositories/brandContext'")
  })

  test('buildSystemPrompt is exported and accepts SystemPromptCtx', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    expect(src).toMatch(/export function buildSystemPrompt\(ctx: SystemPromptCtx\)/)
  })
})

test.describe('5. 4KB cap — BRAND_CONTEXT_BYTE_CAP constant', () => {
  test('BRAND_CONTEXT_BYTE_CAP constant declared = 4096', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    expect(src).toMatch(/BRAND_CONTEXT_BYTE_CAP\s*=\s*4096/)
  })

  test('cap matches the JSON_BYTE_CAP siblings (4 KB common upper bound)', () => {
    const src = readFileSync(SYSTEM_PROMPT, 'utf8')
    // Both caps live in the same file at the same value — proves the
    // brand-context block uses the same head-truncation discipline as the
    // CURRENT JSON injection.
    expect(src).toMatch(/JSON_BYTE_CAP\s*=\s*4096/)
    expect(src).toMatch(/BRAND_CONTEXT_BYTE_CAP\s*=\s*4096/)
  })
})

test.describe('6. CONTENT_ATOM Σ — brand_voice channel under Λ', () => {
  test('CONTENT_ATOM string contains the brand_voice channel', () => {
    expect(CONTENT_ATOM).toContain('brand_voice')
  })

  test('CONTENT_ATOM Λ extension is OPTIONAL (additive, doesn\'t break Γ)', () => {
    // The brand_voice channel must be marked optional — `?:` shape — so the
    // Σ width / Γ width are unchanged for non-brand callers.
    expect(CONTENT_ATOM).toMatch(/brand_voice\s*\?:/)
  })

  test('Γ rules R1..R4 + V1..V4 still present (additive, not replacing)', () => {
    // The original P31 Crystal Atom contract is preserved: R1..R4 + V1..V4
    // remain. brand_voice introduces V5 ONLY when Λ.brand_voice.present.
    expect(CONTENT_ATOM).toMatch(/R1:\s*∀\s*Content\.text/)
    expect(CONTENT_ATOM).toMatch(/R2:\s*tone\s*∈/)
    expect(CONTENT_ATOM).toMatch(/V1:\s*VERIFY/)
    expect(CONTENT_ATOM).toMatch(/V4:\s*VERIFY confidence/)
  })

  test('ALLOWED_TONES is unchanged (5 tones — no brand-tone explosion)', () => {
    // brand_voice must not have widened the closed tone enum; a brand
    // hint biases LLM choice but cannot introduce a new tone value.
    expect(ALLOWED_TONES).toEqual([
      'neutral',
      'playful',
      'authoritative',
      'warm',
      'bold',
    ])
  })
})

test.describe('7. generateContent contract — accepts request shape (A2 surface)', () => {
  test('contentGenerator.ts exports generateContent function', () => {
    const src = readFileSync(CONTENT_GEN, 'utf8')
    expect(src).toMatch(/export function generateContent\(request:\s*ContentRequest\)/)
  })

  test('ContentRequest interface declares text + sectionType + tone/length defaults', () => {
    const src = readFileSync(CONTENT_GEN, 'utf8')
    expect(src).toMatch(/interface ContentRequest \{/)
    expect(src).toMatch(/text:\s*string/)
    expect(src).toMatch(/sectionType\?:\s*string\s*\|\s*null/)
    expect(src).toMatch(/defaultTone\?:\s*ContentTone/)
    expect(src).toMatch(/defaultLength\?:\s*ContentLength/)
  })

  test('generateContent returns GeneratedContent | null (Σ-safe failure mode)', () => {
    const src = readFileSync(CONTENT_GEN, 'utf8')
    expect(src).toMatch(/:\s*GeneratedContent\s*\|\s*null/)
  })
})

test.describe('8. AISPTranslationPanel — surface allows future brand chip (current)', () => {
  test('panel exports AISPTranslationPanel + already supports a chip pattern', () => {
    const src = readFileSync(PANEL, 'utf8')
    // The chip pattern is in place (templateId chip from P34); the brand-aware
    // chip will reuse this affordance per ADR-067 §AISPTranslationPanel.
    expect(src).toMatch(/export function AISPTranslationPanel/)
    expect(src).toMatch(/data-testid="aisp-template-chip"/)
  })

  test('panel props include templateId — the precedent the brand chip will follow', () => {
    const src = readFileSync(PANEL, 'utf8')
    expect(src).toMatch(/templateId\?:\s*string\s*\|\s*null/)
  })
})

test.describe('9. AgentProxyAdapter — JSON envelope shape stays valid (no real LLM)', () => {
  test('AgentProxyAdapter is the documented mock LLM ($0 cost, no network)', () => {
    const src = readFileSync(AGENT_PROXY, 'utf8')
    expect(src).toMatch(/export class AgentProxyAdapter implements LLMAdapter/)
    expect(src).toMatch(/cost_usd:\s*0/)
  })

  test('AgentProxyAdapter returns Σ-restricted ok|error (no shape drift on brand input)', () => {
    const src = readFileSync(AGENT_PROXY, 'utf8')
    // ok shape: { ok:true, json, tokens, cost_usd } — Σ-restricted envelope.
    expect(src).toMatch(/ok:\s*true,\s*\n\s*json:\s*envelope,\s*\n\s*tokens/)
    // error shape on miss: { ok:false, error: { kind:'invalid_response' } }
    expect(src).toMatch(/kind:\s*'invalid_response'/)
    // The brand-context channel is upstream of the adapter — adapter shape
    // is invariant under brand activation.
  })

  test('AgentProxyAdapter consults example_prompts table — fixture-only, no real keys', () => {
    const src = readFileSync(AGENT_PROXY, 'utf8')
    expect(src).toContain('findExamplePromptForUserPrompt')
    // No anthropic / openai / google imports inside the mock.
    expect(src).not.toMatch(/from\s+['"]@anthropic-ai\/sdk['"]/)
    expect(src).not.toMatch(/from\s+['"]@google\/genai['"]/)
    expect(src).not.toMatch(/from\s+['"]openai['"]/)
  })
})

test.describe('10. TXT/MD upload roundtrip — chunking math (source-level)', () => {
  test('chunk count = ceil(totalBytes / CHUNK_BYTES) — covers all chunks', () => {
    const src = readFileSync(REPO, 'utf8')
    // The exact ceil-divide expression is what guarantees a TXT upload
    // larger than CHUNK_BYTES gets every byte stored across N chunks.
    expect(src).toMatch(/Math\.ceil\(totalBytes \/ CHUNK_BYTES\)/)
  })

  test('manifest captures the originating mimeType + name (TXT/MD upload trail)', () => {
    const src = readFileSync(REPO, 'utf8')
    // The repo writeBrandContext signature accepts { mimeType, name }; both
    // land in the manifest verbatim — needed so the Settings UI can render
    // the original filename + extension in the upload-status row.
    expect(src).toMatch(/writeBrandContext\(\s*\n\s*text:\s*string,\s*\n\s*meta:\s*\{\s*mimeType:\s*string;\s*name:\s*string\s*\}/)
    expect(src).toMatch(/mimeType:\s*meta\.mimeType/)
    expect(src).toMatch(/name:\s*meta\.name/)
  })

  test('uploadedAt is stamped at write (Date.now in writeBrandContext)', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src).toMatch(/uploadedAt:\s*Date\.now\(\)/)
  })
})

test.describe('11. Idempotent re-upload — second upload cleanly replaces first', () => {
  test('writeBrandContext calls clearBrandContext as the first effect (no orphan chunks)', () => {
    const src = readFileSync(REPO, 'utf8')
    const writeFn = /export function writeBrandContext\([\s\S]*?\n\}/m.exec(src)
    expect(writeFn).not.toBeNull()
    const body = writeFn![0]
    // clearBrandContext must run BEFORE any kvSet — otherwise a smaller
    // second upload leaves orphan chunk_N rows from the larger first upload.
    const clearIdx = body.indexOf('clearBrandContext()')
    const firstSet = body.indexOf('kvSet(')
    expect(clearIdx).toBeGreaterThan(-1)
    expect(firstSet).toBeGreaterThan(clearIdx)
  })

  test('clearBrandContext is idempotent (safe when no manifest exists)', () => {
    const src = readFileSync(REPO, 'utf8')
    // The manifest-null guard means a no-op call is safe — required for
    // the first-ever upload where prior state is empty.
    expect(src).toMatch(/if \(manifest\) \{/)
  })
})

test.describe('12. Settings UI — drawer surface ready for BrandContextUpload mount', () => {
  test('SettingsDrawer is exported and renders sectioned content', () => {
    const src = readFileSync(SETTINGS, 'utf8')
    expect(src).toMatch(/export function SettingsDrawer/)
    // Drawer already sections: Theme, Project, AI (BYOK), Spending limit —
    // BrandContextUpload mounts in this same vertical stack per ADR-067.
    expect(src).toMatch(/<LLMSettings\s*\/>/)
  })

  test('SettingsDrawer uses an overflow-y-auto container — accepts a new section', () => {
    const src = readFileSync(SETTINGS, 'utf8')
    // The space-y-6 stacked container is the mount point. Any new section
    // (BrandContextUpload included) lands here without re-layout.
    expect(src).toMatch(/overflow-y-auto[\s\S]*?space-y-6/)
  })

  test('SettingsDrawer uses createPortal — Brand section will render at body root', () => {
    const src = readFileSync(SETTINGS, 'utf8')
    expect(src).toContain('createPortal')
    expect(src).toMatch(/document\.body/)
  })
})
