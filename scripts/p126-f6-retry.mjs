#!/usr/bin/env node
// P126 / F6 retry — direct Gemini API call (no Playwright).
// Owner directive 2026-05-16: simplify F6 retry after Claude API 500;
// $10 Gemini phase budget; loop up to 5x until JSON output is optimal;
// brutal-honest verification of every iteration.
//
// Evidence layout:
//   plans/hitl/phase-126-go-live/e2e-evidence/
//     ├── iter-1..N/                      ← per-iteration sessions + verdict
//     ├── session-1.json, session-2.json, session-3.json  ← winning iteration
//     ├── retry-summary.json              ← overall verdict + costs
//     └── retry-run.log                   ← full transcript (every call)
//
// Scope: verify LLM round-trip end-to-end with the 3 owner-spec prompts.
// Does NOT exercise the browser/UI (BYOK panel, preview mutation, CostPill,
// chat-history tab). Those remain manual-owner-verification — documented as
// a carry-forward in the P126 retrospective.

import { GoogleGenAI } from '@google/genai'
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const EVIDENCE_DIR = resolve(REPO_ROOT, 'plans/hitl/phase-126-go-live/e2e-evidence')
const ENV_PATH = resolve(REPO_ROOT, '.env')
const LOG_PATH = resolve(EVIDENCE_DIR, 'retry-run.log')

const MODEL = 'gemini-2.5-flash'
const COST_PER_M = { in: 0.30, out: 2.50 }
const MAX_ITER = 5
const PHASE_BUDGET_USD = 10.0

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

// Real flagship schema fragment (P126 F1 default template).
// Path indices: /sections/0=navbar, /sections/1=hero, /sections/2=features-moat, ...
const SCHEMA_HINT = `Current site = Hey Bradley flagship (dark, crimson). MasterConfig shape:
{
  site: { title, description, tagline, ... },
  theme: { palette: { bgPrimary, accentPrimary, textPrimary, ... } },
  sections: [
    { type:"menu",    id:"navbar-01",      components:[ {id:"logo",props:{text}}, ... ] },
    { type:"hero",    id:"hero-01",        components:[
       {id:"eyebrow",     props:{text}},
       {id:"headline",    props:{text,level,size}},
       {id:"subtitle",    props:{text}},
       {id:"primaryCta",  props:{text,url}},
       {id:"secondaryCta",props:{text,url}}
    ]},
    { type:"columns", id:"features-moat", components:[ ... ] },
    ...
  ]
}
JSON-Patch paths must use array indices (/sections/1/components/1/props/text for hero headline).`

function buildSystemPrompt(refinement = '') {
  return `You are Bradley — a chat-driven website builder. Translate the user's edit request
into a strict JSON object describing a JSON-Patch (RFC 6902) update to the current MasterConfig.

${SCHEMA_HINT}

Respond with EXACTLY this JSON shape, no prose, no markdown fences:
{
  "templateId": "<short-kebab-id describing the edit category>",
  "confidence": <number in [0,1]>,
  "summary": "<one short sentence>",
  "patchOps": [ { "op": "replace"|"add"|"remove", "path": "/sections/<idx>/components/<idx>/props/<field>", "value": <any> } ],
  "lowConfidenceNote": "<casual note ONLY when confidence<0.7, else empty string>"
}

Rules:
- Use real flagship indices: hero is /sections/1, hero headline = /sections/1/components/1/props/text.
- "Hero section" edits should target the hero (sections/1), not generic /sections/0.
- "Headline" or "title" of the hero = /sections/1/components/1/props/text (component id "headline").
- If the prompt is vague (e.g. "make it pop"), set confidence<0.7, apply a small best-guess patch
  (e.g. boost accent color, increase headline size), and include a SHORT casual lowConfidenceNote
  like "I had to guess on that one — see Chat History for details."
- NEVER respond with prose, apologies, or refusal. Always emit valid JSON with at least one patchOp.
${refinement}`
}

const PROMPTS = [
  { n: 1, text: 'Update the hero section' },
  { n: 2, text: 'Change the hero headline to Ship faster' },
  { n: 3, text: 'Make it pop' },
]

function safeParseJson(s) {
  if (!s) return null
  const cleaned = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  try { return JSON.parse(cleaned) } catch { return null }
}

async function callOne(client, prompt, systemPrompt) {
  const t0 = Date.now()
  let response = '', inTok = 0, outTok = 0, errKind = null
  try {
    const r = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: 'application/json',
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

// Brutal-honest grading: returns 0..1 per session against the owner spec.
function gradeSession(n, prompt, parsed, raw) {
  if (!parsed) return { score: 0, reasons: ['JSON parse failed'] }
  const reasons = []
  let score = 0

  const hasShape = parsed.templateId && typeof parsed.confidence === 'number' && Array.isArray(parsed.patchOps)
  if (hasShape) score += 0.3
  else reasons.push('Missing required JSON shape fields')

  if (parsed.patchOps?.length > 0) score += 0.1
  else reasons.push('No patchOps emitted')

  const ops = parsed.patchOps || []
  const heroOp = ops.find((o) => /\/sections\/1(?:\/|$)/.test(o.path || ''))

  if (n === 1) {
    // "Update the hero section" — should target hero (sections/1)
    if (heroOp) score += 0.6
    else reasons.push(`Session 1 must target /sections/1 (hero); got ${ops.map((o) => o.path).join(', ')}`)
  } else if (n === 2) {
    // "Change the hero headline to Ship faster" — must set headline text = "Ship faster"
    const headlineOp = ops.find((o) =>
      /\/sections\/1\/components\/1\/props\/text$/.test(o.path || '') &&
      String(o.value || '').toLowerCase() === 'ship faster'
    )
    if (headlineOp) score += 0.6
    else {
      const partial = ops.find((o) => String(o.value || '').toLowerCase() === 'ship faster')
      if (partial) { score += 0.3; reasons.push(`Session 2 set "Ship faster" but at ${partial.path}, not /sections/1/components/1/props/text`) }
      else reasons.push(`Session 2 must set headline = "Ship faster"; got ops: ${JSON.stringify(ops.map((o) => ({ p: o.path, v: o.value })))}`)
    }
  } else if (n === 3) {
    // "Make it pop" — must be low-confidence (<0.7) with a casual note
    if (parsed.confidence < 0.7) score += 0.3
    else reasons.push(`Session 3 must be low-confidence (<0.7); got ${parsed.confidence}`)
    const note = String(parsed.lowConfidenceNote || '')
    if (note.length > 0 && note.length < 200) score += 0.3
    else reasons.push(`Session 3 must include a short casual lowConfidenceNote; got "${note}"`)
  }

  return { score: Math.min(1, score), reasons }
}

async function runIteration(client, iter, systemPrompt) {
  const iterDir = resolve(EVIDENCE_DIR, `iter-${iter}`)
  mkdirSync(iterDir, { recursive: true })
  writeFileSync(resolve(iterDir, 'system-prompt.txt'), systemPrompt)

  let iterCost = 0
  const sessions = []
  for (const p of PROMPTS) {
    log(`iter-${iter} session-${p.n} → "${p.text}"`)
    const r = await callOne(client, p.text, systemPrompt)
    iterCost += r.cost
    const parsed = safeParseJson(r.response)
    const grade = gradeSession(p.n, p.text, parsed, r.response)
    const sess = {
      iteration: iter,
      session: p.n,
      prompt: p.text,
      timestamp: new Date().toISOString(),
      model: MODEL,
      wallClockMs: r.wallClockMs,
      tokens: { in: r.inTok, out: r.outTok },
      estimatedCostUsd: r.cost,
      errorKind: r.errKind,
      rawResponse: r.response,
      parsed,
      grade,
    }
    writeFileSync(resolve(iterDir, `session-${p.n}.json`), JSON.stringify(sess, null, 2))
    log(`  ↳ ${r.wallClockMs}ms  $${r.cost.toFixed(6)}  grade=${grade.score.toFixed(2)}  ${grade.reasons.length ? '⚠ ' + grade.reasons.join(' | ') : 'OK'}`)
    sessions.push(sess)
  }
  const composite = sessions.reduce((s, x) => s + x.grade.score, 0) / sessions.length
  const verdict = {
    iteration: iter,
    compositeScore: composite,
    iterationCostUsd: iterCost,
    sessions: sessions.map((s) => ({ session: s.session, score: s.grade.score, reasons: s.grade.reasons })),
  }
  writeFileSync(resolve(iterDir, 'verdict.json'), JSON.stringify(verdict, null, 2))
  log(`iter-${iter} composite=${composite.toFixed(2)}  cost=$${iterCost.toFixed(6)}`)
  return { sessions, composite, iterCost }
}

function refineFromFailures(prevSessions) {
  const lines = []
  for (const s of prevSessions) {
    if (s.grade.score < 1 && s.grade.reasons.length) {
      lines.push(`- Session ${s.session} ("${s.prompt}") last attempt: ${s.grade.reasons.join('; ')}`)
    }
  }
  if (!lines.length) return ''
  return `\n\nCORRECTIONS FROM LAST ATTEMPT — fix these specific issues:\n${lines.join('\n')}`
}

async function main() {
  if (!existsSync(EVIDENCE_DIR)) mkdirSync(EVIDENCE_DIR, { recursive: true })
  writeFileSync(LOG_PATH, '') // reset log
  log(`=== P126 F6 retry — direct Gemini API, max ${MAX_ITER} iterations, $${PHASE_BUDGET_USD} budget ===`)

  const env = readDotEnv(ENV_PATH)
  const key = env.GEMINI_API_KEY
  if (!key || !/^AIza[0-9A-Za-z_-]{35}$/.test(key)) {
    log('FATAL: GEMINI_API_KEY missing or malformed in .env')
    process.exit(2)
  }
  const client = new GoogleGenAI({ apiKey: key })

  let totalCost = 0, best = null, bestSessions = null
  let refinement = ''
  for (let iter = 1; iter <= MAX_ITER; iter++) {
    if (totalCost >= PHASE_BUDGET_USD) {
      log(`Budget cap hit — stopping at iter-${iter - 1}`)
      break
    }
    const systemPrompt = buildSystemPrompt(refinement)
    const { sessions, composite, iterCost } = await runIteration(client, iter, systemPrompt)
    totalCost += iterCost
    if (!best || composite > best) {
      best = composite
      bestSessions = sessions
    }
    if (composite >= 0.95) {
      log(`Converged at iter-${iter} (composite=${composite.toFixed(2)})`)
      break
    }
    refinement = refineFromFailures(sessions)
    log(`refinement injected for next iter:\n${refinement}\n---`)
  }

  // Promote best iteration's sessions to top-level session-{1,2,3}.json
  for (const s of bestSessions) {
    writeFileSync(resolve(EVIDENCE_DIR, `session-${s.session}.json`), JSON.stringify(s, null, 2))
  }
  const summary = {
    timestamp: new Date().toISOString(),
    mode: 'direct-api',
    iterations: bestSessions[0].iteration,
    bestComposite: best,
    totalCostUsd: totalCost,
    sessions: bestSessions.map((s) => ({ session: s.session, score: s.grade.score, reasons: s.grade.reasons, confidence: s.parsed?.confidence ?? null })),
    verdict: best >= 0.9 ? 'PASS' : (best >= 0.7 ? 'PARTIAL' : 'FAIL'),
  }
  writeFileSync(resolve(EVIDENCE_DIR, 'retry-summary.json'), JSON.stringify(summary, null, 2))
  log(`=== overall best composite=${best.toFixed(2)} verdict=${summary.verdict} totalCost=$${totalCost.toFixed(6)} ===`)
  process.exit(summary.verdict === 'PASS' ? 0 : (summary.verdict === 'PARTIAL' ? 0 : 1))
}

main().catch((e) => { log(`FATAL: ${e?.stack || e}`); process.exit(2) })
