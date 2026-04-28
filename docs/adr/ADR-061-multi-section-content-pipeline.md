# ADR-061: Multi-section Content Pipeline (Section-aware Defaults)

**Status:** Accepted
**Date:** 2026-04-28 (P32 Sprint D P4)
**Deciders:** Bradley Ross
**Phase:** P32

## Context

P31 (ADR-060) shipped CONTENT_ATOM + a `generateContent` stub with caller-provided defaults (`defaultTone`, `defaultLength`). For real chat usage the caller (chatPipeline / 2-step pipeline) will know which **section** the user is targeting via INTENT_ATOM `target.type`. P32 layers section-aware defaults so hero copy is bold/short, blog body is neutral/medium, footer is warm/short, etc. — without expanding CONTENT_ATOM's Σ.

This is configuration, not a new atom. It belongs in a tunable defaults table that consumers can override per-request.

## Decision

### `contentDefaults.ts` table

19 section types × `{tone, length}` mapping covering Hey Bradley's section taxonomy (mirrors INTENT_ATOM `ALLOWED_TARGET_TYPES` for type alignment):

| Section | Tone | Length | Rationale |
|---|---|---|---|
| hero | bold | short | Lead/headline impact |
| cta / action | bold | short | Action-driving copy |
| features / pricing / value-props / numbers | authoritative | short | Trust + concision |
| blog / faq / text | neutral | medium | Informational paragraphs |
| testimonials / quotes / team | warm | medium | Human story |
| footer | warm | short | Friendly close |
| questions | playful | short | Engagement |
| gallery / columns / logos / menu | neutral | short | Layout-driven |

Unknown section type falls back to `{tone: 'neutral', length: 'short'}`.

### `generateContent` signature extension

`ContentRequest` gains optional `sectionType?: string | null`. Resolution order for tone/length:
1. Explicit cue word in text (e.g., "fun" → playful)
2. Caller-provided `defaultTone` / `defaultLength`
3. Section-defaults lookup
4. Hard fallback (neutral/short)

Cue words ALWAYS win because the user's voice in the request reflects intent. Section defaults are fallback floor.

### No Σ change

CONTENT_ATOM Σ is unchanged. Section type is a runtime hint, not part of the generated output. This is critical: we don't want the LLM (P33+) reasoning about section type when generating — the *defaults* shape what fields look like, but the output schema stays `{text, tone, length}`.

## Trade-offs accepted

- **Hand-curated 19-section table.** Not learned. P32+ may layer brand-voice metadata per project (post-MVP) for true tuning.
- **Coarse-grained tone choice.** "Bold" + "authoritative" are close; "playful" + "warm" overlap. 5 tones is the right granularity for now; finer-grained = ADR amendment.

## Consequences

- (+) Generator template at the chat-pipeline layer (P33) can pass `target.type` from INTENT_ATOM straight into `generateContent` without any inference logic
- (+) Section-aware defaults make demo content read believably even before brand voice is wired (post-MVP)
- (-) Adds 1 module (~80 LOC); minimal complexity
- (-) 19-section table will drift if Hey Bradley adds new section types — keep `INTENT_ATOM.ALLOWED_TARGET_TYPES` and `SECTION_CONTENT_DEFAULTS` in sync at every section addition

## Cross-references

- ADR-053 (P26; INTENT_ATOM ALLOWED_TARGET_TYPES — type-source of truth)
- ADR-060 (P31; CONTENT_ATOM Σ + generateContent)
- ADR-062 (P33; LLM wiring) — direct consumer

## Status as of P32 seal

- contentDefaults.ts shipped (19 section types) ✅
- generateContent extended with sectionType param + 4-tier resolution order ✅
- ADR-061 full Accepted ✅
- 8 PURE-UNIT tests covering section dispatch + cue precedence + unknown-type fallback ✅
- Build green; tsc clean; backward-compat with P31 (sectionType is optional) ✅
