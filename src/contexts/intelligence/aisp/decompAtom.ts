/**
 * P74 / OC-DECOMP — DECOMP_ATOM Crystal Atom.
 *
 * Splits a multi-clause user utterance into ordered structured todos
 * BEFORE the template matcher fires. Pure deterministic-rules baseline;
 * LLM enrichment is a separate path.
 *
 * Owner mandate: "make it brighter and more fun and add pricing" →
 *   Todo 1: modify theme    → brightness  → templateMatcher "bright"
 *   Todo 2: modify tone     → fun casual  → contentLibrary "fun-casual"
 *   Todo 3: add section     → pricing     → sectionLibrary
 *
 * Mirrors `intentAtom.ts` Crystal-Atom shape per `bar181/aisp-open-core
 * ai_guide`. Distinct from INTENT_ATOM: INTENT classifies a single verb;
 * DECOMP splits into N ordered todos that each later flow through INTENT
 * + matcher independently.
 *
 * ADR-099 (DECOMP_ATOM, P74 / OC-DECOMP — A3 owns).
 */

import type { ClassifiedIntent, PageRef } from '@/contexts/intelligence/aisp/intentAtom'
import { resolvePageReference } from '@/contexts/intelligence/aisp/intentAtom'

/** The Crystal Atom for utterance decomposition (verbatim AISP). */
export const DECOMP_ATOM = `⟦
  Ω := { Split multi-clause user utterance into ordered Todo[] for downstream matchers }
  Σ := {
    Todo:{order:ℕ, verb:Verb, target:Target, details:𝕊, sourceSpan:𝕊, confidence:[0,1], targetPage:𝕊?},
    Verb:{op∈{modify, add, remove, replace, generate, unknown}},
    Target:{type∈{theme, section, content, tone, unknown}},
    𝕊 := UTF-8 string ≤ 500 chars
  }
  Γ := {
    R1: ∀ Todo : order ≥ 1, 1-indexed within source utterance,
    R2: clauses split on coordinating conjunctions { " and ", ", ", ";", " then ", " also " },
    R3: confidence := 0.9 if (verb_hit ∧ target_hit), 0.6 if exactly one hit, 0.3 otherwise,
    R4: sourceSpan ⊆ utterance (verbatim substring of the producing clause),
    R5: empty input ⇒ todos = [] ∧ source = 'fallthrough' ∧ confidence = 0
  }
  Λ := {
    confidence_threshold := 0.7,
    fallback := single-todo {verb:'unknown', target:'unknown', details:utterance}
  }
  Ε := {
    V1: VERIFY ∀ Todo.verb ∈ Σ.Verb.op,
    V2: VERIFY ∀ Todo.target ∈ Σ.Target.type,
    V3: VERIFY aggregate confidence = mean(Todo.confidence) when |todos| ≥ 1
  }
⟧`

/** Verb classifications recognized by DECOMP_ATOM. */
export type DecompVerb =
  | 'modify'
  | 'add'
  | 'remove'
  | 'replace'
  | 'generate'
  | 'unknown'

/** Target classifications recognized by DECOMP_ATOM. */
export type DecompTarget =
  | 'theme'
  | 'section'
  | 'content'
  | 'tone'
  | 'unknown'

/** A single structured todo in a multi-clause user utterance. */
export interface Todo {
  /** Order (1-indexed) within the source utterance. */
  order: number
  /** Verb classification (modify / add / remove / replace / generate). */
  verb: DecompVerb
  /** Target — what the todo operates on (theme / section / content / unknown). */
  target: DecompTarget
  /** Specific details from the user clause (e.g., "brighter", "fun", "pricing"). */
  details: string
  /** Substring of the original utterance that produced this todo (for traceability). */
  sourceSpan: string
  /** Confidence (0-1) in this decomposition. */
  confidence: number
  /**
   * P82 / OC-CLEANUP (A3) — page-aware todo. When the source clause references
   * a specific page ("on page 2", "the contact page"), this carries the
   * resolved page id. Absent (undefined) → executor uses active-page scope
   * (P79 byte-equivalent behavior). Resolved via `resolvePageReference` from
   * intentAtom.ts when the caller passes a `pages` argument to `decompose()`.
   */
  targetPage?: string
}

/** DECOMP_ATOM result envelope. */
export interface DecompAtomResult {
  /** The original utterance unchanged. */
  utterance: string
  /** Ordered list of todos (1+ entries; even single-clause input returns 1 todo). */
  todos: readonly Todo[]
  /** Source: 'rules' (deterministic) | 'fallthrough' (no clauses parsed). */
  source: 'rules' | 'fallthrough'
  /** Aggregate confidence across all todos. */
  confidence: number
}

/** DECOMP_ATOM rule-based confidence threshold. */
export const DECOMP_CONFIDENCE_THRESHOLD = 0.7

/** Verb keyword lookup table. Order = priority (longer phrases first per verb). */
const VERB_KEYWORDS: Record<Exclude<DecompVerb, 'unknown'>, readonly string[]> = {
  modify: ['make it', 'change to', 'change', 'switch to', 'switch', 'update', 'make', 'set'],
  add: ['add', 'include', 'put in', 'insert', 'append'],
  remove: ['remove', 'delete', 'drop', 'hide', 'get rid of'],
  replace: ['replace', 'swap'],
  generate: ['write', 'generate', 'create copy', 'create'],
}

/** Target keyword lookup table. Order matters: sections checked before themes for "pricing"-style overlap. */
const TARGET_KEYWORDS: Record<Exclude<DecompTarget, 'unknown'>, readonly string[]> = {
  section: [
    'pricing', 'hero', 'footer', 'header', 'blog', 'testimonials', 'cta',
    'features', 'faq', 'gallery', 'team', 'value-props', 'value props',
    'section',
  ],
  theme: [
    'theme', 'color', 'colors', 'palette', 'bright', 'brighter', 'brightness',
    'dark', 'darker', 'warm', 'warmer', 'cool', 'cooler', 'vibrant',
    'minimal', 'minimalist', 'retro', 'modern',
  ],
  tone: [
    'fun', 'funny', 'playful', 'casual', 'serious', 'professional',
    'friendly', 'tone', 'voice', 'energetic', 'calm', 'punchy',
  ],
  content: ['content', 'copy', 'text', 'words', 'wording', 'headline', 'subheadline'],
}

/** Conjunction split tokens (longest first to avoid premature splits). */
const SPLIT_TOKENS: readonly string[] = [
  ' and also ',
  ' and then ',
  ' then ',
  ' also ',
  ' and ',
  '; ',
  ';',
  ', ',
]

/** Lowercase + trim helper used in matching. */
function norm(s: string): string {
  return s.toLowerCase().trim()
}

/** Split utterance into ordered raw clauses preserving original casing. */
function splitClauses(utterance: string): string[] {
  const trimmed = utterance.trim()
  if (trimmed.length === 0) return []
  let working: string[] = [trimmed]
  for (const token of SPLIT_TOKENS) {
    const next: string[] = []
    const lcToken = token.toLowerCase()
    for (const segment of working) {
      const lc = segment.toLowerCase()
      let cursor = 0
      let idx = lc.indexOf(lcToken, cursor)
      while (idx !== -1) {
        next.push(segment.slice(cursor, idx))
        cursor = idx + token.length
        idx = lc.indexOf(lcToken, cursor)
      }
      next.push(segment.slice(cursor))
    }
    working = next.map(s => s.trim()).filter(s => s.length > 0)
  }
  return working
}

/** Detect verb in clause; returns matched keyword + verb, or null. */
function detectVerb(clause: string): { verb: DecompVerb; keyword: string } | null {
  const lc = norm(clause)
  for (const verb of Object.keys(VERB_KEYWORDS) as Array<Exclude<DecompVerb, 'unknown'>>) {
    for (const kw of VERB_KEYWORDS[verb]) {
      // word-boundary-ish: keyword starts at clause-start or after a space.
      if (lc === kw || lc.startsWith(kw + ' ') || lc.includes(' ' + kw + ' ') || lc.endsWith(' ' + kw)) {
        return { verb, keyword: kw }
      }
    }
  }
  return null
}

/** Detect target in clause; returns matched keyword + target, or null. */
function detectTarget(clause: string): { target: DecompTarget; keyword: string } | null {
  const lc = norm(clause)
  for (const target of Object.keys(TARGET_KEYWORDS) as Array<Exclude<DecompTarget, 'unknown'>>) {
    for (const kw of TARGET_KEYWORDS[target]) {
      if (lc === kw || lc.includes(kw)) {
        return { target, keyword: kw }
      }
    }
  }
  return null
}

/** Strip a leading filler ("more", "it", "the") + the matched verb keyword from clause for `details`. */
function extractDetails(clause: string, verbKeyword: string | null): string {
  let out = clause.trim()
  if (verbKeyword !== null) {
    const lc = out.toLowerCase()
    if (lc.startsWith(verbKeyword + ' ')) {
      out = out.slice(verbKeyword.length).trim()
    }
  }
  // Strip a single leading "it" / "more" / "the" filler to surface the head detail.
  const fillerRe = /^(it|more|the|a|an)\s+/i
  out = out.replace(fillerRe, '').trim()
  return out
}

/** Score a clause per Γ R3. */
function scoreConfidence(verbHit: boolean, targetHit: boolean): number {
  if (verbHit && targetHit) return 0.9
  if (verbHit || targetHit) return 0.6
  return 0.3
}

/**
 * Decompose a user utterance into structured todos.
 *
 * See DECOMP_ATOM (Σ/Γ/Λ/Ε above) for the canonical contract.
 * `intent` is accepted for forward-compat but not consumed by the rules
 * baseline — it is reserved for the LLM-enrichment path.
 *
 * P82 / OC-CLEANUP (A3) — `pages` is OPTIONAL. When provided, each clause is
 * scanned for page references via `resolvePageReference` (intentAtom.ts) and
 * the resolved id is set on `Todo.targetPage`. Omitting `pages` (or passing
 * undefined/empty) yields P74-byte-equivalent behavior.
 */
export function decompose(
  utterance: string,
  // Reserved for LLM-enriched DECOMP path; underscore prefix marks intentional non-use.
  _intent?: ClassifiedIntent | null,
  pages?: ReadonlyArray<PageRef>,
): DecompAtomResult {
  const clauses = splitClauses(utterance)
  if (clauses.length === 0) {
    return { utterance, todos: [], source: 'fallthrough', confidence: 0 }
  }
  const todos: Todo[] = []
  for (let i = 0; i < clauses.length; i++) {
    const clause = clauses[i]
    const verbHit = detectVerb(clause)
    const targetHit = detectTarget(clause)
    const verb: DecompVerb = verbHit?.verb ?? 'unknown'
    const target: DecompTarget = targetHit?.target ?? 'unknown'
    const confidence = scoreConfidence(verbHit !== null, targetHit !== null)
    const details = extractDetails(clause, verbHit?.keyword ?? null)
    // P82 / OC-CLEANUP (A3) — resolve per-clause page reference. `undefined`
    // when no pages context OR no reference detected (P74 byte-equivalent).
    const targetPage = pages && pages.length > 0
      ? resolvePageReference(clause, pages) ?? undefined
      : undefined
    todos.push({
      order: i + 1,
      verb,
      target,
      details: details.length > 0 ? details : clause,
      sourceSpan: clause,
      confidence,
      ...(targetPage !== undefined ? { targetPage } : {}),
    })
  }
  const aggregate = todos.reduce((sum, t) => sum + t.confidence, 0) / todos.length
  const anyRulesHit = todos.some(t => t.confidence >= 0.6)
  return {
    utterance,
    todos,
    source: anyRulesHit ? 'rules' : 'fallthrough',
    confidence: aggregate,
  }
}

/** P100 W2 / A7 — Contradiction pattern (additive; does NOT modify decompose()). */
export const CONTRADICTION_RE =
  /\b(?:remove|delete|drop|hide)\b[^.;]*\band\s+add\s+(?:it|them|that|the\s+\w+)\s+back\b/i
export function hasContradiction(utterance: string): boolean { return CONTRADICTION_RE.test(utterance) }
