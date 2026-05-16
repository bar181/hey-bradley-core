// Spec: plans/hitl/phase-126-go-live/human-2.md FEATURE 5
// Decision record: docs/adr/ADR-155-llm-confidence-best-guess.md
//
// P126 / F5 — Low-confidence response helpers. Three pieces:
//
//   1. `appendLowConfidenceNote(summary, reason)` — appends a casual
//      "I had to guess" note + chat-history deep-link to the user-facing
//      narration. Rotated across a small pool so the note doesn't feel
//      canned. Anti-pattern lock: NEVER returns empty / "I don't understand".
//
//   2. `synthesizeBestGuessPatches(userText, config)` — when the LLM
//      returned zero usable patches, produce a SAFE fallback patch so the
//      pipeline always ships something. Keyword-driven (brighter / darker
//      / brighten / lighten flip /theme/mode); falls back to a theme-mode
//      toggle for any unrecognized prompt.
//
//   3. `CHAT_HISTORY_LINK_MARKER` — single source of truth for the
//      `(see Chat History →)` deep-link emitted into Bradley's narration.
//      ChatThread renders this as plain text today; ADR-155 carries the
//      forward-compat note for a future markdown-link parser.

import type { JSONPatch } from '@/lib/schemas/patches'
import type { MasterConfig } from '@/lib/schemas/masterConfig'

/** ADR-155 D3 — chat-history deep-link emitted into Bradley's narration. */
export const CHAT_HISTORY_LINK_MARKER = '(see Chat History → /agentics?tab=history)'

/**
 * Casual low-confidence notes. Rotated by reason-bucket so the user
 * doesn't read the same canned line twice in a row.
 *
 * Note: NO emoji, no exclamation overload. The tone is owner-mode casual
 * — "honest, not apologetic" per ADR-155 D1.
 */
const NOTES_EMPTY: readonly string[] = [
  "I had to guess on that one — went with a safe brightness flip. Tell me if you wanted something else.",
  "Not 100% sure what you meant, so I made a best-guess change. Easy to undo if it's wrong.",
  "Low confidence on this one — applied a default change. Let me know what to do instead.",
]

const NOTES_SINGLE_MULTI: readonly string[] = [
  "I only changed one thing — your prompt sounded like it had a few parts, so tell me what else to update.",
  "Best guess: tackled one piece of that. Want me to do the rest?",
  "Caught one part of that prompt — the others I'm less sure about. Easy to retry.",
]

const NOTES_HEDGE: readonly string[] = [
  "Honest note: I'm not super confident on this one — double-check the result.",
  "Best-guess take here — let me know if you wanted something different.",
  "Low confidence on this one. Easy to undo if it's off.",
]

/** Bucket → note pool. Centralised so rotation logic stays in one place. */
function notePoolFor(reason: string | undefined): readonly string[] {
  if (reason === 'empty-patches') return NOTES_EMPTY
  if (reason === 'single-patch-multi-target') return NOTES_SINGLE_MULTI
  return NOTES_HEDGE
}

/**
 * P126 / F5 — Append a casual low-confidence note + chat-history deep-link
 * to Bradley's narration. Idempotent: if the summary already carries the
 * marker, return as-is (defensive — prevents double-tagging when the LLM
 * pipeline re-runs the same response).
 *
 * `reason` selects the note bucket; an undefined reason falls back to the
 * generic hedge bucket so the function is always safe to call.
 *
 * Rotation: `Math.random()` keeps the helper pure (no state). Acceptable
 * because the pool is tiny and identical-back-to-back is rare in practice;
 * deterministic rotation would require threading session state through
 * the pipeline for negligible UX gain.
 */
export function appendLowConfidenceNote(summary: string, reason?: string): string {
  const base = summary.trim()
  if (base.includes(CHAT_HISTORY_LINK_MARKER)) return summary
  const pool = notePoolFor(reason)
  const note = pool[Math.floor(Math.random() * pool.length)]!
  // Two-space gap between primary summary and note keeps existing renderers
  // happy; the deep-link sits on its own logical clause for readability.
  return base.length > 0
    ? `${base}  ${note} ${CHAT_HISTORY_LINK_MARKER}`
    : `${note} ${CHAT_HISTORY_LINK_MARKER}`
}

/**
 * P126 / F5 — Best-guess fallback patch synthesizer.
 *
 * Keyword routing (cheap, deterministic, $0):
 *   - "brighter" / "brighten" / "lighter" / "lighten" → /theme/mode = 'light'
 *   - "darker" / "darken" → /theme/mode = 'dark'
 *   - Otherwise → flip /theme/mode to the opposite of current
 *
 * The flip-default is intentional: ADR-155 D2 mandates "never empty-return."
 * A theme toggle is the most low-impact, easy-to-undo change we can make
 * with zero risk of breaking the schema. The user can always say "no go
 * back" and the configStore history will undo it.
 */
export function synthesizeBestGuessPatches(
  userText: string,
  config: Pick<MasterConfig, 'theme'>,
): JSONPatch[] {
  const t = userText.toLowerCase()
  const currentMode = config.theme.mode === 'dark' ? 'dark' : 'light'
  let nextMode: 'light' | 'dark'
  if (/\b(brighter|brighten|lighter|lighten|light mode)\b/.test(t)) {
    nextMode = 'light'
  } else if (/\b(darker|darken|dark mode)\b/.test(t)) {
    nextMode = 'dark'
  } else {
    nextMode = currentMode === 'dark' ? 'light' : 'dark'
  }
  // If the fallback target equals the current state, flip anyway so the user
  // sees SOMETHING change (per ADR-155 D2 — never empty-return).
  if (nextMode === currentMode) nextMode = currentMode === 'dark' ? 'light' : 'dark'
  return [{ op: 'replace', path: '/theme/mode', value: nextMode }]
}
