/**
 * P37 Sprint F P2 — Content / Design Route Classifier (A2).
 *
 * Splits the LLM router into two explicit routes per the owner's bottleneck:
 *   - 'content'  — copy / words (CONTENT_ATOM pipeline; slow, LLM-paid)
 *   - 'design'   — layout / style (SELECTION_ATOM + PATCH pipeline; fast, $0)
 *
 * Ambiguous intents (e.g. bare "change") emit route='ambiguous' and the caller
 * is expected to drive ASSUMPTIONS_ATOM clarification.
 *
 * P37 ships a RULE-BASED classifier in the same stub-then-LLM mould as P34's
 * assumptions engine and P26's intent classifier. Pure-rule means $0, deterministic,
 * idempotent, and offline-safe. P38+ may swap an LLM in when confidence < threshold.
 *
 * KISS: a small cue-word table per route + a tight set of disambiguation rules
 * for the bare verb 'change'. No registry mutation, no template-shape changes,
 * no LLM call.
 *
 * ADR-066 (planned, A3 owns) — Content/Design Route Split.
 */

import type { ClassifiedIntent, IntentVerb } from './intentAtom'

export type AISPRoute = 'content' | 'design' | 'ambiguous'

export interface RouteClassification {
  route: AISPRoute
  rationale: string
}

/**
 * Verbs that almost always rewrite copy/words, regardless of target.
 * `rewrite/regenerate` are unambiguous content verbs; `update` leans content
 * when paired with a copy-noun (headline/body/text) — see CONTENT_TARGET_RE.
 */
const CONTENT_VERB_RE = /\b(?:rewrite|rewrites|rewriting|regenerate|regenerates|regenerating|reword|rewords|rewording|rephrase|rephrases|rephrasing)\b/i

/**
 * Targets whose primary "thing" is text/copy. When the user mentions one of
 * these, the action is almost always content even if the verb is generic
 * (e.g. "change the headline to X" → content).
 *
 * Note: 'hero', 'blog', 'features' etc. are SECTION targets, not copy targets,
 * so they are intentionally NOT here — those are handled at the section level
 * by design verbs (add/hide/show/reset).
 */
const CONTENT_TARGET_RE = /\b(?:headline|heading|sub[- ]?headline|sub[- ]?heading|title|subtitle|body|copy|paragraph|paragraphs|description|tagline|caption|text|wording|words|content)\b/i

/**
 * Verbs that touch layout/style/structure (no LLM copy gen needed).
 * `add` is design when scaffolding a section; `hide/show/remove/reset` are
 * pure structural toggles; theme/colour/brightness verbs are pure CSS-style.
 */
const DESIGN_VERB_RE = /\b(?:hide|hides|hiding|show|shows|showing|add|adds|adding|insert|inserts|remove|removes|removing|delete|deletes|drop|drops|reset|resets|restore|restores|brighten|brightens|darken|darkens|lighten|lightens)\b/i

/**
 * Cue phrases that are unambiguously design even when the verb is generic.
 * Theme switches, colour palette tweaks, dark/light mode, layout/style words.
 */
const DESIGN_CUE_RE = /\b(?:theme|themes|dark\s*mode|light\s*mode|color|colour|colors|colours|palette|brighter|darker|lighter|layout|style|spacing|padding|margin|background|font|typography|alignment|center(?:ed)?|stack(?:ed)?)\b/i

/**
 * "Get rid of / take out" → remove → design.
 */
const DESIGN_SYNONYM_RE = /\b(?:get\s+rid\s+of|take\s+out)\b/i

/**
 * Helper — does the input mention any allowed *section* target (hero, blog,
 * features, pricing, …)? When yes AND the verb is structural, we're firmly in
 * design territory. We rely on the already-classified intent for this rather
 * than re-parsing — keeps the module small.
 */
function hasSectionTarget(intent: ClassifiedIntent | null): boolean {
  if (!intent || !intent.target) return false
  // Targets that name a SECTION (vs a copy field) all live in ALLOWED_TARGET_TYPES.
  // We don't want to false-positive on 'text' (which is a copy field name in the
  // section-type enum); guard against that.
  return intent.target.type !== 'text'
}

/**
 * Classify the AISP route for an intent + raw text.
 *
 * Decision order (first hit wins; KISS):
 *   1. Explicit content verbs (rewrite/regenerate/reword/rephrase) → 'content'
 *   2. Verb='change' or 'update' AND target is a copy noun → 'content'
 *   3. Design cue phrase (theme/dark mode/brighter/colour/...) → 'design'
 *   4. Design verb (hide/show/add/remove/reset/brighten/...) → 'design'
 *   5. Verb='change' with no copy-noun target AND no design cue → 'ambiguous'
 *   6. Default → 'design' (structural fall-through; LLM patch path remains safe)
 *
 * The ambiguous bucket is intentionally narrow: only bare 'change' / 'update'
 * with no signal in either direction. Everything else gets a route so the
 * caller can short-circuit the LLM patch path for content (P38 wires content)
 * or proceed to template/LLM patch for design (existing path, no behaviour change).
 */
export function classifyRoute(
  intent: ClassifiedIntent | null,
  text: string,
): RouteClassification {
  const t = text ?? ''

  // 1) Explicit content verbs — highest confidence, no need for target.
  if (CONTENT_VERB_RE.test(t)) {
    return {
      route: 'content',
      rationale: 'explicit content verb (rewrite/regenerate/rephrase)',
    }
  }

  // 2) Generic verb (change/update/set/make) + copy-noun target → content.
  //    We accept either AISP-classified verb OR bare presence of a copy noun
  //    in the raw text — defence in depth when AISP confidence was low.
  const verb: IntentVerb | null = intent?.verb ?? null
  const isGenericChangeVerb =
    verb === 'change' || /\b(?:change|changes|changing|update|updates|updating|set|sets|make|makes|making)\b/i.test(t)
  const hasCopyNoun = CONTENT_TARGET_RE.test(t)
  if (isGenericChangeVerb && hasCopyNoun) {
    return {
      route: 'content',
      rationale: `generic verb (${verb ?? 'change'}) targeting copy noun`,
    }
  }

  // 3) Design cue phrase — theme/colour/brightness/layout — wins over verb.
  if (DESIGN_CUE_RE.test(t)) {
    return {
      route: 'design',
      rationale: 'design cue phrase (theme/colour/layout)',
    }
  }

  // 4) Explicit design verb (incl. structural toggles + brightness verbs).
  if (DESIGN_VERB_RE.test(t) || DESIGN_SYNONYM_RE.test(t)) {
    // 4a) `add` + section target is firmly design (scaffold a section).
    //     `add` + copy noun is unusual but we treat it as design too — the
    //     CONTENT_ATOM doesn't own 'add'; templates do.
    return {
      route: 'design',
      rationale: hasSectionTarget(intent)
        ? `design verb on section target (${intent?.target?.type})`
        : 'design verb (hide/show/add/remove/reset/brighten/...)',
    }
  }

  // 5) Bare 'change' / 'update' with no signal either way → ambiguous.
  if (isGenericChangeVerb) {
    return {
      route: 'ambiguous',
      rationale: 'generic change/update verb with no copy-noun or design cue — needs ASSUMPTIONS_ATOM',
    }
  }

  // 6) Safe default — fall through to design (existing template/LLM-patch path).
  //    Verbless / unrecognised input goes here; the design path is the
  //    backward-compatible behaviour pre-P37.
  return {
    route: 'design',
    rationale: 'default — no content signal detected; safe fall-through to design path',
  }
}
