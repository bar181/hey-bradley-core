# Phase 26 Retrospective — Sprint C Phase 1: AISP Instruction Layer

> **Final composite:** 89/100 (+1 vs P25 88) — first composite increase since P22 deep-review
> **Sealed:** 2026-04-27 (~35m actual; ~3.5× velocity)

## What worked

- **Crystal Atom AS code constant.** `INTENT_ATOM` is the verbatim AISP atom exported as a TypeScript string. Tests assert it contains Ω/Σ/Γ/Λ/Ε directly. Capstone reviewer can inspect it from `src/contexts/intelligence/aisp/intentAtom.ts` AND see the same atom rendered side-by-side with human text on the public `/aisp` page (P22 AISPDualView).
- **Rule-based classifier conforming to AISP shape contract.** Σ + Γ enforced at runtime via TypeScript enum membership (verb literal type + ALLOWED_TARGET_TYPES const). Ε V1+V2 verified by the type system at compile time.
- **Confidence threshold elevation (0.85 vs template router 0.8).** AISP wins when it's confident; template router takes over when AISP isn't sure. Each layer has its precedence boundary.
- **Pure-unit testing pattern from P23-P25 applied directly.** 9/9 first-pass GREEN. No browser overhead.
- **Construct-canonical-text on AISP win** lets the existing P23/P24 router consume AISP output without API changes. Backward compat is one-line: when AISP fires, build the string the router already understands.

## What to keep

- **AISP-as-data pattern.** Atom is a const string; classifier is rule-table; both are inspectable + testable.
- **Per-layer confidence thresholds.** AISP 0.85 / templates 0.8 / canned-fallback 0. Each layer earns precedence by clearing its bar.
- **Verb-rule pairs as `[regex, verb, confidence]` triples.** Adding new verb support = appending to the table.

## What to drop

- (none)

## What to reframe

- **The "construct canonical text from AISP win"** approach is a serialization step. Sprint C P27 (LLM-driven AISP classifier) MAY benefit from skipping the round-trip and directly emitting the patch envelope. **Reframe at P27 kickoff**: should AISP's structured output drive a direct patch builder, OR should it always serialize to canonical text for the router? Decide per-verb.

## Velocity actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| AISP module | 1h | ~15m | 4× |
| Wiring | 15m | ~5m | 3× |
| ADR-053 + 9 tests | 30m | ~10m | 3× |
| Retro + STATE + seal | 15m | ~5m | 3× |
| **Total** | 2h | **~35m** | **~3.5×** |

## Sprint trajectory (P23-P26 so far)

| Phase | Title | Composite | Effort | Velocity |
|---|---|---:|---:|---:|
| P23 | Sprint B P1 — Templates | 88 | 80m | 4× |
| P24 | Sprint B P2 — Scoping | 88 | 35m | 3.5× |
| P25 | Sprint B P3 — Intent translation | 88 | 25m | 3.5× |
| P26 | Sprint C P1 — AISP atom + classifier | **89** | 35m | 3.5× |

Composite climbed for the first time since P22 deep-review. Sprint C is delivering the capstone-thesis demonstration.

## Observations

- **Sprint B + Sprint C P1 are compounding.** P23 templates short-circuit cheap intents. P24 scoping makes templates work multi-instance. P25 intent translation makes them handle messy English. P26 AISP wraps the whole thing in the math-first symbolic vocabulary that proves the thesis.
- **Each phase introduces ONE module + ONE ADR + 5-9 unit tests.** Sprint shape is now a habit. Sprint C P27/P28 should follow the same skeleton.
- **Cost discipline holds.** AISP rule-based classifier adds zero LLM calls at P26. The thesis "AISP is what LLMs understand natively" gets demonstrated at P27 when the LLM-driven classification path is added.

## Next phase

**P27 — Sprint C Phase 2 (AISP Intent Pipeline).** Will add LLM-driven AISP classification (using the SAME Crystal Atom from P26) when rule-based confidence is below threshold. The LLM call's system prompt embeds `INTENT_ATOM` directly — proves the "LLMs understand AISP natively" claim.

Phase 26 sealed at composite **89/100**. Sprint C continues at P27.
