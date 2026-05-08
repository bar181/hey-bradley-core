# ADR-060: Content Generators (CONTENT_ATOM)

**Status:** Accepted
**Date:** 2026-04-28 (P31 Sprint D P3)
**Deciders:** Bradley Ross
**Phase:** P31

## Context

P29 (ADR-058) introduced `kind: 'patcher' | 'generator'` on `TemplateMeta` with `generator` reserved as a placeholder. P30 (ADR-059) shipped persistence. Sprint D P3 promotes the placeholder to a working POC: a 4th Crystal Atom (CONTENT_ATOM) governs LLM content generation when a template has `kind: 'generator'`.

Until P33 wires the real LLM call, `generateContent` is a deterministic rule-driven stub that produces Σ-shaped output. This is intentional — the contract surface needs to be testable across many phases before tokens get burned.

## Decision

### CONTENT_ATOM Crystal Atom

Verbatim AISP per `bar181/aisp-open-core ai_guide`:

```
Ω := generate constrained content text for a generator template field
Σ := { Content: { text:𝕊, tone:Tone, length:Length } }
   Tone ∈ { neutral, playful, authoritative, warm, bold }
   Length ∈ { short:60, medium:160, long:400 }  (max_chars per length)
Γ := { length-cap, tone-enum, forbidden-content scan, single-paragraph }
Λ := { confidence_threshold=0.7, cost_cap_reserve=0.85 }
Ε := { length verify, tone verify, content scan, confidence ∈ [0,1] }
```

### Σ-restriction rationale

CONTENT_ATOM's Σ is intentionally narrow (3 fields: `text`, `tone`, `length`). Compare:

| Atom | Σ scope | Why narrow |
|---|---|---|
| INTENT_ATOM (P26) | Verb + Target + params | classify user intent; ~6 verbs × 21 types = bounded |
| SELECTION_ATOM (P28) | templateId + confidence + rationale | enum-only output; smallest Σ |
| **CONTENT_ATOM** (P31) | **text + tone + length** | content needs free-text but bounded length + enum tone |
| PATCH_ATOM (P18, ADR-045) | JSON-Patch envelope | full JSON shape; widest Σ in the system |

Each atom's confidence threshold is calibrated to its Σ width. Wider Σ = higher hallucination surface = higher threshold.

### Γ R3 forbidden-content scan

Generated text MUST NOT contain:
- code blocks (```)
- markdown headings (`# Heading`)
- URLs (http/https)
- @mentions / hashtags
- multi-paragraph (`\n\n`)
- JSON-shaped (starts with `{` or `[`)

This is a **content** guard, not a security filter. XSS protection lives in the patch-validation layer (ADR-045 P18). The R3 scan exists because content-generator output is rendered as plain copy — markdown / URLs / JSON would either render literally (breaking the rendered look) or open a vector for the LLM to "escape" into a different output mode.

### `generateContent` deterministic stub

P31 ships a rule-driven implementation:
1. Extract quoted phrase as candidate copy (e.g., `'change headline to "Welcome home"'` → `Welcome home`)
2. Infer tone from cue words (`fun` → playful; `professional` → authoritative)
3. Infer length from cues (`short`/`punchy` → short; otherwise `short` default)
4. Run Ε verifications (V1-V4)
5. Return `GeneratedContent` or null

This is **intentionally not LLM-backed at P31**. The Σ surface and Γ rules are validated end-to-end in pure-unit tests; LLM wiring lands at P33 (AISPTranslationPanel + ChatInput bridge) using the same shape.

## Trade-offs accepted

- **Stub generator at P31.** Real LLM call deferred to P33 — cost-aware decision (no tokens spent during phase development). The Σ contract is identical between stub and LLM path.
- **Quote extraction is the only copy source.** Users must provide the new headline in quotes. P32+ relaxes this with multi-source extraction (e.g., first sentence, capitalized phrase). This keeps P31 deterministic.
- **Tone enum is closed at 5.** Future tones (`technical`, `urgent`, etc.) require ADR amendment. P32 may add brand-voice metadata which would expand this.

## Consequences

- (+) 4-atom AISP architecture now spans the full chat pipeline (INTENT → SELECTION → CONTENT → PATCH)
- (+) Generator templates are now a real concept; P32 multi-section pipeline can dispatch on `template.kind === 'generator'` confidently
- (+) P33 LLM wiring is "swap stub for adapter call" — minimal surface change
- (-) Adds 2 modules (~150 LOC); minimal complexity
- (-) Stub means no real content quality measurement until P33

## Cross-references

- ADR-045 (P18 system prompt; PATCH_ATOM)
- ADR-053 (P26; INTENT_ATOM)
- ADR-057 (P28; SELECTION_ATOM)
- ADR-058 (P29; Library API + `kind` enum)
- ADR-059 (P30; persistence)
- ADR-060 (this) → ADR-061 (P32 multi-section) → ADR-062 (P33 LLM wiring + UI bridge)

## Status as of P31 seal

- contentAtom.ts shipped (CONTENT_ATOM verbatim + ALLOWED_TONES + LENGTH_MAX_CHARS + isCleanContent) ✅
- contentGenerator.ts shipped (`generateContent` deterministic stub) ✅
- ADR-060 full Accepted ✅
- 8 PURE-UNIT tests covering Σ shape + Γ rules + tone inference + length cap + forbidden content ✅
- Build green; tsc clean; backward-compat with P15-P30 ✅
