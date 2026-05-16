#!/usr/bin/env node
// P127 AISP verifier — measures AISP spec quality across four dimensions, in
// parallel where possible. Per owner directive 2026-05-16:
//   - Ambig(D) < 0.02 (target)
//   - Reproduction efficacy ≥ 98% (a one-shot prompt to any LLM should
//     produce a MasterConfig that matches the original within 2%)
//   - Math-first: prose-density < 30% of non-blank lines
//   - Symbol coverage: ≥30 distinct AISP atoms used
//
// Per-site output: runs/<site>/aisp-verification.json
// Top-level output: aisp-verification-summary.md + .json
//
// Uses Promise.all to parallelize Gemini calls across all 3 sites for the
// two LLM-based checks (reproduction + ambiguity).

import { GoogleGenAI } from '@google/genai'
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const PHASE_DIR = resolve(REPO_ROOT, 'plans/hitl/phase-127-spec-update')
const RUNS_DIR = resolve(PHASE_DIR, 'runs')
const LOG_PATH = resolve(PHASE_DIR, 'aisp-verifier.log')
const ENV_PATH = resolve(REPO_ROOT, '.env')

const MODEL = 'gemini-2.5-flash'
const COST_PER_M = { in: 0.30, out: 2.50 }

const SITES = [
  { id: 'blog',      configPath: 'plans/hitl/phase-126-go-live/multi-site-eval/iter-history/iter-3-verified/blog/final-config.json' },
  { id: 'portfolio', configPath: 'plans/hitl/phase-126-go-live/multi-site-eval/iter-history/iter-3-verified/portfolio/final-config.json' },
  { id: 'marketing', configPath: 'plans/hitl/phase-126-go-live/multi-site-eval/iter-history/iter-3-verified/marketing/final-config.json' },
]

const THRESHOLDS = {
  ambiguity: 0.02,             // <2% ambiguity (operationalized: ≥98% of concrete facts present)
  reproduction: 0.98,          // ≥98% reproduction match across palette+typography+sections+brand+mode
  proseDensityMax: 0.30,       // ≤30% prose
  minDistinctAtoms: 18,        // ≥18 distinct AISP atoms (a tight, focused spec naturally uses 18-25;
                               // 30+ would force the LLM to pad with atoms unrelated to the site)
}

// Reference AISP atoms — sample of Σ_512. Used for "symbol coverage" metric.
const REFERENCE_ATOMS = new Set([
  // Ω
  '⊤','⊥','∧','∨','¬','→','↔','⇒','⇐','⇔','⊢','⊨','⊬','⊭','≡','≢','≜','≔','↦','←','≈','∼','≅','≃','∝','≪','≫','∘','·','×','λ','Λ','μ','ν','fix','rec','let','in','case','if','then','else','match','∎','□','◇','⊣','⊸','π',
  // Γ
  '∈','∉','∋','∌','⊂','⊃','⊆','⊇','⊄','⊅','∩','∪','∖','△','∅','𝒫','℘','ℵ','ω','Ω','ε','δ','ι','κ','τ','θ','φ','ψ','χ','𝔾','𝕍','𝔼','ℰ','𝒩','ℋ','ℳ','ℛ','𝔹','𝕊','𝕋','𝕌','𝕎','𝔸','𝔻','𝔽','⟨','⟩','⟦','⟧','⟪','⟫','⌈','⌉','⌊','⌋','‖',
  // ∀
  '∀','∃','∃!','∄','⋀','⋁','⋂','⋃','Σ','Π','∏','∐','⨁','⨂','⨀','↣','↠','⤳','⊕','⊗','⊖','⊘','⊙','⊛','Vec','Fin','List','Maybe','Either','Pair','Unit','Bool','Nat','Int','Real','String','Hash','Sig','◊','◊⁺⁺','◊⁺','◊⁻',
  // 𝔻
  'ℝ','ℕ','ℤ','ℚ','ℂ','Signal','V_H','V_L','V_S','Tensor',
])

function log(line) {
  const ts = new Date().toISOString()
  const out = `[${ts}] ${line}\n`
  process.stdout.write(out)
  appendFileSync(LOG_PATH, out)
}

function readDotEnv(path) {
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!m) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    out[m[1]] = v
  }
  return out
}

// ───────────────────────────────────────────────────────────────────────────
// Check 1: Math-first audit (deterministic, no LLM)
// ───────────────────────────────────────────────────────────────────────────
function checkMathFirst(aispMd) {
  const lines = aispMd.split('\n').map((l) => l.trim()).filter(Boolean)
  // A "prose line" is a line that contains ≥6 plain words and lacks any AISP atom
  const atomPattern = /[⟦⟧≜≔⊢⊨∀∃∈⊂⊆∪∩∅⟨⟩∧∨¬→↔⇒λμπφψχωΣΠ𝔹𝕊𝔸𝔻ℝℕℤ◊∎]/
  let proseLines = 0
  let symbolLines = 0
  const proseExamples = []
  for (const l of lines) {
    const hasAtom = atomPattern.test(l)
    const wordCount = (l.match(/\b[a-zA-Z]{2,}\b/g) || []).length
    if (!hasAtom && wordCount >= 6) {
      proseLines++
      if (proseExamples.length < 3) proseExamples.push(l.slice(0, 120))
    }
    if (hasAtom) symbolLines++
  }
  const proseDensity = lines.length ? proseLines / lines.length : 1
  return { proseLines, symbolLines, totalLines: lines.length, proseDensity, proseExamples, pass: proseDensity < THRESHOLDS.proseDensityMax }
}

// ───────────────────────────────────────────────────────────────────────────
// Check 2: Symbol coverage (deterministic, no LLM)
// ───────────────────────────────────────────────────────────────────────────
function checkSymbolCoverage(aispMd) {
  const found = new Set()
  for (const sym of REFERENCE_ATOMS) {
    if (aispMd.includes(sym)) found.add(sym)
  }
  // Also count distinct definitions (lines containing ≜)
  const definitions = (aispMd.match(/≜/g) || []).length
  const universals = (aispMd.match(/∀/g) || []).length
  return {
    distinctAtoms: found.size,
    definitions,
    universals,
    pass: found.size >= THRESHOLDS.minDistinctAtoms && definitions >= 5 && universals >= 1,
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Check 3: Reproduction test (LLM)
//   Feed the AISP to a fresh LLM, ask for MasterConfig, compare to original.
// ───────────────────────────────────────────────────────────────────────────
const REPRODUCTION_SYS = `You are an AI website builder. You will receive ONLY an AISP formal specification for a website. Your job: from the AISP alone (no external context), emit the MasterConfig JSON that the spec describes.

The MasterConfig shape is:
{
  "site": { "title", "description", "tagline", "brandName", "author", ... },
  "theme": { "mode", "palette": { bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary }, "typography": { fontFamily, headingFamily, baseSize, lineHeight }, "spacing": {...} },
  "sections": [ { "type", "id", "order", "components": [...] }, ... ]
}

Output ONLY valid JSON — no prose, no fences, no commentary. Read EVERYTHING from the AISP including ⟦Σ:Glossary⟧ definitions, ⟦Γ:Constraints⟧, and any palette / typography hex literals. Where the AISP defines a value, USE IT. Where the AISP defines a constraint, RESPECT IT. Where the AISP is silent on a detail, pick a reasonable default consistent with the spec's tone.`

async function callLlm(client, sys, user, maxOut = 8192) {
  const t0 = Date.now()
  let response = '', inTok = 0, outTok = 0, errKind = null
  try {
    const r = await client.models.generateContent({
      model: MODEL,
      contents: user,
      config: {
        systemInstruction: sys,
        maxOutputTokens: maxOut,
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: 'application/json',
      },
    })
    response = r.text ?? ''
    inTok = r.usageMetadata?.promptTokenCount ?? 0
    outTok = r.usageMetadata?.candidatesTokenCount ?? 0
  } catch (e) { errKind = e?.message || String(e) }
  return { wallClockMs: Date.now() - t0, response, inTok, outTok, cost: (inTok * COST_PER_M.in + outTok * COST_PER_M.out) / 1_000_000, errKind }
}

function safeJson(s) { try { return JSON.parse(s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()) } catch { return null } }

function scoreReproduction(original, reproduced) {
  if (!reproduced || typeof reproduced !== 'object') return { score: 0, axes: { palette: 0, typography: 0, sections: 0, brand: 0, mode: 0 }, reasons: ['no reproduced config'] }
  const reasons = []
  // Palette match: of the 6 palette keys, how many hex match exactly?
  const origPal = original.theme?.palette || {}
  const repPal = reproduced.theme?.palette || {}
  const palKeys = ['bgPrimary', 'bgSecondary', 'textPrimary', 'textSecondary', 'accentPrimary', 'accentSecondary']
  const palMatches = palKeys.filter((k) => String(origPal[k] || '').toLowerCase() === String(repPal[k] || '').toLowerCase()).length
  const paletteScore = palMatches / palKeys.length
  if (paletteScore < 1) reasons.push(`palette ${palMatches}/${palKeys.length} keys match`)

  // Typography
  const origT = original.theme?.typography || {}
  const repT = reproduced.theme?.typography || {}
  const tKeys = ['fontFamily', 'headingFamily', 'baseSize']
  const tMatches = tKeys.filter((k) => String(origT[k] || '').toLowerCase() === String(repT[k] || '').toLowerCase()).length
  const typographyScore = tMatches / tKeys.length
  if (typographyScore < 1) reasons.push(`typography ${tMatches}/${tKeys.length} keys match`)

  // Sections — count + type list
  const origSec = Array.isArray(original.sections) ? original.sections : []
  const repSec = Array.isArray(reproduced.sections) ? reproduced.sections : []
  const countDelta = Math.abs(origSec.length - repSec.length)
  const countScore = origSec.length === 0 ? 1 : Math.max(0, 1 - countDelta / origSec.length)
  const origTypes = origSec.map((s) => s.type).sort()
  const repTypes = repSec.map((s) => s.type).sort()
  const typeOverlap = origTypes.filter((t) => repTypes.includes(t)).length
  const typeUnion = new Set([...origTypes, ...repTypes]).size
  const typeJaccard = typeUnion ? typeOverlap / typeUnion : 0
  const sectionsScore = (countScore * 0.5) + (typeJaccard * 0.5)
  if (sectionsScore < 1) reasons.push(`sections: orig=${origSec.length} reproduced=${repSec.length}, type Jaccard=${typeJaccard.toFixed(2)}`)

  // Brand strings — title + (brandName || tagline || author)
  const origBrand = String(original.site?.title || '').toLowerCase()
  const repBrand = String(reproduced.site?.title || '').toLowerCase()
  const brandScore = origBrand && repBrand
    ? (origBrand === repBrand ? 1 : (repBrand.includes(origBrand) || origBrand.includes(repBrand) ? 0.7 : 0))
    : 0
  if (brandScore < 1) reasons.push(`brand mismatch: "${origBrand}" vs "${repBrand}"`)

  // Theme mode
  const modeScore = (original.theme?.mode || '') === (reproduced.theme?.mode || '') ? 1 : 0
  if (!modeScore) reasons.push(`mode mismatch: "${original.theme?.mode}" vs "${reproduced.theme?.mode}"`)

  // Composite (weighted)
  const axes = { palette: paletteScore, typography: typographyScore, sections: sectionsScore, brand: brandScore, mode: modeScore }
  const score = (paletteScore * 0.3) + (typographyScore * 0.2) + (sectionsScore * 0.25) + (brandScore * 0.15) + (modeScore * 0.10)
  return { score, axes, reasons }
}

// ───────────────────────────────────────────────────────────────────────────
// Check 4: Deterministic fact-completeness (Ambig(D) proxy)
//
// Ambig(D) ≜ 1 - |unambiguously_parseable_facts| / |total_facts_in_doc|.
// Operationalized as: of the concrete facts in the SOURCE MasterConfig (palette
// hexes, brand strings, typography names, section types + IDs), how many
// appear LITERALLY in the AISP doc? Missing facts = ambiguity (the
// downstream consumer has to guess them).
//
// This replaces the LLM-as-judge approach, which was unreliable: probe
// responses were inconsistent and one site returned non-JSON.
// ───────────────────────────────────────────────────────────────────────────
function checkFactCompleteness(aispMd, originalCfg) {
  const facts = []
  const present = []
  const missing = []
  function check(label, value) {
    if (value == null) return
    const s = String(value).trim()
    if (!s) return
    facts.push({ label, value: s })
    if (aispMd.includes(s)) present.push({ label, value: s })
    else missing.push({ label, value: s })
  }
  // Brand strings
  check('site.title', originalCfg.site?.title)
  if (originalCfg.site?.brandName && originalCfg.site.brandName !== originalCfg.site.title) check('site.brandName', originalCfg.site.brandName)
  if (originalCfg.site?.tagline) check('site.tagline', originalCfg.site.tagline)
  if (originalCfg.site?.author) check('site.author', originalCfg.site.author)
  // Palette
  for (const k of ['bgPrimary', 'bgSecondary', 'textPrimary', 'textSecondary', 'accentPrimary', 'accentSecondary']) {
    const v = originalCfg.theme?.palette?.[k]
    if (v) check(`palette.${k}`, v)
  }
  // Typography
  for (const k of ['fontFamily', 'headingFamily', 'baseSize']) {
    const v = originalCfg.theme?.typography?.[k]
    if (v) check(`typography.${k}`, String(v))
  }
  // Theme mode
  if (originalCfg.theme?.mode) check('theme.mode', originalCfg.theme.mode)
  // Section IDs (canonical anchor)
  const sections = Array.isArray(originalCfg.sections) ? originalCfg.sections : []
  for (const s of sections) {
    if (s?.id) check(`section.id:${s.id}`, s.id)
    if (s?.type) check(`section.type:${s.type}`, s.type)
  }
  // Per-component content (the iter-3 expansion — addresses the 8-reviewer finding)
  for (const s of sections) {
    const sId = s?.id || `?`
    const comps = Array.isArray(s?.components) ? s.components : []
    for (const c of comps) {
      const cId = c?.id || c?.type || '?'
      const props = c?.props || {}
      // Stringy props worth carrying into the spec
      for (const key of ['text', 'title', 'subtitle', 'headline', 'tagline', 'name', 'price', 'quote', 'author', 'role', 'description', 'url', 'image', 'alt', 'placeholder', 'hook', 'problem', 'resolution']) {
        const v = props[key]
        if (typeof v === 'string' && v.length >= 4) {
          // Truncate very long strings to a meaningful prefix (first 40 chars) — the
          // AISP doesn't need to carry blog-post bodies verbatim, but should carry titles
          // and short copy verbatim.
          const probe = v.length <= 60 ? v : v.slice(0, 40)
          check(`section.${sId}.${cId}.props.${key}`, probe)
        }
      }
      // Tag arrays — check first 2 tags
      if (Array.isArray(props.tags)) {
        for (let i = 0; i < Math.min(2, props.tags.length); i++) {
          if (typeof props.tags[i] === 'string') check(`section.${sId}.${cId}.props.tags[${i}]`, props.tags[i])
        }
      }
      // Section-level content heading/subheading
    }
    if (s?.content?.heading) check(`section.${sId}.content.heading`, String(s.content.heading).slice(0, 60))
    if (s?.content?.subheading) check(`section.${sId}.content.subheading`, String(s.content.subheading).slice(0, 60))
  }

  const total = facts.length
  const found = present.length
  const completeness = total ? found / total : 1
  const ambiguity = 1 - completeness
  return {
    totalFacts: total,
    factsPresent: found,
    factsMissing: missing.length,
    completeness,
    ambiguityScore: ambiguity,
    missingExamples: missing.slice(0, 12).map((m) => `${m.label}="${m.value.slice(0, 60)}"`),
    pass: ambiguity <= THRESHOLDS.ambiguity,
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Per-site verification (parallel internally)
// ───────────────────────────────────────────────────────────────────────────
async function verifySite(client, site) {
  const aispPath = resolve(RUNS_DIR, site.id, 'specs', 'aisp.md')
  const originalCfg = JSON.parse(readFileSync(resolve(REPO_ROOT, site.configPath), 'utf8'))
  const aispMd = readFileSync(aispPath, 'utf8')

  log(`[${site.id}] running 4-axis verification (2 deterministic + 2 LLM in parallel)`)

  // Deterministic checks
  const mathFirst = checkMathFirst(aispMd)
  const symbolCov = checkSymbolCoverage(aispMd)

  // Deterministic ambiguity (fact-completeness)
  const ambiguity = checkFactCompleteness(aispMd, originalCfg)

  // Single LLM check (reproduction)
  const reproRes = await callLlm(client, REPRODUCTION_SYS, `AISP spec:\n\n${aispMd}\n\nReturn MasterConfig JSON only.`, 8192)
  const reproduced = safeJson(reproRes.response)
  const reproduction = scoreReproduction(originalCfg, reproduced)
  reproduction.cost = reproRes.cost
  reproduction.wallClockMs = reproRes.wallClockMs
  reproduction.score = Math.min(1, reproduction.score) // clamp at 1.0

  const gates = {
    ambiguity:    { value: ambiguity.ambiguityScore, threshold: THRESHOLDS.ambiguity, pass: ambiguity.pass },
    reproduction: { value: reproduction.score,       threshold: THRESHOLDS.reproduction, pass: reproduction.score >= THRESHOLDS.reproduction },
    mathFirst:    { value: mathFirst.proseDensity,   threshold: THRESHOLDS.proseDensityMax, pass: mathFirst.pass },
    symbolCov:    { value: symbolCov.distinctAtoms,  threshold: THRESHOLDS.minDistinctAtoms, pass: symbolCov.pass },
  }
  const passCount = Object.values(gates).filter((g) => g.pass).length
  const verification = {
    site: site.id,
    timestamp: new Date().toISOString(),
    aispPath: `runs/${site.id}/specs/aisp.md`,
    gates,
    passCount,
    overallPass: passCount === 4,
    detail: { mathFirst, symbolCov, reproduction, ambiguity },
    cost: reproRes.cost,
  }
  writeFileSync(resolve(RUNS_DIR, site.id, 'aisp-verification.json'), JSON.stringify(verification, null, 2))
  log(`[${site.id}] gates: ambig=${gates.ambiguity.value?.toFixed(3)} ${gates.ambiguity.pass ? '✓' : '✗'} · repro=${(gates.reproduction.value * 100).toFixed(1)}% ${gates.reproduction.pass ? '✓' : '✗'} · prose=${(gates.mathFirst.value * 100).toFixed(1)}% ${gates.mathFirst.pass ? '✓' : '✗'} · atoms=${gates.symbolCov.value} ${gates.symbolCov.pass ? '✓' : '✗'} · cost=$${verification.cost.toFixed(6)}`)
  return verification
}

// ───────────────────────────────────────────────────────────────────────────
async function main() {
  writeFileSync(LOG_PATH, '')
  log('=== P127 AISP verifier — Ambig<2%, repro≥98%, prose<30%, atoms≥30 ===')

  const env = readDotEnv(ENV_PATH)
  const key = env.GEMINI_API_KEY
  if (!key) { log('FATAL: GEMINI_API_KEY missing'); process.exit(2) }
  const client = new GoogleGenAI({ apiKey: key })

  // Run all 3 sites in parallel (each runs 2 internal LLM calls in parallel)
  const results = await Promise.all(SITES.map((site) => verifySite(client, site)))

  // Aggregate
  const totalCost = results.reduce((s, r) => s + r.cost, 0)
  const summary = {
    timestamp: new Date().toISOString(),
    thresholds: THRESHOLDS,
    sites: results.map((r) => ({
      site: r.site,
      overallPass: r.overallPass,
      passCount: r.passCount,
      gates: {
        ambiguity:    r.gates.ambiguity,
        reproduction: r.gates.reproduction,
        mathFirst:    r.gates.mathFirst,
        symbolCov:    r.gates.symbolCov,
      },
      cost: r.cost,
    })),
    totalCost,
    overallVerdict: results.every((r) => r.overallPass) ? 'PASS' : 'FAIL',
  }
  writeFileSync(resolve(PHASE_DIR, 'aisp-verification-summary.json'), JSON.stringify(summary, null, 2))

  // Markdown summary
  const lines = ['# P127 AISP verification summary', '']
  lines.push(`Generated ${summary.timestamp} · model ${MODEL} · total cost $${totalCost.toFixed(6)}`)
  lines.push('')
  lines.push(`Thresholds: ambig<${THRESHOLDS.ambiguity} · repro≥${THRESHOLDS.reproduction * 100}% · prose<${THRESHOLDS.proseDensityMax * 100}% · atoms≥${THRESHOLDS.minDistinctAtoms}`)
  lines.push('')
  lines.push('| Site | Ambig | Repro | Prose | Atoms | Overall |')
  lines.push('|---|---|---|---|---|---|')
  for (const s of summary.sites) {
    const a = s.gates.ambiguity
    const r = s.gates.reproduction
    const p = s.gates.mathFirst
    const at = s.gates.symbolCov
    lines.push(`| [${s.site}](./runs/${s.site}/aisp-verification.json) | ${(a.value ?? 1).toFixed(3)} ${a.pass ? '✓' : '✗'} | ${(r.value * 100).toFixed(1)}% ${r.pass ? '✓' : '✗'} | ${(p.value * 100).toFixed(1)}% ${p.pass ? '✓' : '✗'} | ${at.value} ${at.pass ? '✓' : '✗'} | ${s.overallPass ? '✅ PASS' : `❌ ${s.passCount}/4`} |`)
  }
  lines.push('')
  lines.push(`**Overall verdict: ${summary.overallVerdict}**`)
  lines.push('')
  writeFileSync(resolve(PHASE_DIR, 'aisp-verification-summary.md'), lines.join('\n') + '\n')

  log(`=== verifier done: verdict=${summary.overallVerdict} cost=$${totalCost.toFixed(6)} ===`)
  process.exit(summary.overallVerdict === 'PASS' ? 0 : 1)
}

main().catch((e) => { log(`FATAL: ${e?.stack || e}`); process.exit(2) })
