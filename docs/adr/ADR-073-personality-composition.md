# ADR-073: Personality Engine + Composition (No Σ Widening)

**Status:** Accepted
**Date:** 2026-04-29 (P50 Sprint J Wave 1)
**Deciders:** Bradley Ross
**Phase:** P50

## Context

Sprint J's wow-factor mandate ships 5 chat personalities (`professional | fun |
geek | teacher | coach`) that visibly change voice mid-build. Sprint H closed
at avg 89.7 and Sprint I sealed at 91/100 — the bar for J is composite ≥93,
Grandma ≥84.

The architectural fork is documented in
`plans/implementation/sprint-j-personality/01-audit.md` §3:

- **Option A — Σ widening.** Add `message` + `personalityId` to `PatchEnvelopeSchema`.
  Single LLM call returns all three fields. Richer / generative personality, but
  every fixture needs a `message`, broader Σ = more hallucination surface, and
  it directly violates the Σ-restriction discipline that ADR-045/053/057/060/064/067/068
  all enforce.
- **Option B — Composition (LOCKED).** PATCH_ATOM Σ stays exactly
  `{ patches, summary? }`. A pure-rule `personalityEngine.render(envelope, personalityId,
  intentTrace) → string` composes the chat-bubble message AFTER patches resolve.

Per owner sign-off 2026-04-29 (`03-sprint-j-locked.md` D1), Option B is locked.

## Decision

### Composition pattern

`personalityEngine.render(envelope, personalityId, intentTrace) → string` runs
AFTER PATCH_ATOM resolves and AFTER the JSON envelope is committed. It is a pure
function over already-validated data — no LLM call, no Σ widening, no new
fixture surface.

### Closed enum + profile shape

`PERSONALITY_IDS = ['professional','fun','geek','teacher','coach'] as const` is
the single source of truth. `PERSONALITY_PROFILES: Record<PersonalityId, Profile>`
exposes `{ label, description, emoji, tonePrompt, suggestionStyle, aispVisible }`.
Adding a 6th personality requires editing both the enum and the record (TypeScript
exhaustiveness keeps them in sync).

### kv persistence

`kv['personality_id']` stores the user's choice. NOT sensitive — ships in spec
exports per ADR-067 redaction discipline (BYOK keys / brand_context_text remain
the only redacted surfaces). Default on read-miss: `'professional'`.

### System-prompt injection point

`buildSystemPrompt()` is extended with an optional `personality?: PersonalityId`
field. The injected block lands AFTER the brand-context block and BEFORE the
`OUTPUT_RULE`, and uses `PERSONALITY_PROFILES[id].tonePrompt` only — NOT the full
record (label/emoji/aispVisible are UI concerns, not LLM-context concerns).

### Geek mode AISP visibility

`PERSONALITY_PROFILES.geek.aispVisible === true` is the single drive for later UI
overlays (chat-bubble Σ chip, AISPTranslationPanel auto-pin in EXPERT). The other
4 personalities have `aispVisible: false`. P51 (PersonalityPicker UI) and the
EXPERT trace pane both gate on this flag.

## Trade-offs

- **Composition vs Σ widening.** Composition preserves the "we never widen Σ"
  thesis statement that has held across 7 ADRs (045/053/057/060/064/067/068).
  Cost: personality messages feel more template-driven than generative.
- **Pure-rule vs LLM-driven.** Pure-rule is $0 per render, zero hallucination
  surface, deterministic for tests. Mitigation for canned-feel: per-personality
  template variety + a deterministic affirmation prefix derived from `summary[0]`
  (mirrors P48 `improvementSuggester` which proved this pattern at $0).
- **Personality vs CONTENT_ATOM tone (ADR-060).** Distinct concerns, kept
  distinct. Personality = chat-bubble *voice* (how Bradley talks back).
  CONTENT_ATOM tone = generated *content* style (what lands in `<h1>` / `<p>`).
  No unification — owner D6.

## Consequences

- (+) 5 distinct chat-bubble messages from one identical envelope; toggleable
  mid-chat; screenshot-worthy demo line preserved.
- (+) AgentProxy fixtures unchanged. `example_prompts.expected_envelope_json`
  stays single-envelope-per-prompt. Zero migration.
- (+) PATCH_ATOM Σ inviolable contract preserved across
  ADR-045/053/057/060/064/067/068/073.
- (+) Geek mode unlocks AISP transparency via `aispVisible` flag — no separate
  toggle, no separate setting, no duplicated state.
- (-) Personality message is bounded by template expressiveness; advanced
  per-user calibration is deferred (out-of-scope per audit §3).
- (-) Adds one new context (`personality/`) under `intelligence/`. Acceptable
  per DDD bounded-context discipline (ADR-054).

## Cross-references

- **ADR-040** — kv repository (the persistence seam this ADR plugs into).
- **ADR-045** — PATCH_ATOM (Σ inviolable; this ADR's defense premise).
- **ADR-053** — INTENT_ATOM (intentTrace consumed by `render()` for geek overlays).
- **ADR-060** — CONTENT_ATOM tone (distinct from personality voice; D6).
- **ADR-064** — ASSUMPTIONS_ATOM (Sprint E; 5-atom AISP architecture upstream).
- **ADR-067 / ADR-068 / ADR-069** — Sprint H (export-strip discipline + reference
  management; redactKeyShapes precedent for share-spec).
- **ADR-070 / ADR-071 / ADR-072** — Sprint I (a11y + builder UX + Tailwind-only
  mobile precedent for P53).

## Status as of P50 seal

- A1 `personalityEngine.ts` + kv getter/setter + system-prompt injection: TBD.
- A2 `chatPipeline` defensive `render()` + `ChatMessage.personalityMessage` +
  ChatInput surface: TBD.
- A3 ADR-073 (this file) + `tests/p50-personality-engine.spec.ts` (~15 cases): shipped.
- Composite Sprint J P50 score: TBD (will be filled at P50 seal commit).
