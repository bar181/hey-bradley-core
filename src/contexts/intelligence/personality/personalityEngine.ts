/**
 * Sprint J P50 (A1) — Personality Engine.
 *
 * Composition layer (Option B per `03-sprint-j-locked.md` D1) — runs AFTER
 * patches land. PATCH_ATOM Σ is unchanged; this module never widens any
 * Crystal Atom. Pure-rule + template composition: NO LLM call, NO randomness,
 * NO I/O. Deterministic in / deterministic out.
 *
 * 5 modes — each branch in `renderPersonalityMessage` carries unique literal
 * strings so A3's source-level tests can regex distinct outputs. Affirmation
 * prefix is derived deterministically from `summary[0]` (mirrors the P48
 * `improvementSuggester` pattern — see `aisp/improvementSuggester.ts`).
 *
 * `aispVisible` is true ONLY for `geek`; A4's UI consumes it later.
 *
 * Decision record: ADR-073 (composition pattern, no Σ widening — A3 owns).
 */

import type { ClassifiedIntent } from '@/contexts/intelligence/aisp/intentAtom'

export const PERSONALITY_IDS = [
  'professional',
  'fun',
  'geek',
  'teacher',
  'coach',
] as const

export type PersonalityId = typeof PERSONALITY_IDS[number]

export interface PersonalityProfile {
  label: string
  description: string
  emoji: string
  /** Short instruction (≤200 chars) appended to the system prompt by `system.ts`. */
  tonePrompt: string
  /** UX hint for A4's picker — the suggestion-row tone. */
  suggestionStyle: 'precise' | 'playful' | 'technical' | 'encouraging' | 'directive'
  /** True only for `geek` — A4 uses this to gate the AISP trace pane. */
  aispVisible: boolean
}

export const PERSONALITY_PROFILES: Record<PersonalityId, PersonalityProfile> = {
  professional: {
    label: 'Professional',
    description: 'Clean, precise, no fluff.',
    emoji: '',
    tonePrompt:
      'Write replies in a clean, precise, executive voice. No emoji. No exclamation marks. Lead with the change, then one terse follow-up suggestion.',
    suggestionStyle: 'precise',
    aispVisible: false,
  },
  fun: {
    label: 'Fun',
    description: 'Sarcastic, opinionated, emoji-forward.',
    emoji: '🎉',
    tonePrompt:
      'Write replies in a fun, sarcastic, opinionated voice. Use 1-2 emoji per reply. Have a take. Keep it short. It is OK to be a little cheeky.',
    suggestionStyle: 'playful',
    aispVisible: false,
  },
  geek: {
    label: 'Geek',
    description: 'Inline AISP classification + technical detail.',
    emoji: '🧠',
    tonePrompt:
      'Write replies as a senior engineer. Include the AISP intent classification inline (verb, target, confidence). Be terse. No marketing fluff.',
    suggestionStyle: 'technical',
    aispVisible: true,
  },
  teacher: {
    label: 'Teacher',
    description: 'Encouraging, simple words, gentle wins.',
    emoji: '⭐',
    tonePrompt:
      'Write replies in an encouraging, beginner-friendly voice. Use simple words and one celebration emoji. Explain WHY the change helps. Keep it warm.',
    suggestionStyle: 'encouraging',
    aispVisible: false,
  },
  coach: {
    label: 'Coach',
    description: 'Action-oriented, momentum-building, CTA-flavored.',
    emoji: '🚀',
    tonePrompt:
      'Write replies as a momentum coach. Be action-oriented. End every reply with a clear next-move CTA. Short sentences. Use the second person.',
    suggestionStyle: 'directive',
    aispVisible: false,
  },
}

const AFFIRMATIONS = ['Done', 'Locked in', 'Shipped'] as const

/** Deterministic affirmation prefix tied to `summary[0]` — mirrors P48. */
function pickAffirmation(summary: string): string {
  if (!summary) return AFFIRMATIONS[0]
  return AFFIRMATIONS[summary.charCodeAt(0) % AFFIRMATIONS.length]
}

function safeId(id: PersonalityId | null | undefined): PersonalityId {
  return id && PERSONALITY_IDS.includes(id) ? id : 'professional'
}

function intentLine(trace: { intent: ClassifiedIntent | null } | undefined): string {
  const intent = trace?.intent ?? null
  if (!intent) return 'Ω→noop Σ→none @ 0.00'
  const verb = intent.verb ?? 'noop'
  const target = intent.target?.type ?? 'none'
  const conf = typeof intent.confidence === 'number' ? intent.confidence.toFixed(2) : '0.00'
  return `Ω→${verb} Σ→${target} @ ${conf}`
}

/**
 * Pure composition. Each branch contains a unique literal phrase (regex-able
 * by A3's tests) so the 5 modes are visibly distinct from a source read alone.
 *
 * - professional → "Done. <summary>." (no emoji, period-terminated)
 * - fun          → "<aff>! <summary> 🎉 honestly, not bad."
 * - geek         → "<aff> · <summary> · [Ω→… Σ→… @ 0.xx]"
 * - teacher      → "<aff>! <summary>. Great progress ⭐ — small wins add up."
 * - coach        → "<aff>. <summary>. 🚀 Next move: keep pushing."
 */
export function renderPersonalityMessage(
  envelope: { summary?: string; patches?: readonly unknown[] },
  personalityId: PersonalityId | null | undefined,
  intentTrace?: { intent: ClassifiedIntent | null },
): string {
  const id = safeId(personalityId)
  const summaryRaw = (envelope?.summary ?? '').trim()
  const summary = summaryRaw || 'change applied'
  const affirmation = pickAffirmation(summary)
  const patchCount = envelope?.patches?.length ?? 0

  switch (id) {
    case 'professional':
      return `${affirmation}. ${summary}. (${patchCount} patch${patchCount === 1 ? '' : 'es'} applied.)`
    case 'fun':
      return `${affirmation}! ${summary} 🎉 honestly, not bad — ${patchCount} patch${patchCount === 1 ? '' : 'es'} and we are vibing.`
    case 'geek':
      return `${affirmation} · ${summary} · [${intentLine(intentTrace)}] · patches=${patchCount}`
    case 'teacher':
      return `${affirmation}! ${summary}. Great progress ⭐ — small wins add up. You just shipped ${patchCount} change${patchCount === 1 ? '' : 's'}.`
    case 'coach':
      return `${affirmation}. ${summary}. 🚀 Next move: keep pushing — ${patchCount} down, more to go.`
    default:
      // Unreachable per safeId, but keeps the switch exhaustive.
      return `${affirmation}. ${summary}.`
  }
}
