// Spec: plans/implementation/mvp-plan/07-prompts-and-aisp.md §1 (Crystal Atom),
//       §1.4 (output rule), §5 (path whitelist), §7 (token budget).
// Decision record: docs/adr/ADR-045-system-prompt-aisp.md (authored Step 3).
// Step 2 of Phase 18: deterministic builder. No I/O, no randomness.

import { renderAllowedPathsForPrompt } from '@/lib/schemas/patchPaths'
import { estimateTokens } from '@/contexts/intelligence/llm/cost'

export interface SystemPromptCtx {
  /** Current MasterConfig — compacted to ≤ 4 KB before injection. */
  configJson: unknown
  siteContext?: { purpose?: string; audience?: string; tone?: string }
  /** Last-N chat turns (we cap at 6 inside this builder). */
  history?: Array<{ role: 'user' | 'bradley'; text: string }>
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

function renderSiteContext(ctx: SystemPromptCtx['siteContext']): string {
  if (!ctx) return ''
  const purpose = ctx.purpose ?? ''
  const audience = ctx.audience ?? ''
  const tone = ctx.tone ?? ''
  return `SITE CONTEXT: { purpose: "${purpose}", audience: "${audience}", tone: "${tone}" }`
}

/** Deterministic builder. Aim ≤ 2,400 tokens total per 07 §7. */
export function buildSystemPrompt(ctx: SystemPromptCtx): string {
  const parts: string[] = []
  parts.push(ROLE_LINE)
  parts.push(CRYSTAL_ATOM)
  parts.push('ALLOWED PATHS (replace-op only for MVP):')
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
