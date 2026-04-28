// Spec: plans/implementation/mvp-plan/07-prompts-and-aisp.md §1 (Crystal Atom),
//       §1.4 (output rule), §5 (path whitelist), §7 (token budget).
// Decision record: docs/adr/ADR-045-system-prompt-aisp.md (authored Step 3).
// Step 2 of Phase 18: deterministic builder. No I/O, no randomness.

import { renderAllowedPathsForPrompt } from '@/lib/schemas/patchPaths'
import { estimateTokens } from '@/contexts/intelligence/llm/cost'
import { readBrandContext } from '@/contexts/persistence/repositories/brandContext'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'

export interface SystemPromptCtx {
  /** Current MasterConfig — compacted to ≤ 4 KB before injection. */
  configJson: unknown
  siteContext?: { purpose?: string; audience?: string; tone?: string }
  /** Last-N chat turns (we cap at 6 inside this builder). */
  history?: Array<{ role: 'user' | 'bradley'; text: string }>
  /**
   * P44 Sprint H Wave 1 — optional brand context (uploaded brand voice doc).
   * When omitted, the builder falls back to readBrandContext() from the kv
   * repo. Pass an empty string explicitly to suppress injection.
   */
  brandContext?: string
}

const ROLE_LINE =
  'You are Bradley, the JSON-patch generator behind the Hey Bradley site builder. You produce ONLY a JSON object with a `patches` array.'

/** Verbatim AISP Crystal Atom from 07-prompts-and-aisp.md §1.2. */
const CRYSTAL_ATOM = `\`\`\`aisp
⟦
  Ω := { Apply user request as JSON patches against current MasterConfig }
  Σ := {
    Patch       := { op: 𝔼{add,replace,remove}, path: 𝕊, value: 𝕁 ?},
    Envelope    := { patches: [Patch] (1..20), summary: 𝕊 (≤140) ? },
    Section     := { type: SectionType, id: 𝕊, layout: Layout, content: Content, style: Style },
    SectionType := 𝔼{ navbar, hero, features, pricing, action, quotes, questions, numbers,
                      gallery, logos, team, image, divider, text, blog, footer }
  }
  Γ := {
    R1: response.shape == Envelope ∧ response.format == application/json,
    R2: ∀ p ∈ patches : p.path startsWith /sections OR p.path startsWith /theme
                        OR p.path ∈ {/page,/version,/siteContext/purpose,/siteContext/audience,/siteContext/tone},
    R3: ∀ add to /sections/- : value.type ∈ SectionType ∧ unique(value.id),
    R4: ∀ replace : new value matches Σ for that path,
    R5: ∀ remove : p.path resolves to existing node,
    R6: forbid scripts, javascript:, data: URIs in any string value,
    R7: |patches| ≤ 20,
    R8: prose, html, markdown, code-fences = ∅
  }
  Λ := {
    ALLOWED_OPS := {add, replace, remove},
    SCHEMA_VERSION := "aisp-1.2",
    DEFAULT_VARIANT := "default"
  }
  Ε := {
    V1: VERIFY JSON.parse(response) ∈ Envelope,
    V2: VERIFY ∀ p : evaluate(R2..R6) = true,
    V3: VERIFY first character of response is "{"
  }
⟧
\`\`\``

const OUTPUT_RULE =
  'Output: return ONLY a JSON object matching `Envelope`. Do not include explanations, markdown, or code fences. The first character of your response must be "{". If the user request is unsafe, off-topic, or impossible, return {"patches":[],"summary":"<short reason>"}.'

const HISTORY_CAP = 6
const JSON_BYTE_CAP = 4096
/** P44 — brand context cap. Full doc lives in kv; only the head hits the LLM. */
const BRAND_CONTEXT_BYTE_CAP = 4096

/** Compact (no whitespace) JSON, then truncate to byte cap. */
function compactJson(json: unknown): string {
  let out: string
  try {
    out = JSON.stringify(json)
  } catch {
    return '{}'
  }
  if (out.length <= JSON_BYTE_CAP) return out
  // Truncate; leave a marker so the model knows it was clipped.
  return `${out.slice(0, JSON_BYTE_CAP - 16)}…<truncated>`
}

function renderHistory(history: SystemPromptCtx['history']): string {
  if (!history || history.length === 0) return ''
  const tail = history.slice(-HISTORY_CAP)
  const lines = tail.map((m) => `- ${m.role}: ${m.text.replace(/\s+/g, ' ').slice(0, 240)}`)
  return `RECENT MESSAGES (last ${tail.length}):\n${lines.join('\n')}`
}

/**
 * P19 Fix-Pass 2 (F4): sanitize values before interpolating into the system
 * prompt. Site-context values are user-supplied (purpose/audience/tone) and
 * could contain quote/newline characters that escape the JSON-like wrapper
 * we render below — a prompt-injection vector. Strip CR/LF/quotes/backslash
 * and clamp to 200 chars (KISS — values longer than that are noise anyway).
 */
function escapeForPromptInterpolation(s: string): string {
  return s.replace(/[\r\n"\\]/g, '').slice(0, 200)
}

function renderSiteContext(ctx: SystemPromptCtx['siteContext']): string {
  if (!ctx) return ''
  const purpose = escapeForPromptInterpolation(ctx.purpose ?? '')
  const audience = escapeForPromptInterpolation(ctx.audience ?? '')
  const tone = escapeForPromptInterpolation(ctx.tone ?? '')
  return `SITE CONTEXT: { purpose: "${purpose}", audience: "${audience}", tone: "${tone}" }`
}

/**
 * P44 — resolve brand context. Explicit `ctx.brandContext` wins; empty string
 * suppresses; otherwise we fall back to the kv repo. Truncated to
 * BRAND_CONTEXT_BYTE_CAP characters with a marker so the LLM knows it was
 * clipped (full doc still lives in kv for reference / future re-prompting).
 *
 * Defensive: kv read failures (e.g. db not initialized in unit tests) MUST
 * NOT throw — return ''.
 */
function resolveBrandContextBlock(explicit: string | undefined): string {
  let raw: string | null
  if (typeof explicit === 'string') {
    if (explicit.length === 0) return ''
    raw = explicit
  } else {
    try {
      raw = readBrandContext()
    } catch {
      raw = null
    }
  }
  if (!raw) return ''
  // P46 fix-pass (R2 L1) — defence-in-depth: redact key shapes at the
  // injection boundary too, so legacy kv rows written before the persist-side
  // redactor (or explicit `ctx.brandContext` callers) cannot leak into the
  // LLM prompt.
  const safe = redactKeyShapes(raw)
  const head =
    safe.length <= BRAND_CONTEXT_BYTE_CAP
      ? safe
      : `${safe.slice(0, BRAND_CONTEXT_BYTE_CAP - 16)}…<truncated>`
  return `---\nBrand Context (for content tone + voice):\n${head}`
}

/** Deterministic builder. Aim ≤ 2,400 tokens total per 07 §7. */
export function buildSystemPrompt(ctx: SystemPromptCtx): string {
  const parts: string[] = []
  parts.push(ROLE_LINE)
  parts.push(CRYSTAL_ATOM)
  // P44 — brand context block sits AFTER the AISP atom but BEFORE the user
  // prompt section (allowed paths + current JSON + site context + history are
  // not "user prompt", they are runtime state). KISS placement: directly
  // after CRYSTAL_ATOM so it reads as voice/tone guidance applied to all
  // subsequent reasoning.
  const brand = resolveBrandContextBlock(ctx.brandContext)
  if (brand) parts.push(brand)
  parts.push('ALLOWED PATHS (MVP allows replace, add (sections only), remove (sections only)):')
  parts.push(renderAllowedPathsForPrompt())
  parts.push(`CURRENT JSON (truncated to 4 KB; oldest sections kept):\n${compactJson(ctx.configJson)}`)
  const sc = renderSiteContext(ctx.siteContext)
  if (sc) parts.push(sc)
  const hist = renderHistory(ctx.history)
  if (hist) parts.push(hist)
  parts.push(OUTPUT_RULE)
  return parts.join('\n\n')
}

/** Best-effort token count (4-chars-per-token heuristic). */
export function estimateSystemPromptTokens(prompt: string): number {
  return estimateTokens(prompt)
}
