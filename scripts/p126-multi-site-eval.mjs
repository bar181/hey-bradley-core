#!/usr/bin/env node
// P126 multi-site eval — direct Gemini, no Playwright, no long-running agents.
// Builds 3 sites (blog / portfolio / marketing) via sequential <15-word chat
// prompts, applies emitted JSON-Patches against a baseline, grades each final
// config against a 20-30 item checklist, then runs a 5-reviewer brutal-honest
// pass in parallel. Generates click-to-preview HTML and a final report.
//
// Saves full chat history per scenario for owner review.
// If composite efficacy <70%, emits improvements.md with prompt examples.

import { GoogleGenAI } from '@google/genai'
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const ROOT = resolve(REPO_ROOT, 'plans/hitl/phase-126-go-live/multi-site-eval')
const OUT_DIR = resolve(ROOT, 'output')
const REV_DIR = resolve(ROOT, 'reviewers')
const LOG_PATH = resolve(ROOT, 'eval-run.log')
const ENV_PATH = resolve(REPO_ROOT, '.env')

const MODEL = 'gemini-2.5-flash'
const COST_PER_M = { in: 0.30, out: 2.50 }
const PHASE_BUDGET_USD = 10.0
const EFFICACY_GATE = 0.70 // <70% triggers improvements.md

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

// ---------------------------------------------------------------------------
// Minimal RFC-6902 JSON-Patch applier (port of src/contexts/intelligence/applyPatches.ts)
// ---------------------------------------------------------------------------
function applyPatch(root, op) {
  const segs = op.path.split('/').slice(1).map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'))
  if (!segs.length) throw new Error('empty path')
  let parent = root
  for (let i = 0; i < segs.length - 1; i++) {
    const s = segs[i]
    const isArr = Array.isArray(parent)
    if (isArr) {
      const idx = Number(s)
      if (!Number.isInteger(idx)) throw new Error(`bad array index '${s}'`)
      parent = parent[idx]
    } else if (parent && typeof parent === 'object') {
      if (!(s in parent)) {
        // auto-vivify intermediate objects to be lenient
        parent[s] = {}
      }
      parent = parent[s]
    } else {
      throw new Error(`cannot traverse '${s}' from non-object`)
    }
    if (parent === undefined || parent === null) throw new Error(`missing path '${op.path}'`)
  }
  const leaf = segs[segs.length - 1]
  const isArr = Array.isArray(parent)
  if (op.op === 'add') {
    if (isArr) {
      if (leaf === '-') { parent.push(op.value); return }
      const idx = Number(leaf)
      if (!Number.isInteger(idx) || idx < 0 || idx > parent.length) throw new Error(`bad index '${leaf}'`)
      parent.splice(idx, 0, op.value); return
    }
    parent[leaf] = op.value; return
  }
  if (op.op === 'replace') {
    if (isArr) {
      const idx = Number(leaf)
      if (!Number.isInteger(idx) || idx < 0 || idx >= parent.length) throw new Error(`bad index '${leaf}'`)
      parent[idx] = op.value; return
    }
    parent[leaf] = op.value; return
  }
  if (op.op === 'remove') {
    if (isArr) {
      const idx = Number(leaf)
      if (!Number.isInteger(idx)) throw new Error(`bad index '${leaf}'`)
      parent.splice(idx, 1); return
    }
    delete parent[leaf]; return
  }
  throw new Error(`unsupported op '${op.op}'`)
}

function applyPatchesSafe(root, ops) {
  const cloned = structuredClone(root)
  const failures = []
  ops.forEach((op, i) => {
    try { applyPatch(cloned, op) }
    catch (e) { failures.push({ i, op, error: e.message }) }
  })
  return { result: cloned, failures }
}

// ---------------------------------------------------------------------------
// Baseline MasterConfig
// ---------------------------------------------------------------------------
function baselineConfig() {
  return {
    site: { title: 'New Site', description: '' },
    theme: {
      mode: 'light',
      palette: { bgPrimary: '#ffffff', bgSecondary: '#f5f5f5', textPrimary: '#111', textSecondary: '#555', accentPrimary: '#3366ff', accentSecondary: '#999' },
      typography: { fontFamily: 'Inter', headingFamily: 'Inter', baseSize: '16px', lineHeight: 1.5 },
      spacing: { sectionPadding: '64px', containerMaxWidth: '1180px', componentGap: '24px' },
      borderRadius: '8px',
    },
    sections: [],
  }
}

// Helper templates — canonical section shapes the LLM can copy / adapt. Updating
// the existing config only; never replacing top-level arrays.
const HELPER_TEMPLATES = `HELPER TEMPLATES (copy-and-adapt; never invent ad-hoc shapes):

[hero]
{ "type":"hero", "id":"hero-01", "enabled":true, "order":0, "variant":"centered",
  "layout":{"display":"flex","direction":"column","align":"center","gap":"32px","padding":"128px 24px 96px","parallax":false},
  "style":{},
  "components":[
    {"id":"eyebrow","type":"badge","enabled":true,"order":0,"props":{"text":"<brief eyebrow>"}},
    {"id":"headline","type":"heading","enabled":true,"order":1,"props":{"text":"<headline>","level":1,"size":"96px","weight":300}},
    {"id":"subtitle","type":"text","enabled":true,"order":2,"props":{"text":"<one-line tagline>"}},
    {"id":"primaryCta","type":"button","enabled":true,"order":3,"props":{"text":"<cta>","url":"<url>","style":"filled","size":"lg"}}
  ],"content":{} }

[columns/article-grid — fill with REAL brief-appropriate copy, NOT placeholders]
{ "type":"columns", "id":"articles-01", "enabled":true, "order":2, "variant":"default",
  "layout":{"display":"grid","columns":3,"gap":"32px","padding":"96px 32px","maxWidth":"1180px"},
  "style":{},
  "components":[
    {"id":"article-1","type":"article-card","enabled":true,"order":0,"props":{
      "title":"<compelling, specific title — not 'Article 1'>",
      "image":"<descriptive url or empty string>",
      "alt":"<alt text>",
      "hook":"<1-sentence hook that makes you want to read>",
      "problem":"<the tension or challenge>",
      "resolution":"<the insight or outcome>",
      "tags":["<tag>","<tag>"]
    }}
  ],"content":{"heading":"<section heading>","subheading":"<short subhead>"} }

[pricing — exactly 3 tiers]
{ "type":"pricing", "id":"pricing-01", "enabled":true, "order":4, "variant":"3tier",
  "layout":{"display":"grid","columns":3,"gap":"24px","padding":"96px 24px"},
  "style":{},
  "components":[
    {"id":"tier-starter",   "type":"price-card","enabled":true,"order":0,"props":{"name":"Starter",   "price":"$X/mo","features":["<f1>","<f2>","<f3>"],"cta":"Start free"}},
    {"id":"tier-growth",    "type":"price-card","enabled":true,"order":1,"props":{"name":"Growth",    "price":"$Y/mo","features":["<f1>","<f2>","<f3>"],"cta":"Get Growth"}},
    {"id":"tier-enterprise","type":"price-card","enabled":true,"order":2,"props":{"name":"Enterprise","price":"Contact us","features":["<f1>","<f2>","<f3>"],"cta":"Talk to sales"}}
  ],"content":{} }

[testimonials — ≥3 with quote + author]
{ "type":"testimonials", "id":"testimonials-01", "enabled":true, "order":5, "variant":"grid",
  "layout":{"display":"grid","columns":3,"gap":"24px","padding":"96px 24px"},
  "style":{},
  "components":[
    {"id":"q1","type":"testimonial","enabled":true,"order":0,"props":{"quote":"<real-feel sentence>","author":"<Name>","role":"<Role at Company>"}},
    {"id":"q2","type":"testimonial","enabled":true,"order":1,"props":{"quote":"<real-feel sentence>","author":"<Name>","role":"<Role at Company>"}},
    {"id":"q3","type":"testimonial","enabled":true,"order":2,"props":{"quote":"<real-feel sentence>","author":"<Name>","role":"<Role at Company>"}}
  ],"content":{} }

[logos / social-proof bar]
{ "type":"logos", "id":"logos-01", "enabled":true, "order":3, "variant":"bar",
  "layout":{"display":"flex","gap":"32px","justify":"center","padding":"48px 24px"},
  "style":{},
  "components":[
    {"id":"logo-1","type":"logo","enabled":true,"order":0,"props":{"name":"<Company>","image":"<url>","alt":"<Company logo>"}}
  ],"content":{} }

[video reel]
{ "type":"video", "id":"video-01", "enabled":true, "order":1, "variant":"reel",
  "layout":{"display":"flex","align":"center","padding":"64px 24px"},
  "style":{},
  "components":[
    {"id":"reel","type":"video-embed","enabled":true,"order":0,"props":{"url":"<video url>","poster":"<poster url>","autoplay":false,"loop":true,"alt":"<short description>"}}
  ],"content":{"heading":"<section heading>"} }

[project card — for portfolios — REAL effects schema]
{"id":"project-N","type":"project-card","enabled":true,"order":N,"props":{
  "title":"<project name>","image":"<thumb url>","alt":"<alt>","tags":["<t1>","<t2>","<t3>"],
  "effects":["hover-zoom","scroll-reveal"],
  "url":"<case-study url>"}}

[contact]
{ "type":"contact", "id":"contact-01", "enabled":true, "order":99, "variant":"simple",
  "layout":{"display":"flex","direction":"column","gap":"16px","padding":"64px 24px"},
  "style":{},
  "components":[
    {"id":"email","type":"link","enabled":true,"order":0,"props":{"text":"<email>","url":"mailto:<email>"}},
    {"id":"twitter","type":"link","enabled":true,"order":1,"props":{"text":"@<handle>","url":"https://x.com/<handle>"}}
  ],"content":{"heading":"Get in touch"} }

[newsletter signup]
{ "type":"newsletter", "id":"newsletter-01", "enabled":true, "order":98, "variant":"inline",
  "layout":{"display":"flex","gap":"12px","padding":"64px 24px"},
  "style":{},
  "components":[
    {"id":"email-input","type":"input","enabled":true,"order":0,"props":{"placeholder":"your@email.com","name":"email"}},
    {"id":"submit","type":"button","enabled":true,"order":1,"props":{"text":"Subscribe","style":"filled"}}
  ],"content":{"heading":"Subscribe"} }

[menu / navbar]
{ "type":"menu", "id":"navbar-01", "enabled":true, "order":-1, "variant":"simple",
  "layout":{"display":"flex","gap":"28px","padding":"20px 32px"},
  "style":{},
  "components":[
    {"id":"logo","type":"text","enabled":true,"order":0,"props":{"text":"<brand>"}},
    {"id":"nav-1","type":"link","enabled":true,"order":1,"props":{"text":"<label>","url":"<url>"}}
  ],"content":{} }`

const SYSTEM_PROMPT_TPL = (currentConfigJson, brief) => `You are Bradley — a chat-driven website builder. Your job is to UPDATE the current MasterConfig below to match the user's request. NEVER recreate the config from scratch — only emit incremental RFC-6902 JSON-Patch ops against the existing tree.

PROJECT BRIEF (overarching context — keep every patch consistent with this):
${brief}

CURRENT CONFIG:
${currentConfigJson}

${HELPER_TEMPLATES}

DECOMPOSITION RULE (think first, then emit):
Before emitting ops, internally decompose the user's <15-word prompt into 1-5 sub-steps.
Surface those sub-steps in the "decomposition" array of your response so the chat history
is auditable. Then translate each sub-step into the minimum number of patchOps.

EXAMPLE — "Add three article cards origin product and capstone":
  decomposition: [
    "1. Append one columns/article-grid section at /sections/-",
    "2. Inside it, include three article-card components (origin, product, capstone)",
    "3. Each card gets a hook + problem + resolution sentence in storytelling style"
  ]
  → ONE patchOp: { "op":"add", "path":"/sections/-", "value":{...full section with 3 article cards filled in...} }

DEFAULTS (auto-include when missing — user expects these by default):
- Every site needs a navbar. If /sections has no menu/navbar yet AND this is the first 1-2 prompts (CURRENT CONFIG has 0 or 1 sections), proactively add one at /sections/0 using the [menu/navbar] template — pull brand text from site.title.
- Every hero needs a primary CTA button. If you're adding or updating a hero and there's no button component, include one. Pick a sensible CTA based on the brief (e.g. "Get in touch", "View projects", "Book a call").
- These defaults are non-negotiable: ship them in the same response, no need for the user to ask.

HARD CONSTRAINTS:
1. NEVER replace top-level. Forbidden ops:
     {"op":"replace","path":"/sections", ...}      (do NOT replace the whole sections array)
     {"op":"replace","path":"/theme",    ...}      (do NOT replace the whole theme)
     {"op":"replace","path":"/site",     ...}      (do NOT replace the whole site object)
   Always patch fields (e.g. /theme/palette/accentPrimary) or append to arrays (/sections/-).
2. NEVER use placeholder copy. No "Article 1", "Latest Articles", "Description here",
   "New Hero Title", "Lorem ipsum". Write production-grade text consistent with the brief.
3. Match the brief's tone explicitly. If the brief mentions "Don Miller storytelling",
   article copy MUST be hook/problem/resolution structured. If brief mentions "parallax",
   set layout.parallax:true on the relevant section. If brief mentions "hover zoom",
   set props.effects:["hover-zoom"] on the image components.
4. Re-use existing IDs when modifying existing sections; only generate new IDs when
   appending genuinely new sections/components.

OUTPUT SHAPE — return EXACTLY this JSON, no prose, no markdown fences:
{
  "decomposition": ["<sub-step 1>", "<sub-step 2>", ...],
  "templateId": "<short-kebab-id describing the change>",
  "confidence": <number in [0,1]>,
  "patchOps": [ { "op":"add"|"replace"|"remove", "path":"/...", "value":<any> } ],
  "personaMessage": "<short chat reply to the user in Bradley's voice, ≤120 chars; if confidence<0.7 include a casual caveat like 'best guess — see Chat History'>"
}

PERSONA VOICE (for personaMessage):
- Confident, brief, no fluff. Examples:
    "Hero's up — give it a look."
    "Pricing locked in. Three tiers, clean spacing."
    "Best guess on that one — tightened the accent. See Chat History."
- Never say "I don't understand" or "I can't do that". Always ship something.`

// ---------------------------------------------------------------------------
// Deterministic checklist graders (per scenario id)
// ---------------------------------------------------------------------------
const GRADERS = {
  blog: (cfg) => {
    const results = {}
    const titleStr = String(cfg.site?.title || '').toLowerCase()
    const authorStr = String(cfg.site?.author || cfg.site?.brandName || '').toLowerCase()
    const bg = String(cfg.theme?.palette?.bgPrimary || '').toLowerCase()
    const accent = String(cfg.theme?.palette?.accentPrimary || '').toLowerCase()
    const heading = String(cfg.theme?.typography?.headingFamily || '').toLowerCase()
    const sections = Array.isArray(cfg.sections) ? cfg.sections : []
    const allText = JSON.stringify(cfg).toLowerCase()
    const hero = sections.find((s) => s?.type === 'hero')
    const heroText = JSON.stringify(hero || {}).toLowerCase()
    const articleSec = sections.find((s) => /column|grid|article|list|cards/.test(s?.type || '') || /article|blog|post/.test(s?.id || ''))
    const articleComps = articleSec?.components || []
    const isCrimson = /^#([a-c]\w|[de][0-3])\w{2,4}$/i.test(accent) || /crimson|burgundy|red/.test(accent)
    const isDarkBg = /^#0/.test(bg) || /^#1/.test(bg) || /black/.test(bg)

    results['blog-01'] = /bradley|hey bradley|blog/.test(titleStr)
    results['blog-02'] = /bradley ross/.test(authorStr) || /bradley ross/.test(allText)
    results['blog-03'] = cfg.theme?.mode === 'dark'
    results['blog-04'] = isDarkBg
    results['blog-05'] = isCrimson
    results['blog-06'] = /cormorant|garamond/.test(heading)
    results['blog-07'] = !!hero
    results['blog-08'] = /whiteboard|listens/.test(heroText)
    results['blog-09'] = !!articleSec
    results['blog-10'] = articleComps.length >= 3
    const a1 = JSON.stringify(articleComps[0] || {}).toLowerCase()
    const a2 = JSON.stringify(articleComps[1] || {}).toLowerCase()
    const a3 = JSON.stringify(articleComps[2] || {}).toLowerCase()
    results['blog-11'] = /origin|beginning|start|first/.test(a1) || /origin/.test(allText)
    results['blog-12'] = /product|builder|platform|whiteboard|tool/.test(a2) || /product/.test(allText)
    results['blog-13'] = /capstone|harvard|alm/.test(a3) || /capstone/.test(allText)
    results['blog-14'] = /hook/.test(allText)
    results['blog-15'] = /problem/.test(allText)
    results['blog-16'] = /resolution/.test(allText)
    results['blog-17'] = sections.some((s) => /author|bio|about/.test(s?.id || s?.type || '')) || /author bio|bradley ross/.test(allText)
    results['blog-18'] = /harvard|alm/.test(allText)
    results['blog-19'] = sections.some((s) => /newsletter|signup|subscribe/.test(s?.id || s?.type || '')) || /newsletter/.test(allText)
    results['blog-20'] = /email|input|form/.test(allText) && /newsletter|signup|subscribe/.test(allText)
    results['blog-21'] = sections.length >= 4
    results['blog-22'] = isCrimson
    const serifs = /(cormorant|garamond|playfair|instrument serif|merriweather|lora|crimson|baskerville)/
    results['blog-23'] = serifs.test(heading)
    results['blog-24'] = /button|cta|signup|subscribe|read more/.test(allText)
    results['blog-25'] = sections.every((s) => s?.type && s?.id && Array.isArray(s?.components))
    return results
  },
  portfolio: (cfg) => {
    const results = {}
    const titleStr = String(cfg.site?.title || '').toLowerCase()
    const brandStr = String(cfg.site?.brandName || '').toLowerCase()
    const bg = String(cfg.theme?.palette?.bgPrimary || '').toLowerCase()
    const accent = String(cfg.theme?.palette?.accentPrimary || '').toLowerCase()
    const accent2 = String(cfg.theme?.palette?.accentSecondary || '').toLowerCase()
    const sections = Array.isArray(cfg.sections) ? cfg.sections : []
    const allText = JSON.stringify(cfg).toLowerCase()
    const hero = sections.find((s) => s?.type === 'hero')
    const heroText = JSON.stringify(hero || {}).toLowerCase()
    const videoSec = sections.find((s) => /video|reel/.test(s?.type || '') || /video|reel/.test(s?.id || ''))
    const projectsSec = sections.find((s) => /project|work|gallery|grid|columns/.test(s?.type || '') || /project|work/.test(s?.id || ''))
    const projComps = projectsSec?.components || []
    const hexToRgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return null; const n = parseInt(m[1], 16); return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff } }
    const bgRgb = hexToRgb(bg)
    const accentRgbs = [hexToRgb(accent), hexToRgb(accent2)].filter(Boolean)
    const isBeigeBg = bgRgb ? (bgRgb.r > 220 && bgRgb.g > 220 && bgRgb.b > 200 && bgRgb.r + bgRgb.g > bgRgb.b + 60) : false
    const isSageAccent = accentRgbs.some((rgb) => rgb.g > rgb.r && rgb.g > rgb.b && rgb.g > 100)

    results['port-01'] = /bradley|portfolio/.test(titleStr) || /bradley|portfolio/.test(brandStr)
    results['port-02'] = cfg.theme?.mode === 'light'
    results['port-03'] = isBeigeBg
    results['port-04'] = isSageAccent || /sage/.test(allText)
    results['port-05'] = !!hero
    results['port-06'] = !!hero?.components?.some((c) => /name|title|heading/.test(c?.id || '') || /heading|text/.test(c?.type || ''))
    results['port-07'] = !!hero?.components?.some((c) => /tagline|subtitle|sub/.test(c?.id || ''))
    results['port-08'] = /parallax/.test(heroText)
    results['port-09'] = !!videoSec
    const navOffset = sections.findIndex((s) => s?.type === 'menu' || s?.type === 'navbar') === 0 ? 1 : 0
    const videoIdx = videoSec ? sections.indexOf(videoSec) - navOffset : -1
    results['port-10'] = videoIdx >= 0 && videoIdx <= 2
    results['port-11'] = !!projectsSec
    results['port-12'] = projComps.length >= 6
    results['port-13'] = projComps.length > 0 && projComps.every((p) => /image|thumbnail|src/.test(JSON.stringify(p?.props || {}).toLowerCase()))
    results['port-14'] = projComps.length > 0 && projComps.every((p) => Array.isArray(p?.props?.tags) && p.props.tags.length >= 1)
    results['port-15'] = projComps.reduce((s, p) => s + (Array.isArray(p?.props?.tags) ? p.props.tags.length : 0), 0) >= 18
    results['port-16'] = /hover|zoom|hoverzoom/.test(JSON.stringify(projectsSec || {}).toLowerCase())
    results['port-17'] = sections.some((s) => /contact/.test(s?.id || s?.type || '')) || /contact/.test(allText)
    results['port-18'] = /email|mailto/.test(allText)
    results['port-19'] = /twitter|@\w+|x\.com/.test(allText)
    results['port-20'] = /scroll|reveal|animation|animate/.test(JSON.stringify(projectsSec || {}).toLowerCase())
    results['port-21'] = sections.length >= 5
    results['port-22'] = isBeigeBg && bg !== '#ffffff' && bg !== '#fff'
    results['port-23'] = isSageAccent
    results['port-24'] = !!hero?.components?.some((c) => /button|cta/.test(c?.type || c?.id || ''))
    results['port-25'] = sections.every((s) => s?.type && s?.id && Array.isArray(s?.components))
    results['port-26'] = projComps.length > 0 && projComps.every((p) => /alt|label/.test(JSON.stringify(p?.props || {}).toLowerCase()))
    results['port-27'] = sections.some((s) => /menu|navbar|nav/.test(s?.type || s?.id || ''))
    return results
  },
  marketing: (cfg) => {
    const results = {}
    const titleStr = String(cfg.site?.title || '').toLowerCase()
    const brandStr = String(cfg.site?.brandName || '').toLowerCase()
    const bg = String(cfg.theme?.palette?.bgPrimary || '').toLowerCase()
    const accent = String(cfg.theme?.palette?.accentPrimary || '').toLowerCase()
    const accent2 = String(cfg.theme?.palette?.accentSecondary || '').toLowerCase()
    const sections = Array.isArray(cfg.sections) ? cfg.sections : []
    const allText = JSON.stringify(cfg).toLowerCase()
    const hero = sections.find((s) => s?.type === 'hero')
    const heroText = JSON.stringify(hero || {}).toLowerCase()
    const features = sections.find((s) => /feature|columns|grid/.test(s?.type || '') || /feature/.test(s?.id || ''))
    const featureComps = features?.components || []
    const pricing = sections.find((s) => /pric/.test(s?.type || s?.id || ''))
    const pricingComps = pricing?.components || []
    const logos = sections.find((s) => /logo|client|customer|brand|social.proof/.test(s?.id || s?.type || ''))
    const logoComps = logos?.components || []
    const testi = sections.find((s) => /testimon|quote/.test(s?.id || s?.type || ''))
    const testiComps = testi?.components || []
    // Closing CTA: a tail section (not hero) that either has CTA-flavored id/type OR
    // includes a CTA-flavored heading/button text. The LLM often repurposes a contact
    // section as the closing CTA — that's valid if the content is CTA-y.
    const lastFew = sections.slice(-3).filter((s) => s !== hero)
    const closingCTA = lastFew.reverse().find((s) => {
      const meta = String(s?.id || '') + ' ' + String(s?.type || '')
      if (/cta|callout|book/.test(meta.toLowerCase())) return true
      const txt = JSON.stringify(s).toLowerCase()
      return /\b(discovery call|book a (discovery|call|consultation)|schedule a call|get started)\b/.test(txt) &&
             /(button|cta)/.test(txt)
    })
    const hexToRgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return null; const n = parseInt(m[1], 16); return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff } }
    const bgRgb = hexToRgb(bg)
    const accentRgb = hexToRgb(accent) || hexToRgb(accent2)
    const isNavyBg = bgRgb ? (bgRgb.r < 60 && bgRgb.g < 80 && bgRgb.b >= 40 && bgRgb.b > bgRgb.r) : false
    const isElectricBlue = accentRgb ? (accentRgb.b > 200 && accentRgb.b > accentRgb.r) : false

    results['mkt-01'] = /atlas/.test(titleStr) && /ai|consult/.test(titleStr + ' ' + brandStr + ' ' + allText)
    results['mkt-02'] = isNavyBg
    results['mkt-03'] = isElectricBlue
    results['mkt-04'] = !!hero
    results['mkt-05'] = /ai features/.test(heroText) || (/ship/.test(heroText) && /ai/.test(heroText))
    results['mkt-06'] = !!hero?.components?.some((c) => /button|cta/.test(c?.type || c?.id || ''))
    results['mkt-07'] = /discovery|book/.test(heroText)
    results['mkt-08'] = !!features
    results['mkt-09'] = featureComps.length >= 3
    results['mkt-10'] = /strategy/.test(JSON.stringify(featureComps[0] || {}).toLowerCase()) || featureComps.some((c) => /strategy/.test(JSON.stringify(c).toLowerCase()))
    results['mkt-11'] = featureComps.some((c) => /implementation/.test(JSON.stringify(c).toLowerCase()))
    results['mkt-12'] = featureComps.some((c) => /training/.test(JSON.stringify(c).toLowerCase()))
    results['mkt-13'] = !!pricing
    results['mkt-14'] = pricingComps.length >= 3
    results['mkt-15'] = pricingComps.some((c) => /starter/.test(JSON.stringify(c).toLowerCase()))
    results['mkt-16'] = pricingComps.some((c) => /growth/.test(JSON.stringify(c).toLowerCase()))
    results['mkt-17'] = pricingComps.some((c) => /enterprise/.test(JSON.stringify(c).toLowerCase()))
    results['mkt-18'] = !!logos
    results['mkt-19'] = logoComps.length >= 5
    results['mkt-20'] = !!testi
    results['mkt-21'] = testiComps.length >= 3
    results['mkt-22'] = testiComps.every((t) => /quote|text|content/.test(JSON.stringify(t?.props || {}).toLowerCase()))
    results['mkt-23'] = testiComps.every((t) => /author|name|by/.test(JSON.stringify(t?.props || {}).toLowerCase()))
    results['mkt-24'] = !!closingCTA && closingCTA !== hero
    results['mkt-25'] = closingCTA ? /discovery|book/.test(JSON.stringify(closingCTA).toLowerCase()) : false
    results['mkt-26'] = sections.some((s) => /menu|navbar|nav/.test(s?.type || s?.id || ''))
    results['mkt-27'] = sections.length >= 6
    results['mkt-28'] = sections.every((s) => s?.type && s?.id && Array.isArray(s?.components))
    return results
  },
}

function gradeAgainstChecklist(scenarioId, finalConfig, checklist) {
  const grader = GRADERS[scenarioId]
  if (!grader) throw new Error(`No grader for scenario ${scenarioId}`)
  const results = grader(finalConfig)
  let passed = 0, failed = 0
  const items = checklist.map((c) => {
    const ok = !!results[c.id]
    if (ok) passed++; else failed++
    return { id: c.id, desc: c.desc, pass: ok }
  })
  return { items, passed, failed, score: passed / checklist.length }
}

// ---------------------------------------------------------------------------
// LLM call
// ---------------------------------------------------------------------------
function safeParseJson(s) {
  if (!s) return null
  const cleaned = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  try { return JSON.parse(cleaned) } catch { return null }
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
        responseMimeType: 'application/json',
      },
    })
    response = r.text ?? ''
    inTok = r.usageMetadata?.promptTokenCount ?? 0
    outTok = r.usageMetadata?.candidatesTokenCount ?? 0
  } catch (e) { errKind = e?.message || String(e) }
  return {
    wallClockMs: Date.now() - t0, response, inTok, outTok,
    cost: (inTok * COST_PER_M.in + outTok * COST_PER_M.out) / 1_000_000,
    errKind,
  }
}

async function runScenario(client, scenario, scenarioDir) {
  mkdirSync(scenarioDir, { recursive: true })
  let config = baselineConfig()
  const chatHistory = []
  const transcript = []
  let totalCost = 0

  for (let i = 0; i < scenario.prompts.length; i++) {
    const prompt = scenario.prompts[i]
    log(`  [${scenario.id}] prompt ${i + 1}/${scenario.prompts.length}: "${prompt}"`)
    const sys = SYSTEM_PROMPT_TPL(JSON.stringify(config), scenario.brief)
    const r = await callLlm(client, sys, prompt)
    totalCost += r.cost
    const parsed = safeParseJson(r.response)
    const rawOps = parsed?.patchOps || []
    // Enforce "never recreate from scratch": reject ops that replace top-level
    // arrays / objects. Audit-log the rejection so the chat history still shows
    // what the LLM tried to do.
    const forbidden = ['/sections', '/theme', '/site', '/']
    const rejectedOps = []
    const ops = rawOps.filter((o) => {
      const bad = forbidden.includes(o?.path) && o?.op === 'replace'
      if (bad) rejectedOps.push(o)
      return !bad
    })
    const applied = applyPatchesSafe(config, ops)
    config = applied.result
    const entry = {
      sequence: i + 1, timestamp: new Date().toISOString(), mode: 'chat', prompt,
      llm: { model: MODEL, wallClockMs: r.wallClockMs, tokens: { in: r.inTok, out: r.outTok }, costUsd: r.cost, errorKind: r.errKind },
      decomposition: parsed?.decomposition || [],
      personaMessage: parsed?.personaMessage || '',
      response: {
        raw: r.response, parsed,
        opsCount: rawOps.length,
        opsApplied: ops.length - applied.failures.length,
        opsRejectedForbidden: rejectedOps,
        failures: applied.failures,
      },
      configStateAfter: { sectionsCount: (config.sections || []).length, theme: { mode: config.theme?.mode, accent: config.theme?.palette?.accentPrimary } },
    }
    chatHistory.push(entry)
    transcript.push(`${new Date().toISOString()} | p${i + 1} | ${r.wallClockMs}ms | $${r.cost.toFixed(6)} | ${rawOps.length}ops (${rejectedOps.length} rej) | ${applied.failures.length} fail | "${(parsed?.personaMessage || '').slice(0, 80)}"`)
    log(`    ↳ ${r.wallClockMs}ms $${r.cost.toFixed(6)} ${rawOps.length} ops (${rejectedOps.length} rejected as forbidden), ${applied.failures.length} failed apply${r.errKind ? ' ERR:' + r.errKind : ''}`)
  }
  writeFileSync(resolve(scenarioDir, 'chat-history.jsonl'), chatHistory.map((e) => JSON.stringify(e)).join('\n') + '\n')
  writeFileSync(resolve(scenarioDir, 'transcript.log'), transcript.join('\n') + '\n')
  writeFileSync(resolve(scenarioDir, 'final-config.json'), JSON.stringify(config, null, 2))

  const grading = gradeAgainstChecklist(scenario.id, config, scenario.checklist)
  writeFileSync(resolve(scenarioDir, 'grading.json'), JSON.stringify(grading, null, 2))
  log(`  [${scenario.id}] checklist: ${grading.passed}/${scenario.checklist.length} (${(grading.score * 100).toFixed(1)}%) cost=$${totalCost.toFixed(6)}`)
  return { finalConfig: config, chatHistory, grading, totalCost }
}

// ---------------------------------------------------------------------------
// 5 brutal-honest reviewer personas (parallel)
// ---------------------------------------------------------------------------
const REVIEWERS = [
  { id: 'ux-critic', persona: 'You are a senior product designer (15+ years at top SaaS). You are BRUTALLY HONEST. Evaluate each site config: does it feel like a real designed website, or like AI scaffolding? Penalize generic copy, missing CTAs, inconsistent layout, weak hierarchy.' },
  { id: 'prompt-fidelity', persona: 'You are a QA auditor verifying whether the final config reflects each chat prompt. Compare prompts (in order) against final config. Penalize prompts that produced no visible change, wrong target, or were ignored.' },
  { id: 'json-validator', persona: 'You are a strict schema reviewer. Check structural integrity: every section has type+id+components array; no duplicate IDs; component shapes consistent; theme palette is complete; no orphan/dangling fields.' },
  { id: 'copy-quality', persona: 'You are a senior copywriter. Evaluate whether text fields are publishable production copy or placeholder/Lorem/AI-generic. Penalize "New Hero Title" or "Description here" or repetitive AI-style sentences.' },
  { id: 'render-readiness', persona: 'You are a frontend renderer engineer. Evaluate whether this config could be rendered to a working webpage without crashes. Penalize missing required fields, broken references (image URLs), unreachable sections.' },
]

async function runReviewer(client, reviewer, payload) {
  const systemPrompt = `${reviewer.persona}

Output ONLY this JSON (no prose, no markdown fences):
{
  "perScenario": {
    "blog":      { "score": <0-100>, "verdict": "<2-3 sentences>" },
    "portfolio": { "score": <0-100>, "verdict": "<2-3 sentences>" },
    "marketing": { "score": <0-100>, "verdict": "<2-3 sentences>" }
  },
  "topFindings": [ "<finding 1>", "<finding 2>", "<finding 3>" ],
  "promptImprovements": [ "<concrete prompt-engineering suggestion>" ]
}`
  const userPrompt = `Three sites were built by sequential <15-word chat prompts against a starting baseline. Review each:

${payload}

Score 0-100 per scenario. Score 100 = production-ready. Score 70 = acceptable POC. Score <70 = needs rework. Be brutally honest.`
  const r = await callLlm(client, systemPrompt, userPrompt)
  return { ...r, parsed: safeParseJson(r.response), reviewerId: reviewer.id }
}

function buildReviewPayload(scenarios) {
  return scenarios.map((s) => {
    const prompts = s.scenario.prompts.map((p, i) => `  ${i + 1}. "${p}"`).join('\n')
    const cfg = JSON.stringify(s.finalConfig, null, 2).slice(0, 6000) // cap to keep tokens sane
    const grade = s.grading
    return `── SCENARIO: ${s.scenario.id} ─────────────────────────────────────────
BRIEF: ${s.scenario.brief}
PROMPTS:
${prompts}

CHECKLIST GRADE: ${grade.passed}/${grade.passed + grade.failed} (${(grade.score * 100).toFixed(1)}%)
FAILED ITEMS: ${grade.items.filter((i) => !i.pass).map((i) => i.id).join(', ') || 'none'}

FINAL CONFIG (truncated to 6KB):
${cfg}`
  }).join('\n\n')
}

// ---------------------------------------------------------------------------
// Preview HTML
// ---------------------------------------------------------------------------
function buildPreviewHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>P126 multi-site eval — preview</title>
<style>
  :root { --bg:#0a0a0f; --fg:#f0ede5; --dim:#a8a39a; --accent:#A51C30; --card:#15151f; }
  body { margin:0; font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--fg); }
  header { padding:24px 32px; border-bottom:1px solid #222; display:flex; gap:16px; align-items:center; }
  header h1 { margin:0; font-family:'Cormorant Garamond',serif; font-weight:300; font-size:24px; }
  select { background:#000; color:#fff; border:1px solid #333; padding:8px 12px; font-size:14px; border-radius:4px; }
  main { padding:32px; max-width:1100px; margin:0 auto; }
  .section { background:var(--card); padding:24px; margin:16px 0; border-radius:8px; border:1px solid #222; }
  .section h2 { margin:0 0 8px; font-size:14px; color:var(--accent); text-transform:uppercase; letter-spacing:0.1em; }
  .section h3 { margin:8px 0; font-family:'Cormorant Garamond',serif; font-weight:300; }
  .components { display:flex; flex-wrap:wrap; gap:12px; margin-top:12px; }
  .comp { background:#0a0a14; border:1px solid #222; padding:12px; border-radius:6px; flex:1 1 240px; font-size:13px; }
  .comp pre { font-size:11px; color:var(--dim); overflow:auto; max-height:200px; margin:4px 0 0; }
  .stats { background:#000; padding:16px 24px; border:1px solid #222; border-radius:8px; margin-bottom:16px; display:flex; gap:24px; flex-wrap:wrap; font-size:13px; }
  .stats span b { color:var(--accent); font-family:monospace; }
  .palette { display:flex; gap:6px; }
  .swatch { width:24px; height:24px; border-radius:50%; border:1px solid #333; }
</style>
</head>
<body>
<header>
  <h1>P126 multi-site eval — preview</h1>
  <select id="picker">
    <option value="blog">Blog (Hey Bradley storytelling)</option>
    <option value="portfolio">Portfolio (Bradley Ross designer)</option>
    <option value="marketing">Marketing (Atlas AI Consulting)</option>
  </select>
</header>
<main id="root"></main>
<script>
const CONFIGS = {};
async function load() {
  for (const id of ['blog','portfolio','marketing']) {
    const r = await fetch('output/' + id + '/final-config.json');
    CONFIGS[id] = await r.json();
  }
  render(document.getElementById('picker').value);
}
function render(id) {
  const cfg = CONFIGS[id];
  const root = document.getElementById('root');
  if (!cfg) { root.textContent = 'No config'; return; }
  const t = cfg.theme || {};
  const p = t.palette || {};
  let html = '<div class="stats">' +
    '<span>title <b>' + (cfg.site?.title || '?') + '</b></span>' +
    '<span>mode <b>' + (t.mode || '?') + '</b></span>' +
    '<span>sections <b>' + (cfg.sections?.length || 0) + '</b></span>' +
    '<span>palette <div class="palette">' +
      ['bgPrimary','bgSecondary','textPrimary','accentPrimary','accentSecondary']
        .map((k) => '<div class="swatch" style="background:' + (p[k]||'transparent') + '" title="'+k+': '+(p[k]||'')+'"></div>').join('') +
    '</div></span>' +
  '</div>';
  for (const s of (cfg.sections || [])) {
    html += '<div class="section">' +
      '<h2>' + (s.type || '') + ' · ' + (s.id || '') + '</h2>';
    if (s.content?.heading) html += '<h3>' + s.content.heading + '</h3>';
    if (s.content?.subheading) html += '<p style="color:var(--dim)">' + s.content.subheading + '</p>';
    html += '<div class="components">';
    for (const c of (s.components || [])) {
      const props = JSON.stringify(c.props || {}, null, 2);
      html += '<div class="comp"><b>' + (c.type || '') + '</b> · ' + (c.id || '') + '<pre>' + props.replace(/</g,'&lt;') + '</pre></div>';
    }
    html += '</div></div>';
  }
  root.innerHTML = html;
}
document.getElementById('picker').addEventListener('change', (e) => render(e.target.value));
load();
</script>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Improvements file (when composite efficacy <70%)
// ---------------------------------------------------------------------------
function buildImprovementsMd(scenarios, reviewerComposites) {
  const lines = []
  lines.push('# P126 multi-site eval — process improvements')
  lines.push('')
  lines.push('> Composite efficacy fell below 70%. This document captures concrete prompt-engineering improvements derived from failed checklist items + reviewer findings.')
  lines.push('')
  lines.push('## Failure summary per scenario')
  lines.push('')
  for (const s of scenarios) {
    const fail = s.grading.items.filter((i) => !i.pass)
    lines.push(`### ${s.scenario.name} (${s.scenario.id}) — ${(s.grading.score * 100).toFixed(1)}%`)
    lines.push('')
    if (!fail.length) { lines.push('- All checklist items passed.'); lines.push(''); continue }
    for (const f of fail) lines.push(`- **${f.id}** — ${f.desc}`)
    lines.push('')
  }
  lines.push('## Suggested system-prompt augmentation')
  lines.push('')
  lines.push('Add to the chat-mode system prompt a few-shot section showing fully-populated examples:')
  lines.push('')
  lines.push('```')
  lines.push('FEW-SHOT EXAMPLE:')
  lines.push('User: "Add three pricing tiers Starter Growth and Enterprise"')
  lines.push('Output:')
  lines.push('{ "templateId": "pricing-3tier", "confidence": 0.95, "summary": "...", "patchOps":[')
  lines.push('  {"op":"add","path":"/sections/-","value":{')
  lines.push('    "type":"pricing","id":"pricing-01","enabled":true,"order":4,')
  lines.push('    "components":[')
  lines.push('      {"id":"tier-starter","type":"price-card","props":{"name":"Starter","price":"$X","features":["...","..."]}},')
  lines.push('      {"id":"tier-growth", "type":"price-card","props":{"name":"Growth", "price":"$Y","features":["...","..."]}},')
  lines.push('      {"id":"tier-enterprise","type":"price-card","props":{"name":"Enterprise","price":"Contact","features":["...","..."]}}')
  lines.push('    ],"content":{},"layout":{},"style":{}')
  lines.push('  }}')
  lines.push(']}')
  lines.push('```')
  lines.push('')
  lines.push('## Reviewer-suggested improvements')
  lines.push('')
  for (const c of reviewerComposites) {
    if (!c.parsed?.promptImprovements?.length) continue
    lines.push(`### From ${c.reviewerId}`)
    for (const s of c.parsed.promptImprovements) lines.push(`- ${s}`)
    lines.push('')
  }
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Final report
// ---------------------------------------------------------------------------
function buildFinalReport({ scenarios, reviewers, composites, totalCost }) {
  const lines = []
  lines.push('# P126 multi-site eval — final report')
  lines.push('')
  lines.push(`Generated ${new Date().toISOString()} · model gemini-2.5-flash · total cost $${totalCost.toFixed(6)} / $10 phase cap`)
  lines.push('')
  lines.push('## Composite efficacy')
  lines.push('')
  lines.push('| Scenario | Checklist | Reviewer avg | Composite |')
  lines.push('|---|---|---|---|')
  for (const s of scenarios) {
    const checklistPct = s.grading.score * 100
    const reviewerAvgs = composites.scenarioAvgs[s.scenario.id] ?? 0
    const comp = (checklistPct + reviewerAvgs) / 2
    lines.push(`| ${s.scenario.name} | ${checklistPct.toFixed(1)}% | ${reviewerAvgs.toFixed(1)} | **${comp.toFixed(1)}** |`)
  }
  lines.push('')
  lines.push(`**Overall composite: ${composites.overall.toFixed(1)}%**`)
  lines.push('')
  lines.push('## Per-scenario checklist detail')
  lines.push('')
  for (const s of scenarios) {
    lines.push(`### ${s.scenario.name} (${s.scenario.id})`)
    lines.push('')
    lines.push(`Brief: _${s.scenario.brief}_`)
    lines.push('')
    lines.push(`Score: ${s.grading.passed}/${s.grading.items.length} (${(s.grading.score * 100).toFixed(1)}%)`)
    lines.push('')
    lines.push('| ID | Pass | Description |')
    lines.push('|---|---|---|')
    for (const it of s.grading.items) lines.push(`| ${it.id} | ${it.pass ? '✅' : '❌'} | ${it.desc} |`)
    lines.push('')
  }
  lines.push('## 5 brutal-honest reviewers')
  lines.push('')
  for (const r of reviewers) {
    lines.push(`### ${r.reviewerId} (cost $${r.cost.toFixed(6)})`)
    lines.push('')
    if (!r.parsed) { lines.push('_Reviewer returned no parsable JSON._'); lines.push(''); continue }
    const ps = r.parsed.perScenario || {}
    lines.push('| Scenario | Score | Verdict |')
    lines.push('|---|---|---|')
    for (const id of ['blog', 'portfolio', 'marketing']) {
      const o = ps[id] || {}
      lines.push(`| ${id} | ${o.score ?? '—'} | ${(o.verdict || '').replace(/\|/g, '\\|')} |`)
    }
    lines.push('')
    if (r.parsed.topFindings?.length) {
      lines.push('**Top findings:**')
      for (const f of r.parsed.topFindings) lines.push(`- ${f}`)
      lines.push('')
    }
    if (r.parsed.promptImprovements?.length) {
      lines.push('**Prompt improvements:**')
      for (const i of r.parsed.promptImprovements) lines.push(`- ${i}`)
      lines.push('')
    }
  }
  lines.push('## Preview')
  lines.push('')
  lines.push('Open `preview.html` in a browser. Use the dropdown to select blog / portfolio / marketing.')
  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  mkdirSync(REV_DIR, { recursive: true })
  writeFileSync(LOG_PATH, '')
  log('=== P126 multi-site eval — direct Gemini API, no Playwright ===')

  const env = readDotEnv(ENV_PATH)
  const key = env.GEMINI_API_KEY
  if (!key) { log('FATAL: GEMINI_API_KEY missing'); process.exit(2) }
  const client = new GoogleGenAI({ apiKey: key })

  const scenariosFile = JSON.parse(readFileSync(resolve(ROOT, 'scenarios.json'), 'utf8'))
  const scenarios = scenariosFile.scenarios

  let totalCost = 0
  const results = []
  for (const scenario of scenarios) {
    if (totalCost >= PHASE_BUDGET_USD) { log(`Budget cap hit, skipping ${scenario.id}`); continue }
    log(`--- Running scenario: ${scenario.name} (${scenario.id}) ---`)
    const scenarioDir = resolve(OUT_DIR, scenario.id)
    const r = await runScenario(client, scenario, scenarioDir)
    totalCost += r.totalCost
    results.push({ scenario, ...r })
  }

  log('--- Running 5 brutal-honest reviewers in parallel ---')
  const payload = buildReviewPayload(results)
  const reviewerPromises = REVIEWERS.map((rev) => runReviewer(client, rev, payload))
  const reviewers = await Promise.all(reviewerPromises)
  for (const r of reviewers) {
    totalCost += r.cost
    writeFileSync(resolve(REV_DIR, `${r.reviewerId}.json`), JSON.stringify(r, null, 2))
    log(`  reviewer ${r.reviewerId}: ${r.wallClockMs}ms $${r.cost.toFixed(6)} ${r.parsed ? 'OK' : 'NO-JSON'}`)
  }

  const scenarioAvgs = {}
  for (const s of results) {
    const id = s.scenario.id
    const scores = reviewers.map((r) => r.parsed?.perScenario?.[id]?.score).filter((x) => typeof x === 'number')
    scenarioAvgs[id] = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  }
  const composites = {
    scenarioAvgs,
    overall: results.reduce((sum, s) => sum + ((s.grading.score * 100 + scenarioAvgs[s.scenario.id]) / 2), 0) / results.length,
  }
  log(`overall composite: ${composites.overall.toFixed(1)}%`)

  const report = buildFinalReport({ scenarios: results, reviewers, composites, totalCost })
  writeFileSync(resolve(ROOT, 'final-report.md'), report)
  writeFileSync(resolve(ROOT, 'preview.html'), buildPreviewHtml())
  writeFileSync(resolve(ROOT, 'composites.json'), JSON.stringify({ composites, totalCost, perScenarioChecklist: Object.fromEntries(results.map((s) => [s.scenario.id, s.grading.score])) }, null, 2))

  if (composites.overall < EFFICACY_GATE * 100) {
    const improvements = buildImprovementsMd(results, reviewers)
    writeFileSync(resolve(ROOT, 'improvements.md'), improvements)
    log(`composite below ${EFFICACY_GATE * 100}% — wrote improvements.md`)
  }

  log(`=== DONE · total cost $${totalCost.toFixed(6)} ===`)
}

main().catch((e) => { log(`FATAL: ${e?.stack || e}`); process.exit(2) })
