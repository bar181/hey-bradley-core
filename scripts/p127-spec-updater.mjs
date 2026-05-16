#!/usr/bin/env node
// P127 spec-update pipeline — direct Gemini, template-driven, validation-gated.
// Per ADR-156: 7 specs in priority order, AISP first + 2-step, CSS separate
// from content, deterministic preprocessing, per-spec validation.
//
// Usage:
//   node scripts/p127-spec-updater.mjs
//     ↑ runs against all 3 P126 example configs (blog / portfolio / marketing).
//
// Inputs:  plans/hitl/phase-126-go-live/multi-site-eval/iter-history/
//          iter-3-verified/<site>/final-config.json
// Outputs: plans/hitl/phase-127-spec-update/runs/<site>/...

import { GoogleGenAI } from '@google/genai'
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const PHASE_DIR = resolve(REPO_ROOT, 'plans/hitl/phase-127-spec-update')
const TEMPLATE_DIR = resolve(PHASE_DIR, 'templates')
const RUNS_DIR = resolve(PHASE_DIR, 'runs')
const LOG_PATH = resolve(PHASE_DIR, 'pipeline-run.log')
const ENV_PATH = resolve(REPO_ROOT, '.env')

const MODEL = 'gemini-2.5-flash'
const COST_PER_M = { in: 0.30, out: 2.50 }
const PHASE_BUDGET_USD = 10.0
const STRUCT_SUMMARY_CAP_BYTES = 4096
const MAX_RETRIES_PER_SPEC = 1

const SITES = [
  { id: 'blog',      configPath: 'plans/hitl/phase-126-go-live/multi-site-eval/iter-history/iter-3-verified/blog/final-config.json' },
  { id: 'portfolio', configPath: 'plans/hitl/phase-126-go-live/multi-site-eval/iter-history/iter-3-verified/portfolio/final-config.json' },
  { id: 'marketing', configPath: 'plans/hitl/phase-126-go-live/multi-site-eval/iter-history/iter-3-verified/marketing/final-config.json' },
]

const PIPELINE = [
  { id: 'aisp',         file: 'aisp.json' },         // step 1 (will run step 2 inline after)
  { id: 'north-star',   file: 'north-star.json' },
  { id: 'features',     file: 'features.json' },
  { id: 'architecture', file: 'architecture.json' },
  { id: 'css',          file: 'css.json' },
  { id: 'build-plan',   file: 'build-plan.json' },
  { id: 'human-spec',   file: 'human-spec.json' },
]

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

function loadTemplate(file) {
  const raw = readFileSync(resolve(TEMPLATE_DIR, file), 'utf8')
  const parsed = JSON.parse(raw)
  parsed._templateHash = createHash('sha1').update(raw).digest('hex').slice(0, 12)
  parsed._templateFile = file
  return parsed
}

const GIT_SHA = (() => {
  try { return execSync('git rev-parse HEAD', { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().slice(0, 12) }
  catch { return 'unknown' }
})()

// ───────────────────────────────────────────────────────────────────────────
// Deterministic preprocessor — extracts structural summary, no LLM
// ───────────────────────────────────────────────────────────────────────────
function buildStructuralSummary(cfg) {
  const site = cfg.site || {}
  const theme = cfg.theme || {}
  const palette = theme.palette || {}
  const typography = theme.typography || {}
  const sections = Array.isArray(cfg.sections) ? cfg.sections : []
  const sectionSummary = sections.map((s, idx) => {
    const comps = Array.isArray(s.components) ? s.components : []
    return {
      idx,
      type: s.type,
      id: s.id,
      order: s.order,
      variant: s.variant,
      componentTypes: comps.map((c) => c.type),
      componentCount: comps.length,
      headings: comps
        .filter((c) => /heading|text|badge|button/.test(c.type || ''))
        .slice(0, 3)
        .map((c) => String(c.props?.text || '').slice(0, 80))
        .filter(Boolean),
    }
  })
  const summary = {
    site: {
      title: site.title || '',
      tagline: site.tagline || site.description || '',
      brandName: site.brandName || '',
      author: site.author || '',
      voiceAttributes: site.voiceAttributes || [],
      tone: site.tone || '',
      audience: site.audience || '',
      purpose: site.purpose || '',
    },
    theme: {
      mode: theme.mode || '',
      palette: {
        bgPrimary: palette.bgPrimary || '',
        bgSecondary: palette.bgSecondary || '',
        textPrimary: palette.textPrimary || '',
        textSecondary: palette.textSecondary || '',
        accentPrimary: palette.accentPrimary || '',
        accentSecondary: palette.accentSecondary || '',
      },
      typography: {
        fontFamily: typography.fontFamily || '',
        headingFamily: typography.headingFamily || '',
        baseSize: typography.baseSize || '',
        lineHeight: typography.lineHeight || '',
      },
      spacing: theme.spacing || {},
    },
    sections: sectionSummary,
    sectionCount: sections.length,
  }
  // Cap at ~4KB by progressively dropping detail
  let json = JSON.stringify(summary, null, 2)
  if (json.length > STRUCT_SUMMARY_CAP_BYTES) {
    summary.sections = summary.sections.map((s) => ({ idx: s.idx, type: s.type, id: s.id, componentCount: s.componentCount, headings: s.headings.slice(0, 1) }))
    json = JSON.stringify(summary, null, 2)
  }
  if (json.length > STRUCT_SUMMARY_CAP_BYTES) {
    summary.sections = summary.sections.map((s) => ({ idx: s.idx, type: s.type, componentCount: s.componentCount }))
    json = JSON.stringify(summary, null, 2)
  }
  return { json, obj: summary }
}

function extractAispBlock(aispMd, blockHeader) {
  // Pull a single ⟦X:...⟧{ ... } block out of the AISP doc
  const open = aispMd.indexOf(blockHeader)
  if (open < 0) return ''
  // Find the matching closing brace by counting depth
  const braceStart = aispMd.indexOf('{', open)
  if (braceStart < 0) return aispMd.slice(open, Math.min(open + 400, aispMd.length))
  let depth = 0, i = braceStart
  for (; i < aispMd.length; i++) {
    const c = aispMd[i]
    if (c === '{') depth++
    else if (c === '}') { depth--; if (depth === 0) { i++; break } }
  }
  return aispMd.slice(open, i)
}

// ───────────────────────────────────────────────────────────────────────────
// Template substitution + LLM call
// ───────────────────────────────────────────────────────────────────────────
function substitute(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] != null ? String(vars[key]) : ''))
}

async function callLlm(client, systemPrompt, userPrompt) {
  const t0 = Date.now()
  let response = '', inTok = 0, outTok = 0, errKind = null
  try {
    const r = await client.models.generateContent({
      model: MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 0 },
      },
    })
    response = r.text ?? ''
    inTok = r.usageMetadata?.promptTokenCount ?? 0
    outTok = r.usageMetadata?.candidatesTokenCount ?? 0
  } catch (e) {
    errKind = e?.message || String(e)
  }
  return {
    wallClockMs: Date.now() - t0,
    response, inTok, outTok,
    cost: (inTok * COST_PER_M.in + outTok * COST_PER_M.out) / 1_000_000,
    errKind,
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Validation per spec
// ───────────────────────────────────────────────────────────────────────────
function validateSpec(specId, output, validation) {
  const v = validation || {}
  const failures = []
  for (const m of v.mustContain || []) if (!output.includes(m)) failures.push(`missing "${m}"`)
  for (const m of v.mustNotContain || []) if (output.includes(m)) failures.push(`forbidden token present "${m}"`)
  const lines = output.split('\n')
  if (v.maxLines && lines.length > v.maxLines) failures.push(`>${v.maxLines} lines (got ${lines.length})`)
  if (v.minLines && lines.length < v.minLines) failures.push(`<${v.minLines} lines (got ${lines.length})`)
  const words = output.split(/\s+/).filter(Boolean).length
  if (v.maxWords && words > v.maxWords) failures.push(`>${v.maxWords} words (got ${words})`)
  if (v.minListItems) {
    const items = (output.match(/^\s*\d+\.\s/gm) || []).length
    if (items < v.minListItems) failures.push(`<${v.minListItems} list items (got ${items})`)
  }
  if (v.maxListItems) {
    const items = (output.match(/^\s*\d+\.\s/gm) || []).length
    if (items > v.maxListItems) failures.push(`>${v.maxListItems} list items (got ${items})`)
  }
  if (v.minTableRows) {
    // Count data rows in any markdown table (exclude header/separator)
    const rows = output.split('\n').filter((l) => /^\|.*\|.*\|/.test(l)).length - 2
    if (rows < v.minTableRows) failures.push(`<${v.minTableRows} table rows (got ${Math.max(0, rows)})`)
  }
  if (v.minBoundedContexts) {
    const m = output.match(/##\s*Bounded contexts[\s\S]*?(?=^##|\Z)/m)
    if (m) {
      const bcItems = (m[0].match(/^\s*\d+\.\s+\*\*/gm) || []).length
      if (bcItems < v.minBoundedContexts) failures.push(`<${v.minBoundedContexts} bounded contexts (got ${bcItems})`)
    }
  }
  if (v.minParagraphs) {
    const paras = output.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    if (paras < v.minParagraphs) failures.push(`<${v.minParagraphs} paragraphs (got ${paras})`)
  }
  if (v.validateJsonBlock) {
    const m = output.match(/```json\s*([\s\S]*?)```/)
    if (!m) failures.push('no ```json fenced block')
    else {
      try { JSON.parse(m[1]) } catch (e) { failures.push(`JSON parse error: ${e.message}`) }
    }
  }
  return { pass: failures.length === 0, failures }
}

function strip(output, specType) {
  // Trim leading commentary and code-fence wrappers that the LLM sometimes adds
  let s = output
  if (specType !== 'css') {
    s = s.replace(/^```(?:markdown|md)?\s*/i, '').replace(/\s*```\s*$/i, '')
  }
  return s.trim()
}

// ───────────────────────────────────────────────────────────────────────────
// Per-site pipeline runner
// ───────────────────────────────────────────────────────────────────────────
async function runSite(client, site) {
  const cfg = JSON.parse(readFileSync(resolve(REPO_ROOT, site.configPath), 'utf8'))
  const struct = buildStructuralSummary(cfg)
  const siteDir = resolve(RUNS_DIR, site.id)
  const specsDir = resolve(siteDir, 'specs')
  mkdirSync(specsDir, { recursive: true })

  log(`──────── Site: ${site.id} ────────`)
  log(`Structural summary: ${struct.json.length} bytes, ${struct.obj.sectionCount} sections`)

  const chatHistory = []
  const timing = {}
  const cost = {}
  const validation = {}
  const outputs = {}
  let totalSiteCost = 0

  // For ⟦Δ:Content⟧ extraction, the AISP prompts receive the full config (capped)
  const fullConfigJson = JSON.stringify(cfg).slice(0, 14000)

  // ── AISP step 1 + step 2 ────────────────────────────────────────────────
  {
    const tpl1 = loadTemplate('aisp.json')
    const userPrompt1 = substitute(tpl1.userPromptTpl, { structuralSummary: struct.json, fullConfig: fullConfigJson, siteId: site.id, primaryIntent: struct.obj.site.purpose || 'inform', maxHeadline: 100, brandDensity: '◊+' })
    log(`[${site.id}] aisp step-1 ...`)
    const r1 = await callLlm(client, tpl1.systemPrompt, userPrompt1)
    totalSiteCost += r1.cost
    let out1 = strip(r1.response, 'aisp')
    chatHistory.push({ timestamp: new Date().toISOString(), specId: 'aisp', step: 1, model: MODEL, gitSha: GIT_SHA, templateFile: tpl1._templateFile, templateHash: tpl1._templateHash, wallClockMs: r1.wallClockMs, tokens: { in: r1.inTok, out: r1.outTok }, costUsd: r1.cost, errorKind: r1.errKind, userPromptHash: hash(userPrompt1), responsePreview: out1.slice(0, 400) })

    // Step 2 — quality recheck
    const tpl2 = loadTemplate('aisp-quality.json')
    const userPrompt2 = substitute(tpl2.userPromptTpl, { previousOutput: out1, structuralSummary: struct.json, fullConfig: fullConfigJson })
    log(`[${site.id}] aisp step-2 quality ...`)
    const r2 = await callLlm(client, tpl2.systemPrompt, userPrompt2)
    totalSiteCost += r2.cost
    let out2 = strip(r2.response, 'aisp')
    chatHistory.push({ timestamp: new Date().toISOString(), specId: 'aisp', step: 2, model: MODEL, gitSha: GIT_SHA, templateFile: tpl2._templateFile, templateHash: tpl2._templateHash, wallClockMs: r2.wallClockMs, tokens: { in: r2.inTok, out: r2.outTok }, costUsd: r2.cost, errorKind: r2.errKind, userPromptHash: hash(userPrompt2), responsePreview: out2.slice(0, 400) })

    // Validate the rewritten output (step 2)
    let v = validateSpec('aisp', out2, tpl2.validation)
    if (!v.pass) {
      // fallback: validate step 1 too; keep whichever passed
      const v1 = validateSpec('aisp', out1, tpl1.validation)
      if (v1.pass) { out2 = out1; v = v1; log(`[${site.id}] aisp: step-2 failed validation, keeping step-1`) }
    }
    validation.aisp = v
    timing.aisp = r1.wallClockMs + r2.wallClockMs
    cost.aisp = r1.cost + r2.cost
    outputs.aisp = out2
    writeFileSync(resolve(specsDir, 'aisp.md'), out2 + '\n')
    log(`[${site.id}] aisp: ${v.pass ? 'PASS' : 'FAIL — ' + v.failures.join(', ')}  ${timing.aisp}ms  $${cost.aisp.toFixed(6)}`)
  }

  const aispMd = outputs.aisp || ''
  const aispOmega = extractAispBlock(aispMd, '⟦Ω')
  const aispGamma = extractAispBlock(aispMd, '⟦Γ')

  // ── Remaining specs in priority order ───────────────────────────────────
  for (const spec of PIPELINE.slice(1)) {
    const tpl = loadTemplate(spec.file)
    let varsExtra = { structuralSummary: struct.json, aispOmega, aispGamma }
    if (spec.id === 'build-plan') varsExtra.featuresList = (outputs.features || '').slice(0, 1500)
    if (spec.id === 'human-spec') {
      varsExtra.northStar = (outputs['north-star'] || '').slice(0, 1500)
      varsExtra.featuresTop5 = ((outputs.features || '').split('\n').slice(0, 5).join('\n'))
    }
    const userPrompt = substitute(tpl.userPromptTpl, varsExtra)
    log(`[${site.id}] ${spec.id} ...`)
    let r = await callLlm(client, tpl.systemPrompt, userPrompt)
    totalSiteCost += r.cost
    let out = strip(r.response, spec.id)
    let v = validateSpec(spec.id, out, tpl.validation)
    chatHistory.push({ timestamp: new Date().toISOString(), specId: spec.id, step: 1, wallClockMs: r.wallClockMs, tokens: { in: r.inTok, out: r.outTok }, costUsd: r.cost, errorKind: r.errKind, userPromptHash: hash(userPrompt), responsePreview: out.slice(0, 400), validationFailures: v.failures })

    // One retry with corrective addendum
    if (!v.pass && r.errKind == null) {
      const correctivePrompt = `Your previous response failed validation: ${v.failures.join(', ')}. Re-emit the spec fixing those issues. Do not omit any required block / section / row.\n\n${userPrompt}`
      log(`[${site.id}] ${spec.id} retry ...`)
      r = await callLlm(client, tpl.systemPrompt, correctivePrompt)
      totalSiteCost += r.cost
      out = strip(r.response, spec.id)
      v = validateSpec(spec.id, out, tpl.validation)
      chatHistory.push({ timestamp: new Date().toISOString(), specId: spec.id, step: 'retry', wallClockMs: r.wallClockMs, tokens: { in: r.inTok, out: r.outTok }, costUsd: r.cost, errorKind: r.errKind, userPromptHash: hash(correctivePrompt), responsePreview: out.slice(0, 400), validationFailures: v.failures })
    }

    validation[spec.id] = v
    timing[spec.id] = (timing[spec.id] || 0) + r.wallClockMs
    cost[spec.id] = (cost[spec.id] || 0) + r.cost
    outputs[spec.id] = out
    writeFileSync(resolve(specsDir, `${spec.id}.md`), out + '\n')
    log(`[${site.id}] ${spec.id}: ${v.pass ? 'PASS' : 'FAIL — ' + v.failures.join(', ')}  ${timing[spec.id]}ms  $${cost[spec.id].toFixed(6)}`)
  }

  // ── Per-site artifacts ──────────────────────────────────────────────────
  writeFileSync(resolve(siteDir, 'chat-history.jsonl'), chatHistory.map((e) => JSON.stringify(e)).join('\n') + '\n')
  writeFileSync(resolve(siteDir, 'timing.json'), JSON.stringify(timing, null, 2))
  writeFileSync(resolve(siteDir, 'cost.json'), JSON.stringify({ total: totalSiteCost, perSpec: cost }, null, 2))
  writeFileSync(resolve(siteDir, 'validation.json'), JSON.stringify(validation, null, 2))

  // Per-site index.md
  const lines = []
  lines.push(`# ${site.id} — Spec Bundle`)
  lines.push('')
  lines.push(`Generated ${new Date().toISOString()} · model ${MODEL} · total cost $${totalSiteCost.toFixed(6)}`)
  lines.push('')
  lines.push('## Specs')
  lines.push('')
  lines.push('| # | Spec | Validation | Time | Cost |')
  lines.push('|---|---|---|---|---|')
  const order = ['aisp', 'north-star', 'features', 'architecture', 'css', 'build-plan', 'human-spec']
  order.forEach((id, i) => {
    const v = validation[id] || { pass: false, failures: ['not generated'] }
    const t = timing[id] || 0
    const c = cost[id] || 0
    lines.push(`| ${i + 1} | [${id}](./specs/${id}.md) | ${v.pass ? '✅ PASS' : '❌ ' + v.failures.join('; ')} | ${t} ms | $${c.toFixed(6)} |`)
  })
  lines.push('')
  lines.push(`Chat history: \`./chat-history.jsonl\`  ·  Timing: \`./timing.json\`  ·  Cost: \`./cost.json\`  ·  Validation: \`./validation.json\``)
  writeFileSync(resolve(siteDir, 'index.md'), lines.join('\n') + '\n')

  return { siteId: site.id, totalCost: totalSiteCost, validation, timing, cost }
}

function hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0 }
  return ('0000000' + (h >>> 0).toString(16)).slice(-8)
}

// ───────────────────────────────────────────────────────────────────────────
async function main() {
  mkdirSync(RUNS_DIR, { recursive: true })
  writeFileSync(LOG_PATH, '')
  log('=== P127 spec-update pipeline — direct Gemini, template-driven ===')

  const env = readDotEnv(ENV_PATH)
  const key = env.GEMINI_API_KEY
  if (!key) { log('FATAL: GEMINI_API_KEY missing'); process.exit(2) }
  const client = new GoogleGenAI({ apiKey: key })

  let cumulativeCost = 0
  const results = []
  for (const site of SITES) {
    if (cumulativeCost >= PHASE_BUDGET_USD) { log(`Budget cap hit; skipping ${site.id}`); continue }
    const r = await runSite(client, site)
    cumulativeCost += r.totalCost
    results.push(r)
  }

  // Top-level run summary
  const summaryLines = ['# P127 spec-update pipeline — run summary', '']
  summaryLines.push(`Generated ${new Date().toISOString()} · model ${MODEL} · total cost $${cumulativeCost.toFixed(6)} / $${PHASE_BUDGET_USD} cap`)
  summaryLines.push('')
  summaryLines.push('| Site | Specs PASS | Total time | Total cost |')
  summaryLines.push('|---|---|---|---|')
  for (const r of results) {
    const pass = Object.values(r.validation).filter((v) => v.pass).length
    const total = Object.keys(r.validation).length
    const totalMs = Object.values(r.timing).reduce((a, b) => a + b, 0)
    summaryLines.push(`| [${r.siteId}](./runs/${r.siteId}/index.md) | ${pass}/${total} | ${totalMs} ms | $${r.totalCost.toFixed(6)} |`)
  }
  summaryLines.push('')
  writeFileSync(resolve(PHASE_DIR, 'run-summary.md'), summaryLines.join('\n') + '\n')

  log(`=== DONE · cumulative cost $${cumulativeCost.toFixed(6)} ===`)
}

main().catch((e) => { log(`FATAL: ${e?.stack || e}`); process.exit(2) })
