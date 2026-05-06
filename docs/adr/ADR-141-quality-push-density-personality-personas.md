# ADR-141 — Quality Push (AISP Density + Storytelling Library + Opinionated Personas + Voice Extraction)

- **Status:** Accepted
- **Date:** 2026-05-06
- **Phase:** P113 / QUALITY-PUSH
- **Cross-refs (primary):** ADR-C07 (canonical Σ_512 scoring deferred to upstream Rust/WASM crate; this ADR's density bumps were validated against the P112 TS heuristic stopgap), ADR-126 (Comprehensive LLM Interaction Logging — voice-extraction events flow through the same writeLogEvent path), ADR-127 (Format Verification + cleanTranscript wire — listen-mode quality precedent that chat-mode now mirrors via voice extraction), ADR-134 (Atom-pure boundary — `src/data/storytelling/` + `src/contexts/intelligence/voiceExtraction.ts` placement preserves atom-folder reservation), ADR-140 (Gap Closure Stopgaps — `scoreAisp()` is the validator used to verify D1's Silver+ targets)

## Context

The P113 website-eval audit surfaced 4 quality gaps that block honest "production grade" claims at v2.0.0-RC1:

1. **AISP δ density was Bronze (or Reject) on 3 high-traffic atoms** despite the marketing claim "Crystal Atoms are Σ-formal." PATCH atom scored 0.188 (Reject), INTENT 0.262 (Bronze), PROCESS 0.266 (Bronze) — well below the Silver floor (≥0.40).
2. **Chat-built blog posts scored 7.0/10; listen-built scored 9.5/10.** The asymmetry came from listen mode running `cleanTranscript` (ADR-127) which produced disfluency-stripped voice signal — chat mode had no equivalent voice-extraction step, so generated content read as generic.
3. **51 example sites skewed "safe."** The corpus over-indexed on professional/wellness/agency archetypes; opinionated and storytelling voices (Don Miller, Theron Miller, contrarian, dry-humor) were absent.
4. **No reusable storytelling library.** Voice attributes lived only in per-site JSON; no shared archetype catalogue meant chat/listen pipelines could not reference a named preset when generating copy.

P113 ships best-effort closures for all 4 in one sprint (4 parallel disjoint-scope agents + closer).

## Decisions

### Decision 1 — AISP density bumped Silver+ in 3 high-traffic atoms (closes Bronze overstatement)

PATCH_ATOM (`src/contexts/intelligence/prompts/system.ts`), INTENT_ATOM (`src/contexts/intelligence/aisp/intentAtom.ts`), and PROCESS_ATOM (`src/contexts/intelligence/aisp/processAtom.ts`) had their Σ blocks enriched with AISP symbols (∀ ∈ ⊆ ⇒ ↦ ≤ ∧ ∨ etc.) replacing prose constraints where natural. Semantic equivalence was preserved — every prose rule has an AISP-symbol equivalent that any LLM parses identically. Verified scores against `scoreAisp()` from `src/lib/aisp-score/` (P112 / ADR-140 stopgap):

| Atom | Before | After | Tier | Ambig |
|------|--------|-------|------|-------|
| PATCH_ATOM | δ=0.188 (Reject) | **δ=0.549** | Silver | 0.01 |
| INTENT_ATOM | δ=0.262 (Bronze) | **δ=0.516** | Silver | 0.01 |
| PROCESS_ATOM | δ=0.266 (Bronze) | **δ=0.607** | **Gold** | 0.01 |

Total delta ≤40 LOC across the 3 files. Honest carry-forward: full Σ_512 scoring lands when ADR-C07 Wave 4 WASM crate ships (60-day upstream window); the TS heuristic in P112 is good enough to drive these bumps but undercounts symbols outside its 40-symbol subset.

### Decision 2 — 8 storytelling presets ship as voice library (`src/data/storytelling/`)

`src/data/storytelling/index.ts` (76 LOC) declares the `StorytellingPreset` interface and exports `STORYTELLING_PRESETS` plus two helpers: `getPresetByName(name)` and `getPresetForVoice(voiceAttributes[])`. `src/data/storytelling/presets.ts` (141 LOC) ships 8 archetypes covering the storytelling ground that the 51-site corpus missed: don-miller-storybrand / theron-miller-hard-twist / founder-direct / academic-rigor / dry-humor-narrator / beers-and-pizza-casual / investigative-deep-dive / contrarian-tech.

Each preset has a 7-field shape: `id` (kebab-case), `name`, `description`, `voiceAttributes` (3-5), `openingPattern`, `bodyPattern`, `closePattern`, `samplePassage` (~50 words real prose in voice — NOT stub text), `bestFor` (surface types).

Atom-purity preserved per ADR-134 — pure module; zero `from 'react'` AND zero `from 'fs'` imports.

### Decision 3 — 5 NEW opinionated example sites (51 → 56)

`src/data/examples/` adds podcaster-indie / course-creator-tech / contrarian-blog / indie-author-fiction / research-newsletter — each Zod-valid against MasterConfig, each carrying a `voiceAttributes` array (≥3 entries), each citing a Decision-2 storytelling preset by id at the top of the JSON. Real opinionated copy — named characters, dates, places, specific tools — no Lorem.

`EXAMPLE_SITES` in `src/data/examples/index.ts` extends to 56 entries (51 baseline + 5 P113 additions) preserving prior order.

### Decision 4 — Voice extraction in chat pipeline (closes chat-blog quality gap)

`src/contexts/intelligence/voiceExtraction.ts` (79 LOC) is a pure rules-based extractor exporting `extractVoice(text): VoiceExtractionResult` with 16 single-keyword cues (punchy/dry/warm/professional/founder/contrarian/...) and 6 bigram cues (`"founder voice"`, `"sharp opinions"`, `"plain spoken"`, ...). Confidence ramps 0.7-0.9 with cue count; result deduped and capped at 5 attributes. Atom-purity preserved per ADR-134 — sibling to `chatPipeline.ts`, NOT inside `aisp/`.

`chatPipeline.ts` integrates at line 412 with a +20 LOC wire: when `source==='chat'` AND the prompt is whole-site/initial (verb is `add` or target absent) AND current `site.voiceAttributes` is empty AND `extractVoice()` reports confidence > 0.5, the pipeline emits a JSON-Patch `replace /site/voiceAttributes` BEFORE downstream paths so template-matcher / decomp / LLM all see the populated voice context. Bridges the listen-vs-chat asymmetry (ADR-127 closed listen; this closes chat).

LLM-enriched extraction (richer than rules) remains CF#4 owner-required — needs BYOK key for live evaluation.

## Consequences

- **Closeable / closed:** D1 (atom density) + D2 (storytelling library) + D3 (opinionated sites) + D4 (voice extraction) close in one sprint without new dependencies.
- **Honest carry-forward:** Full Σ_512 scoring → ADR-C07 Wave 4. LLM-enriched voice extraction → CF#4 BYOK. Auto-routing presets to chat content generators → P114+ if signal warrants.
- **Backward-compat preserved:** `EXAMPLE_SITES` order unchanged for the 51 baseline entries; `chatPipeline.submit()` signature unchanged; voice patch only applies when current attrs are empty (existing sites untouched).

## Acceptance Gates

1. ADR-141 ≤120 LOC; Status: Accepted.
2. 3 atoms hit Silver tier (δ ≥ 0.40) on `scoreAisp()`; Ambig <0.02 each.
3. `src/data/storytelling/{index.ts,presets.ts}` exist; `STORYTELLING_PRESETS` exported with ≥8 entries; `getPresetByName` exported.
4. 5 NEW example sites exist + Zod-valid; each has `voiceAttributes` with ≥3 entries.
5. `EXAMPLE_SITES` count ≥ 56.
6. `src/contexts/intelligence/voiceExtraction.ts` exists; `extractVoice` exported.
7. `chatPipeline.ts` contains ≥1 `extractVoice(` call.
8. Atom-purity: storytelling/* + voiceExtraction.ts have zero `from 'react'` AND zero `from 'fs'` imports.
9. `tests/p113-quality-push.spec.ts` exists with ≥15 cases.
10. CLAUDE.md sync: P113 entry; ADR-141 ledger; ADR count 131 → 132; cumulative regression ≥306 GREEN.
