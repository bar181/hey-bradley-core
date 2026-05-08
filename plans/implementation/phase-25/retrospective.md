# Phase 25 Retrospective — Sprint B Phase 3: Intent Translation

> **Final composite:** 88/100 (held vs P24)
> **Sealed:** 2026-04-27 (~25m actual; ~3.5× velocity)
> **Sprint B (P23+P24+P25) COMPLETE.**

## What worked

- **Pure-unit tests for the rule-based module** (lesson from P23 → P24 → P25 pattern). 7/7 green first-pass. No browser; no dynamic-import race.
- **Idempotency-by-design.** Canonical input passes through unchanged. No double-processing risk; no order-dependency between intent layer and template layer.
- **Ordinal-to-scope-token bridge.** "second blog post" rewriting to "/blog-2" lets the existing P24 scope resolver do all the heavy lifting. Two phases compose cleanly.
- **Dynamic-import + graceful-fallback** still applies — failed intent module load = no rewrite (text passes to template router unchanged).
- **Velocity peak.** Sprint B Phase 3 in 25 minutes. The P23→P24→P25 pattern of "module + wiring + ADR + 5-7 unit tests + retro" is now muscle memory.

## What to keep

- **Rule-table-as-data** (`VERB_REWRITES`, `TYPE_NORMALIZE`, `ORDINALS`). Adding new rules means appending to a table, not changing logic. Sprint C AISP classifier can ingest these tables as training/grounding hints.
- **Rationale string.** `'"input" → "output"'` is human-readable AND machine-parseable (split on " → "). Both UI surfacing AND analytics get value.
- **Sprint completion ritual.** Every Sprint phase (B P1, B P2, B P3) has the same shape: module + wiring + ADR + tests + retro. Pattern is now reusable for Sprint C.

## What to drop

- (none — clean run)

## What to reframe

- **The "make/set the headline say X" rewrite** uses a positional pattern that's brittle. If the user says "make the title say X", it doesn't match (no rule for "title"). **Reframe** as a Sprint C concern: AISP intent classifier handles synonyms learned from llm_logs analytics rather than hand-coded regex.

## Velocity actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| Intent module | 30m | ~10m | 3× |
| Wiring | 15m | ~3m | 5× |
| ADR-052 + 7 tests | 30m | ~7m | 4× |
| Retro + STATE + seal | 15m | ~5m | 3× |
| **Total** | 1.5h | **~25m** | **~3.5×** |

## Sprint B summary (3 phases)

| Phase | Title | Composite | Effort | Commit |
|---|---|---:|---:|---|
| P23 | Simple Chat (templates + LLM short-circuit) | 88 | ~80m | f38d324 |
| P24 | Section Targeting (/type-N scoping) | 88 | ~35m | e336717 |
| P25 | Intent Translation (verb/type/ordinal rewrites) | 88 | ~25m | (this seal) |
| **Sprint B total** | | **stable 88** | **~140m** | |

Original Sprint B estimate: 4-6 days × 3 phases = ~96-144 hours. Actual: ~2.3 hours. **~50× velocity.**

## Observations

- **Sprint B is the proof of the cost-discipline thesis.** Templates short-circuit cheap intents (P23). Scoping makes templates work on multi-instance configs (P24). Intent translation makes templates handle messy inputs (P25). Each phase increases the LLM-skip rate; cumulative effect is "most common chats cost $0."
- **Pure-unit testing is now the default for non-React modules.** Time saved per phase: ~10-20 minutes (vs Playwright integration tests). Apply to Sprint C AISP intent classifier.
- **The Template registry is the canonical surface** for all Sprint B-C work. P23-P25 all converge on it; Sprint C P26 will consume the same registry with AISP-driven probabilistic match scores instead of regex+threshold.

## Next phase

**P26 — Sprint C Phase 1 (AISP Instruction Layer).** Sprint B closes; Sprint C opens. Will introduce AISP Crystal Atom intent classifier as a probabilistic alternative to the rule-based intent translator (P25). Both can coexist; AISP layer takes precedence when confident, rule-based serves as fallback.

Phase 25 sealed at composite **88/100**. **Sprint B P23-P25 COMPLETE.**
