# Phase 25 — Preflight 00 Summary

> **Phase title:** Sprint B Phase 3 — Intent Translation (messy input → structured to-do)
> **Status:** PREFLIGHT (activates post-P24 seal)
> **Successor of:** P24 (Sprint B P2 — Section Targeting) sealed at composite 88/100
> **Successor:** P26 (Sprint C P1 — AISP instruction layer)
> **Source:** `phase-22/wave-1/A2-sprint-plan-review.md` §B + ADR-051 stub (intent translator)

## North Star

> **Messy user input ("get rid of the second blog post") becomes a structured Intent ({ verb: 'hide', target: { type: 'blog', index: 1 } }) BEFORE the template router sees it.**

## Scope IN

- **Intent classifier middleware** that runs BEFORE `tryMatchTemplate()` in `chatPipeline.submit()`
- **Verb normalization**: `get rid of` / `remove` / `delete` / `take out` → `hide`; `set` / `update` / `make it say` → `change`
- **Target inference**: "the second blog post" → `{ type: 'blog', index: 1 }`; "the footer" → `{ type: 'footer', index: null }`
- **Pre-translation rewrite**: messy input → canonical text + scope token, e.g. `get rid of the second blog post` → `hide /blog-2`
- Preserve raw user text in chat history; show translation step transparently
- **ADR-052 (Intent Translator)** — full author (replaces P21 stub for ADR-051; ADR-051 was Section Targeting; this is a separate ADR)
- **+5 Playwright cases** — verb normalization + target inference + ordinal parsing + idempotent (no-op when input is already canonical) + LLM fallthrough on unknown intent

## Scope OUT

- Multi-intent ("hide the hero AND change the footer headline") — Sprint C work
- AISP-driven intent (Sprint C P26 — supersedes this rule-based translator with Crystal Atom intent layer)
- LLM-call cost optimization beyond what templates+scoping already do

## Effort estimate

- ~30m intent module (verb-normalize + target-infer + rewrite)
- ~15m chatPipeline wiring
- ~30m ADR-052 + 5 tests
- ~15m retro + seal
- **Total: ~1.5h** (vs original 4-6 day estimate)

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `src/contexts/intelligence/templates/intent.ts` | NEW | `translateIntent(text)` → `{ canonicalText: string; rationale: string }` |
| `src/contexts/intelligence/chatPipeline.ts` | EDIT | call `translateIntent` BEFORE `tryMatchTemplate` |
| `docs/adr/ADR-052-intent-translator.md` | EDIT | stub → full Accepted |
| `tests/p25-intent-translator.spec.ts` | NEW | 5 pure-unit cases |

## DoD

- [ ] `translateIntent(text)` rewrites 4+ verb synonyms + 4+ target ordinals
- [ ] Idempotent: canonical input passes through unchanged
- [ ] `chatPipeline.submit()` runs intent translation BEFORE template router
- [ ] Translation rationale surfaced in summary (e.g. "_(intent: hide /blog-2)_") for transparency
- [ ] +5 pure-unit Playwright cases green (no flake)
- [ ] ADR-052 full Accepted
- [ ] Build green; tsc clean; P23+P24 regression green
- [ ] Retro + STATE update + Sprint C P26 preflight scaffold

## Composite target

- Grandma 76+ (held; UX surface unchanged)
- Framer 87+ (held; better LLM-skip rate)
- Capstone 92+ (held / +1 if intent translator demonstrates AISP precursor cleanly)
- **Target: 88/100**

## Carryforward into P25 (unchanged from P24)

- C04 ListenTab split
- C17 Zod helper
- C15 Lock import path
- C16 Migration FK
- C11/C12 cosmetic (P22 carries)
- Vercel deploy (owner-triggered)

## Cross-references

- P24 retrospective: `phase-24/retrospective.md`
- ADR-050 (Template-First Chat — sealed P23)
- ADR-051 (Section Targeting Syntax — sealed P24)
- ADR-052 (Intent Translator — stub from P21; full at P25)
- Sprint C P26 will REPLACE this rule-based translator with an AISP Crystal Atom intent layer

---

**Phase 25 activates immediately on owner greenlight.** ADR-052 stub already in place.
