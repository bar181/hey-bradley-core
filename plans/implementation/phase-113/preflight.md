# P113 — Quality Push: AISP Density + Personality + New Personas + Voice Extraction

> **Phase:** P113 · **Sprint:** QUALITY-PUSH · **Date:** 2026-05-04
> **Branch:** swarm/p113-quality-push
> **Predecessor:** P112 sealed at `4f00ff7` + eval audits

## Mandate

Close 4 quality gaps surfaced by the website-eval audit:
1. AISP δ density is Bronze (0.20-0.33) — bump to Silver+ via symbol enrichment in 2-3 high-traffic atoms
2. Chat-built blog quality (7.0) lags listen-built (9.5) — fix voice extraction in chat pipeline
3. 51 templates skew toward "safe" personas — need 3-5 opinionated/storytelling templates
4. No formal storytelling/personality library — add narrative presets + storytelling cards

## Out of scope

- Full Σ_512 symbol-table expansion (waits on ADR-C07 WASM crate)
- Live LLM smoke (CF#4 owner)
- Schema changes to MasterConfig

## Agents · 2 waves

### Wave 1 — 4 parallel disjoint-scope agents

#### A1 — AISP density bump (2-3 atoms)
**Owns:**
- `src/contexts/intelligence/prompts/system.ts` (PATCH_ATOM Σ block)
- `src/contexts/intelligence/aisp/intentAtom.ts` (INTENT_ATOM Σ/Γ blocks)
- `src/contexts/intelligence/aisp/processAtom.ts` (PROCESS_ATOM Σ/Γ blocks)
- Replace prose constraints with AISP symbols where natural (∀ ∈ ⊆ ≥ ≤ ⇒ etc)
- Verify density bump via `scoreAisp()` — target Silver tier (δ ≥ 0.40) on each
- Ambig must stay <0.02
**Cap:** ≤40 LOC delta total

#### A2 — Storytelling + personality templates
**Owns:**
- `src/data/storytelling/index.ts` (NEW; ≤120 LOC) — narrative preset library
- `src/data/storytelling/presets.ts` (NEW; ≤200 LOC) — 6-8 narrative archetypes
- Presets to ship:
  - "Don Miller story-brand" (hero/problem/guide/plan/call/stakes)
  - "Theron Miller hard-twist" (specific opening anecdote → unexpected pivot → earned observation)
  - "Founder-direct" (specific numbers, restrained-not-bro)
  - "Academic-rigor" (claim + evidence + counterargument + sources)
  - "Dry-humor narrator" (specific + dry + slightly over-precise)
  - "Beers-and-pizza casual" (paragraphs not headings, specific anecdotes, real talk)
  - "Investigative deep-dive" (lead with the question, follow the thread, name the gap)
  - "Contrarian-tech" (the consensus is X; here's why it's wrong)
- Each preset: name, voice attributes (3-5), opening pattern, body pattern, close pattern, sample first paragraph (~50 words)

#### A3 — New opinionated example sites (3-5)
**Owns:**
- `src/data/examples/podcaster-indie.json` (NEW; ≤350 LOC) — indie podcaster; specific show name; episodes; sponsor pitch; behind-the-scenes blog
- `src/data/examples/course-creator-tech.json` (NEW; ≤350 LOC) — tech course creator; specific curriculum; cohort details; testimonials with named students
- `src/data/examples/contrarian-blog.json` (NEW; ≤350 LOC) — opinion blog; opening contrarian thesis; archive of takes
- `src/data/examples/indie-author-fiction.json` (NEW; ≤350 LOC) — fiction author; books; voice samples
- `src/data/examples/research-newsletter.json` (NEW; ≤350 LOC) — academic-rigor research newsletter
- Each MUST include `voiceAttributes` field (3-5 specific attributes)
- Each MUST use one of A2's storytelling presets (cite preset name in comment)
- Each MUST have ≥6 sections + ≤12 sections + real opinionated copy (no Lorem)
- Wire all 5 into `src/data/examples/index.ts` EXAMPLE_SITES (51 → 56)
**Cap:** ~1750 LOC across 5 NEW JSONs + ~25 LOC for index.ts wire

#### A4 — Voice extraction in chat pipeline
**Owns:**
- `src/contexts/intelligence/chatPipeline.ts` (EDIT) — augment chat-mode submit() to extract `voiceAttributes` from input prompt
- New helper at `src/contexts/intelligence/voiceExtraction.ts` (NEW; ≤80 LOC) — pure module that takes prompt text and returns `{ voiceAttributes: string[], confidence: number }`
- Integration: when chat mode submit() generates a new project (no existing voiceAttributes), extract from prompt + populate `site.voiceAttributes`
- Cite at least 1 example: e.g. prompt "build a contrarian tech blog with sharp opinions" → `voiceAttributes: ['contrarian', 'sharp', 'opinionated']`
**Cap:** ≤30 LOC delta to chatPipeline.ts + ≤80 LOC for new helper

### Wave 2 — A5 closer

**Owns:**
- `docs/adr/ADR-141-quality-push-density-personality-personas.md` (NEW; ≤120 LOC; Status: Accepted)
- `tests/p113-quality-push.spec.ts` (NEW; ≥15 cases / ≤300 LOC)
  - Density bump verified per atom (uses scoreAisp())
  - Storytelling presets exported + count
  - 5 NEW example sites parse against MasterConfig + each has voiceAttributes
  - EXAMPLE_SITES.length increased 51 → 56
  - Voice extraction helper exists + invocable
  - chatPipeline integration site present
  - Atom-purity preserved
  - EOP triplet present
- `plans/implementation/phase-113/{session-log,retrospective}.md` (EOP)
- `CLAUDE.md` sync (P113 entry + ADR-141 ledger; Templates 51 → 56; Themes still 21; Storytelling presets 0 → 8)

## Hard rules

1. NO new dependencies
2. ADR-141 ≤120 LOC
3. tsc strict CLEAN both configs
4. Atom-purity preserved per ADR-134 (no fs/React/store imports in src/lib/ + src/data/storytelling/)
5. EOP triplet at phase root
6. Density target: Silver (≥0.40) on the 3 enriched atoms; Ambig stays <0.02
7. Each new example site has `voiceAttributes` (Zod-required would be schema change — out of scope; just ENSURE all 5 new sites set it)

## Acceptance gates

- 3 atoms hit Silver tier on scoreAisp (δ ≥ 0.40)
- 8 storytelling presets shipped
- 5 NEW example sites wired into EXAMPLE_SITES (56 total)
- Voice extraction helper exists + integrated
- ≥15 P113 tests GREEN
- Cumulative regression ≥306 GREEN (291 + 15)
- Both tsc strict configs CLEAN
